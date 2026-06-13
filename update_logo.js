const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const logoSnippet1 = `<div
          className="text-2xl md:text-3xl font-bold tracking-tight"
          style={{
            color: navy,
            fontFamily: "Georgia, serif",
            letterSpacing: "-0.02em",
          }}
        >
          Zivlo
        </div>`;
const logoSnippet2 = `<div
            className="text-2xl font-bold tracking-tight cursor-pointer"
            onClick={() => router.push("/")}
            style={{
              color: navy,
              fontFamily: "Georgia, serif",
              letterSpacing: "-0.02em",
            }}
          >
            Zivlo
          </div>`;
const logoSnippet3 = `<div
            className="text-2xl md:text-3xl font-bold tracking-tight cursor-pointer"
            onClick={() => router.push("/")}
            style={{
              color: navy,
              fontFamily: "Georgia, serif",
              letterSpacing: "-0.02em",
            }}
          >
            Zivlo
          </div>`;
const logoSnippet4 = `<div
          className="text-3xl md:text-4xl font-bold tracking-tight mb-8"
          style={{
            color: navy,
            fontFamily: "Georgia, serif",
            letterSpacing: "-0.02em",
          }}
        >
          Zivlo
        </div>`;
const logoSnippet5 = `<div
          className="text-2xl md:text-3xl font-bold tracking-tight mb-8"
          style={{
            color: navy,
            fontFamily: "Georgia, serif",
            letterSpacing: "-0.02em",
          }}
        >
          Zivlo
        </div>`;

const targetDir = path.join(__dirname, 'app');

walk(targetDir, (filePath) => {
  if (!filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Add import if not present
  if (content.includes('Zivlo') && !content.includes('import Logo')) {
     const importStatement = `import Logo from "@/components/Logo";\n`;
     // find last import
     const lastImportIndex = content.lastIndexOf('import ');
     if (lastImportIndex !== -1) {
       const endOfLastImport = content.indexOf('\n', lastImportIndex);
       content = content.slice(0, endOfLastImport + 1) + importStatement + content.slice(endOfLastImport + 1);
     } else {
       content = importStatement + content;
     }
  }

  content = content.replace(logoSnippet1, `<Logo />`);
  content = content.replace(logoSnippet2, `<Logo onClick={() => router.push("/")} />`);
  content = content.replace(logoSnippet3, `<Logo onClick={() => router.push("/")} />`);
  content = content.replace(logoSnippet4, `<Logo className="mb-8" />`);
  content = content.replace(logoSnippet5, `<Logo className="mb-8" />`);

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Updated', filePath);
  }
});
