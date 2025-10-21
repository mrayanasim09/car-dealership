import { ErrorHandler, createUserFriendlyError, logError, handleApiError, UserFriendlyError } from '@/lib/error-handling'

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler

  beforeEach(() => {
    errorHandler = ErrorHandler.getInstance()
    // Clear error log before each test
    ;(errorHandler as any).errorLog = []
  })

  describe('toUserFriendlyError', () => {
    it('should handle authentication errors', () => {
      const error = new Error('Unauthorized access')
      const result = errorHandler.toUserFriendlyError(error)

      expect(result.title).toBe('Access Denied')
      expect(result.severity).toBe('medium')
      expect(result.code).toBe('AUTH_ERROR')
      expect(result.retryable).toBe(false)
    })

    it('should handle network errors', () => {
      const error = new Error('Network timeout')
      const result = errorHandler.toUserFriendlyError(error)

      expect(result.title).toBe('Connection Problem')
      expect(result.severity).toBe('medium')
      expect(result.code).toBe('NETWORK_ERROR')
      expect(result.retryable).toBe(true)
    })

    it('should handle validation errors', () => {
      const error = new Error('Invalid input validation failed')
      const result = errorHandler.toUserFriendlyError(error)

      expect(result.title).toBe('Invalid Information')
      expect(result.severity).toBe('low')
      expect(result.code).toBe('VALIDATION_ERROR')
      expect(result.retryable).toBe(true)
    })

    it('should handle server errors', () => {
      const error = new Error('Internal server error 500')
      const result = errorHandler.toUserFriendlyError(error)

      expect(result.title).toBe('Server Error')
      expect(result.severity).toBe('high')
      expect(result.code).toBe('SERVER_ERROR')
      expect(result.retryable).toBe(true)
    })

    it('should handle rate limiting errors', () => {
      const error = new Error('Rate limit exceeded')
      const result = errorHandler.toUserFriendlyError(error)

      expect(result.title).toBe('Too Many Requests')
      expect(result.severity).toBe('medium')
      expect(result.code).toBe('RATE_LIMIT_ERROR')
      expect(result.retryable).toBe(true)
    })

    it('should handle file upload errors', () => {
      const error = new Error('File size too large')
      const result = errorHandler.toUserFriendlyError(error)

      expect(result.title).toBe('File Upload Error')
      expect(result.severity).toBe('low')
      expect(result.code).toBe('FILE_ERROR')
      expect(result.retryable).toBe(true)
    })

    it('should handle database errors', () => {
      const error = new Error('Database connection failed')
      const result = errorHandler.toUserFriendlyError(error)

      expect(result.title).toBe('Data Error')
      expect(result.severity).toBe('high')
      expect(result.code).toBe('DATABASE_ERROR')
      expect(result.retryable).toBe(true)
    })

    it('should handle unknown errors', () => {
      const error = new Error('Some random error')
      const result = errorHandler.toUserFriendlyError(error)

      expect(result.title).toBe('Something Went Wrong')
      expect(result.severity).toBe('medium')
      expect(result.code).toBe('UNKNOWN_ERROR')
      expect(result.retryable).toBe(true)
    })
  })

  describe('handleApiError', () => {
    it('should handle 400 Bad Request', () => {
      const result = errorHandler.handleApiError(400)
      expect(result.title).toBe('Bad Request')
      expect(result.severity).toBe('low')
      expect(result.code).toBe('BAD_REQUEST')
      expect(result.retryable).toBe(true)
    })

    it('should handle 401 Unauthorized', () => {
      const result = errorHandler.handleApiError(401)
      expect(result.title).toBe('Not Authorized')
      expect(result.severity).toBe('medium')
      expect(result.code).toBe('UNAUTHORIZED')
      expect(result.retryable).toBe(false)
    })

    it('should handle 403 Forbidden', () => {
      const result = errorHandler.handleApiError(403)
      expect(result.title).toBe('Access Forbidden')
      expect(result.severity).toBe('medium')
      expect(result.code).toBe('FORBIDDEN')
      expect(result.retryable).toBe(false)
    })

    it('should handle 404 Not Found', () => {
      const result = errorHandler.handleApiError(404)
      expect(result.title).toBe('Not Found')
      expect(result.severity).toBe('low')
      expect(result.code).toBe('NOT_FOUND')
      expect(result.retryable).toBe(false)
    })

    it('should handle 429 Too Many Requests', () => {
      const result = errorHandler.handleApiError(429)
      expect(result.title).toBe('Too Many Requests')
      expect(result.severity).toBe('medium')
      expect(result.code).toBe('RATE_LIMITED')
      expect(result.retryable).toBe(true)
    })

    it('should handle 500 Internal Server Error', () => {
      const result = errorHandler.handleApiError(500)
      expect(result.title).toBe('Server Error')
      expect(result.severity).toBe('high')
      expect(result.code).toBe('SERVER_ERROR')
      expect(result.retryable).toBe(true)
    })

    it('should handle 503 Service Unavailable', () => {
      const result = errorHandler.handleApiError(503)
      expect(result.title).toBe('Service Unavailable')
      expect(result.severity).toBe('high')
      expect(result.code).toBe('SERVICE_UNAVAILABLE')
      expect(result.retryable).toBe(true)
    })

    it('should handle unknown status codes', () => {
      const result = errorHandler.handleApiError(418, 'I\'m a teapot')
      expect(result.title).toBe('Request Failed')
      expect(result.message).toBe('I\'m a teapot')
      expect(result.code).toBe('HTTP_418')
      expect(result.retryable).toBe(true)
    })
  })

  describe('logError', () => {
    it('should log errors with context', () => {
      const error = new Error('Test error')
      const context = { action: 'test', component: 'TestComponent' }
      
      errorHandler.logError(error, context)
      const recentErrors = errorHandler.getRecentErrors()
      
      expect(recentErrors).toHaveLength(1)
      expect(recentErrors[0].error).toBe(error)
      expect(recentErrors[0].context.action).toBe('test')
      expect(recentErrors[0].context.component).toBe('TestComponent')
    })

    it('should limit error log to 100 entries', () => {
      // Add 105 errors
      for (let i = 0; i < 105; i++) {
        errorHandler.logError(new Error(`Error ${i}`))
      }
      
      const recentErrors = errorHandler.getRecentErrors()
      expect(recentErrors).toHaveLength(100)
      expect(recentErrors[0].error.message).toBe('Error 5') // First error should be Error 5
    })

    it('should clear error log', () => {
      errorHandler.logError(new Error('Test error'))
      expect(errorHandler.getRecentErrors()).toHaveLength(1)
      
      errorHandler.clearErrorLog()
      expect(errorHandler.getRecentErrors()).toHaveLength(0)
    })
  })

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ErrorHandler.getInstance()
      const instance2 = ErrorHandler.getInstance()
      expect(instance1).toBe(instance2)
    })
  })
})

describe('Utility functions', () => {
  describe('createUserFriendlyError', () => {
    it('should create user-friendly error from Error object', () => {
      const error = new Error('Network timeout')
      const result = createUserFriendlyError(error)
      
      expect(result.title).toBe('Connection Problem')
      expect(result.code).toBe('NETWORK_ERROR')
    })
  })

  describe('logError', () => {
    it('should log error using singleton instance', () => {
      const error = new Error('Test error')
      logError(error, { action: 'test' })
      
      const errorHandler = ErrorHandler.getInstance()
      const recentErrors = errorHandler.getRecentErrors()
      expect(recentErrors).toHaveLength(1)
    })
  })

  describe('handleApiError', () => {
    it('should handle API error using singleton instance', () => {
      const result = handleApiError(404)
      expect(result.title).toBe('Not Found')
      expect(result.code).toBe('NOT_FOUND')
    })
  })
})
