import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc,
  query, where, arrayUnion, serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config.js";
import { generateTeamCode } from "../utils/format.js";

const col = collection(db, "teams");

export const teamService = {
  async create({ name, adminUid, anchorDate, tasks }) {
    let code = generateTeamCode(name);
    // garante unicidade do código
    for (let i = 0; i < 5; i++) {
      const exists = await this.findByCode(code);
      if (!exists) break;
      code = generateTeamCode(name);
    }
    const id = code;
    const data = {
      id,
      name,
      code,
      adminUid,
      anchorDate,           // "YYYY-MM-DD" — início da Fase 1
      tasks,                // array de 14 strings
      memberUids: [adminUid],
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, "teams", id), data);
    return data;
  },

  async get(teamId) {
    const snap = await getDoc(doc(db, "teams", teamId));
    return snap.exists() ? snap.data() : null;
  },

  // Lista todos os grupos (uso da conta mestre).
  async listAll() {
    const snap = await getDocs(col);
    return snap.docs.map((d) => d.data());
  },

  async findByCode(code) {
    const q = query(col, where("code", "==", code.toUpperCase().trim()));
    const snap = await getDocs(q);
    return snap.empty ? null : snap.docs[0].data();
  },

  async join(teamId, uid) {
    await updateDoc(doc(db, "teams", teamId), { memberUids: arrayUnion(uid) });
  },

  async members(teamId) {
    const team = await this.get(teamId);
    if (!team) return [];
    const out = [];
    for (const uid of team.memberUids || []) {
      const u = await getDoc(doc(db, "users", uid));
      if (u.exists()) out.push(u.data());
    }
    return out;
  },

  update: (teamId, patch) => updateDoc(doc(db, "teams", teamId), patch),
};
