import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/pages/Dashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · ResumeAI" },
      {
        name: "description",
        content:
          "Your personalised ResumeAI dashboard: ATS score, job match, skill gaps and AI recommendations.",
      },
      { property: "og:title", content: "ResumeAI Dashboard" },
      {
        property: "og:description",
        content: "Live breakdown of your resume with AI-powered recommendations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});
