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
      { name: "processingTime", label: "Processing Time", type: "text" },
      { name: "capacity", label: "Capacity", type: "number" },
      {name:"interval", label:"Interval", type:"number"},
      {name:"startTime", label:"Start Time", type:"number"},
      {name:"endTime", label:"End Time", type:"number"},
      {name:"startimmediately", label:"Start Immediately", type:"checkbox"},
    ],
  },
  Station: {
    type: "station",
    label: "Station",
    color: "#219ebc",
    properties: [
      { name: "processingTime", label: "Processing Time", type: "text" },
      { name: "capacity", label: "Capacity", type: "number" },
      
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
      {name:"direction", label:"Direction", type:"text"},
      {name:"time", label:"Time", type:"number"},
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
};