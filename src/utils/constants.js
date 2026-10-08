// Regras de domínio do Apenas Continue 2.0
export const PHASE_DAYS = 43;          // toda fase tem exatamente 43 dias
export const TASKS_PER_DAY = 13;       // 13 tarefas diárias (a 14ª é o ciclo concluído)
export const POINTS_PER_TASK = 3;      // cada tarefa vale 3 pontos
export const MAX_POINTS_DAY = TASKS_PER_DAY * POINTS_PER_TASK;     // 39
export const MAX_POINTS_PHASE = MAX_POINTS_DAY * PHASE_DAYS;       // 1677

// Tarefas padrão sugeridas baseadas no MAPA
export const DEFAULT_TASKS = [
  "Leitura Bíblica",
  "Momento na Presença",
  "Exercícios Físicos",
  "Jejum",
  "Leitura",
  "Organização Pessoal",
  "Limpeza",
  "Estudo Focado",
  "Apascentamento",
  "Evangelismo",
  "Escrita (registro)",
  "Planejamento Estratégico",
  "Compromissos Ministeriais",
];

export const PROFILE_COLORS = [
  "#7A1B1B", "#E8731A", "#1F4D36", "#14284B",
  "#5A1313", "#B85A13", "#153826", "#0E1C36"
];

