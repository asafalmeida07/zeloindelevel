import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext.jsx';
import { db } from '../services/firebase.js';
import { doc, getDoc } from 'firebase/firestore';

export function useGestorAuth() {
  const { firebaseUser } = useAuthContext();
  const [isGestor, setIsGestor] = useState(false);
  const [isMaster, setIsMaster] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function checkAuth() {
      if (!firebaseUser || !firebaseUser.email) {
        if (active) { setIsGestor(false); setIsMaster(false); setLoading(false); }
        return;
      }
      
      const email = firebaseUser.email.toLowerCase();
      const masterEmail = import.meta.env.VITE_MASTER_EMAIL?.toLowerCase() || "master@zeloindelevel.app";
      
      if (email === masterEmail) {
        if (active) { setIsGestor(true); setIsMaster(true); setLoading(false); }
        return;
      }
      
      try {
        const docRef = doc(db, 'config', 'gestores');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const list = snap.data().emails || [];
          const isG = list.map(e => e.toLowerCase()).includes(email);
          if (active) { setIsGestor(isG); setIsMaster(false); setLoading(false); }
        } else {
          if (active) { setIsGestor(false); setIsMaster(false); setLoading(false); }
        }
      } catch (err) {
        console.error("Erro ao verificar acesso ao Gestor", err);
        if (active) { setIsGestor(false); setIsMaster(false); setLoading(false); }
      }
    }
    
    checkAuth();
    return () => { active = false; };
  }, [firebaseUser]);

  return { isGestor, isMaster, loading };
}
