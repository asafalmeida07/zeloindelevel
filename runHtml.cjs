const fs = require('fs');
const path = require('path');
const p = path.join('C:\\Users\\asafa\\OneDrive\\Desktop\\Mini PC - Backup\\Documentos\\apenas-continue-2\\apenas-continue-2', 'index.html');
let html = fs.readFileSync(p, 'utf8');

// Replace title
html = html.replace(/<title>.*?<\/title>/, '<title>Zelo Indelével</title>');
// Replace lang
html = html.replace(/<html.*?>/, '<html lang="pt-BR">');
// Replace favicon
html = html.replace(/<link rel="icon" type="image\/svg\+xml" href=".*?" \/>/, '<link rel="icon" type="image/svg+xml" href="/favicon.svg" />');
html = html.replace(/<link rel="icon" href=".*?" \/>/, '<link rel="icon" type="image/svg+xml" href="/favicon.svg" />');

// Add metas if not present
if (!html.includes('<meta name="application-name"')) {
  html = html.replace('</head>', '  <meta name="application-name" content="Zelo Indelével">\n  <meta property="og:title" content="Zelo Indelével">\n  <meta name="apple-mobile-web-app-title" content="Zelo Indelével">\n</head>');
}

fs.writeFileSync(p, html, 'utf8');

const favP = path.join('C:\\Users\\asafa\\OneDrive\\Desktop\\Mini PC - Backup\\Documentos\\apenas-continue-2\\apenas-continue-2', 'public', 'favicon.svg');
const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="82" font-size="84" text-anchor="middle">&#10084;&#65039;&#8205;&#128293;</text></svg>`;
if (!fs.existsSync(path.dirname(favP))) {
  fs.mkdirSync(path.dirname(favP), { recursive: true });
}
fs.writeFileSync(favP, fav, 'utf8');
