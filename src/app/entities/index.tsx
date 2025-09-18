/**
 * Plant simulation entities matching PLANT_CONFIG_SPEC.md exactly
 */
export const entities = {
  Source: {
    type: "source",
    label: "Source",
    color: "#4CAF50",
    properties: [
      { name: "interval", label: "Interval", type: "number" },
      { name: "limit", label: "Limit", type: "number" },
      { name: "start_immediately", label: "Start Immediately", type: "checkbox" },
      {
        name: "routing_strategy",
        label: "Routing Strategy",
        type: "dropdown",
        options: [
          { value: "round_robin", label: "Round Robin" },
          { value: "random", label: "Random" }
        ]
      },
    ],
  },
  Station: {
    type: "station",
    label: "Station",
    color: "#FF9800",
    properties: [
      { name: "processing_time", label: "Processing Time", type: "number" },
      { name: "capacity", label: "Capacity", type: "number" },
      {
        name: "routing_strategy",
        label: "Routing Strategy",
        type: "dropdown",
        options: [
          { value: "round_robin", label: "Round Robin" },
          { value: "random", label: "Random" }
        ]
      },
    ],
  },
  Conveyor: {
    type: "conveyor",
    label: "Conveyor",
    color: "#2196F3",
    properties: [
      { name: "travel_time", label: "Travel Time", type: "number" },
      { name: "capacity", label: "Capacity", type: "number" },
      {
        name: "routing_strategy",
        label: "Routing Strategy",
        type: "dropdown",
        options: [
          { value: "round_robin", label: "Round Robin" },
          { value: "random", label: "Random" }
        ]
      },
    ],
  },
  Drain: {
    type: "drain",
    label: "Drain",
    color: "#F44336",
    properties: [
      { name: "capacity", label: "Capacity", type: "number" },
      { name: "drain_time", label: "Drain Time", type: "number" },
    ],
  },
};