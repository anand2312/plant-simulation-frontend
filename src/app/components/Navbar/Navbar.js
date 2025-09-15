
/**
 * Navbar.js
 *
 * Sidebar component for displaying draggable plant entities.
 * Allows users to drag entity types onto the canvas for simulation.
 *
 * Main Features:
 * - Lists all available entities from ../../entities
 * - Enables drag-and-drop for entity creation in Canvas
 *
 * Dependencies:
 * - ../../entities: Entity definitions for simulation nodes
 */
"use client";
import React from "react";
import { entities } from "../../entities";

const sidebarStyle = {
  width: 160,
  padding: 12,
  borderRight: "1px solid #ddd",
  backgroundColor: "#f9f9f9",
};

const draggableStyle = {
  padding: 10,
  marginBottom: 8,
  backgroundColor: "#ececec",
  borderRadius: 4,
  cursor: "grab",
  userSelect: "none",
};

export default function Navbar() {
  /**
   * Renders the sidebar with draggable entity types.
   * @returns {JSX.Element}
   */
  const onDragStart = (event, type) => {
    /**
     * Handles drag start for entity type.
     * Sets the drag data for React Flow canvas drop.
     * @param {DragEvent} event - Drag event
     * @param {string} type - Entity type key
     */
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside style={sidebarStyle}>
      <h3>Entities</h3>
      {Object.keys(entities).map((key) => (
        <div
          key={key}
          style={draggableStyle}
          draggable
          onDragStart={(event) => onDragStart(event, key)}
        >
          {entities[key].label}
        </div>
      ))}
    </aside>
  );
}