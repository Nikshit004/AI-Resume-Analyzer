import axios from "axios";

// Backend base URL
const baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const api = axios.create({
  baseURL,
  timeout: 120000,
});

// Analyze a resume against a job description
export async function analyzeResume({ file, jobDescription }) {
  const form = new FormData();

  form.append("resume", file);
  form.append("jobDescription", jobDescription || "");

  console.log("========================================");
  console.log("🚀 CALLING REAL AI ANALYSIS API");
  console.log("📍 API:", `${baseURL}/analyze`);
  console.log("📄 Resume:", file?.name);
  console.log("========================================");

  try {
    const { data } = await api.post("/analyze", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ REAL AI RESPONSE RECEIVED");
    console.log("🤖 Response:", data);

    return data;
  } catch (error) {
    console.error("❌ REAL AI ANALYSIS FAILED");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response:", error.response.data);
    } else if (error.request) {
      console.error("No response received from backend");
      console.error("Request:", error.request);
    } else {
      console.error("Error:", error.message);
    }

    // IMPORTANT:
    // Do NOT use mockAnalysis anymore.
    // We want the real backend error to reach the UI.
    throw error;
  }
}
// ==========================================
// AI Resume Optimizer
// ==========================================
export async function optimizeResume({
  file,
  jobDescription,
  analysis,
}) {
  const form = new FormData();

  form.append("resume", file);
  form.append(
    "jobDescription",
    jobDescription || ""
  );

  form.append(
    "analysis",
    JSON.stringify(analysis || {})
  );

  console.log("========================================");
  console.log("✨ CALLING AI RESUME OPTIMIZER");
  console.log(
    "📍 API:",
    `${baseURL}/optimize`
  );
  console.log("📄 Resume:", file?.name);
  console.log("========================================");

  try {
    const { data } = await api.post(
      "/optimize",
      form,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    console.log(
      "✅ OPTIMIZED RESUME RECEIVED"
    );

    console.log(
      "🤖 Optimizer response:",
      data
    );

    return data;

  } catch (error) {
    console.error(
      "❌ Resume optimization failed"
    );

    if (error.response) {
      console.error(
        "Status:",
        error.response.status
      );

      console.error(
        "Response:",
        error.response.data
      );
    }

    throw error;
  }
}