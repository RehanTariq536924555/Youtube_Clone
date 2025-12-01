const fetch = require('node-fetch');

async function testWatchLater() {
  const API_BASE_URL = 'http://localhost:4000';
  
  console.log('Testing Watch Later API...\n');
  
  // Test 1: Check if backend is running
  try {
    const response = await fetch(`${API_BASE_URL}/videos`);
    console.log('✅ Backend is running');
    console.log(`   Status: ${response.status}\n`);
  } catch (error) {
    console.log('❌ Backend is NOT running');
    console.log('   Please start the backend with: npm run start:dev\n');
    return;
  }
  
  // Test 2: Check if watch-later endpoint exists (should return 401 without auth)
  try {
    const response = await fetch(`${API_BASE_URL}/watch-later`);
    console.log('✅ Watch Later endpoint exists');
    console.log(`   Status: ${response.status} (${response.status === 401 ? 'Unauthorized - Expected' : 'Unexpected'})\n`);
  } catch (error) {
    console.log('❌ Watch Later endpoint error:', error.message, '\n');
  }
  
  // Test 3: Try to get a token (you'll need to login first)
  console.log('📝 To test with authentication:');
  console.log('   1. Login via the frontend');
  console.log('   2. Open browser console (F12)');
  console.log('   3. Run: localStorage.getItem("auth_token")');
  console.log('   4. Copy the token and test manually\n');
}

testWatchLater();
