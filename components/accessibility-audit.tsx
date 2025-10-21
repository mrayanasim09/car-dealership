"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Accessibility, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  XCircle
} from 'lucide-react'

interface AccessibilityIssue {
  id: string
  impact: 'minor' | 'moderate' | 'serious' | 'critical'
  description: string
  help: string
  helpUrl?: string
  tags: string[]
  element?: string
  selector?: string
}

interface AccessibilityReport {
  timestamp: Date
  issues: AccessibilityIssue[]
  summary: {
    total: number
    critical: number
    serious: number
    moderate: number
    minor: number
    passed: number
  }
}

export function AccessibilityAudit() {
  const [isVisible, setIsVisible] = useState(false)
  const [report, setReport] = useState<AccessibilityReport | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState('')

  // Only show in development or when explicitly enabled
  useEffect(() => {
    const shouldShow = process.env.NODE_ENV === 'development' || 
                      localStorage.getItem('amtycoons-accessibility-audit') === 'enabled'
    setIsVisible(shouldShow)
  }, [])

  const runAccessibilityAudit = async () => {
    setIsRunning(true)
    setCurrentTest('Initializing accessibility audit...')

    try {
      // Basic accessibility checks
      const issues: AccessibilityIssue[] = []
      
      // Check for missing alt text on images
      setCurrentTest('Checking image accessibility...')
      const images = document.querySelectorAll('img')
      images.forEach((img, index) => {
        if (!img.alt && !img.getAttribute('aria-label')) {
          issues.push({
            id: `img-alt-${index}`,
            impact: 'serious',
            description: 'Image missing alternative text',
            help: 'Add alt attribute or aria-label to describe the image content',
            helpUrl: 'https://www.w3.org/WAI/WCAG21/quickref/#text-alternatives',
            tags: ['wcag2a', 'wcag111', 'section508'],
            element: img.outerHTML,
            selector: `img:nth-child(${index + 1})`
          })
        }
      })

      // Check for proper heading structure
      setCurrentTest('Checking heading structure...')
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      let previousLevel = 0
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1))
        if (level > previousLevel + 1) {
          issues.push({
            id: `heading-skip-${index}`,
            impact: 'moderate',
            description: 'Heading level skipped',
            help: 'Ensure heading levels are not skipped (e.g., h1 to h3)',
            helpUrl: 'https://www.w3.org/WAI/WCAG21/quickref/#info-and-relationships',
            tags: ['wcag2a', 'wcag141'],
            element: heading.outerHTML,
            selector: `${heading.tagName.toLowerCase()}:nth-child(${index + 1})`
          })
        }
        previousLevel = level
      })

      // Check for proper form labels
      setCurrentTest('Checking form accessibility...')
      const inputs = document.querySelectorAll('input, textarea, select')
      inputs.forEach((input, index) => {
        const id = input.getAttribute('id')
        const label = input.getAttribute('aria-label') || input.getAttribute('placeholder')
        
        if (!id && !label) {
          issues.push({
            id: `form-label-${index}`,
            impact: 'serious',
            description: 'Form control missing label',
            help: 'Add id attribute and associated label, or use aria-label',
            helpUrl: 'https://www.w3.org/WAI/WCAG21/quickref/#name-role-value',
            tags: ['wcag2a', 'wcag111', 'section508'],
            element: input.outerHTML,
            selector: `${input.tagName.toLowerCase()}:nth-child(${index + 1})`
          })
        }
      })

      // Check for sufficient color contrast (basic check)
      setCurrentTest('Checking color contrast...')
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div')
      textElements.forEach((element, index) => {
        const style = window.getComputedStyle(element)
        const color = style.color
        const backgroundColor = style.backgroundColor || 'white'
        
        // Basic contrast check (this is simplified - in production use a proper contrast checker)
        if (color === backgroundColor) {
          issues.push({
            id: `contrast-${index}`,
            impact: 'serious',
            description: 'Insufficient color contrast',
            help: 'Ensure text has sufficient contrast with background (minimum 4.5:1 for normal text)',
            helpUrl: 'https://www.w3.org/WAI/WCAG21/quickref/#contrast-minimum',
            tags: ['wcag2aa', 'wcag143'],
            element: element.outerHTML,
            selector: `${element.tagName.toLowerCase()}:nth-child(${index + 1})`
          })
        }
      })

      // Check for keyboard navigation
      setCurrentTest('Checking keyboard navigation...')
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea')
      interactiveElements.forEach((element, index) => {
        if (element.tagName === 'BUTTON' && !element.getAttribute('type')) {
          issues.push({
            id: `button-type-${index}`,
            impact: 'moderate',
            description: 'Button missing type attribute',
            help: 'Add type="button" to prevent form submission',
            helpUrl: 'https://www.w3.org/WAI/WCAG21/quickref/#name-role-value',
            tags: ['wcag2a'],
            element: element.outerHTML,
            selector: `button:nth-child(${index + 1})`
          })
        }
      })

      // Check for ARIA landmarks
      setCurrentTest('Checking ARIA landmarks...')
      const main = document.querySelector('main')
      
      if (!main) {
        issues.push({
          id: 'missing-main',
          impact: 'moderate',
          description: 'Missing main landmark',
          help: 'Add main element or role="main" to identify the main content area',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/quickref/#info-and-relationships',
          tags: ['wcag2a', 'wcag141'],
          element: 'document.body',
          selector: 'body'
        })
      }

      // Check for skip links
      setCurrentTest('Checking skip navigation...')
      const skipLinks = document.querySelectorAll('a[href^="#"], a[href^="/#"]')
      let hasSkipLink = false
      skipLinks.forEach(link => {
        if (link.textContent?.toLowerCase().includes('skip')) {
          hasSkipLink = true
        }
      })
      
      if (!hasSkipLink) {
        issues.push({
          id: 'missing-skip-link',
          impact: 'moderate',
          description: 'Missing skip navigation link',
          help: 'Add a skip link to allow keyboard users to bypass navigation',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/quickref/#bypass-blocks',
          tags: ['wcag2a', 'wcag141'],
          element: 'document.body',
          selector: 'body'
        })
      }

      // Generate report
      const summary = {
        total: issues.length,
        critical: issues.filter(i => i.impact === 'critical').length,
        serious: issues.filter(i => i.impact === 'serious').length,
        moderate: issues.filter(i => i.impact === 'moderate').length,
        minor: issues.filter(i => i.impact === 'minor').length,
        passed: 0 // Simplified - in production this would count passed checks
      }

      const accessibilityReport: AccessibilityReport = {
        timestamp: new Date(),
        issues,
        summary
      }

      setReport(accessibilityReport)
      setCurrentTest('')
    } catch (error) {
      console.error('Accessibility audit failed:', error)
      setCurrentTest('')
    } finally {
      setIsRunning(false)
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-500 text-white'
      case 'serious': return 'bg-orange-500 text-white'
      case 'moderate': return 'bg-yellow-500 text-black'
      case 'minor': return 'bg-blue-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'critical': return <XCircle className="h-4 w-4" />
      case 'serious': return <AlertTriangle className="h-4 w-4" />
      case 'moderate': return <Info className="h-4 w-4" />
      case 'minor': return <CheckCircle className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className="w-80 max-h-96 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Accessibility className="h-4 w-4" />
            Accessibility Audit
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {!report ? (
            <div className="text-center">
              <Button 
                onClick={runAccessibilityAudit}
                disabled={isRunning}
                className="w-full"
              >
                {isRunning ? 'Running...' : 'Run Audit'}
              </Button>
              
              {isRunning && (
                <p className="text-xs text-muted-foreground mt-2">
                  {currentTest}
                </p>
              )}
            </div>
          ) : (
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="issues">Issues</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <div className="font-bold text-red-600 dark:text-red-400">
                      {report.summary.critical + report.summary.serious}
                    </div>
                    <div>Critical/Serious</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <div className="font-bold text-yellow-600 dark:text-yellow-400">
                      {report.summary.moderate}
                    </div>
                    <div>Moderate</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="font-bold text-blue-600 dark:text-blue-400">
                      {report.summary.minor}
                    </div>
                    <div>Minor</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="font-bold text-green-600 dark:text-green-400">
                      {report.summary.total}
                    </div>
                    <div>Total Issues</div>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground text-center">
                  Last run: {report.timestamp.toLocaleTimeString()}
                </div>
              </TabsContent>
              
              <TabsContent value="issues" className="space-y-2 max-h-48 overflow-y-auto">
                {report.issues.length === 0 ? (
                  <div className="text-center text-sm text-green-600 dark:text-green-400 py-4">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                    No accessibility issues found!
                  </div>
                ) : (
                  report.issues.map((issue) => (
                    <div key={issue.id} className="p-2 border rounded text-xs">
                      <div className="flex items-start gap-2">
                        <Badge className={getImpactColor(issue.impact)}>
                          {getImpactIcon(issue.impact)}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{issue.description}</p>
                          <p className="text-muted-foreground mt-1">{issue.help}</p>
                          {issue.helpUrl && (
                            <a 
                              href={issue.helpUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-xs"
                            >
                              Learn more
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="actions" className="space-y-2">
                <Button 
                  onClick={runAccessibilityAudit}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Run Again
                </Button>
                
                <Button 
                  onClick={() => setReport(null)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Clear Report
                </Button>
                
                <div className="text-xs text-muted-foreground text-center">
                  <p>This tool helps identify common accessibility issues.</p>
                  <p className="mt-1">For comprehensive testing, use automated tools like axe-core or pa11y.</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
