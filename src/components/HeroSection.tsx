import { useEffect, useState } from 'react';
import { Users, Ticket, FileQuestion, Trophy, Calendar, Wifi } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

// Hackathon start: March 15, 2026 at 00:00:00 IST (UTC+5:30)
const HACKATHON_START = new Date('2026-03-15T00:00:00+05:30').getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (): TimeLeft => {
  const now = new Date().getTime();
  const difference = HACKATHON_START - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  };
};

const CountdownBox = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl bg-card border border-primary/40 flex items-center justify-center glow-primary">
      <span className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
        {value.toString().padStart(2, '0')}
      </span>
    </div>
    <span className="font-inter text-xs md:text-sm text-muted-foreground mt-2 uppercase tracking-wider">{label}</span>
  </div>
);

const HeroSection = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [isHackathonStarted, setIsHackathonStarted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        setIsHackathonStarted(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const highlights = [
    { icon: Wifi, text: 'Online', color: 'text-secondary' },
    { icon: Users, text: 'Max 2 Members', color: 'text-primary' },
    { icon: Ticket, text: 'Free Registration', color: 'text-accent' },
    { icon: FileQuestion, text: 'Assigned PS at Kickoff', color: 'text-secondary' },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bg-black">

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6 animate-slide-in">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-orbitron text-sm text-accent font-semibold tracking-wider">ONLINE HACKATHON</span>
          </div>

          <h1 className="font-orbitron text-4xl md:text-6xl lg:text-7xl font-bold mb-2 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <span className="text-gradient">NXTGENSEC</span>
          </h1>

          <h2 className="font-orbitron text-xl md:text-3xl lg:text-4xl font-semibold mb-4 text-foreground animate-slide-in" style={{ animationDelay: '0.2s' }}>
            Securing Digital Assets
          </h2>

          <div className="inline-block px-6 py-2 bg-accent/20 border border-accent/40 rounded-lg mb-6 animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <span className="font-orbitron text-lg md:text-xl font-bold text-accent">VibeCoding Hackathon | March 2k26</span>
          </div>

          <p className="font-inter text-lg md:text-xl text-muted-foreground italic mb-8 animate-slide-in" style={{ animationDelay: '0.4s' }}>
            "Code with purpose. Build secure digital products."
          </p>

          <div className="mb-10 animate-slide-in" style={{ animationDelay: '0.45s' }}>
            <p className="font-inter text-sm text-muted-foreground mb-4 uppercase tracking-widest">
              {isHackathonStarted ? 'Hackathon has started!' : 'Hackathon Begins In'}
            </p>
            {!isHackathonStarted && (
              <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
                <CountdownBox value={timeLeft.days} label="Days" />
                <span className="font-orbitron text-2xl md:text-3xl text-primary/50 mt-[-24px]">:</span>
                <CountdownBox value={timeLeft.hours} label="Hours" />
                <span className="font-orbitron text-2xl md:text-3xl text-primary/50 mt-[-24px]">:</span>
                <CountdownBox value={timeLeft.minutes} label="Mins" />
                <span className="font-orbitron text-2xl md:text-3xl text-primary/50 mt-[-24px]">:</span>
                <CountdownBox value={timeLeft.seconds} label="Secs" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-slide-in" style={{ animationDelay: '0.5s' }}>
            {highlights.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-card/50 border border-border backdrop-blur-sm hover:border-primary/50 transition-all duration-300"
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="font-inter text-sm text-foreground">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-slide-in" style={{ animationDelay: '0.8s' }}>
            <Link to="/register">
              <Button variant="hero" size="xl">
                <Trophy className="w-5 h-5" />
                Register Your Team
              </Button>
            </Link>
            <a href="#challenges">
              <Button variant="heroOutline" size="xl">
                <Calendar className="w-5 h-5" />
                View Challenges
              </Button>
            </a>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="px-8 py-4 rounded-xl bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/40 glow-accent animate-slide-in" style={{ animationDelay: '0.6s' }}>
              <p className="font-inter text-sm text-accent mb-1">PRIZE POOL UP TO</p>
              <p className="font-orbitron text-3xl md:text-4xl font-bold text-accent">Rs.5,000</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-in" style={{ animationDelay: '0.7s' }}>
              <div className="px-6 py-4 rounded-xl bg-card border border-primary/30">
                <p className="font-inter text-xs text-muted-foreground mb-1">REGISTRATION OPENS</p>
                <p className="font-orbitron text-xl font-bold text-primary">MAR 10</p>
              </div>
              <div className="px-6 py-4 rounded-xl bg-card border border-secondary/30">
                <p className="font-inter text-xs text-muted-foreground mb-1">HACKATHON</p>
                <p className="font-orbitron text-xl font-bold text-secondary">15 - 17 MAR 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
