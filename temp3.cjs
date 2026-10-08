const fs = require('fs');
let content = fs.readFileSync('testEstatutosPlaywright.cjs', 'utf8');
content = content.replace(/await pageMobile\.waitForSelector\('text=Plano'\);/g, 'await pageMobile.waitForSelector(	ext=Estatutos);');
content = content.replace(/await pageDesktop\.waitForSelector\('text=Plano'\);/g, 'await pageDesktop.waitForSelector(	ext=Estatutos);');
fs.writeFileSync('testEstatutosPlaywright.cjs', content, 'utf8');
