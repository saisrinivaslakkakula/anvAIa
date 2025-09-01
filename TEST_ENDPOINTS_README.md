# Test Endpoints for Debugging Render Restrictions

## 🎯 Purpose

These test endpoints help you debug if the issue is with:

-   **POST requests in general** (Render restriction)
-   **Specific endpoint logic** (your code)
-   **General connectivity** (network/firewall issues)

## 🧪 Available Test Endpoints

### 1. Health Check Endpoints

-   **`GET /api/health`** - Basic health check (should always work)
-   **`POST /api/health`** - POST health check with detailed logging

### 2. Jobs Test Endpoints

-   **`GET /api/jobs/test`** - GET test endpoint
-   **`POST /api/jobs/test`** - POST test endpoint with detailed logging
-   **`POST /api/jobs/dummy`** - Simple POST test endpoint
-   **`POST /api/jobs`** - Actual job creation endpoint

## 🚀 How to Test

### Option 1: Use the Test Scripts

#### Bash Script (Linux/macOS)

```bash
# Make executable
chmod +x test-endpoints.sh

# Run tests
./test-endpoints.sh
```

#### Node.js Script (Cross-platform)

```bash
# Run tests
node test-endpoints.js
```

### Option 2: Manual Testing with cURL

#### Test Health Endpoints

```bash
# GET health (should work)
curl http://localhost:4000/api/health

# POST health (test if POST works)
curl -X POST http://localhost:4000/api/health \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

#### Test Jobs Endpoints

```bash
# GET test (should work)
curl http://localhost:4000/api/jobs/test

# POST test (dummy endpoint)
curl -X POST http://localhost:4000/api/jobs/test \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# POST dummy (another dummy endpoint)
curl -X POST http://localhost:4000/api/jobs/dummy \
  -H "Content-Type: application/json" \
  -d '{"hello": "world"}'

# POST actual job creation
curl -X POST http://localhost:4000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Job", "company": "Test Company"}'
```

### Option 3: Test on Render

Change the base URL in the test scripts or use your Render URL directly:

```bash
# Test on Render
curl -X POST https://your-app-name.onrender.com/api/health \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## 🔍 What to Look For

### Scenario 1: All Endpoints Work

-   ✅ GET /api/health works
-   ✅ POST /api/health works
-   ✅ GET /api/jobs/test works
-   ✅ POST /api/jobs/test works
-   ✅ POST /api/jobs works

**Conclusion**: No restrictions, issue is elsewhere.

### Scenario 2: GET Works, POST Fails

-   ✅ GET /api/health works
-   ❌ POST /api/health fails
-   ✅ GET /api/jobs/test works
-   ❌ POST /api/jobs/test fails
-   ❌ POST /api/jobs fails

**Conclusion**: Render is restricting POST requests.

### Scenario 3: Only Job Creation Fails

-   ✅ GET /api/health works
-   ✅ POST /api/health works
-   ✅ GET /api/jobs/test works
-   ✅ POST /api/jobs/test works
-   ❌ POST /api/jobs fails

**Conclusion**: Issue is in your job creation logic, not Render restrictions.

### Scenario 4: All Endpoints Fail

-   ❌ GET /api/health fails
-   ❌ POST /api/health fails
-   ❌ GET /api/jobs/test fails
-   ❌ POST /api/jobs/test fails
-   ❌ POST /api/jobs fails

**Conclusion**: General connectivity issue (network, firewall, app not running).

## 🛠️ Debugging Steps

### 1. Check Server Logs

Look at your server console for the detailed logging from test endpoints:

```
Health POST endpoint hit!
Request body: { test: 'data' }
Request headers: { 'content-type': 'application/json', ... }
Request method: POST
Request URL: /api/health
```

### 2. Check HTTP Status Codes

-   **200/201**: Success
-   **400**: Bad Request (validation error)
-   **404**: Not Found (route not found)
-   **500**: Internal Server Error
-   **Connection refused**: Server not running
-   **Timeout**: Network/firewall issue

### 3. Test Different Data Types

```bash
# Empty body
curl -X POST http://localhost:4000/api/health

# Different content types
curl -X POST http://localhost:4000/api/health \
  -H "Content-Type: text/plain" \
  -d "plain text"

# No content type
curl -X POST http://localhost:4000/api/health \
  -d '{"test": "data"}'
```

## 🚨 Common Render Issues

### 1. POST Request Size Limits

-   Render may have limits on POST body size
-   Try with minimal data first

### 2. Content-Type Restrictions

-   Some platforms require specific content types
-   Try different headers

### 3. Rate Limiting

-   Render may rate-limit POST requests
-   Wait a few minutes between tests

### 4. CORS Issues

-   Check if CORS is properly configured
-   Test from different origins

## 📝 Test Results Template

Use this template to document your findings:

```markdown
## Test Results

**Date**: [Date]
**Environment**: [Local/Render]
**Base URL**: [URL]

### Endpoint Status

-   [ ] GET /api/health
-   [ ] POST /api/health
-   [ ] GET /api/jobs/test
-   [ ] POST /api/jobs/test
-   [ ] POST /api/jobs/dummy
-   [ ] POST /api/jobs

### Observations

[What you observed]

### Conclusion

[What the issue is]

### Next Steps

[What to do next]
```

## 🎯 Quick Test Commands

```bash
# Quick test - just check if POST works at all
curl -X POST http://localhost:4000/api/health -d '{}'

# Quick test - check job creation
curl -X POST http://localhost:4000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "company": "Test"}'
```

## 🔧 If You Find Render Restrictions

1. **Check Render documentation** for POST request limitations
2. **Contact Render support** about POST restrictions
3. **Consider alternatives** like using GET with query parameters
4. **Implement workarounds** like using different HTTP methods

## 📞 Need Help?

If you're still having issues after testing:

1. Run the test scripts and share the output
2. Check server logs for error messages
3. Verify your Render configuration
4. Test with different HTTP clients (Postman, browser, etc.)
