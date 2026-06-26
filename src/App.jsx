import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import { TeamProvider } from "./contexts/TeamContext.jsx";
import { PhaseProvider } from "./contexts/PhaseContext.jsx";
import { ToastProvider } from "./components/Toast/ToastContext.jsx";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import Loading from "./components/Loading/Loading.jsx";

import AppLayout from "./layouts/AppLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";

import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.jsx";
import TeamGate from "./pages/TeamGate/TeamGate.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import MasterPanel from "./pages/MasterPanel/MasterPanel.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";

import { useAuth } from "./hooks/useAuth.js";
import { useUser } from "./hooks/useUser.js";

// Redireciona usuários já autenticados para fora das telas de login.
function PublicOnly({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loading full label="Carregando" />;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

// Exige que o usuário pertença a uma equipe — exceto a conta mestre,
// que pode operar sem estar dentro de nenhum grupo.
function RequireTeam({ children }) {
  const { profile, loading, isMaster } = useUser();
  if (loading || !profile) return <Loading full label="Carregando" />;
  if (!profile.teamId && !isMaster) return <Navigate to="/equipe" replace />;
  return children;
}

// Só a conta mestre acessa o painel de grupos.
function RequireMaster({ children }) {
  const { loading, isMaster } = useUser();
  if (loading) return <Loading full label="Carregando" />;
  if (!isMaster) return <Navigate to="/" replace />;
  return children;
}

function GateTeam() {
  const { profile, loading } = useUser();
  if (loading || !profile) return <Loading full label="Carregando" />;
  if (profile.teamId) return <Navigate to="/" replace />;
  return <TeamGate />;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <UserProvider>
          <TeamProvider>
            <PhaseProvider>
              <BrowserRouter>
                <Routes>
                  <Route element={<AuthLayout />}>
                    <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
                    <Route path="/cadastro" element={<PublicOnly><Register /></PublicOnly>} />
                    <Route path="/recuperar" element={<PublicOnly><ForgotPassword /></PublicOnly>} />
                  </Route>

                  <Route path="/equipe" element={<ProtectedRoute><GateTeam /></ProtectedRoute>} />

                  <Route
                    element={
                      <ProtectedRoute>
                        <RequireTeam>
                          <AppLayout />
                        </RequireTeam>
                      </ProtectedRoute>
                    }
                  >
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/perfil" element={<Profile />} />
                    <Route path="/grupos" element={<RequireMaster><MasterPanel /></RequireMaster>} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </PhaseProvider>
          </TeamProvider>
        </UserProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
