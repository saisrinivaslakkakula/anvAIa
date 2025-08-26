import { applications as seedApplications, jobs as seedJobs, questions as seedQuestions, runLogs as seedRuns } from '../data/seed';
import type { Application, Job, Question, RunLog } from './types';
import type { AppStatus } from './types';

const KEY = 'job-agents-db-v1';
type DB = { jobs: Job[]; applications: Application[]; questions: Question[]; runs: RunLog[]; };

function init(): DB {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  const db: DB = { jobs: seedJobs, applications: seedApplications, questions: seedQuestions, runs: seedRuns };
  saveDB(db);
  return db;
}
export function getDB(): DB { return init(); }

export function getCounts() {
  const db = getDB();
  const applied = db.applications.filter(a => a.status === 'APPLIED').length;
  const inProgress = db.applications.filter(a => a.status === 'IN_PROGRESS').length;
  const openQs = db.questions.filter(q => q.status === 'OPEN').length;
  return { applied, inProgress, openQs };
}

export function getRecentApplications(limit = 5) {
  const db = getDB();
  const byUpdated = [...db.applications].sort((a,b)=> new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  return byUpdated.slice(0, limit).map(a => ({ ...a, job: db.jobs.find(j => j.id === a.job_id)! }));
}

// --- QUESTIONS ----
export function getOpenQuestions() {
  const db = JSON.parse(localStorage.getItem(KEY) || '{}');
  if (!db.questions) return [];
  return db.questions
    .filter((q: any) => q.status === 'OPEN')
    .map((q: any) => ({ ...q, job: db.jobs.find((j: any) => j.id === q.job_id) }));
}

export function answerQuestion(id: number, answer: string) {
  const db = JSON.parse(localStorage.getItem(KEY) || '{}');
  const q = db.questions?.find((x: any) => x.id === id);
  if (!q) return false;

  q.answer = answer;
  q.status = 'ANSWERED';
  q.updated_at = new Date().toISOString();

  // bump related application to IN_PROGRESS
  const app = db.applications?.find((a: any) => a.job_id === q.job_id);
  if (app) {
    app.status = 'IN_PROGRESS';
    app.updated_at = new Date().toISOString();
  }

  saveDB(db);
  return true;
}

// --- RUN LOGS ---
type Agent = 'researcher' | 'applier';

export function getRuns(limit = 25) {
  const db = getDB();
  return [...db.runs].sort(
    (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
  ).slice(0, limit);
}

export function addRun(agent: Agent, summary: string, raw?: unknown) {
  const db = getDB();
  const id = Math.max(0, ...db.runs.map(r => r.id)) + 1;
  const now = new Date().toISOString();
  db.runs.unshift({
    id,
    agent,
    started_at: now,
    finished_at: now,
    summary,
    raw
  });
  saveDB(db);
  return db.runs[0];
}

// Simple “fake” runs (no side‑effects on apps yet)
export function fakeResearcherRun() {
  const found = Math.floor(Math.random() * 8) + 8;      // 8–15
  const unique = Math.max(found - Math.floor(Math.random() * 4), 5);
  return addRun('researcher', `Found ${found} jobs; ${unique} unique after dedupe`);
}

export function fakeApplierRun() {
  const applied = Math.floor(Math.random() * 3);         // 0–2
  const partial = Math.floor(Math.random() * 2);         // 0–1
  const login = Math.floor(Math.random() * 2);           // 0–1
  return addRun('applier', `Applied: ${applied}, Partial: ${partial}, Login Required: ${login}`);
}

// --- tiny event bus ---
const DB_EVENT = 'db:updated';
function emitDBUpdated() {
  window.dispatchEvent(new CustomEvent(DB_EVENT));
}

// keep if you already have getDB()
function saveDB(db: any) {
  localStorage.setItem(KEY, JSON.stringify(db));
  emitDBUpdated();
}

export type JoinedApp = ReturnType<typeof getJoinedApplications>[number];

export function getJoinedApplications(opts?: {
  status?: AppStatus | 'ALL';
  search?: string;
}) {
  const db = getDB();
  let rows = db.applications
    .map(a => ({ ...a, job: db.jobs.find(j => j.id === a.job_id)! }))
    .filter(r => !!r.job);

  if (opts?.status && opts.status !== 'ALL') {
    rows = rows.filter(r => r.status === opts.status);
  }
  if (opts?.search?.trim()) {
    const q = opts.search.toLowerCase();
    rows = rows.filter(r =>
      r.job.company.toLowerCase().includes(q) ||
      r.job.title.toLowerCase().includes(q) ||
      r.job.location.toLowerCase().includes(q)
    );
  }

  // newest updated first
  rows.sort((a,b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  return rows;
}

export const ALL_STATUSES: (AppStatus | 'ALL')[] = [
  'ALL','APPLIED','IN_PROGRESS','PARTIAL_FILLED','LOGIN_REQUIRED','FAILED','SKIPPED'
];