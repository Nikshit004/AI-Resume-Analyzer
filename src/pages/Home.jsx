import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ResumeUpload from "@/components/ResumeUpload";
import Footer from "@/components/Footer";
import { FiBarChart2, FiCpu, FiTarget, FiZap } from "react-icons/fi";

export default function Home() {
  return (
    <div className="min-h-screen dark bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />

        <section id="how-it-works" className="mx-auto max-w-7xl px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: <FiZap />,
                title: "Instant parsing",
                desc: "Extracts every section and rebuilds it as structured data an ATS can read.",
              },
              {
                icon: <FiCpu />,
                title: "AI scoring",
                desc: "Grades formatting, keywords, impact and readability against 12 criteria.",
              },
              {
                icon: <FiTarget />,
                title: "Job matching",
                desc: "Compares your skills to any job description and highlights the gaps.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="glass card-shadow rounded-3xl p-6 hover:-translate-y-0.5 transition-transform"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-white">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <ResumeUpload />

        <section className="mx-auto max-w-7xl px-4 pb-24">
          <div className="glass card-shadow rounded-3xl px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div
              aria-hidden
              className="absolute -inset-1 -z-10 opacity-30 blur-2xl"
              style={{ background: "var(--gradient-primary)" }}
            />
            <div>
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <FiBarChart2 className="h-4 w-4 text-secondary" />
                Ready in seconds
              </div>
              <h3 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
                See a full breakdown of your resume.
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload once, get a shareable dashboard with ATS score, skill gaps and
                rewrites.
              </p>
            </div>
            <a
              href="#upload"
              className="inline-flex items-center gap-2 rounded-2xl bg-[image:var(--gradient-primary)] animate-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:scale-[1.03] transition-transform"
            >
              Try it now
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
