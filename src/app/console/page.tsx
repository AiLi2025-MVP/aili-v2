// src/app/console/page.tsx

'use client';

import { useState } from 'react';

const advisors = [
  {
    id: 'pharrell',
    name: 'Pharrell',
    topic: 'Cultural Direction',
    //border: 'border-silver-500',
    border: 'border-blue-500', // 🔵 updated from yellow
  },
  {
    id: 'jayz',
    name: 'Jay-Z',
    topic: 'Brand Monetization',
    //border: 'border-silver-500',
    border: 'border-green-200',
  },
  {
    id: 'rihanna',
    name: 'Rihanna',
    topic: 'Market Execution',
    //border: 'border-silver-500',
    border: 'border-fuchsia-500',
  },
];

export default function ConsolePage() {
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [synthesis, setSynthesis] = useState('');

  const askBoardroom = async () => {
    if (!input.trim()) return;
    setThinking(true);
    setResponses({});
    setSynthesis('');

    const res = await Promise.all(
      advisors.map(async (adv) => {
        const response = await fetch(`/api/console`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ advisor: adv.id, prompt: input }),
        });
        const data = await response.json();
        return { id: adv.id, text: data.reply };
      })
    );

    const newResponses: Record<string, string> = {};
    res.forEach(({ id, text }) => {
      newResponses[id] = text;
    });

    const summaryRes = await fetch('/api/console', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        advisor: 'aili',
        prompt: `Summarize these insights and suggest the best next move:\n\n${res
          .map((r) => r.text)
          .join('\n\n')}`,
      }),
    });

    const summaryData = await summaryRes.json();
    setResponses(newResponses);
    setSynthesis(summaryData.reply);
    setThinking(false);
  };

  return (
    <main className="relative min-h-screen bg-transparent text-white px-6 py-16 space-y-6 overflow-hidden">
      {/* 🎥 Background */}
      <div className="fixed inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/lv_kids.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Header */}
      
      <div className="relative z-10 max-w-xl mx-auto text-center space-y-3 bg-white/5 backdrop-blur-md border border-white/20 px-6 py-6 rounded-2xl shadow-xl mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Vault Boardroom</h1>
        <p className="text-white/70 text-sm mt-2">
          Pharrell, Jay-Z, and Rihanna weigh in on your move. AiLi will help you take it global.
        </p>
      </div>

      {/* CTA & Prompt */}
      <div className="relative z-10 max-w-xl mx-auto text-center space-y-3 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-6 rounded-2xl shadow-xl mb-12">
        <div className="text-center">
          <button
            onClick={askBoardroom}
            disabled={thinking}
            className="bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold shadow hover:bg-yellow-500 transition disabled:opacity-50"
          >
            {thinking ? 'Thinking...' : 'Ask the Boardroom'}
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={2}
          placeholder="e.g. I want to launch a digital fashion drop for my followers..."
          className="w-full bg-black/30 text-white border border-yellow-400 rounded-xl p-4 placeholder-white/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* 🎤 Advisors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto pt-10 relative z-10">
        {advisors.map((adv) => (
          <div
            key={adv.id}
            className={`rounded-xl p-5 border-2 ${adv.border} bg-black/40 backdrop-blur-md`}
          >
            <div className="text-xs uppercase tracking-wide text-center text-white/60 mb-2">
              {adv.topic}
            </div>
            <h2 className="text-xl font-bold text-yellow-300 text-center">{adv.name}</h2>
            <div className="mt-4 text-sm text-white/90 whitespace-pre-wrap">
              {thinking ? (
                <p className="text-white/50 italic animate-pulse">Synthesizing insight...</p>
              ) : (
                <p>{responses[adv.id]}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 💡 AiLi Summary */}
      {synthesis && (
        <div className="max-w-4xl mx-auto bg-black/50 p-6 border border-white/10 rounded-2xl backdrop-blur-xl mt-12 relative z-10">
          <h3 className="text-xl font-semibold text-yellow-300 mb-3">AiLi’s Move</h3>
          <p className="text-white/80 whitespace-pre-wrap text-sm leading-relaxed">{synthesis}</p>
        </div>
      )}
    </main>
  );
}
