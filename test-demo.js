// Simple test script to verify the demo is working
const http = require('http');

console.log('🚀 Testing Astra AI Demo...\n');

// Test backend API
const testBackend = () => {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 8000,
      path: '/',
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('✅ Backend API: WORKING');
        console.log('   Response:', JSON.parse(data).message);
        resolve(true);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Backend API: NOT RUNNING');
      console.log('   Please run: npm run dev');
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Backend API: TIMEOUT');
      reject(new Error('Timeout'));
    });
    
    req.end();
  });
};

// Test frontend
const testFrontend = () => {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET'
    }, (res) => {
      console.log('✅ Frontend: WORKING');
      console.log('   Status:', res.statusCode);
      resolve(true);
    });
    
    req.on('error', (err) => {
      console.log('❌ Frontend: NOT RUNNING');
      console.log('   Please run: npm run dev');
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Frontend: TIMEOUT');
      reject(new Error('Timeout'));
    });
    
    req.end();
  });
};

// Run tests
async function runTests() {
  try {
    await testBackend();
    await testFrontend();
    
    console.log('\n🎉 DEMO STATUS: READY FOR JUDGING!');
    console.log('📱 Frontend: http://localhost:3000');
    console.log('🔧 Backend:  http://localhost:8000');
    console.log('\n🏆 Astra AI - Sonic Hackathon 2024');
    console.log('   All systems operational! 🚀');
    
  } catch (error) {
    console.log('\n⚠️  DEMO STATUS: NEEDS ATTENTION');
    console.log('   Run: npm run dev');
    console.log('   Then test again with: node test-demo.js');
  }
}

runTests();