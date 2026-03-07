import { ShieldCheck } from 'lucide-react';

const FaqRulesSection = () => {
  const rules = [
    'Team-based registration only. Each team must have exactly 2 members.',
    'Registration starts on March 10, 2026.',
    'Hackathon runs for 3 days: March 15-17, 2026.',
    'Filtration phase runs on March 18-20, 2026.',
    'Final winners/results are announced on March 21, 2026.',
    'Teams must solve only the assigned problem statement.',
    'Teams must use the given PPT format.',
    'Teams must use VibeCoding AI tools during development.',
    'Teams must maintain a structured GitHub repository with proper commits.',
    'The project must be deployed and publicly accessible.',
    'Any wrong or unfair practice leads to immediate disqualification.',
    "Judges' decision is final.",
  ];

  const process = [
    'Take the assigned problem statement and understand the objective clearly.',
    'Research the domain, analyze competitors, identify gaps/flaws, and define the problem deeply.',
    'Propose an appropriate solution with novelty and uniqueness.',
    'Develop the solution using VibeCoding AI tools and prepare the required PPT.',
    'Maintain a structured GitHub repository with meaningful, proper commits.',
    'Deploy the project and keep it publicly accessible for review.',
    'If shortlisted/finalized, attend one-on-one evaluation.',
  ];

  return (
    <section id="rules" className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">
              <span className="text-foreground">Rules & Process</span>
            </h2>
            <p className="font-inter text-lg text-muted-foreground">
              One view for official rules and one view for the expected execution process.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-card border border-border p-6 md:p-8">
              <div className="flex items-center gap-2 mb-5">
                <ShieldCheck className="w-5 h-5 text-secondary" />
                <h3 className="font-orbitron text-xl font-bold">Official Rules</h3>
              </div>
              <ul className="space-y-3 list-disc pl-5">
                {rules.map((rule) => (
                  <li key={rule} className="font-inter text-sm text-muted-foreground">
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-card border border-border p-6 md:p-8">
              <div className="flex items-center gap-2 mb-5">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h3 className="font-orbitron text-xl font-bold">Execution Process</h3>
              </div>
              <ol className="space-y-3 list-decimal pl-5">
                {process.map((step) => (
                  <li key={step} className="font-inter text-sm text-muted-foreground">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqRulesSection;
