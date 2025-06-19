import { useState } from 'react'
import { Box, Flex, Text } from '@radix-ui/themes'
import { makeStyles } from '@griffel/react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { JsonView, darkStyles } from 'react-json-view-lite'
import 'react-json-view-lite/dist/index.css'

// We'll create customDarkStyles inside the component to access classes

const useStyles = makeStyles({
  sectionHeader: {
    cursor: 'pointer',
    userSelect: 'none',
    width: '100%',
    borderBottom: '1px solid var(--border-color)',
    '&:hover': {
      backgroundColor: 'var(--gray-3)',
    },
  },
  sectionContent: {
    paddingLeft: 'var(--space-1)',
    paddingRight: 'var(--space-1)',
    paddingBottom: 'var(--space-2)',
    paddingTop: 'var(--space-2)',
    borderBottom: '1px solid var(--border-color)',
  },
  jsonViewer: {
    fontSize: '11px',
    overflow: 'auto',
  },
  transparentContainer: {
    background: 'transparent !important',
    backgroundColor: 'transparent !important',
  },
})

// Sample data based on the Ecto schemas
const sampleMemoryData = {
  facts: [
    {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      source_event_id: 'e12b09c2-1234-4567-8901-234567890123',
      subject: {
        id: '45c789a-5678-9012-3456-789012345678',
        name: 'alice',
      },
      predicate: 'likes',
      object: 'biscuits',
      category: 'preference',
      confidence: 0.85,
      disputed: false,
    },
    {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      source_event_id: 'e12b09c2-1234-4567-8901-234567890123',
      subject: {
        id: '45c789a-5678-9012-3456-789012345678',
        name: 'alice',
      },
      predicate: 'likes',
      object: 'biscuits',
      category: 'preference',
      confidence: 0.85,
      disputed: false,
    },
  ],
}

const sampleContextData = {
  events: [
    {
      id: 'evt_1a2b3c4d5e6f7g8h9i0j',
      role: 'user',
      type: 'text',
      data: {
        content:
          'Hi everyone! I have a question about implementing dark mode in our React app.',
      },
      user: {
        id: 'u45c789a-5678-9012-3456-789012345678',
        name: 'alice',
      },
      inserted_at: '2024-06-16T14:30:00Z',
      updated_at: '2024-06-16T14:30:00Z',
    },
    {
      id: 'evt_2b3c4d5e6f7g8h9i0j1k',
      role: 'assistant',
      assistant: 'claude',
      type: 'tool_use',
      data: {
        tool_name: 'extract_facts',
        parameters: {
          text: 'User is asking about dark mode implementation',
          category: 'question',
        },
      },
      inserted_at: '2024-06-16T14:30:15Z',
      updated_at: '2024-06-16T14:30:15Z',
    },
    {
      id: 'evt_3c4d5e6f7g8h9i0j1k2l',
      role: 'assistant',
      assistant: 'claude',
      type: 'text',
      data: {
        content:
          'I can help with dark mode implementation! Here are some best practices...',
      },
      inserted_at: '2024-06-16T14:31:00Z',
      updated_at: '2024-06-16T14:31:00Z',
    },
  ],
}

const sampleProcessesData = {
  agents: [
    {
      name: 'claude',
      pid: '#PID<0.123.0>',
      tools: ['ask_user_about_themselves', 'extract_facts', 'do_nothing'],
      state: {
        messages_processed: 42,
        facts_extracted: 15,
        tool_calls_made: 8,
        uptime_seconds: 3600,
      },
    },
    {
      name: 'sarah',
      pid: '#PID<0.124.0>',
      tools: ['extract_facts', 'do_nothing'],
      state: {
        messages_processed: 28,
        facts_extracted: 12,
        tool_calls_made: 5,
        uptime_seconds: 2400,
      },
    },
  ],
}

interface AccordionSectionProps {
  title: string
  data: any
  isOpen: boolean
  onToggle: () => void
}

function AccordionSection({
  title,
  data,
  isOpen,
  onToggle,
}: AccordionSectionProps) {
  const classes = useStyles()

  // Custom dark styles without background
  const customDarkStyles = {
    ...darkStyles,
    container: classes.transparentContainer,
  }

  return (
    <Box width="100%">
      <Flex
        align="center"
        justify="between"
        p="3"
        className={classes.sectionHeader}
        onClick={onToggle}
      >
        <Text size="2" weight="medium">
          {title}
        </Text>
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </Flex>
      {isOpen && (
        <Box className={classes.sectionContent}>
          <Box className={classes.jsonViewer}>
            <JsonView
              data={data}
              shouldExpandNode={(level) => level < 2}
              style={customDarkStyles}
              clickToExpandNode={true}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default function ComputerAccordion() {
  const [openSections, setOpenSections] = useState({
    memory: false,
    events: false,
    agents: false,
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <Flex direction="column" width="100%">
      <AccordionSection
        title="Memory"
        data={sampleMemoryData}
        isOpen={openSections.memory}
        onToggle={() => toggleSection('memory')}
      />
      <AccordionSection
        title="Context"
        data={sampleContextData}
        isOpen={openSections.events}
        onToggle={() => toggleSection('events')}
      />
      <AccordionSection
        title="Processes"
        data={sampleProcessesData}
        isOpen={openSections.agents}
        onToggle={() => toggleSection('agents')}
      />
    </Flex>
  )
}
