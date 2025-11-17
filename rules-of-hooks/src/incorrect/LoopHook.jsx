import { useState } from 'react';

/**
 * ❌ INCORRECT: Calling hooks inside loops
 *
 * The number of hooks must be consistent across renders.
 * Calling hooks in loops can cause this to vary.
 */
function LoopHookIncorrect({ items }) {
  const states = [];

  // ❌ WRONG: Hook called inside a loop
  for (let i = 0; i < items.length; i++) {
    // This will cause an error - the number of useState calls
    // changes when items.length changes
    const [value, setValue] = useState(items[i]);
    states.push([value, setValue]);
  }

  return (
    <div>
      <h3>Loop Hook Example (INCORRECT)</h3>
      {items.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </div>
  );
}

/**
 * ❌ INCORRECT: Calling hooks inside forEach
 */
function ForEachHookIncorrect({ colors }) {
  // ❌ WRONG: Hook called inside forEach
  colors.forEach((color) => {
    const [selected, setSelected] = useState(false);
  });

  return <div>Colors example (INCORRECT)</div>;
}

export { LoopHookIncorrect, ForEachHookIncorrect };
