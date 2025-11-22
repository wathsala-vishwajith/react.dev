describe('Application E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the application successfully', () => {
    cy.contains('React Testing Strategy Demo').should('be.visible');
  });

  it('should display the description', () => {
    cy.contains('This application demonstrates a complete testing strategy').should(
      'be.visible'
    );
  });

  it('should display both components', () => {
    cy.contains('h2', 'Counter').should('be.visible');
    cy.contains('h2', 'Todo List').should('be.visible');
  });

  it('should allow interaction with both components independently', () => {
    // Interact with Counter
    cy.get('[data-testid="increment-btn"]').click();
    cy.get('[data-testid="count-display"]').should('contain', 'Count: 1');

    // Interact with TodoList
    cy.get('[data-testid="todo-input"]').type('Test task');
    cy.get('[data-testid="add-todo-btn"]').click();
    cy.contains('Test task').should('be.visible');

    // Verify both changes persisted
    cy.get('[data-testid="count-display"]').should('contain', 'Count: 1');
    cy.contains('Test task').should('be.visible');
  });

  it('should have responsive layout', () => {
    // Test on mobile viewport
    cy.viewport('iphone-x');
    cy.contains('h2', 'Counter').should('be.visible');
    cy.contains('h2', 'Todo List').should('be.visible');

    // Test on desktop viewport
    cy.viewport(1280, 720);
    cy.contains('h2', 'Counter').should('be.visible');
    cy.contains('h2', 'Todo List').should('be.visible');
  });

  it('should handle complex user workflows', () => {
    // Scenario: User interacts with both components multiple times

    // Add some todos
    cy.get('[data-testid="todo-input"]').type('Learn React{enter}');
    cy.get('[data-testid="todo-input"]').type('Write tests{enter}');

    // Increment counter multiple times
    cy.get('[data-testid="increment-btn"]').click();
    cy.get('[data-testid="increment-btn"]').click();
    cy.get('[data-testid="increment-btn"]').click();

    // Complete first todo
    cy.get('input[type="checkbox"]').first().click();

    // Add another todo
    cy.get('[data-testid="todo-input"]').type('Deploy app{enter}');

    // Decrement counter
    cy.get('[data-testid="decrement-btn"]').click();

    // Verify final state
    cy.get('[data-testid="count-display"]').should('contain', 'Count: 2');
    cy.get('[data-testid="todo-stats"]').should('contain', 'Total: 3 | Completed: 1');
  });
});
