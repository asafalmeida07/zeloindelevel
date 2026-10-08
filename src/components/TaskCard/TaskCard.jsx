import { useState } from "react";
import styles from "./TaskCard.module.css";
import { POINTS_PER_TASK, DEFAULT_TASKS } from "../../utils/constants.js";

export default function TaskCard({ cycle, editable, onToggleTask, onToggleSubtask, onAddEmergent, onToggleEmergent }) {
  const [newEmergent, setNewEmergent] = useState("");

  if (!cycle || !cycle.tasks) return null;

  return (
    <div className={styles.cycleCard}>
      {DEFAULT_TASKS.map((tName, i) => {
        const tData = cycle.tasks[tName] || { done: false, text: "" };
        const isDone = tData.done;

        if (tName === "Leitura Bíblica" && tData.subtasks) {
          const allSubsDone = Object.values(tData.subtasks).every(s => s.done);
          return (
            <div key={i} className={styles.taskBlock}>
              <div className={styles.taskHeader}>
                <button
                  className={[styles.check, allSubsDone ? styles.on : ""].join(" ")}
                  disabled={!editable}
                  onClick={() => onToggleTask(tName)}
                >{allSubsDone ? "✓" : ""}</button>
                <span className={[styles.text, allSubsDone ? styles.textDone : ""].join(" ")}>{tName}</span>
              </div>
              <ul className={styles.subtasks}>
                {Object.keys(tData.subtasks).map(subKey => {
                  const sub = tData.subtasks[subKey];
                  return (
                    <li key={subKey} className={styles.subtaskRow}>
                      <button
                        className={[styles.subCheck, sub.done ? styles.on : ""].join(" ")}
                        disabled={!editable}
                        onClick={() => onToggleSubtask(tName, subKey)}
                      >{sub.done ? "✓" : ""}</button>
                      <span><b>{subKey}:</b> {sub.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        }

        return (
          <div key={i} className={styles.taskBlock}>
            <div className={styles.taskHeader}>
              <button
                className={[styles.check, isDone ? styles.on : ""].join(" ")}
                disabled={!editable}
                onClick={() => onToggleTask(tName)}
              >{isDone ? "✓" : ""}</button>
              <span className={[styles.text, isDone ? styles.textDone : ""].join(" ")}>{tName}</span>
            </div>
            {tData.text && <div className={styles.taskDesc}>{tData.text}</div>}
          </div>
        );
      })}

      <div className={styles.emergents}>
        <h4>Tarefas Emergentes</h4>
        <ul>
          {(cycle.emergentes || []).map((em, emIdx) => (
            <li key={em.id} className={styles.subtaskRow}>
              <button
                className={[styles.subCheck, em.done ? styles.on : ""].join(" ")}
                disabled={!editable}
                onClick={() => onToggleEmergent(em.id)}
              >{em.done ? "✓" : ""}</button>
              <span>{em.text}</span>
            </li>
          ))}
        </ul>
        {editable && (
          <div className={styles.addEmergent}>
            <input
              type="text"
              value={newEmergent}
              onChange={e => setNewEmergent(e.target.value)}
              placeholder="Adicionar tarefa extra..."
              className={styles.textareaSmall}
              style={{height: '32px'}}
            />
            <button
              onClick={() => {
                if (newEmergent.trim()) {
                  onAddEmergent(newEmergent.trim());
                  setNewEmergent("");
                }
              }}
              className={styles.todayBtn}
              style={{marginLeft: '10px'}}
            >Adicionar</button>
          </div>
        )}
      </div>
    </div>
  );
}
