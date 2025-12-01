const axios = require('axios');

async function testGoogleAuth() {
  try {
    console.log('🧪 Testing Google OAuth endpoints...');
    
    // Test if backend is running
    const healthCheck = await axios.get('http://localhost:4000/auth/google', {
      maxRedirects: 0,
      validateStatus: (status) => status === 302 || status === 200
    });
    
    if (healthCheck.status === 302) {
      console.log('✅ Google OAuth endpoint is working - redirects to Google');
      console.log('🔗 Redirect URL:', healthCheck.headers.location);
    } else {
      console.log('✅ Backend is responding');
    }
    
  } catch (error) {
    if (error.response && error.response.status === 302) {
      console.log('✅ Google OAuth endpoint is working - redirects to Google');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend is not running. Start it with: npm run start:dev');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

testGoogleAuth();