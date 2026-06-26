import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { userService } from "../services/userService.js";
import { isMasterUid } from "../utils/master.js";
import { useAuthContext } from "./AuthContext.jsx";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const { firebaseUser } = useAuthContext();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (fu) => {
    if (!fu) { setProfile(null); setLoading(false); return; }
    setLoading(true);
    let p = await userService.get(fu.uid);
    if (!p) {
      p = await userService.createIfMissing(fu.uid, {
        name: fu.displayName || (fu.email ? fu.email.split("@")[0] : "Usuário"),
        email: fu.email || "",
        photoURL: fu.photoURL || "",
      });
    }
    setProfile(p);
    setLoading(false);
  }, []);

  useEffect(() => { load(firebaseUser); }, [firebaseUser, load]);

  const refresh = useCallback(async () => {
    if (firebaseUser) setProfile(await userService.get(firebaseUser.uid));
  }, [firebaseUser]);

  const updateProfile = useCallback(async (patch) => {
    if (!firebaseUser) return;
    await userService.update(firebaseUser.uid, patch);
    setProfile((prev) => ({ ...prev, ...patch }));
  }, [firebaseUser]);

  const isMaster = isMasterUid(firebaseUser?.uid);

  return (
    <UserContext.Provider value={{ profile, loading, isMaster, refresh, updateProfile, setProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
export default UserContext;
