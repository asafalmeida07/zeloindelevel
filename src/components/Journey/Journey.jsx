import styles from "./Journey.module.css";
import { PHASE_DAYS, TASKS_PER_DAY } from "../../utils/constants.js";
import { phaseRange } from "../../utils/phase.js";
import { fmtShort } from "../../utils/format.js";

export default function Journey({
  anchorDate, progressMap, curPhase, dipCurrent, viewedPhase, setViewedPhase,
  selectedDay, onSelect, stats, isCurrentView,
}) {
  const bigDay = isCurrentView ? Math.min(dipCurrent + 1, PHASE_DAYS) : PHASE_DAYS;
  const pct = Math.round((bigDay / PHASE_DAYS) * 100);
  const range = phaseRange(anchorDate, viewedPhase);

  return (
    <div className={styles.wrap}>
      <div className={styles.nav}>
        <button className={styles.navBtn} disabled={viewedPhase <= 0} onClick={() => setViewedPhase(viewedPhase - 1)} aria-label="Fase anterior">‹</button>
        <div className={styles.navMid}>
          <div className={styles.phaseLabel}>FASE {viewedPhase + 1}</div>
          <div className={styles.range}>{fmtShort(range.start)} – {fmtShort(range.end)}</div>
        </div>
        <button className={styles.navBtn} disabled={viewedPhase >= curPhase} onClick={() => setViewedPhase(viewedPhase + 1)} aria-label="Próxima fase">›</button>
      </div>

      <div className={styles.top}>
        <div>
          <div className={styles.day}>
            <span className={styles.dayBig}>{bigDay}</span><span className={styles.dayTot}>/ {PHASE_DAYS}</span>
          </div>
          <div className={styles.dayLabel}>{isCurrentView ? "dia da fase" : "fase concluída"}</div>
        </div>
        <div className={styles.stats}>
          <Stat n={stats.points} l="pontos" />
          <Stat n={stats.perfectDays} l="dias 14/14" />
          <Stat n={stats.streak} l="sequência" hot={stats.streak > 1} />
        </div>
      </div>

      <div className={styles.track}><div className={styles.fill} style={{ width: `${pct}%` }} /></div>

      <div className={styles.grid}>
        {Array.from({ length: PHASE_DAYS }).map((_, d) => {
          const count = progressMap[d]?.count || 0;
          const ratio = count / TASKS_PER_DAY;
          const isToday = isCurrentView && d === dipCurrent;
          const isFuture = isCurrentView ? d > dipCurrent : false;
          const isSel = d === selectedDay;
          const perfect = count >= TASKS_PER_DAY;
          let bg = "transparent", border = "1px dashed var(--line)", color = "var(--text-faint)";
          if (!isFuture) {
            if (count === 0) { bg = "var(--surface-2)"; border = "1px solid var(--line)"; }
            else { bg = `rgba(110,86,248,${0.22 + ratio * 0.78})`; border = "1px solid transparent"; color = ratio > 0.5 ? "#fff" : "var(--text)"; }
          }
          return (
            <button key={d} className={styles.cell} disabled={isFuture}
              onClick={() => !isFuture && onSelect(d)} title={`Dia ${d + 1} — ${count}/${TASKS_PER_DAY}`}
              style={{ background: bg, border, color, fontWeight: perfect ? 700 : 500,
                cursor: isFuture ? "default" : "pointer",
                boxShadow: isSel ? "0 0 0 2px var(--accent-2)" : isToday ? "0 0 0 2px #fff" : "none" }}>
              {d + 1}
            </button>
          );
        })}
      </div>
      <div className={styles.hint}>toque num dia para ver ou ajustar · ‹ › alterna entre fases</div>
    </div>
  );
}

function Stat({ n, l, hot }) {
  return (
    <div className={styles.stat}>
      <div className={styles.statN} style={{ color: hot ? "var(--accent-2)" : "#fff" }}>{n}</div>
      <div className={styles.statL}>{l}</div>
    </div>
  );
}
