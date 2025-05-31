// src/app/vault/[deanId]/page.tsx

'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const deanMap: any = {
  virgil: {
    name: 'Virgil Abloh',
    image: '/deans/virgil.png',
    quote: 'Everything I do is for the 17-year-old version of myself.',
    tone: 'Remix & Design',
    bg: 'from-yellow-400 via-pink-500 to-purple-600',
    bio: `Virgil Abloh was a designer, architect, and visionary who shattered boundaries across fashion, music, and design. He founded Off-White and served as the first Black artistic director of Louis Vuitton menswear. Virgil's remix philosophy bridged streetwear and luxury, culture and commerce.`,
  },
  pharrell: {
    name: 'Pharrell Williams',
    image: '/deans/pharrell.jpg',
    quote: 'The struggles along the way are only meant to shape you for your purpose.',
    tone: 'Purpose & Presence',
    bg: 'from-blue-600 via-indigo-500 to-purple-700',
    bio: `Pharrell Williams is a multi-hyphenate creative — producer, designer, entrepreneur — whose work bridges pop culture and purpose. From music to fashion to philanthropy, he builds cultural legacies while staying aligned with intention. He turns vibe into vision.`,
  },
  kimk: {
    name: 'Kim Kardashian',
    image: '/deans/kim_k.jpg',
    quote: 'I am a boss.',
    tone: 'Empire & Ownership',
    bg: 'from-emerald-400 via-teal-500 to-green-600',
    bio: `Kim Kardashian is a global icon and founder of SKIMS and multiple media ventures. She’s transformed influence into infrastructure — leading with style, execution, and unapologetic control. Kim builds brands that own the conversation.`,
  },
};

export default function DeanVaultPage() {
  const { deanId } = useParams() as { deanId: string };
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    if (deanId && deanMap[deanId]) {
      setSelected(deanMap[deanId]);
    }
  }, [deanId]);

  if (!selected) return <p className="p-6 text-center text-white">Loading Dean...</p>;

  return (
    <main className={`min-h-screen bg-gradient-to-br ${selected.bg} text-white px-6 py-12 flex items-center justify-center`}>
      <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl w-full max-w-2xl text-center space-y-6">
        <Image
          src={selected.image}
          alt={selected.name}
          width={120}
          height={120}
          className="rounded-xl object-cover border border-white/20 mx-auto"
        />
        <h1 className="text-3xl font-bold drop-shadow-lg">{selected.name}</h1>
        <p className="text-white/80 italic">“{selected.quote}”</p>
        <p className="text-white/60 text-sm">Tone: {selected.tone}</p>

        <div className="text-white/80 text-sm text-left bg-white/5 rounded-xl p-4 border border-white/10 max-h-64 overflow-y-auto">
          <p className="whitespace-pre-line">{selected.bio}</p>
        </div>

        <div className="pt-6 space-y-2">
          <Link
            href="/chat"
            className="inline-block bg-white/10 border border-white/20 px-6 py-2 rounded-full hover:bg-white/20 transition"
          >
            💬 Ask {selected.name.split(' ')[0]} a question
          </Link>
          <div>
           
          </div>
        </div>
      </div>
    </main>
  );
}
