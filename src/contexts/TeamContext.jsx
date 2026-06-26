import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { teamService } from "../services/teamService.js";
import { useUserContext } from "./UserContext.jsx";

const TeamContext = createContext(null);

export function TeamProvider({ children }) {
  const { profile, updateProfile, isMaster } = useUserContext();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  // Grupo "ativo": normalmente o do próprio usuário, mas a conta mestre
  // pode apontar para qualquer grupo via viewTeam().
  const [activeTeamId, setActiveTeamId] = useState(null);
  const [override, setOverride] = useState(false); // mestre escolheu manualmente

  // Mantém o grupo ativo sincronizado com o do perfil, salvo override do mestre.
  useEffect(() => {
    if (!override) setActiveTeamId(profile?.teamId || null);
  }, [profile?.teamId, override]);

  const load = useCallback(async (teamId) => {
    if (!teamId) { setTeam(null); setLoading(false); return; }
    setLoading(true);
    setTeam(await teamService.get(teamId));
    setLoading(false);
  }, []);

  useEffect(() => { load(activeTeamId); }, [activeTeamId, load]);

  const refreshTeam = useCallback(async () => {
    if (activeTeamId) setTeam(await teamService.get(activeTeamId));
  }, [activeTeamId]);

  // Conta mestre: passa a visualizar qualquer grupo.
  const viewTeam = useCallback((teamId) => {
    setOverride(true);
    setActiveTeamId(teamId);
  }, []);

  // Volta ao grupo do próprio perfil.
  const clearView = useCallback(() => {
    setOverride(false);
    setActiveTeamId(profile?.teamId || null);
  }, [profile?.teamId]);

  const createTeam = useCallback(async ({ name, anchorDate, tasks }) => {
    const created = await teamService.create({ name, adminUid: profile.uid, anchorDate, tasks });
    // O mestre pode criar grupos sem "entrar" neles; usuários comuns entram.
    if (!isMaster || !profile?.teamId) await updateProfile({ teamId: created.id });
    setOverride(true);
    setActiveTeamId(created.id);
    setTeam(created);
    return created;
  }, [profile, updateProfile, isMaster]);

  const joinTeam = useCallback(async (code) => {
    const found = await teamService.findByCode(code);
    if (!found) throw new Error("Código de equipe não encontrado.");
    await teamService.join(found.id, profile.uid);
    await updateProfile({ teamId: found.id });
    setOverride(false);
    setActiveTeamId(found.id);
    setTeam(found);
    return found;
  }, [profile, updateProfile]);

  const isMemberOfActive = !!team && !!profile && (team.memberUids || []).includes(profile.uid);
  const isAdmin = !!team && !!profile && (team.adminUid === profile.uid || isMaster);
  const isViewingOther = override && team && team.id !== profile?.teamId;

  return (
    <TeamContext.Provider
      value={{
        team, loading, isAdmin, isMaster, isMemberOfActive, isViewingOther,
        refreshTeam, createTeam, joinTeam, viewTeam, clearView,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export const useTeamContext = () => useContext(TeamContext);
export default TeamContext;
