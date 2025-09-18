"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-50 to-white px-6">
      {/* Hero Section */}
      <motion.div
        className="text-center max-w-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-6xl font-extrabold text-red-800 leading-tight mb-6">
          Welcome to <span className="text-red-600">Plant Simulation</span>
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Design your plant layout with an intuitive{" "}
          <span className="font-semibold">drag-and-drop interface</span>.
        </p>
        <p className="text-xl text-gray-600 mb-8">
          Run simulations, analyze results, and get{" "}
          <span className="font-semibold">AI-powered insights</span> to optimize
          efficiency.
        </p>

        <Button
          size="lg"
          className="rounded-2xl shadow-lg bg-red-600 hover:bg-red-700 transition-all flex items-center gap-2 mx-auto text-xl"
          onClick={() => router.push("/canvas")}
        >
          Go to Canvas <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Features Preview */}
      <motion.div
        className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        {[
          {
            title: "Drag & Drop Layout",
            desc: "Easily design your plant using an intuitive drag-and-drop builder.",
            icon: "🛠️",
          },
          {
            title: "Real-Time Simulation",
            desc: "Run powerful simulations and visualize plant performance instantly.",
            icon: "⚡",
          },
          {
            title: "AI Insights",
            desc: "Leverage AI-driven analytics to optimize workflows and efficiency.",
            icon: "🤖",
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl shadow-md border bg-white hover:shadow-xl transition cursor-pointer"
          >
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-red-700">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
