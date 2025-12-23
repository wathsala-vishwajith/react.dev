describe('Counter E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the counter component', () => {
    cy.contains('h2', 'Counter').should('be.visible');
  });

  it('should start with count of 0', () => {
    cy.get('[data-testid="count-display"]').should('contain', 'Count: 0');
  });

  it('should increment the counter', () => {
    cy.get('[data-testid="increment-btn"]').click();
    cy.get('[data-testid="count-display"]').should('contain', 'Count: 1');

    cy.get('[data-testid="increment-btn"]').click();
    cy.get('[data-testid="count-display"]').should('contain', 'Count: 2');
  });

  it('should decrement the counter', () => {
    // First increment to have a positive count
    cy.get('[data-testid="increment-btn"]').click();
    cy.get('[data-testid="increment-btn"]').click();
    cy.get('[data-testid="count-display"]').should('contain', 'Count: 2');

    // Then decrement
    cy.get('[data-testid="decrement-btn"]').click();
    cy.get('[data-testid="count-display"]').should('contain', 'Count: 1');
  });

  it('should reset the counter to initial value', () => {
    // Increment several times
    cy.get('[data-testid="increment-btn"]').click();
    cy.get('[data-testid="increment-btn"]').click();
    cy.get('[data-testid="increment-btn"]').click();
    cy.get('[data-testid="count-display"]').should('contain', 'Count: 3');

    // Reset
    cy.get('[data-testid="reset-btn"]').click();
    cy.get('[data-testid="count-display"]').should('contain', 'Count: 0');
  });

  it('should allow negative counts', () => {
    cy.get('[data-testid="decrement-btn"]').click();
    cy.get('[data-testid="count-display"]').should('contain', 'Count: -1');

    cy.get('[data-testid="decrement-btn"]').click();
    cy.get('[data-testid="count-display"]').should('contain', 'Count: -2');
  });

  it('should handle multiple operations in sequence', () => {
    // Complex sequence of operations
    cy.get('[data-testid="increment-btn"]').click(); // 1
    cy.get('[data-testid="increment-btn"]').click(); // 2
    cy.get('[data-testid="increment-btn"]').click(); // 3
    cy.get('[data-testid="decrement-btn"]').click(); // 2
    cy.get('[data-testid="increment-btn"]').click(); // 3
    cy.get('[data-testid="count-display"]').should('contain', 'Count: 3');

    cy.get('[data-testid="reset-btn"]').click(); // 0
    cy.get('[data-testid="count-display"]').should('contain', 'Count: 0');
  });
});
