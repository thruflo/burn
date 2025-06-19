import { useState, useRef, useEffect } from 'react'
import { Box, ScrollArea } from '@radix-ui/themes'
import { makeStyles } from '@griffel/react'
import ChatMessage, { Message } from './ChatMessage'
import ChatInput from './ChatInput'
import { v4 as uuidv4 } from 'uuid'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  messagesContainer: {
    flex: 1,
    width: '100%',
  },
  messagesInner: {
    padding: 'var(--space-4)',
    width: '100%',
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'var(--text-secondary)',
    fontSize: '16px',
  },
})

export default function ChatArea() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content:
        'Hi everyone! I have a question about implementing dark mode in our React app.',
      sender: 'user',
      timestamp: new Date('2024-06-16T14:30:00Z'), // June 16, 2024 at 2:30 PM UTC
      username: 'You',
    },
    {
      id: '2',
      content:
        'Hey! I actually just worked on that recently. What specific aspect are you struggling with?',
      sender: 'user',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      username: 'alice',
      avatarUrl: 'https://i.pravatar.cc/150?u=alice',
    },
    {
      id: '3',
      content:
        'I can help with dark mode implementation! Here are some best practices:\n\n1. Use CSS custom properties for theme colors\n2. Implement a theme context with React\n3. Store the preference in localStorage\n4. Use system preference as default\n\nWould you like me to show you a code example?',
      sender: 'ai',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      username: 'claude',
      avatarUrl: 'https://i.pravatar.cc/150?u=claude',
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const classes = useStyles()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date(),
      username: 'You',
    }

    setMessages((prev) => [...prev, newMessage])

    // Simulate AI response (replace with actual AI integration later)
    setTimeout(() => {
      const aiResponse: Message = {
        id: uuidv4(),
        content: `I received your message: "${content}". This is a placeholder response.`,
        sender: 'ai',
        timestamp: new Date(),
        username: 'Assistant',
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <Box className={classes.container}>
      <ScrollArea className={classes.messagesContainer}>
        <Box className={classes.messagesInner}>
          {messages.length === 0 ? (
            <Box className={classes.emptyState}>
              Start a conversation by typing a message below
            </Box>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          <div ref={messagesEndRef} />
        </Box>
      </ScrollArea>
      <Box style={{ flexShrink: 0 }}>
        <ChatInput onSend={handleSendMessage} />
      </Box>
    </Box>
  )
}
