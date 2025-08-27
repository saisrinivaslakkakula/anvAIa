import { prisma } from '../prismaClient.js';
import { convertBigInts } from '../utils/prisma.js';

export class EventsService {
  static async logApplicationStatusChange(applicationId, newStatus, note) {
    await prisma.application_events.create({
      data: {
        application_id: BigInt(applicationId),
        event: 'APPLICATION_STATUS_CHANGED',
        details: {
          to: newStatus,
          note: note
        }
      }
    });
  }

  static async logAgentRun(agent, summary) {
    await prisma.agent_runs.create({
      data: {
        agent,
        started_at: new Date(),
        finished_at: new Date(),
        summary
      }
    });
  }

  static async getApplicationEvents(applicationId, limit = 50) {
    const events = await prisma.application_events.findMany({
      where: { application_id: BigInt(applicationId) },
      orderBy: { created_at: 'desc' },
      take: limit
    });
    
    return convertBigInts(events);
  }

  static async getAgentRuns(limit = 25) {
    const runs = await prisma.agent_runs.findMany({
      orderBy: [
        { started_at: 'desc' },
        { id: 'desc' }
      ],
      take: limit
    });
    
    return convertBigInts(runs);
  }
}
