//app/chat/ChatClient.tsx

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mic, SendHorizonal, Sparkles } from 'lucide-react';

// Mock transcript fetch
const getTranscriptForRecording = async (assetId: string): Promise<string> => {
  return `Transcript placeholder for recording: ${assetId}`;
};

export default function ChatClient() {
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [profile] = useState({
    profileDNA: {
      persona: 'visionary founder',
      creatorStyle: 'audio-visual',
    },
    preferences: {
      learningStyle: 'interactive storytelling',
    },
  });

  const params = useSearchParams();
  const assetId = params?.get('assetId') ?? '';

  useEffect(() => {
    const loadTranscript = async () => {
      if (assetId) {
        const transcript = await getTranscriptForRecording(assetId);
        setChat([
          {
            role: 'system',
            content: `This chat is based on the following transcript:\n${transcript}`,
          },
        ]);
      }
    };

    loadTranscript();
  }, [assetId]);

  const sendMessage = (msg: string) => {
    setChat((prev) => [...prev, { role: 'user', content: msg }]);
  };

  const receiveMessage = (msg: string) => {
    setChat((prev) => [...prev, { role: 'assistant', content: msg }]);
  };

  const askAiLi = async () => {
    if (!input.trim()) return;
    setLoading(true);
    sendMessage(input);

    const toneContext = `You are AiLi, a culturally fluent AI learning companion. The user is a "${profile?.profileDNA?.persona}" with a style of "${profile?.profileDNA?.creatorStyle}". They prefer learning via "${profile?.preferences?.learningStyle}".`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: toneContext },
            ...chat,
            { role: 'user', content: input },
          ],
        }),
      });

      const data = await res.json();
      receiveMessage(data.reply || 'Sorry, something went wrong.');
    } catch {
      receiveMessage('Error reaching AiLi server. Please try again.');
    }

    setInput('');
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('/pharrell/pharrell-dashboard.jpg')] bg-cover bg-center blur-xl scale-110" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-xl">💬 AiLi Chat</h1>
          <p className="text-white/70 text-sm">No Code Switching</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4">
          <div className="h-[300px] overflow-y-auto space-y-3">
            {chat.map((msg, i) => (
              <div
                key={i}
                className={`text-sm whitespace-pre-wrap ${
                  msg.role === 'user' ? 'text-blue-400' : 'text-green-400'
                }`}
              >
                <strong>{msg.role === 'user' ? 'You' : 'AiLi'}:</strong> {msg.content}
              </div>
            ))}
          </div>

          <textarea
            rows={3}
            placeholder="Ask a question, remix an idea, or explore..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-transparent border border-white/10 rounded-lg p-4 text-white placeholder-white/30"
          />

          <div className="flex justify-between items-center">
            <button
              onClick={askAiLi}
              disabled={loading}
              className="flex items-center gap-2 bg-white/10 border border-white/10 hover:bg-white/20 px-4 py-2 rounded-full font-medium transition disabled:opacity-50"
            >
              <SendHorizonal size={16} /> Ask AiLi
            </button>
            <button className="text-white/40 hover:text-white">
              <Mic size={20} />
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center gap-2 animate-pulse text-white/60">
            <Sparkles className="animate-spin" /> Thinking like AiLi...
          </div>
        )}
      </div>
    </main>
  );
}

