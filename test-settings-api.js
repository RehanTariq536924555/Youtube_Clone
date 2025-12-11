async function testSettingsAPI() {
  console.log('🧪 Testing Settings API\n');

  try {
    // Test 1: GET settings (public)
    console.log('Test 1: GET /settings (public)');
    const getResponse = await fetch('http://localhost:4000/settings');
    const getData = await getResponse.json();
    console.log('Status:', getResponse.status);
    console.log('Response:', JSON.stringify(getData, null, 2));
    console.log('✅ GET endpoint works\n');

    // Test 2: PUT settings (admin only)
    console.log('Test 2: PUT /settings (admin only)');
    
    // Get admin token
    const loginResponse = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@nebulastream.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed');
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.access_token;
    console.log('✅ Got admin token:', token.substring(0, 20) + '...\n');

    // Try to update settings
    console.log('Test 3: Updating settings...');
    const updateResponse = await fetch('http://localhost:4000/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        site_name: 'TestSite',
        site_tagline: 'Test Tagline',
        site_description: 'Test Description'
      })
    });

    console.log('Status:', updateResponse.status);
    const updateData = await updateResponse.json();
    console.log('Response:', JSON.stringify(updateData, null, 2));

    if (updateResponse.ok) {
      console.log('✅ PUT endpoint works\n');
      
      // Verify the update
      console.log('Test 4: Verifying update...');
      const verifyResponse = await fetch('http://localhost:4000/settings');
      const verifyData = await verifyResponse.json();
      console.log('Updated settings:', JSON.stringify(verifyData, null, 2));
      
      if (verifyData.site_name === 'TestSite') {
        console.log('✅ Settings updated successfully!\n');
      } else {
        console.log('❌ Settings not updated in database\n');
      }

      // Restore original settings
      console.log('Test 5: Restoring original settings...');
      await fetch('http://localhost:4000/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          site_name: 'NebulaStream',
          site_tagline: 'Your Video Streaming Platform',
          site_description: 'Watch, upload, and share videos with the world'
        })
      });
      console.log('✅ Restored original settings\n');
    } else {
      console.log('❌ PUT endpoint failed\n');
      console.log('Error:', updateData);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSettingsAPI();
