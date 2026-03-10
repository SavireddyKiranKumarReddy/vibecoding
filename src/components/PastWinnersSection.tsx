import { Github, Linkedin } from 'lucide-react';

type Member = {
  name: string;
  github: string;
  linkedin: string;
};

const MemberRow = ({ member }: { member: Member }) => (
  <div className="flex items-center justify-between gap-3">
    <p className="font-inter text-sm text-foreground">{member.name}</p>
    <div className="flex items-center gap-2">
      <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
        <Github className="w-4 h-4" />
      </a>
      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
        <Linkedin className="w-4 h-4" />
      </a>
    </div>
  </div>
);

const PastWinnersSection = () => {
  return (
    <section id="past-hackathons" className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">
              <span className="text-foreground">Past </span>
              <span className="text-gradient-accent">Hackathons</span>
            </h2>
            <p className="font-inter text-lg text-muted-foreground">
              Quick snapshot of recent editions and top teams.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <article className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="mb-5 border-b border-border pb-4">
                <p className="font-orbitron text-sm font-bold text-accent">JAN 2026</p>
                <p className="font-inter text-sm text-muted-foreground">Individual participation edition.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border/70 p-4">
                  <p className="font-inter text-xs uppercase tracking-wide text-primary mb-3">Winner</p>
                  <MemberRow member={{ name: 'TV Geethika', github: '#', linkedin: '#' }} />
                </div>
                <div className="rounded-xl border border-border/70 p-4">
                  <p className="font-inter text-xs uppercase tracking-wide text-muted-foreground mb-3">Runner</p>
                  <MemberRow member={{ name: 'Manoj Kumar', github: '#', linkedin: '#' }} />
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="mb-5 border-b border-border pb-4">
                <p className="font-orbitron text-sm font-bold text-accent">FEB 2026</p>
                <p className="font-inter text-sm text-muted-foreground">Team participation edition (max 2 members).</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border/70 p-4">
                  <p className="font-inter text-xs uppercase tracking-wide text-primary mb-3">Winner - GenZ</p>
                  <div className="space-y-2">
                    <MemberRow member={{ name: 'Mani Charan', github: '#', linkedin: '#' }} />
                    <MemberRow member={{ name: 'Gowthami Priya', github: '#', linkedin: '#' }} />
                  </div>
                </div>
                <div className="rounded-xl border border-border/70 p-4">
                  <p className="font-inter text-xs uppercase tracking-wide text-muted-foreground mb-3">Runner - Tech Nova</p>
                  <div className="space-y-2">
                    <MemberRow member={{ name: 'Varshith Kumar', github: '#', linkedin: '#' }} />
                    <MemberRow member={{ name: 'Bharath Kumar', github: '#', linkedin: '#' }} />
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PastWinnersSection;
