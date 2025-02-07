import { ElevenLabsClient } from "elevenlabs";

export const createAudioStreamFromText = async (text: string): Promise<Buffer> => {
  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

  if (!ELEVENLABS_API_KEY) {
    throw new Error("Missing ELEVENLABS_API_KEY in environment variables");
  }

  const client = new ElevenLabsClient({ apiKey: ELEVENLABS_API_KEY });

  const audioStream = await client.generate({
    voice: "Rachel",
    model_id: "eleven_turbo_v2",
    text,
    output_format: "mp3_44100_32",
  });

  const chunks: Buffer[] = [];
  for await (const chunk of audioStream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
};
