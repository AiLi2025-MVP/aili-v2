//src/app/syllabus/[id]/lesson/[lessonId]/page.tsx
// Updated Lesson Page with LV-style gold treatment and completion styling

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useProgress } from '@/context/ProgressContext';

export default function LessonPage() {
  const { id, lessonId } = useParams();
  const progressContext = useProgress();

  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [prompt, setPrompt] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.warn('🔒 No user found');
          return;
        }

        const { data, error } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', lessonId)
          .eq('module_id', id)
          .single();

        if (error || !data) {
          console.error('❌ Lesson fetch failed:', error?.message);
          return;
        }

        setLesson(data);

        const { error: upsertError } = await supabase.from('user_progress').upsert({
          user_id: user.id,
          module_id: id,
          lesson_id: lessonId,
          completed: true,
        });

        if (upsertError) {
          console.warn('⚠️ Progress not saved:', upsertError.message);
        }

        progressContext?.refreshProgress?.();
      } catch (err) {
        console.error('🔥 Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [id, lessonId]);

  const saveNote = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !note.trim()) return;

    await supabase.from('notes').insert({
      user_id: user.id,
      module_id: id,
      lesson_id: lessonId,
      note,
    });

    setNote('');
    alert('📝 Note saved!');
  };

  const askAiLi = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !prompt.trim()) return;

    setLoadingAi(true);
    const res = await fetch('/api/atm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setAiReply(data.reply);

    await supabase.from('chat_logs').insert({
      user_id: user.id,
      prompt,
      tone: 'lesson remix',
      asset_id: null,
    });

    setLoadingAi(false);
  };

  if (loading) return <p className="text-white p-6 text-center">Loading lesson...</p>;
  if (!lesson) return <p className="text-red-500 p-6 text-center">Lesson not found.</p>;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold">{lesson.title}</h1>
          <p className="text-white/70">{lesson.subtitle}</p>
        </header>

        {lesson.video && (
          <video controls className="w-full rounded-xl shadow border border-white/10">
            <source src={lesson.video} type="video/mp4" />
          </video>
        )}

        {lesson.content && (
          <div className="prose prose-invert max-w-none">
            {lesson.content.split('\n\n').map((block: string, i: number) => (
              <p key={i}>{block}</p>
            ))}
          </div>
        )}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">📝 Notes</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Your reflections or takeaways..."
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white"
            rows={4}
          />
          <button
            onClick={saveNote}
            className="bg-gold-glass border border-yellow-400 text-yellow-300 px-4 py-2 rounded-full backdrop-blur hover:bg-white/10 transition"
          >
            Save Note
          </button>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">🧠 Ask AiLi</h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AiLi to remix, summarize, or ideate..."
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white"
            rows={3}
          />
          <button
            onClick={askAiLi}
            disabled={loadingAi}
            className="bg-white/10 text-white px-4 py-2 rounded hover:bg-white/20 transition disabled:opacity-50"
          >
            {loadingAi ? 'Thinking...' : 'Send to AiLi'}
          </button>

          {aiReply && (
            <div className="bg-white/5 p-4 rounded border border-white/10 space-y-2">
              <p className="font-semibold text-yellow-300">AiLi’s Response:</p>
              <p className="whitespace-pre-wrap">{aiReply}</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
