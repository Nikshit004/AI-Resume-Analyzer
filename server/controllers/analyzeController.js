const { PDFParse } = require("pdf-parse");

const {
  generateGeminiJSON,
} = require("../lib/gemini");

// ======================================================
// COMMON SKILL / KEYWORD LIST
// ======================================================

const COMMON_TECH_KEYWORDS = [
  "html",
  "html5",
  "css",
  "css3",
  "javascript",
  "typescript",
  "react",
  "react.js",
  "next.js",
  "vue",
  "angular",
  "node.js",
  "node",
  "express",
  "express.js",
  "mongodb",
  "mysql",
  "sql",
  "postgresql",
  "java",
  "python",
  "c",
  "c++",
  "php",
  "git",
  "github",
  "rest api",
  "rest",
  "api",
  "bootstrap",
  "tailwind",
  "tailwind css",
  "redux",
  "figma",
  "responsive design",
  "responsive web design",
  "ui development",
  "frontend",
  "front-end",
  "backend",
  "back-end",
  "full stack",
  "fullstack",
  "web development",
  "web development",
  "docker",
  "aws",
  "firebase",
  "vercel",
  "npm",
  "vite",
  "webpack",
  "json",
  "ajax",
];

// ======================================================
// NORMALIZE TEXT
// ======================================================

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\w\s.+#/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ======================================================
// ESCAPE REGEX
// ======================================================

function escapeRegex(value) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

// ======================================================
// CHECK WHETHER TEXT CONTAINS KEYWORD
// ======================================================

function containsKeyword(text, keyword) {
  const normalized = normalizeText(text);
  const target = normalizeText(keyword);

  if (!target) {
    return false;
  }

  // Special handling for symbols
  if (
    target === "c++" ||
    target === "c#" ||
    target === "node.js" ||
    target === "next.js" ||
    target === "react.js"
  ) {
    return normalized.includes(target);
  }

  const regex = new RegExp(
    `(^|\\s)${escapeRegex(target)}($|\\s)`,
    "i"
  );

  return regex.test(normalized);
}

// ======================================================
// EXTRACT RELEVANT JOB KEYWORDS
// ======================================================

function extractJobKeywords(jobDescription) {
  const description = normalizeText(
    jobDescription
  );

  const found = [];

  for (const keyword of COMMON_TECH_KEYWORDS) {
    if (
      containsKeyword(
        description,
        keyword
      )
    ) {
      found.push(keyword);
    }
  }

  // Remove duplicates
  return [...new Set(found)];
}

// ======================================================
// FIND MATCHED JOB KEYWORDS
// ======================================================

function getMatchedKeywords(
  resumeText,
  jobKeywords
) {
  return jobKeywords.filter(
    (keyword) =>
      containsKeyword(
        resumeText,
        keyword
      )
  );
}

// ======================================================
// CALCULATE KEYWORD SCORE
// ======================================================

function calculateKeywordScore(
  resumeText,
  jobDescription
) {
  const jobKeywords =
    extractJobKeywords(
      jobDescription
    );

  if (!jobKeywords.length) {
    return {
      score: 50,
      jobKeywords: [],
      matchedKeywords: [],
      missingKeywords: [],
    };
  }

  const matchedKeywords =
    getMatchedKeywords(
      resumeText,
      jobKeywords
    );

  const missingKeywords =
    jobKeywords.filter(
      (keyword) =>
        !matchedKeywords.includes(
          keyword
        )
    );

  const keywordRatio =
    matchedKeywords.length /
    jobKeywords.length;

  return {
    score: Math.round(
      keywordRatio * 100
    ),
    jobKeywords,
    matchedKeywords,
    missingKeywords,
  };
}

// ======================================================
// ATS STRUCTURE SCORE
// ======================================================

function calculateStructureScore(
  resumeText
) {
  const text = normalizeText(
    resumeText
  );

  let score = 0;

  // Contact information
  if (
    /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(
      resumeText
    )
  ) {
    score += 10;
  }

  if (
    /\+?\d[\d\s().-]{8,}/.test(
      resumeText
    )
  ) {
    score += 10;
  }

  // Common resume sections
  const sections = [
    "education",
    "experience",
    "projects",
    "skills",
    "technical skills",
    "professional summary",
    "summary",
    "certifications",
  ];

  let sectionCount = 0;

  for (const section of sections) {
    if (
      text.includes(
        normalizeText(section)
      )
    ) {
      sectionCount++;
    }
  }

  score += Math.min(
    sectionCount * 8,
    40
  );

  // Length / content
  if (text.length >= 800) {
    score += 15;
  }

  if (text.length >= 1500) {
    score += 10;
  }

  if (text.length >= 2500) {
    score += 5;
  }

  return Math.min(score, 100);
}

// ======================================================
// CALCULATE FINAL ATS SCORE
// ======================================================

function calculateATSScore(
  resumeText,
  jobDescription
) {
  const keywordResult =
    calculateKeywordScore(
      resumeText,
      jobDescription
    );

  const structureScore =
    calculateStructureScore(
      resumeText
    );

  /*
   * ATS weighting:
   *
   * 60% job keyword relevance
   * 40% resume structure
   */

  const score = Math.round(
    keywordResult.score * 0.6 +
      structureScore * 0.4
  );

  return {
    score: Math.max(
      0,
      Math.min(100, score)
    ),
    keywordResult,
    structureScore,
  };
}

// ======================================================
// CALCULATE JOB MATCH
// ======================================================

function calculateJobMatch(
  resumeText,
  jobDescription
) {
  const result =
    calculateKeywordScore(
      resumeText,
      jobDescription
    );

  if (
    !result.jobKeywords.length
  ) {
    return 50;
  }

  /*
   * Job match is primarily based
   * on actual demonstrated overlap.
   */

  return Math.max(
    0,
    Math.min(100, result.score)
  );
}

// ======================================================
// SCORE -> GRADE
// ======================================================

function scoreToGrade(score) {
  const value =
    Number(score) || 0;

  if (value >= 90) {
    return "A+";
  }

  if (value >= 85) {
    return "A";
  }

  if (value >= 80) {
    return "B+";
  }

  if (value >= 75) {
    return "B";
  }

  if (value >= 70) {
    return "C+";
  }

  if (value >= 60) {
    return "C";
  }

  if (value >= 50) {
    return "D";
  }

  return "F";
}

// ======================================================
// ANALYZE RESUME
// ======================================================

const analyzeResume = async (
  req,
  res
) => {
  try {
    console.log(
      "========================================"
    );

    console.log(
      "========== AI RESUME ANALYSIS =========="
    );

    console.log(
      "========================================"
    );

    // ==================================================
    // REQUEST DATA
    // ==================================================

    const body = req.body || {};

    const jobDescription =
      String(
        body.jobDescription || ""
      ).trim();

    // ==================================================
    // CHECK FILE
    // ==================================================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Resume file is required",
      });
    }

    // ==================================================
    // CHECK API KEY
    // ==================================================

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message:
          "GEMINI_API_KEY is not configured",
      });
    }

    console.log(
      "📄 Resume:",
      req.file.originalname
    );

    console.log(
      "📦 File size:",
      req.file.size,
      "bytes"
    );

    console.log(
      "💼 Job Description:",
      jobDescription
    );

    // ==================================================
    // FILE TYPE
    // ==================================================

    const fileName =
      String(
        req.file.originalname || ""
      ).toLowerCase();

    const isPDF =
      fileName.endsWith(".pdf");

    const isTXT =
      fileName.endsWith(".txt");

    if (!isPDF && !isTXT) {
      return res.status(400).json({
        success: false,
        message:
          "Only PDF and TXT resumes are supported.",
      });
    }

    // ==================================================
    // EXTRACT RESUME TEXT
    // ==================================================

    let resumeText = "";

    if (isPDF) {
      console.log(
        "📖 Extracting text from PDF..."
      );

      const parser =
        new PDFParse({
          data: req.file.buffer,
        });

      try {
        const pdfResult =
          await parser.getText();

        resumeText =
          pdfResult?.text || "";
      } finally {
        await parser.destroy();
      }
    }

    if (isTXT) {
      console.log(
        "📖 Reading TXT resume..."
      );

      resumeText =
        req.file.buffer.toString(
          "utf8"
        );
    }

    resumeText =
      resumeText.trim();

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message:
          "Could not extract text from this resume.",
      });
    }

    console.log(
      "✅ Resume text extracted:",
      resumeText.length,
      "characters"
    );

    // ==================================================
    // CALCULATE OBJECTIVE SCORES
    // ==================================================

    console.log(
      "📊 Calculating objective ATS score..."
    );

    const atsResult =
      calculateATSScore(
        resumeText,
        jobDescription
      );

    const objectiveATS =
      atsResult.score;

    const objectiveJobMatch =
      calculateJobMatch(
        resumeText,
        jobDescription
      );

    console.log(
      "🔑 Job keywords:",
      atsResult.keywordResult
        .jobKeywords
    );

    console.log(
      "✅ Matched keywords:",
      atsResult.keywordResult
        .matchedKeywords
    );

    console.log(
      "❌ Missing keywords:",
      atsResult.keywordResult
        .missingKeywords
    );

    console.log(
      "📈 Objective ATS:",
      objectiveATS
    );

    console.log(
      "🎯 Objective Job Match:",
      objectiveJobMatch
    );

    // ==================================================
    // GEMINI PROMPT
    // ==================================================

    const prompt = `
You are an expert ATS Resume Analyzer.

Analyze the resume against the target job description.

TARGET JOB DESCRIPTION:
${jobDescription || "No specific job description was provided."}

RESUME:
${resumeText}

IMPORTANT:
The backend will calculate the final ATS and Job Match scores separately.

DO NOT calculate your own ATS score.
DO NOT calculate your own Job Match score.

Focus only on qualitative analysis.

Evaluate:

1. Professional summary
2. Technical skills
3. Skills demonstrated by the resume
4. Missing keywords from the job description
5. Strengths
6. Weaknesses
7. Practical improvement suggestions
8. Job match explanation

STRICT RULES:

- Never invent information.
- Never invent work experience.
- Never invent companies.
- Never invent education.
- Never invent certifications.
- Never invent achievements.
- Never assume the candidate has a skill that is not demonstrated.
- matchedSkills must contain only skills demonstrated by the resume.
- Missing keywords must come from the job description.
- Suggestions must be realistic.
- Do not add skills as existing skills simply because the job description asks for them.
- Do not keyword-stuff.
- Keep everything factual.
`;

    console.log(
      "🤖 Sending qualitative analysis to Gemini..."
    );

    // ==================================================
    // GEMINI SCHEMA
    // ==================================================

    const schema = {
      type: "OBJECT",

      properties: {
        summary: {
          type: "STRING",
        },

        jobMatchExplanation: {
          type: "STRING",
        },

        matchedSkills: {
          type: "ARRAY",

          items: {
            type: "OBJECT",

            properties: {
              name: {
                type: "STRING",
              },

              level: {
                type: "NUMBER",
              },
            },

            required: [
              "name",
              "level",
            ],
          },
        },

        strengths: {
          type: "ARRAY",

          items: {
            type: "STRING",
          },
        },

        weaknesses: {
          type: "ARRAY",

          items: {
            type: "STRING",
          },
        },

        suggestions: {
          type: "ARRAY",

          items: {
            type: "OBJECT",

            properties: {
              title: {
                type: "STRING",
              },

              detail: {
                type: "STRING",
              },

              priority: {
                type: "STRING",
              },
            },

            required: [
              "title",
              "detail",
              "priority",
            ],
          },
        },
      },

      required: [
        "summary",
        "jobMatchExplanation",
        "matchedSkills",
        "strengths",
        "weaknesses",
        "suggestions",
      ],
    };

    // ==================================================
    // GEMINI CALL
    // ==================================================

    const aiAnalysis =
      await generateGeminiJSON(
        prompt,
        schema,
        {
          temperature: 0.2,
          maxOutputTokens: 4000,
        }
      );

    console.log(
      "✅ Gemini qualitative analysis received"
    );

    // ==================================================
    // NORMALIZE MATCHED SKILLS
    // ==================================================

    const matchedSkills =
      Array.isArray(
        aiAnalysis?.matchedSkills
      )
        ? aiAnalysis.matchedSkills
            .map((skill) => ({
              name: String(
                skill?.name || ""
              ),

              level: Math.max(
                0,
                Math.min(
                  100,
                  Number(
                    skill?.level
                  ) || 0
                )
              ),
            }))
            .filter(
              (skill) =>
                skill.name.trim()
            )
        : [];

    // ==================================================
    // NORMALIZE ARRAYS
    // ==================================================

    const strengths =
      Array.isArray(
        aiAnalysis?.strengths
      )
        ? aiAnalysis.strengths
        : [];

    const weaknesses =
      Array.isArray(
        aiAnalysis?.weaknesses
      )
        ? aiAnalysis.weaknesses
        : [];

    const suggestions =
      Array.isArray(
        aiAnalysis?.suggestions
      )
        ? aiAnalysis.suggestions
        : [];

    // ==================================================
    // MISSING KEYWORDS
    //
    // IMPORTANT:
    // Use objective keyword detection rather
    // than blindly trusting Gemini.
    // ==================================================

    const missingKeywords =
      atsResult.keywordResult
        .missingKeywords;

    // ==================================================
    // BUILD FINAL ANALYSIS
    // ==================================================

    const finalAnalysis = {
      atsScore:
        objectiveATS,

      jobMatch:
        objectiveJobMatch,

      grade:
        scoreToGrade(
          objectiveATS
        ),

      summary:
        String(
          aiAnalysis?.summary ||
            "Resume analyzed successfully."
        ),

      jobMatchExplanation:
        String(
          aiAnalysis?.jobMatchExplanation ||
            "Job match calculated using demonstrated resume skills and target job keywords."
        ),

      matchedSkills,

      missingKeywords,

      strengths,

      weaknesses,

      suggestions,

      // Additional debugging / dashboard data
      metrics: {
        totalJobKeywords:
          atsResult.keywordResult
            .jobKeywords.length,

        matchedJobKeywords:
          atsResult.keywordResult
            .matchedKeywords.length,

        missingJobKeywords:
          atsResult.keywordResult
            .missingKeywords.length,

        keywordScore:
          atsResult.keywordResult
            .score,

        structureScore:
          atsResult.structureScore,
      },
    };

    // ==================================================
    // LOG FINAL RESULT
    // ==================================================

    console.log(
      "========================================"
    );

    console.log(
      "📊 FINAL ATS:",
      finalAnalysis.atsScore
    );

    console.log(
      "🎯 FINAL JOB MATCH:",
      finalAnalysis.jobMatch
    );

    console.log(
      "🏆 GRADE:",
      finalAnalysis.grade
    );

    console.log(
      "🔑 MATCHED:",
      atsResult.keywordResult
        .matchedKeywords
    );

    console.log(
      "❌ MISSING:",
      atsResult.keywordResult
        .missingKeywords
    );

    console.log(
      "========================================"
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      fileName:
        req.file.originalname,

      resumeText,

      ...finalAnalysis,
    });
  } catch (error) {
    console.error(
      "========================================"
    );

    console.error(
      "❌ Analyze Resume Error:"
    );

    console.error(
      error?.response?.data ||
        error?.message ||
        error
    );

    console.error(
      "========================================"
    );

    return res.status(500).json({
      success: false,

      message:
        error?.message ||
        "Resume analysis failed",
    });
  }
};

module.exports = {
  analyzeResume,
};