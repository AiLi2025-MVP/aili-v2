// src/lib/transcript.ts

export const getTranscriptForRecording = async (assetId: string): Promise<string> => {
  const res = await fetch('/api/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assetId }),
  });

  const { text } = await res.json();
  return text || 'Transcript failed.';
};
