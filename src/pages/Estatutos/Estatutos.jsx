import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import sectionsData from "../../content/estatutos_sections.json";
import glossarioData from "../../content/glossario.json";
import quizData from "../../content/quiz.json";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config.js";
import { useUser } from "../../hooks/useUser.js";
import styles from "./Estatutos.module.css";

const TABS = [
  { id: "visao", title: "Visão Geral", k: "Estatutos", seal: "0" },
  { id: "eps", title: "EPS", k: "Estatuto 1", seal: "I" },
  { id: "espiral", title: "A Espiral Circular", k: "Estatuto 2", seal: "II" },
  { id: "mapa", title: "O MAPA", k: "Estatuto 3", seal: "III" },
  { id: "odes", title: "As Odes do Rei", k: "Estatuto 4", seal: "IV" },
  { id: "mead", title: "O MEAD", k: "Estatuto 5", seal: "V" },
  { id: "glossario", title: "Glossário", k: "Referência", seal: "G" },
  { id: "quiz", title: "Autoavaliação", k: "Teste", seal: "?" }
];

export default function Estatutos() {
  const { profile } = useUser();
  const [activeTab, setActiveTab] = useState("visao");

  const renderDiagram = (id) => {
    switch(id) {
      case "visao":
        return (
          <div className={styles.flow}>
            <div className={styles.node}>EP's (Obra)</div>
            <div className={styles.node}>Espiral (Pessoa)</div>
            <div className={`${styles.node} ${styles.center}`}>Os Cinco Estatutos</div>
            <div className={styles.node}>MAPA (Avanço)</div>
            <div className={styles.node}>ODES (Caráter)</div>
            <div className={styles.node}>MEAD (Caminho)</div>
          </div>
        );
      case "eps":
        return (
          <div className={styles.flow}>
            <div className={`${styles.node} ${styles.center}`}>O Propósito</div>
            <div className={styles.arrow}>↓</div>
            <div className={styles.node}>Adoração</div>
            <div className={styles.node}>Ensino</div>
            <div className={styles.node}>Comunhão</div>
            <div className={styles.node}>Colheita</div>
            <div className={styles.node}>Serviço</div>
          </div>
        );
      case "espiral":
        return (
          <div className={styles.flow}>
            <div className={styles.node}>Volta 1: Segunda Milha</div>
            <div className={styles.arrow}>→</div>
            <div className={`${styles.node} ${styles.center}`}>4 Quadrantes</div>
            <div className={styles.arrow}>←</div>
            <div className={styles.node}>Volta 2: Novidade de Vida</div>
          </div>
        );
      case "mapa":
        return (
          <div className={styles.flow}>
            <div className={`${styles.node} ${styles.center}`}>360 Fases</div>
            <div className={styles.arrow}>→</div>
            <div className={styles.node}>5 Etapas (9, 9, 9, 9, 7)</div>
            <div className={styles.arrow}>→</div>
            <div className={styles.node}>Ciclo de 43 dias</div>
          </div>
        );
      case "odes":
        return (
          <div className={styles.flow}>
            <div className={styles.node}>1. Calções</div>
            <div className={styles.node}>2. Túnica</div>
            <div className={styles.node}>3. Cinto</div>
            <div className={styles.node}>4. Manto</div>
            <div className={`${styles.node} ${styles.center}`}>Excelência Sacerdotal</div>
            <div className={styles.node}>5. Éfode</div>
            <div className={styles.node}>6. Peitoral</div>
            <div className={styles.node}>7. Mitra</div>
            <div className={styles.node}>8. Lâmina</div>
          </div>
        );
      case "mead":
        return (
          <div className={styles.flow}>
            <div className={`${styles.node} ${styles.center}`}>O Caminho</div>
            <div className={styles.arrow}>→</div>
            <div className={styles.node}>Paternidade</div>
            <div className={styles.node}>Missão</div>
            <div className={styles.node}>Pureza</div>
            <div className={styles.node}>Profecia</div>
            <div className={styles.node}>Fé</div>
            <div className={styles.node}>Submissão</div>
            <div className={styles.node}>Exaltação</div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHead}>
          <div className={styles.kicker}>Documento</div>
          <h1>Os Cinco Estatutos</h1>
          <p>Manual oficial de alinhamento e conduta do Caminho Estreito.</p>
        </div>
        <nav className={styles.toc}>
          {TABS.map(t => (
            <button 
              key={t.id}
              className={styles.tocBtn}
              aria-current={activeTab === t.id}
              onClick={() => setActiveTab(t.id)}
            >
              <div className={styles.tocSeal}>{t.seal}</div>
              <div className={styles.tocLabel}>
                <span className={styles.n}>{t.title}</span>
                <span className={styles.p}>{t.k}</span>
              </div>
            </button>
          ))}
        </nav>
      </aside>

      <main className={styles.content}>
        {TABS.filter(t => ['visao', 'eps', 'espiral', 'mapa', 'odes', 'mead'].includes(t.id)).map(t => (
          <div key={t.id} className={`${styles.panel} ${activeTab === t.id ? styles.active : ''}`}>
            <div className={styles.panelHead}>
              <div className={styles.kicker}>{t.k}</div>
              <h2>{t.title}</h2>
            </div>
            <div className={styles.markdownBody}>
              <ReactMarkdown components={{
                h2: 'h3',
                h3: 'h4',
                p: 'p',
                blockquote: ({node, ...props}) => <div className={styles.card} {...props} />
              }}>
                {sectionsData[t.id] || ""}
              </ReactMarkdown>
            </div>
            {renderDiagram(t.id)}
          </div>
        ))}

        {activeTab === "glossario" && <Glossario />}
        {activeTab === "quiz" && <Quiz profile={profile} />}
      </main>
    </div>
  );
}

function Glossario() {
  const [q, setQ] = useState("");
  const filtered = glossarioData.filter(g => g.term.toLowerCase().includes(q.toLowerCase()) || g.desc.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className={`${styles.panel} ${styles.active}`}>
      <div className={styles.panelHead}>
        <div className={styles.kicker}>Referência</div>
        <h2>Glossário</h2>
      </div>
      <input type="text" placeholder="Buscar termo..." value={q} onChange={e => setQ(e.target.value)} style={{width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid var(--rule)', background: 'var(--surface)', color: 'var(--fg)'}} />
      <div className={styles.grid}>
        {filtered.map(g => (
          <div key={g.term} className={styles.card}>
            <div className={styles.kv}>
              <dt>{g.term}</dt>
              <dd>{g.desc}</dd>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Quiz({ profile }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(null);

  useEffect(() => {
    // Sorteia 10
    const shuffled = [...quizData].sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuestions(shuffled);
    
    if (profile) {
      getDoc(doc(db, "users", profile.uid, "estatutos_progresso", "quiz")).then(snap => {
        if (snap.exists()) setBestScore(snap.data().bestScore);
      });
    }
  }, [profile]);

  const handleSubmit = async () => {
    let s = 0;
    questions.forEach((q, i) => {
      const selectedText = answers[i];
      const opt = q.options.find(o => o.text === selectedText);
      if (opt && opt.isCorrect) s++;
    });
    setScore(s);
    setSubmitted(true);

    if (profile && (bestScore === null || s > bestScore)) {
      setBestScore(s);
      await setDoc(doc(db, "users", profile.uid, "estatutos_progresso", "quiz"), { bestScore: s });
    }
  };

  return (
    <div className={`${styles.panel} ${styles.active}`}>
      <div className={styles.panelHead}>
        <div className={styles.kicker}>Teste</div>
        <h2>Autoavaliação</h2>
        {bestScore !== null && <p>Sua melhor nota: {bestScore}/10</p>}
      </div>
      
      {questions.map((q, i) => (
        <div key={i} className={styles.card}>
          <h4 style={{marginTop: 0}}>{i+1}. {q.question}</h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px'}}>
            {q.options.map(o => (
              <label key={o.text} style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                <input type="radio" name={`q-${i}`} value={o.text} disabled={submitted} onChange={() => setAnswers({...answers, [i]: o.text})} />
                {o.text}
              </label>
            ))}
          </div>
          {submitted && (
            <div style={{marginTop: '12px', padding: '10px', background: 'var(--surface-2)', borderRadius: '6px', fontSize: '14px'}}>
              <b>{q.options.find(x => x.text === answers[i])?.isCorrect ? '✅ Correto' : '❌ Incorreto'}</b>
              <p style={{margin: '4px 0 0'}}>{q.explanation}</p>
            </div>
          )}
        </div>
      ))}

      {!submitted && (
        <button onClick={handleSubmit} style={{padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-fg)', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '16px'}}>
          Finalizar
        </button>
      )}
    </div>
  );
}
