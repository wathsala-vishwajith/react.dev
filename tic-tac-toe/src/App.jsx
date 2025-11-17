import { useState } from 'react';

// Square component - represents a single square on the board
// Receives value and onSquareClick as props from parent Board component
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Board component - renders the 3x3 grid of squares
// Now a controlled component that receives data and callbacks from parent
function Board({ xIsNext, squares, onPlay }) {
  // Handle click on a square
  function handleClick(i) {
    // If there's already a winner or square is filled, ignore the click
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // Create a copy of the squares array (immutability)
    const nextSquares = squares.slice();
    // Set the clicked square to "X" or "O" depending on whose turn it is
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    // Call the parent's onPlay function to update the game state
    onPlay(nextSquares);
  }

  // Calculate winner and update status message
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// Game component - manages game state and history
// This is the top-level component that orchestrates the game
export default function Game() {
  // State: history of all board states, starting with empty board
  // history is an array of arrays: [[null,null,...], [null,'X',null,...], ...]
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // State: which move in history we're currently viewing
  const [currentMove, setCurrentMove] = useState(0);
  // Calculate whose turn it is based on current move number
  // Even moves (0, 2, 4...) are X's turn, odd moves (1, 3, 5...) are O's turn
  const xIsNext = currentMove % 2 === 0;
  // Get the current board state from history
  const currentSquares = history[currentMove];

  // Handle a play - called when a square is clicked
  function handlePlay(nextSquares) {
    // Create new history by taking all moves up to current, then adding the new move
    // This discards any "future" history if we made a move from a past position
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // Jump to a specific move in history
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Create buttons for each move in the history
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// Helper function to calculate the winner
// Returns 'X', 'O', or null if no winner yet
function calculateWinner(squares) {
  // All possible winning combinations (rows, columns, diagonals)
  const lines = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal from top-left
    [2, 4, 6], // Diagonal from top-right
  ];

  // Check each winning combination
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // If all three squares in a line have the same non-null value, we have a winner
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  // No winner found
  return null;
}
