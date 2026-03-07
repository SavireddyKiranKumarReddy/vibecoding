import { Code2, Lightbulb, Users, Zap } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: Code2,
      title: 'Code the Vibe',
      description: 'Build meaningful solutions for real-world use cases.',
      color: 'primary',
    },
    {
      icon: Lightbulb,
      title: 'Live Problem Statements',
      description: 'Each team receives a specific assigned problem statement only at kickoff.',
      color: 'secondary',
    },
    {
      icon: Users,
      title: 'Team-Only Format',
      description: 'March edition is team-based with exactly 2 members per team.',
      color: 'accent',
    },
    {
      icon: Zap,
      title: 'Time-Bound Execution',
      description: 'Hackathon runs from March 13, 11:00 AM to March 15, 6:00 PM.',
      color: 'primary',
    },
  ];

  return (
    <section id="about" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 circuit-pattern opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">About </span>
            <span className="text-gradient-primary">March Edition</span>
          </h2>
          <p className="font-inter text-lg text-muted-foreground leading-relaxed">
            VibeCoding March 2026 is a team-based online hackathon by <span className="text-primary font-semibold">NxtGenSec</span>.
            Registration opens on March 8. Hackathon begins on March 13 at 11:00 AM and ends on March 15 at 6:00 PM.
            Evaluation runs March 16-17, and final results are announced on March 18.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className={`group p-6 rounded-xl card-gradient border border-border hover:border-${feature.color}/50 transition-all duration-300 hover:glow-${feature.color}`}>
              <div className={`w-12 h-12 rounded-lg bg-${feature.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 text-${feature.color}`} />
              </div>
              <h3 className="font-orbitron text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="font-inter text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
