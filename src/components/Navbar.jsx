import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FiMenu, FiX, FiZap } from "react-icons/fi";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Dashboard removed from default links — only shown when SignedIn (below)
  const links = [
    { to: "/", label: "Home" },
    { to: "/features", label: "Features" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <nav
          className={`glass card-shadow flex items-center justify-between rounded-2xl px-4 py-3 md:px-6 ${
            scrolled ? "backdrop-blur-2xl" : ""
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] animate-gradient shadow-lg">
              <FiZap className="h-5 w-5 text-white" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Resume<span className="gradient-text">AI</span>
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="group relative rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  activeProps={{ className: "text-foreground" }}
                >
                  {l.label}
                  <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px scale-x-0 bg-[image:var(--gradient-primary)] transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}

            {/* Dashboard link only visible to logged-in users, shown in nav list too */}
            <SignedIn>
              <li>
                <Link
                  to="/dashboard"
                  className="group relative rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  activeProps={{ className: "text-foreground" }}
                >
                  Dashboard
                  <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px scale-x-0 bg-[image:var(--gradient-primary)] transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </li>
            </SignedIn>
          </ul>

          <div className="hidden md:flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium hover:bg-white/5 transition">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-xl bg-[image:var(--gradient-primary)] animate-gradient px-4 py-2 text-sm font-medium text-white shadow-lg transition-transform hover:scale-[1.03]">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-3">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                  afterSignOutUrl="/"
                />
              </div>
            </SignedIn>
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="md:hidden rounded-lg p-2 text-foreground/80 hover:bg-white/5"
          >
            {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div className="md:hidden mt-2 glass rounded-2xl p-3 animate-in fade-in slide-in-from-top-2">
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}

              <SignedIn>
                <li>
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5"
                  >
                    Dashboard
                  </Link>
                </li>
              </SignedIn>

              <li className="mt-2">
                <SignedIn>
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block text-center rounded-xl bg-[image:var(--gradient-primary)] px-4 py-3 text-sm font-medium text-white"
                  >
                    Launch app
                  </Link>
                </SignedIn>
                <SignedOut>
                  <SignUpButton mode="modal">
                    <button
                      onClick={() => setOpen(false)}
                      className="w-full text-center rounded-xl bg-[image:var(--gradient-primary)] px-4 py-3 text-sm font-medium text-white"
                    >
                      Get Started
                    </button>
                  </SignUpButton>
                </SignedOut>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}