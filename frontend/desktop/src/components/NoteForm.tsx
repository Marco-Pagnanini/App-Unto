import { useState } from "react";

interface Props {
  onSalva: (titolo: string, descrizione: string) => void;
  onAnnulla: () => void;
}

export function NoteForm({ onSalva, onAnnulla }: Props) {
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");

  return (
    <div className="editor-content">
      <input 
        className="note-title-input"
        placeholder="Titolo della nota..." 
        value={titolo}
        onChange={(e) => setTitolo(e.target.value)}
      />
      <textarea 
        className="paragraph"
        placeholder="Inizia a scrivere qui..." 
        value={descrizione}
        onChange={(e) => setDescrizione(e.target.value)}
        style={{ flex: 1, minHeight: "300px", background: "transparent", border: "none", outline: "none", resize: "none" }}
      />
      
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button onClick={onAnnulla} style={{ padding: "8px 16px", cursor: "pointer", background: "var(--bg-elevated)", color: "var(--text-primary)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)" }}>
          Annulla
        </button>
        <button onClick={() => onSalva(titolo, descrizione)} style={{ padding: "8px 16px", cursor: "pointer", background: "var(--accent-warm)", color: "#000", border: "none", borderRadius: "var(--radius-md)", fontWeight: "bold" }}>
          Salva Nota
        </button>
      </div>
    </div>
  );
}