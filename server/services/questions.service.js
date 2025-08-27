import { q, tx } from '../pg.js';

export class QuestionsService {
  static async getQuestions(status = null) {
    const params = [];
    let where = '';
    if (status) { 
      where = `where q.status = $1`; 
      params.push(status); 
    }

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
    return rows;
  }

  static async answerQuestion(id, answer) {
    if (!id) throw new Error('Invalid id');
    if (typeof answer !== 'string' || !answer.trim()) {
      throw new Error('Answer required');
    }

    return await tx(async (db) => {
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
  }

  static async createQuestion(questionData) {
    const { job_id, application_id, field_label, help_text, kb_key, status } = questionData;

    // Basic validation
    if (!job_id || !application_id || !field_label || !kb_key || !status) {
      throw new Error('Missing required fields: job_id, application_id, field_label, kb_key, status');
    }

    // Optional: enum validation in app layer (Postgres will also enforce)
    const ALLOWED = new Set(['OPEN','ANSWERED','INVALID']);
    if (!ALLOWED.has(status)) {
      throw new Error(`Invalid status '${status}'. Allowed: OPEN, ANSWERED, INVALID`);
    }

    return await tx(async (db) => {
      // 1) ensure job exists
      const job = await db.query(`select id from jobs where id = $1`, [job_id]);
      if (!job.rowCount) throw new Error(`NotFound: job ${job_id}`);

      // 2) load application & ensure it belongs to the same job
      const appRow = await db.query(
        `select id, user_id, job_id from applications where id = $1`,
        [application_id]
      );
      if (!appRow.rowCount) throw new Error(`NotFound: application ${application_id}`);

      const app = appRow.rows[0];
      if (Number(app.job_id) !== Number(job_id)) {
        throw new Error(`BadRequest: application ${application_id} is for job ${app.job_id}, not ${job_id}`);
      }

      // 3) insert question, derive user_id from application
      const ins = await db.query(
        `insert into questions (user_id, job_id, application_id, field_label, help_text, kb_key, status)
         values ($1,$2,$3,$4,$5,$6,$7)
         returning *`,
        [app.user_id, job_id, application_id, field_label, help_text || null, kb_key, status]
      );

      return ins.rows[0];
    });
  }
}
