import { createFileRoute } from '@tanstack/react-router'
import ScreenWithHeader from '../components/ScreenWithHeader'
import { Flex } from '@radix-ui/themes'

export const Route = createFileRoute(`/`)({
  component: Index,
})

function Index() {
  return (
    <ScreenWithHeader title="">
      <Flex direction="column">{/* Empty main area */}</Flex>
    </ScreenWithHeader>
  )
}
