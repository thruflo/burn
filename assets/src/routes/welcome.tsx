import { useState } from 'react'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { Box, Flex, Text, Heading, Button, TextField } from '@radix-ui/themes'
import { makeStyles } from '@griffel/react'
import AboutSection from '../components/AboutSection'
import ThemeToggle from '../components/ThemeToggle'
import { setCurrentUser } from '../hooks/useAuth'
import * as api from '../api'

const useClasses = makeStyles({
  fireIcon: {
    position: `relative`,
    display: `block`,
    fontSize: `calc(45px * var(--scaling))`,
    marginBottom: `var(--space-4)`,
  },
  welcomeScreen: {
    minHeight: `100vh`,
    width: `100vw`,
    position: `relative`,
    overflowY: `auto`,
  },
})

function Welcome() {
  const [username, setUsername] = useState(``)
  const [error, setError] = useState(``)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()
  const search = useSearch({ from: '/welcome' })

  const classes = useClasses()

  const signInUser = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedUserName = username.trim()
    if (!trimmedUserName) {
      setError(`Please enter your name`)

      return
    }

    setIsSubmitting(true)

    const user = await api.signIn(trimmedUserName)

    setIsSubmitting(false)

    if (user === undefined) {
      setError(`There was an error. Please try again`)

      return
    }

    setCurrentUser(user)

    navigate({ to: search.next ? search.next : '/' })
  }

  return (
    <Flex direction="column" className={classes.welcomeScreen}>
      <ThemeToggle />
      <Flex
        direction="column"
        align="center"
        justify="center"
        p="4"
        flexGrow="1"
      >
        <Box maxWidth="512px" width="100%" p="0 16px">
          <Heading size="6" mb="5" mt="5" align="center" weight="medium">
            <Text className={classes.fireIcon}>🔥</Text>
            Welcome to Burn
          </Heading>
          <form onSubmit={signInUser}>
            <Flex direction="column" gap="4" width="100%">
              <TextField.Root
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setUsername(e.target.value)
                  setError(``)
                }}
                disabled={isSubmitting}
                size="3"
              />
              {error && (
                <Text color="red" size="2" align="center">
                  {error}
                </Text>
              )}
              <Button
                type="submit"
                size="3"
                color="iris"
                variant="soft"
                disabled={isSubmitting}
              >
                {isSubmitting ? `Entering...` : `Enter`}
              </Button>
            </Flex>
          </form>
        </Box>
        <AboutSection />
      </Flex>
    </Flex>
  )
}

export const Route = createFileRoute('/welcome')({
  component: Welcome,
  validateSearch: (search: Record<string, unknown>) => ({
    next: (search.next as string) || undefined,
  }),
})
