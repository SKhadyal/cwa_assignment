"use client";
import { useState, useEffect } from "react";

export default function EscapeTimer({ onTimeout }: { onTimeout: () => void }) {
  const [timeLeft, setTimeLeft] = useState(120);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          alert("⏰ Time is over! Restarting...");
          onTimeout();
          return 120;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, onTimeout]);

  const resetTimer = () => {
    setTimeLeft(120);
    setRunning(true);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        backgroundColor: "rgba(0,0,0,0.6)",
        color: "white",
        padding: "10px 16px",
        borderRadius: "8px",
        fontFamily: "monospace",
        zIndex: 10,
      }}
    >
      <p style={{ margin: 0 }}>
        ⏱ Time Left:{" "}
        <strong>
          {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </strong>
      </p>
      <div style={{ marginTop: "6px" }}>
        <button
          onClick={() => setRunning(!running)}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "5px 10px",
            marginRight: "6px",
            borderRadius: "4px",
          }}
        >
          {running ? "Pause" : "Resume"}
        </button>
        <button
          onClick={resetTimer}
          style={{
            backgroundColor: "#ff4d4d",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "4px",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
