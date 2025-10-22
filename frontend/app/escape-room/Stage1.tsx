"use client";
import { useState } from "react";

type Stage1Props = {
  onNext: () => void;
  onComplete?: (result: { rawInput: string; normalizedAnswer: string }) => void;
};

export default function Stage1({ onNext, onComplete }: Stage1Props) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const checkCode = () => {
    // normalize user input for flexible matching
    const cleaned = input
      .replace(/\s+/g, "") // remove all spaces
      .replace(/['"]/g, "'") // normalize quotes
      .trim()
      .toLowerCase();

    if (
      cleaned === "console.log('helloworld');" ||
      cleaned === "console.log('helloworld')" ||
      cleaned === "console.log('hello world')" ||
      cleaned === "console.log('hello world');"
    ) {
      setResult("✅ Correct! Moving to next stage...");
      onComplete?.({ rawInput: input, normalizedAnswer: cleaned });
      setTimeout(onNext, 1000);
    } else {
      setResult("❌ Try again!");
    }
  };

  return (
    <div className="stage">
      <h2>Stage 1 – Format Code Correctly</h2>
      <p>Fix the code so it prints “Hello World”.</p>

      {/* Hint above box */}
      <p style={{ color: "#ffecb3", fontStyle: "italic", marginBottom: "6px" }}>
        💡 Hint: Use <code>console.log()</code> correctly and remember spacing!
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={5}
        cols={50}
        style={{
          width: "90%",
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontFamily: "monospace",
          fontSize: "14px",
        }}
        placeholder="Type your answer here..."
      ></textarea>

      <br />
      <button
        onClick={checkCode}
        style={{
          marginTop: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "8px 14px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Check
      </button>

      <p>{result}</p>
    </div>
  );
}
