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
import AIAnalysis from "../AIAnalysis/AIAnalysis";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const reactFlowWrapper = useRef(null);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [simulationResults, setSimulationResults] = useState(null);
  const [simulationTime, setSimulationTime] = useState(100);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  // --- Import/Export JSON ---
  const importInputRef = useRef(null);

  // Export current flow as JSON in { components: [...] } format
  const exportJson =async () => {
    // For each node, add outputs: array of target node ids for which this node is the source
    const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const components = nodes.map(node => {
      const component = {
        name: node.id,
        type: capitalizeFirst(node.type)
      };
      const params = {};
      const entityType = capitalizeFirst(node.type);
      const entity = entities[entityType];

      if (entity?.properties) {
        entity.properties.forEach(prop => {
          const value = node.data[prop.name];
          if (value !== undefined && value !== null & value !== '') {
            if (prop.type === 'number') {
              const numValue = parseFloat(value);
              if (!isNaN(numValue)) {
                params[prop.name] = numValue;
              }
            } else if (prop.type === 'checkbox') {
              params[prop.name] = Boolean(value);
            } else {
              params[prop.name] = value;
            }
          }
        });
      }
      
      if (Object.keys(params).length > 0) {
        component.params = params;
      }

      const outputs = edges
        .filter(edge => edge.source === node.id)
        .map(edge => edge.target);
      
      if (outputs.length === 1) {
        component.outputs = outputs[0];
      } else if (outputs.length > 1) {
        component.outputs = outputs;
      }

      return component;
    });
    const flow = { components };

    try {
      // Send the flow data to the FastAPI endpoint
      // string manipulation for passing query params :) im too tired for this
      const response = await fetch(`http://127.0.0.1:8000/run?until=${simulationTime}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flow),
        
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      else{
        console.log("SUCCESS")
      }
      const data = await response.json();
      console.log('Server response:', data);
      alert('Flow successfully sent to the server!');
      
      // Optional: Still log the flow to console for debugging
      console.log('Flow JSON:', JSON.stringify(flow, null, 2));
    } catch (error) {
      console.error('Error sending flow to server:', error);
      alert(`Failed to send flow to server: ${error.message}`);
    }
    console.log(JSON.stringify(flow, null, 2));
    alert("Flow JSON has been logged to the console.");
  };

  // Run simulation using the /run API endpoint
  const runSimulation = async () => {
    if (nodes.length === 0) {
      alert("Please add some components to the canvas first!");
      return;
    }

    const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const components = nodes.map(node => {
      const component = {
        name: node.id,
        type: capitalizeFirst(node.type)
      };

      const params = {};
      const entityType = capitalizeFirst(node.type);
      const entity = entities[entityType];

      if (entity?.properties) {
        entity.properties.forEach(prop => {
          const value = node.data[prop.name];
          if (value !== undefined && value !== null && value !== '') {
            if (prop.type === 'number') {
              const numValue = parseFloat(value);
              if (!isNaN(numValue)) {
                params[prop.name] = numValue;
              }
            } else if (prop.type === 'checkbox') {
              params[prop.name] = Boolean(value);
            } else {
              params[prop.name] = value;
            }
          }
        });
      }

      if (Object.keys(params).length > 0) {
        component.params = params;
      }

      const outputs = edges
        .filter(edge => edge.source === node.id)
        .map(edge => edge.target);

      component.outputs = outputs;
  
      return component;
    });

    const plantConfig = { components };
    console.log(plantConfig);
    try {
      setSimulationResults(null); // Clear previous results

      const response = await fetch(`http://127.0.0.1:8000/run?until=${simulationTime}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plantConfig),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const results = await response.json();
      setSimulationResults(results);
      if (typeof window !== "undefined") {
        localStorage.setItem("simulationResults", JSON.stringify(results));
      }
      router.push("/statistics");
      
    } catch (error) {
      console.error('Error running simulation:', error);
      alert(`Failed to run simulation: ${error.message}`);
    }
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
      {/* Control Panel (top-right) */}
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 20, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
        {/* Simulation Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "white", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}>
          <label htmlFor="simTime" style={{ fontSize: "12px", fontWeight: "bold" }}>Sim Time:</label>
          <input
            id="simTime"
            type="number"
            value={simulationTime}
            onChange={(e) => setSimulationTime(parseInt(e.target.value) || 100)}
            style={{ width: "60px", padding: "4px", border: "1px solid #ccc", borderRadius: "2px" }}
          />
          <button
            onClick={runSimulation}
            style={{
              padding: "6px 12px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "12px"
            }}
          >
            🚀 Run Simulation
          </button>
        </div>

        {/* Import/Export Buttons */}
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
            Import Layout
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
            Export Layout
          </button>
        </div>
      </div>

      {/* Simulation Results Panel */}
      {simulationResults && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            background: "white",
            padding: 16,
            border: "1px solid #ddd",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 100,
            maxWidth: 400,
            maxHeight: 300,
            overflow: "auto",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>Simulation Results</h3>
            <button
              onClick={() => setSimulationResults(null)}
              style={{
                background: "none",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
                color: "#666"
              }}
            >
              ×
            </button>
          </div>

          <div style={{ fontSize: "12px" }}>
            {Object.entries(simulationResults).map(([componentName, stats]) => (
              <div key={componentName} style={{ marginBottom: 12, padding: 8, backgroundColor: "#f8f9fa", borderRadius: 4 }}>
                <div style={{ fontWeight: "bold", marginBottom: 4 }}>{componentName}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: "11px" }}>
                  <div>Received: {stats.parts_received}</div>
                  <div>Sent: {stats.parts_sent}</div>
                  <div>Throughput: {stats.throughput.toFixed(3)}/time</div>
                  <div>Avg Latency: {stats.avg_latency.toFixed(2)}</div>
                  <div>Max Latency: {stats.max_latency.toFixed(2)}</div>
                  <div>Utilization: {stats.utilization_time.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Analysis Button */}
          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <button
              onClick={() => setShowAIAnalysis(true)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#8b5cf6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
                width: "100%",
              }}
            >
              🤖 AI Analysis
            </button>
          </div>
        </div>
      )}

      {/* AI Analysis Modal */}
      {showAIAnalysis && simulationResults && (
        <AIAnalysis
          plantConfig={{ components: nodes.map(node => {
            const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
            const component = {
              name: node.id,
              type: capitalizeFirst(node.type)
            };

            const params = {};
            const entityType = capitalizeFirst(node.type);
            const entity = entities[entityType];

            if (entity?.properties) {
              entity.properties.forEach(prop => {
                const value = node.data[prop.name];
                if (value !== undefined && value !== null && value !== '') {
                  if (prop.type === 'number') {
                    const numValue = parseFloat(value);
                    if (!isNaN(numValue)) {
                      params[prop.name] = numValue;
                    }
                  } else if (prop.type === 'checkbox') {
                    params[prop.name] = Boolean(value);
                  } else {
                    params[prop.name] = value;
                  }
                }
              });
            }

            if (Object.keys(params).length > 0) {
              component.params = params;
            }

            const outputs = edges
              .filter(edge => edge.source === node.id)
              .map(edge => edge.target);

            if (outputs.length === 1) {
              component.outputs = outputs[0];
            } else if (outputs.length > 1) {
              component.outputs = outputs;
            }

            return component;
          })}}
          simulationResults={simulationResults}
          onClose={() => setShowAIAnalysis(false)}
        />
      )}
      {/* <button onClick={logNodes}>Log Nodes</button> */}
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