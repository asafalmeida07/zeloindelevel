import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import Avatar from "../Avatar/Avatar.jsx";
import { useUser } from "../../hooks/useUser.js";
import { usePhase } from "../../hooks/usePhase.js";
import { firstName } from "../../utils/format.js";

export default function Navbar() {
  const { profile } = useUser();
  const phase = usePhase();
  return (
    <header className={styles.bar}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <span className={styles.dot} /> Apenas Continue
        </Link>
        <div className={styles.right}>
          {phase?.started && (
            <span className={styles.phase}>
              Dia {phase.info.diaDoMapa} do MAPA • Fase {phase.info.phaseNumber} • Etapa {phase.info.etapaNumber} � Ciclo {profile.perfectDays + 1}
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
