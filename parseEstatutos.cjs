const fs = require('fs');
const content = fs.readFileSync('src/content/estatutos.md', 'utf8');

const extract = (startHeader, endHeader) => {
  const start = content.indexOf(startHeader);
  if (start === -1) return '';
  const end = endHeader ? content.indexOf(endHeader, start) : content.length;
  return content.substring(start, end === -1 ? content.length : end).trim();
};

const hEP = `## EP's — Engrenagens do Propósito`;
const hOdes = `## ODES — Oito Degraus da Excelência Sacerdotal`;

const sVisao = extract(`## A direção para o alinhamento`, hEP);
const sEps = extract(hEP, `## Espiral`);
const sEspiral = extract(`## Espiral`, `## MAPA`);
const sMapa = extract(`## MAPA`, hOdes);
const sOdes = extract(hOdes, `## MEAD`);
const sMead = extract(`## MEAD`, `# PARTE B`);

const sections = {
  visao: sVisao, eps: sEps, espiral: sEspiral, mapa: sMapa, odes: sOdes, mead: sMead
};
fs.writeFileSync('src/content/estatutos_sections.json', JSON.stringify(sections, null, 2));

const pE = extract(`# PARTE E`, `# PARTE F`);
const glossario = [];
pE.split('\n').forEach(line => {
  const m = line.match(/-\s+\*\*(.*?):\*\*(.*)/);
  if (m) glossario.push({ term: m[1].trim(), desc: m[2].trim() });
});
fs.writeFileSync('src/content/glossario.json', JSON.stringify(glossario, null, 2));

const pF = extract(`# PARTE F`);
const quiz = [];
pF.split('\n').forEach(line => {
  const m = line.match(/^\d+\.\s+(.*?)\s+·\s+(.*?)\s+·\s+(.*)$/);
  if (m) {
    const qText = m[1].trim();
    const options = m[2].split(' / ').map(a => ({
      text: a.replace(/\*\*/g, '').trim(),
      isCorrect: a.includes('**')
    }));
    quiz.push({ question: qText, options, explanation: m[3].trim() });
  }
});
fs.writeFileSync('src/content/quiz.json', JSON.stringify(quiz, null, 2));
console.log('Quiz size:', quiz.length);
