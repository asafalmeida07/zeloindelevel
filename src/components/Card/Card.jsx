import styles from "./Card.module.css";
export default function Card({ children, title, action, pad = true, className = "" }) {
  return (
    <section className={[styles.card, className].join(" ")}>
      {(title || action) && (
        <header className={styles.head}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {action}
        </header>
      )}
      <div className={pad ? styles.body : ""}>{children}</div>
    </section>
  );
}
