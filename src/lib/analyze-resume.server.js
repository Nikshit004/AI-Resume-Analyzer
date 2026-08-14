/**
 * src/lib/analyze-resume.server.js
 *
 * SERVER-ONLY. Never import this from client code — it uses OPENROUTER_API_KEY.
 * (Your ResumeUpload.jsx copy says "everything stays private to your browser" —
 * that's still true for the raw FILE, which is parsed client-side in
 * resume-parser.js. Only the extracted TEXT is sent here for analysis, since
 * the OpenRouter key must never be exposed to the browser.)
 *
 * This wraps createServerFn from TanStack Start. Your project already has
 * routes/server.ts and services/api.js — if those use a different pattern
 * (e.g. a file API route instead of a server function), share them and I'll
 * adapt this to match exactly instead of adding a parallel pattern.
 *
 * Install: bun add zod
 * Env:     OPENROUTER_API_KEY=sk-or-... in your .env
 */

import { createServerFn } from "@tanstack/react-start"; // adjust import if your TanStack Start version differs
import { resumeAnalysisSchema, scoreToGrade } from "./resume-analysis-schema";
import { buildResumeAnalysisMessages } from "./resume-analysis-prompt";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Pick a model with strong instruction-following + JSON reliability.
// Swap the id if you have a preferred/cheaper model on OpenRouter.
const MODEL = "anthropic/claude-sonnet-4.6";

const JSON_SCHEMA = {
  name: "resume_analysis",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "atsScore",
      "grade",
      "jobMatch",
      "jobMatchExplanation",
      "summary",
      "metrics",
      "matchedSkills",
      "missingKeywords",
      "suggestions",
    ],
    properties: {
      atsScore: { type: "integer", minimum: 0, maximum: 100 },
      grade: {
        type: "string",
        enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"],
      },
      jobMatch: { type: "integer", minimum: 0, maximum: 100 },
      jobMatchExplanation: { type: "string" },
      summary: { type: "string" },
      metrics: {
        type: "array",
        minItems: 4,
        maxItems: 4,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["label", "value"],
          properties: {
            label: { type: "string" },
            value: { type: "integer", minimum: 0, maximum: 100 },
          },
        },
      },
      matchedSkills: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["name", "level"],
          properties: {
            name: { type: "string" },
            level: { type: "integer", minimum: 0, maximum: 100 },
          },
        },
      },
      missingKeywords: { type: "array", items: { type: "string" } },
      suggestions: {
        type: "array",
        minItems: 3,
        maxItems: 10,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["title", "detail", "priority"],
          properties: {
            title: { type: "string" },
            detail: { type: "string" },
            priority: { type: "string", enum: ["high", "medium", "low"] },
          },
        },
      },
    },
  },
};

async function callOpenRouter(messages) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is not set on the server. Add it to your .env."
    );
  }

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      // Optional but recommended by OpenRouter for analytics/rate-limit tiers:
      "HTTP-Referer": process.env.SITE_URL || "http://localhost:8080",
      "X-Title": "ResumeAI",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.2, // low temperature = consistent scoring across runs
      max_tokens: 2000,
      response_format: { type: "json_schema", json_schema: JSON_SCHEMA },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenRouter request failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenRouter returned no content.");
  return content;
}

function safeParseJson(raw) {
  // Some models still wrap JSON in ```json fences despite instructions — strip defensively.
  const cleaned = raw.trim().replace(/^```json\s*/i, "").replace(/```$/, "");
  return JSON.parse(cleaned);
}

/**
 * Analyzes resume text (+ optional job description) and returns validated,
 * UI-ready analysis JSON. Retries once with a stricter repair prompt if the
 * first response fails schema validation.
 */
export const analyzeResume = createServerFn({ method: "POST" })
  .validator((input) => {
    if (!input?.resumeText || typeof input.resumeText !== "string") {
      throw new Error("resumeText is required.");
    }
    if (input.resumeText.trim().length < 50) {
      throw new Error("resumeText is too short to analyze.");
    }
    return {
      resumeText: input.resumeText,
      jobDescription: input.jobDescription || "",
    };
  })
  .handler(async ({ data }) => {
    const messages = buildResumeAnalysisMessages(data);

    let lastError;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const raw = await callOpenRouter(
          attempt === 0
            ? messages
            : [
                ...messages,
                {
                  role: "user",
                  content:
                    "Your previous response did not match the required JSON schema exactly. Return ONLY a valid JSON object matching the schema, with no extra fields, no missing fields, and correct types.",
                },
              ]
        );
        const parsed = safeParseJson(raw);
        const result = resumeAnalysisSchema.parse(parsed);

        // Recompute grade server-side so it always matches atsScore exactly,
        // even if the model's own letter grade drifted slightly.
        result.grade = scoreToGrade(result.atsScore);

        return result;
      } catch (err) {
        lastError = err;
      }
    }

    throw new Error(
      `Resume analysis failed after retry: ${lastError?.message || lastError}`
    );
  });