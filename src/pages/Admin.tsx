import { FormEvent, Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

type RegistrationRecord = {
  id: string;
  team_name: string;
  member1_name: string;
  member1_email: string;
  member1_contact: string;
  member1_college: string;
  member1_year: string;
  member1_department: string;
  member1_linkedin: string;
  member1_github: string;
  member1_post_link: string;
  member2_name: string;
  member2_email: string;
  member2_contact: string;
  member2_college: string;
  member2_year: string;
  member2_department: string;
  member2_linkedin: string;
  member2_github: string;
  member2_post_link: string;
  created_at: string;
};

type AdminActionPayload = {
  email: string;
  password: string;
  action: 'list' | 'delete' | 'update';
  id?: string;
  updates?: Partial<Omit<RegistrationRecord, 'id' | 'created_at'>>;
};

const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<Partial<Omit<RegistrationRecord, 'id' | 'created_at'>>>({});

  const invokeAdminApi = async (payload: AdminActionPayload) => {
    const supabaseUrl = String(import.meta.env.VITE_SUPABASE_URL || '').trim();
    if (!supabaseUrl) {
      throw new Error('Supabase configuration is missing in frontend environment (URL).');
    }

    const functionUrls: string[] = [];
    functionUrls.push(`${supabaseUrl}/functions/v1/admin-registrations`);
    try {
      const host = new URL(supabaseUrl).hostname;
      const ref = host.split('.')[0];
      if (ref) {
        functionUrls.push(`https://${ref}.functions.supabase.co/admin-registrations`);
      }
    } catch {
      // Ignore malformed URL parsing and use primary endpoint only.
    }

    let lastError = 'Unable to reach admin service';
    for (const functionUrl of Array.from(new Set(functionUrls))) {
      try {
        const res = await fetch(functionUrl, {
          method: 'POST',
          // Keep request simple to avoid browser preflight/CORS failures.
          body: JSON.stringify(payload),
          cache: 'no-store',
        });
        const body = (await res.json()) as { error?: string; records?: RegistrationRecord[] };
        if (!res.ok || body.error) {
          lastError = body.error || `Admin API failed (${res.status})`;
          continue;
        }
        return body;
      } catch (err) {
        lastError = err instanceof Error ? err.message : 'Unable to reach admin service';
      }
    }

    throw new Error(lastError);
  };

  const loadRecords = async (currentEmail: string, currentPassword: string) => {
    const data = await invokeAdminApi({ email: currentEmail, password: currentPassword, action: 'list' });
    setRecords((data.records ?? []) as RegistrationRecord[]);
  };

  const onLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loadRecords(email, password);
      setLoggedIn(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    setError(null);
    setLoading(true);
    try {
      const data = await invokeAdminApi({ email, password, action: 'delete', id });
      setRecords((data.records ?? []) as RegistrationRecord[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (row: RegistrationRecord) => {
    setEditingId(row.id);
    setEditingRow({
      team_name: row.team_name,
      member1_name: row.member1_name,
      member1_email: row.member1_email,
      member1_contact: row.member1_contact,
      member1_college: row.member1_college,
      member1_year: row.member1_year,
      member1_department: row.member1_department,
      member1_linkedin: row.member1_linkedin,
      member1_github: row.member1_github,
      member1_post_link: row.member1_post_link,
      member2_name: row.member2_name,
      member2_email: row.member2_email,
      member2_contact: row.member2_contact,
      member2_college: row.member2_college,
      member2_year: row.member2_year,
      member2_department: row.member2_department,
      member2_linkedin: row.member2_linkedin,
      member2_github: row.member2_github,
      member2_post_link: row.member2_post_link,
    });
  };

  const onEditField = (key: keyof Omit<RegistrationRecord, 'id' | 'created_at'>, value: string) => {
    setEditingRow((prev) => ({ ...prev, [key]: value }));
  };

  const saveEdit = async (id: string) => {
    setError(null);
    setLoading(true);
    const payload = {
      team_name: (editingRow.team_name ?? '').trim(),
      member1_name: (editingRow.member1_name ?? '').trim(),
      member1_email: (editingRow.member1_email ?? '').trim(),
      member1_contact: (editingRow.member1_contact ?? '').trim(),
      member1_college: (editingRow.member1_college ?? '').trim(),
      member1_year: (editingRow.member1_year ?? '').trim(),
      member1_department: (editingRow.member1_department ?? '').trim(),
      member1_linkedin: (editingRow.member1_linkedin ?? '').trim(),
      member1_github: (editingRow.member1_github ?? '').trim(),
      member1_post_link: (editingRow.member1_post_link ?? '').trim(),
      member2_name: (editingRow.member2_name ?? '').trim(),
      member2_email: (editingRow.member2_email ?? '').trim(),
      member2_contact: (editingRow.member2_contact ?? '').trim(),
      member2_college: (editingRow.member2_college ?? '').trim(),
      member2_year: (editingRow.member2_year ?? '').trim(),
      member2_department: (editingRow.member2_department ?? '').trim(),
      member2_linkedin: (editingRow.member2_linkedin ?? '').trim(),
      member2_github: (editingRow.member2_github ?? '').trim(),
      member2_post_link: (editingRow.member2_post_link ?? '').trim(),
    };

    try {
      const data = await invokeAdminApi({ email, password, action: 'update', id, updates: payload });
      setRecords((data.records ?? []) as RegistrationRecord[]);
      setEditingId(null);
      setEditingRow({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const onExport = () => {
    const headers = [
      'Team Name',
      'Submitted At (IST)',
      'Name',
      'Email',
      'Contact',
      'College',
      'Year',
      'Department',
      'LinkedIn',
      'GitHub',
      'LinkedIn Post URL',
    ];

    const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const rows = records.flatMap((record) => {
      const submitted = new Date(record.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      return [
        [
          record.team_name,
          submitted,
          record.member1_name,
          record.member1_email,
          record.member1_contact,
          record.member1_college,
          record.member1_year,
          record.member1_department,
          record.member1_linkedin,
          record.member1_github,
          record.member1_post_link,
        ],
        [
          '',
          '',
          record.member2_name,
          record.member2_email,
          record.member2_contact,
          record.member2_college,
          record.member2_year,
          record.member2_department,
          record.member2_linkedin,
          record.member2_github,
          record.member2_post_link,
        ],
      ];
    });

    const csv = [headers, ...rows].map((row) => row.map((cell) => escapeCsv(String(cell || ''))).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vibecoding-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const cell = (record: RegistrationRecord, key: keyof Omit<RegistrationRecord, 'id' | 'created_at'>) => {
    if (editingId !== record.id) {
      return <span className="text-xs text-foreground">{record[key]}</span>;
    }
    return (
      <input
        value={String(editingRow[key] ?? '')}
        onChange={(e) => onEditField(key, e.target.value)}
        className="w-44 rounded border border-border bg-background px-2 py-1 text-xs"
      />
    );
  };

  const linkCell = (url: string) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block max-w-44 truncate text-xs text-primary hover:underline">
      {url || '-'}
    </a>
  );

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-[96vw] mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h1 className="font-orbitron text-3xl md:text-4xl font-bold">Admin Access</h1>
          </div>

          {!loggedIn ? (
            <form onSubmit={onLogin} className="grid gap-4 max-w-lg">
              <div>
                <label className="block text-sm mb-2">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-background px-4 py-3"
                  placeholder="Enter admin email"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  type="password"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3"
                  placeholder="Enter password"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" variant="hero" size="lg" disabled={loading}>
                {loading ? 'Checking...' : 'Login'}
              </Button>
            </form>
          ) : (
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">Total registrations: {records.length}</p>
                <div className="flex items-center gap-2">
                  <Button variant="heroOutline" size="sm" onClick={() => loadRecords(email, password)}>
                    Refresh
                  </Button>
                  <Button variant="hero" size="sm" onClick={onExport} disabled={records.length === 0}>
                    Download Excel (CSV)
                  </Button>
                </div>
              </div>
              {error && <p className="text-sm text-destructive mb-3">{error}</p>}

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-max min-w-full text-left text-xs">
                  <thead className="bg-background/80">
                    <tr className="border-b border-border">
                      <th className="px-3 py-2">#</th>
                      <th className="px-3 py-2">Team</th>
                      <th className="px-3 py-2">Submitted</th>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Contact</th>
                      <th className="px-3 py-2">College</th>
                      <th className="px-3 py-2">Year</th>
                      <th className="px-3 py-2">Dept</th>
                      <th className="px-3 py-2">LinkedIn</th>
                      <th className="px-3 py-2">GitHub</th>
                      <th className="px-3 py-2">Post Link</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, index) => (
                      <Fragment key={record.id}>
                        <tr key={`${record.id}-lead`} className="border-b border-border/60 align-top">
                          <td className="px-3 py-2 text-center font-bold text-primary align-middle" rowSpan={2}>{index + 1}</td>
                          <td className="px-3 py-2 text-center font-bold align-middle" rowSpan={2}>{cell(record, 'team_name')}</td>
                          <td className="px-3 py-2 align-middle" rowSpan={2}>
                            {new Date(record.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                          </td>
                          <td className="px-3 py-2">{cell(record, 'member1_name')}</td>
                          <td className="px-3 py-2">{cell(record, 'member1_email')}</td>
                          <td className="px-3 py-2">{cell(record, 'member1_contact')}</td>
                          <td className="px-3 py-2">{cell(record, 'member1_college')}</td>
                          <td className="px-3 py-2">{cell(record, 'member1_year')}</td>
                          <td className="px-3 py-2">{cell(record, 'member1_department')}</td>
                          <td className="px-3 py-2">{editingId === record.id ? cell(record, 'member1_linkedin') : linkCell(record.member1_linkedin)}</td>
                          <td className="px-3 py-2">{editingId === record.id ? cell(record, 'member1_github') : linkCell(record.member1_github)}</td>
                          <td className="px-3 py-2">{editingId === record.id ? cell(record, 'member1_post_link') : linkCell(record.member1_post_link)}</td>
                          <td className="px-3 py-2" rowSpan={2}>
                            <div className="flex items-center gap-2">
                              {editingId === record.id ? (
                                <>
                                  <Button variant="hero" size="sm" onClick={() => saveEdit(record.id)} disabled={loading}>
                                    Save
                                  </Button>
                                  <Button
                                    variant="heroOutline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingId(null);
                                      setEditingRow({});
                                    }}
                                    disabled={loading}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              ) : (
                                <Button variant="heroOutline" size="sm" onClick={() => startEdit(record)} disabled={loading}>
                                  Edit
                                </Button>
                              )}
                              <Button variant="destructive" size="sm" onClick={() => onDelete(record.id)} disabled={loading}>
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                        <tr key={`${record.id}-mate`} className="border-b border-border/60 align-top">
                          <td className="px-3 py-2">{cell(record, 'member2_name')}</td>
                          <td className="px-3 py-2">{cell(record, 'member2_email')}</td>
                          <td className="px-3 py-2">{cell(record, 'member2_contact')}</td>
                          <td className="px-3 py-2">{cell(record, 'member2_college')}</td>
                          <td className="px-3 py-2">{cell(record, 'member2_year')}</td>
                          <td className="px-3 py-2">{cell(record, 'member2_department')}</td>
                          <td className="px-3 py-2">{editingId === record.id ? cell(record, 'member2_linkedin') : linkCell(record.member2_linkedin)}</td>
                          <td className="px-3 py-2">{editingId === record.id ? cell(record, 'member2_github') : linkCell(record.member2_github)}</td>
                          <td className="px-3 py-2">{editingId === record.id ? cell(record, 'member2_post_link') : linkCell(record.member2_post_link)}</td>
                        </tr>
                        <tr className="h-3 bg-background/60">
                          <td colSpan={13} />
                        </tr>
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
