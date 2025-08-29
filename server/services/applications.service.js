import { prisma } from '../prismaClient.js';
import { convertBigInts } from '../utils/prisma.js';

export class ApplicationsService {
  static async createApplication(applicationData) {
    const { job_id, user_id, status = 'IN_PROGRESS' } = applicationData || {};
    
    if (!job_id || !user_id) {
      throw new Error('Missing required fields: job_id, user_id');
    }

    // Ensure job exists
    const job = await prisma.jobs.findUnique({
      where: { id: BigInt(job_id) }
    });
    if (!job) throw new Error(`NotFound: job ${job_id}`);

    // Ensure user exists
    const user = await prisma.users.findUnique({
      where: { id: user_id }
    });
    if (!user) throw new Error(`NotFound: user ${user_id}`);

    const newApplication = await prisma.applications.create({
      data: {
        job_id: BigInt(job_id),
        user_id,
        status,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    return convertBigInts(newApplication);
  }

  static async getApplications(status = null) {
    const where = status ? { status } : {};
    
    const applications = await prisma.applications.findMany({
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
    const flattenedApplications = applications.map(app => {
      const { jobs, ...appData } = app;
      
      // Fix date handling - ensure we have valid dates
      let created_at = appData.created_at;
      let updated_at = appData.updated_at;
      
      // If dates are invalid objects or null, create new dates
      if (!created_at || typeof created_at !== 'object' || created_at.constructor !== Date) {
        created_at = new Date();
      }
      if (!updated_at || typeof updated_at !== 'object' || updated_at.constructor !== Date) {
        updated_at = new Date();
      }
      
      return {
        ...appData,
        company: jobs?.company || null,
        title: jobs?.title || null,
        location: jobs?.location || null,
        external_link: jobs?.external_link || null,
        created_at: created_at,
        updated_at: updated_at
      };
    });
    
    return convertBigInts(flattenedApplications);
  }

  static async updateApplication(id, updates) {
    const { status, notes } = updates || {};
    if (!id) throw new Error('Invalid id');

    const updated = await prisma.applications.update({
      where: { id: BigInt(id) },
      data: {
        status: status || undefined,
        notes: notes ?? undefined,
        updated_at: new Date()
      }
    });

    // Create audit trail event
    await prisma.application_events.create({
      data: {
        application_id: BigInt(id),
        event: 'APPLICATION_STATUS_CHANGED',
        details: {
          to: status || updated.status,
          note: notes ?? null
        }
      }
    });

    return convertBigInts(updated);
  }

  static async processBatch(limit = 20) {
    const candidates = await prisma.applications.findMany({
      where: {
        status: {
          in: ['IN_PROGRESS', 'PARTIAL_FILLED', 'LOGIN_REQUIRED']
        }
      },
      orderBy: { updated_at: 'asc' },
      take: limit
    });

    const results = [];
    
    for (const app of candidates) {
      const rnd = Math.random();
      let newStatus = app.status;
      let note = app.notes || null;

      if (app.status === 'LOGIN_REQUIRED' && rnd < 0.5) {
        newStatus = 'IN_PROGRESS';
        note = 'Login resolved (mock).';
      } else if (rnd < 0.6) {
        newStatus = 'APPLIED';
        note = 'Submitted successfully (mock).';
      } else if (rnd < 0.8) {
        newStatus = 'PARTIAL_FILLED';
        note = 'Missing answers (mock).';

        // Check if there's already an open question
        const existingQuestion = await prisma.questions.findFirst({
          where: {
            job_id: app.job_id,
            user_id: app.user_id,
            status: 'OPEN'
          }
        });

        if (!existingQuestion) {
          // Create a new question
          await prisma.questions.create({
            data: {
              user_id: app.user_id,
              job_id: app.job_id,
              application_id: app.id,
              field_label: 'Preferred location?',
              help_text: 'Select one',
              kb_key: 'preferred_location',
              status: 'OPEN'
            }
          });
        }
      } else {
        newStatus = 'FAILED';
        note = 'Portal error (mock).';
      }

      // Update application
      const updated = await prisma.applications.update({
        where: { id: app.id },
        data: {
          status: newStatus,
          notes: note,
          updated_at: new Date()
        }
      });

      // Create audit trail event
      await prisma.application_events.create({
        data: {
          application_id: app.id,
          event: 'APPLICATION_STATUS_CHANGED',
          details: {
            to: newStatus,
            note: note
          }
        }
      });

      results.push(updated);
    }

    // Log agent run
    await prisma.agent_runs.create({
      data: {
        agent: 'applier',
        started_at: new Date(),
        finished_at: new Date(),
        summary: `Batch processed ${results.length} applications`
      }
    });

    return convertBigInts(results);
  }
}
