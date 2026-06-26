import styles from "./StarBadge.module.css";
export default function StarBadge({ count = 0, size = 13 }) {
  if (!count) return null;
  if (count <= 3) {
    return <span className={styles.stars} style={{ fontSize: size }}>{"⭐".repeat(count)}</span>;
  }
  return <span className={styles.compact} style={{ fontSize: size }}>⭐<b>×{count}</b></span>;
}
