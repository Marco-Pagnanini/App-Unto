import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { API } from "./services/api";
import { Note } from "./types/types";
import { Topbar } from "./components/Topbar";
import { Sidebar } from "./components/Sidebar";
import { NoteForm } from "./components/NoteForm";
import { NoteDetail } from "./components/NoteDetail";
import "./styles/global.css";

function App() {
  const { t } = useTranslation();
  const [notes, setNotes] = useState<Note[]>([]);
  const [viewState, setViewState] = useState<'empty' | 'creating' | 'viewing'>('empty');
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        const data = await API.getNotes();
        setNotes(data);
      } catch (error) {
        console.error("Error loading notes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const startCreating = () => {
    setViewState('creating');
    setActiveNote(null);
  };

  const openNote = (note: Note) => {
    setActiveNote(note);
    setViewState('viewing');
  };

  const addNote = async (title: string, content: string) => {
    if (!title.trim() || !content.trim()) return;
    try {
      const newNote = await API.createNote(title, content);
      setNotes(prev => [newNote, ...prev]);
      openNote(newNote); 
    } catch (e) {
      console.error("Error saving note:", e);
      alert(t('app.error_saving'));
    }
  };

  const updateNote = async (id: string, title: string, content: string) => {
    if (!title.trim() || !content.trim()) return;
    try {
      const updatedNote = await API.updateNote(id, title, content);
      setNotes(prev => prev.map(n => n.id === id ? updatedNote : n));
      setActiveNote(updatedNote);
    } catch (e) {
      console.error("Error updating note:", e);
      throw e; 
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await API.deleteNote(id);
      setNotes(prev => prev.filter(n => n.id !== id));
      setActiveNote(null);
      setViewState('empty');
    } catch (e) {
      console.error("Error deleting note:", e);
      throw e; 
    }
  };

  if (isLoading) {
    return (
      <div className="app-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: "var(--font-display)", color: "var(--text-tertiary)", fontSize: "24px" }}>
          {t('app.syncing')}
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Topbar />
      <Sidebar 
        notes={notes}
        viewState={viewState}
        activeNote={activeNote}
        onCreateNote={startCreating}
        onOpenNote={openNote}
      />
      <div className="editor-area">
        {viewState === 'creating' && (
          <NoteForm 
            onSave={addNote} 
            onCancel={() => setViewState(notes.length > 0 ? 'viewing' : 'empty')} 
          />
        )}
        {viewState === 'viewing' && activeNote && (
          <NoteDetail 
            note={activeNote} 
            onUpdate={updateNote}
            onDelete={deleteNote}
          />
        )}
        {viewState === 'empty' && (
          <div style={{ margin: "auto", fontFamily: "var(--font-display)", color: "var(--text-tertiary)", fontSize: "24px" }}>
            {t('app.select_note')}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;