const axios = require('axios');

const API_URL = 'http://localhost:4000';

async function testAdminChannels() {
  try {
    console.log('🔍 Testing Admin Channels API...\n');

    // First, login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post(`${API_URL}/auth/admin/login`, {
      email: 'admin@nebulastream.com',
      password: 'admin123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Admin login successful\n');

    // Test getting all channels
    console.log('2. Getting all channels...');
    const channelsResponse = await axios.get(`${API_URL}/admin/channels`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Channels retrieved:');
    console.log(`   Total: ${channelsResponse.data.total}`);
    console.log(`   Page: ${channelsResponse.data.page}`);
    console.log(`   Total Pages: ${channelsResponse.data.totalPages}`);
    console.log(`   Channels on this page: ${channelsResponse.data.channels.length}\n`);

    if (channelsResponse.data.channels.length > 0) {
      console.log('📺 Sample Channel:');
      const channel = channelsResponse.data.channels[0];
      console.log(`   ID: ${channel.id}`);
      console.log(`   Name: ${channel.name}`);
      console.log(`   Handle: @${channel.handle}`);
      console.log(`   Owner: ${channel.user?.name || 'Unknown'}`);
      console.log(`   Subscribers: ${channel.subscribersCount}`);
      console.log(`   Videos: ${channel.videosCount}`);
      console.log(`   Views: ${channel.totalViews}`);
      console.log(`   Suspended: ${channel.isSuspended}`);
      console.log(`   Active: ${channel.isActive}\n`);
    }

    // Test getting channel stats
    console.log('3. Getting channel stats...');
    const statsResponse = await axios.get(`${API_URL}/admin/channels/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Channel Stats:');
    console.log(`   Total Channels: ${statsResponse.data.totalChannels}`);
    console.log(`   Active Channels: ${statsResponse.data.activeChannels}`);
    console.log(`   Suspended Channels: ${statsResponse.data.suspendedChannels}\n`);

    console.log('✅ All tests passed!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.log('\n💡 Tip: Make sure you have an admin account created.');
      console.log('   Run: node Backend/set-admin-password-simple.js');
    }
  }
}

testAdminChannels();
