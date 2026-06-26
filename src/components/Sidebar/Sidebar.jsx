import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useTeam } from "../../hooks/useTeam.js";
import { useAuth } from "../../hooks/useAuth.js";

const link = ({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link);

export default function Sidebar() {
  const { team, isAdmin, isMaster, isViewingOther, clearView } = useTeam();
  const { logout } = useAuth();
  return (
    <aside className={styles.side}>
      <nav className={styles.nav}>
        <NavLink to="/" end className={link}>Painel</NavLink>
        <NavLink to="/perfil" className={link}>Perfil</NavLink>
        {isMaster && <NavLink to="/grupos" className={link}>Grupos</NavLink>}
      </nav>

      {team && (
        <div className={styles.team}>
          <div className={styles.teamLabel}>{isViewingOther ? "Visualizando" : "Equipe"}</div>
          <div className={styles.teamName}>{team.name}</div>
          <div className={styles.code}>{team.code}{isAdmin ? " · admin" : ""}</div>
          {isViewingOther && (
            <button className={styles.back} onClick={clearView}>← meu grupo</button>
          )}
        </div>
      )}

      {isMaster && <div className={styles.badge}>conta mestre</div>}
      <button className={styles.logout} onClick={logout}>Sair</button>
    </aside>
  );
}
