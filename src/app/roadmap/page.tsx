//src/app/roadmap/page.tsx

'use client';

import { useEffect, useState } from 'react';

export default function RoadmapPage() {
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔮 Example user profile (replace w/ real user profile integration later)
  const profile = {
    profileDNA: {
      persona: 'Visionary Builder',
      creatorStyle: 'Cultural Architect',
    },
    preferences: {
      goal: 'monetize',
      learningStyle: 'video',
    },
  };

  const generateRoadmap = async () => {
    setLoading(true);

    const res = await fetch('/api/roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });

    const data = await res.json();
    setReply(data.reply);
    setLoading(false);
  };

  useEffect(() => {
    generateRoadmap();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">🚀 AiLi Startup Roadmap</h1>
        <p className="text-white/70">
          Based on your founder DNA and learning style, here’s what AiLi recommends.
        </p>

        {loading ? (
          <p className="animate-pulse text-white/50">Generating roadmap...</p>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 whitespace-pre-wrap">
            {reply}
          </div>
        )}
      </div>
    </main>
  );
}
