"use client";
import { useState } from "react";

type Stage4Props = {
  onNext: () => void;
  onComplete?: (payload: { jsonInput: string; csvOutput: string }) => void;
};

export default function Stage4({ onNext, onComplete }: Stage4Props) {
  const [input, setInput] = useState('[{"name":"Alice"},{"name":"Bob"}]');
  const [output, setOutput] = useState("");
  const [csv, setCsv] = useState<string | null>(null);

  const convert = () => {
    try {
      const data = JSON.parse(input);
      const csvValue = data
        .map((x: any) => {
          if (x && typeof x === "object" && "name" in x) {
            return String(x.name);
          }
          return "";
        })
        .filter(Boolean)
        .join(",");

      if (!csvValue) {
        setOutput("❌ Provide objects with a 'name' property.");
        return;
      }

      setCsv(csvValue);
      setOutput(`✅ Converted to CSV: ${csvValue}`);
      onComplete?.({ jsonInput: input, csvOutput: csvValue });
      setTimeout(onNext, 1500);
    } catch {
      setOutput("❌ Invalid JSON format.");
    }
  };

  return (
    <div className="stage">
      <h2>Stage 4 – Port Data Between Formats</h2>
      <p>Convert this JSON to CSV format.</p>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={5}
        cols={50}
      />
      <br />
      <button onClick={convert}>Convert</button>
      <p>{output}</p>
      {csv && (
        <p style={{ fontSize: "0.9rem", color: "#ccc" }}>
          Preview: <code>{csv}</code>
        </p>
      )}
    </div>
  );
}
