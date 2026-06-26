import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { getPhaseInfo } from "../utils/phase.js";
import { TASKS_PER_DAY } from "../utils/constants.js";
import { progressService } from "../services/progressService.js";
import { rankingService, aggregateFromProgress } from "../services/rankingService.js";
import { feedService } from "../services/feedService.js";
import { championService } from "../services/championService.js";
import { userService } from "../services/userService.js";
import { useTeamContext } from "./TeamContext.jsx";
import { useUserContext } from "./UserContext.jsx";

const PhaseContext = createContext(null);

export function PhaseProvider({ children }) {
  const { team, isMemberOfActive } = useTeamContext();
  const { profile, refresh: refreshUser } = useUserContext();

  const info = team?.anchorDate ? getPhaseInfo(team.anchorDate) : { started: false };
  const curPhase = info.started ? info.phaseIndex : 0;
  const dipCurrent = info.started ? info.dayInPhase : -1;

  const [viewedPhase, setViewedPhase] = useState(0);
  const [progressMap, setProgressMap] = useState({});
  const [ranking, setRanking] = useState([]);
  const [feed, setFeed] = useState([]);
  const finalized = useRef(false);

  const isCurrentView = viewedPhase === curPhase;
  const throughDay = isCurrentView ? dipCurrent : null;

  useEffect(() => { if (info.started) setViewedPhase(curPhase); }, [info.started, curPhase]);

  // carrega progresso do usuário para a fase visualizada
  const loadProgress = useCallback(async () => {
    if (!team || !profile) return;
    setProgressMap(await progressService.getPhase(team.id, profile.uid, viewedPhase));
  }, [team, profile, viewedPhase]);

  // carrega ranking + feed compartilhados
  const loadShared = useCallback(async () => {
    if (!team) return;
    setRanking(await rankingService.getPhaseRanking(team.id, viewedPhase));
    setFeed(await feedService.getPhaseFeed(team.id, viewedPhase));
  }, [team, viewedPhase]);

  useEffect(() => { loadProgress(); }, [loadProgress]);
  useEffect(() => { loadShared(); }, [loadShared]);

  // atualização periódica do ranking/feed
  useEffect(() => {
    if (!team) return;
    const t = setInterval(loadShared, 8000);
    return () => clearInterval(t);
  }, [team, loadShared]);

  // finaliza fase anterior (campeão + estrela) uma vez por sessão
  useEffect(() => {
    if (!team || !info.started || curPhase < 1 || finalized.current) return;
    finalized.current = true;
    championService.finalizeIfNeeded(team.id, curPhase - 1).then(() => {
      refreshUser?.();
      loadShared();
    });
  }, [team, info.started, curPhase, refreshUser, loadShared]);

  // alterna uma tarefa em um dia (somente fase atual, até o dia de hoje)
  const toggleTask = useCallback(async (dayInPhase, taskIndex) => {
    if (!team || !profile) return;
    if (!isMemberOfActive) return; // mestre visualizando outro grupo não marca tarefas
    if (!isCurrentView || dayInPhase < 0 || dayInPhase > dipCurrent) return;

    const dayDoc = progressMap[dayInPhase];
    const completed = dayDoc?.completed ? [...dayDoc.completed] : [];
    const wasPerfect = completed.length >= TASKS_PER_DAY;
    const next = completed.includes(taskIndex)
      ? completed.filter((i) => i !== taskIndex)
      : [...completed, taskIndex];

    const saved = await progressService.setDay(
      team.id, profile.uid, viewedPhase, dayInPhase, next, dayDoc?.leveled
    );
    const nextMap = { ...progressMap, [dayInPhase]: saved };
    setProgressMap(nextMap);

    const agg = aggregateFromProgress(nextMap, dipCurrent);
    await rankingService.upsert(team.id, viewedPhase, profile, agg);

    const nowPerfect = next.length >= TASKS_PER_DAY;
    if (nowPerfect && !wasPerfect) {
      await feedService.publishPerfectDay(team.id, viewedPhase, profile, dayInPhase + 1);
      // concede nível apenas se este dia ainda não havia nivelado
      if (!dayDoc?.leveled) {
        await userService.grantPerfectDay(profile.uid, { newLongestStreak: Math.max(profile.longestStreak || 0, agg.streak) });
        refreshUser?.();
      }
    }
    loadShared();
  }, [team, profile, isMemberOfActive, isCurrentView, dipCurrent, progressMap, viewedPhase, refreshUser, loadShared]);

  const myAgg = aggregateFromProgress(progressMap, isCurrentView ? dipCurrent : null);

  const value = {
    info,
    started: info.started,
    curPhase,
    dipCurrent,
    viewedPhase,
    setViewedPhase,
    isCurrentView,
    tasks: team?.tasks || [],
    progressMap,
    ranking,
    feed,
    myAgg,
    toggleTask,
    refreshShared: loadShared,
  };

  return <PhaseContext.Provider value={value}>{children}</PhaseContext.Provider>;
}

export const usePhaseContext = () => useContext(PhaseContext);
export default PhaseContext;
