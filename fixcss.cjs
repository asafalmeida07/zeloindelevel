const fs = require('fs');
let css = fs.readFileSync('src/pages/Estatutos/Estatutos.module.css', 'utf8');
const imports = "@import '@fontsource/fraunces';\n@import '@fontsource/literata';\n@import '@fontsource/ibm-plex-mono';\n";
fs.writeFileSync('src/pages/Estatutos/Estatutos.module.css', imports + css, 'utf8');
