const axios = require("axios");

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

// ======================================================
// Normalize Gemini model name
// ======================================================

function normalizeModelName(model) {
  let selectedModel =
    model ||
    process.env.GEMINI_MODEL ||
    "gemini-3.5-flash-lite";

  selectedModel = String(selectedModel).trim();

  // Remove accidental API path prefixes
  selectedModel = selectedModel.replace(/^models\//, "");

  return selectedModel;
}

// ======================================================
// Normalize function arguments
//
// Supported:
//
// generateGeminiJSON(prompt)
//
// generateGeminiJSON(prompt, schema)
//
// generateGeminiJSON(prompt, schema, options)
//
// generateGeminiJSON({
//   prompt,
//   model,
//   responseSchema,
//   temperature,
//   maxOutputTokens
// })
// ======================================================

function normalizeArguments(
  input,
  secondArgument,
  thirdArgument
) {
  // ====================================================
  // Object-style call
  // ====================================================

  if (
    input &&
    typeof input === "object" &&
    !Array.isArray(input)
  ) {
    const prompt =
      typeof input.prompt === "string"
        ? input.prompt
        : typeof input.userPrompt === "string"
        ? input.userPrompt
        : "";

    return {
      prompt: prompt.trim(),

      model:
        typeof input.model === "string"
          ? input.model
          : undefined,

      responseSchema:
        input.responseSchema ||
        input.schema ||
        null,

      options:
        input.options &&
        typeof input.options === "object"
          ? input.options
          : {},
    };
  }

  // ====================================================
  // String + schema + options
  //
  // generateGeminiJSON(
  //   prompt,
  //   schema,
  //   options
  // )
  // ====================================================

  if (
    typeof input === "string" &&
    secondArgument &&
    typeof secondArgument === "object"
  ) {
    return {
      prompt: input.trim(),

      model:
        thirdArgument &&
        typeof thirdArgument === "object" &&
        typeof thirdArgument.model === "string"
          ? thirdArgument.model
          : undefined,

      responseSchema: secondArgument,

      options:
        thirdArgument &&
        typeof thirdArgument === "object"
          ? thirdArgument
          : {},
    };
  }

  // ====================================================
  // String + model
  //
  // generateGeminiJSON(
  //   prompt,
  //   "gemini-model"
  // )
  // ====================================================

  return {
    prompt:
      typeof input === "string"
        ? input.trim()
        : "",

    model:
      typeof secondArgument === "string"
        ? secondArgument
        : undefined,

    responseSchema: null,

    options:
      thirdArgument &&
      typeof thirdArgument === "object"
        ? thirdArgument
        : {},
  };
}

// ======================================================
// Generate Gemini text response
// ======================================================

async function generateGeminiResponse(
  input,
  secondArgument,
  thirdArgument
) {
  const {
    prompt,
    model,
    responseSchema,
    options = {},
  } = normalizeArguments(
    input,
    secondArgument,
    thirdArgument
  );

  // ====================================================
  // API KEY
  // ====================================================

  const apiKey =
    process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured in server/.env"
    );
  }

  // ====================================================
  // Prompt validation
  // ====================================================

  if (
    typeof prompt !== "string" ||
    !prompt.trim()
  ) {
    throw new Error(
      "Gemini prompt is required and must be a string"
    );
  }

  // ====================================================
  // Model
  // ====================================================

  const selectedModel =
    normalizeModelName(model);

  console.log(
    "🤖 Sending request to Google Gemini..."
  );

  console.log(
    "🧠 Model:",
    selectedModel
  );

  console.log(
    "📝 Prompt length:",
    prompt.length,
    "characters"
  );

  // ====================================================
  // Generation settings
  // ====================================================

  const temperature =
    typeof options.temperature === "number"
      ? options.temperature
      : 0.2;

  const maxOutputTokens =
    typeof options.maxOutputTokens === "number"
      ? options.maxOutputTokens
      : 4000;

  // ====================================================
  // Request body
  // ====================================================

  const requestBody = {
    contents: [
      {
        role: "user",

        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],

    generationConfig: {
      temperature,
      maxOutputTokens,
    },
  };

  // ====================================================
  // Structured JSON response
  // ====================================================

  if (responseSchema) {
    requestBody.generationConfig.responseMimeType =
      "application/json";

    requestBody.generationConfig.responseSchema =
      responseSchema;
  }

  // ====================================================
  // Debug
  // ====================================================

  console.log(
    "📡 Calling Gemini model:",
    selectedModel
  );

  // ====================================================
  // Send request
  // ====================================================

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}/${selectedModel}:generateContent`,
      requestBody,
      {
        headers: {
          "Content-Type":
            "application/json",

          "x-goog-api-key":
            apiKey,
        },

        timeout: 120000,
      }
    );

    console.log(
      "✅ Gemini response received"
    );

    // ==================================================
    // Candidates
    // ==================================================

    const candidates =
      response?.data?.candidates || [];

    if (!candidates.length) {
      console.error(
        "❌ Gemini returned no candidates"
      );

      console.error(
        JSON.stringify(
          response?.data,
          null,
          2
        )
      );

      throw new Error(
        "Gemini returned no response candidates"
      );
    }

    // ==================================================
    // Extract text
    // ==================================================

    const parts =
      candidates[0]?.content?.parts || [];

    const text = parts
      .map(
        (part) =>
          part?.text || ""
      )
      .join("")
      .trim();

    if (!text) {
      console.error(
        "❌ Gemini returned empty text"
      );

      console.error(
        JSON.stringify(
          response?.data,
          null,
          2
        )
      );

      throw new Error(
        "Gemini returned an empty response"
      );
    }

    return text;
  } catch (error) {
    console.error(
      "❌ Gemini API Error:"
    );

    console.error(
      error?.response?.data ||
        error?.message ||
        error
    );

    throw error;
  }
}

// ======================================================
// Generate Gemini JSON
// ======================================================

async function generateGeminiJSON(
  input,
  secondArgument,
  thirdArgument
) {
  const text =
    await generateGeminiResponse(
      input,
      secondArgument,
      thirdArgument
    );

  // ====================================================
  // Clean response
  // ====================================================

  let cleanedText =
    String(text).trim();

  // Remove markdown JSON fences
  cleanedText =
    cleanedText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

  // ====================================================
  // Extract JSON object
  // ====================================================

  const firstBrace =
    cleanedText.indexOf("{");

  const lastBrace =
    cleanedText.lastIndexOf("}");

  if (
    firstBrace !== -1 &&
    lastBrace !== -1 &&
    lastBrace > firstBrace
  ) {
    cleanedText =
      cleanedText.substring(
        firstBrace,
        lastBrace + 1
      );
  }

  // ====================================================
  // Parse JSON
  // ====================================================

  try {
    return JSON.parse(
      cleanedText
    );
  } catch (error) {
    console.error(
      "❌ Gemini returned invalid JSON:"
    );

    console.error(
      cleanedText
    );

    throw new Error(
      "Gemini returned invalid JSON"
    );
  }
}

// ======================================================
// Exports
// ======================================================

module.exports = {
  generateGeminiResponse,
  generateGeminiJSON,
};