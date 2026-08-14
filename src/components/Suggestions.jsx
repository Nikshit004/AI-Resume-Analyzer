import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const priorityStyles = {
  high: {
    label: "High",
    chip: "bg-danger/15 text-danger border-danger/30",
    dot: "bg-danger",
  },
  medium: {
    label: "Medium",
    chip: "bg-warning/15 text-warning border-warning/30",
    dot: "bg-warning",
  },
  low: {
    label: "Low",
    chip: "bg-success/15 text-success border-success/30",
    dot: "bg-success",
  },
};

export default function Suggestions({ analysis }) {
  const items = analysis?.suggestions ?? [];
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="glass card-shadow rounded-3xl p-6 md:p-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            AI recommendations
          </div>
          <h3 className="mt-1 text-xl font-semibold">Improve your score</h3>
        </div>
        <span className="text-sm text-muted-foreground">{items.length} suggestions</span>
      </div>

      <ul className="space-y-3">
        {items.map((it, i) => {
          const style = priorityStyles[it.priority] || priorityStyles.low;
          const open = openIdx === i;
          return (
            <li
              key={i}
              className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-colors hover:border-white/20"
            >
              <button
                onClick={() => setOpenIdx(open ? -1 : i)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left"
              >
                <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                <span className="flex-1 text-sm font-medium">{it.title}</span>
                <span
                  className={`hidden sm:inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${style.chip}`}
                >
                  {style.label}
                </span>
                <FiChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                    {it.detail}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
