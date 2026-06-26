import styles from "./Loading.module.css";
export default function Loading({ label = "Carregando", full }) {
  return (
    <div className={[styles.wrap, full ? styles.full : ""].join(" ")}>
      <span className={styles.ring} aria-hidden />
      <span className={styles.label}>{label}…</span>
    </div>
  );
}
