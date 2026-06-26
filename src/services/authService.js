import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/config.js";

export const authService = {
  register: (email, password) => createUserWithEmailAndPassword(auth, email, password),
  login: (email, password) => signInWithEmailAndPassword(auth, email, password),
  logout: () => signOut(auth),
  resetPassword: (email) => sendPasswordResetEmail(auth, email),
  setDisplayName: (name) => (auth.currentUser ? updateProfile(auth.currentUser, { displayName: name }) : null),
  observe: (cb) => onAuthStateChanged(auth, cb),
};
