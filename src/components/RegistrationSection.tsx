import { ArrowRight, CheckCircle, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const RegistrationSection = () => {
  const steps = [
    'Form a team (exactly 2 members)',
    'Complete free registration',
    'Receive your assigned problem statement at kickoff',
    'Build only for the assigned statement during March 15-17',
  ];

  return (
    <section id="register" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 circuit-pattern opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-b from-card to-background border border-primary/30">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 mb-6">
                <CheckCircle className="w-4 h-4 text-secondary" />
                <span className="font-orbitron text-sm text-secondary font-semibold">REGISTRATIONS OPEN FROM MARCH 10</span>
              </div>

              <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">
                <span className="text-foreground">How to </span>
                <span className="text-gradient">Register</span>
              </h2>
              <p className="font-inter text-lg text-muted-foreground max-w-2xl mx-auto">
                Follow these steps to register and prepare for the 3-day hackathon (March 15-17).
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-10">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary font-orbitron font-bold text-sm flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="font-inter text-sm text-foreground">{step}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Open Registration Form
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span className="font-inter text-sm">Entry Fee: Free</span>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-border">
              <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="font-inter text-sm">Online Event</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="font-inter text-sm">Open to All</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="font-inter text-sm">Expert Mentors</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="font-inter text-sm">Prize Pool up to Rs.5,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationSection;
