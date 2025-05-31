// src/app/vault/page.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';

const deans = [
  {
    id: 'virgil',
    name: 'Virgil Abloh',
    image: '/deans/virgil.png',
    tone: 'Remix & Design',
    quote: 'You’re supposed to make your own way. You’re supposed to break the rules.',
    color: 'from-yellow-300 to-pink-400',
  },
  {
    id: 'pharrell',
    name: 'Pharrell Williams',
    image: '/deans/pharrell.jpg',
    tone: 'Purpose & Presence',
    quote: 'The struggles along the way are only meant to shape you for your purpose.',
    color: 'from-blue-600 to-indigo-500',
  },
  {
    id: 'kimk',
    name: 'Kim Kardashian',
    image: '/deans/kim_k.jpg',
    tone: 'Empire & Ownership',
    quote: 'I am a boss.',
    color: 'from-teal-400 to-emerald-500',
  },
];

export default function VaultHome() {
  return (
    <main className="min-h-screen text-white px-6 py-16 relative overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-[-2]"
      >
        <source src="/videos/dean_vault_v2.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 bg-black/60 z-[-1]" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-10">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-6 py-6 shadow-2xl text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-xl">Dean of Culture</h1>
          <p className="text-white/70 text-base mt-2">Tap into cultural intelligence curated by icons.</p>
          <p className="text-white/70 text-base mt-2">Each Dean channels a unique lens on life, creativity, and legacy.</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 pt-6">
          {deans.map((dean) => (
            <Link
              key={dean.id}
              href={`/vault/${dean.id}`}
              onClick={() => localStorage.setItem('selectedDean', dean.id)}
              className={`rounded-3xl bg-gradient-to-br ${dean.color} p-1 hover:scale-105 transition shadow-xl`}
            >
              <div className="bg-black/90 rounded-2xl p-5 flex flex-col items-center text-center h-full">
                <Image
                  src={dean.image}
                  alt={dean.name}
                  width={100}
                  height={100}
                  className="rounded-full object-cover border-2 border-white/20 shadow-md"
                />
                <h3 className="text-xl font-semibold mt-4 mb-1">{dean.name}</h3>
                <p className="text-sm text-white/70 italic">{dean.tone}</p>
                <blockquote className="text-xs text-white/50 mt-3">“{dean.quote}”</blockquote>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
