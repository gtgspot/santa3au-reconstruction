const fs = require('fs');
const { exec } = require('child_process');

const directories = ['assets', 'includes', 'templates', 'data', 'tests'];

function ensureDirectories() {
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log(`Created directory: ${dir}`);
    } else {
      console.log(`Directory exists: ${dir}`);
    }
  });
}

function startLocalServer() {
  // Starting a simple HTTP server using http-server package
  // Ensure you have installed it: npm install -g http-server
  console.log('Starting local server on port 8080...');
  exec('http-server -p 8080', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting server: ${error.message}`);
      return;
    }
    console.log(stdout);
  });
}

function runAgent() {
  console.log('Running Quick Agent for Project Enhancements...');
  ensureDirectories();
  // Optionally start the local server
  // Uncomment the next line if you want the agent to serve the app automatically.
  // startLocalServer();
}

runAgent();
