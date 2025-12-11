const axios = require('axios');

const API_URL = 'http://localhost:3000';

async function testChannelsAPI() {
  console.log('🧪 Testing Channels API...\n');

  try {
    // First, login to get a token
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com', // Change this to your test user email
      password: 'password123'     // Change this to your test user password
    });

    const token = loginResponse.data.access_token;
    console.log('✅ Login successful\n');

    // Test: Get my channels (should be empty initially)
    console.log('2. Getting my channels...');
    const myChannelsResponse = await axios.get(`${API_URL}/channels/my-channels`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ My channels:', myChannelsResponse.data);
    console.log('   Count:', myChannelsResponse.data.length, '\n');

    // Test: Create a channel
    console.log('3. Creating a test channel...');
    const createResponse = await axios.post(
      `${API_URL}/channels`,
      {
        name: 'Test Channel',
        handle: 'testchannel' + Date.now(), // Unique handle
        description: 'This is a test channel'
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✅ Channel created:', createResponse.data);
    const channelId = createResponse.data.id;
    console.log('   Channel ID:', channelId, '\n');

    // Test: Get channel count
    console.log('4. Getting channel count...');
    const countResponse = await axios.get(`${API_URL}/channels/my-channels/count`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Channel count:', countResponse.data, '\n');

    // Test: Get channel by ID
    console.log('5. Getting channel by ID...');
    const channelResponse = await axios.get(`${API_URL}/channels/${channelId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Channel details:', channelResponse.data, '\n');

    console.log('🎉 All tests passed!\n');
    console.log('✅ Channels API is working correctly');
    console.log('✅ You can now use the frontend to create channels');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.log('\n📝 Troubleshooting:');
    console.log('1. Make sure backend is running on port 3000');
    console.log('2. Update the email/password in this script');
    console.log('3. Make sure you have a user account');
    console.log('4. Check that channels table exists in database');
  }
}

testChannelsAPI();
