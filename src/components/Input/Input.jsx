import styles from "./Input.module.css";

export default function Input({ label, hint, error, as = "input", ...rest }) {
  const Field = as;
  return (
    <label className={styles.wrap}>
      {label && <span className={styles.label}>{label}</span>}
      <Field className={[styles.field, error ? styles.invalid : ""].join(" ")} {...rest} />
      {error ? <span className={styles.error}>{error}</span> : hint ? <span className={styles.hint}>{hint}</span> : null}
    </label>
  );
}
