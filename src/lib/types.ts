export type AppStatus = 'APPLIED'|'PARTIAL_FILLED'|'LOGIN_REQUIRED'|'IN_PROGRESS'|'FAILED'|'SKIPPED';

export type Job = {
  id: number; internal_id: string; title: string; company: string; location: string;
  description: string; external_link: string; source: string; scraped_at: string;
};

export type Application = {
  id: number; job_id: number; user_id: string; status: AppStatus;
  notes?: string; created_at: string; updated_at: string;
};

export type Question = {
  id: number; job_id: number; user_id: string; field_label: string;
  help_text?: string; kb_key?: string; answer?: string;
  status: 'OPEN'|'ANSWERED'|'INVALID'; created_at: string; updated_at: string;
};

export type RunLog = {
  id: number; agent: 'researcher'|'applier';
  started_at: string; finished_at: string; summary: string; raw?: unknown;
};
