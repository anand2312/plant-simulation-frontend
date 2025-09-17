export const entities = {
/**
 * entities
 *
 * Defines the available plant simulation entities and their properties.
 * Each entity includes:
 * - type: Unique identifier for the entity type
 * - label: Display name for UI
 * - color: Node color for visualization
 * - properties: Array of property definitions (name, label, type)
 *
 * Entity Types:
 * - Source: Entry point for items, with timing and capacity controls
 * - Station: Processing unit with time and capacity
 * - Conveyor: Moves items, with speed, length, direction, etc.
 * - Drain: Exit point for items, with capacity and processing time
 */
  Source: {
    type: "source",
    label: "Source",
    color: "#8ecae6",
    properties: [
      
      { name: "limit", label: "Limit", type: "number" },
      {name:"interval", label:"Interval", type:"number"},
      {name:"startTime", label:"Start Time", type:"number"},
      {name:"endTime", label:"End Time", type:"number"},
      {name:"strategy", label:"Strategy", type:"string"},
    ],
  },
  Station: {
    type: "station",
    label: "Station",
    color: "#219ebc",
    properties: [
      { name: "processingTime", label: "Processing Time", type: "number" },
      { name: "capacity", label: "Capacity", type: "number" },
      {name:"strategy", label:"Strategy", type:"string"},
    ],
  },
  Conveyor: {
    type: "conveyor",
    label: "Conveyor",
    color: "#ffb703",
    
    properties: [
      { name: "speed", label: "Speed", type: "number" },
      { name: "length", label: "Length", type: "number" },
      { name: "capacity", label: "Capacity", type: "number" },
      {name:"strategy", label:"Strategy", type:"string"},
    ],
  },
  Drain: {
    type: "drain",
    label: "Drain",
    color: "#fb8500",
    properties: [{ name: "capacity", label: "Capacity", type: "number" },
      {name:"processingTime", label:"Processing Time", type:"number"}
    ],
  },
  Router: {
    type: "router",
    label: "Router",
    color: "#fb8500",
    properties: [
      { 
        name: "routingStrategy", 
        label: "Routing Strategy", 
        type: "dropdown",
        options: [
          { value: "round-robin", label: "Round Robin" },
          { value: "random", label: "Random" },
          { value: "fifo", label: "FIFO" },
          { value: "priority", label: "Priority Based" }
        ]
      }
    ],
  },
};