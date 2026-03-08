import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Note } from "../types/types";

interface Props {
  note: Note;
  onUpdate: (id: string, title: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function NoteDetail({ note, onUpdate, onDelete }: Props) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setError(null);
    setShowConfirm(false);
  }, [note]);

  const handleUpdate = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onUpdate(note.id, title, content);
    } catch (e) {
      setError(t('form.error_update'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onDelete(note.id);
    } catch (e) {
      setError(t('form.error_delete'));
      setShowConfirm(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="editor-content">
      {error && (
        <div className="callout" style={{ borderLeftColor: "#ff5f57", marginBottom: "24px" }}>
          <div className="callout-icon">⚠️</div>
          <div className="callout-text" style={{ color: "#ff5f57" }}>{error}</div>
        </div>
      )}

      <input 
        className="note-title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isSaving}
        placeholder={t('note.untitled')}
      />
      <div className="note-meta-row">
        <span className="tag-warm">{t('note.edit_mode')}</span>
      </div>
      <textarea 
        className="paragraph note-body"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSaving}
        placeholder={t('note.start_writing')}
      />
      
      {showConfirm ? (
        <div className="form-actions" style={{ justifyContent: "space-between", background: "var(--bg-elevated)", padding: "12px", borderRadius: "var(--radius-md)", alignItems: "center" }}>
          <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>{t('form.delete_confirm_msg')}</span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn btn-secondary" onClick={() => setShowConfirm(false)} disabled={isSaving}>
              {t('form.cancel')}
            </button>
            <button className="btn btn-primary" style={{ background: "#ff5f57", color: "#fff" }} onClick={handleDelete} disabled={isSaving}>
              {isSaving ? t('form.deleting') : t('form.yes_delete')}
            </button>
          </div>
        </div>
      ) : (
        <div className="form-actions" style={{ justifyContent: "space-between" }}>
          <button className="btn btn-secondary" onClick={() => setShowConfirm(true)} disabled={isSaving} style={{ color: "#ff5f57", borderColor: "#ff5f5733" }}>
            {t('form.delete')}
          </button>
          <button className="btn btn-primary" onClick={handleUpdate} disabled={isSaving} style={{ opacity: isSaving ? 0.5 : 1 }}>
            {isSaving ? t('form.saving') : t('form.save_changes')}
          </button>
        </div>
      )}
    </div>
  );
}