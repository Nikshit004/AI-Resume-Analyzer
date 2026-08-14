import {
    FiUploadCloud,
    FiFileText,
    FiCpu,
    FiTarget,
    FiDownload,
  } from "react-icons/fi";
  
  const steps = [
    {
      icon: FiUploadCloud,
      title: "Upload Resume",
      description:
        "Upload your resume in PDF or DOCX format using our secure upload system.",
      color: "from-violet-500 to-fuchsia-500",
    },
    {
      icon: FiFileText,
      title: "Extract Resume Data",
      description:
        "Our parser extracts your education, experience, projects, and technical skills.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: FiCpu,
      title: "AI Analysis",
      description:
        "Advanced AI evaluates your resume and identifies strengths, weaknesses, and missing keywords.",
      color: "from-pink-500 to-violet-500",
    },
    {
      icon: FiTarget,
      title: "ATS Optimization",
      description:
        "Receive ATS score, keyword suggestions, formatting advice, and improvement tips.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: FiDownload,
      title: "Download Report",
      description:
        "View your detailed report, compare versions, and build a stronger resume.",
      color: "from-orange-500 to-red-500",
    },
  ];
  
  export default function Workflow() {
    return (
      <section className="relative py-24">
  
        <div className="mx-auto max-w-7xl px-6">
  
          {/* Heading */}
  
          <div className="mx-auto mb-20 max-w-3xl text-center">
  
            <span className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">
              Simple Workflow
            </span>
  
            <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
              Analyze Your Resume
              <span className="bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">
                {" "}
                in 5 Easy Steps
              </span>
            </h2>
  
            <p className="mt-6 text-lg text-gray-400">
              From uploading your resume to receiving actionable AI insights,
              ResumeAI makes optimization effortless.
            </p>
  
          </div>
  
          {/* Timeline */}
  
          <div className="relative">
  
            {/* Connecting Line */}
  
            <div className="absolute left-1/2 top-0 hidden h-full w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-violet-500 via-cyan-500 to-emerald-500 lg:block" />
  
            <div className="space-y-16">
  
              {steps.map((step, index) => {
                const Icon = step.icon;
                const left = index % 2 === 0;
  
                return (
                  <div
                    key={index}
                    className={`flex flex-col items-center lg:flex-row ${
                      left ? "" : "lg:flex-row-reverse"
                    }`}
                  >
                    {/* Card */}
  
                    <div className="w-full lg:w-5/12">
  
                      <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-violet-500/30 hover:shadow-[0_0_35px_rgba(124,58,237,0.2)]">
  
                        <div
                          className={`inline-flex rounded-2xl bg-gradient-to-r ${step.color} p-4`}
                        >
                          <Icon className="text-3xl text-white" />
                        </div>
  
                        <h3 className="mt-6 text-2xl font-bold text-white">
                          {step.title}
                        </h3>
  
                        <p className="mt-4 leading-7 text-gray-400">
                          {step.description}
                        </p>
  
                      </div>
  
                    </div>
  
                    {/* Center Number */}
  
                    <div className="relative z-10 my-8 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#050816] bg-gradient-to-r from-violet-500 to-cyan-500 text-2xl font-bold text-white shadow-xl lg:my-0">
                      {index + 1}
                    </div>
  
                    {/* Empty Space */}
  
                    <div className="hidden lg:block lg:w-5/12" />
  
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }