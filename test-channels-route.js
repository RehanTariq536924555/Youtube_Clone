const http = require('http');

console.log('🧪 Testing Channels Routes...\n');

function testRoute(path, method = 'GET') {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      resolve({ status: 0, error: error.message });
    });

    req.end();
  });
}

async function runTests() {
  console.log('Testing backend routes...\n');

  // Test 1: Backend is running
  console.log('1. Testing if backend is running...');
  const healthCheck = await testRoute('/');
  if (healthCheck.status === 0) {
    console.log('   ❌ Backend is NOT running!');
    console.log('   → Start backend: cd Backend && npm run start:dev\n');
    return;
  }
  console.log('   ✅ Backend is running\n');

  // Test 2: Channels POST route
  console.log('2. Testing POST /channels route...');
  const postTest = await testRoute('/channels', 'POST');
  if (postTest.status === 404) {
    console.log('   ❌ Route NOT found! (404)');
    console.log('   → Backend needs to be restarted!');
    console.log('   → Press Ctrl+C in backend terminal');
    console.log('   → Run: npm run start:dev\n');
  } else if (postTest.status === 401) {
    console.log('   ✅ Route exists! (401 Unauthorized is expected)\n');
  } else {
    console.log(`   ⚠️  Unexpected status: ${postTest.status}\n`);
  }

  // Test 3: Channels GET route
  console.log('3. Testing GET /channels/my-channels route...');
  const getTest = await testRoute('/channels/my-channels', 'GET');
  if (getTest.status === 404) {
    console.log('   ❌ Route NOT found! (404)');
    console.log('   → Backend needs to be restarted!\n');
  } else if (getTest.status === 401) {
    console.log('   ✅ Route exists! (401 Unauthorized is expected)\n');
  } else {
    console.log(`   ⚠️  Unexpected status: ${getTest.status}\n`);
  }

  // Summary
  console.log('========================================');
  if (postTest.status === 401 && getTest.status === 401) {
    console.log('✅ ALL TESTS PASSED!');
    console.log('✅ Channels routes are working!');
    console.log('✅ You can now create channels from the frontend!');
  } else if (postTest.status === 404 || getTest.status === 404) {
    console.log('❌ ROUTES NOT FOUND!');
    console.log('');
    console.log('ACTION REQUIRED:');
    console.log('1. Stop backend server (Ctrl+C)');
    console.log('2. Restart: npm run start:dev');
    console.log('3. Run this test again');
  } else {
    console.log('⚠️  UNEXPECTED RESULTS');
    console.log('Check backend console for errors');
  }
  console.log('========================================');
}

runTests();
