import { useState } from "react";
import Card from "../../components/Card/Card.jsx";
import Avatar from "../../components/Avatar/Avatar.jsx";
import StarBadge from "../../components/StarBadge/StarBadge.jsx";
import Button from "../../components/Button/Button.jsx";
import ProfileEditor from "../../components/ProfileEditor/ProfileEditor.jsx";
import Loading from "../../components/Loading/Loading.jsx";
import { useUser } from "../../hooks/useUser.js";
import { useTeam } from "../../hooks/useTeam.js";
import { useAuth } from "../../hooks/useAuth.js";
import styles from "./Profile.module.css";

function StatBox({ label, value }) {
  return (
    <div className={styles.stat}>
      <div className={styles.statN}>{value}</div>
      <div className={styles.statL}>{label}</div>
    </div>
  );
}

export default function Profile() {
  const { profile } = useUser();
  const { team, isAdmin } = useTeam();
  const { logout } = useAuth();
  const [editing, setEditing] = useState(false);

  if (!profile) return <Loading full label="Carregando perfil" />;

  return (
    <div className={`fade-in ${styles.wrap}`}>
      <Card>
        <div className={styles.header}>
          <Avatar name={profile.name} photoURL={profile.photoURL} color={profile.color} size={76} ring />
          <div className={styles.idBlock}>
            <h1 className={styles.name}>{profile.name}</h1>
            <div className={styles.stars}><StarBadge count={profile.stars || 0} size={16} /></div>
            {profile.objective && <p className={styles.objective}>“{profile.objective}”</p>}
            {team && <p className={styles.team}>{team.name} · {team.code}{isAdmin ? " · admin" : ""}</p>}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>Editar</Button>
        </div>

        <div className={styles.grid}>
          <StatBox label="Nível" value={profile.level || 0} />
          <StatBox label="Estrelas" value={profile.stars || 0} />
          <StatBox label="Dias perfeitos" value={profile.perfectDays || 0} />
          <StatBox label="Maior sequência" value={profile.longestStreak || 0} />
          <StatBox label="Fases vencidas" value={profile.phasesWon || 0} />
        </div>
      </Card>

      <div className={styles.colorRow}>
        <span className={styles.colorLabel}>Cor</span>
        <span className={styles.colorChip} style={{ background: profile.color }} />
        <button className={styles.logout} onClick={logout}>Sair da conta</button>
      </div>

      {editing && <ProfileEditor onClose={() => setEditing(false)} />}
    </div>
  );
}
