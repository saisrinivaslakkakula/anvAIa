import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env.test', import.meta.url).pathname });

import request from 'supertest';
import { buildApp } from '../index.js';   // 👈 now valid
import { assertSafeTestDb, truncateAll, insertUser } from './utils.ts';

const app = buildApp();

// 🚨 CRITICAL SAFETY CHECK - RUNS BEFORE ANY TESTS
describe('SAFETY CHECK', () => {
  test('should have proper test environment', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.E2E_ALLOW_RESET).toBe('true');
    
    // Check if we have a test database URL
    const dbUrl = process.env.DATABASE_URL || '';
    if (dbUrl) {
      // Extract database name from URL using the same regex as the safety function
      const dbNameMatch = dbUrl.match(/\/\/(?:[^@]+@)?[^\/]+\/([^?]+)(?:\?|$)/);
      if (dbNameMatch) {
        const dbName = dbNameMatch[1];
        expect(dbName).toBe('whisperbox');
      }
    }
  });
  
  test('should pass safety checks when environment is properly configured', () => {
    // This test will pass if all safety checks pass
    expect(() => assertSafeTestDb()).not.toThrow();
  });
});

describe('Job Agents API — E2E', () => {
  beforeAll(async () => {
    assertSafeTestDb();
    await truncateAll();
  });

  afterAll(async () => {
    // Final cleanup
    await truncateAll();
  });

  test('GET /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.ts).toBeTruthy();
  });

  test('Jobs: import → list', async () => {
    // Import 2 jobs
    const imp = await request(app)
      .post('/api/jobs/import')
      .send([
        {
          internal_id: 'e2e-int-1',
          title: 'E2E Platform Engineer',
          company: 'E2E Co',
          location: 'San Francisco, CA',
          description: 'e2e import test',
          external_link: 'https://example.com/jobs/e2e-1',
          source: 'Company Site'
        },
        {
          internal_id: 'e2e-int-2',
          title: 'E2E Backend Engineer',
          company: 'E2E Co',
          location: 'San Francisco, CA',
          description: 'e2e import test',
          external_link: 'https://example.com/jobs/e2e-2',
          source: 'Company Site'
        }
      ]);
    expect(imp.status).toBe(200);
    expect(imp.body.ok).toBe(true);
    expect(typeof imp.body.added).toBe('number');

    // List jobs
    const list = await request(app).get('/api/jobs');
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.length).toBeGreaterThanOrEqual(2);

    // Keep a jobId for applications
    const job = list.body.find(j => j.external_link === 'https://example.com/jobs/e2e-1');
    expect(job).toBeTruthy();
    globalThis.__E2E_JOB_ID__ = job.id;
  });

  test('Applications: insert (DB) → list → patch', async () => {
    const user = await insertUser();
    const jobId = globalThis.__E2E_JOB_ID__;
    expect(jobId).toBeTruthy();

    // Create application via API
    const create = await request(app)
      .post('/api/applications')
      .send({
        job_id: jobId,
        user_id: user.id,
        status: 'IN_PROGRESS'
      });
    expect(create.status).toBe(200);
    expect(create.body.ok).toBe(true);
    const appId = create.body.application.id;

    // GET applications
    const list = await request(app).get('/api/applications');
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    const appRow = list.body.find(a => String(a.id) === String(appId));
    expect(appRow).toBeTruthy();
    
    globalThis.__E2E_APP_ID__ = appRow.id;
    globalThis.__E2E_USER_ID__ = user.id;

    const found = list.body.find(a => String(a.id) === String(appRow.id));
    expect(found).toBeTruthy();
    expect(found.status).toBe('IN_PROGRESS');

    // PATCH application
    const patch = await request(app)
      .patch(`/api/applications/${appRow.id}`)
      .send({ status: 'PARTIAL_FILLED', notes: 'moved by e2e' });
    expect(patch.status).toBe(200);
    expect(patch.body.ok).toBe(true);
    expect(patch.body.application.status).toBe('PARTIAL_FILLED');
  });

  test('Questions: POST create → GET open → PATCH answer', async () => {
    const jobId = globalThis.__E2E_JOB_ID__;
    const appId = globalThis.__E2E_APP_ID__;
    const userId = globalThis.__E2E_USER_ID__;
    expect(jobId && appId && userId).toBeTruthy();

    // Create question via API
    const create = await request(app)
      .post('/api/questions/create')
      .send({
        job_id: jobId,
        application_id: appId,
        field_label: 'Are you authorized to work in the US?',
        help_text: 'Yes/No',
        kb_key: 'work_auth',
        status: 'OPEN'
      });
    expect(create.status).toBe(200);
    expect(create.body.ok).toBe(true);
    expect(create.body.question.status).toBe('OPEN');
    const qid = create.body.question.id;

    // List open
    const list = await request(app).get('/api/questions?status=OPEN');
    expect(list.status).toBe(200);
    const open = list.body.find(q => String(q.id) === String(qid));
    expect(open).toBeTruthy();

    // Answer
    const answer = await request(app)
      .patch(`/api/questions/${qid}`)
      .send({ answer: 'Yes' });
    expect(answer.status).toBe(200);
    expect(answer.body.ok).toBe(true);
    expect(answer.body.question.status).toBe('ANSWERED');
    // app should be moved to IN_PROGRESS by service
    expect(answer.body.application?.status).toBe('IN_PROGRESS');
  });
});
