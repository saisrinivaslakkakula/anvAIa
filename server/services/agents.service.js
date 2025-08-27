import { q, tx } from '../pg.js';
import { nanoid } from 'nanoid';
import { JobsService } from './jobs.service.js';

export class AgentsService {
  static async runResearcher() {
    return await tx(async (db) => {
      const toAdd = Math.floor(Math.random() * 4) + 3; // 3-6
      let count = 0;
      
      for (let i = 0; i < toAdd; i++) {
        const company = ['Stripe','Airbnb','Pinterest','OpenAI','Databricks'][Math.floor(Math.random()*5)];
        const title = ['Software Engineer','Backend Engineer','Platform Engineer'][Math.floor(Math.random()*3)];
        const link = `https://jobs.${company.toLowerCase()}.com/${nanoid(6)}`;
        const internal_id = `${new Date().toISOString().slice(0,10)}-${company.toLowerCase()}-${title.toLowerCase().replace(/\s+/g,'-')}-${nanoid(5)}`;

        // insert if not exists
        count += await JobsService.createMockJob(db, company, title, link, internal_id);
      }

      // log the run
      await db.query(
        `insert into agent_runs (agent, started_at, finished_at, summary)
         values ('researcher', now(), now(), $1)`,
        [`Found ${count} jobs; ${count} unique after dedupe`]
      );

      return count;
    });
  }

  static async runApplier() {
    // This is handled by the applications service
    // We just need to log the run
    return await tx(async (db) => {
      await db.query(
        `insert into agent_runs (agent, started_at, finished_at, summary)
         values ('applier', now(), now(), 'Batch processing initiated')`
      );
      return { ok: true };
    });
  }

  static async getRuns() {
    const { rows } = await q(
      `select * from agent_runs order by started_at desc nulls last, id desc`
    );
    return rows;
  }
}
