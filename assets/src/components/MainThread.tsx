import { useState } from 'react'
import { makeStyles } from '@griffel/react'
import { Flex, Box } from '@radix-ui/themes'

import ThreadEditForm from './MainThread/ThreadEditForm'
import ThreadEditTopBar from './MainThread/ThreadEditTopBar'
import ThreadTopBar from './MainThread/ThreadTopBar'
import ChatArea from './MainThread/Chat/ChatArea'

const useClasses = makeStyles({
  content: {
    flex: 1,
    overflow: 'hidden',
  },
})

type Props = {
  threadId: string
}

function MainThread({ threadId }: Props) {
  const classes = useClasses()
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <Flex direction="column" height="100%">
        <Box>
          <ThreadEditTopBar onClose={() => setIsEditing(false)} />
        </Box>
        <Box className={classes.content}>
          <ThreadEditForm threadId={threadId} />
        </Box>
      </Flex>
    )
  }

  return (
    <Flex direction="column" height="100%">
      <Box>
        <ThreadTopBar
          threadId={threadId}
          onEditClick={() => setIsEditing(true)}
        />
      </Box>
      <Box className={classes.content}>
        <ChatArea />
      </Box>
    </Flex>
  )
}

export default MainThread
