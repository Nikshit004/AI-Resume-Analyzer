import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import {
  FiUploadCloud,
  FiFileText,
  FiX,
  FiZap,
  FiBriefcase,
} from "react-icons/fi";
import { useResume } from "@/hooks/useResume";

const ACCEPT = ".pdf,.txt";
const MAX_MB = 5;

export default function ResumeUpload() {
  const {
    file,
    setFile,
    jobDescription,
    setJobDescription,
    analyze,
    loading,
    progress,
    editingResume,
  } = useResume();
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  const onFiles = (files) => {
    const f = files?.[0];
    if (!f) return;
    if (f.size > MAX_MB * 1024 * 1024) {
      toast.error(`File exceeds ${MAX_MB}MB`);
      return;
    }
    setFile(f);
    toast.success("Resume uploaded");
  };

  const onSubmit = async () => {
    // If user is not logged in
    if (!isSignedIn) {
      toast.info("Please sign in to analyze your resume.");

      navigate({
        to: "/sign-in",
      });

      return;
    }

    // Continue with analysis
    const result = await analyze();

    if (result) {
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <section id="upload" className="mx-auto max-w-5xl px-4 pb-24">
      <div className="glass card-shadow rounded-3xl p-6 md:p-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Analyze your resume
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              PDF, DOC or DOCX up to {MAX_MB}MB. Everything stays private to your browser.
            </p>
          </div>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            onFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`group relative cursor-pointer rounded-2xl border-2 border-dashed p-8 md:p-12 text-center transition-all ${dragOver
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
            }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />

          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] animate-gradient shadow-lg group-hover:scale-105 transition-transform">
            <FiUploadCloud className="h-8 w-8 text-white" />
          </div>
          <h3 className="mt-5 text-lg font-semibold">
            Drag & drop your resume, or <span className="gradient-text">browse</span>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Supported: PDF, DOC, DOCX, TXT
          </p>
        </div>

        {file && (
          <div className="mt-5 flex items-center justify-between gap-4 glass rounded-xl px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
                <FiFileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{file.name}</div>
                <div className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </div>
              </div>
            </div>
            <button
              onClick={() => setFile(null)}
              className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-white/5"
              aria-label="Remove file"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mt-6">
          <label className="mb-2 flex items-center gap-2 text-sm font-medium">
            <FiBriefcase className="h-4 w-4 text-secondary" />
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={5}
            placeholder="Paste the job description here..."
             className="w-full resize-none rounded-xl bg-white/[0.03] border border-white/10 p-4 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/25 transition"
          />
        </div>

        <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <button
            onClick={onSubmit}
            disabled={loading || !file}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[image:var(--gradient-primary)] animate-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
          >
            <FiZap className="h-4 w-4" />
            {loading
              ? "Analyzing..."
              : editingResume
                ? "Analyze Again"
                : "Analyze Resume"}          </button>

          {loading && (
            <div className="flex-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-[image:var(--gradient-primary)] transition-[width] duration-200"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Parsing · scoring · matching keywords…
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


