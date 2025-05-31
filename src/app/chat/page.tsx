// app/chat/page.tsx

'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Mic, SendHorizonal, Sparkles } from 'lucide-react';

const toneMap: Record<string, string> = {
  virgil: 'Remix & Design',
  pharrell: 'Purpose & Presence',
  kimk: 'Empire & Ownership',
};

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [streamedResponse, setStreamedResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [deanId, setDeanId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const examples = [
    'Help me shape a personal brand statement.',
    'What’s one strong founder move I can make this week?',
    'Draft a mission line that sounds real, not pitchy.',
  ];

  useEffect(() => {
    const dean = localStorage.getItem('selectedDean');
    if (dean) setDeanId(dean);

    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(data);
    };

    loadProfile();
  }, []);

  const sendPrompt = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setStreamedResponse('');
    abortRef.current = new AbortController();

    const tone = toneMap[deanId || ''] || 'Culturally Fluent Mentor';

    const res = await fetch('/api/atm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: input,
        tone,
        profile,
      }),
      signal: abortRef.current.signal,
    });

    if (!res.ok) {
      setStreamedResponse('❌ Something went wrong.');
      setLoading(false);
      return;
    }

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      setStreamedResponse((prev) => prev + chunk);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen relative bg-black text-white px-6 py-16 overflow-hidden">
      {/* 🎥 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-[10]"
      >
        <source src="/videos/pharrell_studio_v5.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 bg-black/60 z-[-1]" />

      <div className="max-w-2xl mx-auto space-y-10 relative z-10">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-6 py-6 shadow-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-xl">
            AiLi Chat
          </h1>
          <p className="text-white/70 text-base mt-2">
            Talk to AiLi like she’s your cofounder. Because she is.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4">
          <textarea
            rows={4}
            placeholder="Ask anything—strategy, brand moves, founder blocks..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-transparent border border-white/10 rounded-lg p-4 text-white placeholder-white/30"
          />

          <div className="flex justify-between items-center">
            <button
              onClick={sendPrompt}
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
            <Sparkles className="animate-spin" /> AiLi thinking...
          </div>
        )}

        {streamedResponse && (
          <div className="bg-white/10 border border-white/10 rounded-xl p-6 shadow whitespace-pre-wrap">
            {streamedResponse}
          </div>
        )}

        {!input && (
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/50">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setInput(ex)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 text-left"
              >
                {ex}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
