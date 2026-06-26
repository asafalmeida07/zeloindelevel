import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import Avatar from "../Avatar/Avatar.jsx";
import { useUser } from "../../hooks/useUser.js";
import { useTeam } from "../../hooks/useTeam.js";
import { usePhase } from "../../hooks/usePhase.js";
import { firstName } from "../../utils/format.js";

export default function Navbar() {
  const { profile, isMaster } = useUser();
  const { isViewingOther } = useTeam();
  const phase = usePhase();
  return (
    <header className={styles.bar}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <span className={styles.dot} /> Apenas Continue
        </Link>
        <div className={styles.right}>
          {isMaster && <Link to="/grupos" className={styles.master}>Grupos</Link>}
          {phase?.started && !isViewingOther && (
            <span className={styles.phase}>
              Fase {phase.curPhase + 1} · Dia {Math.max(phase.dipCurrent + 1, 1)}
            </span>
          )}
          <Link to="/perfil" className={styles.chip}>
            <Avatar name={profile?.name} photoURL={profile?.photoURL} color={profile?.color} size={28} />
            <span className={styles.chipName}>{firstName(profile?.name || "")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
