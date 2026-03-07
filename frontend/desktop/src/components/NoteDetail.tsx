import { Nota } from "../types/types";

interface Props {
  nota: Nota;
}

export function NoteDetail({ nota }: Props) {
  return (
    <div className="editor-content">
      <div className="note-title-input">{nota.titolo}</div>
      <div style={{ marginBottom: "32px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "24px" }}>
        <span className="tag-warm">Salvata in locale</span>
      </div>
      <div className="paragraph" style={{ whiteSpace: "pre-wrap" }}>
        {nota.descrizione}
      </div>
    </div>
  );
}