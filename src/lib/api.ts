const BASE = import.meta.env.VITE_API_BASE_URL || ''; // '' => use Vite proxy to /api

async function jfetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(()=> '');
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return (await res.json()) as T;
}

export const api = {
  health: () => jfetch<{ok:boolean; ts:string}>(`/health`),
  jobs: () => jfetch<any[]>(`/jobs`),
  applications: (status?: string) =>
    jfetch<any[]>(`/applications${status ? `?status=${encodeURIComponent(status)}` : ''}`),
  updateApplication: (id: number, body: {status?:string; notes?:string}) =>
    jfetch<{ok:boolean; application:any}>(`/applications/${id}`, { method:'PATCH', body: JSON.stringify(body) }),
  applyBatch: (limit=5) =>
    jfetch<{ok:boolean; results:any[]}>(`/applications/apply-next-batch`, { method:'POST', body: JSON.stringify({limit}) }),

  questions: (status?: 'OPEN'|'ANSWERED') =>
    jfetch<any[]>(`/questions${status ? `?status=${status}` : ''}`),
  answerQuestion: (id:number, answer:string) =>
    jfetch<{ok:boolean; question:any; application:any}>(`/questions/${id}`, { method:'PATCH', body: JSON.stringify({answer}) }),

  runResearcher: () => jfetch<{ok:boolean; added:number}>(`/agents/run-researcher`, { method:'POST', body:'{}' }),
  runApplier: () => jfetch<any>(`/agents/run-applier`, { method:'POST', body:'{}' }),
  runs: () => jfetch<any[]>(`/agents/runs`),
};
