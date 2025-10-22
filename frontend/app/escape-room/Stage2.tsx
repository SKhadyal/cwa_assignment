"use client";
import { useState } from "react";

type Stage2Props = {
  onNext: () => void;
  onComplete?: (result: { fixed: boolean }) => void;
};

export default function Stage2({ onNext, onComplete }: Stage2Props) {
  const [fixed, setFixed] = useState(false);

  const handleClick = () => {
    if (fixed) {
      return;
    }
    setFixed(true);
    onComplete?.({ fixed: true });
    setTimeout(onNext, 1000);
  };

  return (
    <div className="stage">
      <h2>Stage 2 – Click to Debug Code</h2>
      <p>Click the red square to fix the bug!</p>
      <div
        onClick={handleClick}
        style={{
          background: fixed ? "green" : "red",
          width: 100,
          height: 100,
          margin: "1rem auto",
          borderRadius: 10,
          cursor: "pointer",
        }}
      />
      <p>{fixed ? "🐞 Bug fixed! Moving to next stage…" : "Hint: Click the red square."}</p>
    </div>
  );
}
