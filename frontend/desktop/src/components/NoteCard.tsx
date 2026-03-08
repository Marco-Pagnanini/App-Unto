import { useTranslation } from 'react-i18next';
import { Note } from "../types/types";

interface Props {
  note: Note;
  isActive: boolean;
  onClick: () => void;
}

export function NoteCard({ note, isActive, onClick }: Props) {
  const { t } = useTranslation();
  
  const dateText = note.updatedAt ? note.updatedAt : t('note.today');
  const tagsText = note.tags && note.tags.length > 0 
    ? ` · ${note.tags.join(', ')}` 
    : "";

  return (
    <div className={`note-item ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className="note-item-title">{note.title}</div>
      <div className="note-item-meta">
        {dateText}{tagsText}
      </div>
    </div>
  );
}