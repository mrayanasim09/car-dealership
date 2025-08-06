import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    console.log('🔍 DEBUG CHECKPOINT 10: useIsMobile hook executing');
    (window as any).debugCheckpoint10 = true;
    
    try {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      console.log('🔍 DEBUG CHECKPOINT 11: matchMedia created', { mql });
      (window as any).debugCheckpoint11 = true;
      
      const onChange = () => {
        console.log('🔍 DEBUG CHECKPOINT 12: matchMedia onChange triggered');
        (window as any).debugCheckpoint12 = true;
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }
      
      mql.addEventListener("change", onChange)
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      
      console.log('🔍 DEBUG CHECKPOINT 13: useIsMobile setup complete');
      (window as any).debugCheckpoint13 = true;
      
      return () => mql.removeEventListener("change", onChange)
    } catch (error) {
      console.error('🔍 Error in useIsMobile:', error);
      (window as any).debugCheckpointError = error;
    }
  }, [])

  return isMobile
}
