import { Link } from "@tanstack/react-router";
import {
  FiArrowRight,
  FiCheckCircle,
  FiCpu,
  FiFileText,
  FiTarget,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] opacity-40"
        style={{
          background:
            "radial-gradient(600px 300px at 50% 0%, rgba(99,102,241,0.35), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 pt-16 md:pt-24 pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-muted-foreground">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-[image:var(--gradient-primary)]">
                <FiZap className="h-2.5 w-2.5 text-white" />
              </span>
              AI-powered · ATS-optimised · Instant feedback
            </div>

            <h1 className="mt-5 text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
              Land interviews with an{" "}
              <span className="gradient-text">AI-tuned resume</span>
            </h1>
            <p className="mt-5 max-w-xl text-base md:text-lg text-muted-foreground">
              Upload your resume and paste a job description. Our AI scores your ATS
              readiness, matches your skills, and returns actionable rewrites in seconds.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 rounded-2xl bg-[image:var(--gradient-primary)] animate-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03]"
              >
                Analyze my resume
                <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#how-it-works"
                className="glass inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-medium text-foreground/90 hover:text-foreground"
              >
                How it works
              </a>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                { k: "120K+", v: "Resumes analyzed" },
                { k: "94%", v: "Interview rate lift" },
                { k: "<5s", v: "Average scan time" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="text-2xl md:text-3xl font-semibold gradient-text">
                    {s.k}
                  </dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right — floating AI illustration */}
          <div className="relative h-[440px] md:h-[520px]">
            <div
              aria-hidden
              className="absolute inset-0 rounded-[36px] opacity-70 blur-2xl"
              style={{ background: "var(--gradient-primary)" }}
            />
            <div className="relative h-full w-full glass card-shadow rounded-[32px] p-6 overflow-hidden">
              {/* central orb */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative h-40 w-40 md:h-52 md:w-52 rounded-full bg-[image:var(--gradient-primary)] animate-gradient animate-pulse-glow grid place-items-center shadow-2xl">
                  <FiCpu className="h-14 w-14 md:h-20 md:w-20 text-white" />
                </div>
                <div className="absolute inset-[-30px] rounded-full border border-white/10" />
                <div className="absolute inset-[-60px] rounded-full border border-white/5" />
              </div>

              {/* floating cards */}
              <FloatCard
                className="left-4 top-6 animate-float"
                icon={<FiFileText className="h-4 w-4 text-secondary" />}
                title="Resume parsed"
                subtitle="12 sections · 2 pages"
              />
              <FloatCard
                className="right-4 top-16 [animation-delay:1s] animate-float"
                icon={<FiTarget className="h-4 w-4 text-accent" />}
                title="ATS score"
                subtitle="82 / 100"
                accent="from-accent to-primary"
              />
              <FloatCard
                className="left-6 bottom-8 [animation-delay:2s] animate-float"
                icon={<FiTrendingUp className="h-4 w-4 text-success" />}
                title="Job match"
                subtitle="74% aligned"
              />
              <FloatCard
                className="right-6 bottom-20 [animation-delay:0.5s] animate-float"
                icon={<FiCheckCircle className="h-4 w-4 text-success" />}
                title="6 suggestions"
                subtitle="2 high priority"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatCard({ className = "", icon, title, subtitle }) {
  return (
    <div
      className={`absolute glass card-shadow rounded-2xl px-4 py-3 min-w-[170px] ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-white/5">
          {icon}
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{title}</div>
          <div className="text-sm font-semibold">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
