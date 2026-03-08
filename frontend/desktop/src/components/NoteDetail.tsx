import { Nota } from "../types/types";

interface Props {
  nota: Nota;
}

export function NoteDetail({ nota }: Props) {
  return (
    <div className="editor-content">
      <div className="note-title-input">{nota.titolo}</div>
      
      {/* Abbiamo sostituito gli stili inline con note-meta-row */}
      <div className="note-meta-row">
        <span className="tag-warm">Salvata in locale</span>
      </div>
      
      {/* Aggiunta la classe note-body per gestire i ritorni a capo */}
      <div className="paragraph note-body">
        {nota.descrizione}
      </div>
    </div>
  );
}