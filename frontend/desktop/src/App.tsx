import { useState } from "react";
import { API } from "./services/api";
import { Nota } from "./types/types";
import { NoteForm } from "./components/NoteForm";
import { NoteCard } from "./components/NoteCard";
import { NoteDetail } from "./components/NoteDetail";
import "./styles/global.css"; // Colleghiamo il tuo Design System!

function App() {
  const [note, setNote] = useState<Nota[]>([]);
  
  // Gestiamo 3 stati possibili per l'area di destra: vuota, creazione o visualizzazione
  const [statoLettura, setStatoLettura] = useState<'vuoto' | 'creazione' | 'visualizzazione'>('vuoto');
  const [notaAttiva, setNotaAttiva] = useState<Nota | null>(null);

  const avviaCreazione = () => {
    setStatoLettura('creazione');
    setNotaAttiva(null);
  };

  const apriNota = (nota: Nota) => {
    setNotaAttiva(nota);
    setStatoLettura('visualizzazione');
  };

  const aggiungiNota = async (titolo: string, descrizione: string) => {
    if (!titolo.trim() || !descrizione.trim()) return;
    try {
      const nuovaNota = await API.salvaNota(titolo, descrizione);
      setNote(prev => [nuovaNota, ...prev]);
      apriNota(nuovaNota); // Apre la nota appena salvata
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="app-shell">
      {/* Barra superiore */}
      <div className="topbar">
        <div className="topbar-logo">App-<span>Unto</span></div>
      </div>

      {/* Barra laterale */}
      <div className="sidebar">
        <div className="sidebar-section">
          <div 
            className={`sidebar-item ${statoLettura === 'creazione' ? 'active' : ''}`} 
            onClick={avviaCreazione}
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
              onClick={() => apriNota(n)} 
            />
          ))}
        </div>
      </div>

      {/* Area principale (Editor o Lettura) */}
      <div className="editor-area">
        {statoLettura === 'creazione' && (
          <NoteForm 
            onSalva={aggiungiNota} 
            onAnnulla={() => setStatoLettura(note.length > 0 ? 'visualizzazione' : 'vuoto')} 
          />
        )}
        
        {statoLettura === 'visualizzazione' && notaAttiva && (
          <NoteDetail nota={notaAttiva} />
        )}
        
        {statoLettura === 'vuoto' && (
          <div style={{ margin: "auto", fontFamily: "var(--font-display)", color: "var(--text-tertiary)", fontSize: "24px" }}>
            Seleziona o crea una nota
          </div>
        )}
      </div>
    </div>
  );
}

export default App;