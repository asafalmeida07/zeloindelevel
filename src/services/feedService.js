import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config.js";

export const feedService = {
  async publishPerfectDay(teamId, phaseIndex, user, dayNumber) {
    await addDoc(collection(db, "feed"), {
      teamId,
      phase: phaseIndex,
      uid: user.uid,
      name: user.name,
      photoURL: user.photoURL || "",
      color: user.color || "#6E56F8",
      day: dayNumber,
      text: `${user.name} concluiu o Dia ${dayNumber}.`,
      ts: Date.now(),
    });
  },

  async getPhaseFeed(teamId, phaseIndex, max = 30) {
    const q = query(
      collection(db, "feed"),
      where("teamId", "==", teamId),
      where("phase", "==", phaseIndex)
    );
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => b.ts - a.ts)
      .slice(0, max);
  },
};
