import { collection, doc, getDocs, setDoc, query, where } from "firebase/firestore";
import { db } from "../firebase/config.js";
import { PHASE_DAYS, TASKS_PER_DAY, POINTS_PER_TASK } from "../utils/constants.js";
import { rankCompare } from "../utils/rank.js";

const rankId = (teamId, phaseIndex, uid) => `${teamId}_${phaseIndex}_${uid}`;

// Calcula os agregados de uma fase a partir do mapa de progresso.
export function aggregateFromProgress(progressMap, throughDay) {
  let points = 0, perfectDays = 0, active = 0;
  for (let d = 0; d < PHASE_DAYS; d++) {
    const c = progressMap[d]?.count || 0;
    points += c * POINTS_PER_TASK;
    if (c > 0) active++;
    if (c >= TASKS_PER_DAY) perfectDays++;
  }
  let streak = 0;
  const end = Math.min(Math.max(throughDay ?? PHASE_DAYS - 1, 0), PHASE_DAYS - 1);
  for (let d = end; d >= 0; d--) {
    const perfect = (progressMap[d]?.count || 0) >= TASKS_PER_DAY;
    if (perfect) streak++;
    else if (d === end) continue;
    else break;
  }
  return { points, perfectDays, active, streak };
}

export const rankingService = {
  async upsert(teamId, phaseIndex, user, agg) {
    const data = {
      id: rankId(teamId, phaseIndex, user.uid),
      teamId,
      phase: phaseIndex,
      uid: user.uid,
      name: user.name,
      photoURL: user.photoURL || "",
      color: user.color || "#6E56F8",
      level: user.level || 0,
      stars: user.stars || 0,
      points: agg.points,
      perfectDays: agg.perfectDays,
      streak: agg.streak,
      updatedAt: Date.now(),
    };
    await setDoc(doc(db, "ranking", data.id), data);
    return data;
  },

  async getPhaseRanking(teamId, phaseIndex) {
    const q = query(
      collection(db, "ranking"),
      where("teamId", "==", teamId),
      where("phase", "==", phaseIndex)
    );
    const snap = await getDocs(q);
    const rows = snap.docs.map((d) => d.data());
    return rows.sort(rankCompare);
  },
};
