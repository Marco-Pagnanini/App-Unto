import { Nota } from "../types/types";

interface Props {
  nota: Nota;
  attiva: boolean;
  onClick: () => void;
}

export function NoteCard({ nota, attiva, onClick }: Props) {
  // Prepariamo il testo dei metadati. 
  // Se non c'è una data dal DB, per ora mettiamo "oggi"
  const dataTesto = nota.dataAggiornamento ? nota.dataAggiornamento : "oggi";
  
  // Se ci sono tag, li uniamo con una virgola. Es: " · Go, React"
  const tagsTesto = nota.tags && nota.tags.length > 0 
    ? ` · ${nota.tags.join(', ')}` 
    : "";

  return (
    <div className={`note-item ${attiva ? 'active' : ''}`} onClick={onClick}>
      <div className="note-item-title">{nota.titolo}</div>
      {/* Aggiungiamo la riga dei metadati */}
      <div className="note-item-meta">
        {dataTesto}{tagsTesto}
      </div>
    </div>
  );
}