const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..');
const distDir = path.join(__dirname, '../dist');

console.log('📦 Starting bundle copy to dist/ folder...');

// Clean existing dist folder
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 1. Copy standalone server folder files
const standaloneDir = path.join(srcDir, '.next/standalone');
if (fs.existsSync(standaloneDir)) {
  fs.cpSync(standaloneDir, distDir, { recursive: true });
  console.log('✓ Copied standalone server.');
} else {
  console.error('❌ Standalone folder not found! Make sure "output: \'standalone\'" is set in next.config.ts and build succeeded.');
  process.exit(1);
}

// 2. Copy static folder to dist/.next/static
const staticSrc = path.join(srcDir, '.next/static');
const staticDest = path.join(distDir, '.next/static');
if (fs.existsSync(staticSrc)) {
  fs.cpSync(staticSrc, staticDest, { recursive: true });
  console.log('✓ Copied static resources.');
}

// 3. Copy public folder to dist/public
const publicSrc = path.join(srcDir, 'public');
const publicDest = path.join(distDir, 'public');
if (fs.existsSync(publicSrc)) {
  fs.cpSync(publicSrc, publicDest, { recursive: true });
  console.log('✓ Copied public assets.');
}

// 4. Force bind process.env.HOSTNAME to 'localhost' inside dist/server.js to prevent OS hostnames from hijacking it
const serverJsPath = path.join(distDir, 'server.js');
if (fs.existsSync(serverJsPath)) {
  let serverJs = fs.readFileSync(serverJsPath, 'utf-8');
  
  // Inject at the very top of server.js
  serverJs = `process.env.HOSTNAME = 'localhost';\nprocess.env.PORT = '3000';\n` + serverJs;
  
  fs.writeFileSync(serverJsPath, serverJs, 'utf-8');
  console.log('✓ Injected localhost binding at the top of server.js.');
}

// 5. Configure .env inside dist/ to force bind the server specifically to http://localhost:3000!
const originalEnvPath = path.join(srcDir, '.env');
let envContent = 'HOSTNAME=localhost\nPORT=3000\n';

if (fs.existsSync(originalEnvPath)) {
  const originalEnv = fs.readFileSync(originalEnvPath, 'utf-8');
  envContent = originalEnv;
  
  if (!envContent.includes('HOSTNAME=')) {
    envContent += '\nHOSTNAME=localhost';
  } else {
    envContent = envContent.replace(/HOSTNAME=.*/g, 'HOSTNAME=localhost');
  }
  
  if (!envContent.includes('PORT=')) {
    envContent += '\nPORT=3000';
  }
} else {
  fs.writeFileSync(path.join(srcDir, '.env'), envContent, 'utf-8');
}

fs.writeFileSync(path.join(distDir, '.env'), envContent, 'utf-8');
console.log('✓ Configured server environment variables.');

console.log('🚀 Standalone build copied to dist/ directory successfully!');
console.log('👉 Tell your senior teammates to share this dist/ folder, and run "node server.js" to host it instantly!');
