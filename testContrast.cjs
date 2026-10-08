const fs = require('fs');

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16)
  };
}

function parseRgb(str) {
  const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m) return { r: parseInt(m[1]), g: parseInt(m[2]), b: parseInt(m[3]) };
  return hexToRgb(str);
}

function luminance(r, g, b) {
  const a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928
          ? v / 12.92
          : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(rgb1, rgb2) {
  const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const colorsLight = {
  bg: '#F4EFE4', // pilar-comprometimento
  surface: '#FFFFFF',
  text: '#14284B', // pilar-direcionamento
  accent: '#A84A09', // pilar-avivamento-texto
  success: '#1F4D36', // pilar-fortalecimento
  danger: '#7A1B1B', // pilar-sustentacao
  pilar1: '#7A1B1B', // sustentacao
  pilar2: '#E8731A', // avivamento (but text uses A84A09, so check both)
  pilar2text: '#A84A09',
  pilar3: '#1F4D36', // fortalecimento
  pilar4: '#F4EFE4', // comprometimento
  pilar5: '#14284B', // direcionamento
  btnText: '#FFFFFF'
};

const colorsDark = {
  bg: '#1A1A1A',
  surface: '#242424',
  text: '#F4EFE4',
  accent: '#E8731A',
  success: '#4ADE80',
  danger: '#F87171',
  pilar1: '#F87171',
  pilar2: '#E8731A',
  pilar2text: '#FF8F3D',
  pilar3: '#4ADE80',
  pilar4: '#D1CDBF',
  pilar5: '#93C5FD',
  btnText: '#1A1A1A'
};

function getPairs(c, theme) {
  return [
    [`Texto normal / Fundo bg (${theme})`, c.text, c.bg],
    [`Texto normal / Surface (${theme})`, c.text, c.surface],
    [`Link/Accent / Fundo bg (${theme})`, c.accent, c.bg],
    [`Success (aviso) / Fundo bg (${theme})`, c.success, c.bg],
    [`Danger (aviso) / Fundo bg (${theme})`, c.danger, c.bg],
    [`Texto Botão / Fundo Accent (${theme})`, c.btnText, c.accent],
    [`Pilar 1 Sustentação / Fundo bg (${theme})`, c.pilar1, c.bg],
    [`Pilar 2 Avivamento (Texto) / Fundo bg (${theme})`, c.pilar2text, c.bg],
    [`Pilar 3 Fortalecimento / Fundo bg (${theme})`, c.pilar3, c.bg],
    [`Pilar 5 Direcionamento / Fundo bg (${theme})`, c.pilar5, c.bg]
  ];
}

const pairs = [...getPairs(colorsLight, 'Claro'), ...getPairs(colorsDark, 'Escuro')];

const results = [];
let passed = 0;
let failed = 0;

results.push('| Par | Cores (Texto / Fundo) | Razão | Status |');
results.push('|---|---|---|---|');

pairs.forEach(([name, c1, c2]) => {
  const r = contrast(parseRgb(c1), parseRgb(c2));
  const ratio = r.toFixed(2);
  const isPass = r >= 4.5;
  if (isPass) passed++; else failed++;
  results.push(`| ${name} | ${c1} / ${c2} | ${ratio}:1 | ${isPass ? 'PASSOU' : 'FALHOU'} |`);
});

fs.writeFileSync('docs/CONTRAST_RESULTS.md', results.join('\n'));
console.log(`Total: ${pairs.length} | Passed: ${passed} | Failed: ${failed}`);
