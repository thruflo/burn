import { createFileRoute, useParams } from '@tanstack/react-router'
import ScreenWithHeader from '../../components/ScreenWithHeader'
import { Trash2, X } from 'lucide-react'
import {
  IconButton,
  Tooltip,
  Card,
  Box,
  Flex,
  Text,
  Button,
} from '@radix-ui/themes'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import UserAvatar from '../../components/UserAvatar'
import { PrioritySelect } from '../../components/Priority'
import { StatusSelect } from '../../components/Status'
import { Priority, Status } from '../../types'
import { RichTextEditor } from '../../components/RichTextEditor'
import { PlainTextEditor } from '../../components/PlainTextEditor'

export const Route = createFileRoute(`/issue/$issueId`)({
  component: Index,
})

function Index() {
  const { issueId } = useParams({ from: '/issue/$issueId' })
  const navigate = useNavigate()

  // Auto-growing title textarea state and ref
  const [title, setTitle] = useState('This is a much better issue title')
  const [priority, setPriority] = useState<Priority>('medium')
  const [status, setStatus] = useState<Status>('todo')
  const [description, setDescription] = useState(
    'This is a more realistic and descriptive issue description that gives context to the problem.'
  )

  return (
    <ScreenWithHeader
      title={`My Project / Issue ${issueId}`}
      toolbarItems={
        <>
          <Tooltip content="Delete issue">
            <IconButton variant="ghost" size="1" ml="3">
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip content="Close">
            <IconButton
              variant="ghost"
              size="1"
              ml="3"
              onClick={() => navigate({ to: '/' })}
            >
              <X size={16} />
            </IconButton>
          </Tooltip>
        </>
      }
    >
      <Box px="3">
        <Box maxWidth="700px" mx="auto" py="5">
          <Flex direction="column" gap="5">
            <Box>
              <PlainTextEditor
                content={title}
                onChange={setTitle}
                placeholder="Issue title"
              />
              <Flex mt="2" mb="2" gap="2">
                <PrioritySelect priority={priority} setPriority={setPriority} />
                <StatusSelect status={status} setStatus={setStatus} />
              </Flex>
              <RichTextEditor
                content={description}
                onChange={setDescription}
                placeholder="Issue description"
              />
            </Box>

            <Box>
              <Text as="div" weight="bold" size="3" mb="2">
                Comments
              </Text>
              <Flex direction="column" gap="2">
                {comments.map((comment, i) => (
                  <Card key={i} size="2" variant="classic" mb="2">
                    <Flex align="start" gap="3">
                      <UserAvatar username={comment.user} size="small" />
                      <Box flexGrow="1">
                        <Flex align="center" justify="between" gap="2" mb="1">
                          <Text color="gray" size="1">
                            {comment.user}
                          </Text>
                          <Text color="gray" size="1">
                            {comment.date}
                          </Text>
                        </Flex>
                        <Text as="div" size="2">
                          {comment.text}
                        </Text>
                      </Box>
                    </Flex>
                  </Card>
                ))}
              </Flex>
            </Box>

            <Box mt="3">
              <RichTextEditor
                content=""
                onChange={(content) => {
                  // TODO: Handle comment submission
                  console.log(content)
                }}
                placeholder="Add a comment..."
                border
              />
              <Flex justify="end" mt="3">
                <Button color="indigo" size="2">
                  Post Comment
                </Button>
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Box>
    </ScreenWithHeader>
  )
}

const comments = [
  {
    user: 'alice',
    date: '3 Apr',
    text: 'Hey, I noticed this bug as well. It seems to happen when you try to save without a title.',
  },
  {
    user: 'bob',
    date: '4 Apr',
    text: 'I think the root cause is in the validation logic. I can take a look at this tomorrow.',
  },
  {
    user: 'carol',
    date: '5 Apr',
    text: 'Let me know if you need any help reproducing it! I have a test case ready.',
  },
  {
    user: 'alice',
    date: '6 Apr',
    text: 'Thanks Carol! Bob, ping me if you want to pair on debugging.',
  },
  {
    user: 'bob',
    date: '7 Apr',
    text: 'Fixed in #42. Please review when you have a moment.',
  },
  {
    user: 'alice',
    date: '8 Apr',
    text: 'Reviewed and approved! Thanks for the quick turnaround.',
  },
]
