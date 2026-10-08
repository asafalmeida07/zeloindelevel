const fs = require('fs');
let content = fs.readFileSync('testE2E_fail.cjs', 'utf8');
content = content.replace('await takeSnap(page, `fail-error`);\n    process.exit(1);', 'await takeSnap(page, `fail-error`);\n    process.exitCode = 1;');
content = content.replace('process.exit(0);', 'process.exitCode = 0;');
fs.writeFileSync('testE2E_fail.cjs', content, 'utf8');
