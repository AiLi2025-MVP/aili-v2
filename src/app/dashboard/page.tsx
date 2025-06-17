// src/app/dashboard/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FigureCard from '@/components/ui/FigureCard';

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }
      setUser(user);
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setProfile(data);
      } else {
        router.push('/onboarding');
      }
    };    

  useEffect(() => {
    const mutedPref = localStorage.getItem('isMuted');
    setIsMuted(mutedPref === 'true');
  }, []);

  const toggleMute = () => {
    setIsMuted((prev) => {
      localStorage.setItem('isMuted', String(!prev));
      return !prev;
    });
  };

  const handleAuth = async () => {
    if (user) {
      await supabase.auth.signOut();
      location.href = '/';
    } else {
      location.href = '/';
    }
  };

  const nextRoute = profile?.goal || profile?.creator_style ? '/syllabus' : '/onboarding';

  return (
    <main className="relative min-h-screen bg-black text-white px-6 py-10 overflow-hidden">
      {/* 🎥 Background */}
      <video autoPlay loop muted={isMuted} playsInline className="absolute inset-0 w-full h-full object-cover -z-0">
        <source src="/videos/pharrell-dashboard.mp4" type="video/mp4" />
      </video>

      {/* 🔇 Mute Toggle */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 z-20 bg-white/20 text-white px-3 py-1 rounded-full text-sm backdrop-blur hover:bg-white/30 transition"
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* 🧠 Hero Header */}
        <section className="rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/10 px-8 py-12 shadow-xl text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-xl">
            Hi, I’m AiLi:<br />
            Your AI-powered ally for<br />
            <span className="text-white font-extrabold">Influence, Innovation & Income</span>
          </h1>
          <Link
            href={nextRoute}
            className="relative px-6 py-3 rounded-full font-semibold text-white/90 transition-all bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md overflow-hidden shadow hover:scale-[1.02]"
          >
            <span className="relative z-10">Continue →</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 opacity-30 hover:opacity-50 blur-xl transition-all" />
          </Link>
        </section>

        {/* 🎥 Roadwork Video (Intro Sizzler) */}
<section className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-white/10 backdrop-blur-md">
  <video
    autoPlay
    loop
    muted={isMuted}
    playsInline
    className="w-full h-full object-cover rounded-2xl"
  >
    <source src="/videos/0616_roadwork.mp4" type="video/mp4" />
  </video>
</section>

{/* 🧬 DNA Summary */}
{profile && (
  <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-4 border border-white/10 rounded-2xl backdrop-blur-md shadow-lg">
    <div>
      <h2 className="text-yellow-300 font-bold">Tagline</h2>
      <p>{profile.tagline || 'Driving cultural transformation through Ai Media brilliance.'}</p>
    </div>
    <div>
      <h2 className="text-yellow-300 font-bold">Personality Traits</h2>
      <ul className="list-disc list-inside text-white/80 space-y-1">
        <li>Innovative: Embraces new strategies in Ai Media</li>
        <li>Decision-Maker: Acts fast, thinks smart</li>
      </ul>
    </div>
    <div>
      <h2 className="text-yellow-300 font-bold">Founder Archetype</h2>
      <p>{profile.archetype || 'The Visionary Pioneer – charting bold new paths in Ai Media.'}</p>
    </div>
    <div>
      <h2 className="text-yellow-300 font-bold">Creative Motto</h2>
      <p>{profile.motto || 'Trailblaze the future, one billion-dollar idea at a time.'}</p>
    </div>
  </section>
)}


        {/* 🧭 Navigation Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          <FigureCard title="Syllabus" subtitle="Structured learning journey." icon="/icons/syllabus.svg" href="/syllabus" />
          <FigureCard title="Go Live" subtitle="Stream your thoughts." icon="/icons/live.svg" href="/stream" />
          <FigureCard title="View Recordings" subtitle="Revisit past moments." icon="/icons/recordings.svg" href="/recordings" />
          <FigureCard title="AiLi Chat" subtitle="Ask anything anytime." icon="/icons/chat.svg" href="/vault" />
        </section>
      </div>

      {/* Auth Toggle */}
      <button
        onClick={handleAuth}
        className="fixed bottom-16 right-8 z-30 text-white/70 hover:text-white text-sm px-4 py-2 bg-black/50 border border-white/20 rounded-full backdrop-blur-md shadow-md"
      >
        {user ? 'Log Out' : 'Log In'}
      </button>
    </main>
  );
}
