/**
 * AIAnalysis.js
 *
 * Self-contained component for AI-powered plant optimization analysis.
 * Calls secure Next.js API route for AI analysis.
 */
"use client";

import React, { useState } from "react";

const AIAnalysis = ({ plantConfig, simulationResults, onClose }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeWithAI = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plantConfig,
          simulationResults
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setAnalysis(data.analysis);

    } catch (err) {
      console.error('AI Analysis error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatAnalysisText = (text) => {
    // Simple markdown-like formatting for better readability
    return text
      .replace(/### (.*?)$/gm, '<h3 style="color: #2563eb; margin: 16px 0 8px 0; font-size: 14px; font-weight: bold;">$1</h3>')
      .replace(/## (.*?)$/gm, '<h2 style="color: #1e40af; margin: 20px 0 12px 0; font-size: 16px; font-weight: bold;">$1</h2>')
      .replace(/# (.*?)$/gm, '<h1 style="color: #1e3a8a; margin: 24px 0 16px 0; font-size: 18px; font-weight: bold;">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold; color: #374151;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>')
      .replace(/- (.*?)$/gm, '<div style="margin: 4px 0; padding-left: 16px;">• $1</div>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          width: "90vw",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f8fafc",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>
              🤖 AI Plant Optimization Analysis
            </h2>
            <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#6b7280" }}>
              AI-powered bottleneck analysis and optimization recommendations
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#6b7280",
              padding: "4px",
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
          {!analysis && !loading && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
              <h3 style={{ margin: "0 0 12px 0", color: "#374151" }}>
                Ready to analyze your plant configuration
              </h3>
              <p style={{ margin: "0 0 24px 0", color: "#6b7280", maxWidth: "500px" }}>
                Our AI will analyze your plant structure and simulation results to identify
                bottlenecks and provide optimization recommendations.
              </p>
              <button
                onClick={analyzeWithAI}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                🚀 Start AI Analysis
              </button>
            </div>
          )}

          {loading && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "4px solid #e5e7eb",
                  borderTop: "4px solid #3b82f6",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginBottom: "16px",
                }}
              />
              <h3 style={{ margin: 0, color: "#374151" }}>Analyzing your plant...</h3>
              <p style={{ margin: "8px 0 0 0", color: "#6b7280" }}>
                AI is examining bottlenecks and optimization opportunities
              </p>
            </div>
          )}

          {error && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>❌</div>
              <h3 style={{ margin: "0 0 12px 0", color: "#dc2626" }}>Analysis Failed</h3>
              <p style={{ margin: "0 0 24px 0", color: "#6b7280", maxWidth: "500px" }}>
                {error}
              </p>
              <button
                onClick={analyzeWithAI}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                🔄 Retry Analysis
              </button>
            </div>
          )}

          {analysis && (
            <div
              style={{
                flex: 1,
                overflow: "auto",
                backgroundColor: "#fafafa",
                padding: "0",
              }}
            >
              <div
                style={{
                  padding: "24px",
                  margin: "0",
                }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "24px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    lineHeight: "1.6",
                    fontSize: "14px",
                    color: "#374151",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: formatAnalysisText(analysis)
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AIAnalysis;