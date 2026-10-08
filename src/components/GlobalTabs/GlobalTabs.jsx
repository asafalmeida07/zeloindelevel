import { NavLink, useLocation } from "react-router-dom";
import { useGestorAuth } from "../../hooks/useGestorAuth.js";
import styles from "./GlobalTabs.module.css";

export default function GlobalTabs() {
  const { isGestor, loading } = useGestorAuth();
  const location = useLocation();

  const isApp = location.pathname === '/apenas-continue' || location.pathname.startsWith('/perfil') || location.pathname.startsWith('/plano');

  return (
    <div className={styles.wrapper}>
      <nav className={styles.tabs}>
        <NavLink 
          to="/apenas-continue" 
          className={[styles.tab, isApp ? styles.active : ""].join(" ")}
        >
          <span className={styles.label}>Apenas Continue</span>
        </NavLink>
        <NavLink 
          to="/feed" 
          className={({ isActive }) => [styles.tab, isActive ? styles.active : ""].join(" ")}
        >
          <span className={styles.label}>Feed</span>
        </NavLink>
        
        {!loading && isGestor && (
          <NavLink 
            to="/gestor" 
            className={({ isActive }) => [styles.tab, isActive || location.pathname.startsWith('/gestor') ? styles.active : ""].join(" ")}
          >
            <span className={styles.label}>Gestor</span>
          </NavLink>
        )}
      </nav>
    </div>
  );
}
