import { useState } from 'react'
import { Box, Flex, Text, Badge, Tooltip, TextField } from '@radix-ui/themes'
import { makeStyles } from '@griffel/react'
import { ChevronDown, ChevronRight, Lightbulb, User, Bot } from 'lucide-react'
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
  sectionHeaderDisabled: {
    cursor: 'not-allowed',
    userSelect: 'none',
    width: '100%',
    borderBottom: '1px solid var(--border-color)',
    opacity: 0.5,
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
    fontSize: '11px',
    fontWeight: '500',
  },
  factsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
    paddingTop: 'var(--space-1)',
    paddingBottom: 'var(--space-1)',
  },
  factItem: {
    lineHeight: '1.4',
    '& > *': {
      marginRight: 'var(--space-1)',
    },
    '& > *:last-child': {
      marginRight: 0,
    },
  },
  factsContainer: {
    marginLeft: 'var(--space-1)',
    marginRight: 'var(--space-1)',
  },
  factsFilter: {
    marginBottom: 'var(--space-1)',
    boxShadow: 'inset 0 0 0 var(--text-field-border-width) var(--gray-a4)',
    '&:focus-within': {
      boxShadow: 'inset 0 0 0 0.5px rgb(146, 129, 255) !important',
      outline: 'none !important',
    },
    '& input': {
      fontSize: '11px',
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: 'none',
      outline: 'none',
      '&:focus': {
        outline: 'none',
        boxShadow: 'none',
      },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: 'none',
      },
      '&::placeholder': {
        color: 'var(--gray-8)',
        fontSize: '11px',
      },
    },
  },
  eventsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
    paddingTop: 'var(--space-1)',
    paddingBottom: 'var(--space-1)',
  },
  eventItem: {
    lineHeight: '1.4',
    '& > *': {
      marginRight: 'var(--space-1)',
    },
    '& > *:last-child': {
      marginRight: 0,
    },
    '& .inline-json-view': {
      display: 'inline !important',
      verticalAlign: 'middle !important',
      '& > div': {
        display: 'inline !important',
        verticalAlign: 'middle !important',
      },
    },
    '& .json-punctuation, & .json-label, & .json-basic-element': {
      color: 'var(--gray-12) !important',
      fontWeight: '500 !important',
      fontSize: '12px !important',
    },
    '& .json-label': {
      marginRight: '4px !important',
      fontWeight: '500 !important',
      color: 'var(--gray-12) !important',
    },
    '& .json-clickable-label': {
      marginRight: '4px !important',
      fontWeight: '500 !important',
      color: 'var(--gray-12) !important',
    },
    '& .inline-json-view ul': {
      paddingLeft: 'var(--space-4) !important',
    },
    '& .inline-json-view > .json-basic-element > ul': {
      marginTop: 'var(--space-1) !important',
    },
    '& .json-string-value': {
      color: 'var(--cyan-9) !important',
    },
    '& .json-number-value': {
      color: 'var(--purple-9) !important',
    },
    '& .json-boolean-value': {
      color: 'var(--purple-9) !important',
    },
    '& .json-null-value, & .json-undefined-value': {
      color: 'var(--purple-9) !important',
    },
    '& .inline-json-view span.json-punctuation + span': {
      marginLeft: '2px !important',
      marginRight: '2px !important',
    },
  },
})

// Fact component for displaying subject-predicate-object relationships
interface Fact {
  id: string
  subject: { id: string; name: string }
  predicate: string
  object: string
  category: string
  confidence: number
  disputed: boolean
}

function FactItem({ fact }: { fact: Fact }) {
  const classes = useStyles()

  // Helper function to get confidence level text
  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.8) return 'High confidence'
    if (confidence >= 0.5) return 'Medium confidence'
    return 'Low confidence'
  }

  // Determine icon style based on confidence
  const getConfidenceIcon = (confidence: number) => {
    const tooltipContent = `${getConfidenceLevel(confidence)} (${confidence.toFixed(2)})`

    if (confidence >= 0.8) {
      // High confidence: solid green icon
      return (
        <Tooltip content={tooltipContent}>
          <Lightbulb size={12} color="var(--green-9)" fill="var(--green-9)" />
        </Tooltip>
      )
    } else if (confidence >= 0.5) {
      // Medium confidence: solid orange icon
      return (
        <Tooltip content={tooltipContent}>
          <Lightbulb size={12} color="var(--orange-9)" fill="var(--orange-9)" />
        </Tooltip>
      )
    } else {
      // Low confidence: outlined red icon
      return (
        <Tooltip content={tooltipContent}>
          <Lightbulb size={12} color="var(--red-9)" fill="none" />
        </Tooltip>
      )
    }
  }

  return (
    <Box className={classes.factItem}>
      {getConfidenceIcon(fact.confidence)}
      <Badge
        size="1"
        variant="soft"
        color="blue"
        style={{
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          display: 'inline',
        }}
      >
        {fact.subject.name}
      </Badge>
      <Text
        size="1"
        weight="medium"
        style={{
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          display: 'inline',
          color: 'var(--gray-12)',
        }}
      >
        {fact.predicate}
      </Text>
      <Badge
        size="1"
        variant="soft"
        color="orange"
        style={{
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          display: 'inline',
        }}
      >
        {fact.object}
      </Badge>
    </Box>
  )
}

function FactsList({ facts, filter }: { facts: Fact[]; filter: string }) {
  const classes = useStyles()

  // Filter facts based on search text
  const filteredFacts = facts.filter((fact) => {
    if (!filter.trim()) return true

    const searchText = filter.toLowerCase()
    const subjectMatch = fact.subject.name.toLowerCase().includes(searchText)
    const predicateMatch = fact.predicate.toLowerCase().includes(searchText)
    const objectMatch = fact.object.toLowerCase().includes(searchText)

    return subjectMatch || predicateMatch || objectMatch
  })

  return (
    <Box className={classes.factsList}>
      {filteredFacts.map((fact) => (
        <FactItem key={fact.id} fact={fact} />
      ))}
    </Box>
  )
}

// Event component for displaying context events
interface Event {
  id: string
  role: 'assistant' | 'user'
  type: 'text' | 'tool_use' | 'tool_result'
  assistant?: string
  user?: { id: string; name: string }
  data: any
  inserted_at: string
  updated_at: string
}

function EventItem({ event }: { event: Event }) {
  const classes = useStyles()

  // Get badge color based on event type
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'text':
        return 'green'
      case 'tool_use':
        return 'orange'
      case 'tool_result':
        return 'orange'
      default:
        return 'green'
    }
  }

  // Get display type
  const getDisplayType = (type: string) => {
    return type === 'text' ? 'message' : type
  }

  // Get attribution name
  const getAttributionName = (event: Event) => {
    if (event.role === 'user') {
      return event.user?.name || 'unknown'
    } else {
      return event.assistant || 'assistant'
    }
  }

  // Custom dark styles for collapsed JSON
  const customDarkStyles = {
    ...darkStyles,
    container: classes.transparentContainer,
    punctuation: 'json-punctuation',
    label: 'json-label',
    clickableLabel: 'json-clickable-label',
    basicChildStyle: 'json-basic-element',
    stringValue: 'json-string-value',
    numberValue: 'json-number-value',
    booleanValue: 'json-boolean-value',
    nullValue: 'json-null-value',
    undefinedValue: 'json-undefined-value',
  }

  return (
    <Box className={classes.eventItem}>
      {event.role === 'user' ? (
        <User
          size={12}
          color="var(--gray-12)"
          style={{ display: 'inline', verticalAlign: 'middle' }}
        />
      ) : (
        <Bot
          size={12}
          color="var(--gray-12)"
          style={{ display: 'inline', verticalAlign: 'middle' }}
        />
      )}
      <Badge
        size="1"
        variant="soft"
        color={getTypeBadgeColor(event.type)}
        style={{
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          display: 'inline',
          verticalAlign: 'middle',
        }}
      >
        {getDisplayType(event.type)}
      </Badge>
      <Text
        size="1"
        weight="medium"
        style={{
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          display: 'inline',
          color: 'var(--gray-12)',
        }}
      >
        {event.type === 'text' ? 'from' : 'by'}
      </Text>
      <Badge
        size="1"
        variant="soft"
        color={event.role === 'assistant' ? 'purple' : 'blue'}
        style={{
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          display: 'inline',
          verticalAlign: 'middle',
        }}
      >
        {getAttributionName(event)}
      </Badge>
      <JsonView
        data={event.data}
        shouldExpandNode={() => false}
        style={{
          ...customDarkStyles,
          container: `${classes.transparentContainer} inline-json-view`,
        }}
        clickToExpandNode={true}
      />
    </Box>
  )
}

function EventsList({ events, filter }: { events: Event[]; filter: string }) {
  const classes = useStyles()

  // Helper function to extract searchable text from event data
  const extractTextFromData = (data: any): string => {
    if (typeof data === 'string') return data
    if (typeof data === 'number' || typeof data === 'boolean')
      return String(data)
    if (data === null || data === undefined) return ''
    if (Array.isArray(data)) {
      return data.map((item) => extractTextFromData(item)).join(' ')
    }
    if (typeof data === 'object') {
      return Object.values(data)
        .map((value) => extractTextFromData(value))
        .join(' ')
    }
    return ''
  }

  // Filter events based on search text
  const filteredEvents = events.filter((event) => {
    if (!filter.trim()) return true

    const searchText = filter.toLowerCase()
    const typeMatch = event.type.toLowerCase().includes(searchText)
    const roleMatch = event.role.toLowerCase().includes(searchText)
    const assistantMatch =
      event.assistant?.toLowerCase().includes(searchText) || false
    const userNameMatch =
      event.user?.name.toLowerCase().includes(searchText) || false
    const dataMatch = extractTextFromData(event.data)
      .toLowerCase()
      .includes(searchText)

    return (
      typeMatch || roleMatch || assistantMatch || userNameMatch || dataMatch
    )
  })

  return (
    <Box className={classes.eventsList}>
      {filteredEvents.map((event) => (
        <EventItem key={event.id} event={event} />
      ))}
    </Box>
  )
}

// Sample data based on the Ecto schemas
const sampleMemoryData = [
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
    id: 'a1b2c3d4-5678-9012-3456-789012345678',
    source_event_id: 'e23c10d3-2345-5678-9012-345678901234',
    subject: {
      id: '45c789a-5678-9012-3456-789012345678',
      name: 'alice',
    },
    predicate: 'works with',
    object: 'React',
    category: 'skill',
    confidence: 0.92,
    disputed: false,
  },
  {
    id: 'b2c3d4e5-6789-0123-4567-890123456789',
    source_event_id: 'e34d11e4-3456-6789-0123-456789012345',
    subject: {
      id: '56d890b-6789-0123-4567-890123456789',
      name: 'sarah',
    },
    predicate: 'loves',
    object: 'dark mode',
    category: 'preference',
    confidence: 0.78,
    disputed: false,
  },
]

const sampleContextData = [
  {
    id: 'evt_1a2b3c4d5e6f7g8h9i0j',
    role: 'user' as const,
    type: 'text' as const,
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
    role: 'assistant' as const,
    assistant: 'claude',
    type: 'tool_use' as const,
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
    role: 'assistant' as const,
    assistant: 'claude',
    type: 'tool_result' as const,
    data: {
      tool_name: 'analyze_project',
      execution_time: 1247.5,
      success: true,
      errors: null,
      warnings: [],
      metadata: {
        version: '2.1.4',
        environment: 'production',
        features_enabled: ['dark_mode', 'analytics', 'caching'],
        performance_metrics: {
          memory_usage: 45.7,
          cpu_utilization: 23.4,
          cache_hit_ratio: 0.87,
        },
        user_preferences: {
          theme: 'dark',
          notifications: true,
          auto_save: false,
          language: 'en-US',
        },
      },
      results: {
        components_analyzed: 42,
        issues_found: [
          {
            severity: 'warning',
            type: 'accessibility',
            component: 'UserProfile',
            description: 'Missing aria-label attribute',
            line_number: 127,
            suggestions: [
              'Add descriptive aria-label',
              'Use semantic HTML elements',
            ],
          },
          {
            severity: 'error',
            type: 'performance',
            component: 'DataTable',
            description: 'Unnecessary re-renders detected',
            line_number: null,
            suggestions: ['Implement React.memo', 'Optimize dependency arrays'],
          },
        ],
        dependencies: {
          outdated: ['react@17.0.2', 'lodash@4.17.20'],
          vulnerable: [],
          total_count: 156,
          dev_dependencies: 43,
        },
        code_quality: {
          test_coverage: 0.847,
          complexity_score: 6.3,
          maintainability_index: 78.2,
          technical_debt_ratio: 0.12,
        },
      },
      timestamps: {
        started_at: '2024-06-16T14:30:45.123Z',
        completed_at: '2024-06-16T14:31:00.891Z',
        duration_ms: 15768,
      },
    },
    inserted_at: '2024-06-16T14:31:00Z',
    updated_at: '2024-06-16T14:31:00Z',
  },
]

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
  isMemory?: boolean
  isContext?: boolean
  filter?: string
  onFilterChange?: (filter: string) => void
  disabled?: boolean
}

function AccordionSection({
  title,
  data,
  isOpen,
  onToggle,
  isMemory = false,
  isContext = false,
  filter = '',
  onFilterChange,
  disabled = false,
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
        className={
          disabled ? classes.sectionHeaderDisabled : classes.sectionHeader
        }
        onClick={disabled ? undefined : onToggle}
      >
        <Text size="2" weight="medium">
          {title}
        </Text>
        {disabled ? null : isOpen ? (
          <ChevronDown size={14} />
        ) : (
          <ChevronRight size={14} />
        )}
      </Flex>
      {isOpen && (
        <Box className={classes.sectionContent}>
          {isMemory ? (
            <Box className={classes.factsContainer}>
              {onFilterChange && (
                <TextField.Root
                  size="1"
                  placeholder="Filter facts..."
                  value={filter}
                  onChange={(e) => onFilterChange(e.target.value)}
                  className={classes.factsFilter}
                />
              )}
              <FactsList facts={data} filter={filter} />
            </Box>
          ) : isContext ? (
            <Box className={classes.factsContainer}>
              {onFilterChange && (
                <TextField.Root
                  size="1"
                  placeholder="Filter events..."
                  value={filter}
                  onChange={(e) => onFilterChange(e.target.value)}
                  className={classes.factsFilter}
                />
              )}
              <EventsList events={data} filter={filter} />
            </Box>
          ) : (
            <Box className={classes.jsonViewer}>
              <JsonView
                data={data}
                shouldExpandNode={(level) => level < 2}
                style={customDarkStyles}
                clickToExpandNode={true}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default function ComputerAccordion() {
  const [openSections, setOpenSections] = useState({
    memory: true,
    events: true,
    agents: false,
  })
  const [factsFilter, setFactsFilter] = useState('')
  const [eventsFilter, setEventsFilter] = useState('')

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
        isMemory={true}
        filter={factsFilter}
        onFilterChange={setFactsFilter}
      />
      <AccordionSection
        title="Context"
        data={sampleContextData}
        isOpen={openSections.events}
        onToggle={() => toggleSection('events')}
        isContext={true}
        filter={eventsFilter}
        onFilterChange={setEventsFilter}
      />
      <AccordionSection
        title="Processes"
        data={sampleProcessesData}
        isOpen={openSections.agents}
        onToggle={() => toggleSection('agents')}
        disabled={true}
      />
    </Flex>
  )
}
