import { useState } from 'react';

/**
 * ✅ CORRECT: Use a single state object or array for multiple items
 *
 * Instead of calling useState in a loop, use a single state
 * that holds all the data you need.
 */
function LoopHookCorrect({ items }) {
  // ✅ CORRECT: Single state holding all values
  const [values, setValues] = useState(
    items.reduce((acc, item, index) => {
      acc[index] = item;
      return acc;
    }, {})
  );

  const updateValue = (index, newValue) => {
    setValues(prev => ({
      ...prev,
      [index]: newValue
    }));
  };

  return (
    <div>
      <h3>Loop Hook Example (CORRECT)</h3>
      {items.map((item, index) => (
        <div key={index}>
          <span>{values[index]}</span>
          <button onClick={() => updateValue(index, `Updated ${item}`)}>
            Update
          </button>
        </div>
      ))}
    </div>
  );
}

/**
 * ✅ CORRECT: Use an array in state for multiple items
 */
function ArrayStateCorrect({ initialColors }) {
  // ✅ CORRECT: Single state for all selections
  const [selectedColors, setSelectedColors] = useState(
    initialColors.map(() => false)
  );

  const toggleColor = (index) => {
    setSelectedColors(prev =>
      prev.map((selected, i) => (i === index ? !selected : selected))
    );
  };

  return (
    <div>
      <h3>Array State Example (CORRECT)</h3>
      {initialColors.map((color, index) => (
        <div
          key={index}
          style={{
            padding: '10px',
            margin: '5px',
            backgroundColor: selectedColors[index] ? color : 'white',
            border: '1px solid black'
          }}
        >
          {color}
          <button onClick={() => toggleColor(index)}>
            {selectedColors[index] ? 'Deselect' : 'Select'}
          </button>
        </div>
      ))}
    </div>
  );
}

/**
 * ✅ CORRECT: Create separate components for repeated items
 */
function ColorItem({ color, initialSelected = false }) {
  // ✅ CORRECT: Each component instance has its own state
  const [selected, setSelected] = useState(initialSelected);

  return (
    <div
      style={{
        padding: '10px',
        margin: '5px',
        backgroundColor: selected ? color : 'white',
        border: '1px solid black'
      }}
    >
      {color}
      <button onClick={() => setSelected(!selected)}>
        {selected ? 'Deselect' : 'Select'}
      </button>
    </div>
  );
}

function ComponentPerItemCorrect({ colors }) {
  return (
    <div>
      <h3>Component Per Item Example (CORRECT)</h3>
      {colors.map((color, index) => (
        <ColorItem key={index} color={color} />
      ))}
    </div>
  );
}

export { LoopHookCorrect, ArrayStateCorrect, ComponentPerItemCorrect };
