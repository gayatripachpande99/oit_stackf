const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const name = path.join(dir, file);
    if (name.includes('node_modules') || name.includes('.git') || name.includes('.gemini')) continue;
    try {
      const stats = fs.statSync(name);
      if (stats.isDirectory()) {
        getFiles(name, files);
      } else {
        files.push({ name, mtime: stats.mtime });
      }
    } catch (e) {}
  }
  return files;
}

const allFiles = getFiles('c:/Users/gayat/OneDrive/Desktop/new oits');
allFiles.sort((a, b) => b.mtime - a.mtime);

console.log('Most recently modified files:');
allFiles.slice(0, 10).forEach(f => {
  console.log(`- ${f.name} (Modified: ${f.mtime.toISOString()})`);
});
