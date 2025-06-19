import { useState, useRef, useEffect } from 'react'
import { Box, Flex, IconButton, TextArea } from '@radix-ui/themes'
import { makeStyles } from '@griffel/react'
import { Send } from 'lucide-react'

const useStyles = makeStyles({
  container: {
    borderTop: '1px solid var(--border-color)',
    flexShrink: 0,
    padding: 'var(--space-4)',
  },
})

interface ChatInputProps {
  onSend: (message: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function ChatInput({
  onSend,
  placeholder = 'Type a message...',
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const classes = useStyles()

  // Focus input on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || disabled) return
    onSend(message.trim())
    setMessage('')

    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  // Auto-resize textarea as content grows
  const adjustTextareaHeight = () => {
    if (!textareaRef.current) return
    const textarea = textareaRef.current
    textarea.style.height = 'auto'
    const maxHeight = window.innerHeight * 0.2 // 20% of screen height
    const newHeight = Math.min(textarea.scrollHeight, maxHeight)
    textarea.style.height = `${newHeight}px`
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [message])

  return (
    <Box className={classes.container}>
      <form onSubmit={handleSubmit}>
        <Box style={{ position: 'relative' }}>
          <TextArea
            ref={textareaRef}
            placeholder={placeholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={disabled}
            style={{
              resize: 'none',
              minHeight: '40px',
              maxHeight: '20vh',
              paddingRight: 'var(--space-8)',
              backgroundColor: 'transparent',
            }}
            onKeyDown={(e) => {
              if (
                e.key === 'Enter' &&
                !e.shiftKey &&
                !e.altKey &&
                !e.ctrlKey &&
                !e.metaKey
              ) {
                e.preventDefault()
                if (message.trim() && !disabled) {
                  handleSubmit(e)
                }
              }
            }}
          />
          <Flex
            direction="row"
            gap="2"
            align="center"
            style={{
              position: 'absolute',
              bottom: 'var(--space-2)',
              right: 'var(--space-2)',
              zIndex: 1,
            }}
          >
            <IconButton
              type="submit"
              size="2"
              variant="solid"
              radius="full"
              disabled={!message.trim() || disabled}
              style={{ color: '#fff' }}
            >
              <Send size={16} />
            </IconButton>
          </Flex>
        </Box>
      </form>
    </Box>
  )
}
