import { makeStyles } from '@griffel/react'
import { Box, Heading, Text } from '@radix-ui/themes'

const useClasses = makeStyles({
  box: {
    padding: `32px 16px`,
    maxWidth: `600px`,
  },
})

export default function AboutSection() {
  const classes = useClasses()
  return (
    <Box className={classes.box}>
      <Heading size="3" mb="2" align="center" weight="medium">
        About Burn
      </Heading>
      <Text size="2" color="gray">
        TODO: Write an about section
      </Text>
      <Heading size="3" mb="2" mt="4" align="center" weight="medium">
        ElectricSQL
      </Heading>
      <Text size="2" color="gray">
        Electric is a Postgres sync engine. It solves the hard problems of sync
        for you, including partial replication, fan-out, and data delivery. See
        {` `}
        <a href="https://electric-sql.com">electric-sql.com</a> for more
        information.
      </Text>
    </Box>
  )
}
