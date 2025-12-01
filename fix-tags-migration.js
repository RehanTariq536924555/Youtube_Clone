const { DataSource } = require('typeorm');
require('dotenv').config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'nebulastream',
  synchronize: false,
  logging: true,
});

async function fixTagsData() {
  try {
    await AppDataSource.initialize();
    console.log('Connected to database');

    // First, alter the column to allow NULL values
    console.log('Altering tags column to allow NULL...');
    await AppDataSource.query(`
      ALTER TABLE videos ALTER COLUMN tags DROP NOT NULL
    `);

    console.log('Column altered successfully');

    // Update all videos with empty string tags to NULL
    const result = await AppDataSource.query(`
      UPDATE videos 
      SET tags = NULL 
      WHERE tags = '' OR tags = '{}' OR tags::text = '' OR tags::text = '{}'
    `);

    console.log(`Updated ${result[1]} records with empty/malformed tags`);

    // Also handle any records where tags might be causing issues
    const cleanupResult = await AppDataSource.query(`
      UPDATE videos 
      SET tags = NULL 
      WHERE tags IS NOT NULL AND (
        tags::text = '' OR 
        tags::text = '{}' OR 
        tags::text = 'null' OR
        LENGTH(TRIM(tags::text)) <= 2
      )
    `);

    console.log(`Cleaned up ${cleanupResult[1]} additional records`);

    console.log('Tags data cleanup completed successfully');
  } catch (error) {
    console.error('Error fixing tags data:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

fixTagsData();