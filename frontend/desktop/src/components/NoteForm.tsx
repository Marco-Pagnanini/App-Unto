import { useState } from "react";

interface Props {
  // onSalva ora restituisce una Promise, così il form sa quando ha finito!
  onSalva: (titolo: string, descrizione: string) => Promise<void>; 
  onAnnulla: () => void;
}

export function NoteForm({ onSalva, onAnnulla }: Props) {
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  // Stato per disabilitare il bottone durante il salvataggio
  const [salvataggioInCorso, setSalvataggioInCorso] = useState(false);

  const gestisciSalvataggio = async () => {
    setSalvataggioInCorso(true);
    await onSalva(titolo, descrizione);
    setSalvataggioInCorso(false);
  };

  return (
    <div className="editor-content">
      <input 
        className="note-title-input"
        placeholder="Titolo della nota..." 
        value={titolo}
        onChange={(e) => setTitolo(e.target.value)}
        disabled={salvataggioInCorso} // Blocca l'input se sta salvando
      />
      
      <textarea 
        className="paragraph note-body"
        placeholder="Inizia a scrivere qui..." 
        value={descrizione}
        onChange={(e) => setDescrizione(e.target.value)}
        disabled={salvataggioInCorso}
      />
      
      <div className="form-actions">
        <button 
          className="btn btn-secondary" 
          onClick={onAnnulla}
          disabled={salvataggioInCorso}
        >
          Annulla
        </button>
        <button 
          className="btn btn-primary" 
          onClick={gestisciSalvataggio}
          disabled={salvataggioInCorso}
          style={{ opacity: salvataggioInCorso ? 0.5 : 1, cursor: salvataggioInCorso ? 'wait' : 'pointer' }}
        >
          {salvataggioInCorso ? "Salvataggio..." : "Salva Nota"}
        </button>
      </div>
    </div>
  );
}