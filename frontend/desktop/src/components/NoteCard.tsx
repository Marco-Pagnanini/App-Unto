import { Nota } from "../types/types";

interface Props {
  nota: Nota;
  attiva: boolean;
  onClick: () => void;
}

export function NoteCard({ nota, attiva, onClick }: Props) {
  return (
    <div className={`note-item ${attiva ? 'active' : ''}`} onClick={onClick}>
      <div className="note-item-title">{nota.titolo}</div>
    </div>
  );
}