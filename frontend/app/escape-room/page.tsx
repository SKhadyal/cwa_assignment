"use client";
import { useState } from "react";
import "./Style.css";
import EscapeTimer from "./components/EscapeTimer";
import Stage1 from "./Stage1";
import Stage2 from "./Stage2";
import Stage3 from "./Stage3";
import Stage4 from "./Stage4";

type StageProgressState = {
  stage1?: { rawInput: string; normalizedAnswer: string };
  stage2?: { fixed: boolean };
  stage3?: {
    code: string;
    totalNumbers: number;
    first: number;
    last: number;
  };
  stage4?: { jsonInput: string; csvOutput: string };
};

type SavePanelProps = {
  stageProgress: StageProgressState;
  stageFourData?: StageProgressState["stage4"];
  playerName: string;
  onNameChange: (value: string) => void;
  onSave: () => void;
  saveDisabled: boolean;
  saveState: "idle" | "saving" | "success" | "error";
  saveMessage: string;
  hasRecordedProgress: boolean;
};

function SavePanel({
  stageProgress,
  stageFourData,
  playerName,
  onNameChange,
  onSave,
  saveDisabled,
  saveState,
  saveMessage,
  hasRecordedProgress,
}: SavePanelProps) {
  return (
    <div
      style={{
        marginTop: "24px",
        backgroundColor: "rgba(255,255,255,0.08)",
        padding: "18px",
        borderRadius: "12px",
        textAlign: "left",
      }}
    >
      <h3 style={{ marginTop: 0 }}>Save Your Progress</h3>
      <p style={{ marginBottom: "10px" }}>
        Review your captured answers and store them in the database.
      </p>
      <ul style={{ paddingLeft: "20px", marginTop: 0, marginBottom: "16px" }}>
        {stageProgress.stage1 && (
          <li>
            <strong>Stage 1:</strong> {stageProgress.stage1.rawInput} ➝{" "}
            {stageProgress.stage1.normalizedAnswer}
          </li>
        )}
        {stageProgress.stage2 && (
          <li>
            <strong>Stage 2:</strong> Bug fixed ✅
          </li>
        )}
        {stageProgress.stage3 && (
          <li>
            <strong>Stage 3:</strong> Generated{" "}
            {stageProgress.stage3.totalNumbers} numbers (
            {stageProgress.stage3.first} → {stageProgress.stage3.last})
          </li>
        )}
        {stageFourData && (
          <li>
            <strong>Stage 4:</strong> CSV =&nbsp;
            <code>{stageFourData.csvOutput}</code>
          </li>
        )}
        {!stageProgress.stage4 && (
          <li>Complete remaining stages to unlock more data.</li>
        )}
      </ul>
      <input
        type="text"
        value={playerName}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Enter your name"
        style={{
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #555",
          width: "70%",
          maxWidth: "260px",
          marginRight: "10px",
        }}
        aria-label="Player name"
        disabled={!hasRecordedProgress}
      />
      <button
        onClick={onSave}
        disabled={saveDisabled}
        style={{
          backgroundColor: saveState === "success" ? "#00cc66" : "#ffaa00",
          border: "none",
          color: "black",
          padding: "10px 16px",
          borderRadius: "6px",
          cursor: saveDisabled ? "not-allowed" : "pointer",
          fontWeight: 600,
        }}
      >
        {saveState === "saving" ? "Saving..." : "💾 Save Result"}
      </button>
      {saveMessage && (
        <p
          style={{
            marginTop: "10px",
            color: saveState === "error" ? "#ff6b6b" : "#7dffaf",
          }}
        >
          {saveMessage}
        </p>
      )}
    </div>
  );
}

export default function EscapeRoom() {
  const [stage, setStage] = useState(1);
  const [escaped, setEscaped] = useState(false);
  const [stageProgress, setStageProgress] = useState<StageProgressState>({});
  const [playerName, setPlayerName] = useState("");
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [saveMessage, setSaveMessage] = useState("");

  // Restart when time runs out
  const handleTimeout = () => {
    alert("⏰ Time is over! Restarting...");
    setStage(1);
    setEscaped(false);
    setStageProgress({});
    setSaveState("idle");
    setSaveMessage("");
    setPlayerName("");
  };

  // Move to next stage
  const nextStage = () => {
    if (stage < 4) {
      setStage(stage + 1);
    } else {
      setEscaped(true); // ✅ finished all stages
    }
  };

  // Restart the entire challenge manually
  const restartGame = () => {
    setStage(1);
    setEscaped(false);
    setStageProgress({});
    setSaveState("idle");
    setSaveMessage("");
    setPlayerName("");
  };

  const updateStageProgress = <K extends keyof StageProgressState>(
    key: K,
    value: StageProgressState[K]
  ) => {
    setStageProgress((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSaveState("idle");
    setSaveMessage("");
  };

  const resolveSaveEndpoints = () => {
    const normalize = (value?: string | null) => value?.replace(/\/+$/, "");
    const endpoints = new Set<string>();
    endpoints.add("/api/save-progress");

    const candidates = new Set<string>();
    const addCandidate = (value?: string | null) => {
      const normalized = normalize(value);
      if (normalized) {
        candidates.add(normalized);
      }
    };

    addCandidate(process.env.NEXT_PUBLIC_API_URL || null);

    if (typeof window !== "undefined") {
      const { protocol, hostname, host } = window.location;
      const targetPort = process.env.NEXT_PUBLIC_API_PORT || "4000";

      // Same host with explicit port (works for localhost / dev servers)
      addCandidate(`${protocol}//${hostname}:${targetPort}`);

      if (host.includes(":")) {
        const [baseHost] = host.split(":");
        addCandidate(`${protocol}//${baseHost}:${targetPort}`);
      }

      // Support hosts encoded as `<id>-3000.domain` (GitHub Codespaces, etc.)
      const hyphenated = hostname.replace(/-\d+(?=\.)/, `-${targetPort}`);
      if (hyphenated !== hostname) {
        addCandidate(`${protocol}//${hyphenated}`);
      }

      // Offer HTTP fallback when page served over HTTPS but API only on HTTP
      if (protocol === "https:") {
        addCandidate(`http://${hostname}:${targetPort}`);
      }
    }

    addCandidate("http://localhost:4000");
    addCandidate("http://127.0.0.1:4000");
    for (const candidate of candidates) {
      endpoints.add(`${candidate}/api/results`);
    }
    return Array.from(endpoints);
  };

  const attemptSave = async (endpoint: string, payload: unknown) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const message =
        (data && typeof data.error === "string" && data.error) ||
        response.statusText ||
        "Unable to save result.";
      throw new Error(message);
    }

    return response;
  };

  const handleSave = async () => {
    const hasProgress = Object.keys(stageProgress).length > 0;
    if (!hasProgress) {
      setSaveState("error");
      setSaveMessage("Nothing to save yet. Complete a stage first.");
      return;
    }

    try {
      setSaveState("saving");
      setSaveMessage("");

      const payload = {
        playerName: playerName.trim() || "Anonymous Adventurer",
        stages: stageProgress,
        csvOutput: stageProgress.stage4?.csvOutput ?? "",
      };

      const endpoints = resolveSaveEndpoints();
      let response: Response | null = null;
      let lastError: Error | null = null;
      const errorMessages: string[] = [];

      for (const endpoint of endpoints) {
        try {
          response = await attemptSave(endpoint, payload);
          lastError = null;
          break;
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : "Failed to save result.";
          errorMessages.push(`${endpoint} → ${message}`);
          lastError =
            error instanceof Error ? error : new Error(message);
        }
      }

      if (!response) {
        throw (
          lastError ??
          new Error(
            errorMessages.length
              ? `Unable to reach results API. Tried: ${errorMessages.join(
                  "; "
                )}`
              : "Failed to save result."
          )
        );
      }

      await response.json().catch(() => {
        /* ignore body parse errors */
      });

      setSaveState("success");
      setSaveMessage("✅ Result saved!");
    } catch (error: any) {
      setSaveState("error");
      setSaveMessage(error.message || "Failed to save result.");
    }
  };

  const hasRecordedProgress = Object.keys(stageProgress).length > 0;
  const stageFourData = stageProgress.stage4;

  return (
    <div
      className="escape-room-bg"
      style={{
        backgroundImage: "url('/mountain.jpg')", // ✅ or /mountains.jpg if that's your file name
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Overlay container */}
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.7)",
          padding: "40px",
          borderRadius: "15px",
          width: "60%",
          maxWidth: "800px",
          color: "white",
          textAlign: "center",
        }}
      >
        {!escaped ? (
          <>
            {stage === 1 && (
              <Stage1
                onNext={nextStage}
                onComplete={(data) => updateStageProgress("stage1", data)}
              />
            )}
            {stage === 2 && (
              <Stage2
                onNext={nextStage}
                onComplete={(data) => updateStageProgress("stage2", data)}
              />
            )}
            {stage === 3 && (
              <Stage3
                onNext={nextStage}
                onComplete={(data) => updateStageProgress("stage3", data)}
              />
            )}
            {stage === 4 && (
              <Stage4
                onNext={nextStage}
                onComplete={(data) => updateStageProgress("stage4", data)}
              />
            )}
            {hasRecordedProgress && (
              <SavePanel
                stageProgress={stageProgress}
                stageFourData={stageFourData}
                playerName={playerName}
                onNameChange={(value) => {
                  setPlayerName(value);
                  if (saveState !== "idle") {
                    setSaveState("idle");
                    setSaveMessage("");
                  }
                }}
                onSave={handleSave}
                saveDisabled={saveState === "saving"}
                saveState={saveState}
                saveMessage={saveMessage}
                hasRecordedProgress={hasRecordedProgress}
              />
            )}
          </>
        ) : (
          // ✅ Final success screen
          <div>
            <h1>🎉 Congratulations! You Escaped the Room 🎉</h1>
            <p>
              You completed all coding challenges successfully within the time
              limit!
            </p>
            {stageFourData && (
              <div
                style={{
                  background: "rgba(255,255,255,0.08)",
                  padding: "16px",
                  borderRadius: "10px",
                  marginTop: "18px",
                  textAlign: "left",
                }}
              >
                <h3 style={{ marginBottom: "12px" }}>Your Data Port</h3>
                <p>
                  <strong>JSON Input:</strong>
                </p>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: "0.85rem",
                  }}
                >
                  {stageFourData.jsonInput}
                </pre>
                <p>
                  <strong>CSV Output:</strong> {stageFourData?.csvOutput}
                </p>
              </div>
            )}

            {hasRecordedProgress && (
              <SavePanel
                stageProgress={stageProgress}
                stageFourData={stageFourData}
                playerName={playerName}
                onNameChange={(value) => {
                  setPlayerName(value);
                  if (saveState !== "idle") {
                    setSaveState("idle");
                    setSaveMessage("");
                  }
                }}
                onSave={handleSave}
                saveDisabled={saveState === "saving"}
                saveState={saveState}
                saveMessage={saveMessage}
                hasRecordedProgress={hasRecordedProgress}
              />
            )}

            <button
              onClick={restartGame}
              style={{
                backgroundColor: "#00cc66",
                border: "none",
                color: "white",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                marginTop: "20px",
              }}
            >
              🔁 Play Again
            </button>
          </div>
        )}
      </div>

      {/* Timer (only shows while playing) */}
      {!escaped && <EscapeTimer onTimeout={handleTimeout} />}
    </div>
  );
}
