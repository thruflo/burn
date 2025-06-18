import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { makeStyles } from '@griffel/react'
import { IconButton, Tooltip, Flex } from '@radix-ui/themes'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Heading1,
  Heading2,
  Link,
} from 'lucide-react'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from 'tiptap-markdown'
import LinkExtension from '@tiptap/extension-link'

const useStyles = makeStyles({
  editor: {
    '& .ProseMirror': {
      padding: '12px',
      fontSize: '16px',
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
      '& a': {
        color: 'var(--blue-11)',
        textDecoration: 'underline',
        '&:hover': {
          color: 'var(--blue-12)',
        },
      },
    },
  },
  bordered: {
    '& .ProseMirror': {
      border: '1px solid var(--gray-7)',
    },
  },
  default: {
    '& .ProseMirror': {
      margin: '0 -12px',
    },
  },
  bubbleMenu: {
    display: 'flex',
    backgroundColor: 'var(--gray-1)',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid var(--gray-7)',
    gap: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '& .is-active': {
      backgroundColor: 'var(--gray-5)',
    },
  },
})

interface RichTextEditorProps {
  content: string
  onChange?: (content: string) => void
  placeholder?: string
  border?: boolean
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = '',
  border = false,
}: RichTextEditorProps) {
  const classes = useStyles()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      Markdown.configure({
        html: true,
        tightLists: true,
        bulletListMarker: '-',
        linkify: true,
        breaks: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const markdown = editor.storage.markdown.getMarkdown()
      onChange?.(markdown)
    },
  })

  return (
    <div
      className={`${classes.editor} ${border ? classes.bordered : classes.default}`}
    >
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className={classes.bubbleMenu}
        >
          <Flex gap="2">
            <Tooltip content="Heading 1">
              <IconButton
                variant="ghost"
                size="1"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={
                  editor.isActive('heading', { level: 1 }) ? 'is-active' : ''
                }
              >
                <Heading1 size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip content="Heading 2">
              <IconButton
                variant="ghost"
                size="1"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={
                  editor.isActive('heading', { level: 2 }) ? 'is-active' : ''
                }
              >
                <Heading2 size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip content="Bold">
              <IconButton
                variant="ghost"
                size="1"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
              >
                <Bold size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip content="Italic">
              <IconButton
                variant="ghost"
                size="1"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
              >
                <Italic size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip content="Link">
              <IconButton
                variant="ghost"
                size="1"
                onClick={() => {
                  const url = window.prompt('Enter URL')
                  if (url) {
                    editor.chain().focus().setLink({ href: url }).run()
                  }
                }}
                className={editor.isActive('link') ? 'is-active' : ''}
              >
                <Link size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip content="Bullet List">
              <IconButton
                variant="ghost"
                size="1"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'is-active' : ''}
              >
                <List size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip content="Ordered List">
              <IconButton
                variant="ghost"
                size="1"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'is-active' : ''}
              >
                <ListOrdered size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip content="Code">
              <IconButton
                variant="ghost"
                size="1"
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={editor.isActive('code') ? 'is-active' : ''}
              >
                <Code size={16} />
              </IconButton>
            </Tooltip>
          </Flex>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </div>
  )
}
