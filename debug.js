console.log('🔍 Debugging Backend Issues...');

// Test 1: Check if Node.js is working
console.log('✅ Node.js version:', process.version);

// Test 2: Check if we can load basic modules
try {
  const fs = require('fs');
  const path = require('path');
  console.log('✅ Basic Node.js modules loaded');
} catch (error) {
  console.error('❌ Error loading basic modules:', error.message);
}

// Test 3: Check if we can load NestJS
try {
  const { NestFactory } = require('@nestjs/core');
  console.log('✅ NestJS core loaded');
} catch (error) {
  console.error('❌ Error loading NestJS:', error.message);
}

// Test 4: Check if TypeScript is working
try {
  require('ts-node/register');
  console.log('✅ TypeScript support loaded');
} catch (error) {
  console.error('❌ Error loading TypeScript:', error.message);
}

// Test 5: Check environment variables
console.log('🔧 Environment Variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- DB_HOST:', process.env.DB_HOST);
console.log('- DB_NAME:', process.env.DB_NAME);

// Test 6: Check if we can read the main files
const fs = require('fs');
const path = require('path');

const filesToCheck = [
  'src/main.ts',
  'src/app.module.ts',
  'package.json',
  'tsconfig.json',
  '.env'
];

filesToCheck.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      console.log(`✅ File exists: ${file}`);
    } else {
      console.log(`❌ File missing: ${file}`);
    }
  } catch (error) {
    console.log(`❌ Error checking ${file}:`, error.message);
  }
});

console.log('🏁 Debug complete');