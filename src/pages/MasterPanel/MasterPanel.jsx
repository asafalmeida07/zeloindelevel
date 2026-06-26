import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card/Card.jsx";
import Button from "../../components/Button/Button.jsx";
import Input from "../../components/Input/Input.jsx";
import Loading from "../../components/Loading/Loading.jsx";
import { teamService } from "../../services/teamService.js";
import { useTeam } from "../../hooks/useTeam.js";
import { useToast } from "../../components/Toast/ToastContext.jsx";
import { getPhaseInfo } from "../../utils/phase.js";
import styles from "./MasterPanel.module.css";

export default function MasterPanel() {
  const { viewTeam } = useTeam();
  const toast = useToast();
  const nav = useNavigate();
  const [teams, setTeams] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    try { setTeams(await teamService.listAll()); }
    catch { toast?.push("Não foi possível carregar os grupos.", "error"); setTeams([]); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  function open(t) { viewTeam(t.id); nav("/"); }

  if (teams === null) return <Loading full label="Carregando grupos" />;

  return (
    <div className={`fade-in container ${styles.wrap}`}>
      <div className={styles.head}>
        <div>
          <h1 className={styles.h1}>Todos os grupos</h1>
          <p className={styles.sub}>{teams.length} grupo(s) · conta mestre</p>
        </div>
      </div>

      {teams.length === 0 ? (
        <Card><p className={styles.dim}>Nenhum grupo criado ainda.</p></Card>
      ) : (
        <div className={styles.grid}>
          {teams.map((t) => {
            const info = t.anchorDate ? getPhaseInfo(t.anchorDate) : { started: false };
            return (
              <Card key={t.id}>
                <div className={styles.row}>
                  <div className={styles.id}>
                    <h2 className={styles.name}>{t.name}</h2>
                    <span className={styles.code}>{t.code}</span>
                  </div>
                  <div className={styles.metaRow}>
                    <Meta n={(t.memberUids || []).length} l="membros" />
                    <Meta n={info.started ? info.phaseNumber : "—"} l="fase" />
                    <Meta n={info.started ? info.dayNumber : "—"} l="dia" />
                  </div>
                  <div className={styles.actions}>
                    <Button size="sm" onClick={() => open(t)}>Abrir</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(t)}>Editar</Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {editing && (
        <TeamEditor team={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
      )}
    </div>
  );
}

function Meta({ n, l }) {
  return <div className={styles.meta}><div className={styles.metaN}>{n}</div><div className={styles.metaL}>{l}</div></div>;
}

function TeamEditor({ team, onClose, onSaved }) {
  const toast = useToast();
  const [name, setName] = useState(team.name || "");
  const [anchor, setAnchor] = useState(team.anchorDate || "");
  const [tasks, setTasks] = useState(() => [...(team.tasks || [])]);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await teamService.update(team.id, {
        name: name.trim(),
        anchorDate: anchor,
        tasks: tasks.map((x) => x.trim()).filter(Boolean),
      });
      toast?.push("Grupo atualizado.", "success");
      onSaved();
    } catch {
      toast?.push("Erro ao salvar (verifique as permissões de mestre).", "error");
    } finally { setSaving(false); }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Editar grupo · {team.code}</h2>
        <div className={styles.fields}>
          <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
          <Input label="Início da Fase 1" type="date" value={anchor} onChange={(e) => setAnchor(e.target.value)} />
          <div>
            <span className={styles.label}>Tarefas diárias</span>
            <div className={styles.tasks}>
              {tasks.map((t, i) => (
                <div key={i} className={styles.taskRow}>
                  <span className={styles.tNum}>{i + 1}</span>
                  <input className={styles.tInput} value={t} maxLength={70}
                    onChange={(e) => setTasks((p) => p.map((x, j) => (j === i ? e.target.value : x)))} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.modalActions}>
          <Button variant="subtle" onClick={onClose}>Cancelar</Button>
          <Button onClick={save} loading={saving} disabled={!name.trim() || !anchor}>Salvar</Button>
        </div>
      </div>
    </div>
  );
}
