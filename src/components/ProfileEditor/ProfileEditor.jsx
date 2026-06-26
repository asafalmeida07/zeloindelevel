import { useState, useRef } from "react";
import styles from "./ProfileEditor.module.css";
import Button from "../Button/Button.jsx";
import Input from "../Input/Input.jsx";
import Avatar from "../Avatar/Avatar.jsx";
import { PROFILE_COLORS } from "../../utils/constants.js";
import { storageService } from "../../services/storageService.js";
import { useUser } from "../../hooks/useUser.js";
import { useToast } from "../Toast/ToastContext.jsx";

export default function ProfileEditor({ onClose }) {
  const { profile, updateProfile } = useUser();
  const toast = useToast();
  const fileRef = useRef(null);
  const [name, setName] = useState(profile?.name || "");
  const [objective, setObjective] = useState(profile?.objective || "");
  const [color, setColor] = useState(profile?.color || PROFILE_COLORS[0]);
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function onPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await storageService.uploadAvatar(profile.uid, file);
      setPhotoURL(url);
    } catch {
      toast?.push("Não foi possível enviar a foto.", "error");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), objective: objective.trim(), color, photoURL });
      toast?.push("Perfil atualizado.", "success");
      onClose?.();
    } catch {
      toast?.push("Erro ao salvar.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Editar perfil</h2>

        <div className={styles.avatarRow}>
          <Avatar name={name} photoURL={photoURL} color={color} size={64} ring />
          <div>
            <Button variant="ghost" size="sm" loading={uploading} onClick={() => fileRef.current?.click()}>
              {photoURL ? "Trocar foto" : "Enviar foto"}
            </Button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick} />
          </div>
        </div>

        <div className={styles.fields}>
          <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} maxLength={32} />
          <Input label="Objetivo da fase" as="textarea" rows={2} value={objective}
            onChange={(e) => setObjective(e.target.value)} maxLength={120} placeholder="Sua intenção para esta fase" />
          <div>
            <span className={styles.label}>Cor</span>
            <div className={styles.colors}>
              {PROFILE_COLORS.map((c) => (
                <button key={c} className={styles.sw} style={{ background: c, outline: color === c ? "3px solid var(--text)" : "3px solid transparent" }}
                  onClick={() => setColor(c)} aria-label={`Cor ${c}`} />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="subtle" onClick={onClose}>Cancelar</Button>
          <Button onClick={save} loading={saving} disabled={!name.trim()}>Salvar</Button>
        </div>
      </div>
    </div>
  );
}
