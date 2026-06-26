import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment } from "firebase/firestore";
import { db } from "../firebase/config.js";

const ref = (uid) => doc(db, "users", uid);

export const userService = {
  async get(uid) {
    const snap = await getDoc(ref(uid));
    return snap.exists() ? snap.data() : null;
  },

  async createIfMissing(uid, base) {
    const snap = await getDoc(ref(uid));
    if (snap.exists()) return snap.data();
    const data = {
      uid,
      name: base.name || "",
      email: base.email || "",
      photoURL: base.photoURL || "",
      color: base.color || "#6E56F8",
      level: 0,
      stars: 0,
      perfectDays: 0,
      longestStreak: 0,
      phasesWon: 0,
      objective: "",
      teamId: null,
      createdAt: serverTimestamp(),
    };
    await setDoc(ref(uid), data);
    return data;
  },

  update: (uid, patch) => updateDoc(ref(uid), patch),

  // Concede um nível (nunca diminui) e atualiza estatísticas permanentes.
  async grantPerfectDay(uid, { newLongestStreak }) {
    const patch = { level: increment(1), perfectDays: increment(1) };
    if (typeof newLongestStreak === "number") patch.longestStreak = newLongestStreak;
    await updateDoc(ref(uid), patch);
  },

  async awardChampion(uid) {
    await updateDoc(ref(uid), { stars: increment(1), phasesWon: increment(1) });
  },
};
