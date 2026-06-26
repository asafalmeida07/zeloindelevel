// Regras de domínio do Apenas Continue 2.0
export const PHASE_DAYS = 43;          // toda fase tem exatamente 43 dias
export const TASKS_PER_DAY = 14;       // 14 tarefas diárias
export const POINTS_PER_TASK = 3;      // cada tarefa vale 3 pontos
export const MAX_POINTS_DAY = TASKS_PER_DAY * POINTS_PER_TASK;     // 42
export const MAX_POINTS_PHASE = MAX_POINTS_DAY * PHASE_DAYS;       // 1806

// Tarefas padrão sugeridas (o admin pode editar ao criar a equipe)
export const DEFAULT_TASKS = [
  "Oração da manhã",
  "Leitura bíblica",
  "Meditar na Palavra",
  "Gratidão",
  "Jejum / domínio próprio",
  "Adoração",
  "Intercessão",
  "Leitura edificante",
  "Exercício físico",
  "Beber água",
  "Evangelizar / servir alguém",
  "Estudo / trabalho com excelência",
  "Tempo em família",
  "Oração da noite",
];

export const PROFILE_COLORS = [
  "#6E56F8", "#2FBF71", "#F2C14E", "#F2545B",
  "#3BA0FF", "#FF6FB5", "#16C0C0", "#FF8A3C",
];
