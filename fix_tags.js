const fs = require('fs');

const fixes = [
    { file: 'dashboard/page.tsx', line: 478 },
    { file: 'failure/page.tsx', line: 27 },
    { file: 'failure/page.tsx', line: 63 },
    { file: 'forgot-password/page.tsx', line: 58 },
    { file: 'forgot-password/page.tsx', line: 84 },
    { file: 'homepage/page.tsx', line: 48 },
    { file: 'homepage/page.tsx', line: 56 },
    { file: 'homepage/page.tsx', line: 63 },
    { file: 'homepage/page.tsx', line: 463 },
    { file: 'homepage/page.tsx', line: 556 },
    { file: 'legal/page.tsx', line: 41 },
    { file: 'paywall/page.tsx', line: 137 },
    { file: 'reset-password/page.tsx', line: 91 },
    { file: 'results/page.tsx', line: 399 },
    { file: 'success/page.tsx', line: 76 },
];

const basePath = '/Users/mac/Documents/Zivlo/app/(pages)/';

for (const fix of fixes) {
    const fullPath = basePath + fix.file;
    if (fs.existsSync(fullPath)) {
        let lines = fs.readFileSync(fullPath, 'utf8').split('\n');
        const targetIdx = fix.line - 1;
        if (lines[targetIdx].includes('</button>')) {
            lines[targetIdx] = lines[targetIdx].replace('</button>', '</Link>');
            fs.writeFileSync(fullPath, lines.join('\n'));
            console.log(`Fixed ${fix.file}:${fix.line}`);
        } else {
            // Find nearest </button> around it just in case
            for (let offset = -5; offset <= 5; offset++) {
                if (targetIdx + offset >= 0 && targetIdx + offset < lines.length) {
                    if (lines[targetIdx + offset].includes('</button>')) {
                        lines[targetIdx + offset] = lines[targetIdx + offset].replace('</button>', '</Link>');
                        fs.writeFileSync(fullPath, lines.join('\n'));
                        console.log(`Fixed ${fix.file}:${fix.line + offset} (offset ${offset})`);
                        break;
                    }
                }
            }
        }
    }
}
