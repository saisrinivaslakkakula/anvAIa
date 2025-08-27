# 🚨 TEST SAFETY DOCUMENTATION

## CRITICAL: Database Safety

**NEVER RUN TESTS AGAINST PRODUCTION DATABASES!**

The test suite includes multiple safety mechanisms to prevent accidental data loss, but you must also follow these guidelines manually.

## Safety Mechanisms Built-In

### 1. Environment Variable Checks
- `NODE_ENV` must be `"test"`
- `E2E_ALLOW_RESET` must be `"true"`
- `DATABASE_URL` must be provided

### 2. Production Database Blockers
The test utilities will **REFUSE TO RUN** if the database URL contains:
- `render.com` (your current production database)
- `heroku.com`
- `aws.amazon.com`
- `googleapis.com`
- `azure.com`
- `digitalocean.com`
- `localhost:5432` (common production port)
- `127.0.0.1:5432`

### 3. Test Database Requirements
The database URL **MUST** contain:
- The word `"test"` somewhere in the URL
- Database name must contain `"test"`
- Should use a different port (e.g., `5433` instead of `5432`)

## Safe Test Database Setup

### Option 1: Local Test Database
```bash
# Create test database
createdb job_agents_test

# Set environment variables
export NODE_ENV=test
export E2E_ALLOW_RESET=true
export DATABASE_URL="postgresql://localhost:5432/job_agents_test"

# Run tests
npm test
```

### Option 2: Different Port for Test Database
```bash
# Start PostgreSQL on different port for tests
pg_ctl -D /usr/local/var/postgres -o "-p 5433" start

# Create test database on test port
createdb -h localhost -p 5433 job_agents_test

# Set environment variables
export NODE_ENV=test
export E2E_ALLOW_RESET=true
export DATABASE_URL="postgresql://localhost:5433/job_agents_test"

# Run tests
npm test
```

## What Happens If Safety Checks Fail

If any safety check fails, the tests will **IMMEDIATELY STOP** with an error like:

```
CRITICAL SAFETY VIOLATION: Database URL contains production indicator: render.com
```

This prevents:
- ✅ Accidental truncation of production data
- ✅ Running destructive operations on wrong database
- ✅ Data loss due to misconfiguration

## Current Production Database

**DO NOT USE THIS FOR TESTS:**
```
DATABASE_URL=postgresql://whisperbox_user:...@dpg-ctr3jttsvqrc73d24fug-a.oregon-postgres.render.com/whisperbox
```

This database contains your production data and will be **BLOCKED** by the safety checks.

## Running Tests Safely

1. **Always** set `NODE_ENV=test`
2. **Always** set `E2E_ALLOW_RESET=true`
3. **Always** use a database URL containing `"test"`
4. **Never** use production database URLs
5. **Verify** safety checks pass before running tests

## Emergency Stop

If you ever see tests trying to run against production:
1. **STOP** the test process immediately
2. **Check** your environment variables
3. **Verify** you're using the test database
4. **Review** the safety documentation

## Safety Test

The test suite includes a "SAFETY CHECK" section that runs first to verify all safety mechanisms are working correctly.
