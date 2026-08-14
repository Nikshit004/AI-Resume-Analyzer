import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
} from "react";

import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";

import {
  extractResumeText,
  ResumeParseError,
} from "../lib/resume-parser";

import {
  api,
  analyzeResume as analyzeResumeAPI,
  optimizeResume,
} from "../services/api";

export const ResumeContext =
  createContext(null);

export const ResumeProvider = ({
  children,
}) => {
  const { user } = useUser();

  // ==========================================
  // STATE
  // ==========================================

  const [file, setFile] =
    useState(null);

  const [jobDescription, setJobDescription] =
    useState("");

  const [resumeText, setResumeText] =
    useState("");

  const [analysis, setAnalysis] =
    useState(null);

  const [history, setHistory] =
    useState([]);

  const [editingResume, setEditingResume] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  // ==========================================
  // FETCH RESUME HISTORY
  // ==========================================

  const fetchHistory =
    useCallback(async () => {
      if (!user?.id) {
        return;
      }

      try {
        console.log(
          "📚 Fetching resume history..."
        );

        const { data } =
          await api.get(
            `/resume/history/${user.id}`
          );

        if (data?.success) {
          setHistory(
            Array.isArray(data.resumes)
              ? data.resumes
              : []
          );

          console.log(
            "✅ Resume history loaded:",
            data.resumes?.length || 0
          );
        }
      } catch (err) {
        console.error(
          "❌ History Error:",
          err
        );
      }
    }, [user]);

  // ==========================================
  // LOAD HISTORY WHEN USER CHANGES
  // ==========================================

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // ==========================================
  // DELETE RESUME
  // ==========================================

  const deleteResume =
    useCallback(
      async (id) => {
        if (!id) {
          return;
        }

        try {
          await api.delete(
            `/resume/${id}`
          );

          if (
            analysis &&
            history.find(
              (resume) =>
                resume._id === id
            )?.analysis === analysis
          ) {
            setAnalysis(null);
          }

          await fetchHistory();

          toast.success(
            "Resume deleted successfully"
          );
        } catch (err) {
          console.error(
            "❌ Delete Error:",
            err
          );

          toast.error(
            "Failed to delete resume"
          );
        }
      },
      [
        analysis,
        history,
        fetchHistory,
      ]
    );

  // ==========================================
  // ANALYZE + OPTIMIZE RESUME
  // ==========================================

  const analyze =
    useCallback(async () => {
      // ========================================
      // VALIDATION
      // ========================================

      if (!file) {
        toast.error(
          "Upload a resume first."
        );

        return null;
      }

      if (!jobDescription.trim()) {
        toast.error(
          "Please enter a job description."
        );

        return null;
      }

      setLoading(true);
      setProgress(5);

      let crawl = null;

      const startCrawl = (
        from,
        to,
        ms
      ) => {
        clearInterval(crawl);

        setProgress(from);

        crawl = setInterval(() => {
          setProgress((current) =>
            current < to
              ? current + 1
              : current
          );
        }, ms);
      };

      try {
        // ========================================
        // STEP 1
        // EXTRACT RESUME TEXT
        // ========================================

        console.log(
          "========================================"
        );

        console.log(
          "📄 STEP 1: EXTRACTING RESUME"
        );

        console.log(
          "========================================"
        );

        startCrawl(
          5,
          25,
          60
        );

        const text =
          await extractResumeText(file);

        setResumeText(text);

        clearInterval(crawl);

        setProgress(30);

        console.log(
          "✅ Resume text extracted"
        );

        console.log(
          "📦 Characters:",
          text.length
        );

        // ========================================
        // STEP 2
        // ORIGINAL AI ANALYSIS
        //
        // This is the ONLY original analysis.
        //
        // We do NOT analyze the optimized
        // resume again from the frontend.
        // ========================================

        console.log(
          "========================================"
        );

        console.log(
          "🤖 STEP 2: ORIGINAL AI ANALYSIS"
        );

        console.log(
          "========================================"
        );

        startCrawl(
          30,
          50,
          120
        );

        const analyzeResponse =
          await analyzeResumeAPI({
            file,
            jobDescription,
          });

        clearInterval(crawl);

        setProgress(55);

        console.log(
          "✅ Backend analysis response received"
        );

        console.log(
          "🤖 Analyze response:",
          analyzeResponse
        );

        const originalAnalysis =
          normalizeAnalysisResponse(
            analyzeResponse
          );

        // Make sure original resume text
        // remains available.
        originalAnalysis.resumeText =
          text;

        console.log(
          "📊 Original ATS:",
          originalAnalysis.atsScore
        );

        console.log(
          "🎯 Original Job Match:",
          originalAnalysis.jobMatch
        );

        // ========================================
        // STEP 3
        // AUTOMATIC AI OPTIMIZATION
        // ========================================

        console.log(
          "========================================"
        );

        console.log(
          "✨ STEP 3: AI RESUME OPTIMIZER"
        );

        console.log(
          "========================================"
        );

        toast.success(
          "Analysis complete. AI is now optimizing your resume..."
        );

        startCrawl(
          55,
          80,
          150
        );

        const optimizedResume =
          await optimizeResume({
            file,
            jobDescription,
            analysis:
              originalAnalysis,
          });

        clearInterval(crawl);

        setProgress(85);

        console.log(
          "🤖 Optimizer response:",
          optimizedResume
        );

        if (
          !optimizedResume ||
          !optimizedResume.success
        ) {
          throw new Error(
            optimizedResume?.message ||
              "AI optimizer failed to generate an updated resume."
          );
        }

        if (
          !optimizedResume.optimizedResumeText
        ) {
          throw new Error(
            "AI optimizer did not return updated resume text."
          );
        }

        console.log(
          "✅ AI OPTIMIZATION COMPLETE"
        );

        console.log(
          "✨ Updated resume generated"
        );

        // ========================================
        // STEP 4
        // USE BACKEND OPTIMIZATION SCORES
        //
        // IMPORTANT:
        //
        // The optimizer backend already:
        //
        // 1. Generates the optimized resume
        // 2. Protects against unsupported skills
        // 3. Calculates optimized ATS
        // 4. Calculates optimized Job Match
        //
        // Therefore we DO NOT send the
        // optimized resume through /api/analyze
        // again.
        //
        // This prevents Gemini from generating
        // a completely different second score.
        // ========================================

        console.log(
          "========================================"
        );

        console.log(
          "📊 STEP 4: USING BACKEND OPTIMIZATION SCORES"
        );

        console.log(
          "========================================"
        );

        toast.success(
          "Updated resume created. Finalizing optimized scores..."
        );

        startCrawl(
          85,
          95,
          100
        );

        // ----------------------------------------
        // Get optimized scores
        // ----------------------------------------

        const optimizerData =
          optimizedResume.optimization ||
          {};

        const optimizedAnalysisFromBackend =
          optimizerData.optimizedAnalysis ||
          {};

        let optimizedATS =
          Number(
            optimizedResume.optimizedATS
          );

        let optimizedJobMatch =
          Number(
            optimizedResume.optimizedJobMatch
          );

        // Fallback 1:
        // optimization.optimizedAnalysis
        if (
          !Number.isFinite(
            optimizedATS
          )
        ) {
          optimizedATS =
            Number(
              optimizedAnalysisFromBackend.atsScore
            );
        }

        if (
          !Number.isFinite(
            optimizedJobMatch
          )
        ) {
          optimizedJobMatch =
            Number(
              optimizedAnalysisFromBackend.jobMatch
            );
        }

        // Fallback 2:
        // optimization object
        if (
          !Number.isFinite(
            optimizedATS
          )
        ) {
          optimizedATS =
            Number(
              optimizerData.optimizedATS
            );
        }

        if (
          !Number.isFinite(
            optimizedJobMatch
          )
        ) {
          optimizedJobMatch =
            Number(
              optimizerData.optimizedJobMatch
            );
        }

        // Final fallback:
        // keep original score instead of
        // creating NaN.
        if (
          !Number.isFinite(
            optimizedATS
          )
        ) {
          optimizedATS =
            Number(
              originalAnalysis.atsScore
            ) || 0;
        }

        if (
          !Number.isFinite(
            optimizedJobMatch
          )
        ) {
          optimizedJobMatch =
            Number(
              originalAnalysis.jobMatch
            ) || 0;
        }

        // Keep scores inside 0-100.
        optimizedATS =
          Math.max(
            0,
            Math.min(
              100,
              optimizedATS
            )
          );

        optimizedJobMatch =
          Math.max(
            0,
            Math.min(
              100,
              optimizedJobMatch
            )
          );

        // ----------------------------------------
        // Create optimized analysis
        // ----------------------------------------

        const optimizedAnalysis = {
          ...originalAnalysis,

          atsScore:
            optimizedATS,

          jobMatch:
            optimizedJobMatch,

          // Preserve optimized resume text.
          resumeText:
            optimizedResume.optimizedResumeText,

          // Use backend optimized keywords
          // when available.
          missingKeywords:
            optimizerData.metrics
              ?.optimized
              ?.missingKeywords ||
            optimizedAnalysisFromBackend
              .missingKeywords ||
            originalAnalysis.missingKeywords ||
            [],

          // Preserve original matched skills
          // because the optimizer must not invent
          // skills.
          matchedSkills:
            originalAnalysis.matchedSkills ||
            [],

          suggestions:
            originalAnalysis.suggestions ||
            [],
        };

        console.log(
          "✅ Optimized backend scores received"
        );

        console.log(
          "📊 Optimized ATS:",
          optimizedAnalysis.atsScore
        );

        console.log(
          "🎯 Optimized Job Match:",
          optimizedAnalysis.jobMatch
        );

        // ========================================
        // STEP 5
        // CALCULATE IMPROVEMENTS
        // ========================================

        const atsImprovement =
          Number(
            optimizedAnalysis.atsScore
          ) -
          Number(
            originalAnalysis.atsScore
          );

        const jobMatchImprovement =
          Number(
            optimizedAnalysis.jobMatch
          ) -
          Number(
            originalAnalysis.jobMatch
          );

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
          originalAnalysis.atsScore
        );

        console.log(
          "Optimized ATS:",
          optimizedAnalysis.atsScore
        );

        console.log(
          "ATS Improvement:",
          atsImprovement
        );

        console.log(
          "Original Job Match:",
          originalAnalysis.jobMatch
        );

        console.log(
          "Optimized Job Match:",
          optimizedAnalysis.jobMatch
        );

        console.log(
          "Job Match Improvement:",
          jobMatchImprovement
        );

        // ========================================
        // STEP 6
        // CREATE FINAL ANALYSIS OBJECT
        // ========================================

        const improvementsMade =
          Array.isArray(
            optimizedResume.improvementsMade
          )
            ? optimizedResume.improvementsMade
            : Array.isArray(
                optimizerData.improvementsMade
              )
            ? optimizerData.improvementsMade
            : [];

        const recommendedSkillsToLearn =
          Array.isArray(
            optimizedResume.recommendedSkillsToLearn
          )
            ? optimizedResume.recommendedSkillsToLearn
            : Array.isArray(
                optimizerData.recommendedSkillsToLearn
              )
            ? optimizerData.recommendedSkillsToLearn
            : [];

        const finalAnalysis = {
          // Put optimized analysis at the
          // top level.
          //
          // This keeps your existing Dashboard
          // working without UI changes.
          ...optimizedAnalysis,

          // Always keep original extracted text.
          originalResumeText:
            text,

          // Keep optimized resume text
          // available at top level.
          optimizedResumeText:
            optimizedResume.optimizedResumeText,

          optimization: {
            // ----------------------------------
            // ORIGINAL
            // ----------------------------------

            originalAnalysis,

            // ----------------------------------
            // OPTIMIZED
            // ----------------------------------

            optimizedAnalysis,

            // ----------------------------------
            // OPTIMIZED RESUME RESPONSE
            // ----------------------------------

            optimizedResume,

            // ----------------------------------
            // TEXT
            // ----------------------------------

            originalResumeText:
              text,

            optimizedResumeText:
              optimizedResume.optimizedResumeText,

            // ----------------------------------
            // SCORE CHANGES
            // ----------------------------------

            atsImprovement,

            jobMatchImprovement,

            // ----------------------------------
            // AI IMPROVEMENTS
            // ----------------------------------

            improvementsMade,

            // ----------------------------------
            // RECOMMENDED SKILLS
            // ----------------------------------

            recommendedSkillsToLearn,

            // ----------------------------------
            // OBJECTIVE METRICS
            // ----------------------------------

            metrics:
              optimizerData.metrics || {
                original: {
                  ats:
                    originalAnalysis.atsScore,

                  jobMatch:
                    originalAnalysis.jobMatch,
                },

                optimized: {
                  ats:
                    optimizedAnalysis.atsScore,

                  jobMatch:
                    optimizedAnalysis.jobMatch,
                },
              },
          },
        };

        // ========================================
        // STEP 7
        // UPDATE CURRENT DASHBOARD
        // ========================================

        setAnalysis(
          finalAnalysis
        );

        setProgress(100);

        console.log(
          "✅ Dashboard analysis state updated"
        );

        // ========================================
        // STEP 8
        // SAVE TO MONGODB
        // ========================================

        if (user?.id) {
          try {
            console.log(
              "========================================"
            );

            console.log(
              "💾 STEP 8: SAVING OPTIMIZED RESUME"
            );

            console.log(
              "========================================"
            );

            if (editingResume) {
              // ==================================
              // UPDATE EXISTING RESUME
              // ==================================

              await api.put(
                `/resume/${editingResume._id}`,
                {
                  jobDescription,

                  analysis:
                    finalAnalysis,
                }
              );

              toast.success(
                "Optimized resume updated successfully"
              );

              setEditingResume(
                null
              );
            } else {
              // ==================================
              // CREATE NEW RESUME HISTORY
              // ==================================

              await api.post(
                "/resume/save",
                {
                  clerkId:
                    user.id,

                  fileName:
                    file.name,

                  jobDescription,

                  analysis:
                    finalAnalysis,
                }
              );

              toast.success(
                "Optimized resume saved successfully"
              );
            }

            await fetchHistory();

            console.log(
              "✅ Resume history updated"
            );
          } catch (dbErr) {
            console.error(
              "❌ Database Save Error:",
              dbErr
            );

            toast.warning(
              "Resume optimized, but couldn't be saved to history."
            );
          }
        }

        // ========================================
        // STEP 9
        // FINAL SUCCESS MESSAGE
        // ========================================

        if (
          atsImprovement > 0
        ) {
          toast.success(
            `Resume improved! ATS increased by ${atsImprovement} points.`
          );
        } else if (
          atsImprovement === 0
        ) {
          toast.success(
            "Resume optimized successfully. ATS score stayed the same."
          );
        } else {
          toast.success(
            "Resume optimized successfully."
          );
        }

        console.log(
          "========================================"
        );

        console.log(
          "🎉 COMPLETE AI RESUME OPTIMIZATION FLOW"
        );

        console.log(
          "========================================"
        );

        console.log(
          "Original ATS:",
          originalAnalysis.atsScore
        );

        console.log(
          "Optimized ATS:",
          optimizedAnalysis.atsScore
        );

        console.log(
          "ATS Improvement:",
          atsImprovement
        );

        console.log(
          "Original Job Match:",
          originalAnalysis.jobMatch
        );

        console.log(
          "Optimized Job Match:",
          optimizedAnalysis.jobMatch
        );

        console.log(
          "Job Match Improvement:",
          jobMatchImprovement
        );

        console.log(
          "========================================"
        );

        return finalAnalysis;
      } catch (err) {
        clearInterval(crawl);

        setProgress(0);

        console.error(
          "========================================"
        );

        console.error(
          "❌ RESUME ANALYSIS/OPTIMIZATION FAILED"
        );

        console.error(
          err
        );

        console.error(
          "========================================"
        );

        if (
          err instanceof
          ResumeParseError
        ) {
          toast.error(
            err.message
          );
        } else {
          const backendMessage =
            err?.response?.data?.message;

          toast.error(
            backendMessage ||
              err?.message ||
              "Resume optimization failed. Please try again."
          );
        }

        return null;
      } finally {
        clearInterval(crawl);

        setLoading(false);
      }
    }, [
      file,
      jobDescription,
      user,
      fetchHistory,
      editingResume,
    ]);

  // ==========================================
  // RESET
  // ==========================================

  const reset =
    useCallback(() => {
      setFile(null);

      setResumeText("");

      setAnalysis(null);

      setEditingResume(null);

      setProgress(0);

      setJobDescription("");
    }, []);

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  return (
    <ResumeContext.Provider
      value={{
        file,
        setFile,

        jobDescription,
        setJobDescription,

        resumeText,

        analysis,
        setAnalysis,

        history,
        fetchHistory,
        deleteResume,

        editingResume,
        setEditingResume,

        analyze,

        loading,
        progress,

        reset,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

// ==========================================
// NORMALIZE ANALYZE API RESPONSE
// ==========================================
//
// Your backend may return:
//
// {
//   success: true,
//   analysis: {...}
// }
//
// OR:
//
// {
//   success: true,
//   result: {...}
// }
//
// OR:
//
// the analysis object directly.
//
// This helper supports all three.
// ==========================================

function normalizeAnalysisResponse(
  response
) {
  if (!response) {
    throw new Error(
      "Backend returned an empty analysis response."
    );
  }

  let result =
    response.analysis ||
    response.result ||
    response.data?.analysis ||
    response.data?.result;

  // If there is no nested analysis object,
  // assume the response itself is the analysis.
  if (!result) {
    result = response;
  }

  // Make a copy so we don't accidentally
  // mutate the original API response.
  if (
    result &&
    typeof result === "object"
  ) {
    result = {
      ...result,
    };
  }

  // ========================================
  // SCORE VALIDATION
  // ========================================

  if (
    typeof result.atsScore !==
    "number"
  ) {
    throw new Error(
      "Backend analysis did not return a valid ATS score."
    );
  }

  if (
    typeof result.jobMatch !==
    "number"
  ) {
    throw new Error(
      "Backend analysis did not return a valid job match score."
    );
  }

  // ========================================
  // ARRAY NORMALIZATION
  // ========================================

  if (
    !Array.isArray(
      result.missingKeywords
    )
  ) {
    result.missingKeywords =
      [];
  }

  if (
    !Array.isArray(
      result.suggestions
    )
  ) {
    result.suggestions =
      [];
  }

  if (
    !Array.isArray(
      result.matchedSkills
    )
  ) {
    result.matchedSkills =
      [];
  }

  if (
    !Array.isArray(
      result.metrics
    )
  ) {
    result.metrics =
      [];
  }

  // ========================================
  // GRADE
  // ========================================

  if (!result.grade) {
    result.grade =
      scoreToGrade(
        result.atsScore
      );
  }

  return result;
}

// ==========================================
// SCORE → GRADE
// ==========================================

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
    return "B-";
  }

  if (value >= 75) {
    return "C";
  }

  if (value >= 70) {
    return "C-";
  }

  if (value >= 60) {
    return "D";
  }

  return "F";
}