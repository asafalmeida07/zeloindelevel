const fs = require("fs");
const content = `import { useState } from "react";
import { useUser } from "../../hooks/useUser.js";
import { useTeam } from "../../hooks/useTeam.js";
import { usePhase } from "../../hooks/usePhase.js";
import { cycleService } from "../../services/cycleService.js";
import Card from "../../components/Card/Card.jsx";
import Button from "../../components/Button/Button.jsx";
import { useToast } from "../../components/Toast/ToastContext.jsx";
import styles from "./Plan.module.css";
import { DEFAULT_TASKS } from "../../utils/constants.js";

export default function Plan() {
  const { profile, loading } = useUser();
  const { team } = useTeam();
  const phase = usePhase();
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const [numCycles, setNumCycles] = useState(43);
  const [config, setConfig] = useState({
    escritaRitmo: 6,
    momentoDura: 90,
    jejumRitmo: "18h",
    leituraLivro: "O Peregrino",
    leituraPaginas: 10
  });

  if (loading || !profile || !team || !phase) return null;

  const handleGenerate = async () => {
    if (config.momentoDura < 60) {
      return toast.error("O Momento na Presença deve ter no mínimo 60 minutos.");
    }
    const jejumNum = parseInt(config.jejumRitmo.replace(/\\D/g, ''));
    if (!jejumNum || jejumNum < 12 || jejumNum > 72) {
      return toast.error("O ritmo de jejum deve ser entre 12 e 72 horas.");
    }

    setSaving(true);
    try {
      const cyclesToSave = [];
      const startNum = phase.cycles && phase.cycles.length > 0 ? Math.max(...phase.cycles.map(c => c.cycleNumber)) + 1 : 1;

      for (let i = 0; i < numCycles; i++) {
        const cNum = startNum + i;
        const tasksObj = {};
        
        DEFAULT_TASKS.forEach((tName, idx) => {
          if (idx === 0) {
             tasksObj[tName] = {
               done: false,
               subtasks: {
                 "Devocional": { text: "Salmos", done: false },
                 "Plano de Leitura": { text: "Romanos", done: false },
                 "Escrita Bíblica": { text: \`\${config.escritaRitmo} versículos\`, done: false },
                 "Estudo": { text: "Isaías", done: false },
                 "Leitura Corrida": { text: "10 capítulos", done: false }
               }
             };
          } else if (idx === 1) {
             tasksObj[tName] = { done: false, text: \`\${config.momentoDura} min: louvor, oração, contemplação\` };
          } else if (idx === 3) {
             tasksObj[tName] = { done: false, text: \`Jejum de \${config.jejumRitmo}\` };
          } else if (idx === 4) {
             tasksObj[tName] = { done: false, text: \`Ler \${config.leituraPaginas} páginas de \${config.leituraLivro}\` };
          } else {
             tasksObj[tName] = { done: false, text: "Executar planejamento" };
          }
        });

        cyclesToSave.push({
          cycleNumber: cNum,
          phase: phase.viewedPhase,
          status: "programado",
          tasks: tasksObj,
          emergentes: []
        });
      }
      
      await cycleService.saveCyclesBatch(team.id, profile.uid, cyclesToSave);
      toast.success("Plano gerado com sucesso!");
      phase.reloadCycles();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao gerar plano.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={\`fade-in \${styles.planPage}\`}>
      <Card title={\`Plano Estratégico - Fase \${phase.viewedPhase + 1}\`}>
        <p className={styles.desc}>
          Defina a programação dos ciclos.
        </p>
        <div className={styles.config}>
          <label className={styles.taskLabel}>Número de ciclos programados</label>
          <input 
            type="number" 
            className={styles.textareaSmall}
            value={numCycles} 
            onChange={e => setNumCycles(Number(e.target.value))} 
            style={{height: '40px'}}
          />

          <label className={styles.taskLabel}>Ritmo da Escrita Bíblica (versículos/ciclo)</label>
          <input 
            type="number" 
            className={styles.textareaSmall}
            value={config.escritaRitmo} 
            onChange={e => setConfig({...config, escritaRitmo: Number(e.target.value)})} 
            style={{height: '40px'}}
          />

          <label className={styles.taskLabel}>Momento na Presença (minutos)</label>
          <input 
            type="number" 
            className={styles.textareaSmall}
            value={config.momentoDura} 
            onChange={e => setConfig({...config, momentoDura: Number(e.target.value)})} 
            style={{height: '40px'}}
          />

          <label className={styles.taskLabel}>Ritmo de Jejum</label>
          <input 
            type="text" 
            className={styles.textareaSmall}
            value={config.jejumRitmo} 
            onChange={e => setConfig({...config, jejumRitmo: e.target.value})} 
            style={{height: '40px'}}
          />
        </div>
        <div className={styles.actions} style={{marginTop: '20px'}}>
          <Button onClick={handleGenerate} disabled={saving} loading={saving}>
            {saving ? "Salvando..." : \`Adicionar \${numCycles} Ciclos\`}
          </Button>
        </div>
      </Card>

      {phase.cycles && phase.cycles.length > 0 && (
        <Card title="Grade de Ciclos Programados">
          <div style={{overflowX: 'auto'}}>
            <table className={styles.cycleTable}>
              <thead>
                <tr>
                  <th>Ciclo</th>
                  <th>Status</th>
                  <th>Leitura Bíblica</th>
                  <th>Momento</th>
                  <th>Exercícios</th>
                  <th>Jejum</th>
                  <th>Outros</th>
                </tr>
              </thead>
              <tbody>
                {phase.cycles.map(c => (
                  <tr key={c.cycleNumber}>
                    <td><b>#{c.cycleNumber}</b></td>
                    <td>{c.status}</td>
                    <td>{c.tasks['Leitura Bíblica']?.subtasks?.['Escrita Bíblica']?.text}</td>
                    <td>{c.tasks['Momento na Presença']?.text}</td>
                    <td>{c.tasks['Exercícios Físicos']?.text}</td>
                    <td>{c.tasks['Jejum']?.text}</td>
                    <td>...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}`;
fs.writeFileSync("src/pages/Plan/Plan.jsx", content, "utf8");
