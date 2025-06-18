import { makeStyles } from '@griffel/react'
import { Flex, Text } from '@radix-ui/themes'
import { PriorityPicker } from './Priority'
import { StatusPicker } from './Status'
import UserAvatar from './UserAvatar'
import { useNavigate } from '@tanstack/react-router'
const useIssueLineClasses = makeStyles({
  issueLine: {
    borderBottom: '1px solid var(--gray-2)',
    '&:hover': {
      backgroundColor: 'var(--gray-2)',
    },
  },
})

export function IssueLine() {
  const classes = useIssueLineClasses()
  const navigate = useNavigate()
  return (
    <Flex
      className={classes.issueLine}
      direction="row"
      justify="between"
      align="center"
      py="2"
      px="3"
      onClick={() => {
        navigate({ to: '/issue/$issueId', params: { issueId: '1' } })
      }}
    >
      <PriorityPicker priority="urgent" setPriority={() => {}} mr="3" />
      <StatusPicker status="in-progress" setStatus={() => {}} mr="3" />
      <Flex flexGrow="1" justify="between" align="center">
        <Text size="1" weight="medium">
          Issue 1
        </Text>
      </Flex>
      <Text size="1" mr="3">
        May 19th
      </Text>
      <UserAvatar username="John Doe" size="small" />
    </Flex>
  )
}
