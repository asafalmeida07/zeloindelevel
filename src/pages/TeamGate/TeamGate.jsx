import { useState } from "react";
import Card from "../../components/Card/Card.jsx";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";
import { useTeam } from "../../hooks/useTeam.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useToast } from "../../components/Toast/ToastContext.jsx";
import { DEFAULT_TASKS } from "../../utils/constants.js";
import { todayYMD } from "../../utils/format.js";
import styles from "./TeamGate.module.css";

export default function TeamGate() {
  const { createTeam, joinTeam } = useTeam();
  const { logout } = useAuth();
  const toast = useToast();
  const [mode, setMode] = useState("join");
  const [busy, setBusy] = useState(false);

  // join
  const [code, setCode] = useState("");
  // create
  const [name, setName] = useState("");
  const [anchor, setAnchor] = useState("2026-02-17");
  const [tasks, setTasks] = useState(() => [...DEFAULT_TASKS]);

  const filled = tasks.map((t) => t.trim()).filter(Boolean);

  async function doJoin() {
    setBusy(true);
    try { await joinTeam(code); toast?.push("Você entrou na equipe!", "success"); }
    catch (e) { toast?.push(e.message || "Código inválido.", "error"); }
    finally { setBusy(false); }
  }
  async function doCreate() {
    setBusy(true);
    try {
      const t = await createTeam({ name: name.trim(), anchorDate: anchor, tasks: tasks.map((x) => x.trim()).filter(Boolean) });
      toast?.push(`Equipe criada! Código: ${t.code}`, "success");
    } catch { toast?.push("Erro ao criar equipe.", "error"); }
    finally { setBusy(false); }
  }

  return (
    <div className={`container page-pad ${styles.wrap}`}>
      <div className={styles.head}>
        <h1 className={styles.h1}>Sua equipe</h1>
        <p className={styles.sub}>Entre com um código ou crie uma equipe nova (você será o administrador).</p>
        <div className={styles.tabs}>
          <button className={mode === "join" ? styles.tabOn : styles.tab} onClick={() => setMode("join")}>Entrar com código</button>
          <button className={mode === "create" ? styles.tabOn : styles.tab} onClick={() => setMode("create")}>Criar equipe</button>
        </div>
      </div>

      {mode === "join" ? (
        <Card>
          <div className={styles.col}>
            <Input label="Código da equipe" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="MCC-48DF92" />
            <Button full loading={busy} onClick={doJoin} disabled={!code.trim()}>Entrar na equipe</Button>
          </div>
        </Card>
      ) : (
        <Card>
          <div className={styles.col}>
            <Input label="Nome da equipe" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: MCC" maxLength={40} />
            <Input label="Início da Fase 1 (a contagem das fases parte daqui)" type="date" value={anchor} onChange={(e) => setAnchor(e.target.value)} />
            <div>
              <span className={styles.label}>As 14 tarefas diárias ({filled.length}/14)</span>
              <div className={styles.tasks}>
                {tasks.map((t, i) => (
                  <div key={i} className={styles.taskRow}>
                    <span className={styles.tNum}>{i + 1}</span>
                    <input className={styles.tInput} value={t} maxLength={70}
                      onChange={(e) => setTasks((p) => p.map((x, j) => (j === i ? e.target.value : x)))} placeholder={`Tarefa ${i + 1}`} />
                  </div>
                ))}
              </div>
            </div>
            <Button full loading={busy} onClick={doCreate} disabled={!name.trim() || filled.length < 1 || !anchor}>Criar equipe</Button>
          </div>
        </Card>
      )}

      <button className={styles.logout} onClick={logout}>Sair da conta</button>
    </div>
  );
}
