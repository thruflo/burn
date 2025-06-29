import { Box, Badge, Text, Tooltip } from '@radix-ui/themes'
import { makeStyles, mergeClasses } from '@griffel/react'
import { Lightbulb } from 'lucide-react'
import type { FactResult } from '../../types'

type ConfidenceConfig = {
  color: string
  fill: string
  level: string
}

function confidenceConfig(confidence: number): ConfidenceConfig {
  if (confidence >= 0.8) {
    return {
      level: 'High confidence',
      color: 'var(--green-9)',
      fill: 'var(--green-9)',
    }
  }

  if (confidence >= 0.5) {
    return {
      level: 'Medium confidence',
      color: 'var(--orange-9)',
      fill: 'var(--orange-9)',
    }
  }

  return {
    level: 'Low confidence',
    color: 'var(--red-9)',
    fill: '',
  }
}

const useStyles = makeStyles({
  factItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-1)',
    lineHeight: '1.4',
    paddingTop: 'var(--space-1)',
    paddingBottom: 'var(--space-1)',
  },
  badge: {
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  },
  predicate: {
    color: 'var(--gray-12)',
  },
})

type Props = {
  fact: FactResult
}

function FactItem({ fact }: Props) {
  const classes = useStyles()
  const { color, fill, level } = confidenceConfig(fact.confidence)
  const tooltipContent = `${level} (${fact.confidence.toFixed(2)})`
  const textClassName = mergeClasses(classes.badge, classes.predicate)

  return (
    <Box className={classes.factItem}>
      <Tooltip content={tooltipContent}>
        <Lightbulb size={12} color={color} fill={fill} />
      </Tooltip>
      <Badge size="1" variant="soft" color="blue" className={classes.badge}>
        {fact.subject}
      </Badge>
      <Text size="1" weight="medium" className={textClassName}>
        {fact.predicate}
      </Text>
      <Badge size="1" variant="soft" color="orange" className={classes.badge}>
        {fact.object}
      </Badge>
    </Box>
  )
}

export default FactItem
