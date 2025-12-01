import fetch from 'node-fetch';

async function testAPI() {
  try {
    console.log('Testing API endpoints...');

    // Test videos endpoint
    const videosResponse = await fetch('http://localhost:4000/videos');
    if (videosResponse.ok) {
      const videos = await videosResponse.json();
      console.log(`✅ Videos endpoint working - Found ${videos.length} videos`);
    } else {
      console.log('❌ Videos endpoint failed:', videosResponse.status);
    }

    // Test search endpoint
    const searchResponse = await fetch('http://localhost:4000/videos/search?q=test');
    if (searchResponse.ok) {
      const searchResults = await searchResponse.json();
      console.log(`✅ Search endpoint working - Found ${searchResults.length} results`);
    } else {
      console.log('❌ Search endpoint failed:', searchResponse.status);
    }

    // Test trending endpoint
    const trendingResponse = await fetch('http://localhost:4000/videos/trending');
    if (trendingResponse.ok) {
      const trending = await trendingResponse.json();
      console.log(`✅ Trending endpoint working - Found ${trending.length} trending videos`);

      // Test comments for the first video if available
      if (trending.length > 0) {
        const firstVideoId = trending[0].id;
        const commentsResponse = await fetch(`http://localhost:4000/comments/video/${firstVideoId}`);
        if (commentsResponse.ok) {
          const comments = await commentsResponse.json();
          console.log(`✅ Comments endpoint working - Found ${comments.length} comments for video ${firstVideoId}`);
          if (comments.length > 0) {
            console.log('Sample comment data:', JSON.stringify(comments[0], null, 2));
          }
        } else {
          console.log('❌ Comments endpoint failed:', commentsResponse.status);
        }
      }
    } else {
      console.log('❌ Trending endpoint failed:', trendingResponse.status);
    }

    console.log('API test completed!');
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testAPI();