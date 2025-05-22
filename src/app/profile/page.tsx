//src/app/profile/page.tsx

'use client';

import { useState } from 'react';

export default function ProfilePage() {
    const [profile] = useState({
        persona: 'Visionary Builder',
        creatorStyle: 'Cultural Architect',
        goal: 'Monetize My IP',
        learningStyle: 'Watching + Visuals',
      });

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">🧬 My AiLi DNA</h1>

        <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">
          <p><strong>Persona:</strong> {profile.persona}</p>
          <p><strong>Creator Style:</strong> {profile.creatorStyle}</p>
          <p><strong>Primary Goal:</strong> {profile.goal}</p>
          <p><strong>Learning Style:</strong> {profile.learningStyle}</p>
        </div>

        {/* In the future, turn this into an editable form */}
      </div>
    </main>
  );
}
