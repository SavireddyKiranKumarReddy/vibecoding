import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { fetchTeamNames } from '@/lib/fetchTeamNames';

const RegisteredTeams = () => {
  const [teams, setTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const fetchedTeams = await fetchTeamNames();
      setTeams(fetchedTeams);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-primary" />
            <h1 className="font-orbitron text-3xl md:text-4xl font-bold">Registered Teams</h1>
          </div>
          <p className="font-inter text-muted-foreground mb-8">Only team names are displayed.</p>

          {loading ? (
            <p className="font-inter text-muted-foreground">Loading...</p>
          ) : teams.length === 0 ? (
            <p className="font-inter text-muted-foreground">No teams registered yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {teams.map((team, index) => (
                <article key={team} className="rounded-xl border border-border p-4 flex items-center gap-3">
                  <span className="font-orbitron text-lg font-bold text-primary min-w-[2rem]">{index + 1}.</span>
                  <p className="font-orbitron text-base font-bold">{team}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisteredTeams;
