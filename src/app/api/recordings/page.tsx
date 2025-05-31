//src/app/recordings/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface Recording {
  id: number;
  path: string;
  transcript: string;
  created_at: string;
}

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('recordings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load recordings:', error.message);
      }

      setRecordings(data || []);
      setLoading(false);
    };

    load();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 space-y-10">
      <h1 className="text-4xl font-bold text-center">📁 My Recordings</h1>
      <p className="text-white/60 text-center">Audio sessions stored and transcribed by AiLi</p>

      {loading ? (
        <p className="text-white/60 text-center">Loading recordings...</p>
      ) : recordings.length === 0 ? (
        <p className="text-white/60 text-center">No recordings yet</p>
      ) : (
        <ul className="space-y-6 max-w-3xl mx-auto">
          {recordings.map((r) => (
            <li key={r.id} className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4 shadow">
              <div className="text-sm text-white/40">
                {new Date(r.created_at).toLocaleString()}
              </div>

              <audio
                controls
                src={`https://${
                  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID
                }.supabase.co/storage/v1/object/public/recordings/${r.path}`}
                className="w-full"
              />

              <div className="text-white/80 whitespace-pre-wrap">{r.transcript || 'No transcript available.'}</div>

              <Link
                href={`/chat?assetId=${encodeURIComponent(r.path)}`}
                className="text-blue-400 text-sm hover:underline inline-block"
              >
                💬 Chat with AiLi →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
