export interface Nota {
  id: string;
  titolo: string;
  descrizione: string;
  dataAggiornamento?: string; 
  tags?: string[]; 
}