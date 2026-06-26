import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card/Card.jsx";
import Journey from "../../components/Journey/Journey.jsx";
import TaskCard from "../../components/TaskCard/TaskCard.jsx";
import Leaderboard from "../../components/Leaderboard/Leaderboard.jsx";
import Avatar from "../../components/Avatar/Avatar.jsx";
import Loading from "../../components/Loading/Loading.jsx";
import { usePhase } from "../../hooks/usePhase.js";
import { useUser } from "../../hooks/useUser.js";
import { useTeam } from "../../hooks/useTeam.js";
import { TASKS_PER_DAY } from "../../utils/constants.js";
import { dateForAbs } from "../../utils/phase.js";
import { fmtDate, firstName, timeAgo } from "../../utils/format.js";
import { PHASE_DAYS as PD } from "../../utils/constants.js";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { profile, isMaster } = useUser();
  const { team, isMemberOfActive, isViewingOther } = useTeam();
  const phase = usePhase();
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    if (!phase?.started) return;
    setSelectedDay(phase.isCurrentView ? Math.max(phase.dipCurrent, 0) : 0);
  }, [phase?.started, phase?.isCurrentView, phase?.dipCurrent, phase?.viewedPhase]);

  // Conta mestre sem grupo ativo: oferece o painel de grupos.
  if (!team && isMaster) {
    return (
      <div className="fade-in">
        <Card title="Conta mestre">
          <p className={styles.dim}>Você não está visualizando nenhum grupo. Abra o painel para escolher.</p>
          <div style={{ marginTop: 14 }}>
            <Link to="/grupos" className={styles.cta}>Ver todos os grupos →</Link>
          </div>
        </Card>
      </div>
    );
  }

  if (!team || !phase) return <Loading full label="Carregando painel" />;

  if (!phase.started) {
    return (
      <div className="fade-in">
        <Card title="A fase ainda não começou">
          <p className={styles.dim}>A Fase 1 desta equipe começa em {team.anchorDate}. Assim que iniciar, suas 14 tarefas diárias aparecem aqui.</p>
        </Card>
      </div>
    );
  }

  const base = phase.viewedPhase * PD;
  const dayDoc = phase.progressMap[selectedDay];
  const completed = dayDoc?.completed || [];
  const selDate = dateForAbs(team.anchorDate, base + selectedDay);
  const editable = phase.isCurrentView && selectedDay <= phase.dipCurrent && isMemberOfActive;
  const isToday = phase.isCurrentView && selectedDay === phase.dipCurrent;
  const dayCount = completed.length;

  return (
    <div className={`fade-in ${styles.grid}`}>
      <div className={styles.left}>
        <Journey
          anchorDate={team.anchorDate}
          progressMap={phase.progressMap}
          curPhase={phase.curPhase}
          dipCurrent={phase.dipCurrent}
          viewedPhase={phase.viewedPhase}
          setViewedPhase={phase.setViewedPhase}
          selectedDay={selectedDay}
          onSelect={setSelectedDay}
          stats={phase.myAgg}
          isCurrentView={phase.isCurrentView}
        />

        <Card
          title={isToday ? "Hoje" : `Dia ${selectedDay + 1}`}
          action={
            <span className={styles.dayMeta}>
              Fase {phase.viewedPhase + 1} · {fmtDate(selDate)} · {dayCount}/{TASKS_PER_DAY}
              {!isToday && phase.isCurrentView && (
                <button className={styles.todayBtn} onClick={() => setSelectedDay(phase.dipCurrent)}>ir pra hoje</button>
              )}
            </span>
          }
        >
          {!phase.isCurrentView && <div className={styles.ro}>Fase concluída · somente leitura</div>}
          {phase.isCurrentView && isViewingOther && (
            <div className={styles.ro}>Visualizando como mestre · somente leitura</div>
          )}
          <TaskCard
            tasks={phase.tasks}
            completed={completed}
            editable={editable}
            readOnlyNote={!phase.isCurrentView}
            onToggle={(taskIdx) => phase.toggleTask(selectedDay, taskIdx)}
          />
          {editable && dayCount >= TASKS_PER_DAY && (
            <div className={styles.closed}>Dia fechado, {firstName(profile?.name || "")}. Apenas continue.</div>
          )}
        </Card>
      </div>

      <div className={styles.right}>
        <Card title={`Ranking · Fase ${phase.viewedPhase + 1}`}>
          <Leaderboard rows={phase.ranking} meUid={profile?.uid} />
          <div className={styles.foot}>pontos = tarefas × 3 · ✓ dias 14/14 · 🔥 sequência</div>
        </Card>

        <Card title="Feed">
          {phase.feed.length === 0 ? (
            <p className={styles.dim}>Quando alguém conclui um dia perfeito (14/14), aparece aqui.</p>
          ) : (
            <ul className={styles.feed}>
              {phase.feed.map((ev) => (
                <li key={ev.id} className={styles.feedRow}>
                  <Avatar name={ev.name} photoURL={ev.photoURL} color={ev.color} size={26} />
                  <span className={styles.feedTxt}><b>{ev.name}</b> concluiu o Dia {ev.day}</span>
                  <span className={styles.feedAgo}>{timeAgo(ev.ts)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
