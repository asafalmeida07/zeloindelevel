import { useState, useEffect } from "react";
import Card from "../../components/Card/Card.jsx";
import Button from "../../components/Button/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { feedService } from "../../services/feedService.js";
import { useUser } from "../../hooks/useUser.js";
import styles from "./Feed.module.css";

const PILARES = ["SustentaÃ§Ã£o", "Avivamento", "Fortalecimento", "Comprometimento", "Direcionamento"];

function getYoutubeId(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
}

export default function Feed() {
  const { user } = useAuth();
  const { profile } = useUser();
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [categoria, setCategoria] = useState("");
  const [files, setFiles] = useState([]);
  const [links, setLinks] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);

  

  const loadPosts = async () => {
    const res = await feedService.getPosts(null);
    setPosts(res.posts);
    setLastDoc(res.lastDoc);
  };
  useEffect(() => { loadPosts(); }, []);

  const _loadPostsDummy = async () => {
    const res = await feedService.getPosts(null);
    setPosts(res.posts);
    setLastDoc(res.lastDoc);
  };

  const loadMore = async () => {
    if (!lastDoc) return;
    const res = await feedService.getPosts(lastDoc);
    setPosts(p => [...p, ...res.posts]);
    setLastDoc(res.lastDoc);
  };

  const handlePost = async () => {
    if (!text.trim() || !categoria) return alert("Texto e categoria obrigatÃ³rios!");
    if (text.length > 3000) return alert("Texto muito longo!");
    if (files.length > 4) return alert("MÃ¡ximo de 4 fotos/vÃ­deos.");
    
    // Validar video size (<= 60MB)
    for(let f of files) {
      if (f.type.startsWith('video/') && f.size > 60 * 1024 * 1024) return alert("VÃ­deo deve ter no mÃ¡ximo 60MB.");
    }
    
    setLoading(true);
    try {
      const mediaUrls = files.length > 0 ? await feedService.uploadMedia(user.uid, files) : [];
      const post = {
        text,
        categoria,
        media: mediaUrls,
        links: links.filter(l => l.trim() !== "").slice(0, 3),
        authorUid: user.uid,
        authorName: profile?.displayName || "AnÃ´nimo",
        createdAt: Date.now()
      };
      await feedService.createPost(post);
      setText(""); setCategoria(""); setFiles([]); setLinks([""]);
      loadPosts();
    } catch (e) {
      alert("Erro ao publicar.");
    } finally {
      setLoading(false);
    }
  };

  const del = async (p) => {
    if(window.confirm("Apagar post?")) {
      await feedService.deletePost(p.id, p.media);
      loadPosts();
    }
  };

  const den = async (p) => {
    if(window.confirm("Denunciar post?")) {
      await feedService.denunciar(p.id, user.uid, p.denuncias);
      loadPosts();
    }
  };

  return (
    <div className={`fade-in ${styles.page}`}>
      <Card title="Nova PublicaÃ§Ã£o">
        <select value={categoria} onChange={e => setCategoria(e.target.value)} className={styles.select}>
          <option value="">Selecione um Pilar...</option>
          {PILARES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <textarea 
          className={styles.textarea} 
          placeholder="O que vocÃª estÃ¡ vivendo?" 
          value={text} 
          onChange={e => setText(e.target.value)}
          maxLength={3000}
        />
        <input type="file" multiple accept="image/*,video/*" onChange={e => setFiles(Array.from(e.target.files))} />
        <div className={styles.linksArea}>
          {links.map((l, i) => (
            <input key={i} type="text" placeholder="Adicionar Link (ex: YouTube)" value={l} onChange={e => {
              const nx = [...links]; nx[i] = e.target.value; setLinks(nx);
            }} />
          ))}
          {links.length < 3 && <button onClick={() => setLinks([...links, ""])}>+ Link</button>}
        </div>
        <Button onClick={handlePost} disabled={loading}>{loading ? "Publicando..." : "Publicar"}</Button>
      </Card>

      <div className={styles.timeline}>
        {posts.map(p => (
          <Card key={p.id}>
            <div className={styles.postHeader}>
              <strong>{p.authorName}</strong> <span>{p.categoria}</span>
            </div>
            <p style={{whiteSpace: 'pre-wrap'}}>{p.text}</p>
            {p.media?.map(m => {
               if (m.includes('video')) return <video key={m} src={m} controls style={{maxWidth: '100%', marginTop: 10}} />;
               return <img key={m} src={m} style={{maxWidth: '100%', marginTop: 10}} />;
            })}
            {p.links?.map(l => {
               const yt = getYoutubeId(l);
               if (yt) return <iframe key={l} src={`https://www.youtube.com/embed/${yt}`} style={{width: '100%', height: '200px', marginTop: 10}} />;
               return <a key={l} href={l} target="_blank" rel="noreferrer noopener" style={{display: 'block', marginTop: 10}}>{l}</a>;
            })}
            <div style={{marginTop: 15, display: 'flex', gap: 10}}>
              {p.authorUid === user?.uid ? (
                <button onClick={() => del(p)} style={{color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer'}}>Excluir</button>
              ) : (
                <button onClick={() => den(p)} style={{color: 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer'}}>Denunciar</button>
              )}
            </div>
          </Card>
        ))}
        {lastDoc && <Button onClick={loadMore}>Carregar mais</Button>}
      </div>
    </div>
  );
}

