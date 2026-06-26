import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = authService.observe((u) => {
      setFirebaseUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = {
    firebaseUser,
    loading,
    isAuthenticated: !!firebaseUser,
    register: authService.register,
    login: authService.login,
    logout: authService.logout,
    resetPassword: authService.resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
export default AuthContext;
