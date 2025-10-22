"use client";
import { useState } from "react";

type Stage3Completion = {
  code: string;
  totalNumbers: number;
  first: number;
  last: number;
};

type Stage3Props = {
  onNext: () => void;
  onComplete?: (result: Stage3Completion) => void;
};

export default function Stage3({ onNext, onComplete }: Stage3Props) {
  const [code, setCode] = useState(
    `function generateNumbers() {
  // Write your code here
  const nums = [];
  for (let i = 0; i <= 1000; i++) {
    nums.push(i);
  }
  return nums;
}`
  );
  const [result, setResult] = useState("");
  const [success, setSuccess] = useState(false);

  const checkCode = () => {
    try {
      // Reset any previous global function
      delete (window as any).generateNumbers;

      // Evaluate user code in global scope
      // eslint-disable-next-line no-eval
      (0, eval)(code);

      const fn = (window as any).generateNumbers;

      if (typeof fn === "function") {
        const output = fn();
        if (
          Array.isArray(output) &&
          output.length === 1001 &&
          output[0] === 0 &&
          output[1000] === 1000
        ) {
          setResult("✅ Correct! Generated numbers 0–1000 successfully.");
          setSuccess(true);
          onComplete?.({
            code,
            totalNumbers: output.length,
            first: output[0],
            last: output[output.length - 1],
          });
          setTimeout(onNext, 1500);
        } else {
          setResult("❌ The array should contain numbers 0 through 1000.");
        }
      } else {
        setResult("❌ You must define a function named generateNumbers().");
      }
    } catch (err: any) {
      setResult("⚠️ Error in your code: " + err.message);
    }
  };

  return (
    <div className="stage">
      <h2>Stage 3 – Generate Numbers 0 to 1000</h2>
      <p>Write a function that returns all numbers between 0 and 1000 (inclusive).</p>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={8}
        cols={60}
      />
      <br />

      <button onClick={checkCode}>Run Code</button>
      <p>{result}</p>
      {success && <p>🎉 Moving to next stage...</p>}
    </div>
  );
}
