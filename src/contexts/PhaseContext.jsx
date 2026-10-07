import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { getPhaseInfo } from "../utils/phase.js";
import { TASKS_PER_DAY } from "../utils/constants.js";
import { cycleService } from "../services/cycleService.js";
import { rankingService } from "../services/rankingService.js";
import { feedService } from "../services/feedService.js";
import { championService } from "../services/championService.js";
import { userService } from "../services/userService.js";
import { useTeamContext } from "./TeamContext.jsx";
import { useUserContext } from "./UserContext.jsx";

const PhaseContext = createContext(null);

export function PhaseProvider({ children }) {
  const { team } = useTeamContext();
  const { profile, refresh: refreshUser } = useUserContext();

  const info = team?.anchorDate ? getPhaseInfo(team.anchorDate) : { started: false };
  const curPhase = info.started ? info.phaseIndex : 0;

  const [viewedPhase, setViewedPhase] = useState(0);
  const [cycles, setCycles] = useState([]);
  const [pendingCycles, setPendingCycles] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [feed, setFeed] = useState([]);
  const finalized = useRef(false);

  const isCurrentView = viewedPhase === curPhase;
  const currentCycle = isCurrentView && pendingCycles.length > 0 ? pendingCycles[0] : null;

  useEffect(() => { if (info.started) setViewedPhase(curPhase); }, [info.started, curPhase]);

  const loadCycles = useCallback(async () => {
    if (!team || !profile) return;
    const loaded = await cycleService.getPhaseCycles(team.id, profile.uid, viewedPhase);
    setCycles(loaded);
    
    if (isCurrentView) {
      const pending = await cycleService.getPendingCycles(team.id, profile.uid);
      setPendingCycles(pending);
    }
  }, [team, profile, viewedPhase, isCurrentView]);

  const loadShared = useCallback(async () => {
    if (!team) return;
    setRanking(await rankingService.getPhaseRanking(team.id, viewedPhase));
    setFeed(await feedService.getPhaseFeed(team.id, viewedPhase));
  }, [team, viewedPhase]);

  useEffect(() => { loadCycles(); }, [loadCycles]);
  useEffect(() => { loadShared(); }, [loadShared]);

  useEffect(() => {
    if (!team) return;
    const t = setInterval(loadShared, 8000);
    return () => clearInterval(t);
  }, [team, loadShared]);

  useEffect(() => {
    if (!team || !info.started || curPhase < 1 || finalized.current) return;
    finalized.current = true;
    championService.finalizeIfNeeded(team.id, curPhase - 1).then(() => {
      refreshUser?.();
      loadShared();
    });
  }, [team, info.started, curPhase, refreshUser, loadShared]);

  const toggleTask = useCallback(async (cycleNum, tName, subKey) => {
    if (!team || !profile || !currentCycle || currentCycle.cycleNumber !== cycleNum) return;
    const tData = currentCycle.tasks[tName] || { done: false, text: "" };
    
    let updates;
    if (subKey && tData.subtasks) {
      const sub = tData.subtasks[subKey];
      updates = { [`tasks.${tName}.subtasks.${subKey}.done`]: !sub.done };
    } else {
      updates = { [`tasks.${tName}.done`]: !tData.done };
    }
    await cycleService.updateCycle(team.id, profile.uid, cycleNum, updates);
    loadCycles();
  }, [team, profile, currentCycle, loadCycles]);

  const addEmergent = useCallback(async (cycleNum, text) => {
    if (!team || !profile || !currentCycle || currentCycle.cycleNumber !== cycleNum) return;
    const emergentes = currentCycle.emergentes || [];
    const novo = { id: Date.now(), text, done: false };
    await cycleService.updateCycle(team.id, profile.uid, cycleNum, { emergentes: [...emergentes, novo] });
    loadCycles();
  }, [team, profile, currentCycle, loadCycles]);

  const toggleEmergent = useCallback(async (cycleNum, id) => {
    if (!team || !profile || !currentCycle || currentCycle.cycleNumber !== cycleNum) return;
    const emergentes = (currentCycle.emergentes || []).map(em => em.id === id ? { ...em, done: !em.done } : em);
    await cycleService.updateCycle(team.id, profile.uid, cycleNum, { emergentes });
    loadCycles();
  }, [team, profile, currentCycle, loadCycles]);

  const concludeCycle = useCallback(async (cycleNum) => {
    if (!team || !profile || !currentCycle || currentCycle.cycleNumber !== cycleNum) return;
    
    // Check if everything is done
    const allTasksDone = Object.values(currentCycle.tasks).every(t => {
      if (t.subtasks) return Object.values(t.subtasks).every(s => s.done);
      return t.done;
    });
    const allEmergentsDone = (currentCycle.emergentes || []).every(em => em.done);

    if (!allTasksDone || !allEmergentsDone) {
      alert("Conclua todas as tarefas programadas e emergentes primeiro!");
      return;
    }

    await cycleService.updateCycle(team.id, profile.uid, cycleNum, { status: 'concluido', completedAt: Date.now() });
    
    // Increase level
    const newLevel = (profile.perfectDays || 0) + 1;
    await userService.grantPerfectDay(profile.uid, { newLongestStreak: newLevel });
    await feedService.publishPerfectDay(team.id, viewedPhase, profile, cycleNum);
    
    refreshUser?.();
    loadCycles();
    loadShared();
  }, [team, profile, currentCycle, loadCycles, loadShared, viewedPhase, refreshUser]);

  const value = {
    info, started: info.started, curPhase, viewedPhase, setViewedPhase, isCurrentView,
    tasks: team?.tasks || [],
    cycles, currentCycle, ranking, feed, myAgg: { points: 0, perfectDays: 0, streak: 0 },
    toggleTask, addEmergent, toggleEmergent, concludeCycle,
    refreshShared: loadShared, reloadCycles: loadCycles
  };

  return <PhaseContext.Provider value={value}>{children}</PhaseContext.Provider>;
}

export const usePhaseContext = () => useContext(PhaseContext);
export default PhaseContext;
