describe('Admin Setup Page', () => {
  beforeEach(() => {
    cy.visit('/admin/setup-simple')
  })

  it('should show loading state initially', () => {
    cy.contains('Checking setup...').should('be.visible')
  })

  it('should show setup form if no admin exists', () => {
    cy.contains('Setup Super Admin').should('be.visible')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('have.length', 2)
  })

  it('should validate password match', () => {
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').first().type('StrongPass123!')
    cy.get('input[type="password"]').last().type('DifferentPass123!')
    cy.get('button[type="submit"]').click()
    cy.contains('Passwords do not match').should('be.visible')
  })

  it('should validate password strength', () => {
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').first().type('weak')
    cy.get('input[type="password"]').last().type('weak')
    cy.get('button[type="submit"]').click()
    cy.contains('Password must be at least 8 characters long').should('be.visible')
  })

  it('should create super admin with valid data', () => {
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').first().type('StrongPass123!')
    cy.get('input[type="password"]').last().type('StrongPass123!')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/admin/login')
  })

  it('should handle creation errors', () => {
    // Intercept the admin creation request and force it to fail
    cy.intercept('POST', '/api/admin/setup', {
      statusCode: 500,
      body: { message: 'Creation failed' }
    })

    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').first().type('StrongPass123!')
    cy.get('input[type="password"]').last().type('StrongPass123!')
    cy.get('button[type="submit"]').click()
    cy.contains('Creation failed').should('be.visible')
  })
})


