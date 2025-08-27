import { q, tx } from '../pg.js';

export class EventsService {
  static async logApplicationStatusChange(db, applicationId, newStatus, note) {
    await db.query(
      `insert into application_events (application_id, event, details)
       values ($1, 'APPLICATION_STATUS_CHANGED', jsonb_build_object('to',$2,'note',$3))`,
      [applicationId, newStatus, note]
    );
  }

  static async logAgentRun(db, agent, summary) {
    await db.query(
      `insert into agent_runs (agent, started_at, finished_at, summary)
       values ($1, now(), now(), $2)`,
      [agent, summary]
    );
  }

  static async getApplicationEvents(applicationId, limit = 50) {
    const { rows } = await q(
      `select * from application_events 
       where application_id = $1 
       order by created_at desc 
       limit $2`,
      [applicationId, limit]
    );
    return rows;
  }

  static async getAgentRuns(limit = 25) {
    const { rows } = await q(
      `select * from agent_runs 
       order by started_at desc nulls last, id desc 
       limit $1`,
      [limit]
    );
    return rows;
  }
}
