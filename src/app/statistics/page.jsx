"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AIAnalysis from "../components/AIAnalysis/AIAnalysis.js";

export default function StatisticsPage() {
  const [results, setResults] = useState(null);
  const [plantConfig, setPlantConfig] = useState(null);
  const [showLog, setShowLog] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedResults = localStorage.getItem("simulationResults");
        if (storedResults) setResults(JSON.parse(storedResults));
        const storedConfig = localStorage.getItem("plantConfig");
        if (storedConfig) setPlantConfig(JSON.parse(storedConfig));
      } catch {}
    }
  }, []);
  if (!results) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold mb-4">Simulation Statistics</h1>
        <div>No simulation results found.</div>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => router.push("/")}
        >
          Back to Canvas
        </button>
      </div>
    );
  }

  // Assume log is in results.log or results['log']
  const logContent = results.log || results['log'] || null;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Simulation Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(results)
          .filter(([key]) => key !== 'log')
          .map(([nodeId, stats]) => (
          <div key={nodeId} className="bg-white rounded-lg shadow p-6 border border-gray-200 flex flex-col">
            <div className="font-semibold text-lg mb-2 text-indigo-700">{nodeId}</div>
            <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="font-medium text-gray-500">Parts Received:</div>
              <div className="text-gray-900">{stats.parts_received}</div>
              <div className="font-medium text-gray-500">Parts Sent:</div>
              <div className="text-gray-900">{stats.parts_sent}</div>
              <div className="font-medium text-gray-500">Throughput:</div>
              <div className="text-gray-900">{stats.throughput}</div>
              <div className="font-medium text-gray-500">Avg Latency:</div>
              <div className="text-gray-900">{stats.avg_latency}</div>
              <div className="font-medium text-gray-500">Max Latency:</div>
              <div className="text-gray-900">{stats.max_latency}</div>
              <div className="font-medium text-gray-500">Utilization Time:</div>
              <div className="text-gray-900">{stats.utilization_time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Expandable Log Section */}
      {logContent && (
        <div className="mt-10">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800 font-semibold mb-2"
            onClick={() => setShowLog((prev) => !prev)}
          >
            {showLog ? "Hide Log File" : "Show Log File"}
          </button>
          {showLog && (
            <div className="bg-black text-green-200 p-4 rounded overflow-x-auto text-xs max-h-96 whitespace-pre-wrap mt-2 border border-gray-300">
              {typeof logContent === 'string' ? logContent : JSON.stringify(logContent, null, 2)}
            </div>
          )}
        </div>
      )}
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
      <div className="flex justify-center mt-10">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          onClick={() => router.push("/")}
        >
          Back to Canvas
        </button>
      </div>
      {showAIAnalysis && plantConfig && results && (
        <AIAnalysis
          plantConfig={plantConfig}
          simulationResults={results}
          onClose={() => setShowAIAnalysis(false)}
        />
      )}
    </div>
  );
}
