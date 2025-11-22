# React Testing Strategy Demo

This project demonstrates a complete testing strategy for React applications, featuring:

- **Unit Tests** with Vitest (Jest-compatible)
- **Component Tests** with React Testing Library
- **E2E Tests** with Cypress
- **Test Coverage Reporting** with v8

## Table of Contents

- [Quick Start](#quick-start)
- [Testing Strategy](#testing-strategy)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Testing Levels](#testing-levels)
- [Best Practices](#best-practices)
- [Coverage Reports](#coverage-reports)
- [CI/CD Integration](#cicd-integration)

## Quick Start

### Installation

```bash
npm install
```

### Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Run All Tests

```bash
# Run unit and component tests
npm test

# Run unit/component tests once
npm run test:run

# Run with coverage
npm run test:coverage

# Open Cypress for E2E tests (requires Cypress binary installation)
npm run cypress

# Run E2E tests headless
npm run e2e:headless

# Run ALL tests (unit + component + E2E)
npm run test:all
```

## Testing Strategy

This project follows the **Testing Pyramid** approach:

```
       /\
      /  \     E2E Tests (Cypress)
     /----\    - Few, high-level tests
    /      \   - Test complete user workflows
   /--------\
  /          \ Component Tests (React Testing Library)
 /------------\- Medium number of tests
/              \- Test component behavior and user interactions
----------------
                Unit Tests (Vitest)
                - Many, fast tests
                - Test individual functions and logic
```

### Why This Approach?

1. **Unit Tests** are fast, isolated, and test business logic
2. **Component Tests** ensure UI components work correctly
3. **E2E Tests** validate complete user workflows

## Running Tests

### Unit Tests (Vitest)

```bash
# Run in watch mode (default)
npm test

# Run once
npm run test:run

# Run with UI
npm run test:ui

# Watch mode
npm run test:watch
```

**What we test:**
- Pure functions (`src/utils/math.ts`, `src/utils/string.ts`)
- API services with mocks (`src/services/api.ts`)
- Business logic
- Edge cases and error handling

**Example:** `src/utils/math.test.ts`
```typescript
describe('Math Utilities', () => {
  it('should add two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should throw error when dividing by zero', () => {
    expect(() => divide(5, 0)).toThrow('Division by zero');
  });
});
```

### Component Tests (React Testing Library)

```bash
npm test
```

**What we test:**
- Component rendering
- User interactions (clicks, typing, form submissions)
- State changes
- Conditional rendering
- Accessibility

**Example:** `src/components/Counter.test.tsx`
```typescript
it('should increment count when button is clicked', () => {
  render(<Counter />);
  const button = screen.getByTestId('increment-btn');

  fireEvent.click(button);
  expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 1');
});
```

### E2E Tests (Cypress)

```bash
# Open Cypress Test Runner (interactive)
npm run cypress

# Run headless
npm run cypress:headless

# Run E2E with dev server (recommended)
npm run e2e
```

**Note:** You need to install the Cypress binary first if it's not already installed:
```bash
npx cypress install
```

**What we test:**
- Complete user workflows
- Multiple component interactions
- Navigation flows
- Real browser behavior
- Responsive design

**Example:** `cypress/e2e/counter.cy.ts`
```typescript
it('should handle multiple operations in sequence', () => {
  cy.visit('/');
  cy.get('[data-testid="increment-btn"]').click();
  cy.get('[data-testid="increment-btn"]').click();
  cy.get('[data-testid="decrement-btn"]').click();
  cy.get('[data-testid="count-display"]').should('contain', 'Count: 1');
});
```

## Project Structure

```
tdd/
├── cypress/
│   ├── e2e/
│   │   ├── app.cy.ts         # Application-level E2E tests
│   │   ├── counter.cy.ts     # Counter component E2E tests
│   │   └── todo.cy.ts        # TodoList component E2E tests
│   ├── fixtures/             # Test data
│   └── support/              # Cypress configuration
├── src/
│   ├── components/
│   │   ├── Counter.tsx       # Counter component
│   │   ├── Counter.test.tsx  # Counter component tests
│   │   ├── TodoList.tsx      # TodoList component
│   │   └── TodoList.test.tsx # TodoList component tests
│   ├── services/
│   │   ├── api.ts            # API service
│   │   └── api.test.ts       # API service tests (with mocks)
│   ├── utils/
│   │   ├── math.ts           # Math utilities
│   │   ├── math.test.ts      # Math unit tests
│   │   ├── string.ts         # String utilities
│   │   └── string.test.ts    # String unit tests
│   └── test/
│       └── setup.ts          # Test setup and configuration
├── cypress.config.ts         # Cypress configuration
├── vitest.config.ts          # Vitest configuration
└── package.json              # Scripts and dependencies
```

## Testing Levels

### Level 1: Unit Tests

**Purpose:** Test individual functions and modules in isolation

**Tools:** Vitest (Jest-compatible)

**Files:**
- `src/utils/math.test.ts` - Mathematical operations
- `src/utils/string.test.ts` - String manipulation
- `src/services/api.test.ts` - API calls (mocked)

**Characteristics:**
- Fast execution (milliseconds)
- No DOM required
- Test business logic
- Use mocks for external dependencies

### Level 2: Component Tests

**Purpose:** Test React components with user interactions

**Tools:** React Testing Library + Vitest

**Files:**
- `src/components/Counter.test.tsx`
- `src/components/TodoList.test.tsx`

**Characteristics:**
- Render components
- Simulate user events
- Test state changes
- Verify DOM output
- Focus on behavior, not implementation

### Level 3: E2E Tests

**Purpose:** Test complete user workflows in a real browser

**Tools:** Cypress

**Files:**
- `cypress/e2e/app.cy.ts` - Full application tests
- `cypress/e2e/counter.cy.ts` - Counter workflows
- `cypress/e2e/todo.cy.ts` - Todo workflows

**Characteristics:**
- Slower execution (seconds)
- Real browser environment
- Test user journeys
- Catch integration issues
- Test responsive design

## Best Practices

### General Testing Principles

1. **Test behavior, not implementation**
   - ✅ Test what users see and do
   - ❌ Don't test internal component state directly

2. **Use data-testid for stable selectors**
   - ✅ `data-testid="submit-button"`
   - ❌ `.btn-primary` or complex CSS selectors

3. **Write descriptive test names**
   - ✅ `it('should add a todo when Enter key is pressed', ...)`
   - ❌ `it('test 1', ...)`

4. **Follow AAA Pattern**
   - **Arrange:** Set up test data
   - **Act:** Perform action
   - **Assert:** Verify result

### Unit Testing Best Practices

- Test one thing per test
- Use descriptive test names
- Test edge cases and errors
- Keep tests fast and isolated
- Mock external dependencies

### Component Testing Best Practices

- Use `@testing-library/react` queries by priority:
  1. `getByRole` (accessibility)
  2. `getByLabelText`
  3. `getByTestId` (last resort)
- Test user interactions, not implementation
- Clean up after each test (handled by setup)
- Use `userEvent` for realistic interactions

### E2E Testing Best Practices

- Keep E2E tests focused on critical paths
- Use `beforeEach` for navigation setup
- Wait for elements explicitly
- Test realistic user workflows
- Don't over-use E2E (they're slow)

## Coverage Reports

### View Coverage

```bash
# Generate coverage report
npm run test:coverage
```

### Coverage Output

The coverage report includes:
- **Statements:** Percentage of code statements executed
- **Branches:** Percentage of conditional branches tested
- **Functions:** Percentage of functions called
- **Lines:** Percentage of lines executed

### Coverage Reports Are Generated In:

- **Terminal:** Text summary
- **HTML:** `coverage/index.html` (open in browser)
- **JSON:** `coverage/coverage-final.json`
- **LCOV:** `coverage/lcov.info` (for CI tools)

### Current Coverage

This project maintains **100% test coverage** across all metrics:

```
File           | % Stmts | % Branch | % Funcs | % Lines
---------------|---------|----------|---------|----------
All files      |     100 |      100 |     100 |     100
 components    |     100 |      100 |     100 |     100
 services      |     100 |      100 |     100 |     100
 utils         |     100 |      100 |     100 |     100
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run unit/component tests
        run: npm run test:run

      - name: Generate coverage
        run: npm run test:coverage

      - name: Run E2E tests
        run: npm run e2e:headless

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## Key Technologies

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Vitest** - Unit test runner (Jest-compatible)
- **React Testing Library** - Component testing
- **Cypress** - E2E testing
- **@vitest/coverage-v8** - Code coverage

## NPM Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run all tests once |
| `npm run test:ui` | Open Vitest UI |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:watch` | Run tests in watch mode |
| `npm run cypress` | Open Cypress Test Runner |
| `npm run cypress:headless` | Run Cypress headless |
| `npm run e2e` | Run E2E with dev server |
| `npm run e2e:headless` | Run E2E headless with dev server |
| `npm run test:all` | Run all tests (unit + E2E) |

## Learn More

### Documentation

- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Cypress](https://www.cypress.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Testing Philosophy

This project follows the [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications) philosophy:

- Write mostly integration tests (component tests)
- Some E2E tests for critical paths
- Many unit tests for business logic
- Focus on confidence and maintainability

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
