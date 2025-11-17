import { useState } from 'react';

/**
 * WITHOUT PORTAL EXAMPLE
 *
 * This example demonstrates the PROBLEMS you encounter when you DON'T use portals.
 * You'll see three common issues:
 * 1. Parent overflow:hidden clipping the modal
 * 2. Parent z-index stacking context issues
 * 3. Parent transform breaking fixed positioning
 *
 * These are all solved by using createPortal!
 */

// ============================================
// MODAL WITHOUT PORTAL (Problematic)
// ============================================

/**
 * Modal Component WITHOUT using createPortal
 *
 * This modal has the SAME styling as the portal version,
 * but it's rendered as a normal child in the component tree.
 * This causes several issues demonstrated below.
 */
function BrokenModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    // This gets rendered as a child of wherever the component is used
    // NOT at the document root like a portal would
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',  // Fixed positioning... but parent transform breaks this!
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000  // High z-index... but parent stacking context limits this!
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
          {children}
        </div>
      </div>
    </>
  );
}

// ============================================
// PROBLEM DEMONSTRATIONS
// ============================================

/**
 * Problem 1: Overflow Hidden
 *
 * When a parent has overflow:hidden, it clips any child content that
 * extends beyond its boundaries - even with position:fixed!
 */
function OverflowProblem() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{
      backgroundColor: '#ffebee',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '2px solid #f44336'
    }}>
      <h3>❌ Problem 1: Overflow Hidden</h3>
      <p>
        This container has <code>overflow: hidden</code>. The modal below
        is clipped because it's rendered as a child of this container.
      </p>

      {/* This container has overflow:hidden which clips the modal */}
      <div
        style={{
          overflow: 'hidden',      // ← This is the problem!
          height: '200px',
          backgroundColor: '#fff',
          border: '2px dashed #f44336',
          padding: '20px',
          position: 'relative'
        }}
      >
        <p style={{ margin: '0 0 10px 0', color: '#d32f2f', fontWeight: 'bold' }}>
          Container with overflow: hidden
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Open Broken Modal
        </button>

        {/* Modal rendered here gets clipped by parent's overflow:hidden */}
        <BrokenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h3 style={{ color: '#f44336' }}>Clipped Modal!</h3>
          <p>
            Notice how this modal is clipped by the parent container's{' '}
            <code>overflow: hidden</code>. With a portal, this wouldn't happen!
          </p>
        </BrokenModal>
      </div>

      <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        <strong>With a portal:</strong> The modal would render at the document root,
        completely ignoring the parent's overflow property.
      </p>
    </div>
  );
}

/**
 * Problem 2: Z-Index Stacking Context
 *
 * When a parent creates a new stacking context (z-index + position),
 * children can't escape that context no matter how high their z-index is.
 */
function ZIndexProblem() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{
      backgroundColor: '#fff3e0',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '2px solid #ff9800'
    }}>
      <h3>❌ Problem 2: Z-Index Stacking Context</h3>
      <p>
        The modal has <code>z-index: 1000</code>, but it still appears
        behind the orange box because the parent creates a stacking context.
      </p>

      <div style={{ position: 'relative' }}>
        {/* Parent creates a stacking context */}
        <div
          style={{
            position: 'relative',  // ← Creates stacking context
            zIndex: 1,             // ← Low z-index
            backgroundColor: '#fff',
            padding: '20px',
            border: '2px dashed #ff9800'
          }}
        >
          <p style={{ margin: '0 0 10px 0', color: '#e65100', fontWeight: 'bold' }}>
            Container with position: relative and z-index: 1
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Open Modal
          </button>

          <BrokenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <h3 style={{ color: '#ff9800' }}>Stacking Context Issue!</h3>
            <p>
              This modal has z-index: 1000, but it still appears behind
              the orange box below because it's trapped in the parent's
              stacking context.
            </p>
          </BrokenModal>
        </div>

        {/* This box appears ABOVE the modal even though modal has higher z-index */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,              // ← Higher than parent, so it wins
            backgroundColor: '#ff9800',
            color: 'white',
            padding: '20px',
            marginTop: '20px',
            borderRadius: '8px'
          }}
        >
          <strong>I'm above the modal!</strong> My z-index is only 2,
          but I'm in a different stacking context than the modal.
        </div>
      </div>

      <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        <strong>With a portal:</strong> The modal would be at the root level,
        in its own stacking context, and z-index would work as expected.
      </p>
    </div>
  );
}

/**
 * Problem 3: Transform Breaking Fixed Positioning
 *
 * When a parent has a transform property, it breaks position:fixed
 * on children, making them behave like position:absolute instead!
 */
function TransformProblem() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{
      backgroundColor: '#e8f5e9',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '2px solid #4caf50'
    }}>
      <h3>❌ Problem 3: Transform Breaks Fixed Positioning</h3>
      <p>
        The modal uses <code>position: fixed</code>, but the parent has{' '}
        <code>transform</code>, which breaks fixed positioning!
      </p>

      {/* Parent with transform breaks position:fixed on children */}
      <div
        style={{
          transform: 'scale(1)',  // ← Any transform breaks position:fixed!
          backgroundColor: '#fff',
          padding: '20px',
          border: '2px dashed #4caf50',
          margin: '0 auto',
          maxWidth: '400px'
        }}
      >
        <p style={{ margin: '0 0 10px 0', color: '#2e7d32', fontWeight: 'bold' }}>
          Container with transform: scale(1)
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Open Modal
        </button>

        <BrokenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h3 style={{ color: '#4caf50' }}>Position Fixed Broken!</h3>
          <p>
            This modal uses <code>position: fixed</code> and should cover
            the entire viewport, but because its parent has a{' '}
            <code>transform</code> property, it behaves like{' '}
            <code>position: absolute</code> instead!
          </p>
          <p>
            Notice how the modal is positioned relative to its parent
            container, not the viewport.
          </p>
        </BrokenModal>
      </div>

      <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        <strong>With a portal:</strong> The modal would not be affected by
        the parent's transform property at all.
      </p>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function WithoutPortal() {
  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Without Portal: Common Problems</h2>

      <div style={{
        backgroundColor: '#f44336',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginTop: 0 }}>⚠️ Why We Need Portals</h3>
        <p>
          When you render modals, tooltips, or overlays as normal children
          in the React tree, they inherit CSS properties from their parents
          that can cause unexpected issues:
        </p>
        <ul style={{ marginBottom: 0 }}>
          <li><strong>overflow: hidden</strong> clips the content</li>
          <li><strong>z-index</strong> stacking contexts limit layering</li>
          <li><strong>transform</strong> breaks position: fixed</li>
          <li><strong>opacity</strong> affects descendants</li>
          <li><strong>filter</strong> creates stacking contexts</li>
        </ul>
      </div>

      {/* Demonstrate each problem */}
      <OverflowProblem />
      <ZIndexProblem />
      <TransformProblem />

      {/* Solution callout */}
      <div style={{
        backgroundColor: '#4caf50',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '30px'
      }}>
        <h3 style={{ marginTop: 0 }}>✅ The Solution: createPortal</h3>
        <p>
          By using <code>createPortal</code>, you can render content to a
          different part of the DOM tree (usually at the root level), which:
        </p>
        <ul style={{ marginBottom: 0 }}>
          <li>Escapes parent CSS constraints (overflow, transform, etc.)</li>
          <li>Creates its own stacking context at the root level</li>
          <li>Allows position: fixed to work correctly</li>
          <li>Still maintains the React component tree relationship</li>
          <li>Preserves event bubbling through the React tree</li>
        </ul>
        <p style={{ marginBottom: 0, marginTop: '15px' }}>
          <strong>Check out the "Basic Portal" example to see the solution in action!</strong>
        </p>
      </div>
    </div>
  );
}
