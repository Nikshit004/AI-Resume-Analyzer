/**
 * src/lib/resume-analysis-schema.js
 *
 * Single source of truth for the analysis shape. Matches, field-for-field,
 * what ScoreCard, SkillsChart, Suggestions, and AnalysisCard already expect:
 *   - ScoreCard:      atsScore, grade, jobMatch, metrics[]
 *   - SkillsChart:    matchedSkills[], missingKeywords[]
 *   - Suggestions:    suggestions[] (title, detail, priority)
 *   - AnalysisCard:   summary, jobMatch, jobMatchExplanation
 *
 * Used both to validate the AI's JSON output (reject/retry on bad shape)
 * and, converted to JSON Schema, to constrain the AI's output directly.
 *
 * Install: bun add zod
 */

import { z } from "zod";

export const resumeAnalysisSchema = z.object({
  atsScore: z.number().int().min(0).max(100),
  grade: z.enum(["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"]),

  jobMatch: z.number().int().min(0).max(100),
  jobMatchExplanation: z.string().min(20).max(500),

  summary: z.string().min(20).max(600),

  // Exactly 4 to match ScoreCard's 2x2 metric grid.
  metrics: z
    .array(
      z.object({
        label: z.string().min(1).max(40),
        value: z.number().int().min(0).max(100),
      })
    )
    .length(4),

  matchedSkills: z
    .array(
      z.object({
        name: z.string().min(1).max(60),
        level: z.number().int().min(0).max(100),
      })
    )
    .max(20),

  missingKeywords: z.array(z.string().min(1).max(40)).max(20),

  suggestions: z
    .array(
      z.object({
        title: z.string().min(1).max(90),
        detail: z.string().min(10).max(400),
        priority: z.enum(["high", "medium", "low"]),
      })
    )
    .min(3)
    .max(10),
});

/** Derive the score → letter grade the same way on client and server. */
export function scoreToGrade(score) {
  if (score >= 97) return "A+";
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 60) return "D";
  return "F";
}