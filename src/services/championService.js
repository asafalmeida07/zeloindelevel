import { doc, getDoc, runTransaction } from "firebase/firestore";
import { db } from "../firebase/config.js";
import { rankingService } from "./rankingService.js";
import { userService } from "./userService.js";

const champId = (teamId, phaseIndex) => `${teamId}_${phaseIndex}`;

export const championService = {
  async get(teamId, phaseIndex) {
    const snap = await getDoc(doc(db, "champions", champId(teamId, phaseIndex)));
    return snap.exists() ? snap.data() : null;
  },

  // Finaliza uma fase encerrada: registra o campeão (uma única vez) e
  // concede ⭐ + fase vencida ao 1º colocado. Idempotente via transação.
  async finalizeIfNeeded(teamId, phaseIndex) {
    const id = champId(teamId, phaseIndex);
    const champRef = doc(db, "champions", id);

    const existing = await getDoc(champRef);
    if (existing.exists()) return existing.data();

    const ranking = await rankingService.getPhaseRanking(teamId, phaseIndex);
    if (!ranking.length) return null;
    const winner = ranking[0];

    let created = false;
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(champRef);
      if (snap.exists()) return;
      tx.set(champRef, {
        id, teamId, phase: phaseIndex,
        uid: winner.uid, name: winner.name,
        photoURL: winner.photoURL || "",
        points: winner.points, perfectDays: winner.perfectDays,
        ts: Date.now(),
      });
      created = true;
    });

    if (created) {
      try { await userService.awardChampion(winner.uid); } catch (e) { /* noop */ }
    }
    return this.get(teamId, phaseIndex);
  },
};
