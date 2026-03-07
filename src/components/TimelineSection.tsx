import { Calendar, PlayCircle, Flag, Trophy } from 'lucide-react';

const TimelineSection = () => {
  const events = [
    {
      icon: Calendar,
      date: 'March 8, 2026',
      title: 'Registration Starts (Free)',
      description: 'Team registration opens. Participation is free for all eligible teams.',
      color: 'primary',
    },
    {
      icon: PlayCircle,
      date: 'March 13, 2026 | 11:00 AM',
      title: 'Hackathon Kickoff',
      description: 'Teams receive assigned problem statements and must work only on that assigned statement.',
      color: 'secondary',
    },
    {
      icon: Flag,
      date: 'March 15, 2026 | 6:00 PM',
      title: 'Hackathon Submission Deadline',
      description: 'Hackathon concludes at 6:00 PM. No submissions are accepted after this time.',
      color: 'accent',
    },
    {
      icon: Flag,
      date: 'March 16 - 17, 2026',
      title: 'Evaluation Phase',
      description: 'Judges review submissions, demos, and implementation quality.',
      color: 'primary',
    },
    {
      icon: Trophy,
      date: 'March 18, 2026',
      title: 'Results Declaration',
      description: 'Final winners are announced with edition highlights and showcase.',
      color: 'secondary',
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
              13 Mar, 11:00 AM (Kickoff) to 15 Mar, 6:00 PM (Deadline)
            </h3>
            <p className="font-inter text-muted-foreground mb-6">
              Registration opens March 8, evaluation runs March 16-17, and results are declared on March 18.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="px-4 py-2 rounded-lg bg-card border border-border">
                <span className="font-orbitron text-2xl font-bold text-primary">3</span>
                <p className="font-inter text-xs text-muted-foreground">Build Days</p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-card border border-border">
                <span className="font-orbitron text-2xl font-bold text-secondary">2</span>
                <p className="font-inter text-xs text-muted-foreground">Eval Days</p>
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
