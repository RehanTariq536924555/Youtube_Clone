const API_BASE_URL = 'http://localhost:4000';

// Test data - using real video ID from the API response
const testVideoId = '6c0e6886-11d1-4b0c-a118-0d3c005acf32'; // Real video ID
const testUserId = 'e7543521-15bd-40b2-ba05-37d7291c4976'; // Real user ID

async function testAPI() {
  console.log('Testing Likes and Comments API...\n');

  try {
    // Test 1: Get like stats for a video (should work without auth)
    console.log('1. Testing like stats endpoint...');
    try {
      const response = await fetch(`${API_BASE_URL}/likes/stats/${testVideoId}?targetType=video`);
      const data = await response.json();
      console.log('✅ Like stats response:', data);
    } catch (error) {
      console.log('❌ Like stats error:', error.message);
    }

    // Test 2: Get comments for a video (should work without auth)
    console.log('\n2. Testing comments endpoint...');
    try {
      const response = await fetch(`${API_BASE_URL}/comments/video/${testVideoId}`);
      const data = await response.json();
      console.log('✅ Comments response:', data);
    } catch (error) {
      console.log('❌ Comments error:', error.message);
    }

    // Test 3: Test toggle like (requires auth - should fail)
    console.log('\n3. Testing toggle like endpoint (without auth - should fail)...');
    try {
      const response = await fetch(`${API_BASE_URL}/likes/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetId: testVideoId,
          targetType: 'video',
          type: 'like'
        })
      });
      const data = await response.json();
      console.log('✅ Toggle like response:', data);
    } catch (error) {
      console.log('❌ Toggle like error (expected):', error.message);
    }

    // Test 4: Test create comment (requires auth - should fail)
    console.log('\n4. Testing create comment endpoint (without auth - should fail)...');
    try {
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Test comment',
          videoId: testVideoId
        })
      });
      const data = await response.json();
      console.log('✅ Create comment response:', data);
    } catch (error) {
      console.log('❌ Create comment error (expected):', error.message);
    }

    // Test 5: Check if videos endpoint exists
    console.log('\n5. Testing videos endpoint...');
    try {
      const response = await fetch(`${API_BASE_URL}/videos`);
      const data = await response.json();
      console.log('✅ Videos response (first 2):', data.slice(0, 2));
    } catch (error) {
      console.log('❌ Videos error:', error.message);
    }

  } catch (error) {
    console.error('General error:', error.message);
  }
}

testAPI();