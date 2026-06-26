import styles from "./Button.module.css";

export default function Button({
  children, variant = "primary", size = "md", full, loading, disabled, type = "button", ...rest
}) {
  const cls = [styles.btn, styles[variant], styles[size], full ? styles.full : ""].join(" ");
  return (
    <button className={cls} type={type} disabled={disabled || loading} {...rest}>
      {loading ? <span className={styles.spin} aria-hidden /> : children}
    </button>
  );
}
