import {
    FiUsers,
    FiFileText,
    FiTrendingUp,
    FiAward,
  } from "react-icons/fi";
  
  const stats = [
    {
      icon: FiUsers,
      value: "120K+",
      label: "Active Users",
      description:
        "Professionals and students trust ResumeAI to improve their resumes.",
      color: "from-violet-500 to-fuchsia-500",
    },
    {
      icon: FiFileText,
      value: "500K+",
      label: "Resumes Analyzed",
      description:
        "Thousands of resumes processed with detailed AI-powered insights.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: FiTrendingUp,
      value: "95%",
      label: "ATS Success Rate",
      description:
        "Optimized resumes achieve significantly better ATS compatibility.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: FiAward,
      value: "4.9/5",
      label: "User Rating",
      description:
        "Highly rated by job seekers for accuracy, speed, and ease of use.",
      color: "from-orange-500 to-red-500",
    },
  ];
  
  export default function Stats() {
    return (
      <section className="relative overflow-hidden py-24">
  
        {/* Background Glow */}
  
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,.18),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(37,99,235,.15),transparent_35%)]" />
  
        <div className="mx-auto max-w-7xl px-6">
  
          {/* Heading */}
  
          <div className="mx-auto mb-16 max-w-3xl text-center">
  
            <span className="inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300">
              Trusted Worldwide
            </span>
  
            <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
              Numbers That
              <span className="bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">
                {" "}
                Speak for Themselves
              </span>
            </h2>
  
            <p className="mt-6 text-lg text-gray-400">
              Thousands of professionals use ResumeAI every day to optimize
              resumes, improve ATS scores, and increase interview opportunities.
            </p>
  
          </div>
  
          {/* Stats Grid */}
  
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
  
            {stats.map((item, index) => {
              const Icon = item.icon;
  
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:border-violet-500/30 hover:shadow-[0_0_40px_rgba(124,58,237,0.2)]"
                >
                  {/* Glow */}
  
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 blur-3xl transition duration-500 group-hover:opacity-20`}
                  />
  
                  {/* Icon */}
  
                  <div
                    className={`inline-flex rounded-2xl bg-gradient-to-r ${item.color} p-4`}
                  >
                    <Icon className="text-3xl text-white" />
                  </div>
  
                  {/* Value */}
  
                  <h3 className="mt-8 text-5xl font-black text-white">
                    {item.value}
                  </h3>
  
                  {/* Label */}
  
                  <p className="mt-3 text-xl font-semibold text-white">
                    {item.label}
                  </p>
  
                  {/* Description */}
  
                  <p className="mt-4 leading-7 text-gray-400">
                    {item.description}
                  </p>
  
                </div>
              );
            })}
  
          </div>
  
          {/* Bottom Banner */}
  
          <div className="mt-20 rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-600/10 via-cyan-500/10 to-violet-600/10 p-10 backdrop-blur-xl">
  
            <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
  
              <div>
  
                <h3 className="text-3xl font-bold text-white">
                  Trusted by Developers, Students & Professionals
                </h3>
  
                <p className="mt-3 max-w-2xl text-gray-400">
                  ResumeAI helps users build ATS-friendly resumes, identify
                  missing skills, optimize keywords, and prepare for their dream
                  jobs with AI-powered insights.
                </p>
  
              </div>
  
              <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-5 text-center shadow-xl">
  
                <div className="text-4xl font-black text-white">
                  24/7
                </div>
  
                <div className="text-white/90">
                  AI Analysis Available
                </div>
  
              </div>
  
            </div>
  
          </div>
  
        </div>
  
      </section>
    );
  }