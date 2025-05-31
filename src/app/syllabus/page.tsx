//src/app/syllabus/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useProgress } from '@/context/ProgressContext';

export default function SyllabusPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const progressMap = useProgress();
  const router = useRouter();

    useEffect(() => {
      const scrollTimer = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 50);
    
      const fetchModules = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
    
        if (!user) return setLoading(false);
    
        const { data, error } = await supabase.from('modules').select('*');
        if (!error) setModules(data);
        setLoading(false);
      };
    
      fetchModules();
      return () => clearTimeout(scrollTimer);
    }, []);

    const handleResume = () => {
      if (!progressMap) return; // ← ✅ Handle null case
    
      for (const mod of modules) {
        const progress = progressMap?.[mod.id] || []; // still defensive
        for (let i = 1; i <= mod.lessonCount; i++) {
          if (!progress.includes(String(i))) {
            return router.push(`/syllabus/${mod.id}/lesson/${i}`);
          }
        }
      }
    
      if (modules[0]) router.push(`/syllabus/${modules[0].id}/lesson/1`);
    };
    

  if (loading) return <p className="p-6 text-center">Loading your syllabus...</p>;

  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      {/* 🎥 Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-[-2]"
      >
        <source src="/videos/pharrell-syllabus-v1.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 bg-black/60 z-[-1]" />

      {/* 🪞 Header Window */}
      <div className="relative z-10 flex items-center justify-center h-[36vh] px-6">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-6 py-6 shadow-2xl max-w-3xl text-center">
          <h1 className="text-3xl md:text-5xl font-bold drop-shadow-xl">
            Monetize Brand Ambition
          </h1>
          <p className="text-white/70 text-sm mt-2">
            Pharrell x Thai Randolph show you how.
          </p>
        </div>
      </div>

      {/* 🧱 Creative Stack */}
      <div className="relative z-10 max-w-5xl mx-auto -mt-4 px-6">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl">
          <h2 className="text-white text-base font-semibold mb-3">Creative Stack</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              { name: '', url: 'https://www.canva.com/', logo: '/logos/canva.png' },
              { name: '', url: 'https://notion.so', logo: '/logos/notion.png' },
              { name: '', url: 'https://platform.openai.com/', logo: '/logos/openai.png' },
              { name: '', url: 'https://www.anthropic.com/', logo: '/logos/claude.png' },
            ].map((tool) => (
              <a
                key={tool.url}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 transition text-white rounded-xl p-3 flex flex-col items-center gap-2"
              >
                <img src={tool.logo} alt={tool.name} className="h-12 w-auto object-contain" />
                <span className="text-xs font-medium mt-1">{tool.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 📚 Module Cards */}
      <div className="relative z-10 max-w-5xl mx-auto space-y-8 px-6 py-10">
        {modules.map((mod) => {
          const completed = progressMap?.[mod.id]?.length || 0;
          const total = mod.lesson_count || 1;
          const percent = Math.round((completed / total) * 100);

          return (
            <div
              key={mod.id}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 sm:p-7 shadow-xl transition hover:shadow-2xl space-y-5"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold drop-shadow">{mod.title}</h3>
                <p className="text-white/70 text-sm">{mod.subtitle}</p>
              </div>

              <div className="h-2 bg-white/20 rounded overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 rounded transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-xs text-white/60">{percent}% Complete</p>

              <div className="flex flex-wrap gap-3 pt-4">
                <Link
                  href={`/syllabus/${mod.id}`}
                  className="bg-white/10 text-white px-4 py-2 rounded-full backdrop-blur hover:bg-white/20 transition text-sm font-medium"
                >
                  Open Module
                </Link>
                <button
                  onClick={handleResume}
                  className="bg-gradient-to-tr from-white/10 via-white/5 to-transparent border border-white/10 text-white px-4 py-2 rounded-full text-sm hover:bg-white/10 transition backdrop-blur"
                >
                  Resume
                </button>
                <Link
                  href="/onboarding"
                  className="text-sm text-white/70 hover:text-white transition underline"
                >
                  Select Learning Style
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
