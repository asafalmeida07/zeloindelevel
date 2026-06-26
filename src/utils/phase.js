import { PHASE_DAYS } from "./constants.js";

const DAY_MS = 86400000;

// Converte "YYYY-MM-DD" em Date local à meia-noite.
function parseYMD(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfToday() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

// Dias decorridos desde a âncora (início da Fase 1). Pode ser negativo.
export function daysSinceAnchor(anchorYMD) {
  if (!anchorYMD) return null;
  return Math.round((startOfToday() - parseYMD(anchorYMD)) / DAY_MS);
}

// Informações da fase/dia atuais a partir da âncora.
export function getPhaseInfo(anchorYMD) {
  const dsa = daysSinceAnchor(anchorYMD);
  if (dsa == null) return { started: false };
  const started = dsa >= 0;
  const phaseIndex = started ? Math.floor(dsa / PHASE_DAYS) : 0;
  const dayInPhase = started ? dsa - phaseIndex * PHASE_DAYS : -1;
  return {
    started,
    daysSinceAnchor: dsa,
    phaseIndex,                 // 0-based
    dayInPhase,                 // 0-based
    phaseNumber: phaseIndex + 1,
    dayNumber: dayInPhase + 1,
  };
}

// Índice absoluto do dia (contínuo entre fases).
export function absDay(phaseIndex, dayInPhase) {
  return phaseIndex * PHASE_DAYS + dayInPhase;
}

// Intervalo de datas de uma fase.
export function phaseRange(anchorYMD, phaseIndex) {
  const start = parseYMD(anchorYMD);
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate() + phaseIndex * PHASE_DAYS);
  const e = new Date(s.getFullYear(), s.getMonth(), s.getDate() + PHASE_DAYS - 1);
  return { start: s, end: e };
}

export function dateForAbs(anchorYMD, abs) {
  const start = parseYMD(anchorYMD);
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + abs);
}
