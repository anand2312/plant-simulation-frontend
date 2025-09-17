/**
 * Next.js API Route for AI Plant Analysis
 * Securely handles Gemini API calls server-side
 */

import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function POST(request) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured on server" },
        { status: 500 }
      );
    }

    const { plantConfig, simulationResults } = await request.json();

    if (!plantConfig || !simulationResults) {
      return NextResponse.json(
        { error: "Missing plantConfig or simulationResults" },
        { status: 400 }
      );
    }

    const prompt = createAnalysisPrompt(plantConfig, simulationResults);

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!analysisText) {
      throw new Error("No analysis text received from Gemini API");
    }

    return NextResponse.json({ analysis: analysisText });

  } catch (error) {
    console.error('AI Analysis error:', error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze plant" },
      { status: 500 }
    );
  }
}

function createAnalysisPrompt(plantConfig, results) {
  return `
# Plant Simulation Analysis Request

You are an expert manufacturing and warehouse optimization consultant. Analyze the following plant simulation data and provide detailed recommendations for improvement.

## Plant Configuration:
${JSON.stringify(plantConfig, null, 2)}

## Simulation Results:
${JSON.stringify(results, null, 2)}

## Analysis Requirements:

Please provide a comprehensive analysis covering:

### 1. **Bottleneck Identification**
- Ignore the source having a throughput of 0
- Identify components with highest utilization or longest queues
- A common indicator of a node being a bottleneck is if it has received a large number of parts, but only sent a few.
- Analyze part flow patterns and accumulation points

### 2. **Performance Metrics Analysis**
- Compare throughput across all components
- Identify latency hotspots and their root causes
- Evaluate utilization efficiency for each component

### 3. **Optimization Recommendations**
Provide specific, actionable recommendations for:
- **Capacity Adjustments**: Which components need more/less capacity
- **Timing Optimization**: Processing times, intervals, travel times that should be adjusted

For all your analysis, ignore the statistics of routers - they only exist to route parts to multiple nodes at once.

## Output Format:
Please structure your response with clear headings, bullet points, and specific numeric recommendations where possible. Focus on actionable insights that can be directly implemented in the plant configuration.

## Component Types Reference:
- **Source**: Generates parts (params: interval, limit, start_immediately)
- **Station**: Processes parts (params: processing_time, capacity)
- **Conveyor**: Transports parts (params: travel_time, capacity)
- **Router**: Routes parts to multiple outputs (params: routing_logic)
- **Drain**: Consumes parts (no params)

Provide your analysis:
`;
}