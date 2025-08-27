import { prisma } from '../prismaClient.js';
import { convertBigInts } from '../utils/prisma.js';

export class JobsService {
  static async getAllJobs() {
    const jobs = await prisma.jobs.findMany({
      orderBy: [
        { scraped_at: 'desc' },
        { id: 'desc' }
      ]
    });
    return convertBigInts(jobs);
  }

  static async importJobs(jobs) {
    if (!Array.isArray(jobs)) return { added: 0 };
    
    let added = 0;
    
    for (const job of jobs) {
      try {
        if (job.external_link) {
          const result = await prisma.jobs.upsert({
            where: { external_link: job.external_link },
            update: {
              title: job.title,
              company: job.company,
              location: job.location || null,
              description: job.description || null,
              source: job.source || null,
              scraped_at: job.scraped_at ? new Date(job.scraped_at) : new Date(),
              updated_at: new Date()
            },
            create: {
              internal_id: job.internal_id || null,
              title: job.title,
              company: job.company,
              location: job.location || null,
              description: job.description || null,
              external_link: job.external_link,
              source: job.source || null,
              scraped_at: job.scraped_at ? new Date(job.scraped_at) : new Date()
            }
          });
          added++;
        } else if (job.internal_id) {
          const result = await prisma.jobs.upsert({
            where: { internal_id: job.internal_id },
            update: {
              title: job.title,
              company: job.company,
              location: job.location || null,
              description: job.description || null,
              source: job.source || null,
              scraped_at: job.scraped_at ? new Date(job.scraped_at) : new Date(),
              updated_at: new Date()
            },
            create: {
              internal_id: job.internal_id,
              title: job.title,
              company: job.company,
              location: job.location || null,
              description: job.description || null,
              source: job.source || null,
              scraped_at: job.scraped_at ? new Date(job.scraped_at) : new Date()
            }
          });
          added++;
        }
      } catch (error) {
        console.error('Error importing job:', error);
      }
    }
    
    return { added };
  }

  static async createMockJob(company, title, link, internal_id) {
    try {
      const result = await prisma.jobs.create({
        data: {
          internal_id,
          title,
          company,
          location: 'San Francisco, CA',
          description: `Mock ${title} at ${company}.`,
          external_link: link,
          source: 'Company Site',
          scraped_at: new Date()
        }
      });
      return 1; // Return 1 for successful creation
    } catch (error) {
      if (error.code === 'P2002') {
        // Unique constraint violation, job already exists
        return 0;
      }
      throw error;
    }
  }
}
