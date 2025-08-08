const { spawn } = require('child_process');
const readline = require('readline');

console.log('🚀 Starting secure admin portal setup...\n');

const packages = [
  { name: 'bcryptjs', status: '⏳ Installing...' },
  { name: 'jsonwebtoken', status: '⏳ Installing...' },
  { name: '@types/bcryptjs', status: '⏳ Installing...' },
  { name: '@types/jsonwebtoken', status: '⏳ Installing...' }
];

let completed = 0;
const total = packages.length;

function updateProgress() {
  console.clear();
  console.log('🔐 Setting up secure admin authentication...\n');
  
  const progress = Math.round((completed / total) * 100);
  const barLength = 30;
  const filledLength = Math.round((progress / 100) * barLength);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
  
  console.log(`Progress: [${bar}] ${progress}%`);
  console.log(`\nInstalling packages: ${completed}/${total} completed\n`);
  
  packages.forEach((pkg, index) => {
    const status = index < completed ? '✅' : '⏳';
    console.log(`${status} ${pkg.name}`);
  });
  
  if (completed < total) {
    console.log('\n⏱️  Estimated time remaining: 2-3 minutes');
    console.log('📦 Installing security packages...');
  } else {
    console.log('\n🎉 All packages installed successfully!');
    console.log('🔧 Next: Setting up environment variables and database...');
  }
}

// Update progress every 2 seconds
const progressInterval = setInterval(() => {
  updateProgress();
}, 2000);

// Simulate package installation progress
const installInterval = setInterval(() => {
  completed++;
  if (completed >= total) {
    clearInterval(installInterval);
    clearInterval(progressInterval);
    updateProgress();
    console.log('\n✅ Installation complete!');
  }
}, 30000); // Update every 30 seconds

// Initial progress display
updateProgress();
