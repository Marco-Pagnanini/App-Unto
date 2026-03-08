import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskItem from '@tiptap/extension-task-item'; // <-- Importato
import TaskList from '@tiptap/extension-task-list'; // <-- Importato
import { useEffect } from 'react';

interface Props {
  content: string;
  onChange: (richText: string) => void;
  disabled?: boolean;
}

export function TipTapEditor({ content, onChange, disabled = false }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      // Aggiungiamo le due estensioni per le checkbox
      TaskList,
      TaskItem.configure({
        nested: true, // Permette di avere task annidati!
      }),
    ],
    content: content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      
      {/* TOOLBAR */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "var(--bg-elevated)", padding: "8px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", marginBottom: "16px", flexWrap: "wrap" }}>
        
        {/* Grassetto, Corsivo, Barrato */}
        <button 
          type="button" 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          disabled={disabled}
          className={`toolbar-btn ${editor.isActive('bold') ? 'active' : ''}`}
        >
          <b>B</b>
        </button>
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          disabled={disabled}
          className={`toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
        >
          <em>I</em>
        </button>
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()} 
          disabled={disabled}
          className={`toolbar-btn ${editor.isActive('strike') ? 'active' : ''}`}
        >
          <s style={{ fontSize: "12px" }}>S</s>
        </button>
        
        <div className="toolbar-sep"></div>
        
        {/* Titoli e Codice */}
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
          disabled={disabled}
          className={`toolbar-btn ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
          style={{ fontSize: "12px", fontWeight: "bold" }}
        >
          H1
        </button>
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          disabled={disabled}
          className={`toolbar-btn ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
          style={{ fontSize: "12px", fontWeight: "bold" }}
        >
          H2
        </button>
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
          disabled={disabled}
          className={`toolbar-btn ${editor.isActive('codeBlock') ? 'active' : ''}`}
          style={{ fontSize: "11px" }}
        >
          &lt;/&gt;
        </button>
        
        <div className="toolbar-sep"></div>

        {/* Liste, Checkbox e Citazioni */}
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          disabled={disabled}
          className={`toolbar-btn ${editor.isActive('bulletList') ? 'active' : ''}`}
          style={{ fontSize: "14px" }}
        >
          ≡
        </button>
        
        {/*Task List */}
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()} 
          disabled={disabled}
          className={`toolbar-btn ${editor.isActive('taskList') ? 'active' : ''}`}
          style={{ fontSize: "14px" }}
          title="To-Do List"
        >
          ☑
        </button>

        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
          disabled={disabled}
          className={`toolbar-btn ${editor.isActive('blockquote') ? 'active' : ''}`}
          style={{ fontSize: "14px", fontWeight: "bold" }}
        >
          "
        </button>
      </div>
      
      {/* EDITOR */}
      <div style={{ flex: 1, minHeight: "300px", border: "1px solid transparent" }}>
        <EditorContent editor={editor} className="paragraph note-body" />
      </div>
    </div>
  );
}