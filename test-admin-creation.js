// Test script to create admin user
const https = require('https');

const data = JSON.stringify({
  name: 'Admin User',
  email: 'admin@nebulastream.com',
  password: 'admin123'
});

const options = {
  hostname: 'youtube-clone-1-ntn4.onrender.com',
  port: 443,
  path: '/bootstrap/create-first-admin',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('Creating admin user...');
console.log('URL:', `https://${options.hostname}${options.path}`);
console.log('Data:', data);

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);

  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Response:', responseData);
    try {
      const parsed = JSON.parse(responseData);
      console.log('Parsed Response:', JSON.stringify(parsed, null, 2));
      
      if (res.statusCode === 201 || res.statusCode === 200) {
        console.log('\n✅ SUCCESS! Admin user created successfully!');
        console.log('You can now login with:');
        console.log('Email: admin@nebulastream.com');
        console.log('Password: admin123');
      } else {
        console.log('\n❌ Error creating admin user');
      }
    } catch (e) {
      console.log('Raw response:', responseData);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e);
});

req.write(data);
req.end();