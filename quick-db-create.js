const { Client } = require('pg');

async function createDB() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Rehan',
    database: 'postgres'
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');
    
    await client.query('CREATE DATABASE "YoutubeClone"');
    console.log('Database YoutubeClone created successfully!');
  } catch (error) {
    if (error.code === '42P04') {
      console.log('Database YoutubeClone already exists');
    } else {
      console.error('Error:', error.message);
    }
  } finally {
    await client.end();
  }
}

createDB();