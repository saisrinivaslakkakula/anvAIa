import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';
import { q, tx } from './pg.js';

const app = express();
app.use(cors());
app.use(express.json());

/* --------- Health --------- */
app.get('/api/health', async (_req, res) => {
  try {
    const { rows } = await q('select now() as ts');
    res.json({ ok: true, ts: rows[0].ts });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

/* --------- Jobs --------- */
// list jobs (with latest app status per user if you want, but for now simple list)
app.get('/api/jobs', async (_req, res) => {
  try {
    const { rows } = await q(`
      select id, internal_id, title, company, location, description, external_link, source, tags, scraped_at, created_at, updated_at
      from jobs
      order by scraped_at desc nulls last, id desc
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// researcher: import jobs [{...}] with de-dupe on external_link OR internal_id
app.post('/api/jobs/import', async (req, res) => {
  const payload = Array.isArray(req.body) ? req.body : [];
  try {
    let added = 0;
    await tx(async (db) => {
      for (const j of payload) {
        // try upsert on external_link first, fallback to internal_id
        if (j.external_link) {
          const r = await db.query(
            `insert into jobs (internal_id, title, company, location, description, external_link, source, scraped_at)
             values ($1,$2,$3,$4,$5,$6,$7, coalesce($8, now()))
             on conflict (external_link) do nothing`,
            [j.internal_id || null, j.title, j.company, j.location || null, j.description || null, j.external_link, j.source || null, j.scraped_at || null]
          );
          added += r.rowCount || 0;
        } else if (j.internal_id) {
          const r = await db.query(
            `insert into jobs (internal_id, title, company, location, description, source, scraped_at)
             values ($1,$2,$3,$4,$5,$6, coalesce($7, now()))
             on conflict (internal_id) do nothing`,
            [j.internal_id, j.title, j.company, j.location || null, j.description || null, j.source || null, j.scraped_at || null]
          );
          added += r.rowCount || 0;
        }
      }
    });
    res.json({ ok: true, added });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

/* --------- Applications --------- */
app.get('/api/applications', async (req, res) => {
  const { status } = req.query;
  try {
    const params = [];
    let where = '';
    if (status) {
      params.push(status);
      where = `where a.status = $1`;
    }
    const { rows } = await q(
      `
      select a.*, j.company, j.title, j.location, j.external_link
      from applications a
      join jobs j on j.id = a.job_id
      ${where}
      order by a.updated_at desc, a.id desc
      `,
      params
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.patch('/api/applications/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { status, notes } = req.body || {};
  if (!id) return res.status(400).json({ ok: false, error: 'Invalid id' });
  try {
    const updated = await tx(async (db) => {
      const { rows } = await db.query(
        `update applications
         set status = coalesce($2, status),
             notes  = coalesce($3, notes),
             updated_at = now()
         where id = $1
         returning *`,
        [id, status || null, notes ?? null]
      );
      if (!rows.length) throw new Error('Not found');

      // audit trail
      await db.query(
        `insert into application_events (application_id, event, details)
         values ($1, 'APPLICATION_STATUS_CHANGED', jsonb_build_object('to',$2,'note',$3))`,
        [id, status || rows[0].status, notes ?? null]
      );

      return rows[0];
    });
    res.json({ ok: true, application: updated });
  } catch (e) {
    const msg = String(e);
    res.status(/not found/i.test(msg) ? 404 : 500).json({ ok: false, error: msg });
  }
});

// mock: apply next batch (change statuses randomly; maybe create a question)
app.post('/api/applications/apply-next-batch', async (req, res) => {
  const limit = Number(req.body?.limit || 20);
  try {
    const results = await tx(async (db) => {
      const cand = await db.query(
        `select a.*
         from applications a
         where a.status in ('IN_PROGRESS','PARTIAL_FILLED','LOGIN_REQUIRED')
         order by a.updated_at asc
         limit $1`,
        [limit]
      );
      const out = [];
      for (const a of cand.rows) {
        const rnd = Math.random();
        let newStatus = a.status;
        let note = a.notes || null;

        if (a.status === 'LOGIN_REQUIRED' && rnd < 0.5) {
          newStatus = 'IN_PROGRESS';
          note = 'Login resolved (mock).';
        } else if (rnd < 0.6) {
          newStatus = 'APPLIED';
          note = 'Submitted successfully (mock).';
        } else if (rnd < 0.8) {
          newStatus = 'PARTIAL_FILLED';
          note = 'Missing answers (mock).';

          // maybe create a fresh open question if none exists
          const hasOpen = await db.query(
            `select 1 from questions where job_id = $1 and user_id = $2 and status = 'OPEN' limit 1`,
            [a.job_id, a.user_id]
          );
          if (!hasOpen.rowCount) {
            await db.query(
              `insert into questions (user_id, job_id, application_id, field_label, help_text, kb_key, status)
               values ($1,$2,$3,'Preferred location?','Select one','preferred_location','OPEN')`,
              [a.user_id, a.job_id, a.id]
            );
          }
        } else {
          newStatus = 'FAILED';
          note = 'Portal error (mock).';
        }

        const { rows } = await db.query(
          `update applications
           set status = $2, notes = $3, updated_at = now()
           where id = $1
           returning id, status, notes`,
          [a.id, newStatus, note]
        );
        await db.query(
          `insert into application_events (application_id, event, details)
           values ($1, 'APPLICATION_STATUS_CHANGED', jsonb_build_object('to',$2,'note',$3))`,
          [a.id, newStatus, note]
        );
        out.push(rows[0]);
      }

      // agent run log
      await db.query(
        `insert into agent_runs (agent, started_at, finished_at, summary)
         values ('applier', now(), now(), $1)`,
        [`Batch processed ${out.length} applications`]
      );

      return out;
    });

    res.json({ ok: true, results });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

/* --------- Questions --------- */
app.get('/api/questions', async (req, res) => {
  const { status } = req.query;
  const params = [];
  let where = '';
  if (status) { where = `where q.status = $1`; params.push(status); }

  try {
    const { rows } = await q(
      `
      select q.*, j.company, j.title, j.location, j.external_link
      from questions q
      join jobs j on j.id = q.job_id
      ${where}
      order by q.updated_at desc, q.id desc
      `,
      params
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.patch('/api/questions/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { answer } = req.body || {};
  if (!id) return res.status(400).json({ ok: false, error: 'Invalid id' });
  if (typeof answer !== 'string' || !answer.trim()) {
    return res.status(400).json({ ok: false, error: 'Answer required' });
  }

  try {
    const out = await tx(async (db) => {
      const qRow = await db.query(
        `update questions
         set answer = $2, status = 'ANSWERED', updated_at = now()
         where id = $1
         returning *`,
        [id, answer.trim()]
      );
      if (!qRow.rowCount) throw new Error('Not found');

      // move application to IN_PROGRESS
      const appRow = await db.query(
        `update applications
         set status = 'IN_PROGRESS', updated_at = now()
         where id = $1
         returning *`,
        [qRow.rows[0].application_id]
      );
      return { question: qRow.rows[0], application: appRow.rows[0] || null };
    });

    res.json({ ok: true, ...out });
  } catch (e) {
    const msg = String(e);
    res.status(/not found/i.test(msg) ? 404 : 500).json({ ok: false, error: msg });
  }
});

/* --------- Agents --------- */
// researcher mock: add a few jobs and log run
app.post('/api/agents/run-researcher', async (_req, res) => {
  try {
    const added = await tx(async (db) => {
      const toAdd = Math.floor(Math.random() * 4) + 3; // 3-6
      let count = 0;
      for (let i = 0; i < toAdd; i++) {
        const company = ['Stripe','Airbnb','Pinterest','OpenAI','Databricks'][Math.floor(Math.random()*5)];
        const title = ['Software Engineer','Backend Engineer','Platform Engineer'][Math.floor(Math.random()*3)];
        const link = `https://jobs.${company.toLowerCase()}.com/${nanoid(6)}`;
        const internal_id = `${new Date().toISOString().slice(0,10)}-${company.toLowerCase()}-${title.toLowerCase().replace(/\s+/g,'-')}-${nanoid(5)}`;

        // insert if not exists
        const r = await db.query(
          `insert into jobs (internal_id, title, company, location, description, external_link, source, scraped_at)
           values ($1,$2,$3,$4,$5,$6,$7, now())
           on conflict (external_link) do nothing`,
          [internal_id, title, company, 'San Francisco, CA', `Mock ${title} at ${company}.`, link, 'Company Site']
        );
        count += r.rowCount || 0;
      }

      await db.query(
        `insert into agent_runs (agent, started_at, finished_at, summary)
         values ('researcher', now(), now(), $1)`,
        [`Found ${count} jobs; ${count} unique after dedupe`]
      );

      return count;
    });

    res.json({ ok: true, added: added });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// applier: delegate to batch endpoint logic (simple proxy)
app.post('/api/agents/run-applier', async (req, res) => {
  // just call the handler above (keep shape same for smoke script)
  req.url = '/api/applications/apply-next-batch';
  app._router.handle(req, res);
});

app.get('/api/agents/runs', async (_req, res) => {
  try {
    const { rows } = await q(
      `select * from agent_runs order by started_at desc nulls last, id desc`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
