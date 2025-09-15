"use client";
/**
 * CustomNode.js
 *
 * Renders a custom node for React Flow diagrams in the plant simulation frontend.
 * Displays entity label and a delete button for node removal.
 *
 * Main Features:
 * - Customizable color and size
 * - Delete button for node removal
 * - Styled container for visual consistency
 *
 * Props:
 * - id: Node ID
 * - data: { label, color, size, onDelete }
 */
import React from 'react';

const nodeContainer = (color, size) => ({
  /**
   * Returns style object for node container.
   * @param {string} color - Background color
   * @param {number|string} size - Node size (width/height)
   * @returns {object} Style object
   */
  backgroundColor: color,
  width: size,
  height: size,
  borderRadius: 6,
  border: '1px solid #222',
  boxShadow: '2px 2px 6px rgba(0,0,0,.15)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  userSelect: 'none',
});

const deleteButtonStyle = {
  // Style for the delete button in the node
  position: 'absolute',
  top: 4,
  right: 4,
  backgroundColor: 'white',
  border: 'none',
  borderRadius: '30%',
  width: 22,
  height: 22,
  fontWeight: 'bold',
  color: 'white',
  cursor: 'pointer',
  lineHeight: '18px',
  textAlign: 'center',
};

export default function CustomNode({ id, data }) {
  /**
   * Renders a custom node with label and delete button.
   * @param {string} id - Node ID
   * @param {object} data - Node data (label, color, size, onDelete)
   * @returns {JSX.Element}
   */
  return (
    <div style={nodeContainer(data.color, data.size)}>
      <div>{data.label}</div>
      <button
        type="button"
        aria-label="Delete node"
        style={deleteButtonStyle}
        onClick={() => data.onDelete(id)}
        title="Delete node"
      >
        ×
      </button>
    </div>
  );
}