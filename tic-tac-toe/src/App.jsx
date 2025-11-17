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
// Manages the state of all 9 squares in the board
export default function Board() {
  // State: array of 9 elements, each representing a square (null = empty)
  const [squares, setSquares] = useState(Array(9).fill(null));
  // State: track whose turn it is (true = X's turn, false = O's turn)
  const [xIsNext, setXIsNext] = useState(true);

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
    // Update state with the new array
    setSquares(nextSquares);
    // Toggle whose turn it is for the next move
    setXIsNext(!xIsNext);
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
