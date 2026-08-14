const { PDFParse } = require("pdf-parse");

const {
  generateGeminiJSON,
} = require("../lib/gemini");

// ======================================================
// NORMALIZE RECOMMENDED SKILLS
// ======================================================
// Converts different aliases into one clean skill name.
//
// Examples:
// React / react / React.js      -> React
// Git / git                     -> Git
// GitHub / github               -> Git / GitHub
// REST API / rest / api         -> REST APIs
// Tailwind / Tailwind CSS       -> Tailwind CSS
// Node / node.js                -> Node.js
// ======================================================

function normalizeRecommendedSkills(skills = []) {
  if (!Array.isArray(skills)) {
    return [];
  }

  const aliases = {
    react: "React",
    "react.js": "React",

    git: "Git",
    github: "Git / GitHub",
    "git/github": "Git / GitHub",

    "rest api": "REST APIs",
    "rest apis": "REST APIs",
    rest: "REST APIs",
    api: "REST APIs",
    "restful api": "REST APIs",
    "restful apis": "REST APIs",

    javascript: "JavaScript",
    "java script": "JavaScript",

    typescript: "TypeScript",

    node: "Node.js",
    "node.js": "Node.js",

    next: "Next.js",
    "next.js": "Next.js",

    vue: "Vue.js",
    "vue.js": "Vue.js",

    angular: "Angular",

    tailwind: "Tailwind CSS",
    "tailwind css": "Tailwind CSS",

    bootstrap: "Bootstrap",

    "responsive design":
      "Responsive Web Design",

    "responsive web design":
      "Responsive Web Design",

    mongodb: "MongoDB",
    mysql: "MySQL",
    sql: "SQL",
    postgresql: "PostgreSQL",

    docker: "Docker",
    aws: "AWS",
    firebase: "Firebase",
    vercel: "Vercel",

    vite: "Vite",
    webpack: "Webpack",
    redux: "Redux",
    figma: "Figma",
  };

  const unique = new Map();

  for (const skill of skills) {
    if (
      skill === null ||
      skill === undefined
    ) {
      continue;
    }

    const raw = String(skill).trim();

    if (!raw) {
      continue;
    }

    const key = raw
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

    const displayName =
      aliases[key] || raw;

    const finalKey = displayName
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

    if (!unique.has(finalKey)) {
      unique.set(
        finalKey,
        displayName
      );
    }
  }

  return Array.from(
    unique.values()
  );
}

// ======================================================
// TECHNOLOGY KEYWORDS
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
// TERMS THAT ARE NOT TECHNICAL SKILLS
//
// These must NOT create a 100% job match by themselves.
// ======================================================

const NON_TECH_JOB_TERMS = [
  "frontend",
  "front-end",
  "backend",
  "back-end",
  "full stack",
  "fullstack",
  "web development",
  "web developer",
  "frontend developer",
  "backend developer",
  "full stack developer",
  "software developer",
  "software engineer",
  "developer",
  "engineer",
  "ui development",
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
  return String(value).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

// ======================================================
// CHECK KEYWORD
// ======================================================

function containsKeyword(
  text,
  keyword
) {
  const normalized =
    normalizeText(text);

  const target =
    normalizeText(keyword);

  if (!target) {
    return false;
  }

  // Technologies containing punctuation
  if (
    target === "c++" ||
    target === "c#" ||
    target === "node.js" ||
    target === "next.js" ||
    target === "react.js"
  ) {
    return normalized.includes(
      target
    );
  }

  const regex =
    new RegExp(
      `(^|\\s)${escapeRegex(
        target
      )}($|\\s)`,
      "i"
    );

  return regex.test(
    normalized
  );
}

// ======================================================
// GET TECHNICAL JOB KEYWORDS
// ======================================================

function extractJobKeywords(
  jobDescription
) {
  const found = [];

  for (
    const keyword of COMMON_TECH_KEYWORDS
  ) {
    if (
      containsKeyword(
        jobDescription,
        keyword
      )
    ) {
      found.push(keyword);
    }
  }

  return [
    ...new Set(found),
  ];
}

// ======================================================
// FIND MATCHED KEYWORDS
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
// KEYWORD SCORE
// ======================================================

function calculateKeywordScore(
  resumeText,
  jobDescription
) {
  const jobKeywords =
    extractJobKeywords(
      jobDescription
    );

  // No technical keywords in job description.
  // Do NOT return 100.
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

  const score = Math.round(
    (
      matchedKeywords.length /
      jobKeywords.length
    ) * 100
  );

  return {
    score: Math.max(
      0,
      Math.min(
        100,
        score
      )
    ),

    jobKeywords,

    matchedKeywords,

    missingKeywords,
  };
}

// ======================================================
// RESUME STRUCTURE SCORE
// ======================================================

function calculateStructureScore(
  resumeText
) {
  const text =
    normalizeText(
      resumeText
    );

  let score = 0;

  // Email
  if (
    /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(
      resumeText
    )
  ) {
    score += 10;
  }

  // Phone
  if (
    /\+?\d[\d\s().-]{8,}/.test(
      resumeText
    )
  ) {
    score += 10;
  }

  // Sections
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

  for (
    const section of sections
  ) {
    if (
      text.includes(
        normalizeText(
          section
        )
      )
    ) {
      sectionCount++;
    }
  }

  score += Math.min(
    sectionCount * 8,
    40
  );

  // Content length
  if (text.length >= 800) {
    score += 15;
  }

  if (text.length >= 1500) {
    score += 10;
  }

  if (text.length >= 2500) {
    score += 5;
  }

  return Math.min(
    score,
    100
  );
}

// ======================================================
// ATS SCORE
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
   * ATS:
   *
   * 60% technical keyword relevance
   * 40% resume structure
   */

  const score = Math.round(
    keywordResult.score * 0.6 +
      structureScore * 0.4
  );

  return {
    score: Math.max(
      0,
      Math.min(
        100,
        score
      )
    ),

    keywordResult,

    structureScore,
  };
}

// ======================================================
// JOB MATCH
//
// IMPORTANT:
//
// Job match is NOT based on job title.
//
// Technical skills are the primary signal.
// Structure/relevance gives a smaller contribution.
// ======================================================

function calculateJobMatch(
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

  // If there are no technical keywords,
  // don't claim a perfect match.
  if (
    !keywordResult.jobKeywords.length
  ) {
    return Math.round(
      structureScore * 0.5
    );
  }

  /*
   * Job Match:
   *
   * 80% technical skill match
   * 20% resume quality
   */

  const score = Math.round(
    keywordResult.score * 0.8 +
      structureScore * 0.2
  );

  return Math.max(
    0,
    Math.min(
      100,
      score
    )
  );
}

// ======================================================
// GET SKILLS SUPPORTED BY ORIGINAL RESUME
// ======================================================

function getSupportedSkills(
  resumeText
) {
  return COMMON_TECH_KEYWORDS.filter(
    (keyword) =>
      containsKeyword(
        resumeText,
        keyword
      )
  );
}

// ======================================================
// REMOVE UNSUPPORTED TECH SKILLS
// ======================================================

function removeUnsupportedSkills(
  optimizedText,
  originalResumeText,
  jobDescription
) {
  let cleaned =
    String(
      optimizedText || ""
    );

  const originalSkills =
    getSupportedSkills(
      originalResumeText
    );

  const jobKeywords =
    extractJobKeywords(
      jobDescription
    );

  const unsupportedJobSkills =
    jobKeywords.filter(
      (keyword) =>
        !originalSkills.includes(
          keyword
        )
    );

  console.log(
    "🔒 Original supported skills:",
    originalSkills
  );

  console.log(
    "⚠️ Unsupported job skills:",
    unsupportedJobSkills
  );

  /*
   * Remove unsupported technical
   * skills from optimized resume.
   */

  for (
    const skill of unsupportedJobSkills
  ) {
    const escaped =
      escapeRegex(skill);

    const regex =
      new RegExp(
        `\\b${escaped}\\b`,
        "gi"
      );

    cleaned =
      cleaned.replace(
        regex,
        ""
      );
  }

  // Clean formatting damage
  cleaned =
    cleaned
      .replace(
        /,\s*,/g,
        ","
      )
      .replace(
        /\|\s*\|/g,
        "|"
      )
      .replace(
        /,\s*(\n|$)/g,
        "$1"
      )
      .replace(
        /\n{3,}/g,
        "\n\n"
      )
      .trim();

  return {
    cleanedText: cleaned,

    originalSkills,

    unsupportedJobSkills,
  };
}

// ======================================================
// EXTRACT RESUME TEXT
// ======================================================

async function extractResumeText(
  file
) {
  if (!file) {
    throw new Error(
      "Resume file is required"
    );
  }

  const fileName = (
    file.originalname ||
    ""
  ).toLowerCase();

  // TXT
  if (
    fileName.endsWith(".txt")
  ) {
    return file.buffer
      .toString("utf8")
      .trim();
  }

  // PDF
  if (
    fileName.endsWith(".pdf")
  ) {
    console.log(
      "📖 Parsing PDF for optimization..."
    );

    const parser =
      new PDFParse({
        data: file.buffer,
      });

    try {
      const result =
        await parser.getText();

      const text = (
        result?.text || ""
      ).trim();

      console.log(
        "✅ PDF text extracted:",
        text.length,
        "characters"
      );

      return text;
    } finally {
      await parser.destroy();
    }
  }

  throw new Error(
    "Only PDF and TXT resumes are supported."
  );
}
// ======================================================
// OPTIMIZE RESUME
// ======================================================

const optimizeResume = async (
  req,
  res
) => {
  try {
    console.log(
      "========================================"
    );

    console.log(
      "========== AI RESUME OPTIMIZATION =========="
    );

    console.log(
      "========================================"
    );

    // ==================================================
    // CHECK GEMINI API KEY
    // ==================================================

    if (
      !process.env.GEMINI_API_KEY
    ) {
      return res.status(500).json({
        success: false,
        message:
          "GEMINI_API_KEY is not configured",
      });
    }

    console.log(
      "✅ Gemini API key detected"
    );

    // ==================================================
    // REQUEST DATA
    // ==================================================

    const jobDescription =
      req.body?.jobDescription ||
      "";

    let analysis =
      req.body?.analysis;

    // ==================================================
    // PARSE ANALYSIS
    // ==================================================

    if (
      typeof analysis ===
      "string"
    ) {
      try {
        analysis =
          JSON.parse(
            analysis
          );
      } catch {
        return res.status(400).json({
          success: false,
          message:
            "Invalid analysis JSON",
        });
      }
    }

    if (
      !analysis ||
      typeof analysis !==
        "object"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Analysis data is required",
      });
    }

    console.log(
      "✅ Analysis data received"
    );

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
    // EXTRACT ORIGINAL RESUME TEXT
    // ==================================================

    const originalResumeText =
      await extractResumeText(
        req.file
      );

    if (
      !originalResumeText
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Could not extract text from resume.",
      });
    }

    console.log(
      "📄 Original resume characters:",
      originalResumeText.length
    );

    // ==================================================
    // ORIGINAL SCORES
    //
    // IMPORTANT:
    //
    // We DO NOT use a newly calculated score
    // as the dashboard's original score.
    //
    // The original scores MUST come from
    // /api/analyze.
    // ==================================================

    const originalATS =
      Math.max(
        0,
        Math.min(
          100,
          Number(
            analysis.atsScore
          ) || 0
        )
      );

    const originalJobMatch =
      Math.max(
        0,
        Math.min(
          100,
          Number(
            analysis.jobMatch
          ) || 0
        )
      );

    console.log(
      "📊 Original ATS from analysis:",
      originalATS
    );

    console.log(
      "🎯 Original Job Match from analysis:",
      originalJobMatch
    );

    // ==================================================
    // ORIGINAL OBJECTIVE METRICS
    //
    // These are used only as reference information.
    // They are NOT allowed to overwrite
    // originalATS/originalJobMatch.
    // ==================================================

    const originalATSResult =
      calculateATSScore(
        originalResumeText,
        jobDescription
      );

    console.log(
      "📌 Objective original ATS:",
      originalATSResult.score
    );

    console.log(
      "🔑 Original matched keywords:",
      originalATSResult
        .keywordResult
        .matchedKeywords
    );

    console.log(
      "❌ Original missing keywords:",
      originalATSResult
        .keywordResult
        .missingKeywords
    );

    // ==================================================
    // OPTIMIZATION PROMPT
    // ==================================================

    const prompt = `
You are an expert ATS resume optimizer and professional career assistant.

Your task is to improve the candidate's resume for the TARGET JOB DESCRIPTION.

You MUST preserve factual accuracy.

TARGET JOB DESCRIPTION:
${jobDescription || "No specific job description was provided."}

ORIGINAL RESUME:
${originalResumeText}

ORIGINAL ANALYSIS:
${JSON.stringify(
  analysis,
  null,
  2
)}

OBJECTIVE MISSING TECHNICAL KEYWORDS:
${JSON.stringify(
  originalATSResult
    .keywordResult
    .missingKeywords,
  null,
  2
)}

IMPORTANT TRUTHFULNESS RULES:

1. Never invent work experience.

2. Never invent companies.

3. Never invent education.

4. Never invent certifications.

5. Never invent achievements.

6. Never invent projects.

7. Never invent dates.

8. Never invent job titles.

9. Never claim that the candidate has professional experience with a technology that is not demonstrated by the original resume.

10. Do NOT add React as an existing skill unless the original resume demonstrates React.

11. Do NOT add Git as an existing skill unless the original resume demonstrates Git.

12. Do NOT add REST API as an existing skill unless the original resume demonstrates REST API experience.

13. Do NOT add any other missing technical skill as an existing skill merely because it appears in the job description.

14. Missing skills may be recommended separately.

15. Improve wording, grammar, structure, readability, ATS compatibility, and professional presentation.

16. Preserve all important factual information.

17. Do not remove genuine projects, education, skills, or achievements.

18. Use strong action verbs where appropriate.

19. Do not keyword-stuff.

20. Do not repeat keywords unnaturally.

21. Do not change the candidate's identity or contact information.

22. Keep links and contact information factual.

23. If the original resume contains a skill, you may improve how that skill is presented.

24. If the original resume does not contain a skill, do not present it as an existing skill.

25. The optimized resume must remain truthful even if this means some job-description keywords remain missing.

OPTIMIZATION GOALS:

- Improve ATS readability.
- Improve section organization.
- Improve professional summary.
- Improve project descriptions.
- Improve action verbs.
- Improve keyword relevance where truthful.
- Improve consistency.
- Improve grammar.
- Improve clarity.
- Improve recruiter readability.
- Preserve factual information.

OUTPUT REQUIREMENTS:

Return ONLY JSON.

Do NOT use Markdown code fences.

Return exactly this structure:

{
  "optimizedResumeText": "",
  "improvementsMade": [],
  "recommendedSkillsToLearn": [],
  "optimizedATS": 0,
  "optimizedJobMatch": 0
}

IMPORTANT:

The optimizedATS and optimizedJobMatch fields are only estimates.

The backend will independently calculate the final optimized scores.

Do not intentionally inflate scores.

recommendedSkillsToLearn should contain only realistic missing skills relevant to the target job.

Do not include duplicate skills.

Use clean skill names such as:

"React"
"Git"
"REST APIs"

Do not return variants such as:

"react"
"React.js"
"rest"
"api"

for the same underlying skill.
`;

    console.log(
      "🤖 Sending optimization request to Gemini..."
    );

    console.log(
      "📝 Optimization prompt length:",
      prompt.length,
      "characters"
    );

    // ==================================================
    // GEMINI RESPONSE SCHEMA
    // ==================================================

    const schema = {
      type: "OBJECT",

      properties: {
        optimizedResumeText: {
          type: "STRING",
        },

        improvementsMade: {
          type: "ARRAY",

          items: {
            type: "STRING",
          },
        },

        recommendedSkillsToLearn: {
          type: "ARRAY",

          items: {
            type: "STRING",
          },
        },

        optimizedATS: {
          type: "NUMBER",
        },

        optimizedJobMatch: {
          type: "NUMBER",
        },
      },

      required: [
        "optimizedResumeText",
        "improvementsMade",
        "recommendedSkillsToLearn",
        "optimizedATS",
        "optimizedJobMatch",
      ],
    };

    // ==================================================
    // CALL GEMINI
    // ==================================================

    const result =
      await generateGeminiJSON(
        prompt,
        schema,
        {
          temperature: 0.2,
          maxOutputTokens: 6000,
        }
      );

    console.log(
      "✅ Gemini optimization response received"
    );

    // ==================================================
    // VALIDATE OPTIMIZED RESUME
    // ==================================================

    let optimizedResumeText =
      String(
        result?.optimizedResumeText ||
          ""
      ).trim();

    if (
      !optimizedResumeText
    ) {
      throw new Error(
        "Gemini did not return optimized resume text."
      );
    }

    console.log(
      "📝 Optimized resume characters:",
      optimizedResumeText.length
    );

    // ==================================================
    // TRUTHFULNESS PROTECTION
    //
    // IMPORTANT:
    //
    // The AI can accidentally add a missing skill.
    //
    // We protect the final resume by checking
    // the original resume before allowing
    // unsupported technical skills.
    // ==================================================

    const truthfulnessResult =
      removeUnsupportedSkills(
        optimizedResumeText,
        originalResumeText,
        jobDescription
      );

    optimizedResumeText =
      truthfulnessResult
        .cleanedText;

    console.log(
      "🔒 Truthfulness protection completed"
    );

    console.log(
      "📄 Final optimized resume characters:",
      optimizedResumeText.length
    );

    // ==================================================
    // RE-CALCULATE OPTIMIZED ATS
    //
    // This is the authoritative optimized score.
    //
    // We calculate it from the actual optimized
    // resume text.
    // ==================================================

    const optimizedATSResult =
      calculateATSScore(
        optimizedResumeText,
        jobDescription
      );

    const optimizedATS =
      optimizedATSResult.score;

    // ==================================================
    // RE-CALCULATE OPTIMIZED JOB MATCH
    // ==================================================

    const optimizedJobMatch =
      calculateJobMatch(
        optimizedResumeText,
        jobDescription
      );

    console.log(
      "📊 Optimized ATS:",
      optimizedATS
    );

    console.log(
      "🎯 Optimized Job Match:",
      optimizedJobMatch
    );

    console.log(
      "🔑 Optimized matched keywords:",
      optimizedATSResult
        .keywordResult
        .matchedKeywords
    );

    console.log(
      "❌ Optimized missing keywords:",
      optimizedATSResult
        .keywordResult
        .missingKeywords
    );

    // ==================================================
    // CALCULATE IMPROVEMENTS
    // ==================================================

    const atsImprovement =
      optimizedATS -
      originalATS;

    const jobMatchImprovement =
      optimizedJobMatch -
      originalJobMatch;

    console.log(
      "========================================"
    );

    console.log(
      "📈 SCORE COMPARISON"
    );

    console.log(
      "========================================"
    );

    console.log(
      "Original ATS:",
      originalATS
    );

    console.log(
      "Optimized ATS:",
      optimizedATS
    );

    console.log(
      "ATS Improvement:",
      atsImprovement
    );

    console.log(
      "Original Job Match:",
      originalJobMatch
    );

    console.log(
      "Optimized Job Match:",
      optimizedJobMatch
    );

    console.log(
      "Job Match Improvement:",
      jobMatchImprovement
    );

    console.log(
      "========================================"
    );

    // ==================================================
    // NORMALIZE AI IMPROVEMENTS
    // ==================================================

    const improvementsMade =
      Array.isArray(
        result?.improvementsMade
      )
        ? [
            ...new Map(
              result.improvementsMade
                .filter(
                  (item) =>
                    item !== null &&
                    item !== undefined &&
                    String(
                      item
                    ).trim()
                )
                .map(
                  (item) => {
                    const value =
                      String(
                        item
                      ).trim();

                    return [
                      value.toLowerCase(),
                      value,
                    ];
                  }
                )
            ).values(),
          ]
        : [];

    // ==================================================
    // NORMALIZE RECOMMENDED SKILLS
    // ==================================================

    const aiRecommendedSkills =
      Array.isArray(
        result?.recommendedSkillsToLearn
      )
        ? result.recommendedSkillsToLearn
        : [];

    // ==================================================
    // OBJECTIVE MISSING SKILLS
    // ==================================================

    const objectiveMissingSkills =
      optimizedATSResult
        .keywordResult
        .missingKeywords;

    // ==================================================
    // COMBINE + NORMALIZE
    // ==================================================

    const recommendedSkillsToLearn =
      normalizeRecommendedSkills([
        ...aiRecommendedSkills,
        ...objectiveMissingSkills,
      ]);

    console.log(
      "🎓 Final recommended skills:",
      recommendedSkillsToLearn
    );

    // ==================================================
    // BUILD OPTIMIZED ANALYSIS
    // ==================================================

    const optimizedAnalysis = {
      ...analysis,

      atsScore:
        optimizedATS,

      jobMatch:
        optimizedJobMatch,

      missingKeywords:
        optimizedATSResult
          .keywordResult
          .missingKeywords,

      matchedKeywords:
        optimizedATSResult
          .keywordResult
          .matchedKeywords,

      optimizedResumeText,
    };

    // ==================================================
    // BUILD OPTIMIZATION OBJECT
    // ==================================================

    const optimization = {
      // ----------------------------------------------
      // ORIGINAL ANALYSIS
      // ----------------------------------------------

      originalAnalysis:
        analysis,

      // ----------------------------------------------
      // OPTIMIZED ANALYSIS
      // ----------------------------------------------

      optimizedAnalysis,

      // ----------------------------------------------
      // ORIGINAL RESUME
      // ----------------------------------------------

      originalResumeText,

      // ----------------------------------------------
      // OPTIMIZED RESUME
      // ----------------------------------------------

      optimizedResumeText,

      optimizedResume: {
        text:
          optimizedResumeText,
      },

      // ----------------------------------------------
      // SCORES
      // ----------------------------------------------

      atsImprovement,

      jobMatchImprovement,

      // ----------------------------------------------
      // AI IMPROVEMENTS
      // ----------------------------------------------

      improvementsMade,

      // ----------------------------------------------
      // RECOMMENDED SKILLS
      // ----------------------------------------------

      recommendedSkillsToLearn,

      // ----------------------------------------------
      // METRICS
      // ----------------------------------------------

      metrics: {
        original: {
          ats:
            originalATS,

          jobMatch:
            originalJobMatch,

          matchedKeywords:
            originalATSResult
              .keywordResult
              .matchedKeywords,

          missingKeywords:
            originalATSResult
              .keywordResult
              .missingKeywords,
        },

        optimized: {
          ats:
            optimizedATS,

          jobMatch:
            optimizedJobMatch,

          matchedKeywords:
            optimizedATSResult
              .keywordResult
              .matchedKeywords,

          missingKeywords:
            optimizedATSResult
              .keywordResult
              .missingKeywords,
        },
      },
    };

    // ==================================================
    // FINAL LOG
    // ==================================================

    console.log(
      "========================================"
    );

    console.log(
      "🎉 AI RESUME OPTIMIZATION COMPLETE"
    );

    console.log(
      "========================================"
    );

    console.log(
      "Original ATS:",
      originalATS
    );

    console.log(
      "Optimized ATS:",
      optimizedATS
    );

    console.log(
      "ATS Improvement:",
      atsImprovement
    );

    console.log(
      "Original Job Match:",
      originalJobMatch
    );

    console.log(
      "Optimized Job Match:",
      optimizedJobMatch
    );

    console.log(
      "Job Match Improvement:",
      jobMatchImprovement
    );

    console.log(
      "Recommended Skills:",
      recommendedSkillsToLearn
    );

    console.log(
      "========================================"
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      optimization,

      // These top-level fields make it easier
      // for the frontend to consume the response.
      originalATS,

      originalJobMatch,

      optimizedATS,

      optimizedJobMatch,

      atsImprovement,

      jobMatchImprovement,

      optimizedResumeText,

      improvementsMade,

      recommendedSkillsToLearn,
    });
  } catch (error) {
    // ==================================================
    // ERROR HANDLING
    // ==================================================

    console.error(
      "========================================"
    );

    console.error(
      "❌ Optimize Resume Error:"
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
        error?.response?.data
          ?.error?.message ||
        error?.message ||
        "Resume optimization failed",
    });
  }
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  optimizeResume,
};
