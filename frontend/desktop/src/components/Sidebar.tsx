import { useTranslation } from 'react-i18next';
import { Note } from "../types/types";
import { NoteCard } from "./NoteCard";

interface Props {
  notes: Note[];
  viewState: 'empty' | 'creating' | 'viewing';
  activeNote: Note | null;
  onCreateNote: () => void;
  onOpenNote: (note: Note) => void;
  onLogout: () => void;
}

export function Sidebar({ notes, viewState, activeNote, onCreateNote, onOpenNote, onLogout }: Props) {
  const { t } = useTranslation();

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <div 
          className={`sidebar-item ${viewState === 'creating' ? 'active' : ''}`} 
          onClick={onCreateNote}
        >
          {t('sidebar.new_note')}
        </div>
      </div>
      
      <div className="sidebar-divider"></div>
      
      <div className="sidebar-section" style={{ flex: 1, overflowY: "auto" }}>
        <div className="sidebar-label">{t('sidebar.recent')}</div>
        
        {(!notes || notes.length === 0) && (
          <div style={{ padding: "8px 12px", fontSize: "11px", color: "var(--text-tertiary)" }}>
            {t('sidebar.no_notes')}
          </div>
        )}
        
        {notes?.map(n => (
          <NoteCard 
            key={n.id} 
            note={n} 
            isActive={activeNote?.id === n.id && viewState === 'viewing'} 
            onClick={() => onOpenNote(n)} 
          />
        ))}
      </div>

      <div style={{ padding: "16px", borderTop: "1px solid var(--border-subtle)" }}>
        <button 
          className="btn btn-secondary" 
          onClick={onLogout}
          style={{ width: "100%", justifyContent: "center" }}
        >
          {t('app.logout_btn')}
        </button>
      </div>
    </div>

    
  );
}