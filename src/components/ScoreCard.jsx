import { useEffect, useState } from "react";
import { FiAward, FiTarget } from "react-icons/fi";

export default function ScoreCard({ analysis }) {
  const target = analysis?.atsScore ?? 0;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const dur = 1100;
    const from = 0;
    const step = (t) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  const size = 200;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (display / 100) * c;

  return (
    <div className="glass card-shadow rounded-3xl p-6 md:p-8 gradient-border">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            ATS score
          </div>
          <h3 className="mt-1 text-xl font-semibold">Resume readiness</h3>
        </div>
        <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs">
          <FiAward className="h-3.5 w-3.5 text-warning" />
          Grade {analysis?.grade ?? "—"}
        </span>
      </div>

      <div className="mt-6 flex flex-col md:flex-row items-center gap-8">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <defs>
              <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={stroke}
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke="url(#ringGradient)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              fill="none"
              className="transition-[stroke-dashoffset] duration-500"
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="text-5xl font-semibold gradient-text">{display}</div>
              <div className="text-xs text-muted-foreground mt-1">out of 100</div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <FiTarget className="h-4 w-4 text-secondary" />
            Job match {analysis?.jobMatch ?? 0}%
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-[image:var(--gradient-primary)] animate-gradient transition-[width] duration-700"
              style={{ width: `${analysis?.jobMatch ?? 0}%` }}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {(analysis?.metrics ?? []).map((m) => (
              <div key={m.label} className="glass rounded-xl px-4 py-3">
                <div className="text-xs text-muted-foreground">{m.label}</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-semibold">{m.value}</span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-[image:var(--gradient-primary)]"
                    style={{ width: `${m.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
