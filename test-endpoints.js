#!/usr/bin/env node

/**
 * Test script for Job Agents API endpoints
 * This helps debug if the issue is with specific endpoints or POST requests in general
 */

const https = require('https');
const http = require('http');

// Configuration - change this to your Render URL if testing production
const BASE_URL = 'http://localhost:4000/api';
// const BASE_URL = 'https://your-app-name.onrender.com/api'; // Uncomment for Render testing

// Colors for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

// Function to make HTTP request
async function testEndpoint(method, endpoint, data = null, description) {
    console.log(`\n${colors.blue}Testing: ${method} ${endpoint}${colors.reset}`);
    console.log(`${colors.yellow}Description: ${description}${colors.reset}`);
    
    return new Promise((resolve) => {
        const url = new URL(`${BASE_URL}${endpoint}`);
        const isHttps = url.protocol === 'https:';
        const client = isHttps ? https : http;
        
        const options = {
            hostname: url.hostname,
            port: url.port || (isHttps ? 443 : 80),
            path: url.pathname,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'JobAgents-Test-Script/1.0'
            }
        };
        
        if (data && method !== 'GET') {
            const postData = JSON.stringify(data);
            options.headers['Content-Length'] = Buffer.byteLength(postData);
        }
        
        const req = client.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                const status = res.statusCode;
                let parsedResponse;
                
                try {
                    parsedResponse = JSON.parse(responseData);
                } catch (e) {
                    parsedResponse = responseData;
                }
                
                if (status === 200 || status === 201) {
                    console.log(`${colors.green}✅ SUCCESS (${status})${colors.reset}`);
                    console.log('Response:', JSON.stringify(parsedResponse, null, 2));
                } else {
                    console.log(`${colors.red}❌ FAILED (${status})${colors.reset}`);
                    console.log('Response:', JSON.stringify(parsedResponse, null, 2));
                }
                
                console.log('----------------------------------------');
                resolve({ status, response: parsedResponse });
            });
        });
        
        req.on('error', (error) => {
            console.log(`${colors.red}❌ ERROR: ${error.message}${colors.reset}`);
            console.log('----------------------------------------');
            resolve({ status: 'ERROR', response: error.message });
        });
        
        if (data && method !== 'GET') {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

// Main test function
async function runTests() {
    console.log('🧪 Testing Job Agents API Endpoints...');
    console.log('=====================================');
    console.log(`Base URL: ${BASE_URL}`);
    
    try {
        // Test 1: GET test endpoint (should work)
        await testEndpoint('GET', '/jobs/test', null, 'Testing if GET requests work');
        
        // Test 2: POST test endpoint (dummy endpoint)
        await testEndpoint('POST', '/jobs/test', { test: 'data' }, 'Testing dummy POST endpoint');
        
        // Test 3: POST dummy endpoint (another dummy endpoint)
        await testEndpoint('POST', '/jobs/dummy', { hello: 'world' }, 'Testing another dummy POST endpoint');
        
        // Test 4: POST jobs endpoint (actual job creation)
        await testEndpoint('POST', '/jobs', { title: 'Test Job', company: 'Test Company' }, 'Testing actual job creation endpoint');
        
        // Test 5: POST with minimal data
        await testEndpoint('POST', '/jobs', { title: 'Minimal', company: 'Minimal Corp' }, 'Testing with minimal required data');
        
        // Test 6: POST with empty body
        await testEndpoint('POST', '/jobs/test', {}, 'Testing POST with empty body');
        
        // Test 7: POST without Content-Type header (simulate some clients)
        await testEndpoint('POST', '/jobs/test', { noHeader: 'test' }, 'Testing POST without proper headers');
        
    } catch (error) {
        console.error(`${colors.red}Test execution error: ${error.message}${colors.reset}`);
    }
    
    console.log(`\n${colors.blue}Test Summary:${colors.reset}`);
    console.log('If GET /jobs/test works but POST /jobs/test fails, it\'s a POST restriction issue.');
    console.log('If all endpoints fail, it\'s a general connectivity issue.');
    console.log('If only the actual job creation fails, it\'s a business logic issue.');
    
    console.log(`\n${colors.yellow}To test on Render, change BASE_URL to your Render URL:${colors.reset}`);
    console.log('const BASE_URL = \'https://your-app-name.onrender.com/api\';');
    
    console.log(`\n${colors.green}Testing completed!${colors.reset}`);
}

// Run tests if this script is executed directly
if (require.main === module) {
    runTests();
}

module.exports = { testEndpoint, runTests };
