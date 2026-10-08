const fs = require('fs');
let content = fs.readFileSync('src/contexts/PhaseContext.jsx', 'utf8');
content = content.replace(/Erro ao salvar a tarefa.*/, 'Erro ao salvar a tarefa. A marcacao foi desfeita.`, `error`);');
fs.writeFileSync('src/contexts/PhaseContext.jsx', content, 'utf8');
