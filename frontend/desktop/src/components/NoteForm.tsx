import { useState } from "react";
import { useTranslation } from 'react-i18next';

interface Props {
  onSave: (title: string, content: string) => Promise<void>;
  onCancel: () => void;
}

export function NoteForm({ onSave, onCancel }: Props) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(title, content);
    setIsSaving(false);
  };

  return (
    <div className="editor-content">
      <input 
        className="note-title-input"
        placeholder={t('form.title_placeholder')} 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isSaving}
      />
      <textarea 
        className="paragraph note-body"
        placeholder={t('note.start_writing')} 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSaving}
      />
      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onCancel} disabled={isSaving}>
          {t('form.cancel')}
        </button>
        <button 
          className="btn btn-primary" 
          onClick={handleSave}
          disabled={isSaving}
          style={{ opacity: isSaving ? 0.5 : 1, cursor: isSaving ? 'wait' : 'pointer' }}
        >
          {isSaving ? t('form.saving') : t('form.save_note')}
        </button>
      </div>
    </div>
  );
}