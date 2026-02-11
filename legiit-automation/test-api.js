#!/usr/bin/env node

/**
 * Test script for Legiit Automation API
 * Usage: node test-api.js
 */

import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api/purchase-citation';
const API_KEY = process.env.API_KEY || 'test-key';

const testData = {
  domain: 'testbusiness.com',
  businessName: 'Test Business LLC',
  address: '123 Test Street, New York, NY 10001'
};

console.log('🧪 Testing Legiit Automation API');
console.log('================================\n');
console.log('📡 Endpoint:', API_URL);
console.log('🔑 API Key:', API_KEY);
console.log('\n📋 Test Data:');
console.log(JSON.stringify(testData, null, 2));
console.log('\n⏳ Sending request...\n');

try {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(testData)
  });

  const result = await response.json();

  console.log('📬 Response Status:', response.status);
  console.log('📦 Response Body:');
  console.log(JSON.stringify(result, null, 2));

  if (result.success) {
    console.log('\n✅ Test PASSED!');
    console.log('Order ID:', result.orderId);
  } else {
    console.log('\n❌ Test FAILED!');
    console.log('Error:', result.error);
  }
} catch (error) {
  console.error('\n❌ Test ERROR:');
  console.error(error.message);
}
