# React Portals Examples

Comprehensive examples demonstrating React's `createPortal` API with real-world use cases and best practices.

## 📚 What Are Portals?

**Portals** provide a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.

```jsx
import { createPortal } from 'react-dom';

// Render children into a different part of the DOM
createPortal(child, domNode)
```

### The Problem Portals Solve

Normally, when you return JSX from a component, React renders it as a child of the nearest parent element in the DOM. But sometimes this causes problems:

```jsx
function Parent() {
  return (
    <div style={{ overflow: 'hidden' }}>
      <Modal /> {/* ❌ Modal gets clipped by parent's overflow! */}
    </div>
  );
}
```

**Common CSS issues without portals:**
- `overflow: hidden` clips your modal or tooltip
- `z-index` stacking contexts prevent proper layering
- `transform` breaks `position: fixed`
- Parent opacity affects descendants
- Parent filters create stacking contexts

### The Solution

```jsx
function Modal() {
  // Render to a different part of the DOM
  return createPortal(
    <div className="modal">Modal content</div>,
    document.getElementById('modal-root') // ✅ Render here instead!
  );
}
```

Now the modal:
- ✅ Escapes parent CSS constraints
- ✅ Can use `position: fixed` reliably
- ✅ Creates its own stacking context
- ✅ Still receives props and context from React parent
- ✅ Events still bubble through React component tree

## 📂 Files in This Directory

### 1. **BasicPortalExample.jsx** - Modal Dialog
Learn the fundamentals of portals with a classic modal implementation:
- How `createPortal` works
- Setting up portal mount points in HTML
- Modal with backdrop and form handling
- Why portals are better than regular rendering

### 2. **WithoutPortal.jsx** - Common Problems
See what happens when you DON'T use portals:
- **Overflow Problem**: Parent `overflow: hidden` clips modal
- **Z-Index Problem**: Stacking contexts prevent proper layering
- **Transform Problem**: Parent `transform` breaks `position: fixed`
- Side-by-side comparisons showing the issues

### 3. **AdvancedPortalExample.jsx** - Real-World Patterns
Production-ready patterns for common UI components:
- **Tooltips**: Position-aware tooltips that escape overflow
- **Toast Notifications**: Global notification system
- **Dropdown Menus**: Context menus with click-outside detection
- Dynamic positioning and multiple portals

### 4. **EventBubblingExample.jsx** - Event System
Understand how events work with portals:
- Events bubble through React tree, not DOM tree
- Interactive demos with event logging
- Visual comparison of DOM vs React trees
- Best practices for event handling

## 🎯 Core Concepts

### 1. Portal Syntax

```jsx
createPortal(children, domNode, key?)
```

**Parameters:**
- `children`: React elements (JSX, strings, fragments, etc.)
- `domNode`: A DOM node (e.g., `document.getElementById('modal-root')`)
- `key`: Optional unique string for reconciliation

**Returns:** A React node (include it in JSX like any other React child)

### 2. Setting Up Portal Targets

In your HTML file (e.g., `index.html`):

```html
<body>
  <div id="root"></div>       <!-- Main React app -->
  <div id="modal-root"></div>  <!-- Portal target for modals -->
  <div id="tooltip-root"></div> <!-- Portal target for tooltips -->
</body>
```

### 3. Event Bubbling

**Critical Concept:** Events bubble through the **React component tree**, not the DOM tree!

```jsx
function Parent() {
  const handleClick = () => console.log('Parent clicked!');

  return (
    <div onClick={handleClick}>
      {createPortal(
        <button>Click me</button>,
        document.body
      )}
    </div>
  );
}
```

Clicking the button logs "Parent clicked!" even though in the DOM, the button is not inside the div!

**Why this matters:**
- Parent components can handle events from portal children
- `e.stopPropagation()` works as expected
- Event delegation patterns work normally
- Context providers work across portal boundaries

## 🔍 Common Use Cases

### Modals and Dialogs

```jsx
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}
```

**Why use portals:**
- Escape parent overflow
- Guarantee high z-index
- Position fixed relative to viewport

### Tooltips

```jsx
function Tooltip({ targetRef, text }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const rect = targetRef.current.getBoundingClientRect();
    setPosition({ x: rect.left, y: rect.top - 30 });
  }, [targetRef]);

  return createPortal(
    <div style={{ position: 'absolute', top: position.y, left: position.x }}>
      {text}
    </div>,
    document.getElementById('tooltip-root')
  );
}
```

**Why use portals:**
- Not clipped by parent containers
- Can position relative to viewport
- High z-index guaranteed

### Toast Notifications

```jsx
function ToastContainer({ toasts }) {
  return createPortal(
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>,
    document.getElementById('notification-root')
  );
}
```

**Why use portals:**
- Global positioning (top-right, etc.)
- Not affected by page scrolling
- Consistent z-index across app

## ✨ Best Practices

### 1. Create Dedicated Portal Targets

```html
<!-- Good: Semantic, organized portal targets -->
<div id="modal-root"></div>
<div id="tooltip-root"></div>
<div id="notification-root"></div>

<!-- Avoid: Rendering everything to document.body -->
```

**Why:** Easier debugging, better organization, clearer separation of concerns.

### 2. Clean Up on Unmount

```jsx
function Portal({ children }) {
  useEffect(() => {
    return () => {
      // Clean up any side effects
      // (usually handled automatically by React)
    };
  }, []);

  return createPortal(children, document.getElementById('portal-root'));
}
```

### 3. Handle Accessibility

```jsx
function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return;

    // Trap focus inside modal
    const handleTab = (e) => {
      // Focus trapping logic...
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // Add ARIA attributes
  return createPortal(
    <div role="dialog" aria-modal="true">
      {children}
    </div>,
    document.getElementById('modal-root')
  );
}
```

**Important accessibility considerations:**
- Use `role="dialog"` and `aria-modal="true"`
- Trap focus inside modals
- Handle Escape key to close
- Announce modal opening to screen readers
- Return focus to trigger element on close

### 4. Use stopPropagation Wisely

```jsx
function Modal({ onClose, children }) {
  return createPortal(
    <div onClick={onClose}> {/* Close on backdrop click */}
      <div onClick={e => e.stopPropagation()}> {/* Don't close on content click */}
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}
```

### 5. Consider Server-Side Rendering (SSR)

Portal targets don't exist on the server! Handle this carefully:

```jsx
function Portal({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Don't render on server

  return createPortal(
    children,
    document.getElementById('portal-root')
  );
}
```

Or use lazy loading:

```jsx
import dynamic from 'next/dynamic';

// Only load on client side
const Modal = dynamic(() => import('./Modal'), { ssr: false });
```

## 🚀 Running These Examples

### Option 1: Run the Vite Dev Server

```bash
cd react-portals
npm install
npm run dev
```

Then open your browser to the URL shown (usually `http://localhost:5173`).

### Option 2: Copy Into Your Project

1. Copy any `.jsx` file into your React project
2. Ensure your `index.html` has the required portal targets:
   ```html
   <div id="modal-root"></div>
   <div id="tooltip-root"></div>
   <div id="notification-root"></div>
   ```
3. Import and use:
   ```jsx
   import BasicPortalExample from './react-portals/BasicPortalExample';
   ```

## 🎓 Learning Path

**Recommended order for learning:**

1. **Start with BasicPortalExample.jsx**
   - Understand the core API
   - See a simple modal implementation
   - Inspect the DOM to see where things render

2. **Next, check out WithoutPortal.jsx**
   - See the problems portals solve
   - Understand CSS issues (overflow, z-index, transform)
   - Appreciate why portals are necessary

3. **Explore AdvancedPortalExample.jsx**
   - Learn production patterns
   - See tooltips, notifications, dropdowns
   - Understand positioning strategies

4. **Finish with EventBubblingExample.jsx**
   - Master the event system
   - Understand React tree vs DOM tree
   - Learn best practices for event handling

## 🔧 Common Pitfalls and Solutions

### Pitfall 1: Portal Target Doesn't Exist

```jsx
// ❌ Error: Cannot read property 'appendChild' of null
createPortal(children, document.getElementById('missing-root'))
```

**Solution:** Always check the target exists:

```jsx
const portalRoot = document.getElementById('portal-root');
if (!portalRoot) return null;
return createPortal(children, portalRoot);
```

### Pitfall 2: Memory Leaks with Event Listeners

```jsx
// ❌ Event listeners not cleaned up
useEffect(() => {
  document.addEventListener('click', handleClick);
  // Missing cleanup!
});
```

**Solution:** Always return cleanup function:

```jsx
useEffect(() => {
  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}, []);
```

### Pitfall 3: Forgetting stopPropagation

```jsx
// ❌ Clicking modal content also closes modal
<div onClick={onClose}>
  <div>Modal content</div>
</div>
```

**Solution:** Stop propagation on content:

```jsx
<div onClick={onClose}>
  <div onClick={e => e.stopPropagation()}>
    Modal content
  </div>
</div>
```

### Pitfall 4: Not Handling SSR

```jsx
// ❌ Breaks during server-side rendering
return createPortal(children, document.getElementById('root'));
```

**Solution:** Check if document exists:

```jsx
if (typeof document === 'undefined') return null;
return createPortal(children, document.getElementById('root'));
```

## 📊 Portal vs. Alternatives

| Approach | Pros | Cons | Use When |
|----------|------|------|----------|
| **Portal** | Escapes CSS constraints, maintains React tree | Requires setup, complexity | Modals, tooltips, global UI |
| **High z-index** | Simple | Doesn't escape overflow/transform | Simple layering in same container |
| **position: fixed** | Simple | Breaks with parent transform | No transform in parent chain |
| **Separate React root** | Complete isolation | Breaks React tree, no context | Completely independent app |
| **State management** | No DOM manipulation | Doesn't solve CSS issues | Coordinating state only |

## 🎯 When to Use Portals

**✅ Use portals for:**
- Modals and dialogs
- Tooltips and popovers
- Dropdown menus
- Toast/notification systems
- Fullscreen overlays
- Custom context menus
- Lightboxes and image viewers
- Anything that needs to escape parent CSS

**❌ Don't use portals for:**
- Regular content that works fine in normal flow
- Content that doesn't need special positioning
- When parent CSS isn't an issue
- Over-engineering simple components

## 📖 Additional Resources

- [Official React Documentation: Portals](https://react.dev/reference/react-dom/createPortal)
- [React Documentation: Portals (Legacy)](https://legacy.reactjs.org/docs/portals.html)
- [Portals and Event Bubbling](https://react.dev/reference/react-dom/createPortal#portal-events-bubble-through-react-tree)

## 💡 Key Takeaways

1. **Portals render to a different DOM location** while maintaining React component tree relationships

2. **Events bubble through React tree**, not DOM tree - parent components can handle portal events

3. **Portals solve CSS problems** like overflow, z-index, and transform constraints

4. **Common use cases** include modals, tooltips, notifications, and dropdowns

5. **Best practices** include dedicated portal targets, accessibility, cleanup, and SSR considerations

6. **Portals are powerful** but should only be used when necessary - don't over-engineer simple components

## 🎨 Example Gallery

Each example file includes:
- ✅ Extensive inline comments explaining every concept
- ✅ Visual demonstrations with working code
- ✅ Common patterns and anti-patterns
- ✅ Accessibility considerations
- ✅ Production-ready implementations

Start with `BasicPortalExample.jsx` and work your way through all four examples to become a React Portals expert!

---

**Happy coding!** 🚀 If you have questions or find issues, check the inline comments in each example file - they're designed to teach you step-by-step.
