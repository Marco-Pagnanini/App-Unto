import { useState, useEffect } from "react"; // <-- Aggiunto useEffect
import { API } from "./services/api";
import { Nota } from "./types/types";
import { Topbar } from "./components/Topbar";
import { Sidebar } from "./components/Sidebar";
import { NoteForm } from "./components/NoteForm";
import { NoteDetail } from "./components/NoteDetail";
import "./styles/global.css";

function App() {
  const [note, setNote] = useState<Nota[]>([]);
  const [statoLettura, setStatoLettura] = useState<'vuoto' | 'creazione' | 'visualizzazione'>('vuoto');
  const [notaAttiva, setNotaAttiva] = useState<Nota | null>(null);
  
  const [inCaricamento, setInCaricamento] = useState(true);

  // useEffect con array vuoto [] alla fine significa: "Esegui questo codice SOLO UNA VOLTA all'avvio dell'app"
  useEffect(() => {
    const fetchNote = async () => {
      try {
        setInCaricamento(true);
        const dati = await API.caricaNote();
        setNote(dati);
      } catch (errore) {
        console.error("Errore nel caricamento delle note:", errore);
        // Qui in futuro potremmo mostrare un banner di errore all'utente
      } finally {
        setInCaricamento(false); // Il caricamento è finito, sia con successo che con errore
      }
    };

    fetchNote();
  }, []); // <-- Questo array vuoto è fondamentale!

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
      apriNota(nuovaNota); 
    } catch (e) {
      console.error("Errore salvataggio nota:", e);
      alert("Si è verificato un errore durante il salvataggio della nota."); // Feedback base per l'utente
    }
  };

  if (inCaricamento) {
    return (
      <div className="app-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: "var(--font-display)", color: "var(--text-tertiary)", fontSize: "24px" }}>
          Sincronizzazione in corso...
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Topbar />
      <Sidebar 
        note={note}
        statoLettura={statoLettura}
        notaAttiva={notaAttiva}
        onNuovaNota={avviaCreazione}
        onApriNota={apriNota}
      />
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