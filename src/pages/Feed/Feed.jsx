import { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser.js";
import { useTeam } from "../../hooks/useTeam.js";
import { feedService } from "../../services/feedService.js";
import { storageService } from "../../services/storageService.js";
import Card from "../../components/Card/Card.jsx";
import Button from "../../components/Button/Button.jsx";
import Avatar from "../../components/Avatar/Avatar.jsx";
import Loading from "../../components/Loading/Loading.jsx";
import { useToast } from "../../components/Toast/ToastContext.jsx";
import { timeAgo } from "../../utils/format.js";
import styles from "./Feed.module.css";

export default function Feed() {
  const { profile } = useUser();
  const { team } = useTeam();
  const toast = useToast();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (team) loadFeed();
  }, [team]);

  const loadFeed = async () => {
    try {
      const data = await feedService.getTeamFeed(team.id);
      setPosts(data);
    } catch (e) {
      console.error(e);
      toast.error("Erro ao carregar o feed.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files)].slice(0, 4)); // max 4 files
    }
  };

  const removeFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handlePublish = async () => {
    if (!text.trim() && files.length === 0) return;
    setPublishing(true);
    try {
      const mediaArray = [];
      for (const f of files) {
        const url = await storageService.uploadMedia(team.id, profile.uid, f);
        const type = f.type.startsWith("video/") ? "video" : "image";
        mediaArray.push({ url, type });
      }

      await feedService.createPost(team.id, profile, text, mediaArray);
      setText("");
      setFiles([]);
      toast.success("Publicado com sucesso!");
      loadFeed();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao publicar.");
    } finally {
      setPublishing(false);
    }
  };

  const renderLinks = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return <a key={i} href={part} target="_blank" rel="noopener noreferrer">{part}</a>;
      }
      return part;
    });
  };

  if (!team || loading) return <Loading full label="Carregando feed" />;

  return (
    <div className={`fade-in ${styles.feedPage}`}>
      <Card>
        <div className={styles.composer}>
          <textarea 
            className={styles.textarea}
            placeholder="Compartilhe uma experiência do que está vivendo..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          
          {files.length > 0 && (
            <div className={styles.mediaPreview}>
              {files.map((f, idx) => {
                const isVideo = f.type.startsWith("video/");
                const objUrl = URL.createObjectURL(f);
                return (
                  <div key={idx} className={styles.previewItem}>
                    {isVideo ? (
                      <video src={objUrl} muted />
                    ) : (
                      <img src={objUrl} alt="preview" />
                    )}
                    <button className={styles.removeBtn} onClick={() => removeFile(idx)}>X</button>
                  </div>
                );
              })}
            </div>
          )}

          <div className={styles.actions}>
            <label className={styles.fileLabel}>
              <input 
                type="file" 
                multiple 
                accept="image/*,video/*" 
                style={{display: 'none'}} 
                onChange={handleFileChange} 
              />
              📷 Anexar Foto/Vídeo
            </label>
            <Button onClick={handlePublish} disabled={publishing || (!text.trim() && files.length === 0)} loading={publishing}>
              Publicar
            </Button>
          </div>
        </div>
      </Card>

      <div className={styles.postList}>
        {posts.map(p => (
          <Card key={p.id}>
            <div className={styles.postHeader}>
              <Avatar url={p.photoURL} name={p.name} color={p.color} size={40} />
              <div className={styles.postMeta}>
                <span className={styles.postName}>{p.name}</span>
                <span className={styles.postTime}>{timeAgo(p.ts)}</span>
              </div>
            </div>
            
            <div className={styles.postText}>
              {renderLinks(p.text)}
            </div>

            {p.media && p.media.length > 0 && (
              <div className={styles.postMedia}>
                {p.media.map((m, idx) => (
                  <div key={idx} className={styles.mediaItem}>
                    {m.type === 'video' ? (
                      <video src={m.url} controls preload="metadata" />
                    ) : (
                      <img src={m.url} alt="anexo" loading="lazy" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
        {posts.length === 0 && (
          <p style={{textAlign: 'center', color: 'var(--text-dim)'}}>Nenhuma publicação ainda. Seja o primeiro!</p>
        )}
      </div>
    </div>
  );
}
