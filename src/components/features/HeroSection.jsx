import { Link } from "@tanstack/react-router";
import {
  FiArrowRight,
  FiCheckCircle,
  FiCpu,
  FiTarget,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,.22),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(37,99,235,.18),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(6,182,212,.12),transparent_40%)]" />

      {/* Grid */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />

      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-center">

        {/* LEFT */}
        <div>

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 backdrop-blur">
            <FiZap className="text-violet-400" />
            AI Powered • ATS Optimized • Resume Intelligence
          </div>

          {/* Heading */}

          <h1 className="text-5xl font-black leading-tight text-white md:text-6xl">
            Powerful{" "}
            <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
              Features
            </span>
            <br />
            Built For
            <br />
            Modern{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              Job Seekers
            </span>
          </h1>

          {/* Description */}

          <p className="mt-8 max-w-xl text-lg leading-8 text-gray-400">
            ResumeAI helps you analyze resumes, improve ATS score,
            identify missing keywords, compare against job
            descriptions, and receive AI-powered suggestions within
            seconds.
          </p>

          {/* Buttons */}

          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              to="/dashboard"
              className="group rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-7 py-4 font-semibold text-white shadow-xl transition hover:scale-105"
            >
              Analyze Resume
              <FiArrowRight className="ml-2 inline transition group-hover:translate-x-1" />
            </Link>

            <Link
              to="/dashboard"
              className="rounded-xl border border-white/10 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              Dashboard
            </Link>

          </div>

          {/* Trust Badges */}

          <div className="mt-12 grid grid-cols-2 gap-4 text-sm text-gray-300">

            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-green-400" />
              ATS Optimized
            </div>

            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-green-400" />
              AI Powered
            </div>

            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-green-400" />
              Secure Login
            </div>

            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-green-400" />
              Instant Analysis
            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="relative">

          {/* Glow */}

          <div className="absolute inset-0 rounded-full bg-violet-600/30 blur-[120px]" />

          {/* Dashboard */}

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">

            {/* Header */}

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-400">
                  Resume Analysis
                </p>

                <h3 className="mt-1 text-2xl font-bold text-white">
                  ATS Score
                </h3>

              </div>

              <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 p-4">
                <FiCpu className="text-3xl text-white" />
              </div>

            </div>

            {/* Score */}

            <div className="mt-10">

              <div className="flex items-end justify-between">

                <div>

                  <h2 className="text-6xl font-black text-white">
                    94
                  </h2>

                  <p className="text-gray-400">
                    Excellent ATS Score
                  </p>

                </div>

                <FiTrendingUp className="text-5xl text-green-400" />

              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">

                <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-violet-600 to-cyan-400" />

              </div>

            </div>

            {/* Skills */}

            <div className="mt-10">

              <div className="mb-4 flex items-center gap-2 text-white">
                <FiTarget />
                Skills Detected
              </div>

              <div className="flex flex-wrap gap-3">

                {[
                  "React",
                  "Node.js",
                  "MongoDB",
                  "Express",
                  "Tailwind",
                  "JavaScript",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300"
                  >
                    {skill}
                  </span>
                ))}

              </div>

            </div>

            {/* Suggestions */}

            <div className="mt-10 grid gap-4">

              <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">

                <h4 className="font-semibold text-green-300">
                  ✓ Strong Technical Skills
                </h4>

              </div>

              <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">

                <h4 className="font-semibold text-yellow-300">
                  Add More Action Verbs
                </h4>

              </div>

              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">

                <h4 className="font-semibold text-red-300">
                  Missing AWS Keyword
                </h4>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}