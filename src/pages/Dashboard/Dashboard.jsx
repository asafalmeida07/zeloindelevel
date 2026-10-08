import { useState, useEffect } from "react";
import Card from "../../components/Card/Card.jsx";
import TaskCard from "../../components/TaskCard/TaskCard.jsx";
import Leaderboard from "../../components/Leaderboard/Leaderboard.jsx";
import Avatar from "../../components/Avatar/Avatar.jsx";
import Loading from "../../components/Loading/Loading.jsx";
import { usePhase } from "../../hooks/usePhase.js";
import { useUser } from "../../hooks/useUser.js";
import { useTeam } from "../../hooks/useTeam.js";
import { TASKS_PER_DAY } from "../../utils/constants.js";
import { fmtDate, firstName, timeAgo } from "../../utils/format.js";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { profile } = useUser();
  const { team } = useTeam();
  const phase = usePhase();

  if (!team || !phase) return <Loading full label="Carregando painel" />;

  if (!phase.started) {
    return (
      <div className="fade-in">
        <Card title="A fase ainda não começou">
          <p className={styles.dim}>A Fase 1 começa em {team.anchorDate}.</p>
        </Card>
      </div>
    );
  }

  const { info, currentCycle } = phase;

  return (
    <div className={`fade-in ${styles.grid}`}>
      <div className={styles.left}>
        <div style={{marginBottom: "20px", fontSize: "0.9rem", color: "var(--text-dim)"}}>
          Dia {info.diaDoMapa} do MAPA &middot; Fase {info.phaseNumber} &middot; Etapa {info.etapaNumber} &middot; Nível {profile?.perfectDays || 0}
        </div>

        {currentCycle ? (
          <Card title={`Ciclo Atual: ${currentCycle.cycleNumber}`}>
            <TaskCard 
              cycle={currentCycle} 
              editable={true}
              onToggleTask={(tName) => phase.toggleTask(currentCycle.cycleNumber, tName)}
              onToggleSubtask={(tName, subKey) => phase.toggleTask(currentCycle.cycleNumber, tName, subKey)}
              onAddEmergent={(text) => phase.addEmergent(currentCycle.cycleNumber, text)}
              onToggleEmergent={(id) => phase.toggleEmergent(currentCycle.cycleNumber, id)}
            />
            <div style={{marginTop: '20px'}}>
              <button className={styles.todayBtn} style={{width: '100%', height: '48px', fontSize: '1.1rem'}} onClick={() => phase.concludeCycle(currentCycle.cycleNumber)}>Concluir Ciclo</button>
            </div>
          </Card>
        ) : (
          <Card title="Planejamento Pendente">
            <p>Você precisa gerar o seu Plano Estratégico para esta fase.</p>
            <a href="/plano" className={styles.todayBtn} style={{textDecoration: 'none', display: 'inline-block', marginTop: '10px'}}>Criar Plano</a>
          </Card>
        )}
      </div>

      <div className={styles.right}>
        <Card title={`Ranking · Fase ${phase.viewedPhase + 1}`}>
          <Leaderboard rows={phase.ranking} meUid={profile?.uid} />
        </Card>
      </div>
    </div>
  );
}
