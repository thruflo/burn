import { Box, Text, Badge } from '@radix-ui/themes'
import { makeStyles } from '@griffel/react'
import { User as UserIcon, Bot } from 'lucide-react'
import { JsonView, darkStyles } from 'react-json-view-lite'

import type { EventResult } from './types'

const useStyles = makeStyles({
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
  icon: {
    display: 'inline',
    verticalAlign: 'middle',
  },
  badge: {
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    display: 'inline',
    verticalAlign: 'middle',
  },
  text: {
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    display: 'inline',
    color: 'var(--gray-12)',
  },
  jsonViewContainer: {
    background: 'transparent !important',
    backgroundColor: 'transparent !important',
    fontSize: '11px',
    fontWeight: '500',
  },
})

type Props = {
  event: EventResult
}

function EventItem({ event }: Props) {
  const classes = useStyles()

  console.log('XXX Needed???')
  console.log('darkStyles', darkStyles)

  const customDarkStyles = {
    ...darkStyles,
    container: `${classes.jsonViewContainer} inline-json-view`,
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

  console.log('customDarkStyles', customDarkStyles)

  const toolTypes = ['tool_use', 'tool_result']
  const typeColor = toolTypes.includes(event.type) ? 'orange' : 'green'
  const typeLabel = event.type === 'text' ? 'message' : event.type

  const attrColor = event.role === 'assistant' ? 'purple' : 'blue'
  const attrLabel = event.type === 'text' ? 'from' : 'by'
  const attrName = (
    event.role === 'user' ? event.user_name : event.assistant
  ) as string

  const IconComponent = event.role === 'user' ? UserIcon : Bot

  return (
    <Box className={classes.eventItem}>
      <IconComponent
        size={12}
        color="var(--gray-12)"
        className={classes.icon}
      />
      <Badge
        size="1"
        variant="soft"
        color={typeColor}
        className={classes.badge}
      >
        {typeLabel}
      </Badge>
      <Text size="1" weight="medium" className={classes.text}>
        {attrLabel}
      </Text>
      <Badge
        size="1"
        variant="soft"
        color={attrColor}
        className={classes.badge}
      >
        {attrName}
      </Badge>
      <JsonView
        data={event.data}
        style={customDarkStyles}
        shouldExpandNode={() => false}
        clickToExpandNode={true}
      />
    </Box>
  )
}

export default EventItem
