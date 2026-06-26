import styles from "./Leaderboard.module.css";
import Avatar from "../Avatar/Avatar.jsx";
import StarBadge from "../StarBadge/StarBadge.jsx";

const MEDAL = ["#F2C14E", "#C7CDD6", "#CD8B5B"];

export default function Leaderboard({ rows = [], meUid }) {
  if (!rows.length) return <p className={styles.empty}>Ninguém pontuou ainda nesta fase.</p>;
  return (
    <ul className={styles.list}>
      {rows.map((p, i) => (
        <li key={p.uid} className={[styles.row, p.uid === meUid ? styles.me : ""].join(" ")}>
          <span className={styles.rank} style={{ color: MEDAL[i] || "var(--text-faint)" }}>{i + 1}</span>
          <Avatar name={p.name} photoURL={p.photoURL} color={p.color} size={32} />
          <div className={styles.id}>
            <span className={styles.name}>
              {p.name}{p.uid === meUid && <em className={styles.you}> · você</em>}
            </span>
            <span className={styles.meta}>
              Nível {p.level || 0} <StarBadge count={p.stars || 0} size={11} />
            </span>
          </div>
          {p.streak > 1 && <span className={styles.streak}>🔥{p.streak}</span>}
          {p.perfectDays > 0 && <span className={styles.perfect}>✓{p.perfectDays}</span>}
          <span className={styles.pts}>{p.points}</span>
        </li>
      ))}
    </ul>
  );
}
