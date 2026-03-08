import { Nota } from "../types/types";
import { NoteCard } from "./NoteCard";

// Definiamo quali dati la Sidebar si aspetta di ricevere da App.tsx
interface Props {
  note: Nota[];
  statoLettura: 'vuoto' | 'creazione' | 'visualizzazione';
  notaAttiva: Nota | null;
  onNuovaNota: () => void;
  onApriNota: (nota: Nota) => void;
}

export function Sidebar({ note, statoLettura, notaAttiva, onNuovaNota, onApriNota }: Props) {
  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <div 
          className={`sidebar-item ${statoLettura === 'creazione' ? 'active' : ''}`} 
          onClick={onNuovaNota}
        >
          + Nuova Nota
        </div>
      </div>
      
      <div className="sidebar-divider"></div>
      
      <div className="sidebar-section" style={{ flex: 1, overflowY: "auto" }}>
        <div className="sidebar-label">Recenti</div>
        
        {note.length === 0 && (
          <div style={{ padding: "8px 12px", fontSize: "11px", color: "var(--text-tertiary)" }}>Nessuna nota.</div>
        )}
        
        {note.map(n => (
          <NoteCard 
            key={n.id} 
            nota={n} 
            attiva={notaAttiva?.id === n.id && statoLettura === 'visualizzazione'} 
            onClick={() => onApriNota(n)} 
          />
        ))}
      </div>
    </div>
  );
}