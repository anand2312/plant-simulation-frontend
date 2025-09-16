/**
   * Canvas.js
   *
   * This component provides a drag-and-drop canvas for simulating plant entities using React Flow.
   * Entities (Source, Station, Conveyor, Drain) are rendered as custom nodes.
   * Users can connect nodes, delete them, and interact with the simulation visually.
   *
   * Main Features:
   * - Custom node rendering with delete functionality
   * - Drag-and-drop node creation
   * - Edge connection between nodes
   * - MiniMap, Controls, and Background for enhanced UX
   *
   * Dependencies:
   * - @xyflow/react: React Flow library for interactive diagrams
   * - ../../entities: Entity definitions for simulation nodes
   */
"use client";

import React, { useCallback, useRef, useState,useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,

  Background,
  Handle,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { entities } from "../../entities";

function CustomNode({ data, selected, onClick }) {
  const style = {
    padding: 12,
    borderRadius: 8,
    background: data.color,
    border: selected ? "2px solid #333" : "1px solid #888",
    minWidth: 120,
    textAlign: "center",
    cursor: "pointer",
    position: "relative",
  };

  const deleteButtonStyle = {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 22,
    height: 22,
    fontWeight: "bold",
    color: "#333",
    cursor: "pointer",
    lineHeight: "18px",
    textAlign: "center",
    zIndex: 10,
  };

  return (
    <div style={style} onClick={onClick}>
      <Handle type="target" position="top" />
      <div>{data.label}</div>
      <button
        type="button"
        aria-label="Delete node"
        style={deleteButtonStyle}
        onClick={(e) => {
          e.stopPropagation();
          if (data.onDelete) data.onDelete();
        }}
        title="Delete node"
      >
        ×
      </button>
      <Handle type="source" position="bottom" />
    </div>
  );
}

const nodeTypes = {
  source: (props) => <CustomNode {...props} />,
  station: (props) => <CustomNode {...props} />,
  conveyor: (props) => <CustomNode {...props} />,
  drain: (props) => <CustomNode {...props} />,
  router: (props) => <CustomNode {...props} />,
};

/**
* Main Canvas component for the plant simulation frontend.
* Provides the React Flow canvas and manages node/edge state.
* @returns {JSX.Element}
*/
export default function Canvas() {
  const reactFlowWrapper = useRef(null);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [formValues, setFormValues] = useState({});
  // --- Import/Export JSON ---
  const importInputRef = useRef(null);

  // Export current flow as JSON in { components: [...] } format
  const exportJson = () => {
    // For each node, add outgoingNodes: array of target node ids for which this node is the source
    const components = [
      ...nodes.map(node => {
        const outgoing = edges
          .filter(edge => edge.source === node.id)
          .map(edge => edge.target);
        return {
          ...node,
          data: {
            ...node.data,
            outgoingNodes: outgoing,
          },
          type: node.type,
        };
      }),
      ...edges.map(edge => ({ type: 'edge', ...edge })),
    ];
    const flow = { components };
    console.log(JSON.stringify(flow, null, 2));
    alert("Flow JSON has been logged to the console.");
  };

  // Import flow from JSON file
  const importJson = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (json.nodes && json.edges) {
          setNodes(json.nodes);
          setEdges(json.edges);
        } else {
          alert("Invalid JSON: Must contain 'nodes' and 'edges'.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };
  const printValidEdges = () => {
    // Get all node IDs for quick lookup
    const nodeIds = nodes.map(node => node.id);
    
    // Filter edges where both source and target exist in nodes
    const validEdges = edges.filter(edge => 
      nodeIds.includes(edge.source) && nodeIds.includes(edge.target)
    );
    
    console.log("Valid Edges:", validEdges);
  };
  const logEdges = () => {
    console.log("Current Edges:", edges);
  };
  
  // Example usage: You can call this function from a button or any other event
  useEffect(() => {
    // Example: Log edges whenever they change
    console.log("Edges updated:", edges);
  }, [edges]);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );
  const logNodes = () => {
    console.log("Current Nodes:", nodes);
  };
  
  // Example usage: You can call this function from a button or any other event
  useEffect(() => {
    // Example: Log nodes whenever they change
    console.log("Nodes updated:", nodes);
  }, [nodes]);
  
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodeDragStop = useCallback(
    (event, node) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id ? { ...n, position: node.position } : n
        )
      );
    },
    []
  );

  const onNodeClick = useCallback(
      (event, node) => {
        event.stopPropagation();
        setSelectedNode(node);
        if (!node.type) {
          alert("Node type is missing. Please check your imported JSON.");
          setFormValues({});
          return;
        }
        const entityKey = node.type.charAt(0).toUpperCase() + node.type.slice(1);
        const propsDef = entities[entityKey]?.properties || [];

        // Use the node's current data for form values, so edits persist
        const initValues = {};
        propsDef.forEach(({ name }) => {
          initValues[name] = node.data[name] !== undefined ? node.data[name] : "";
        });

        setFormValues(initValues);
      },
      []
    );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type || !entities[type]) return;
      if (type === "router") {
        newNode.data.routingStrategy = "round-robin"; // Default value
      }
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const id = `${type}_${+new Date()}`;
      const baseEntity = entities[type];

      const newNode = {
        id,
        type: baseEntity.type,
        position,
        data: {
          label: baseEntity.label,
          color: baseEntity.color,
          // Initialize all properties to empty
          ...baseEntity.properties.reduce(
            (acc, prop) => ({ ...acc, [prop.name]: "" }),
            {}
          ),
          onDelete: () =>
            setNodes((nds) => nds.filter((node) => node.id !== id)),
            
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? {
              ...node,
              data: {
                ...node.data,
                ...formValues,
              },
            }
          : node
      )
    );
    setSelectedNode(null);
  };

  const handleClose = () => {
    setSelectedNode(null);
  };

  // Get current entity properties for selected node type
  const entityKey =
    selectedNode && selectedNode.type
      ? selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)
      : null;
  const entityProps = entityKey && entities[entityKey]?.properties
    ? entities[entityKey].properties
    : [];

  return (
    <div
      style={{ height: "100vh", width: "100%" }}
      ref={reactFlowWrapper}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {/* Check Valid Edges and Import/Export Buttons (aligned top-right) */}
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 20, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
        <button 
          onClick={printValidEdges}
          style={{
            padding: "8px 16px",
            backgroundColor: "#219ebc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            marginBottom: 4
          }}
        >
          Check Valid Edges
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="file"
            accept="application/json"
            ref={importInputRef}
            onChange={importJson}
            style={{ display: "none" }}
          />
          <button
            onClick={() => importInputRef.current && importInputRef.current.click()}
            style={{
              padding: "8px 16px",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Import JSON
          </button>
          <button
            onClick={exportJson}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Export JSON
          </button>
        </div>
      </div>
      <button onClick={logNodes}>Log Nodes</button>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onNodeDragStop={onNodeDragStop}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>

        {selectedNode && (
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 20,
              background: "white",
              padding: 20,
              border: "1px solid #ddd",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              zIndex: 100,
              width: 320,
            }}
          >
            <h3>Edit Properties for {selectedNode.data.label}</h3>
            {entityProps.map(({ name, label, type }) => (
              <div key={name} style={{ marginBottom: 10 }}>
                <label htmlFor={name}>{label}:</label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={formValues[name] || ""}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
            ))}

            <button onClick={handleSave} style={{ marginRight: 8 }}>
              Save
            </button>
            <button onClick={handleClose}>Cancel</button>
          </div>
        )}
      </ReactFlowProvider>
    </div>
  );
}