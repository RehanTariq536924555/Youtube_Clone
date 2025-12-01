#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('📦 Installing Google Auth Library...');

try {
  // Install google-auth-library for credential verification
  execSync('npm install google-auth-library', { stdio: 'inherit' });
  
  console.log('✅ Google Auth Library installed successfully!');
  console.log('\n🔧 Dependencies added:');
  console.log('  • google-auth-library - For verifying Google JWT credentials');
  
  console.log('\n🚀 You can now use YouTube-style authentication!');
  console.log('   The backend can now verify Google credentials directly.');
  
} catch (error) {
  console.error('❌ Failed to install Google Auth Library:', error.message);
  console.log('\n🔧 Manual installation:');
  console.log('   cd Backend && npm install google-auth-library');
  process.exit(1);
}