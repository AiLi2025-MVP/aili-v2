// Full updated /syllabus/[id]/page.tsx with gold-pill lesson badges,
// stacked “threaded” chapter layout, and placeholder completion % badge.
// Includes visual styling that matches the Figma reference more closely.

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useProgress } from '@/context/ProgressContext';

export default function ModulePage() {
const { id } = useParams();
const [module, setModule] = useState<any>(null);
const [lessons, setLessons] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const progressMap = useProgress();

useEffect(() => {
const fetch = async () => {
const { data: mod } = await supabase.from('modules').select('*').eq('id', id).single();
setModule(mod);
const { data: lessonsData, error: lessonsError } = await supabase
.from('lessons')
.select('*')
.eq('module_id', id)
.order('created_at', { ascending: true });

if (lessonsError) {
console.error('Error fetching lessons:', lessonsError.message);
}

setLessons(lessonsData || []);
setLoading(false);
};

fetch();
}, [id]);

if (loading) return <p className="p-6 text-center text-white">Loading module...</p>;
if (!module) return <p className="p-6 text-center text-red-500">Module not found.</p>;

return (
<main className="min-h-screen bg-black text-white px-6 py-12">
<div className="max-w-5xl mx-auto space-y-12">
<header className="text-center space-y-2">
<h1 className="text-3xl md:text-5xl font-bold">{module.title}</h1>
<p className="text-white/70">{module.subtitle}</p>
</header>
<section className="space-y-6">
      {lessons.map((lesson, idx) => {
        const completed = progressMap?.[module.id]?.includes(lesson.id);
        const tools = [
          lesson.video && 'Video',
          lesson.canva_url && 'Canva',
          lesson.notion_url && 'Notion',
          lesson.openai && 'OpenAI',
          lesson.claude && 'Claude',
        ].filter(Boolean);

        const completionPercent = completed ? '100%' : `${Math.floor(Math.random() * 40)}%`;

        return (
          <Link
            key={lesson.id}
            href={`/syllabus/${module.id}/lesson/${lesson.id}`}
            className="block bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-3xl p-5 transition hover:scale-[1.01] hover:bg-white/10 backdrop-blur-xl"
          >
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-xl font-bold">{lesson.title}</h2>
              <span className="text-sm text-white/60">{lesson.duration}</span>
            </div>

            <p className="text-white/70 text-sm">{lesson.subtitle}</p>

            <div className="flex flex-wrap gap-2 items-center mt-3">
              {tools.map((tool, i) => (
                <span
                  key={i}
                  className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-xs px-3 py-1 rounded-full font-medium"
                >
                  {tool}
                </span>
              ))}
              <span className="ml-auto bg-white/10 px-3 py-1 rounded-full text-xs text-white/70 border border-white/20">
                {completionPercent}
              </span>
            </div>
          </Link>
        );
      })}
    </section>
  </div>
</main>
);
}