import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  FiArrowRight,
  FiFileText,
  FiUploadCloud,
  FiClock,
  FiEye,
  FiTrash2,
  FiEdit2,
  FiZap,
  FiTrendingUp,
  FiCheckCircle,
  FiDownload,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";
import jsPDF from "jspdf";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScoreCard from "@/components/ScoreCard";
import AnalysisCard from "@/components/AnalysisCard";
import SkillsChart from "@/components/SkillsChart";
import Suggestions from "@/components/Suggestions";
import { useResume } from "@/hooks/useResume";

export default function Dashboard() {
  const {
    analysis,
    setAnalysis,
    history,
    deleteResume,
    file,
    reset,
    setEditingResume,
    setJobDescription,
  } = useResume();

  const navigate = useNavigate();

  // ==========================================
  // AI OPTIMIZATION DATA
  // ==========================================

  const optimization = analysis?.optimization;

  const originalATS = Number(
    optimization?.originalAnalysis?.atsScore ?? analysis?.atsScore ?? 0
  );

  const optimizedATS = Number(
    optimization?.optimizedAnalysis?.atsScore ?? analysis?.atsScore ?? 0
  );

  const originalJobMatch = Number(
    optimization?.originalAnalysis?.jobMatch ?? analysis?.jobMatch ?? 0
  );

  const optimizedJobMatch = Number(
    optimization?.optimizedAnalysis?.jobMatch ?? analysis?.jobMatch ?? 0
  );

  const atsImprovement = Number(
    optimization?.atsImprovement ?? optimizedATS - originalATS
  );

  const jobMatchImprovement = Number(
    optimization?.jobMatchImprovement ?? optimizedJobMatch - originalJobMatch
  );

  const improvementsMade = Array.isArray(optimization?.improvementsMade)
    ? optimization.improvementsMade
    : [];

  const recommendedSkillsToLearn = dedupeSkills(
    Array.isArray(optimization?.recommendedSkillsToLearn)
      ? optimization.recommendedSkillsToLearn
      : []
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pt-6 pb-16">
        {/* ==========================================
            DASHBOARD HEADER
        ========================================== */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Dashboard
            </div>

            <h1 className="mt-1 text-3xl md:text-4xl font-semibold tracking-tight">
              Your resume, <span className="gradient-text">analyzed</span>
            </h1>

            {file && (
              <div className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <FiFileText className="h-4 w-4" />
                {file.name}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {analysis && (
              <button
                onClick={reset}
                className="glass rounded-xl px-4 py-2.5 text-sm hover:text-foreground text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Reset current analysis"
              >
                Reset
              </button>
            )}

            <Link
              to="/"
              hash="upload"
              className="inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] animate-gradient px-4 py-2.5 text-sm font-medium text-white hover:scale-[1.03] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <FiUploadCloud className="h-4 w-4" />
              Upload new
            </Link>
          </div>
        </div>

        {/* ==========================================
            RESUME HISTORY
        ========================================== */}

        {history.length > 0 && (
          <div className="glass card-shadow rounded-3xl p-6 mb-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Resume History
                </div>

                <h2 className="text-2xl font-semibold mt-1">
                  Previous Analyses
                </h2>
              </div>

              <span className="glass rounded-full px-3 py-1 text-xs">
                {history.length} Resume{history.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-4">
              {history.map((resume) => (
                <div
                  key={resume._id}
                  className="glass rounded-2xl border border-white/10 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  {/* Resume information */}

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FiFileText className="text-primary" />

                      <h3 className="font-medium">{resume.fileName}</h3>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>
                        ATS Score:
                        <strong className="ml-1 text-foreground">
                          {resume.atsScore}
                        </strong>
                      </span>

                      <span>
                        Job Match:
                        <strong className="ml-1 text-foreground">
                          {resume.jobMatch}%
                        </strong>
                      </span>

                      <span className="flex items-center gap-1">
                        <FiClock className="h-3 w-3" />
                        {new Date(resume.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* History actions */}

                  <div className="flex items-center gap-2">
                    {/* View */}

                    <button
                      onClick={() => {
                        setAnalysis(resume.analysis);
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-5 py-2.5 text-sm font-medium text-white hover:scale-[1.02] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`View analysis for ${resume.fileName}`}
                    >
                      <FiEye className="h-4 w-4" />
                      View
                    </button>

                    {/* Edit */}

                    <button
                      onClick={() => {
                        setEditingResume(resume);
                        setJobDescription(resume.jobDescription || "");
                        setAnalysis(resume.analysis);

                        navigate({
                          to: "/",
                          hash: "upload",
                        });
                      }}
                      className="inline-flex items-center justify-center rounded-xl border border-blue-500 px-4 py-2.5 text-blue-500 hover:bg-blue-500 hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                      aria-label={`Edit resume ${resume.fileName}`}
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>

                    {/* Delete */}

                    <button
                      onClick={() => deleteResume(resume._id)}
                      className="inline-flex items-center justify-center rounded-xl border border-red-500 px-4 py-2.5 text-red-500 hover:bg-red-500 hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      aria-label={`Delete resume ${resume.fileName}`}
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            ANALYSIS
        ========================================== */}

        {!analysis ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {/* Main ATS score */}

            <ScoreCard analysis={analysis} />

            {/* ==========================================
                AI OPTIMIZATION RESULT
            ========================================== */}

            {optimization && (
              <AIOptimizationCard
                originalATS={originalATS}
                optimizedATS={optimizedATS}
                originalJobMatch={originalJobMatch}
                optimizedJobMatch={optimizedJobMatch}
                atsImprovement={atsImprovement}
                jobMatchImprovement={jobMatchImprovement}
                improvementsMade={improvementsMade}
                recommendedSkillsToLearn={recommendedSkillsToLearn}
                optimizedResumeText={optimization.optimizedResumeText}
              />
            )}

            {/* Other analysis sections */}

            <AnalysisCard analysis={analysis} />

            <SkillsChart analysis={analysis} />

            <Suggestions analysis={analysis} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

/* ==================================================
   SKILL NORMALIZATION / DEDUPE
================================================== */

function dedupeSkills(skills) {
  const seen = new Map();

  skills.forEach((skill) => {
    const label =
      typeof skill === "string"
        ? skill
        : skill?.name || skill?.title || skill?.skill || "";

    const trimmed = String(label || "").trim();

    if (!trimmed) return;

    const normalized = trimmed
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

    if (!normalized) return;

    // Keep the first (nicest-cased) version we encounter for a given
    // normalized key, e.g. "React" wins over a later "react".
    if (!seen.has(normalized)) {
      seen.set(normalized, trimmed);
    }
  });

  return Array.from(seen.values());
}

/* ==================================================
   PDF TEXT CLEANING
================================================== */

function cleanPdfText(value) {
  return String(value || "")
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/Ø=Üp/gi, "")
    .replace(/Ø=Ũ/gi, "")
    .replace(/Ø=Ü/gi, "")
    .replace(/Ø=/gi, "")
    .replace(/â€™/g, "'")
    .replace(/â€˜/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€\u009d/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€“/g, "-")
    .replace(/â€”/g, "-")
    .replace(/Â/g, "")
    .replace(/[•●▪◦‣]/g, "-")
    .replace(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}]/gu,
      ""
    )
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
}

/* ==================================================
   FILENAME SANITIZATION
================================================== */

function buildResumeFilename(nameLine) {
  const fallback = "AI-Optimized-Resume.pdf";

  const cleaned = cleanPdfText(nameLine)
    .replace(/[^a-zA-Z\s-]/g, "")
    .trim();

  if (!cleaned) return fallback;

  const slug = cleaned
    .split(/\s+/)
    .filter(Boolean)
    .join("-");

  if (!slug) return fallback;

  return `${slug}-AI-Optimized-Resume.pdf`;
}

/* ==================================================
   RESUME PDF GENERATOR
   Renders optimizedResumeText as a clean, ATS-friendly,
   selectable-text A4 PDF using jsPDF primitives only.
================================================== */

function generateResumePdf(optimizedResumeText) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const marginLeft = 17;
  const marginRight = 17;
  const marginTop = 16;
  const marginBottom = 16;

  const contentWidth = pageWidth - marginLeft - marginRight;

  let y = marginTop;

  // Colors
  const BLACK = [25, 25, 25];
  const DARK_GRAY = [60, 60, 60];
  const GRAY = [110, 110, 110];
  const LIGHT_GRAY = [222, 222, 222];
  const PRIMARY = [91, 72, 190];

  const resumeText = cleanPdfText(optimizedResumeText);
  const rawLines = resumeText.split("\n");

  // -----------------------------------------------
  // Page helpers
  // -----------------------------------------------

  const addPage = () => {
    doc.addPage();
    y = marginTop;
  };

  const ensureSpace = (requiredHeight) => {
    if (y + requiredHeight > pageHeight - marginBottom) {
      addPage();
    }
  };

  // -----------------------------------------------
  // Vector bullet (avoids relying on the Unicode
  // bullet glyph rendering correctly in Helvetica)
  // -----------------------------------------------

  const drawBullet = (x, baselineY) => {
    doc.setFillColor(...DARK_GRAY);
    doc.circle(x, baselineY - 1.3, 0.6, "F");
  };

  // -----------------------------------------------
  // Footer (applied after all pages are rendered)
  // -----------------------------------------------

  const addFooters = () => {
    const totalPages = doc.internal.getNumberOfPages();

    for (let page = 1; page <= totalPages; page++) {
      doc.setPage(page);

      doc.setDrawColor(...LIGHT_GRAY);
      doc.setLineWidth(0.25);
      doc.line(
        marginLeft,
        pageHeight - 12,
        pageWidth - marginRight,
        pageHeight - 12
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...GRAY);

      doc.text("AI-Optimized Resume", marginLeft, pageHeight - 7);
      doc.text(`Page ${page} of ${totalPages}`, pageWidth - marginRight, pageHeight - 7, {
        align: "right",
      });
    }
  };

  // -----------------------------------------------
  // Section / line classification
  // -----------------------------------------------

  const sectionNames = [
    "professional summary",
    "summary",
    "career objective",
    "objective",
    "education",
    "technical skills",
    "skills",
    "technical skills & tools",
    "projects",
    "experience",
    "work experience",
    "professional experience",
    "internship",
    "internships",
    "certifications",
    "achievements",
    "languages",
    "interests",
    "additional information",
    "additional activities",
    "portfolio & digital presence",
  ];

  const isSectionHeading = (line) => {
    const normalized = line.replace(/[:：]$/, "").trim().toLowerCase();
    return sectionNames.includes(normalized);
  };

  const isContactLine = (line) =>
    line.includes("@") ||
    line.includes("github.com") ||
    line.includes("linkedin.com") ||
    /portfolio/i.test(line) ||
    /\+?\d[\d\s()-]{7,}/.test(line);

  const isBulletLine = (line) =>
    /^[-*]\s+/.test(line) || /^\d+[.)]\s+/.test(line);

  const removeBulletPrefix = (line) =>
    line.replace(/^[-*]\s+/, "").replace(/^\d+[.)]\s+/, "").trim();

  const titleSections = new Set([
    "projects",
    "experience",
    "work experience",
    "professional experience",
    "internship",
    "internships",
  ]);

  let nameFound = false;
  let currentSection = "";

  for (let index = 0; index < rawLines.length; index++) {
    const line = cleanPdfText(rawLines[index]);

    if (!line) {
      y += 3;
      continue;
    }

    // NAME (first non-empty line)
    if (!nameFound) {
      ensureSpace(20);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(...BLACK);
      doc.text(line, marginLeft, y);

      y += 8;
      nameFound = true;
      continue;
    }

    // SECTION HEADING
    if (isSectionHeading(line)) {
      currentSection = line.toLowerCase().replace(/[:：]$/, "").trim();

      y += 4;
      ensureSpace(18);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...BLACK);
      doc.text(line.toUpperCase(), marginLeft, y);

      y += 4.5;

      doc.setDrawColor(...PRIMARY);
      doc.setLineWidth(0.5);
      doc.line(marginLeft, y, pageWidth - marginRight, y);

      y += 5;
      continue;
    }

    // CONTACT / SUBTITLE LINE (only before the first section starts)
    if (!currentSection && isContactLine(line)) {
      ensureSpace(12);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.8);
      doc.setTextColor(...DARK_GRAY);

      const contactParts = line
        .split("|")
        .map((part) => cleanPdfText(part))
        .filter(Boolean);

      const contactText = contactParts.join("   |   ");
      const contactLines = doc.splitTextToSize(contactText, contentWidth);

      doc.text(contactLines, marginLeft, y);
      y += contactLines.length * 4 + 4;
      continue;
    }

    // BULLET
    if (isBulletLine(line)) {
      const bulletText = removeBulletPrefix(line);
      const bulletLines = doc.splitTextToSize(bulletText, contentWidth - 6);

      ensureSpace(bulletLines.length * 4.8 + 2.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...DARK_GRAY);

      drawBullet(marginLeft + 1, y);
      doc.text(bulletLines, marginLeft + 5, y);

      y += bulletLines.length * 4.8 + 2.5;
      continue;
    }

    // PROJECT / EXPERIENCE TITLE LINE
    const looksLikeTitle =
      titleSections.has(currentSection) &&
      line.length < 100 &&
      !line.includes(":");

    if (looksLikeTitle) {
      ensureSpace(12);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(...BLACK);

      const titleLines = doc.splitTextToSize(line, contentWidth);
      doc.text(titleLines, marginLeft, y);

      y += titleLines.length * 5 + 1;
      continue;
    }

    // LABEL : VALUE (e.g. "Languages & Core: HTML, CSS, JS")
    if (line.includes(":") && line.length < 200) {
      const colonIndex = line.indexOf(":");
      const label = line.slice(0, colonIndex + 1).trim();
      const value = line.slice(colonIndex + 1).trim();

      if (value) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        const labelWidth = doc.getTextWidth(label);

        // Short labels (e.g. "Location:") sit inline before the value.
        // Long labels (e.g. "Languages & Frameworks:") get their own
        // line so the value never overlaps the label text.
        const inlineGap = 3;
        const canInline = labelWidth + inlineGap < 42;

        if (canInline) {
          const valueLines = doc.splitTextToSize(
            value,
            contentWidth - labelWidth - inlineGap
          );

          ensureSpace(valueLines.length * 4.8 + 3);

          doc.setTextColor(...BLACK);
          doc.text(label, marginLeft, y);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(...DARK_GRAY);
          doc.text(valueLines, marginLeft + labelWidth + inlineGap, y);

          y += valueLines.length * 4.8 + 3;
        } else {
          const valueLines = doc.splitTextToSize(value, contentWidth);

          ensureSpace(4.8 + valueLines.length * 4.8 + 3);

          doc.setTextColor(...BLACK);
          doc.text(label, marginLeft, y);
          y += 4.8;

          doc.setFont("helvetica", "normal");
          doc.setTextColor(...DARK_GRAY);
          doc.text(valueLines, marginLeft, y);

          y += valueLines.length * 4.8 + 3;
        }

        continue;
      }
    }

    // NORMAL PARAGRAPH (also covers the role/tagline line under the name)
    const isSubtitle = !currentSection && y < marginTop + 16;

    doc.setFont("helvetica", isSubtitle ? "normal" : "normal");
    doc.setFontSize(isSubtitle ? 11 : 9.5);
    doc.setTextColor(...(isSubtitle ? GRAY : DARK_GRAY));

    const paragraphLines = doc.splitTextToSize(line, contentWidth);

    ensureSpace(paragraphLines.length * (isSubtitle ? 5.5 : 4.8) + 3);

    doc.text(paragraphLines, marginLeft, y);

    y += paragraphLines.length * (isSubtitle ? 5.5 : 4.8) + (isSubtitle ? 2 : 3);
  }

  addFooters();

  const firstLine = rawLines.find((l) => cleanPdfText(l).length > 0) || "";
  const filename = buildResumeFilename(firstLine);

  doc.save(filename);
}

/* ==================================================
   AI OPTIMIZATION CARD
================================================== */

function AIOptimizationCard({
  originalATS,
  optimizedATS,
  originalJobMatch,
  optimizedJobMatch,
  atsImprovement,
  jobMatchImprovement,
  improvementsMade,
  recommendedSkillsToLearn,
  optimizedResumeText,
}) {
  // download status: "idle" | "loading" | "success" | "error"
  const [downloadStatus, setDownloadStatus] = useState("idle");
  const [downloadError, setDownloadError] = useState("");

  const hasResumeText = Boolean(optimizedResumeText && optimizedResumeText.trim());

  const handleDownload = async () => {
    if (!hasResumeText) {
      setDownloadStatus("error");
      setDownloadError("Optimized resume text isn't available yet.");
      return;
    }

    setDownloadStatus("loading");
    setDownloadError("");

    try {
      // Yield a tick so the loading state can paint before the
      // (synchronous, CPU-bound) PDF generation runs.
      await new Promise((resolve) => setTimeout(resolve, 50));

      generateResumePdf(optimizedResumeText);

      setDownloadStatus("success");

      setTimeout(() => {
        setDownloadStatus((current) => (current === "success" ? "idle" : current));
      }, 3500);
    } catch (error) {
      console.error("PDF generation error:", error);
      setDownloadStatus("error");
      setDownloadError("Unable to generate the PDF. Please try again.");
    }
  };

  // ==========================================
  // IMPROVEMENT STATE
  // ==========================================

  const hasATSImprovement = atsImprovement > 0;
  const hasJobMatchImprovement = jobMatchImprovement > 0;
  const hasAnyImprovement = hasATSImprovement || hasJobMatchImprovement;

  return (
    <section className="glass card-shadow rounded-3xl p-6 md:p-8">
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs text-primary">
            <FiZap className="h-3.5 w-3.5" />
            AI Resume Optimizer
          </div>

          <h2 className="mt-3 text-2xl font-semibold">
            {hasAnyImprovement
              ? "Your resume has been improved"
              : "Your resume has been optimized"}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            AI analyzed your resume, optimized it for the target job, and
            checked the result again.
          </p>
        </div>

        {/* IMPROVEMENT BADGE */}

        {hasAnyImprovement && (
          <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 border border-green-500/20 px-4 py-2 text-sm text-green-400">
            <FiTrendingUp className="h-4 w-4" />

            {hasATSImprovement && <span>+{atsImprovement} ATS points</span>}

            {hasATSImprovement && hasJobMatchImprovement && <span>·</span>}

            {hasJobMatchImprovement && (
              <span>+{jobMatchImprovement} Job Match</span>
            )}
          </div>
        )}
      </div>

      {/* ==========================================
          BEFORE / AFTER
      ========================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* ATS SCORE */}

        <div className="glass rounded-2xl border border-white/10 p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            ATS Score
          </div>

          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Before</div>
              <div className="text-3xl font-bold">{originalATS}</div>
            </div>

            <FiArrowRight className="h-5 w-5 text-primary mb-2" />

            <div>
              <div className="text-sm text-muted-foreground">After</div>
              <div className="text-3xl font-bold gradient-text">
                {optimizedATS}
              </div>
            </div>
          </div>

          <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[image:var(--gradient-primary)] transition-all"
              style={{
                width: `${Math.min(Math.max(optimizedATS, 0), 100)}%`,
              }}
            />
          </div>

          {atsImprovement !== 0 && (
            <div
              className={`mt-3 text-xs ${
                atsImprovement > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {atsImprovement > 0
                ? `+${atsImprovement} points`
                : `${atsImprovement} points`}
            </div>
          )}
        </div>

        {/* JOB MATCH */}

        <div className="glass rounded-2xl border border-white/10 p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Job Match
          </div>

          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Before</div>
              <div className="text-3xl font-bold">{originalJobMatch}%</div>
            </div>

            <FiArrowRight className="h-5 w-5 text-primary mb-2" />

            <div>
              <div className="text-sm text-muted-foreground">After</div>
              <div className="text-3xl font-bold gradient-text">
                {optimizedJobMatch}%
              </div>
            </div>
          </div>

          <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[image:var(--gradient-primary)] transition-all"
              style={{
                width: `${Math.min(Math.max(optimizedJobMatch, 0), 100)}%`,
              }}
            />
          </div>

          {jobMatchImprovement !== 0 && (
            <div
              className={`mt-3 text-xs ${
                jobMatchImprovement > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {jobMatchImprovement > 0
                ? `+${jobMatchImprovement} points`
                : `${jobMatchImprovement} points`}
            </div>
          )}
        </div>
      </div>

      {/* ==========================================
          IMPROVEMENTS MADE
      ========================================== */}

      {improvementsMade.length > 0 && (
        <div className="mt-6">
          <div className="text-sm font-semibold">Improvements made by AI</div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {improvementsMade.map((item, index) => {
              const text =
                typeof item === "string" ? item : item?.detail || item?.title || "";

              if (!text) return null;

              return (
                <div
                  key={index}
                  className="flex items-start gap-3 glass rounded-xl p-3"
                >
                  <FiCheckCircle className="mt-0.5 h-4 w-4 text-green-400 shrink-0" />
                  <div className="text-sm text-muted-foreground">{text}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==========================================
          RECOMMENDED SKILLS
      ========================================== */}

      {recommendedSkillsToLearn.length > 0 && (
        <div className="mt-6">
          <div className="text-sm font-semibold">
            Recommended skills to learn
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {recommendedSkillsToLearn.map((skill, index) => (
              <span
                key={index}
                className="glass rounded-full px-3 py-1 text-xs text-primary border border-primary/10"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          DOWNLOAD OPTIMIZED PDF — SaaS-style card
      ========================================== */}

      {optimizedResumeText && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 md:p-6">
            {/* subtle ambient accent */}
            <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative flex flex-col md:flex-row md:items-center gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[image:var(--gradient-primary)] text-white shadow-lg">
                <FiFileText className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <h3 className="text-base font-semibold">
                  AI-Optimized Resume
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Download a professionally formatted, ATS-friendly PDF
                  version of your resume, ready to send to recruiters.
                </p>

                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>ATS-friendly</span>
                  <span aria-hidden="true">•</span>
                  <span>A4</span>
                  <span aria-hidden="true">•</span>
                  <span>Ready to apply</span>
                </div>
              </div>

              <button
                onClick={handleDownload}
                disabled={downloadStatus === "loading" || !hasResumeText}
                aria-label="Download AI-optimized resume as PDF"
                className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-lg transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0 ${
                  downloadStatus === "loading" || !hasResumeText
                    ? "bg-[image:var(--gradient-primary)] opacity-70 cursor-not-allowed"
                    : "bg-[image:var(--gradient-primary)] animate-gradient hover:scale-[1.02]"
                }`}
              >
                {downloadStatus === "loading" ? (
                  <>
                    <FiLoader className="h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : downloadStatus === "success" ? (
                  <>
                    <FiCheckCircle className="h-4 w-4" />
                    Downloaded
                  </>
                ) : (
                  <>
                    <FiDownload className="h-4 w-4" />
                    Download AI-Optimized Resume
                  </>
                )}
              </button>
            </div>

            {/* Success / error feedback */}

            {downloadStatus === "success" && (
              <div className="relative mt-4 flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs text-green-400">
                <FiCheckCircle className="h-3.5 w-3.5 shrink-0" />
                Resume PDF downloaded successfully.
              </div>
            )}

            {downloadStatus === "error" && (
              <div className="relative mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
                {downloadError || "Unable to generate the PDF. Please try again."}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/* ==================================================
   EMPTY STATE
================================================== */

function EmptyState() {
  return (
    <div className="glass card-shadow rounded-3xl p-10 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
        <FiFileText className="h-7 w-7" />
      </div>

      <h2 className="mt-5 text-2xl font-semibold">No analysis selected</h2>

      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
        Upload a new resume or choose one from your saved resume history
        above to view its AI analysis.
      </p>

      <Link
        to="/"
        hash="upload"
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[image:var(--gradient-primary)] animate-gradient px-6 py-3.5 text-sm font-semibold text-white hover:scale-[1.03] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        Upload Resume
        <FiArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}