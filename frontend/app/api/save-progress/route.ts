import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type StageProgress = Record<string, unknown>;

type SavePayload = {
  playerName?: string;
  stages?: StageProgress;
  stageData?: StageProgress;
  jsonInput?: string;
  csvOutput?: string;
};

const normalize = (value?: string | null) => value?.replace(/\/+$/, "");

function getBackendBases() {
  const candidates = new Set<string>();
  const add = (value?: string | null) => {
    const v = normalize(value);
    if (v) {
      candidates.add(v);
    }
  };

  add(process.env.API_INTERNAL_URL || null);
  add(process.env.NEXT_PUBLIC_API_URL || null);
  add(process.env.API_URL || null);
  add(process.env.API_BASE_URL || null);

  add("http://api:4000");
  add("http://localhost:4000");
  add("http://127.0.0.1:4000");

  return Array.from(candidates);
}

async function forwardRequest(payload: SavePayload) {
  const bases = getBackendBases();
  let lastResponse: Response | null = null;
  let lastError: Error | null = null;

  for (const base of bases) {
    try {
      const response = await fetch(`${base}/api/results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return response;
      }

      // Non-OK responses are treated as failures and bubbled up with details.
      const text = await response.text();
      lastResponse = new Response(text, { status: response.status });
    } catch (error) {
      lastError =
        error instanceof Error
          ? error
          : new Error("Failed to reach results API.");
    }
  }

  if (lastResponse) {
    return lastResponse;
  }

  throw lastError ?? new Error("Unable to contact results API.");
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as SavePayload;
    const response = await forwardRequest(payload);
    const bodyText = await response.text();

    return new NextResponse(bodyText, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error: any) {
    const message =
      error?.message || "Unable to reach backend results service.";
    return NextResponse.json(
      { error: message },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
