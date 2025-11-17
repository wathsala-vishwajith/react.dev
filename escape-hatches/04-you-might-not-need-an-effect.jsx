/**
 * =============================================================================
 * ESCAPE HATCH #4: YOU MIGHT NOT NEED AN EFFECT
 * =============================================================================
 *
 * Hey junior dev! 🚨 This is one of the MOST IMPORTANT lessons about React!
 *
 * EFFECTS ARE OFTEN MISUSED!
 * --------------------------
 * New React developers tend to use effects for EVERYTHING. But effects should
 * ONLY be used for synchronizing with external systems.
 *
 * WHEN YOU DON'T NEED EFFECTS:
 * ----------------------------
 * ❌ Transforming data for rendering
 * ❌ Handling user events
 * ❌ Resetting state when a prop changes
 * ❌ Updating state based on props or state
 * ❌ Sharing logic between event handlers
 *
 * WHEN YOU DO NEED EFFECTS:
 * -------------------------
 * ✅ Fetching data from an API
 * ✅ Setting up subscriptions
 * ✅ Manually manipulating the DOM
 * ✅ Connecting to external systems
 *
 * Let's see WRONG vs RIGHT approaches!
 * =============================================================================
 */

import { useState, useMemo } from 'react';

/**
 * ANTI-PATTERN #1: Using Effects to Transform Data
 * -------------------------------------------------
 * ❌ WRONG: Using effect to update derived state
 * ✅ RIGHT: Calculate during render
 */

// ❌ WRONG APPROACH - Don't do this!
function TransformDataWrong() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: false },
    { id: 3, text: 'Deploy to production', completed: false }
  ]);
  const [completedCount, setCompletedCount] = useState(0); // ❌ Redundant state!

  // ❌ WRONG: Using effect to calculate derived data
  // This causes unnecessary re-renders and adds complexity
  /*
  useEffect(() => {
    setCompletedCount(todos.filter(t => t.completed).length);
  }, [todos]);
  */

  // For this demo, we'll just manually update it to show the wrong pattern
  const handleToggle = (id) => {
    const newTodos = todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTodos(newTodos);
    // ❌ Manually updating - this is error-prone!
    setCompletedCount(newTodos.filter(t => t.completed).length);
  };

  return (
    <div style={{ padding: '20px', border: '3px solid #dc3545', borderRadius: '8px', background: '#fff5f5' }}>
      <h3>❌ WRONG: Effect for Data Transformation</h3>

      <div style={{ marginBottom: '20px' }}>
        <strong style={{ color: '#dc3545' }}>Completed: {completedCount} / {todos.length}</strong>
      </div>

      {todos.map(todo => (
        <div key={todo.id} style={{ marginBottom: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
          </label>
        </div>
      ))}

      <div style={{ marginTop: '20px', padding: '15px', background: '#f8d7da', borderRadius: '5px', fontSize: '14px' }}>
        <strong>⚠️ Problems with this approach:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Extra state variable (completedCount)</li>
          <li>Manual synchronization is error-prone</li>
          <li>Two state updates instead of one</li>
          <li>More code to maintain</li>
        </ul>
      </div>
    </div>
  );
}

// ✅ RIGHT APPROACH - Do this instead!
function TransformDataRight() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: false },
    { id: 3, text: 'Deploy to production', completed: false }
  ]);

  // ✅ RIGHT: Calculate during render - no effect needed!
  const completedCount = todos.filter(t => t.completed).length;

  const handleToggle = (id) => {
    setTodos(todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  return (
    <div style={{ padding: '20px', border: '3px solid #28a745', borderRadius: '8px', background: '#f0fff4' }}>
      <h3>✅ RIGHT: Calculate During Render</h3>

      <div style={{ marginBottom: '20px' }}>
        <strong style={{ color: '#28a745' }}>Completed: {completedCount} / {todos.length}</strong>
      </div>

      {todos.map(todo => (
        <div key={todo.id} style={{ marginBottom: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
          </label>
        </div>
      ))}

      <div style={{ marginTop: '20px', padding: '15px', background: '#d4edda', borderRadius: '5px', fontSize: '14px' }}>
        <strong>✅ Benefits of this approach:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>No redundant state</li>
          <li>Always in sync (can't get out of sync!)</li>
          <li>Less code to maintain</li>
          <li>Simpler and more readable</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * ANTI-PATTERN #2: Using Effects for Expensive Calculations
 * -----------------------------------------------------------
 * ❌ WRONG: Effect + extra state
 * ✅ RIGHT: useMemo for expensive calculations
 */

function ExpensiveCalculationWrong() {
  const [numbers, setNumbers] = useState([1, 2, 3, 4, 5]);
  const [filter, setFilter] = useState('all');
  const [sum, setSum] = useState(0); // ❌ Redundant state!

  // Simulate expensive calculation
  const expensiveSum = (nums) => {
    console.log('💰 Calculating sum (expensive)...');
    // Simulate expensive work
    let total = 0;
    for (let i = 0; i < nums.length; i++) {
      total += nums[i];
    }
    return total;
  };

  // ❌ WRONG: Using effect for calculation
  // Manually update for demo
  const handleAddNumber = () => {
    const newNumbers = [...numbers, numbers.length + 1];
    setNumbers(newNumbers);
    setSum(expensiveSum(newNumbers)); // ❌ Manual sync!
  };

  return (
    <div style={{ padding: '20px', border: '3px solid #dc3545', borderRadius: '8px', background: '#fff5f5' }}>
      <h3>❌ WRONG: Effect for Expensive Calculations</h3>

      <div style={{ marginBottom: '20px', fontSize: '18px' }}>
        Numbers: {numbers.join(', ')}
        <br />
        <strong style={{ color: '#dc3545' }}>Sum: {sum}</strong>
      </div>

      <button onClick={handleAddNumber} style={{ padding: '10px 20px' }}>
        Add Number
      </button>

      <div style={{ marginTop: '20px', padding: '15px', background: '#f8d7da', borderRadius: '5px', fontSize: '14px' }}>
        ⚠️ This recalculates even when filter changes (wasteful)!
      </div>
    </div>
  );
}

function ExpensiveCalculationRight() {
  const [numbers, setNumbers] = useState([1, 2, 3, 4, 5]);
  const [filter, setFilter] = useState('all');

  // Simulate expensive calculation
  const expensiveSum = (nums) => {
    console.log('💰 Calculating sum (expensive)...');
    let total = 0;
    for (let i = 0; i < nums.length; i++) {
      total += nums[i];
    }
    return total;
  };

  // ✅ RIGHT: useMemo caches the result!
  // Only recalculates when 'numbers' changes, not when 'filter' changes
  const sum = useMemo(() => expensiveSum(numbers), [numbers]);

  const handleAddNumber = () => {
    setNumbers([...numbers, numbers.length + 1]);
  };

  return (
    <div style={{ padding: '20px', border: '3px solid #28a745', borderRadius: '8px', background: '#f0fff4' }}>
      <h3>✅ RIGHT: useMemo for Expensive Calculations</h3>

      <div style={{ marginBottom: '20px', fontSize: '18px' }}>
        Numbers: {numbers.join(', ')}
        <br />
        <strong style={{ color: '#28a745' }}>Sum: {sum}</strong>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <button onClick={handleAddNumber} style={{ padding: '10px 20px', marginRight: '10px' }}>
          Add Number
        </button>
        <button onClick={() => setFilter(filter === 'all' ? 'even' : 'all')} style={{ padding: '10px 20px' }}>
          Toggle Filter (No Recalc!)
        </button>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#d4edda', borderRadius: '5px', fontSize: '14px' }}>
        ✅ useMemo only recalculates when numbers change! Check console.
      </div>
    </div>
  );
}

/**
 * ANTI-PATTERN #3: Using Effects to Handle User Events
 * -----------------------------------------------------
 * ❌ WRONG: Effect to respond to user actions
 * ✅ RIGHT: Event handlers!
 */

function HandleEventsWrong() {
  const [product, setProduct] = useState({ name: 'Widget', price: 10, quantity: 1 });
  const [showNotification, setShowNotification] = useState(false);

  // ❌ WRONG: Using effect to respond to quantity changes
  // This makes the code confusing - effects are for external sync, not user events!
  /*
  useEffect(() => {
    if (product.quantity > 0) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }
  }, [product.quantity]);
  */

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(0, product.quantity + delta);
    setProduct({ ...product, quantity: newQuantity });

    // ❌ Side effect buried in state update
    if (newQuantity > 0) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }
  };

  return (
    <div style={{ padding: '20px', border: '3px solid #dc3545', borderRadius: '8px', background: '#fff5f5' }}>
      <h3>❌ WRONG: Effect for User Events</h3>

      <div style={{ marginBottom: '20px' }}>
        <div><strong>{product.name}</strong> - ${product.price}</div>
        <div style={{ fontSize: '24px', margin: '10px 0' }}>Quantity: {product.quantity}</div>

        <button onClick={() => handleQuantityChange(-1)} style={{ padding: '10px 20px', marginRight: '10px' }}>
          −
        </button>
        <button onClick={() => handleQuantityChange(1)} style={{ padding: '10px 20px' }}>
          +
        </button>

        <div style={{ marginTop: '15px', fontSize: '20px', fontWeight: 'bold' }}>
          Total: ${product.price * product.quantity}
        </div>
      </div>

      {showNotification && (
        <div style={{ padding: '10px', background: '#f8d7da', borderRadius: '5px', marginTop: '10px' }}>
          Cart updated!
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '15px', background: '#f8d7da', borderRadius: '5px', fontSize: '14px' }}>
        ⚠️ Using effects for user events makes code hard to follow!
      </div>
    </div>
  );
}

function HandleEventsRight() {
  const [product, setProduct] = useState({ name: 'Widget', price: 10, quantity: 1 });
  const [notification, setNotification] = useState('');

  // ✅ RIGHT: Handle everything in the event handler
  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(0, product.quantity + delta);
    setProduct({ ...product, quantity: newQuantity });

    // ✅ Side effects in event handler - clear and direct!
    if (newQuantity > product.quantity) {
      setNotification('Added to cart!');
    } else if (newQuantity < product.quantity) {
      setNotification('Removed from cart!');
    }

    setTimeout(() => setNotification(''), 2000);
  };

  return (
    <div style={{ padding: '20px', border: '3px solid #28a745', borderRadius: '8px', background: '#f0fff4' }}>
      <h3>✅ RIGHT: Event Handlers for User Events</h3>

      <div style={{ marginBottom: '20px' }}>
        <div><strong>{product.name}</strong> - ${product.price}</div>
        <div style={{ fontSize: '24px', margin: '10px 0' }}>Quantity: {product.quantity}</div>

        <button onClick={() => handleQuantityChange(-1)} style={{ padding: '10px 20px', marginRight: '10px' }}>
          −
        </button>
        <button onClick={() => handleQuantityChange(1)} style={{ padding: '10px 20px' }}>
          +
        </button>

        <div style={{ marginTop: '15px', fontSize: '20px', fontWeight: 'bold' }}>
          Total: ${product.price * product.quantity}
        </div>
      </div>

      {notification && (
        <div style={{ padding: '10px', background: '#d4edda', borderRadius: '5px', marginTop: '10px' }}>
          {notification}
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '15px', background: '#d4edda', borderRadius: '5px', fontSize: '14px' }}>
        ✅ Event handler makes the logic clear and traceable!
      </div>
    </div>
  );
}

/**
 * ANTI-PATTERN #4: Resetting State with Effects
 * ----------------------------------------------
 * ❌ WRONG: Using effect to reset state when prop changes
 * ✅ RIGHT: Use key to reset component or calculate during render
 */

function ResetStateWrong({ userId }) {
  const [comment, setComment] = useState('');
  const [submittedComments, setSubmittedComments] = useState([]);

  // ❌ WRONG: Using effect to reset state
  /*
  useEffect(() => {
    setComment('');
  }, [userId]);
  */

  return (
    <div style={{ padding: '20px', border: '3px solid #dc3545', borderRadius: '8px', background: '#fff5f5' }}>
      <h3>❌ WRONG: Effect to Reset State</h3>
      <p>Commenting as User #{userId}</p>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
        style={{ width: '100%', padding: '10px', minHeight: '80px', marginBottom: '10px' }}
      />

      <button
        onClick={() => {
          if (comment.trim()) {
            setSubmittedComments([...submittedComments, { userId, comment }]);
            setComment('');
          }
        }}
        style={{ padding: '10px 20px' }}
      >
        Submit
      </button>

      <div style={{ marginTop: '20px', padding: '15px', background: '#f8d7da', borderRadius: '5px', fontSize: '14px' }}>
        ⚠️ Comment text persists when switching users (without effect)
      </div>
    </div>
  );
}

// Wrapper to demonstrate key prop
function ResetStateRightWrapper() {
  const [userId, setUserId] = useState(1);

  return (
    <div>
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '5px' }}>
        <strong>Switch User:</strong>
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
          <button onClick={() => setUserId(1)} style={{ padding: '8px 16px' }}>User #1</button>
          <button onClick={() => setUserId(2)} style={{ padding: '8px 16px' }}>User #2</button>
          <button onClick={() => setUserId(3)} style={{ padding: '8px 16px' }}>User #3</button>
        </div>
      </div>

      {/* ✅ RIGHT: Use key to reset component! */}
      <ResetStateRight key={userId} userId={userId} />
    </div>
  );
}

function ResetStateRight({ userId }) {
  const [comment, setComment] = useState('');
  const [submittedComments, setSubmittedComments] = useState([]);

  // ✅ NO EFFECT NEEDED! Component resets when key changes

  return (
    <div style={{ padding: '20px', border: '3px solid #28a745', borderRadius: '8px', background: '#f0fff4' }}>
      <h3>✅ RIGHT: Use Key Prop to Reset</h3>
      <p>Commenting as User #{userId}</p>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
        style={{ width: '100%', padding: '10px', minHeight: '80px', marginBottom: '10px' }}
      />

      <button
        onClick={() => {
          if (comment.trim()) {
            setSubmittedComments([...submittedComments, { userId, comment }]);
            setComment('');
          }
        }}
        style={{ padding: '10px 20px' }}
      >
        Submit
      </button>

      {submittedComments.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <strong>Your comments:</strong>
          {submittedComments.map((c, i) => (
            <div key={i} style={{ padding: '8px', background: '#fff', borderRadius: '4px', marginTop: '5px', fontSize: '14px' }}>
              {c.comment}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '15px', background: '#d4edda', borderRadius: '5px', fontSize: '14px' }}>
        ✅ Component resets automatically when userId changes!
      </div>
    </div>
  );
}

/**
 * MAIN APP COMPONENT
 * ------------------
 * Shows all the anti-patterns and their correct alternatives
 */
export default function YouMightNotNeedAnEffect() {
  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>🚨 Escape Hatch #4: You Might Not Need an Effect</h1>

      <div style={{
        background: '#fff3cd',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: '3px solid #ffc107'
      }}>
        <h2>⚠️ Important: Effects Are Overused!</h2>
        <p style={{ fontSize: '18px', margin: '10px 0' }}>
          <strong>Rule of thumb:</strong> If you can calculate something during render,
          you don't need an effect!
        </p>
        <p style={{ fontSize: '16px' }}>
          Effects should ONLY be used for synchronizing with external systems
          (APIs, browser APIs, third-party libraries).
        </p>
      </div>

      <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>
        Anti-Pattern #1: Transforming Data
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
        <TransformDataWrong />
        <TransformDataRight />
      </div>

      <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>
        Anti-Pattern #2: Expensive Calculations
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
        <ExpensiveCalculationWrong />
        <ExpensiveCalculationRight />
      </div>

      <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>
        Anti-Pattern #3: Handling User Events
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
        <HandleEventsWrong />
        <HandleEventsRight />
      </div>

      <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>
        Anti-Pattern #4: Resetting State
      </h2>
      <div style={{ marginBottom: '40px' }}>
        <ResetStateRightWrapper />
      </div>

      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <h2>🎓 Key Takeaways</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Don't use effects for data transformation</strong> - calculate during render</li>
          <li><strong>Don't use effects for expensive calculations</strong> - use useMemo</li>
          <li><strong>Don't use effects for user events</strong> - use event handlers</li>
          <li><strong>Don't use effects to reset state</strong> - use key prop or calculate during render</li>
          <li><strong>DO use effects ONLY for external synchronization</strong></li>
        </ul>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '20px',
        background: '#d4edda',
        borderRadius: '8px',
        border: '2px solid #28a745'
      }}>
        <h3>✅ When You DO Need Effects:</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Fetching data from APIs</li>
          <li>Setting up subscriptions (WebSockets, event listeners)</li>
          <li>Manually changing the DOM (for non-React libraries)</li>
          <li>Logging analytics</li>
          <li>Any other synchronization with external systems</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * =============================================================================
 * HOMEWORK FOR JUNIOR DEVS 📝
 * =============================================================================
 *
 * Review your code and find these anti-patterns:
 *
 * 1. Find any place where you use useEffect + useState for derived data
 *    → Replace with a regular variable
 *
 * 2. Find any expensive calculations in effects
 *    → Replace with useMemo
 *
 * 3. Find any effects that respond to user actions
 *    → Move logic to event handlers
 *
 * 4. Find any effects that reset state based on props
 *    → Use key prop instead
 *
 * Remember: Effects are an escape hatch, not your first choice! 🎯
 * =============================================================================
 */
