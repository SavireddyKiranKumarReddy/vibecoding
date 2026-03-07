import { ChangeEvent, FormEvent, useState } from 'react';
import { AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type RegistrationForm = {
  teamName: string;
  member1Name: string;
  member1Email: string;
  member1Contact: string;
  member1College: string;
  member1Year: string;
  member1Department: string;
  member1Linkedin: string;
  member1Github: string;
  member1PostLink: string;
  member2Name: string;
  member2Email: string;
  member2Contact: string;
  member2College: string;
  member2Year: string;
  member2Department: string;
  member2Linkedin: string;
  member2Github: string;
  member2PostLink: string;
};

const normalize = (value: string) => value.trim();
const REQUIRED_LABELS: Array<{ key: keyof RegistrationForm; label: string }> = [
  { key: 'teamName', label: 'Team Name' },
  { key: 'member1Email', label: 'Team Lead Email' },
  { key: 'member1Contact', label: 'Team Lead Contact' },
];

const initialForm: RegistrationForm = {
  teamName: '',
  member1Name: '',
  member1Email: '',
  member1Contact: '',
  member1College: '',
  member1Year: '',
  member1Department: '',
  member1Linkedin: '',
  member1Github: '',
  member1PostLink: '',
  member2Name: '',
  member2Email: '',
  member2Contact: '',
  member2College: '',
  member2Year: '',
  member2Department: '',
  member2Linkedin: '',
  member2Github: '',
  member2PostLink: '',
};

const Field = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  name: keyof RegistrationForm;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
}) => (
  <div>
    <label className="mb-2 block font-inter text-sm">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      type="text"
      required={required}
      className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
      placeholder={placeholder}
    />
  </div>
);

const Register = () => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<RegistrationForm>(initialForm);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const missing = REQUIRED_LABELS.find(({ key }) => !normalize(form[key]));
    if (missing) {
      setError(`${missing.label} is required.`);
      return;
    }

    setSaving(true);
    const supabaseUrl = String(import.meta.env.VITE_SUPABASE_URL || '').trim();
    const functionUrls: string[] = [];
    if (supabaseUrl) {
      functionUrls.push(`${supabaseUrl}/functions/v1/submit-team-registration`);
      try {
        const host = new URL(supabaseUrl).hostname;
        const ref = host.split('.')[0];
        if (ref) {
          functionUrls.push(`https://${ref}.functions.supabase.co/submit-team-registration`);
        }
      } catch {
        // Ignore malformed URL parsing and keep primary endpoint only.
      }
    }

    if (!supabaseUrl) {
      setSaving(false);
      setError('Supabase configuration is missing in frontend environment (URL).');
      return;
    }

    let submittedOk = false;
    let backendMessage: string | null = null;

    try {
      const payload = JSON.stringify(form);
      for (const functionUrl of Array.from(new Set(functionUrls))) {
        try {
          const res = await fetch(functionUrl, {
            method: 'POST',
            // Keep this a simple request to avoid browser preflight failures.
            body: payload,
          });

          if (!res.ok) {
            let message = `Registration failed (HTTP ${res.status}).`;
            try {
              const body = (await res.json()) as { error?: string };
              if (body?.error) {
                message = body.error;
              }
            } catch {
              // Ignore parse failures and use status-based message.
            }
            backendMessage = message;
            continue;
          }

          submittedOk = true;
          break;
        } catch (attemptError) {
          console.error('Registration attempt failed for endpoint', functionUrl, attemptError);
        }
      }
    } catch {
    } finally {
      setSaving(false);
    }

    if (!submittedOk) {
      setError(backendMessage || 'Registration service is unreachable. Please retry in a moment.');
      return;
    }

    setForm(initialForm);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <h1 className="font-orbitron text-3xl md:text-4xl font-bold mb-2">Team Registration</h1>
          <p className="font-inter text-muted-foreground mb-8">
            Registration opens March 8, 2026. Team-based entry only with maximum 2 members per team.
          </p>
          <div className="mb-8 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
            <p>Note: Both members must share this hackathon on LinkedIn and submit the post URLs below.</p>
            <p className="mt-2">All details are manually verified. If faulty details are found, the team can be disqualified.</p>
          </div>

          {!submitted ? (
            <form onSubmit={onSubmit} className="grid gap-6">
              <div>
                <label className="mb-2 block font-inter text-sm">Team Name</label>
                <input
                  name="teamName"
                  value={form.teamName}
                  onChange={onChange}
                  required
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
                  placeholder="Enter team name"
                />
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                <div className="rounded-xl border border-border p-5 md:p-6">
                  <h2 className="font-orbitron text-xl font-semibold mb-5">Team Lead (Person 1)</h2>
                  <div className="space-y-4">
                    <Field label="Name" name="member1Name" value={form.member1Name} onChange={onChange} placeholder="Full name" />
                    <Field label="Email" name="member1Email" value={form.member1Email} onChange={onChange} placeholder="name@email.com" required />
                    <Field label="Contact" name="member1Contact" value={form.member1Contact} onChange={onChange} placeholder="+91..." required />
                    <Field label="College" name="member1College" value={form.member1College} onChange={onChange} placeholder="College name" />
                    <Field label="Year" name="member1Year" value={form.member1Year} onChange={onChange} placeholder="1st/2nd/3rd/4th" />
                    <Field label="Department" name="member1Department" value={form.member1Department} onChange={onChange} placeholder="CSE/IT/ECE..." />
                    <Field label="LinkedIn" name="member1Linkedin" value={form.member1Linkedin} onChange={onChange} placeholder="https://linkedin.com/in/..." />
                    <Field label="GitHub" name="member1Github" value={form.member1Github} onChange={onChange} placeholder="https://github.com/..." />
                    <Field label="LinkedIn Post URL" name="member1PostLink" value={form.member1PostLink} onChange={onChange} placeholder="https://linkedin.com/posts/..." />
                  </div>
                </div>

                <div className="rounded-xl border border-border p-5 md:p-6">
                  <h2 className="font-orbitron text-xl font-semibold mb-5">Team Mate (Person 2)</h2>
                  <div className="space-y-4">
                    <Field label="Name" name="member2Name" value={form.member2Name} onChange={onChange} placeholder="Full name" />
                    <Field label="Email" name="member2Email" value={form.member2Email} onChange={onChange} placeholder="name@email.com" />
                    <Field label="Contact" name="member2Contact" value={form.member2Contact} onChange={onChange} placeholder="+91..." />
                    <Field label="College" name="member2College" value={form.member2College} onChange={onChange} placeholder="College name" />
                    <Field label="Year" name="member2Year" value={form.member2Year} onChange={onChange} placeholder="1st/2nd/3rd/4th" />
                    <Field label="Department" name="member2Department" value={form.member2Department} onChange={onChange} placeholder="CSE/IT/ECE..." />
                    <Field label="LinkedIn" name="member2Linkedin" value={form.member2Linkedin} onChange={onChange} placeholder="https://linkedin.com/in/..." />
                    <Field label="GitHub" name="member2Github" value={form.member2Github} onChange={onChange} placeholder="https://github.com/..." />
                    <Field label="LinkedIn Post URL" name="member2PostLink" value={form.member2PostLink} onChange={onChange} placeholder="https://linkedin.com/posts/..." />
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{error}</p>
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-border bg-background/50 p-3 text-xs text-muted-foreground">
                <p>
                  Any submitted details will be stored. If team name already exists, a unique suffix will be added automatically.
                </p>
              </div>

              <div className="pt-1">
                <Button type="submit" variant="hero" size="xl" className="w-full" disabled={saving}>
                  {saving ? 'Submitting Registration...' : 'Submit Team Registration'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="rounded-xl border border-secondary/40 bg-secondary/10 p-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-secondary mx-auto mb-3" />
              <p className="font-orbitron text-xl font-bold mb-2">Team Registration Received</p>
              <p className="font-inter text-muted-foreground mb-5">
                Hackathon kickoff is March 13 at 11:00 AM. Your team will receive an assigned problem statement at kickoff.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/registered-teams">
                  <Button variant="hero">View Registered Teams</Button>
                </Link>
                <Link to="/">
                  <Button variant="heroOutline">Return Home</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
