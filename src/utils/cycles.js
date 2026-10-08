// src/utils/cycles.js

export function isCycleReadyToConclude(cycleTasks, emergentes) {
  if (!cycleTasks) return false;

  // 1. Momento na Presença (>= 60 min, ou default feito se configurado)
  const momento = cycleTasks['Momento na Presença'];
  if (!momento?.done) return false;

  // 2. Jejum (se não fez, mas o texto contém 'Sem jejum', considera ok)
  const jejum = cycleTasks['Jejum'];
  if (!jejum?.done && (!jejum?.text || !jejum.text.toLowerCase().includes('sem jejum'))) {
    return false;
  }

  // 3. Demais tarefas do ciclo
  for (const [key, t] of Object.entries(cycleTasks)) {
    if (key === 'Momento na Presença' || key === 'Jejum') continue;
    
    if (t.subtasks) {
      if (!Object.values(t.subtasks).every(s => s.done)) return false;
    } else {
      if (!t.done) return false;
    }
  }

  // 4. Tarefas emergentes
  if (emergentes && emergentes.length > 0) {
    if (!emergentes.every(em => em.done)) return false;
  }

  return true;
}

export function calculateNextLevel(currentLevel) {
  // Cada ciclo avança 1 nível (perfectDay).
  return (currentLevel || 0) + 1;
}
