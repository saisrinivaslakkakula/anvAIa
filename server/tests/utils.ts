import dotenv from 'dotenv';

// Load test environment variables FIRST
const envPath = new URL('../.env.test', import.meta.url).pathname;
try {
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.warn('Warning: Error loading .env.test:', result.error.message);
  } else if (result.parsed) {
    console.log('✅ Loaded test environment variables');
    console.log('🔍 Test env DATABASE_URL:', result.parsed.DATABASE_URL);
    // Override process.env with test values
    Object.assign(process.env, result.parsed);
    console.log('🔍 After override, process.env.DATABASE_URL:', process.env.DATABASE_URL);
  }
} catch (error) {
  console.warn('Warning: .env.test not found, using process.env only');
}

import { prisma } from '../prismaClient.js';

// Enhanced safety guards: do NOT run against prod
export function assertSafeTestDb() {
  const { NODE_ENV, DATABASE_URL, E2E_ALLOW_RESET } = process.env;

  console.log('🚨 SAFETY CHECK - Current environment variables:');
  console.log('   NODE_ENV:', NODE_ENV);
  console.log('   E2E_ALLOW_RESET:', E2E_ALLOW_RESET);
  console.log('   DATABASE_URL:', DATABASE_URL);
  
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

  // 4. CRITICAL: Check if this is a safe connection
  const dbUrl = DATABASE_URL.toLowerCase();
  
  // BLOCK: Remote production connections (Render.com, Heroku, etc.)
  const productionHosts = [
    'render.com',
    'heroku.com',
    'aws.amazon.com',
    'googleapis.com',
    'azure.com',
    'digitalocean.com',
    'dpg-', // Render.com database pattern
    'oregon-postgres.render.com' // Your specific production host
  ];
  
  for (const host of productionHosts) {
    if (dbUrl.includes(host)) {
      throw new Error(`CRITICAL SAFETY VIOLATION: Database URL contains production host: ${host}. Refusing to run tests against remote production database.`);
    }
  }
  
  // ALLOW: Localhost connections (safe for testing)
  const isLocalhost = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');
  
  if (isLocalhost) {
    console.log('✅ Localhost connection detected - safe for testing');
  } else {
    throw new Error('CRITICAL SAFETY VIOLATION: Only localhost connections are allowed for testing. Remote connections are blocked for safety.');
  }

  // 5. Extract and log database name for verification
  const dbNameMatch = DATABASE_URL.match(/\/\/(?:[^@]+@)?[^\/]+\/([^?]+)(?:\?|$)/);
  if (dbNameMatch) {
    const dbName = dbNameMatch[1];
    console.log('🔍 Database name:', dbName);
  }

  console.log('✅ Safety checks passed. Safe to proceed with testing.');
}

export async function truncateAll() {
  // Double-check safety before truncating
  assertSafeTestDb();
  
  // CRITICAL: Verify we're actually connected to test_db
  await verifyTestDatabaseConnection();
  
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
  
  // CRITICAL: Verify we're actually connected to test_db
  await verifyTestDatabaseConnection();
  
  const user = await prisma.users.create({
    data: {
      email,
      full_name
    }
  });
  return user;
}

// CRITICAL: Verify we're actually connected to localhost before allowing any destructive operations
export async function verifyTestDatabaseConnection() {
  console.log('🔍 Verifying database connection...');
  
  try {
    // Check what database we're actually connected to and verify it's localhost
    const result = await prisma.$queryRaw<Array<{db_name: string, user_name: string, inet_server_addr: string}>>`
      SELECT 
        current_database() as db_name, 
        current_user as user_name,
        inet_server_addr() as inet_server_addr
    `;
    const dbInfo = result[0];
    
    console.log('🔍 Connected to database:', dbInfo.db_name);
    console.log('🔍 Connected as user:', dbInfo.user_name);
    console.log('🔍 Server address:', dbInfo.inet_server_addr);
    
    // Verify this is a localhost connection
    if (dbInfo.inet_server_addr !== '127.0.0.1' && dbInfo.inet_server_addr !== 'localhost') {
      throw new Error(`CRITICAL SAFETY VIOLATION: Connected to remote server '${dbInfo.inet_server_addr}', not localhost. Refusing to proceed.`);
    }
    
    console.log('✅ Database connection verified: connected to localhost');
    return true;
  } catch (error) {
    console.error('❌ Database connection verification failed:', error);
    throw new Error(`Database connection verification failed: ${error.message}`);
  }
}
