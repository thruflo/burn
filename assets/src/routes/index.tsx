import { createFileRoute } from '@tanstack/react-router'
import ScreenWithHeader from '../components/ScreenWithHeader'
import { Flex } from '@radix-ui/themes'
import ThreadHeading from '../components/ThreadHeading'

export const Route = createFileRoute(`/`)({
  component: Index,
})

function Index() {
  return (
    <ScreenWithHeader title={<ThreadHeading title="This is a conversation" />}>
      <Flex direction="column">
        {/* Main content area */}
      </Flex>
    </ScreenWithHeader>
  )
}
