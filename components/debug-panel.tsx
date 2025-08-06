"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bug, RefreshCw, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function DebugPanel() {
  const [isVisible, setIsVisible] = useState(false)
  const [checkpoints, setCheckpoints] = useState<Record<string, boolean>>({})
  const { isFirebaseAvailable, firebaseStatus } = useAuth()

  const updateCheckpoints = () => {
    const newCheckpoints: Record<string, boolean> = {}
    for (let i = 1; i <= 16; i++) {
      newCheckpoints[`checkpoint${i}`] = !!(window as any)[`debugCheckpoint${i}`]
    }
    newCheckpoints.error = !!(window as any).debugCheckpointError
    newCheckpoints.toastError = !!(window as any).debugCheckpointToastError
    setCheckpoints(newCheckpoints)
  }

  useEffect(() => {
    const interval = setInterval(updateCheckpoints, 1000)
    return () => clearInterval(interval)
  }, [])

  const getCheckpointStatus = (checkpoint: string) => {
    return checkpoints[checkpoint] ? "✅" : "❌"
  }

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed top-4 left-4 z-50 bg-red-600 hover:bg-red-700"
        size="sm"
      >
        <Bug className="h-4 w-4 mr-2" />
        Debug
      </Button>
    )
  }

  return (
    <Card className="fixed top-4 left-4 z-50 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-sm">Debug Checkpoints</CardTitle>
        <div className="flex gap-2">
          <Button
            onClick={updateCheckpoints}
            size="sm"
            variant="outline"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
          <Button
            onClick={() => setIsVisible(false)}
            size="sm"
            variant="outline"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>Layout Script: {getCheckpointStatus("checkpoint1")}</div>
          <div>After Interactive: {getCheckpointStatus("checkpoint2")}</div>
          <div>Lazy Load: {getCheckpointStatus("checkpoint3")}</div>
          <div>HomePage Mount: {getCheckpointStatus("checkpoint4")}</div>
          <div>Auth Start: {getCheckpointStatus("checkpoint5")}</div>
          <div>Firebase Init: {getCheckpointStatus("checkpoint6")}</div>
          <div>Firebase Status: {getCheckpointStatus("checkpoint7")}</div>
          <div>Auth Validated: {getCheckpointStatus("checkpoint8")}</div>
          <div>Auth Listener: {getCheckpointStatus("checkpoint9")}</div>
          <div>useIsMobile: {getCheckpointStatus("checkpoint10")}</div>
          <div>matchMedia: {getCheckpointStatus("checkpoint11")}</div>
          <div>onChange: {getCheckpointStatus("checkpoint12")}</div>
          <div>Mobile Setup: {getCheckpointStatus("checkpoint13")}</div>
          <div>useToast: {getCheckpointStatus("checkpoint14")}</div>
          <div>Toast Listener: {getCheckpointStatus("checkpoint15")}</div>
          <div>Toast Cleanup: {getCheckpointStatus("checkpoint16")}</div>
        </div>
        
        <div className="mt-4 p-2 bg-blue-100 dark:bg-blue-900 rounded">
          <div className="text-xs font-semibold text-blue-800 dark:text-blue-200">
            Firebase Status:
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            Available: {isFirebaseAvailable ? "✅" : "❌"}
          </div>
          {firebaseStatus && (
            <>
              <div className="text-xs text-blue-700 dark:text-blue-300">
                App: {firebaseStatus.app ? "✅" : "❌"}
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300">
                Auth: {firebaseStatus.auth ? "✅" : "❌"}
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300">
                Firestore: {firebaseStatus.firestore ? "✅" : "❌"}
              </div>
              {firebaseStatus.error && (
                <div className="text-xs text-red-700 dark:text-red-300">
                  Error: {firebaseStatus.error}
                </div>
              )}
            </>
          )}
        </div>
        
        {(checkpoints.error || checkpoints.toastError) && (
          <div className="mt-4 p-2 bg-red-100 dark:bg-red-900 rounded">
            <div className="text-xs font-semibold text-red-800 dark:text-red-200">
              Errors Detected:
            </div>
            {checkpoints.error && (
              <div className="text-xs text-red-700 dark:text-red-300">
                useIsMobile Error: {(window as any).debugCheckpointError?.message}
              </div>
            )}
            {checkpoints.toastError && (
              <div className="text-xs text-red-700 dark:text-red-300">
                Toast Error: {(window as any).debugCheckpointToastError?.message}
              </div>
            )}
          </div>
        )}

        {/* Global Error Display */}
        {(window as any).lastGlobalError && (
          <div className="mt-4 p-2 bg-orange-100 dark:bg-orange-900 rounded">
            <div className="text-xs font-semibold text-orange-800 dark:text-orange-200">
              Global Error:
            </div>
            <div className="text-xs text-orange-700 dark:text-orange-300">
              {(window as any).lastGlobalError.message}
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400">
              File: {(window as any).lastGlobalError.filename}
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400">
              Line: {(window as any).lastGlobalError.lineno}:{(window as any).lastGlobalError.colno}
            </div>
          </div>
        )}

        {/* Promise Error Display */}
        {(window as any).lastPromiseError && (
          <div className="mt-4 p-2 bg-yellow-100 dark:bg-yellow-900 rounded">
            <div className="text-xs font-semibold text-yellow-800 dark:text-yellow-200">
              Promise Error:
            </div>
            <div className="text-xs text-yellow-700 dark:text-yellow-300">
              {(window as any).lastPromiseError.reason}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 