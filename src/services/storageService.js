import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/config.js";

export const storageService = {
  async uploadAvatar(uid, file) {
    const ext = (file.name?.split(".").pop() || "jpg").toLowerCase();
    const path = `avatars/${uid}/avatar_${Date.now()}.${ext}`;
    const r = ref(storage, path);
    await uploadBytes(r, file);
    return getDownloadURL(r);
  },
};
