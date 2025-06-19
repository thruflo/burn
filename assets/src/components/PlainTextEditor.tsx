import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { makeStyles } from '@griffel/react'
import Placeholder from '@tiptap/extension-placeholder'

const useStyles = makeStyles({
  editor: {
    '& .ProseMirror': {
      padding: '12px',
      margin: '0 -12px',
      fontSize: '22px',
      lineHeight: '28px',
      borderRadius: '4px',
      '&:focus': {
        outline: 'none',
      },
      '& p': {
        margin: '0',
      },
      '&.ProseMirror-focused': {
        outline: '2px solid var(--focus-8)',
        outlineOffset: '-1px',
      },
      '& .is-editor-empty:first-child::before': {
        content: 'attr(data-placeholder)',
        float: 'left',
        color: 'var(--gray-11)',
        pointerEvents: 'none',
        height: '0',
      },
    },
  },
})

interface PlainTextEditorProps {
  content: string
  onChange?: (content: string) => void
  placeholder?: string
  onKeyDown?: (event: KeyboardEvent) => void
}

export function PlainTextEditor({
  content,
  onChange,
  placeholder = '',
  onKeyDown,
}: PlainTextEditorProps) {
  const classes = useStyles()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable all formatting features
        bold: false,
        italic: false,
        strike: false,
        code: false,
        bulletList: false,
        orderedList: false,
        heading: false,
        blockquote: false,
        horizontalRule: false,
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      // Get plain text content
      onChange?.(editor.getText())
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        onKeyDown?.(event)
        return false
      },
    },
  })

  return (
    <div className={classes.editor}>
      <EditorContent editor={editor} />
    </div>
  )
}
