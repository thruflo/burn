import { useState, useEffect } from 'react'

// Mobile breakpoint is now at 1024px (typical tablet landscape width)
const MOBILE_BREAKPOINT = 1024

export function useMobile() {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT
  )

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    window.addEventListener(`resize`, handleResize)

    return () => {
      window.removeEventListener(`resize`, handleResize)
    }
  }, [])

  return { isMobile }
}
