import { collection, doc, getDoc, getDocs, setDoc, query, where, writeBatch } from "firebase/firestore";
import { db } from "../firebase/config.js";

const cycleId = (teamId, uid, cycleNumber) => `${teamId}_${uid}_${cycleNumber}`;

export const cycleService = {
  async savePlanMeta(teamId, uid, phase, planMeta) {
    const id = `${teamId}_${uid}_${phase}`;
    await setDoc(doc(db, "plans", id), {
      id, teamId, uid, phase, ...planMeta, updatedAt: Date.now()
    });
  },

  async getPlanMeta(teamId, uid, phase) {
    const snap = await getDoc(doc(db, "plans", `${teamId}_${uid}_${phase}`));
    return snap.exists() ? snap.data() : null;
  },

  async saveCyclesBatch(teamId, uid, cyclesArray) {
    const batch = writeBatch(db);
    cyclesArray.forEach(c => {
      const id = cycleId(teamId, uid, c.cycleNumber);
      const ref = doc(db, "cycles", id);
      batch.set(ref, {
        id, teamId, uid, ...c, updatedAt: Date.now()
      });
    });
    await batch.commit();
  },

  async getPhaseCycles(teamId, uid, phase) {
    // Para evitar índice composto no Firestore, filtramos status e ordenamos no cliente
    const q = query(collection(db, "cycles"), where("uid", "==", uid));
    const snap = await getDocs(q);
    const cycles = [];
    snap.forEach(d => {
      const data = d.data();
      if (data.teamId === teamId && data.phase === phase) {
        cycles.push(data);
      }
    });
    return cycles.sort((a, b) => a.cycleNumber - b.cycleNumber);
  },

  async getPendingCycles(teamId, uid) {
    // Para evitar índice composto no Firestore, filtramos status e ordenamos no cliente
    const q = query(collection(db, "cycles"), where("uid", "==", uid));
    const snap = await getDocs(q);
    const cycles = [];
    snap.forEach(d => {
      const data = d.data();
      if (data.teamId === teamId && (data.status === "programado" || data.status === "atual")) {
        cycles.push(data);
      }
    });
    return cycles.sort((a, b) => a.cycleNumber - b.cycleNumber);
  },

  async updateCycle(teamId, uid, cycleNumber, updates) {
    const id = cycleId(teamId, uid, cycleNumber);
    await setDoc(doc(db, "cycles", id), { ...updates, updatedAt: Date.now() }, { merge: true });
  }
};
