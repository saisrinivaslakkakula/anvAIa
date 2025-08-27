# 🚨 TEST SAFETY DOCUMENTATION

## CRITICAL: Database Safety

**NEVER RUN TESTS AGAINST PRODUCTION DATABASES!**

The test suite includes safety mechanisms to prevent accidental data loss by enforcing a strict database naming convention.

## Safety Mechanisms Built-In

### 1. Environment Variable Checks
- `NODE_ENV` must be `"test"`
- `E2E_ALLOW_RESET` must be `"true"`
- `DATABASE_URL` must be provided

### 2. Database Name Enforcement
**CRITICAL SAFETY RULE**: The database name in your `DATABASE_URL` **MUST** be `"test_db"`

This prevents:
- ✅ Accidental truncation of production data
- ✅ Running destructive operations on wrong database
- ✅ Data loss due to misconfiguration

### 3. What This Means
- You can use **any database host** (Render.com, Heroku, AWS, localhost, etc.)
- But the **database name** must be `"test_db"`
- This creates a clear separation between production and test data

## Safe Test Database Setup

### Option 1: Render.com Test Database (Recommended)
```bash
# Use the same Render.com infrastructure but different database
export NODE_ENV=test
export E2E_ALLOW_RESET=true
export DATABASE_URL="postgresql://whisperbox_user:password@dpg-ctr3jttsvqrc73d24fug-a.oregon-postgres.render.com/test_db?sslmode=require"

# Run tests
npm run test:e2e:render
```

### Option 2: Local Test Database
```bash
# Create test database
createdb test_db

# Set environment variables
export NODE_ENV=test
export E2E_ALLOW_RESET=true
export DATABASE_URL="postgresql://localhost:5432/test_db"

# Run tests
npm run test:e2e
```

### Option 3: Custom Test Database
```bash
# Set environment variables
export NODE_ENV=test
export E2E_ALLOW_RESET=true
export DATABASE_URL="your_connection_string_here/test_db"

# Run tests
npm run test:e2e
```

## What Happens If Safety Checks Fail

If any safety check fails, the tests will **IMMEDIATELY STOP** with an error like:

```
CRITICAL SAFETY VIOLATION: Database name must be 'test_db', not 'whisperbox'. This prevents accidental truncation of production data.
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

**USE THIS FOR TESTS:**
```
DATABASE_URL=postgresql://whisperbox_user:...@dpg-ctr3jttsvqrc73d24fug-a.oregon-postgres.render.com/test_db
```

Notice the difference: `whisperbox` (production) vs `test_db` (test)

## Running Tests Safely

1. **Always** set `NODE_ENV=test`
2. **Always** set `E2E_ALLOW_RESET=true`
3. **Always** use database name `"test_db"`
4. **Never** use production database names (`whisperbox`, `production`, etc.)
5. **Verify** safety checks pass before running tests

## Emergency Stop

If you ever see tests trying to run against production:
1. **STOP** the test process immediately
2. **Check** your environment variables
3. **Verify** you're using the `test_db` database
4. **Review** the safety documentation

## Safety Test

The test suite includes a "SAFETY CHECK" section that runs first to verify all safety mechanisms are working correctly.

## Database Setup

Before running tests, ensure your `test_db` database exists and has the correct schema:

```bash
# If using Render.com, create test_db database there
# If using localhost, run: createdb test_db

# Then set up the schema
export DATABASE_URL="your_connection_string/test_db"
npx prisma generate
npx prisma db push
```
