import styles from "./TaskCard.module.css";
import { POINTS_PER_TASK } from "../../utils/constants.js";

export default function TaskCard({ tasks, completed = [], editable, onToggle, readOnlyNote }) {
  const set = new Set(completed);
  return (
    <ul className={styles.list}>
      {tasks.map((t, i) => {
        const done = set.has(i);
        return (
          <li key={i} className={styles.row} style={{ opacity: editable || readOnlyNote ? 1 : 0.85 }}>
            <button
              className={[styles.check, done ? styles.on : ""].join(" ")}
              disabled={!editable}
              onClick={() => onToggle?.(i)}
              aria-label={done ? "Desmarcar" : "Concluir"}
              style={{ cursor: editable ? "pointer" : "default" }}
            >{done ? "✓" : ""}</button>
            <span className={[styles.text, done ? styles.textDone : ""].join(" ")}>{t}</span>
            <span className={styles.pts}>+{POINTS_PER_TASK}</span>
          </li>
        );
      })}
    </ul>
  );
}
