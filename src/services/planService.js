import { collection, doc, getDoc, getDocs, setDoc, query, where, writeBatch } from "firebase/firestore";
import { db } from "../firebase/config.js";

const planId = (teamId, uid, phase) => `${teamId}_${uid}_${phase}`;

export const planService = {
  async getPlan(teamId, uid, phase) {
    const snap = await getDoc(doc(db, "plans", planId(teamId, uid, phase)));
    return snap.exists() ? snap.data() : null;
  },

  async savePlan(teamId, uid, phase, planData) {
    const id = planId(teamId, uid, phase);
    const data = {
      id,
      teamId,
      uid,
      phase,
      ...planData,
      updatedAt: Date.now()
    };
    await setDoc(doc(db, "plans", id), data);
    return data;
  }
};
