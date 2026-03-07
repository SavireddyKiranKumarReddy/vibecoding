import { Calendar, PlayCircle, Flag } from 'lucide-react';

const TimelineSection = () => {
  const events = [
    {
      icon: Calendar,
      date: 'March 10, 2026',
      title: 'Registration Starts (Free)',
      description: 'Team registration opens. Participation is free for all eligible teams.',
      color: 'primary',
    },
    {
      icon: PlayCircle,
      date: 'March 15 - 17, 2026',
      title: 'Hackathon (3 Days)',
      description: 'Teams build and submit solutions during the official 3-day hackathon window.',
      color: 'secondary',
    },
    {
      icon: Flag,
      date: 'March 18 - 20, 2026',
      title: 'Filtration Phase',
      description: 'Submitted projects move through the filtration process.',
      color: 'accent',
    },
    {
      icon: Flag,
      date: 'March 21, 2026',
      title: 'Results Declaration',
      description: 'Final winners/results are announced.',
      color: 'primary',
    },
  ];

  return (
    <section id="timeline" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 circuit-pattern opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">Event </span>
            <span className="text-gradient-primary">Timeline</span>
          </h2>
          <p className="font-inter text-lg text-muted-foreground">
            Official schedule for March 2026 edition.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {events.map((event, index) => (
            <div key={index} className="relative flex gap-6 pb-12 last:pb-0">
              {index !== events.length - 1 && (
                <div className="absolute left-6 top-14 w-0.5 h-full bg-gradient-to-b from-border to-transparent" />
              )}

              <div className={`relative z-10 w-12 h-12 rounded-lg bg-${event.color}/10 border border-${event.color}/30 flex items-center justify-center flex-shrink-0`}>
                <event.icon className={`w-6 h-6 text-${event.color}`} />
              </div>

              <div className="flex-1 pt-1">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-${event.color}/10 text-${event.color} mb-2`}>
                  {event.date}
                </span>
                <h3 className="font-orbitron text-xl font-bold text-foreground mb-2">{event.title}</h3>
                <p className="font-inter text-muted-foreground">{event.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <div className="p-8 rounded-2xl card-gradient border border-primary/30 glow-primary text-center">
            <p className="font-orbitron text-sm text-primary mb-2 tracking-widest">MARCH EDITION SCHEDULE</p>
            <h3 className="font-orbitron text-2xl md:text-3xl font-bold text-foreground mb-4">
              15 - 17 Mar (Hackathon), 18 - 20 (Filtration), 21 (Results)
            </h3>
            <p className="font-inter text-muted-foreground mb-6">
              Registration opens March 10 and is completely free.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="px-4 py-2 rounded-lg bg-card border border-border">
                <span className="font-orbitron text-2xl font-bold text-primary">3</span>
                <p className="font-inter text-xs text-muted-foreground">Hackathon Days</p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-card border border-border">
                <span className="font-orbitron text-2xl font-bold text-secondary">3</span>
                <p className="font-inter text-xs text-muted-foreground">Filtration Days</p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-card border border-border">
                <span className="font-orbitron text-2xl font-bold text-accent">Free</span>
                <p className="font-inter text-xs text-muted-foreground">Registration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
