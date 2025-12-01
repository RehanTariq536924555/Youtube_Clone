const { Client } = require('pg');
require('dotenv').config();

async function checkShortsSetup() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    
    // Check if isShort column exists
    console.log('🔍 Checking if isShort column exists...');
    const columnCheck = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'videos' AND column_name = 'isShort'
    `);
    
    if (columnCheck.rows.length === 0) {
      console.log('❌ isShort column does not exist! Adding it...');
      await client.query('ALTER TABLE "videos" ADD COLUMN "isShort" boolean DEFAULT false');
      console.log('✅ Added isShort column');
    } else {
      console.log('✅ isShort column exists:', columnCheck.rows[0]);
    }
    
    // Check all videos and their isShort status
    console.log('📊 Checking videos in database...');
    const videosCheck = await client.query(`
      SELECT id, title, "isShort", duration, visibility, "createdAt"
      FROM videos 
      ORDER BY "createdAt" DESC 
      LIMIT 10
    `);
    
    console.log(`📹 Found ${videosCheck.rows.length} videos:`);
    videosCheck.rows.forEach((video, index) => {
      console.log(`${index + 1}. ${video.title}`);
      console.log(`   - isShort: ${video.isShort}`);
      console.log(`   - duration: ${video.duration}s`);
      console.log(`   - visibility: ${video.visibility}`);
      console.log(`   - created: ${video.createdAt}`);
      console.log('');
    });
    
    // Count shorts
    const shortsCount = await client.query(`
      SELECT COUNT(*) as count FROM videos WHERE "isShort" = true
    `);
    
    const publicShortsCount = await client.query(`
      SELECT COUNT(*) as count FROM videos WHERE "isShort" = true AND visibility = 'public'
    `);
    
    console.log(`🎬 Total shorts: ${shortsCount.rows[0].count}`);
    console.log(`🌍 Public shorts: ${publicShortsCount.rows[0].count}`);
    
    // Auto-mark short videos (60 seconds or less)
    console.log('🔄 Auto-marking short videos...');
    const updateResult = await client.query(`
      UPDATE videos 
      SET "isShort" = true 
      WHERE duration <= 60 AND duration IS NOT NULL AND "isShort" = false
    `);
    
    console.log(`✅ Updated ${updateResult.rowCount} videos to shorts based on duration`);
    
    // Final count
    const finalShortsCount = await client.query(`
      SELECT COUNT(*) as count FROM videos WHERE "isShort" = true AND visibility = 'public'
    `);
    
    console.log(`🎯 Final public shorts count: ${finalShortsCount.rows[0].count}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkShortsSetup();