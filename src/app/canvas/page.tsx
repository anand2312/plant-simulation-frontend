/*Entry point for the application, rendering the Navbar and Canvas.*/
"use client";
import React from "react";
import Navbar from "../components/Navbar/Navbar.js";
import Canvas from "../components/Canvas/Canvas.js";

export default function Home() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Navbar />
      <Canvas />
    </div>
  );
}