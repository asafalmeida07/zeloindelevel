const fs = require('fs');
const content = fs.readFileSync('src/content/estatutos.md', 'utf8');

const regex = /(## A direção para o alinhamento[\s\S]*?)(?=## EP's — Engrenagens do Propósito)/;
console.log(content.match(regex)[0].substring(0, 100));
