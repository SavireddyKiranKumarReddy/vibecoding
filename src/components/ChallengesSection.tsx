import { Clock3, FileQuestion, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const ChallengesSection = () => {
  return (
    <section id="challenges" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">Tracks / </span>
            <span className="text-gradient">Challenges</span>
          </h2>
          <p className="font-inter text-lg text-muted-foreground">
            Problem statements are not published in advance and are assigned at kickoff.
          </p>
        </div>

        <div className="max-w-3xl mx-auto rounded-2xl border border-primary/30 bg-card p-8 md:p-10 text-center">
          <div className="flex justify-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileQuestion className="w-6 h-6 text-primary" />
            </div>
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Clock3 className="w-6 h-6 text-secondary" />
            </div>
          </div>

          <h3 className="font-orbitron text-2xl font-bold mb-3">Assigned Challenges Start at Kickoff</h3>
          <p className="font-inter text-muted-foreground mb-6">
            Each team receives a specific assigned problem statement at kickoff and must build only for that statement.
          </p>
          <p className="font-inter text-sm text-accent mb-8">
            Submissions that do not strictly address the assigned statement will not be accepted.
          </p>

          <Link to="/register">
            <Button variant="cyber" size="lg">
              <span>Register Team</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;
