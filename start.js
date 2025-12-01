const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting NestJS Backend...');
console.log('📁 Working directory:', process.cwd());

// Start the NestJS development server
const nestProcess = spawn('npm', ['run', 'start:dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

nestProcess.on('error', (error) => {
  console.error('❌ Failed to start process:', error);
});

nestProcess.on('close', (code) => {
  console.log(`🔚 Process exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  nestProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  nestProcess.kill('SIGTERM');
});