import { q, tx } from '../pg.js';

export class JobsService {
  static async getAllJobs() {
    const { rows } = await q(`
      select id, internal_id, title, company, location, description, external_link, source, tags, scraped_at, created_at, updated_at
      from jobs
      order by scraped_at desc nulls last, id desc
    `);
    return rows;
  }

  static async importJobs(jobs) {
    if (!Array.isArray(jobs)) return { added: 0 };
    
    let added = 0;
    await tx(async (db) => {
      for (const job of jobs) {
        // try upsert on external_link first, fallback to internal_id
        if (job.external_link) {
          const r = await db.query(
            `insert into jobs (internal_id, title, company, location, description, external_link, source, scraped_at)
             values ($1,$2,$3,$4,$5,$6,$7, coalesce($8, now()))
             on conflict (external_link) do nothing`,
            [job.internal_id || null, job.title, job.company, job.location || null, job.description || null, job.external_link, job.source || null, job.scraped_at || null]
          );
          added += r.rowCount || 0;
        } else if (job.internal_id) {
          const r = await db.query(
            `insert into jobs (internal_id, title, company, location, description, source, scraped_at)
             values ($1,$2,$3,$4,$5,$6, coalesce($7, now()))
             on conflict (internal_id) do nothing`,
            [job.internal_id, job.title, job.company, job.location || null, job.description || null, job.source || null, job.scraped_at || null]
          );
          added += r.rowCount || 0;
        }
      }
    });
    return { added };
  }

  static async createMockJob(db, company, title, link, internal_id) {
    const r = await db.query(
      `insert into jobs (internal_id, title, company, location, description, external_link, source, scraped_at)
       values ($1,$2,$3,$4,$5,$6,$7, now())
       on conflict (external_link) do nothing`,
      [internal_id, title, company, 'San Francisco, CA', `Mock ${title} at ${company}.`, link, 'Company Site']
    );
    return r.rowCount || 0;
  }
}
