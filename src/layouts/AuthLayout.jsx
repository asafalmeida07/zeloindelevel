import { Outlet, Link } from "react-router-dom";
import styles from "./AuthLayout.module.css";

export default function AuthLayout() {
  return (
    <div className={styles.wrap}>
      <div className={styles.panel}>
        <Link to="/" className={styles.brand}><span className={styles.dot} /> Apenas Continue</Link>
        <p className={styles.tagline}>Disciplina diária em fases de 43 dias.</p>
        <Outlet />
      </div>
    </div>
  );
}
