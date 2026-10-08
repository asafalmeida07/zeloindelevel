import { useState, useEffect } from "react";
import Card from "../../components/Card/Card.jsx";
import Button from "../../components/Button/Button.jsx";
import styles from "./Gestor.module.css";
import { useGestorAuth } from "../../hooks/useGestorAuth.js";
import { db } from "../../firebase/config.js";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

const BASE_PROJETOS = [
  { id: "proj-1", engrenagem: "Colheita", nome: "VOZ", desc: "" },
  { id: "proj-2", engrenagem: "Colheita", nome: "Reação 24'15", desc: "" },
  { id: "proj-3", engrenagem: "Colheita", nome: "FishReels", desc: "" },
  { id: "proj-4", engrenagem: "Colheita", nome: "Levanta-te", desc: "" },
  { id: "proj-5", engrenagem: "Comunhão", nome: "Amplie", desc: "" },
  { id: "proj-6", engrenagem: "Comunhão", nome: "Acrescentar", desc: "" },
  { id: "proj-7", engrenagem: "Ensino", nome: "Cresçam", desc: "" },
  { id: "proj-8", engrenagem: "Ensino", nome: "Apascentadores", desc: "" },
  { id: "proj-9", engrenagem: "Adoração", nome: "Óleo Sobre as Nações", desc: "" },
  { id: "proj-10", engrenagem: "Adoração", nome: "Comprometidos Para a Missão", desc: "" },
  { id: "proj-11", engrenagem: "Serviço", nome: "Alavanca", desc: "" },
  { id: "proj-12", engrenagem: "Serviço", nome: "Provisão", desc: "" }
];

export default function Gestor() {
  const { isGestor, isMaster } = useGestorAuth();
  const [projetos, setProjetos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("projetos");

  useEffect(() => {
    async function load() {
      if (!isGestor) return;
      const snap = await getDocs(collection(db, "gestor_projetos"));
      if (snap.empty) {
        // Semente idempotente
        for (const p of BASE_PROJETOS) {
          await setDoc(doc(db, "gestor_projetos", p.id), p);
        }
        setProjetos(BASE_PROJETOS);
      } else {
        setProjetos(snap.docs.map(d => d.data()));
      }
    }
    load();
  }, [isGestor]);

  if (selected) {
    return (
      <div className={`fade-in ${styles.gestorPage}`}>
        <div className={styles.backBtn}>
          <Button variant="outline" onClick={() => setSelected(null)}>← Voltar para Projetos</Button>
        </div>
        <Card title={`Projeto: ${selected.nome} (${selected.engrenagem})`}>
          <p className={styles.projectDesc} style={{fontSize: '1rem'}}>{selected.desc || "Sem descrição."}</p>
          
          <div className={styles.details}>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Equipe do Projeto</div>
              <p style={{color: 'var(--text-dim)', fontSize: '0.9rem'}}>Adicione líderes, colíderes e equipe.</p>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Etapas do Projeto (1 a 3)</div>
              <p style={{color: 'var(--text-dim)', fontSize: '0.9rem'}}>As entregas estão atreladas às fases do MAPA.</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`fade-in ${styles.gestorPage}`}>
      <Card title="Gestor Ministerial">
        <div className={styles.tabs}>
          <button className={`${styles.tabBtn} ${activeTab === 'projetos' ? styles.activeTab : ''}`} onClick={() => setActiveTab('projetos')}>Os 12 Projetos</button>
          <button className={`${styles.tabBtn} ${activeTab === 'objetivos' ? styles.activeTab : ''}`} onClick={() => setActiveTab('objetivos')}>Objetivos Zelo</button>
          {isMaster && (
            <button className={`${styles.tabBtn} ${activeTab === 'acessos' ? styles.activeTab : ''}`} onClick={() => setActiveTab('acessos')}>Acessos</button>
          )}
        </div>
        
        {activeTab === 'projetos' && (
          <div className={styles.grid}>
            {projetos.map(p => (
              <div key={p.id} className={styles.projectCard} onClick={() => setSelected(p)}>
                <div className={styles.projectGear}>{p.engrenagem}</div>
                <div className={styles.projectName}>{p.nome}</div>
                <div className={styles.projectDesc}>{p.desc || "Sem descrição."}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'objetivos' && (
          <div style={{marginTop: '20px'}}>
            <p style={{color: 'var(--text-dim)'}}>Objetivos de trajetória pré-cadastrados.</p>
          </div>
        )}

        {activeTab === 'acessos' && isMaster && (
          <div style={{marginTop: '20px'}}>
            <p style={{color: 'var(--text-dim)'}}>Somente a Mestre gerencia e-mails (coleção gestores/&#123;email&#125;).</p>
          </div>
        )}
      </Card>
    </div>
  );
}
