const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const targetDir = path.join(__dirname, 'app');

walk(targetDir, (filePath) => {
  if (!filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // If the file contains "use client", ensure it's at the very top.
  if (content.includes('"use client"')) {
    // Remove all existing "use client"; or "use client"
    content = content.replace(/"use client";?\s*\n?/g, '');
    // Prepend it to the top
    content = '"use client";\n' + content;
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Fixed use client in', filePath);
  }
});
