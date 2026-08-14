import { Link } from "@tanstack/react-router";
import {
  FiArrowRight,
  FiCheckCircle,
  FiShield,
  FiZap,
} from "react-icons/fi";

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-28">

      {/* Background Glow */}

      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(124,58,237,.30),transparent_40%),radial-gradient(circle_at_bottom,rgba(37,99,235,.25),transparent_40%)]" />

      {/* Grid */}

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="mx-auto max-w-6xl px-6">

        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-12 backdrop-blur-xl">

          {/* Floating Glow */}

          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-violet-600/20 blur-[120px]" />

          <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />

          <div className="relative text-center">

            {/* Badge */}

            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-5 py-2 text-sm font-medium text-violet-300">
              <FiZap />
              AI Powered Resume Optimization
            </span>

            {/* Heading */}

            <h2 className="mt-8 text-4xl font-black text-white md:text-6xl">

              Ready to Build a
              <br />

              <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
                Job-Winning Resume?
              </span>

            </h2>

            {/* Description */}

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-gray-400">
              Join thousands of students, developers, and professionals using
              ResumeAI to improve ATS scores, discover missing skills, optimize
              keywords, and increase interview opportunities with AI-powered
              resume analysis.
            </p>

            {/* Buttons */}

            <div className="mt-12 flex flex-wrap justify-center gap-5">

              <Link
                to="/dashboard"
                className="group rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-4 font-semibold text-white shadow-xl transition hover:scale-105"
              >
                Analyze Resume
                <FiArrowRight className="ml-2 inline transition group-hover:translate-x-1" />
              </Link>

              <Link
                to="/sign-up"
                className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Create Free Account
              </Link>

            </div>

            {/* Trust Features */}

            <div className="mt-14 flex flex-wrap justify-center gap-8 text-gray-300">

              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-green-400" />
                Free Resume Analysis
              </div>

              <div className="flex items-center gap-2">
                <FiShield className="text-cyan-400" />
                Secure Authentication
              </div>

              <div className="flex items-center gap-2">
                <FiZap className="text-violet-400" />
                Instant AI Results
              </div>

            </div>

            {/* Stats */}

            <div className="mt-16 grid gap-8 border-t border-white/10 pt-10 md:grid-cols-3">

              <div>

                <h3 className="text-4xl font-black text-white">
                  120K+
                </h3>

                <p className="mt-2 text-gray-400">
                  Active Users
                </p>

              </div>

              <div>

                <h3 className="text-4xl font-black text-white">
                  500K+
                </h3>

                <p className="mt-2 text-gray-400">
                  Resumes Analyzed
                </p>

              </div>

              <div>

                <h3 className="text-4xl font-black text-white">
                  95%
                </h3>

                <p className="mt-2 text-gray-400">
                  ATS Success Rate
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}