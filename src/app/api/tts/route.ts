import type { NextRequest } from "next/server";
import { createAudioStreamFromText } from "./createAudioStreamFromText";

const headers = new Headers({
  "Content-Type": "audio/mp3",
  "Transfer-Encoding": "chunked",
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text");

  if (!text) {
    return new Response("Missing text parameter", { status: 400 });
  }

  const audioStream = await createAudioStreamFromText(text);
  return new Response(audioStream, { headers });
}
