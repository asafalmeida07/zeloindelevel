import { db, storage } from "../firebase/config.js";
import { collection, query, orderBy, limit, getDocs, addDoc, startAfter, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export const feedService = {
  getPosts: async (lastDoc) => {
    let q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(10));
    if (lastDoc) q = query(q, startAfter(lastDoc));
    const snap = await getDocs(q);
    const posts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    // Ocultar denunciados > 3
    const filter = posts.filter(p => !p.denuncias || p.denuncias.length < 3);
    return { posts: filter, lastDoc: snap.docs[snap.docs.length - 1] || null };
  },

  createPost: async (data) => {
    return addDoc(collection(db, "posts"), data);
  },
  
  deletePost: async (id, mediaUrls) => {
    await deleteDoc(doc(db, "posts", id));
    if (mediaUrls) {
      for (const url of mediaUrls) {
        try {
           const path = decodeURIComponent(url.split('/o/')[1].split('?alt=media')[0]);
           await deleteObject(ref(storage, path));
        } catch(e) {}
      }
    }
  },

  uploadMedia: async (uid, files) => {
    const urls = [];
    for (const f of files) {
      const ext = f.name.split('.').pop();
      const r = ref(storage, `posts/${uid}/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`);
      const snap = await uploadBytes(r, f);
      urls.push(await getDownloadURL(snap.ref));
    }
    return urls;
  },

  denunciar: async (id, uid, currentDenuncias) => {
    const arr = currentDenuncias || [];
    if (!arr.includes(uid)) {
      await updateDoc(doc(db, "posts", id), { denuncias: [...arr, uid] });
    }
  },

  publishPerfectDay: async (teamId, phase, profile, cycleNum) => {
    return addDoc(collection(db, "posts"), {
      teamId,
      authorId: profile.uid,
      userName: profile.name,
      avatarUrl: profile.avatarUrl || null,
      content: `🎉 Concluí o Ciclo ${cycleNum} da Fase ${phase} com 100% de aproveitamento! (Dia Perfeito)`,
      createdAt: Date.now(),
      denuncias: [],
      mediaUrls: []
    });
  }
};
