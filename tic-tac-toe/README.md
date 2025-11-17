# React Tic-Tac-Toe Tutorial

A step-by-step implementation of the classic tic-tac-toe game, built to learn React fundamentals. This tutorial is perfect for React beginners and covers essential concepts like components, state, props, and more.

## What You'll Build

An interactive tic-tac-toe game with:
- ✅ Two-player gameplay (X and O take turns)
- ✅ Winner detection for all possible winning combinations
- ✅ Draw/tie game detection
- ✅ Game history tracking
- ✅ Time travel feature to review and replay any previous move

## Getting Started

### Prerequisites

- Node.js installed on your computer (version 14 or higher)
- Basic understanding of HTML, CSS, and JavaScript
- A code editor (VS Code recommended)

### Installation

1. Navigate to the tic-tac-toe directory:
   ```bash
   cd tic-tac-toe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser to `http://localhost:5173` (or the URL shown in terminal)

## Project Structure

```
tic-tac-toe/
├── src/
│   ├── App.jsx          # Main game components (Square, Board, Game)
│   ├── index.jsx        # React app entry point
│   └── styles.css       # Game styling
├── index.html           # HTML template
├── package.json         # Project dependencies
├── vite.config.js       # Vite build configuration
└── README.md           # This file
```

## Tutorial Steps

This project was built incrementally through the following steps:

### Step 1: Initial Setup
- Created project structure with Vite + React
- Set up basic HTML and CSS
- Created initial Square and Board components with static content

**Key Concepts:** Components, JSX, Props

### Step 2: Making Squares Interactive
- Added click handlers to Square components
- Introduced state management with `useState` hook
- Lifted state up from Square to Board component
- Implemented immutability by creating new arrays

**Key Concepts:** Event handling, State (`useState`), Lifting state up, Immutability

### Step 3: Turn Taking
- Added `xIsNext` state to track current player
- Toggled between X and O on each move
- Displayed current player in status message
- Prevented overwriting filled squares

**Key Concepts:** Boolean state, Conditional logic, Multiple state variables

### Step 4: Winner Detection
- Created `calculateWinner` helper function
- Defined all 8 winning combinations (rows, columns, diagonals)
- Updated status to show winner or next player
- Prevented moves after game completion

**Key Concepts:** Helper functions, Loops, Array destructuring

### Step 5: Game History & Time Travel
- Created Game component as top-level orchestrator
- Converted Board to controlled component
- Stored complete game history as array of board states
- Implemented jump-to-move functionality
- Calculated `xIsNext` from move number (derived state)

**Key Concepts:** Component composition, Controlled components, Array operations, Derived state

### Step 6: Final Polish
- Added draw/tie game detection
- Highlighted current move in history
- Improved user interface clarity

**Key Concepts:** `Array.every()`, Conditional rendering, UX design

## Key React Concepts Explained

### Components
Components are reusable pieces of UI. This project has three components:
- `Square`: A single clickable button
- `Board`: The 3x3 grid of squares
- `Game`: The top-level component managing everything

### Props
Props let you pass data from parent to child components:
```jsx
<Square value="X" onSquareClick={handleClick} />
```

### State
State is data that changes over time. We use `useState` hook:
```jsx
const [squares, setSquares] = useState(Array(9).fill(null));
```

### Immutability
Always create new copies of data instead of modifying:
```jsx
const nextSquares = squares.slice(); // Copy array
nextSquares[0] = 'X';                // Modify copy
setSquares(nextSquares);              // Update state
```

Why? React needs to detect changes to know when to re-render.

### Lifting State Up
When multiple components need to share state, move it to their common parent. In this game:
- Board needed to know all square values → state lives in Board
- Game needed to track history → state lives in Game

### Controlled Components
A component that receives its data via props (controlled by parent):
```jsx
function Board({ xIsNext, squares, onPlay }) {
  // Board doesn't own this data, it's passed from Game
}
```

## How the Game Works

### Data Flow

1. **Game Component** (top level)
   - Stores: `history` (all board states), `currentMove` (which move we're viewing)
   - Calculates: `xIsNext` (derived from currentMove), `currentSquares` (from history)
   - Renders: Board component and move history buttons

2. **Board Component** (middle)
   - Receives: `squares`, `xIsNext`, `onPlay` callback
   - Handles: Square clicks, winner calculation, status display
   - Renders: 9 Square components

3. **Square Component** (bottom)
   - Receives: `value` to display, `onSquareClick` callback
   - Renders: A single button

### State Updates Flow

When a square is clicked:
1. Square's `onClick` → calls Board's `handleClick(i)`
2. Board's `handleClick` → creates new board state → calls Game's `onPlay(nextSquares)`
3. Game's `handlePlay` → updates history → updates currentMove
4. React re-renders everything with new data
5. User sees updated board

## Code Walkthrough

### Winner Calculation

```jsx
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // Return 'X' or 'O'
    }
  }
  return null; // No winner
}
```

### Time Travel Implementation

The key insight: Store entire board history, not just current state.

```jsx
// Instead of just current board:
const [squares, setSquares] = useState(Array(9).fill(null));

// Store all boards:
const [history, setHistory] = useState([Array(9).fill(null)]);
const [currentMove, setCurrentMove] = useState(0);
```

When jumping to a move, just update `currentMove` - the board re-renders from history!

## Ideas for Extension

Want to practice more? Try adding these features:

1. **Display coordinates** - Show (row, col) instead of move numbers
2. **Highlight winning line** - Make the three winning squares bold/colored
3. **Responsive board** - Use CSS Grid for better mobile layout
4. **Sort moves** - Add toggle to show moves in ascending/descending order
5. **AI opponent** - Implement a simple computer player
6. **Bigger boards** - Make it work for 4x4 or 5x5 grids
7. **Animations** - Add CSS transitions when squares are clicked
8. **Sound effects** - Play sounds for moves and wins

## Common Beginner Questions

### Why use `const` with arrays if they change?
`const` prevents reassigning the variable, but array/object contents can change. However, in React we always create NEW arrays/objects instead of modifying.

### Why not just `squares[i] = 'X'`?
React detects changes by comparing references. If you modify an array directly, the reference doesn't change, so React won't re-render. Always create new copies.

### What's the difference between state and props?
- **State**: Data owned by the component, can change over time
- **Props**: Data passed from parent, read-only in child component

### Why does time travel work?
Because we store immutable snapshots of each board state. We can "travel" by just changing which snapshot we're viewing.

## Resources

- [Official React Tutorial](https://react.dev/learn/tutorial-tic-tac-toe) - The original tutorial this is based on
- [React Documentation](https://react.dev) - Complete React reference
- [Thinking in React](https://react.dev/learn/thinking-in-react) - Mental model for building React apps
- [React Hooks Reference](https://react.dev/reference/react) - All about hooks like useState

## What's Next?

After mastering this tutorial, you're ready to:
1. Build your own small React projects
2. Learn about useEffect hook for side effects
3. Explore React Router for multi-page apps
4. Study state management with Context API or Redux
5. Learn about forms and validation in React

## Git Commit History

This project was built incrementally with meaningful commits at each step. Check the git history to see the progression:

```bash
git log --oneline
```

Each commit represents a logical step in the tutorial, perfect for learning!

## License

This is a tutorial project based on the official React documentation. Feel free to use it for learning purposes.

---

**Happy Learning!** If you got stuck or have questions, review the code comments in `src/App.jsx` - every section is thoroughly explained.
