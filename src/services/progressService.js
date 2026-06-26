import { collection, doc, getDoc, getDocs, setDoc, query, where } from "firebase/firestore";
import { db } from "../firebase/config.js";
import { PHASE_DAYS, TASKS_PER_DAY } from "../utils/constants.js";
import { absDay } from "../utils/phase.js";

// id determinístico: um documento por usuário por dia absoluto.
const progId = (teamId, uid, abs) => `${teamId}_${uid}_${abs}`;

export const progressService = {
  // Lê todo o progresso de um usuário numa fase (43 docs no máximo).
  async getPhase(teamId, uid, phaseIndex) {
    const q = query(
      collection(db, "progress"),
      where("teamId", "==", teamId),
      where("uid", "==", uid),
      where("phase", "==", phaseIndex)
    );
    const snap = await getDocs(q);
    const map = {}; // dayInPhase -> doc
    snap.forEach((d) => { map[d.data().day] = d.data(); });
    return map;
  },

  async getDay(teamId, uid, phaseIndex, dayInPhase) {
    const abs = absDay(phaseIndex, dayInPhase);
    const snap = await getDoc(doc(db, "progress", progId(teamId, uid, abs)));
    return snap.exists() ? snap.data() : null;
  },

  // Salva o conjunto de tarefas concluídas de um dia. Retorna metadados úteis.
  async setDay(teamId, uid, phaseIndex, dayInPhase, completedIndices, prevLeveled) {
    const abs = absDay(phaseIndex, dayInPhase);
    const count = completedIndices.length;
    const perfect = count >= TASKS_PER_DAY;
    const data = {
      id: progId(teamId, uid, abs),
      teamId, uid,
      phase: phaseIndex,
      day: dayInPhase,
      abs,
      completed: completedIndices,
      count,
      perfect,
      leveled: prevLeveled || perfect, // uma vez perfeito, marca como já nivelado
      updatedAt: Date.now(),
    };
    await setDoc(doc(db, "progress", data.id), data);
    return data;
  },
};
