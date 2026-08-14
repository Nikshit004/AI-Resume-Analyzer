/**
 * src/lib/useResume.js
 *
 * Resume analysis + automatic AI optimization.
 */

import { useCallback, useState } from "react";
import { toast } from "sonner";

import {
  extractResumeText,
  ResumeParseError,
} from "@/lib/resume-parser";

import {
  analyzeResume as analyzeResumeAI,
} from "@/lib/analyze-resume.server";

import {
  optimizeResume,
} from "@/services/api";

export function useResume() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const [analysis, setAnalysis] = useState(null);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const analyze = useCallback(async () => {
    if (!file) {
      toast.error("Upload a resume first.");
      return null;
    }

    setLoading(true);
    setProgress(5);

    let crawl;

    const startCrawl = (from, to, ms) => {
      clearInterval(crawl);

      setProgress(from);

      crawl = setInterval(() => {
        setProgress((p) =>
          p < to ? p + 1 : p
        );
      }, ms);
    };

    try {
      // ==================================================
      // STEP 1 — Extract resume text
      // ==================================================

      console.log(
        "========== STEP 1: RESUME EXTRACTION =========="
      );

      startCrawl(5, 30, 60);

      const resumeText =
        await extractResumeText(file);

      clearInterval(crawl);

      setProgress(35);

      console.log(
        "✅ Resume text extracted:",
        resumeText.length,
        "characters"
      );

      // ==================================================
      // STEP 2 — Original AI Analysis
      // ==================================================

      console.log(
        "========== STEP 2: ORIGINAL AI ANALYSIS =========="
      );

      startCrawl(35, 55, 100);

      const originalAnalysis =
        await analyzeResumeAI({
          data: {
            resumeText,
            jobDescription,
          },
        });

      clearInterval(crawl);

      setProgress(60);

      console.log(
        "✅ Original analysis completed"
      );

      console.log(
        "📊 Original ATS:",
        originalAnalysis.atsScore
      );

      console.log(
        "🎯 Original Job Match:",
        originalAnalysis.jobMatch
      );

      // ==================================================
      // STEP 3 — Automatic AI Optimization
      // ==================================================

      console.log(
        "========== STEP 3: AI RESUME OPTIMIZER =========="
      );

      toast.success(
        "Analysis complete. AI is now optimizing your resume..."
      );

      startCrawl(60, 78, 120);

      const optimizedResume =
        await optimizeResume({
          file,
          jobDescription,
          analysis: originalAnalysis,
        });

      clearInterval(crawl);

      setProgress(80);

      if (
        !optimizedResume ||
        !optimizedResume.success ||
        !optimizedResume.optimizedResumeText
      ) {
        throw new Error(
          "AI optimizer did not return an updated resume."
        );
      }

      console.log(
        "✅ AI optimization completed"
      );

      console.log(
        "✨ Optimized resume generated"
      );

      // ==================================================
      // STEP 4 — Re-analyze optimized resume
      // ==================================================

      console.log(
        "========== STEP 4: RE-ANALYZING UPDATED RESUME =========="
      );

      toast.success(
        "Updated resume created. Checking the new ATS score..."
      );

      startCrawl(80, 95, 120);

      const optimizedAnalysis =
        await analyzeResumeAI({
          data: {
            resumeText:
              optimizedResume.optimizedResumeText,

            jobDescription,
          },
        });

      clearInterval(crawl);

      setProgress(100);

      console.log(
        "✅ Optimized resume re-analysis completed"
      );

      console.log(
        "📊 New ATS:",
        optimizedAnalysis.atsScore
      );

      console.log(
        "🎯 New Job Match:",
        optimizedAnalysis.jobMatch
      );

      // ==================================================
      // STEP 5 — Calculate improvement
      // ==================================================

      const atsImprovement =
        optimizedAnalysis.atsScore -
        originalAnalysis.atsScore;

      const jobMatchImprovement =
        optimizedAnalysis.jobMatch -
        originalAnalysis.jobMatch;

      console.log(
        "📈 ATS Improvement:",
        atsImprovement
      );

      console.log(
        "📈 Job Match Improvement:",
        jobMatchImprovement
      );

      // ==================================================
      // STEP 6 — Store everything
      // ==================================================

      const finalAnalysis = {
        // IMPORTANT:
        // Keep the optimized analysis at the top level
        // so existing Dashboard components continue
        // working without UI changes.

        ...optimizedAnalysis,

        // Keep complete before/after information
        // inside optimization.
        optimization: {
          originalAnalysis,

          optimizedAnalysis,

          optimizedResume,

          originalResumeText: resumeText,

          optimizedResumeText:
            optimizedResume.optimizedResumeText,

          atsImprovement,

          jobMatchImprovement,

          recommendedSkillsToLearn:
            optimizedResume.recommendedSkillsToLearn ||
            [],

          improvementsMade:
            optimizedResume.improvementsMade ||
            [],
        },
      };

      setAnalysis(finalAnalysis);

      toast.success(
        atsImprovement > 0
          ? `Resume improved! ATS increased by ${atsImprovement} points.`
          : "Updated resume generated successfully."
      );

      console.log(
        "=============================================="
      );

      console.log(
        "🎉 COMPLETE RESUME OPTIMIZATION FLOW FINISHED"
      );

      console.log(
        "Original ATS:",
        originalAnalysis.atsScore
      );

      console.log(
        "New ATS:",
        optimizedAnalysis.atsScore
      );

      console.log(
        "ATS Improvement:",
        atsImprovement
      );

      console.log(
        "=============================================="
      );

      return finalAnalysis;

    } catch (err) {
      clearInterval(crawl);

      setProgress(0);

      console.error(
        "❌ Resume analysis/optimization failed:"
      );

      console.error(err);

      if (err instanceof ResumeParseError) {
        toast.error(err.message);
      } else {
        toast.error(
          err?.message ||
          "Resume optimization failed. Please try again."
        );
      }

      return null;

    } finally {
      clearInterval(crawl);
      setLoading(false);
    }
  }, [file, jobDescription]);

  return {
    file,
    setFile,

    jobDescription,
    setJobDescription,

    analysis,
    setAnalysis,

    analyze,

    loading,
    progress,
  };
}