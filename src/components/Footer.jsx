import { Link } from "@tanstack/react-router";
import { FiGithub, FiLinkedin, FiMail, FiZap } from "react-icons/fi";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-4 pb-10">
      <div className="glass card-shadow rounded-3xl px-6 md:px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)]">
                <FiZap className="h-5 w-5 text-white" />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                Resume<span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-sm">
              An AI copilot that scores your resume, matches it to job descriptions and
              suggests rewrites — instantly.
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Quick links
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/" className="text-foreground/85 hover:text-foreground">Home</Link></li>
              <li><Link to="/features" className="text-foreground/85 hover:text-foreground">Features</Link></li>
              <SignedIn>
                <li><Link to="/dashboard" className="text-foreground/85 hover:text-foreground">Dashboard</Link></li>
              </SignedIn>
              <li><a href="#upload" className="text-foreground/85 hover:text-foreground">Upload resume</a></li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Connect
            </div>
            <div className="mt-3 flex items-center gap-2">
            {[
  { icon: <FiGithub />, href: "#", label: "GitHub" },
  { icon: <FiLinkedin />, href: "#", label: "LinkedIn" },
  { icon: <FiMail />, href: "#", label: "Email" },
].map((s) => (
  <a
    key={s.label}
    href={s.href}
    aria-label={s.label}
    className="glass grid h-10 w-10 place-items-center rounded-xl text-foreground/80 hover:text-foreground hover:scale-105 transition"
  >
    {s.icon}
  </a>
))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} ResumeAI. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}