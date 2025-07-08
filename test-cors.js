#!/usr/bin/env node

// CORS Test Script
// This script tests the CORS configuration of your API

const testCORS = async () => {
    const serverUrl = 'https://ab-irepair.onrender.com';
    
    console.log('🧪 Testing CORS configuration...\n');
    
    // Test 1: Health check endpoint
    console.log('1. Testing health endpoint...');
    try {
        const response = await fetch(`${serverUrl}/api/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000' // Simulate frontend origin
            }
        });
        
        console.log(`   Status: ${response.status}`);
        console.log(`   CORS Headers:`);
        console.log(`   - Access-Control-Allow-Origin: ${response.headers.get('Access-Control-Allow-Origin')}`);
        console.log(`   - Access-Control-Allow-Methods: ${response.headers.get('Access-Control-Allow-Methods')}`);
        console.log(`   - Access-Control-Allow-Headers: ${response.headers.get('Access-Control-Allow-Headers')}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log(`   Response:`, data);
            console.log('   ✅ Health check passed\n');
        } else {
            console.log('   ❌ Health check failed\n');
        }
    } catch (error) {
        console.log(`   ❌ Health check error: ${error.message}\n`);
    }
    
    // Test 2: OPTIONS preflight request
    console.log('2. Testing OPTIONS preflight request...');
    try {
        const response = await fetch(`${serverUrl}/api/products`, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Request-Headers': 'Content-Type'
            }
        });
        
        console.log(`   Status: ${response.status}`);
        console.log(`   CORS Headers:`);
        console.log(`   - Access-Control-Allow-Origin: ${response.headers.get('Access-Control-Allow-Origin')}`);
        console.log(`   - Access-Control-Allow-Methods: ${response.headers.get('Access-Control-Allow-Methods')}`);
        console.log(`   - Access-Control-Allow-Headers: ${response.headers.get('Access-Control-Allow-Headers')}`);
        
        if (response.status === 200) {
            console.log('   ✅ OPTIONS request passed\n');
        } else {
            console.log('   ❌ OPTIONS request failed\n');
        }
    } catch (error) {
        console.log(`   ❌ OPTIONS request error: ${error.message}\n`);
    }
    
    // Test 3: Actual GET request to products
    console.log('3. Testing GET /api/products...');
    try {
        const response = await fetch(`${serverUrl}/api/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000'
            }
        });
        
        console.log(`   Status: ${response.status}`);
        console.log(`   CORS Headers:`);
        console.log(`   - Access-Control-Allow-Origin: ${response.headers.get('Access-Control-Allow-Origin')}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log(`   Response: ${Array.isArray(data) ? `Array with ${data.length} items` : 'Object'}`);
            console.log('   ✅ GET products passed\n');
        } else {
            console.log('   ❌ GET products failed\n');
        }
    } catch (error) {
        console.log(`   ❌ GET products error: ${error.message}\n`);
    }
    
    console.log('🏁 CORS testing complete!');
};

// Run the test
testCORS().catch(console.error);
