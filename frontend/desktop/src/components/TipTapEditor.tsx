import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskItem from '@tiptap/extension-task-item'; 
import TaskList from '@tiptap/extension-task-list'; 
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // <-- Importata per i tooltip

interface Props {
  content: string;
  onChange: (richText: string) => void;
  disabled?: boolean;
}

export function TipTapEditor({ content, onChange, disabled = false }: Props) {
  const { t } = useTranslation(); // <-- Inizializzata la traduzione

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true, 
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
          title={t('editor.bold')}
        >
          <b>B</b>
        </button>
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          disabled={disabled}
          className={`toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
          title={t('editor.italic')}
        >
          <em>I</em>
        </button>
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()} 
          disabled={disabled}
          className={`toolbar-btn ${editor.isActive('strike') ? 'active' : ''}`}
          title={t('editor.strike')}
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
          title={t('editor.h1')}
        >
          H1
        </button>
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          disabled={disabled}
          className={`toolbar-btn ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
          style={{ fontSize: "12px", fontWeight: "bold" }}
          title={t('editor.h2')}
        >
          H2
        </button>
        
        {/* Aggiunto bottone H3 */}
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
          disabled={disabled}
          className={`toolbar-btn ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
          style={{ fontSize: "12px", fontWeight: "bold" }}
          title={t('editor.h3')}
        >
          H3
        </button>

        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
          disabled={disabled}
          className={`toolbar-btn ${editor.isActive('codeBlock') ? 'active' : ''}`}
          style={{ fontSize: "11px" }}
          title={t('editor.code_block')}
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
          title={t('editor.bullet_list')}
        >
          ≡
        </button>
        
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()} 
          disabled={disabled}
          className={`toolbar-btn ${editor.isActive('taskList') ? 'active' : ''}`}
          style={{ fontSize: "14px" }}
          title={t('editor.todo_list')}
          >
          ☑
        </button>

        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
          disabled={disabled}
          className={`toolbar-btn ${editor.isActive('blockquote') ? 'active' : ''}`}
          style={{ fontSize: "14px", fontWeight: "bold" }}
          title={t('editor.blockquote')}
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