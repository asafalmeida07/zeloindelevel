import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config.js";

export const feedService = {
  async publishPerfectDay(teamId, phaseIndex, user, cycleNumber) {
    await addDoc(collection(db, "feed"), {
      teamId,
      phase: phaseIndex,
      uid: user.uid,
      name: user.name,
      photoURL: user.photoURL || "",
      color: user.color || "#6E56F8",
      day: cycleNumber,
      text: `${user.name} concluiu o Ciclo #${cycleNumber}!`,
      type: "system_event",
      ts: Date.now(),
    });
  },

  async createPost(teamId, user, text, mediaArray = []) {
    await addDoc(collection(db, "feed"), {
      teamId,
      uid: user.uid,
      name: user.name,
      photoURL: user.photoURL || "",
      color: user.color || "#6E56F8",
      text,
      media: mediaArray, // [{ url: '...', type: 'image'|'video' }]
      type: "user_post",
      ts: Date.now(),
    });
  },

  async getTeamFeed(teamId, max = 50) {
    const q = query(
      collection(db, "feed"),
      where("teamId", "==", teamId)
    );
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => b.ts - a.ts)
      .slice(0, max);
  },
};
