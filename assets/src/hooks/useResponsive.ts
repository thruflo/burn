import { useState, useEffect } from 'react'

// Breakpoint for left sidebar (wider breakpoint at 1024px)
const LEFT_SIDEBAR_BREAKPOINT = 1024
// Mobile breakpoint for right sidebar remains at 768px
const RIGHT_SIDEBAR_BREAKPOINT = 768

export function useResponsive() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  // Update windowWidth on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    // For backward compatibility
    isMobile: windowWidth < RIGHT_SIDEBAR_BREAKPOINT,

    // New responsive flags
    isSmallScreen: windowWidth < RIGHT_SIDEBAR_BREAKPOINT,
    isMediumScreen:
      windowWidth >= RIGHT_SIDEBAR_BREAKPOINT &&
      windowWidth < LEFT_SIDEBAR_BREAKPOINT,
    isLargeScreen: windowWidth >= LEFT_SIDEBAR_BREAKPOINT,

    // Specific sidebar visibility flags
    showLeftSidebar: windowWidth >= LEFT_SIDEBAR_BREAKPOINT,
    showRightSidebar: windowWidth >= RIGHT_SIDEBAR_BREAKPOINT,
  }
}
