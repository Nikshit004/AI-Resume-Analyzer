import {
  FiCheckCircle,
  FiSearch,
} from "react-icons/fi";

export default function SkillsChart({ analysis }) {
  const matched = analysis?.matchedSkills ?? [];
  const missing = analysis?.missingKeywords ?? [];

  // ==========================================
  // Normalize matched skills
  // Supports:
  //
  // "HTML"
  //
  // OR:
  //
  // {
  //   name: "HTML",
  //   level: 80
  // }
  // ==========================================

  const normalizedMatched = matched.map(
    (skill, index) => {
      if (typeof skill === "string") {
        return {
          name: skill,
          level: 100,
          key: `${skill}-${index}`,
        };
      }

      return {
        name:
          skill?.name ||
          skill?.skill ||
          skill?.title ||
          `Skill ${index + 1}`,

        level:
          Number(skill?.level) ||
          Number(skill?.score) ||
          Number(skill?.proficiency) ||
          100,

        key: `${skill?.name || skill?.skill || skill?.title || "skill"}-${index}`,
      };
    }
  );

  // ==========================================
  // Normalize missing keywords
  // ==========================================

  const normalizedMissing = missing.map(
    (keyword, index) => {
      if (typeof keyword === "string") {
        return {
          name: keyword,
          key: `${keyword}-${index}`,
        };
      }

      return {
        name:
          keyword?.name ||
          keyword?.keyword ||
          keyword?.title ||
          `Keyword ${index + 1}`,

        key: `${keyword?.name || keyword?.keyword || keyword?.title || "keyword"}-${index}`,
      };
    }
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* ==========================================
          MATCHED SKILLS
      ========================================== */}

      <div className="glass card-shadow rounded-3xl p-6 md:p-7">

        <div className="flex items-center justify-between">

          <div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs text-muted-foreground">
              <FiCheckCircle className="h-3.5 w-3.5 text-success" />
              Matched skills
            </div>

            <h3 className="mt-3 text-xl font-semibold tracking-tight">
              Skills you already own
            </h3>
          </div>

          <span className="text-2xl font-semibold gradient-text">
            {normalizedMatched.length}
          </span>

        </div>

        <ul className="mt-5 space-y-4">

          {normalizedMatched.map(
            (skill) => {

              const safeLevel = Math.max(
                0,
                Math.min(
                  100,
                  Number(skill.level) || 0
                )
              );

              return (
                <li key={skill.key}>

                  <div className="mb-1.5 flex items-center justify-between text-sm">

                    <span className="flex items-center gap-2">

                      <FiCheckCircle className="h-3.5 w-3.5 text-success" />

                      {skill.name}

                    </span>

                    <span className="text-muted-foreground">
                      {safeLevel}%
                    </span>

                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">

                    <div
                      className="h-full bg-[image:var(--gradient-primary)] transition-[width] duration-700"
                      style={{
                        width: `${safeLevel}%`,
                      }}
                    />

                  </div>

                </li>
              );
            }
          )}

        </ul>

      </div>

      {/* ==========================================
          MISSING KEYWORDS
      ========================================== */}

      <div className="glass card-shadow rounded-3xl p-6 md:p-7">

        <div className="flex items-center justify-between">

          <div>

            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs text-muted-foreground">

              <FiSearch className="h-3.5 w-3.5 text-warning" />

              Missing keywords

            </div>

            <h3 className="mt-3 text-xl font-semibold tracking-tight">
              Add these to level up
            </h3>

          </div>

          <span className="text-2xl font-semibold gradient-text">
            {normalizedMissing.length}
          </span>

        </div>

        <div className="mt-5 flex flex-wrap gap-2">

          {normalizedMissing.map(
            (keyword) => (
              <span
                key={keyword.key}
                className="glass rounded-full px-3.5 py-1.5 text-sm text-foreground/90 border border-white/10 hover:border-primary/60 hover:text-white transition-colors"
              >
                {keyword.name}
              </span>
            )
          )}

        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Tip: weave these keywords into your
          experience section only where they
          truthfully apply — don't keyword-stuff.
        </p>

      </div>

    </div>
  );
}