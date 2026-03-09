import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { API } from "./services/api";
import { Note } from "./types/types";
import { Topbar } from "./components/Topbar";
import { Sidebar } from "./components/Sidebar";
import { NoteForm } from "./components/NoteForm";
import { Login } from "./components/Login";
import { NoteDetail } from "./components/NoteDetail";
import "./styles/global.css";

function App() {
  const { t } = useTranslation();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [viewState, setViewState] = useState<'empty' | 'creating' | 'viewing'>('empty');
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const data = await API.getNotes();
      
      if (Array.isArray(data)) {
        setNotes(data);
      } else if (data && typeof data === 'object' && Array.isArray((data as any).data)) {
        setNotes((data as any).data);
      } else {
        console.warn(t('app.error_api_format'), data);
        setNotes([]); 
      }

    } catch (error) {
      console.error(t('app.error_loading'), error);
      localStorage.removeItem("appunto_api_token");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedUrl = localStorage.getItem("appunto_api_url");
    const storedToken = localStorage.getItem("appunto_api_token");
    
    if (storedUrl && storedToken) {
      setIsAuthenticated(true);
      fetchNotes();
    } else {
      setIsLoading(false); 
    }
  }, []);

  const handleLogin = (url: string, token: string, displayUrl: string) => {
    localStorage.setItem("appunto_api_url", url);
    localStorage.setItem("appunto_api_token", token);
    localStorage.setItem("appunto_display_url", displayUrl);
    setIsAuthenticated(true);
    fetchNotes(); 
  };

  const handleLogout = () => {
    localStorage.removeItem("appunto_api_token");
    setIsAuthenticated(false);
    setNotes([]);
    setActiveNote(null);
    setViewState('empty');
  };

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
      console.error(t('app.error_saving_log'), e);
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
      console.error(t('app.error_updating'), e);
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
      console.error(t('app.error_deleting'), e);
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

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
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
        onLogout={handleLogout}
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