import { createFileRoute } from "@tanstack/react-router";
import Home from "@/pages/Home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ResumeAI — AI-powered resume analyzer & ATS score" },
      {
        name: "description",
        content:
          "Upload your resume and get an instant ATS score, job-match analysis and AI-powered rewrites. Built for modern job seekers.",
      },
      { property: "og:title", content: "ResumeAI — AI-powered resume analyzer" },
      {
        property: "og:description",
        content:
          "Instant ATS score, skill gap analysis and AI rewrite suggestions for your resume.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});
