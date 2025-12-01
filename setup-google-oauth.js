const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Google OAuth Setup Helper\n');
console.log('First, you need to create Google OAuth credentials:');
console.log('1. Go to: https://console.cloud.google.com/');
console.log('2. Create a new project or select existing one');
console.log('3. Go to "APIs & Services" > "Credentials"');
console.log('4. Click "Create Credentials" > "OAuth 2.0 Client IDs"');
console.log('5. Choose "Web application"');
console.log('6. Add authorized redirect URI: http://localhost:4000/auth/google/callback');
console.log('7. Copy the Client ID and Client Secret\n');

rl.question('Enter your Google Client ID: ', (clientId) => {
  rl.question('Enter your Google Client Secret: ', (clientSecret) => {
    
    // Update .env file
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent = envContent.replace(
      'GOOGLE_CLIENT_ID=your_google_client_id_here',
      `GOOGLE_CLIENT_ID=${clientId}`
    );
    
    envContent = envContent.replace(
      'GOOGLE_CLIENT_SECRET=your_google_client_secret_here',
      `GOOGLE_CLIENT_SECRET=${clientSecret}`
    );
    
    fs.writeFileSync(envPath, envContent);
    
    // Update frontend config
    const frontendConfigPath = path.join(__dirname, '../nebulastream/config/auth.ts');
    let frontendConfig = fs.readFileSync(frontendConfigPath, 'utf8');
    
    frontendConfig = frontendConfig.replace(
      'GOOGLE_CLIENT_ID: \'your_google_client_id_here\'',
      `GOOGLE_CLIENT_ID: '${clientId}'`
    );
    
    fs.writeFileSync(frontendConfigPath, frontendConfig);
    
    console.log('\n✅ Configuration updated!');
    console.log('📁 Updated files:');
    console.log('  - Backend/.env');
    console.log('  - nebulastream/config/auth.ts');
    console.log('\n🚀 Now restart your backend server and try again!');
    
    rl.close();
  });
});