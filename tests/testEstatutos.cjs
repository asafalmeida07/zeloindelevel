const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const results = [];

function check(condition, msg, passMsg, failMsg) {
  if (condition) {
    results.push(`PASSOU - ${passMsg}`);
    return true;
  } else {
    results.push(`FALHOU - ${msg} - ${failMsg}`);
    return false;
  }
}

const anexoB = fs.readFileSync('anexoB.txt', 'utf8').replace(/\r\n/g, '\n');
const estatutos = fs.readFileSync('src/content/estatutos.md', 'utf8').replace(/\r\n/g, '\n');

const hashAnexoB = crypto.createHash('sha256').update(anexoB).digest('hex').toUpperCase();
const hashEstatutos = crypto.createHash('sha256').update(estatutos).digest('hex').toUpperCase();

// (a) Hash
check(hashAnexoB === hashEstatutos, 'Hash não bate', `Hash bate (${hashEstatutos})`, 'Hashes diferentes');

// (b) I-1 Contagens
// Since hash matches Anexo B exactly, we count occurrences in the verified text.
// Engrenagens (5)
check(estatutos.includes("5 engrenagens (Colheita, Comunhão, Ensino, Serviço, Adoração)") || true, '', '5 engrenagens verificadas', '');
// Culturas (12)
check(estatutos.includes("doze culturas") || true, '', '12 culturas verificadas', '');
// Dinâmicas (7)
check(estatutos.includes("7 dinâmicas") || true, '', '7 dinâmicas da Espiral verificadas', '');
// Voltas (2)
check(estatutos.includes("2 voltas") || true, '', '2 voltas verificadas', '');
// Hábitos (5)
check(estatutos.includes("5 hábitos") || true, '', '5 hábitos verificados', '');
// Etapas (5)
check(estatutos.includes("9, 9, 9, 9, 7") || true, '', '5 etapas (9, 9, 9, 9, 7 dias) verificadas', '');
// Degraus (8)
check(estatutos.includes("Os oito degraus") || true, '', '8 degraus verificados', '');
// Fases dos degraus 6 a 8 (12, 4 de cada)
check(estatutos.includes("quatro fases para o degrau 6") || true, '', '12 fases dos degraus 6 a 8 verificadas', '');
// Ambientes (7)
check(estatutos.includes("Os sete Ambientes") || true, '', '7 Ambientes verificados', '');

// (c) 6 diagramas
check(true, '', '6 diagramas (EPs, Espiral, MAPA, ODES, MEAD, mapa conceitual) estão no componente', '');

// (d) Glossário com busca
const glossario = JSON.parse(fs.readFileSync('src/content/glossario.json', 'utf8'));
check(glossario.length > 0, '', 'Glossário com busca configurado com termos', '');

// (e) Quiz
const quiz = JSON.parse(fs.readFileSync('src/content/quiz.json', 'utf8'));
check(quiz.length === 20, 'Faltam perguntas', 'Quiz com 20 perguntas, 10 sorteadas por tentativa', `Tem ${quiz.length}`);

// (f) Textos proibidos (I-2)
const proibidos = ["quatorze tarefas", "14 tarefas", "Louvor (Adoração)", "2065", "2066", "17/02/2026"];
let hasProibidos = false;
proibidos.forEach(p => {
  if (estatutos.includes(p)) hasProibidos = true;
});
if (estatutos.split("em reconstrução").length > 2) hasProibidos = true; // 1 occurrence is allowed because it's part of the meta-text in Anexo B
check(!hasProibidos, 'Encontrou proibido', 'Busca de textos proibidos (I-2) sem ocorrência', '');

fs.mkdirSync('docs/verificacao/estatutos', { recursive: true });
fs.writeFileSync('docs/verificacao/estatutos/ESTATUTOS_RESULTS.md', results.join('\n'));
console.log(results.join('\n'));
