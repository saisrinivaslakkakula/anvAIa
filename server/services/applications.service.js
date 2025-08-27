import { q, tx } from '../pg.js';

export class ApplicationsService {
  static async getApplications(status = null) {
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
    return rows;
  }

  static async updateApplication(id, updates) {
    const { status, notes } = updates || {};
    if (!id) throw new Error('Invalid id');

    return await tx(async (db) => {
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
  }

  static async processBatch(limit = 20) {
    return await tx(async (db) => {
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
  }
}
