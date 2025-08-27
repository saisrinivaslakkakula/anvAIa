import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env.test', import.meta.url).pathname });

import { prisma } from '../prismaClient.js';

// Safety guards: do NOT run against prod
export function assertSafeTestDb() {
  const { NODE_ENV, DATABASE_URL, E2E_ALLOW_RESET } = process.env;

  if (NODE_ENV !== 'test') {
    throw new Error('Refusing to run E2E: NODE_ENV must be "test".');
  }
  if (!E2E_ALLOW_RESET) {
    throw new Error('Refusing to run E2E: E2E_ALLOW_RESET env var is required.');
  }
  if (!DATABASE_URL) {
    throw new Error('Refusing to run E2E: DATABASE_URL missing.');
  }
}

export async function truncateAll() {
  // Truncate all data tables; keep enums/extensions
  // Order doesn't matter due to CASCADE.
  await prisma.$executeRaw`
    TRUNCATE TABLE
      application_events,
      questions,
      applications,
      agent_runs,
      knowledge_base,
      jobs,
      users
    RESTART IDENTITY CASCADE
  `;
}

export async function insertUser({ email = 'e2e@example.com', full_name = 'E2E User' } = {}) {
  const user = await prisma.users.create({
    data: {
      email,
      full_name
    }
  });
  return user;
}
