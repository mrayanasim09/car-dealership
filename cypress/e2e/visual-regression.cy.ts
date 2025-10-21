describe('Visual Regression Tests', () => {
  beforeEach(() => {
    // Set viewport for consistent screenshots
    cy.viewport(1280, 720)
  })

  describe('Homepage', () => {
    it('should match homepage visual snapshot', () => {
      cy.visit('/')
      cy.wait(1000) // Wait for animations and images to load
      cy.percySnapshot('Homepage - Desktop')
    })

    it('should match homepage mobile snapshot', () => {
      cy.viewport(375, 667) // iPhone SE
      cy.visit('/')
      cy.wait(1000)
      cy.percySnapshot('Homepage - Mobile')
    })

    it('should match homepage tablet snapshot', () => {
      cy.viewport(768, 1024) // iPad
      cy.visit('/')
      cy.wait(1000)
      cy.percySnapshot('Homepage - Tablet')
    })
  })

  describe('Car Inventory', () => {
    it('should match inventory page visual snapshot', () => {
      cy.visit('/inventory')
      cy.wait(1000)
      cy.percySnapshot('Inventory Page - Desktop')
    })

    it('should match car details page snapshot', () => {
      // Visit a specific car page (you may need to adjust the URL)
      cy.visit('/car/test-car-id')
      cy.wait(1000)
      cy.percySnapshot('Car Details Page')
    })
  })

  describe('Contact Page', () => {
    it('should match contact page visual snapshot', () => {
      cy.visit('/contact')
      cy.wait(1000)
      cy.percySnapshot('Contact Page')
    })

    it('should match contact form states', () => {
      cy.visit('/contact')
      cy.wait(1000)
      
      // Test form validation state
      cy.get('button[type="submit"]').click()
      cy.wait(500)
      cy.percySnapshot('Contact Page - Form Validation Errors')
      
      // Test form filled state
      cy.get('input[name="name"]').type('John Doe')
      cy.get('input[name="email"]').type('john@example.com')
      cy.get('input[name="phone"]').type('1234567890')
      cy.get('textarea[name="message"]').type('Test message')
      cy.wait(500)
      cy.percySnapshot('Contact Page - Form Filled')
    })
  })

  describe('Admin Dashboard', () => {
    beforeEach(() => {
      // Mock admin authentication
      cy.intercept('GET', '/api/admin/me', {
        statusCode: 200,
        body: {
          user: {
            id: 'test-admin',
            email: 'admin@example.com',
            role: 'admin'
          }
        }
      })
    })

    it('should match admin dashboard snapshot', () => {
      cy.visit('/admin/dashboard')
      cy.wait(2000) // Wait for dashboard to load
      cy.percySnapshot('Admin Dashboard')
    })

    it('should match admin dashboard mobile snapshot', () => {
      cy.viewport(375, 667)
      cy.visit('/admin/dashboard')
      cy.wait(2000)
      cy.percySnapshot('Admin Dashboard - Mobile')
    })
  })

  describe('Navigation Components', () => {
    it('should match navbar visual snapshot', () => {
      cy.visit('/')
      cy.get('nav').should('be.visible')
      cy.percySnapshot('Navigation Bar')
    })

    it('should match footer visual snapshot', () => {
      cy.visit('/')
      cy.get('footer').should('be.visible')
      cy.percySnapshot('Footer')
    })

    it('should match mobile navigation snapshot', () => {
      cy.viewport(375, 667)
      cy.visit('/')
      cy.get('nav').should('be.visible')
      cy.percySnapshot('Mobile Navigation')
    })
  })

  describe('UI Components', () => {
    it('should match button component states', () => {
      cy.visit('/')
      
      // Test primary button
      cy.get('button').contains('Browse Inventory').should('be.visible')
      cy.percySnapshot('Primary Button Component')
      
      // Test button hover state (if possible)
      cy.get('button').contains('Browse Inventory').trigger('mouseover')
      cy.wait(100)
      cy.percySnapshot('Primary Button Component - Hover')
    })

    it('should match card component snapshot', () => {
      cy.visit('/')
      cy.get('.card').first().should('be.visible')
      cy.percySnapshot('Card Component')
    })
  })

  describe('Error States', () => {
    it('should match 404 error page snapshot', () => {
      cy.visit('/non-existent-page', { failOnStatusCode: false })
      cy.wait(1000)
      cy.percySnapshot('404 Error Page')
    })

    it('should match error boundary snapshot', () => {
      // This would require triggering an error in the app
      // For now, we'll test the error page component
      cy.visit('/error')
      cy.wait(1000)
      cy.percySnapshot('Error Page')
    })
  })

  describe('Loading States', () => {
    it('should match loading spinner snapshot', () => {
      cy.visit('/')
      // Look for loading states
      cy.get('.loading-spinner, .skeleton, [data-loading]').should('exist')
      cy.percySnapshot('Loading States')
    })
  })

  describe('Dark Mode', () => {
    it('should match dark mode snapshot', () => {
      cy.visit('/')
      
      // Toggle to dark mode (if theme toggle exists)
      cy.get('[data-theme-toggle], .theme-toggle').then(($toggle) => {
        if ($toggle.length > 0) {
          cy.wrap($toggle).click()
          cy.wait(500)
          cy.percySnapshot('Homepage - Dark Mode')
        }
      })
    })
  })

  describe('Responsive Breakpoints', () => {
    const breakpoints = [
      { name: 'Mobile Small', width: 320, height: 568 },
      { name: 'Mobile Large', width: 414, height: 896 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop Small', width: 1024, height: 768 },
      { name: 'Desktop Large', width: 1920, height: 1080 }
    ]

    breakpoints.forEach(({ name, width, height }) => {
      it(`should match ${name} breakpoint snapshot`, () => {
        cy.viewport(width, height)
        cy.visit('/')
        cy.wait(1000)
        cy.percySnapshot(`Homepage - ${name}`)
      })
    })
  })

  describe('Interactive Elements', () => {
    it('should match dropdown menu snapshot', () => {
      cy.visit('/')
      
      // Look for dropdown triggers
      cy.get('[data-dropdown-trigger], .dropdown-trigger').then(($dropdowns) => {
        if ($dropdowns.length > 0) {
          cy.wrap($dropdowns.first()).click()
          cy.wait(500)
          cy.percySnapshot('Dropdown Menu - Open')
        }
      })
    })

    it('should match modal snapshot', () => {
      cy.visit('/')
      
      // Look for modal triggers
      cy.get('[data-modal-trigger], .modal-trigger').then(($modals) => {
        if ($modals.length > 0) {
          cy.wrap($modals.first()).click()
          cy.wait(500)
          cy.percySnapshot('Modal - Open')
        }
      })
    })
  })
})
