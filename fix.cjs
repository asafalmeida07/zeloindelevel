const fs = require('fs');
let code = fs.readFileSync('runIntegration.js', 'utf8');
code = code.replace(/button\[type="submit"\]/g, 'button');
fs.writeFileSync('runIntegration.js', code, 'utf8');
