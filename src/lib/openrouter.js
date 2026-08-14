// src/lib/openrouter.js

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function generateAIResponse({ prompt, systemPrompt, model = "google/gemini-2.0-flash-001" }) {
  if (!OPENROUTER_API_KEY) {
    throw new Error("Missing OpenRouter API Key in .env file.");
  }

  const messages = [];

  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }

  messages.push({ role: "user", content: prompt });

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": window.location.origin, // Optional: for OpenRouter analytics
      "X-Title": "Job Pros AI", // Optional: your project name
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model:"openai/gpt-4o-mini", // You can also try "openai/gpt-4o-mini" or "meta-llama/llama-3.1-8b-instruct:free"
      messages: messages,
      temperature: 0,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Failed to fetch response from OpenRouter");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}