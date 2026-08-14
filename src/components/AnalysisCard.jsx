import { FiFileText, FiTarget } from "react-icons/fi";

export default function AnalysisCard({ analysis }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card
        icon={<FiFileText className="h-4 w-4 text-secondary" />}
        eyebrow="Professional summary"
        title="What your resume communicates"
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          {analysis?.summary}
        </p>
      </Card>

      <Card
        icon={<FiTarget className="h-4 w-4 text-accent" />}
        eyebrow="Job match"
        title={`Alignment: ${analysis?.jobMatch ?? 0}%`}
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          {analysis?.jobMatchExplanation}
        </p>
      </Card>
    </div>
  );
}

function Card({ icon, eyebrow, title, children }) {
  return (
    <div className="glass card-shadow rounded-3xl p-6 md:p-7 h-full">
      <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs text-muted-foreground">
        {icon}
        {eyebrow}
      </div>
      <h3 className="mt-3 text-xl font-semibold tracking-tight">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}
