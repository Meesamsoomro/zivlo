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

  // The bad import is when `import Logo from "@/components/Logo";\n` is injected inside a multiline import.
  // It looks like:
  // import {
  // import Logo from "@/components/Logo";
  if (content.includes('import Logo from "@/components/Logo";')) {
    // Remove all instances of the import first
    content = content.replace(/import Logo from "@\/components\/Logo";\n/g, '');
    
    // Now add it at the very top of the file
    content = 'import Logo from "@/components/Logo";\n' + content;
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Fixed imports in', filePath);
  }
});
