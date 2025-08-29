import { prisma } from '../prismaClient.js';
import { convertBigInts } from '../utils/prisma.js';

export class QuestionsService {
  static async getQuestions(status = null) {
    const where = status ? { status } : {};
    
    const questions = await prisma.questions.findMany({
      where,
      include: {
        jobs: {
          select: {
            company: true,
            title: true,
            location: true,
            external_link: true
          }
        }
      },
      orderBy: [
        { updated_at: 'desc' },
        { id: 'desc' }
      ]
    });
    
    // Flatten the nested jobs data and ensure proper date handling
    const flattenedQuestions = questions.map(q => {
      const { jobs, ...questionData } = q;
      
      // Fix date handling - ensure we have valid dates
      let created_at = questionData.created_at;
      let updated_at = questionData.updated_at;
      
      // If dates are invalid objects or null, create new dates
      if (!created_at || typeof created_at !== 'object' || created_at.constructor !== Date) {
        created_at = new Date();
      }
      if (!updated_at || typeof updated_at !== 'object' || updated_at.constructor !== Date) {
        updated_at = new Date();
      }
      
      return {
        ...questionData,
        company: jobs?.company || null,
        title: jobs?.title || null,
        location: jobs?.location || null,
        external_link: jobs?.external_link || null,
        created_at: created_at,
        updated_at: updated_at
      };
    });
    
    return convertBigInts(flattenedQuestions);
  }

  static async answerQuestion(id, answer) {
    if (!id) throw new Error('Invalid id');
    if (typeof answer !== 'string' || !answer.trim()) {
      throw new Error('Answer required');
    }

    // Update question
    const question = await prisma.questions.update({
      where: { id: BigInt(id) },
      data: {
        answer: answer.trim(),
        status: 'ANSWERED',
        updated_at: new Date()
      }
    });

    // Move application to IN_PROGRESS if application_id exists
    let application = null;
    if (question.application_id) {
      application = await prisma.applications.update({
        where: { id: question.application_id },
        data: {
          status: 'IN_PROGRESS',
          updated_at: new Date()
        }
      });
    }

    return convertBigInts({ 
      question, 
      application 
    });
  }

  static async createQuestion(questionData) {
    const { job_id, application_id, field_label, help_text, kb_key, status } = questionData;

    // Basic validation
    if (!job_id || !field_label || !kb_key || !status) {
      throw new Error('Missing required fields: job_id, field_label, kb_key, status');
    }

    // Optional: enum validation in app layer (Postgres will also enforce)
    const ALLOWED = new Set(['OPEN','ANSWERED','INVALID']);
    if (!ALLOWED.has(status)) {
      throw new Error(`Invalid status '${status}'. Allowed: OPEN, ANSWERED, INVALID`);
    }

    // 1) ensure job exists
    const job = await prisma.jobs.findUnique({
      where: { id: BigInt(job_id) }
    });
    if (!job) throw new Error(`NotFound: job ${job_id}`);

    // 2) if application_id is provided, load application & ensure it belongs to the same job
    let user_id;
    if (application_id) {
      const app = await prisma.applications.findUnique({
        where: { id: BigInt(application_id) }
      });
      if (!app) throw new Error(`NotFound: application ${application_id}`);
      if (app.job_id !== BigInt(job_id)) {
        throw new Error(`BadRequest: application ${application_id} is for job ${app.job_id}, not ${job_id}`);
      }
      user_id = app.user_id;
    } else {
      // For now, we need a user_id. In a real app, this would come from authentication
      throw new Error('application_id is required to derive user_id');
    }

    // 3) insert question
    const question = await prisma.questions.create({
      data: {
        user_id,
        job_id: BigInt(job_id),
        application_id: BigInt(application_id),
        field_label,
        help_text: help_text || null,
        kb_key,
        status
      }
    });

    return convertBigInts(question);
  }
}
