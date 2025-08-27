import dotenv from 'dotenv';

// Load environment variables - but be very careful about which ones
const envPath = new URL('../.env.test', import.meta.url).pathname;
try {
  dotenv.config({ path: envPath });
} catch (error) {
  // If .env.test doesn't exist, don't load any env vars
  console.warn('Warning: .env.test not found, using process.env only');
}

import { prisma } from '../prismaClient.js';

// Enhanced safety guards: do NOT run against prod
export function assertSafeTestDb() {
  const { NODE_ENV, DATABASE_URL, E2E_ALLOW_RESET } = process.env;

  // 1. Environment must be test
  if (NODE_ENV !== 'test') {
    throw new Error('Refusing to run E2E: NODE_ENV must be "test".');
  }

  // 2. Must explicitly allow reset
  if (!E2E_ALLOW_RESET) {
    throw new Error('Refusing to run E2E: E2E_ALLOW_RESET env var is required.');
  }

  // 3. Database URL must exist
  if (!DATABASE_URL) {
    throw new Error('Refusing to run E2E: DATABASE_URL missing.');
  }

  // 4. CRITICAL: Database URL must NOT contain production indicators
  const dbUrl = DATABASE_URL.toLowerCase();
  const productionIndicators = [
    'render.com',
    'heroku.com',
    'aws.amazon.com',
    'googleapis.com',
    'azure.com',
    'digitalocean.com',
    'localhost:5432', // Local production port
    '127.0.0.1:5432'
  ];

  for (const indicator of productionIndicators) {
    if (dbUrl.includes(indicator)) {
      throw new Error(`CRITICAL SAFETY VIOLATION: Database URL contains production indicator: ${indicator}`);
    }
  }

  // 5. Database URL must contain test indicators
  const testIndicators = [
    'test',
    'dev',
    'local',
    'localhost:5433', // Common test port
    '127.0.0.1:5433'
  ];

  const hasTestIndicator = testIndicators.some(indicator => dbUrl.includes(indicator));
  if (!hasTestIndicator) {
    throw new Error('CRITICAL SAFETY VIOLATION: Database URL does not contain test indicators. Refusing to truncate potentially production database.');
  }

  // 6. Additional safety: Check if database name contains 'test'
  const dbNameMatch = DATABASE_URL.match(/\/([^?]+)(\?|$)/);
  if (dbNameMatch && !dbNameMatch[1].toLowerCase().includes('test')) {
    throw new Error(`CRITICAL SAFETY VIOLATION: Database name '${dbNameMatch[1]}' does not contain 'test'. Refusing to truncate potentially production database.`);
  }

  console.log('✅ Safety checks passed. Running against test database.');
}

export async function truncateAll() {
  // Double-check safety before truncating
  assertSafeTestDb();
  
  console.log('⚠️  WARNING: About to truncate all data tables...');
  console.log('⚠️  Database URL:', process.env.DATABASE_URL);
  
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
  
  console.log('✅ Database truncated successfully');
}

export async function insertUser({ email = 'e2e@example.com', full_name = 'E2E User' } = {}) {
  // Safety check before any database operation
  assertSafeTestDb();
  
  const user = await prisma.users.create({
    data: {
      email,
      full_name
    }
  });
  return user;
}
