import type { Application, Job, Question, RunLog } from '../lib/types';

export const jobs: Job[] = [
  {
    id: 1,
    internal_id: '2025-08-20-airbnb-se-platform-a1b2c',
    title: 'Software Engineer, Platform',
    company: 'Airbnb',
    location: 'San Francisco, CA',
    description: 'Build distributed systems powering developer platform.',
    external_link: 'https://careers.airbnb.com/jobs/12345',
    source: 'Company Site',
    scraped_at: '2025-08-20T08:00:00-07:00',
  },
  {
    id: 2,
    internal_id: '2025-08-20-doordash-be-payments-b4c5d',
    title: 'Backend Engineer, Payments',
    company: 'DoorDash',
    location: 'San Francisco, CA',
    description: 'Design payment services; improve reliability and latency.',
    external_link: 'https://careers.doordash.com/jobs/67890',
    source: 'Company Site',
    scraped_at: '2025-08-20T08:10:00-07:00',
  }
];

export const applications: Application[] = [
  {
    id: 101, job_id: 1, user_id: 'usr_001',
    status: 'PARTIAL_FILLED', notes: 'Missing work auth and sponsorship answers',
    created_at: '2025-08-20T10:00:00-07:00', updated_at: '2025-08-20T10:05:00-07:00'
  },
  {
    id: 102, job_id: 2, user_id: 'usr_001',
    status: 'LOGIN_REQUIRED', notes: 'Workday account required',
    created_at: '2025-08-20T10:10:00-07:00', updated_at: '2025-08-20T10:10:00-07:00'
  }
];

export const questions: Question[] = [
  {
    id: 201, job_id: 1, user_id: 'usr_001',
    field_label: 'Are you legally authorized to work in the United States?',
    help_text: 'Select Yes/No', kb_key: 'work_auth',
    status: 'OPEN', created_at: '2025-08-20T10:02:00-07:00', updated_at: '2025-08-20T10:02:00-07:00'
  },
  {
    id: 202, job_id: 1, user_id: 'usr_001',
    field_label: 'Will you now or in the future require sponsorship?',
    help_text: 'H-1B, O-1, etc.', kb_key: 'sponsorship_needed',
    status: 'OPEN', created_at: '2025-08-20T10:03:00-07:00', updated_at: '2025-08-20T10:03:00-07:00'
  }
];

export const runLogs: RunLog[] = [
  { id: 301, agent: 'researcher', started_at: '2025-08-20T08:00:00-07:00', finished_at: '2025-08-20T08:20:00-07:00', summary: 'Found 12 jobs; 10 unique after dedupe' },
  { id: 302, agent: 'applier',    started_at: '2025-08-20T10:00:00-07:00', finished_at: '2025-08-20T10:25:00-07:00', summary: 'Applied: 1, Partial: 1, Login Required: 1' }
];
