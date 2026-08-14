import {
    FiFileText,
    FiTarget,
    FiCpu,
    FiTrendingUp,
    FiShield,
    FiBarChart2,
    FiEdit3,
    FiBriefcase,
    FiArrowRight,
  } from "react-icons/fi";
  
  const features = [
    {
      icon: FiFileText,
      title: "Resume Analysis",
      description:
        "Upload PDF or DOCX resumes and get a complete AI-powered analysis within seconds.",
      color: "from-violet-500 to-fuchsia-500",
    },
    {
      icon: FiTarget,
      title: "ATS Score",
      description:
        "Receive a detailed ATS compatibility score with suggestions to improve hiring success.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: FiCpu,
      title: "AI Suggestions",
      description:
        "Get personalized improvements for summary, experience, projects, and achievements.",
      color: "from-pink-500 to-violet-500",
    },
    {
      icon: FiTrendingUp,
      title: "Skill Detection",
      description:
        "Automatically identify technical skills, soft skills, and missing keywords.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: FiBriefcase,
      title: "Job Match",
      description:
        "Compare your resume against job descriptions to improve interview chances.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: FiBarChart2,
      title: "Analytics",
      description:
        "Track resume scores, improvements, and analysis history through your dashboard.",
      color: "from-indigo-500 to-violet-500",
    },
    {
      icon: FiEdit3,
      title: "Resume Builder",
      description:
        "Create modern ATS-friendly resumes with professionally designed templates.",
      color: "from-sky-500 to-cyan-500",
    },
    {
      icon: FiShield,
      title: "Secure Storage",
      description:
        "Protected with Clerk authentication so your resumes stay private and secure.",
      color: "from-green-500 to-emerald-500",
    },
  ];
  
  export default function FeatureGrid() {
    return (
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
  
          {/* Section Heading */}
  
          <div className="mx-auto mb-16 max-w-3xl text-center">
  
            <span className="inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300">
              Everything You Need
            </span>
  
            <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
              Powerful Features
              <span className="bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">
                {" "}
                Built for Success
              </span>
            </h2>
  
            <p className="mt-6 text-lg text-gray-400">
              ResumeAI combines artificial intelligence with ATS optimization to
              help job seekers create stronger resumes and land more interviews.
            </p>
  
          </div>
  
          {/* Feature Cards */}
  
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
  
            {features.map((feature, index) => {
              const Icon = feature.icon;
  
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:border-violet-500/30 hover:shadow-[0_0_40px_rgba(124,58,237,0.25)]"
                >
                  {/* Gradient Glow */}
  
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 blur-3xl transition duration-500 group-hover:opacity-20`}
                  />
  
                  {/* Icon */}
  
                  <div
                    className={`inline-flex rounded-2xl bg-gradient-to-r ${feature.color} p-4 shadow-lg`}
                  >
                    <Icon className="text-3xl text-white" />
                  </div>
  
                  {/* Title */}
  
                  <h3 className="mt-8 text-2xl font-bold text-white">
                    {feature.title}
                  </h3>
  
                  {/* Description */}
  
                  <p className="mt-4 leading-7 text-gray-400">
                    {feature.description}
                  </p>
  
                  {/* Learn More */}
  
               
  
                  {/* Hover Border */}
  
                  <div className="absolute inset-0 rounded-3xl border border-transparent transition group-hover:border-violet-500/30" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }