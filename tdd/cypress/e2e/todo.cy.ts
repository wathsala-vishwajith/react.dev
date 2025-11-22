describe('TodoList E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the todo list component', () => {
    cy.contains('h2', 'Todo List').should('be.visible');
  });

  it('should show empty state initially', () => {
    cy.get('[data-testid="empty-message"]').should('contain', 'No todos yet');
    cy.get('[data-testid="todo-stats"]').should('contain', 'Total: 0 | Completed: 0');
  });

  it('should add a new todo', () => {
    cy.get('[data-testid="todo-input"]').type('Buy groceries');
    cy.get('[data-testid="add-todo-btn"]').click();

    cy.contains('Buy groceries').should('be.visible');
    cy.get('[data-testid="empty-message"]').should('not.exist');
    cy.get('[data-testid="todo-stats"]').should('contain', 'Total: 1');
  });

  it('should add a todo with Enter key', () => {
    cy.get('[data-testid="todo-input"]').type('Write tests{enter}');

    cy.contains('Write tests').should('be.visible');
    cy.get('[data-testid="todo-stats"]').should('contain', 'Total: 1');
  });

  it('should clear input after adding todo', () => {
    cy.get('[data-testid="todo-input"]').type('Test task');
    cy.get('[data-testid="add-todo-btn"]').click();

    cy.get('[data-testid="todo-input"]').should('have.value', '');
  });

  it('should not add empty todos', () => {
    cy.get('[data-testid="add-todo-btn"]').click();
    cy.get('[data-testid="empty-message"]').should('be.visible');
    cy.get('[data-testid="todo-stats"]').should('contain', 'Total: 0');
  });

  it('should toggle todo completion', () => {
    // Add a todo
    cy.get('[data-testid="todo-input"]').type('Complete this task');
    cy.get('[data-testid="add-todo-btn"]').click();

    // Verify initial state
    cy.contains('Complete this task')
      .should('have.css', 'text-decoration')
      .and('match', /none/);
    cy.get('[data-testid="todo-stats"]').should('contain', 'Completed: 0');

    // Toggle completion
    cy.get('input[type="checkbox"]').click();
    cy.contains('Complete this task')
      .should('have.css', 'text-decoration')
      .and('match', /line-through/);
    cy.get('[data-testid="todo-stats"]').should('contain', 'Completed: 1');

    // Toggle back
    cy.get('input[type="checkbox"]').click();
    cy.contains('Complete this task')
      .should('have.css', 'text-decoration')
      .and('match', /none/);
    cy.get('[data-testid="todo-stats"]').should('contain', 'Completed: 0');
  });

  it('should delete a todo', () => {
    // Add a todo
    cy.get('[data-testid="todo-input"]').type('Task to delete');
    cy.get('[data-testid="add-todo-btn"]').click();

    cy.contains('Task to delete').should('be.visible');

    // Delete it
    cy.contains('Delete').click();

    cy.contains('Task to delete').should('not.exist');
    cy.get('[data-testid="empty-message"]').should('be.visible');
    cy.get('[data-testid="todo-stats"]').should('contain', 'Total: 0');
  });

  it('should handle multiple todos', () => {
    // Add multiple todos
    const todos = ['Task 1', 'Task 2', 'Task 3'];

    todos.forEach((todo) => {
      cy.get('[data-testid="todo-input"]').type(todo);
      cy.get('[data-testid="add-todo-btn"]').click();
    });

    // Verify all todos are displayed
    todos.forEach((todo) => {
      cy.contains(todo).should('be.visible');
    });

    cy.get('[data-testid="todo-stats"]').should('contain', 'Total: 3');

    // Complete one todo
    cy.get('input[type="checkbox"]').first().click();
    cy.get('[data-testid="todo-stats"]').should('contain', 'Completed: 1');
  });

  it('should complete workflow: add, complete, and delete todos', () => {
    // Add todos
    cy.get('[data-testid="todo-input"]').type('Buy milk{enter}');
    cy.get('[data-testid="todo-input"]').type('Buy eggs{enter}');
    cy.get('[data-testid="todo-input"]').type('Buy bread{enter}');

    cy.get('[data-testid="todo-stats"]').should('contain', 'Total: 3 | Completed: 0');

    // Complete first two todos
    cy.get('input[type="checkbox"]').eq(0).click();
    cy.get('input[type="checkbox"]').eq(1).click();

    cy.get('[data-testid="todo-stats"]').should('contain', 'Total: 3 | Completed: 2');

    // Delete the last todo
    cy.contains('button', 'Delete').last().click();

    cy.get('[data-testid="todo-stats"]').should('contain', 'Total: 2 | Completed: 2');
    cy.contains('Buy bread').should('not.exist');
  });

  it('should maintain todo order', () => {
    const todos = ['First', 'Second', 'Third'];

    todos.forEach((todo) => {
      cy.get('[data-testid="todo-input"]').type(todo);
      cy.get('[data-testid="add-todo-btn"]').click();
    });

    // Verify order
    cy.get('[data-testid="todo-list"] li').should('have.length', 3);
    cy.get('[data-testid="todo-list"] li').eq(0).should('contain', 'First');
    cy.get('[data-testid="todo-list"] li').eq(1).should('contain', 'Second');
    cy.get('[data-testid="todo-list"] li').eq(2).should('contain', 'Third');
  });
});
