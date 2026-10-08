import { isCycleReadyToConclude, calculateNextLevel } from "./src/utils/cycles.js";

function assert(condition, message) {
  if (!condition) {
    console.error("FALHOU: " + message);
    process.exit(1);
  }
}

// Cria um ciclo base concluído
const baseTasks = () => ({
  'Momento na Presença': { done: true, text: '60 min' },
  'Jejum': { done: true, text: '12h' },
  'Leitura Bíblica': { done: true },
  'Exercícios Físicos': { done: true }
});

console.log("Executando cenários de Teste da Fase E...");

// Cenário 1: Tudo feito -> OK
let t = baseTasks();
assert(isCycleReadyToConclude(t, []), "Cenário 1 falhou: deveria estar pronto.");

// Cenário 2: Momento não feito -> Falha
t = baseTasks();
t['Momento na Presença'].done = false;
assert(!isCycleReadyToConclude(t, []), "Cenário 2 falhou: não deveria estar pronto sem Momento.");

// Cenário 3: Jejum não feito, mas texto é "Sem jejum" -> OK
t = baseTasks();
t['Jejum'].done = false;
t['Jejum'].text = 'Sem jejum por saúde';
assert(isCycleReadyToConclude(t, []), "Cenário 3 falhou: deveria aceitar 'Sem jejum'.");

// Cenário 4: Jejum não feito e vazio -> Falha
t = baseTasks();
t['Jejum'].done = false;
t['Jejum'].text = '';
assert(!isCycleReadyToConclude(t, []), "Cenário 4 falhou: deveria falhar sem jejum validado.");

// Cenário 5: Emergentes pendentes -> Falha
t = baseTasks();
assert(!isCycleReadyToConclude(t, [{ id: 1, text: 'emerg', done: false }]), "Cenário 5 falhou: falha com emergente pendente.");

// Cenário 6: Emergentes feitas -> OK
t = baseTasks();
assert(isCycleReadyToConclude(t, [{ id: 1, text: 'emerg', done: true }]), "Cenário 6 falhou: deveria passar com emergente pronta.");

// Cenário 7: +1 nível
assert(calculateNextLevel(5) === 6, "Cenário 7 falhou: nível deve subir +1.");

console.log("PASSOU: Todos os cenários da Fase E testados com sucesso!");
