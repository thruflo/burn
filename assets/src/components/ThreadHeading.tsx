import { Text } from '@radix-ui/themes'
import { MessagesSquare } from 'lucide-react'
import { makeStyles } from '@griffel/react'

const useThreadHeadingStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  icon: {
    marginRight: 'var(--space-2)',
  },
  text: {
    color: 'var(--gray-12)',
  },
})

type ThreadHeadingProps = {
  title: string
}

export default function ThreadHeading({ title }: ThreadHeadingProps) {
  const classes = useThreadHeadingStyles()

  return (
    <div className={classes.container}>
      <span className={classes.icon}>
        <MessagesSquare size={14} />
      </span>
      <Text size="2" weight="medium" className={classes.text}>
        {title}
      </Text>
    </div>
  )
}
