import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext.jsx';
import { db } from '../firebase/config.js';
import { doc, getDoc } from 'firebase/firestore';
import { isMasterUid } from '../utils/master.js';

export function useGestorAuth() {
  const { firebaseUser } = useAuthContext();
  const [isGestor, setIsGestor] = useState(false);
  const [isMaster, setIsMaster] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function checkAuth() {
      if (!firebaseUser || !firebaseUser.uid) {
        if (active) { setIsGestor(false); setIsMaster(false); setLoading(false); }
        return;
      }
      
      const master = isMasterUid(firebaseUser.uid);
      if (master) {
        if (active) { setIsGestor(true); setIsMaster(true); setLoading(false); }
        return;
      }
      
      try {
        const emailKey = firebaseUser.email?.toLowerCase();
        if (!emailKey) throw new Error("No email");
        
        const docRef = doc(db, 'gestores', emailKey);
        const snap = await getDoc(docRef);
        
        if (snap.exists() && snap.data().ativo) {
          if (active) { setIsGestor(true); setIsMaster(false); setLoading(false); }
        } else {
          if (active) { setIsGestor(false); setIsMaster(false); setLoading(false); }
        }
      } catch (err) {
        if (active) { setIsGestor(false); setIsMaster(false); setLoading(false); }
      }
    }
    
    checkAuth();
    return () => { active = false; };
  }, [firebaseUser]);

  return { isGestor, isMaster, loading };
}
