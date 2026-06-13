const fs = require('fs');
const path = require('path');

const pagesDir = '/Users/mac/Documents/Zivlo/app/(pages)';

function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverse(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Replace <Logo onClick={() => router.push('X')} />
    const logoRegex = /<Logo\s+onClick=\{\(\)\s*=>\s*router\.push\((['"`])(.*?)\1\)\}\s*\/>/g;
    if (logoRegex.test(content)) {
        content = content.replace(logoRegex, '<Link href="$2"><Logo /></Link>');
        modified = true;
    }

    // 2. Replace simple buttons: <button ... onClick={() => router.push('X')} ... > ... </button>
    // Since regex for HTML is hard, let's look for `onClick={() => router.push(...)` inside a tag.
    // Specifically `router.push('/dashboard')` etc that are in grep.

    // Let's do specific replacements.
    const specificReplacements = [
        {
            old: `<button onClick={() => router.push('/appscreen')} className="underline" style={{ color: navy }}>Run your first search →</button>`,
            new: `<Link href="/appscreen" className="underline" style={{ color: navy }}>Run your first search →</Link>`
        },
        {
            old: `<button
                  key={item.id}
                  onClick={() => router.push('/results?search_id=' + item.id)}
                  className="w-full bg-slate-50 hover:bg-slate-100 rounded-lg px-4 py-3 flex items-center justify-between transition text-left"
                >`,
            new: `<Link
                  key={item.id}
                  href={'/results?search_id=' + item.id}
                  className="w-full bg-slate-50 hover:bg-slate-100 rounded-lg px-4 py-3 flex items-center justify-between transition text-left block"
                >`
        },
        // We will just replace 'button' with 'Link' and 'onClick={...}' with 'href=...'
    ];

    for (const req of specificReplacements) {
        if (content.includes(req.old)) {
            content = content.replace(req.old, req.new);
            modified = true;
        }
    }

    // Generic button replacer
    const buttonRegex = /<button([^>]*)onClick=\{\(\)\s*=>\s*router\.push\((.*?)\)\}([^>]*)>/g;
    if (buttonRegex.test(content)) {
        content = content.replace(buttonRegex, (match, before, pathExp, after) => {
            let href = '';
            if (pathExp.startsWith("'") || pathExp.startsWith('"') || pathExp.startsWith('`')) {
                // simple string
                if (pathExp.includes('+') || pathExp.startsWith('`')) {
                    href = `href={${pathExp}}`;
                } else {
                    href = `href=${pathExp}`;
                }
            } else {
                href = `href={${pathExp}}`;
            }
            return `<Link${before}${href}${after}>`;
        });
        // We also need to change </button> to </Link> for those buttons.
        // It's dangerous to change all </button>. But if a file has modified = true, let's just do it manually.
        modified = true;
    }

    if (modified) {
        // Ensure Link is imported
        if (!content.includes('import Link from "next/link"') && !content.includes("import Link from 'next/link'")) {
            const importMatch = content.match(/^import .*;\n/gm);
            if (importMatch) {
                const lastImport = importMatch[importMatch.length - 1];
                content = content.replace(lastImport, lastImport + 'import Link from "next/link";\n');
            } else {
                content = 'import Link from "next/link";\n' + content;
            }
        }
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath}`);
    }
}

traverse(pagesDir);
