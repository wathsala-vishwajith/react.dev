import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * ADVANCED PORTAL EXAMPLES
 *
 * This file demonstrates more sophisticated use cases for portals:
 * 1. Tooltips - Positioned relative to trigger element
 * 2. Toast Notifications - Multiple portals stacked
 * 3. Dropdown Menus - Portal with dynamic positioning
 *
 * These examples show real-world patterns you'll encounter in production apps.
 */

// ============================================
// 1. TOOLTIP COMPONENT
// ============================================

/**
 * Tooltip Component
 *
 * Tooltips are tricky because they need to:
 * - Appear near the element that triggered them
 * - Escape parent overflow/z-index constraints
 * - Position themselves intelligently
 *
 * Portals solve the overflow/z-index issues!
 *
 * @param {Object} props
 * @param {boolean} props.show - Whether tooltip is visible
 * @param {string} props.text - Tooltip text content
 * @param {React.RefObject} props.targetRef - Reference to element tooltip points to
 * @param {string} props.position - Position relative to target (top, bottom, left, right)
 */
function Tooltip({ show, text, targetRef, position = 'top' }) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!show || !targetRef.current) return;

    /**
     * Calculate tooltip position based on target element
     * This runs every time the tooltip is shown
     */
    const updatePosition = () => {
      const rect = targetRef.current.getBoundingClientRect();
      const tooltipWidth = 200; // Approximate width
      const tooltipHeight = 40; // Approximate height
      const gap = 10; // Gap between tooltip and target

      let top, left;

      switch (position) {
        case 'top':
          top = rect.top - tooltipHeight - gap;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          break;
        case 'bottom':
          top = rect.bottom + gap;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          break;
        case 'left':
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.left - tooltipWidth - gap;
          break;
        case 'right':
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.right + gap;
          break;
        default:
          top = rect.top - tooltipHeight - gap;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
      }

      setCoords({ top, left });
    };

    updatePosition();

    // Update position on scroll or resize
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [show, targetRef, position]);

  if (!show) return null;

  /**
   * Render tooltip to #tooltip-root
   * This ensures it's not clipped by parent overflow
   */
  return createPortal(
    <div
      style={{
        position: 'absolute',
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        backgroundColor: '#333',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '14px',
        zIndex: 10000,
        pointerEvents: 'none', // Tooltip doesn't intercept mouse events
        maxWidth: '200px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}
    >
      {text}
    </div>,
    document.getElementById('tooltip-root')
  );
}

// ============================================
// 2. TOAST NOTIFICATION COMPONENT
// ============================================

/**
 * Single Toast Notification
 *
 * @param {Object} props
 * @param {string} props.id - Unique identifier
 * @param {string} props.message - Notification message
 * @param {string} props.type - Type of notification (success, error, info)
 * @param {Function} props.onClose - Callback when toast is dismissed
 */
function Toast({ id, message, type, onClose }) {
  /**
   * Auto-dismiss after 3 seconds
   * In a real app, this might be configurable
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  // Different colors for different types
  const colors = {
    success: { bg: '#4caf50', border: '#388e3c' },
    error: { bg: '#f44336', border: '#d32f2f' },
    info: { bg: '#2196f3', border: '#1976d2' }
  };

  const color = colors[type] || colors.info;

  return (
    <div
      style={{
        backgroundColor: color.bg,
        color: 'white',
        padding: '15px 20px',
        borderRadius: '4px',
        marginBottom: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minWidth: '300px',
        maxWidth: '500px',
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <span>{message}</span>
      <button
        onClick={() => onClose(id)}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          marginLeft: '15px',
          padding: '0 5px'
        }}
      >
        ×
      </button>
    </div>
  );
}

/**
 * Toast Container
 * Manages multiple toast notifications
 *
 * This component demonstrates:
 * - Multiple portals (one for each toast)
 * - Portal with absolute positioning at viewport level
 * - State management for dynamic portal creation/removal
 */
function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  /**
   * Render all toasts to #notification-root
   * They stack vertically in the top-right corner
   */
  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10000
      }}
    >
      {/* Inline keyframe animation for slide-in effect */}
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onRemove}
        />
      ))}
    </div>,
    document.getElementById('notification-root')
  );
}

// ============================================
// 3. DROPDOWN MENU COMPONENT
// ============================================

/**
 * Dropdown Menu Component
 *
 * Dropdowns need to:
 * - Appear near their trigger button
 * - Escape parent overflow constraints
 * - Close when clicking outside
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether dropdown is open
 * @param {Function} props.onClose - Callback to close dropdown
 * @param {React.RefObject} props.triggerRef - Reference to trigger button
 * @param {Array} props.items - Menu items to display
 */
function Dropdown({ isOpen, onClose, triggerRef, items }) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);

  // Calculate dropdown position
  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 5,
      left: rect.left
    });
  }, [isOpen, triggerRef]);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !triggerRef.current.contains(e.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        minWidth: '200px',
        zIndex: 10000,
        overflow: 'hidden'
      }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => {
            item.onClick();
            onClose();
          }}
          style={{
            padding: '10px 15px',
            cursor: 'pointer',
            borderBottom: index < items.length - 1 ? '1px solid #eee' : 'none',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
        >
          {item.label}
        </div>
      ))}
    </div>,
    document.getElementById('modal-root') // Reusing modal-root for dropdowns
  );
}

// ============================================
// MAIN DEMO COMPONENT
// ============================================

export default function AdvancedPortalExample() {
  // Tooltip state
  const [showTooltip, setShowTooltip] = useState(null);
  const tooltipRefs = {
    top: useRef(null),
    bottom: useRef(null),
    left: useRef(null),
    right: useRef(null)
  };

  // Toast state
  const [toasts, setToasts] = useState([]);

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  /**
   * Add a new toast notification
   * Each toast gets a unique ID based on timestamp
   */
  const addToast = (message, type) => {
    const newToast = {
      id: Date.now(),
      message,
      type
    };
    setToasts(prev => [...prev, newToast]);
  };

  /**
   * Remove a toast by ID
   */
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Dropdown menu items
  const dropdownItems = [
    { label: '📄 New Document', onClick: () => addToast('Creating new document...', 'info') },
    { label: '📁 Open File', onClick: () => addToast('Opening file...', 'info') },
    { label: '💾 Save', onClick: () => addToast('File saved!', 'success') },
    { label: '🗑️ Delete', onClick: () => addToast('Item deleted', 'error') }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Advanced Portal Examples</h2>

      <div style={{
        backgroundColor: '#e3f2fd',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        borderLeft: '4px solid #2196f3'
      }}>
        <h3>Real-World Portal Patterns</h3>
        <p>
          These examples demonstrate common UI patterns that benefit from portals:
          tooltips, notifications, and dropdowns. Each escapes parent constraints
          while maintaining React's component structure.
        </p>
      </div>

      {/* TOOLTIP DEMO */}
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h3>1. Tooltips with Portals</h3>
        <p>Hover over the buttons to see tooltips positioned around them:</p>

        <div style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          marginTop: '20px',
          justifyContent: 'center',
          padding: '40px'
        }}>
          {Object.entries(tooltipRefs).map(([position, ref]) => (
            <button
              key={position}
              ref={ref}
              onMouseEnter={() => setShowTooltip(position)}
              onMouseLeave={() => setShowTooltip(null)}
              style={{
                padding: '12px 24px',
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {position.charAt(0).toUpperCase() + position.slice(1)}
            </button>
          ))}
        </div>

        {/* Render tooltips */}
        {Object.entries(tooltipRefs).map(([position, ref]) => (
          <Tooltip
            key={position}
            show={showTooltip === position}
            text={`This tooltip appears on the ${position}!`}
            targetRef={ref}
            position={position}
          />
        ))}

        <div style={{
          backgroundColor: '#fff',
          padding: '15px',
          borderRadius: '4px',
          marginTop: '20px'
        }}>
          <strong>💡 How it works:</strong> Each tooltip is rendered to{' '}
          <code>#tooltip-root</code> using a portal, but positioned relative
          to its trigger button using <code>getBoundingClientRect()</code>.
        </div>
      </div>

      {/* TOAST NOTIFICATIONS DEMO */}
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h3>2. Toast Notifications</h3>
        <p>Click buttons to see stacked notifications in the top-right corner:</p>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={() => addToast('Operation successful!', 'success')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Success Toast
          </button>
          <button
            onClick={() => addToast('An error occurred!', 'error')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Error Toast
          </button>
          <button
            onClick={() => addToast('Here is some information', 'info')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Info Toast
          </button>
        </div>

        <div style={{
          backgroundColor: '#fff',
          padding: '15px',
          borderRadius: '4px',
          marginTop: '20px'
        }}>
          <strong>💡 How it works:</strong> All toasts are rendered to{' '}
          <code>#notification-root</code> in a fixed position container.
          They auto-dismiss after 3 seconds and can be manually closed.
        </div>
      </div>

      {/* DROPDOWN DEMO */}
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h3>3. Dropdown Menu</h3>
        <p>Click the button to open a dropdown menu:</p>

        <button
          ref={dropdownRef}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#673ab7',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          File Menu ▼
        </button>

        <Dropdown
          isOpen={isDropdownOpen}
          onClose={() => setIsDropdownOpen(false)}
          triggerRef={dropdownRef}
          items={dropdownItems}
        />

        <div style={{
          backgroundColor: '#fff',
          padding: '15px',
          borderRadius: '4px',
          marginTop: '20px'
        }}>
          <strong>💡 How it works:</strong> The dropdown is rendered via portal
          and positioned near its trigger button. It closes when clicking outside
          (using event listeners) or when selecting an item.
        </div>
      </div>

      {/* Render toast container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Key Takeaways */}
      <div style={{
        backgroundColor: '#4caf50',
        color: 'white',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h3 style={{ marginTop: 0 }}>✨ Key Takeaways</h3>
        <ul style={{ marginBottom: 0 }}>
          <li>
            <strong>Tooltips:</strong> Use portals + position calculation for
            tooltips that escape parent overflow
          </li>
          <li>
            <strong>Notifications:</strong> Portal to a fixed position container
            for global notifications
          </li>
          <li>
            <strong>Dropdowns:</strong> Combine portals with click-outside detection
            for menus that aren't clipped
          </li>
          <li>
            <strong>All patterns:</strong> Render to a dedicated DOM node outside
            the main app tree using <code>createPortal</code>
          </li>
        </ul>
      </div>
    </div>
  );
}
