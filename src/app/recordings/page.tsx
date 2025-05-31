// src/app/recordings/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Recording {
  id: number;
  user_id: string;
  path: string;
  transcript: string | null;
  created_at: string;
}

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [durations, setDurations] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('recordings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) setRecordings(data);
      setLoading(false);
    };

    fetch();
  }, []);

  const handleDelete = async (path: string, id: number) => {
    const { error: storageError } = await supabase.storage
      .from('recordings')
      .remove([path]);

    if (storageError) {
      alert('❌ Failed to delete video file.');
      return;
    }

    const { error: dbError } = await supabase
      .from('recordings')
      .delete()
      .eq('id', id);

    if (!dbError) {
      setRecordings((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert('❌ Failed to remove recording record.');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 relative overflow-hidden">
      {/* 🪞 Mirror Header */}
      <div className="relative z-10 max-w-xl mx-auto text-center space-y-3 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-6 rounded-2xl shadow-xl mb-12">
        <h1 className="text-4xl font-bold">My Recordings</h1>
        <p className="text-white/70 text-sm">Transcribed, styled & remixable by AiLi.</p>
      </div>

      {/* 🌀 Gradient Overlay */}
      <div className="absolute inset-x-0 top-0 h-[30vh] bg-gradient-to-b from-yellow-400/5 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[20vh] bg-gradient-to-t from-yellow-400/5 to-transparent pointer-events-none" />

      {/* 🌀 Load State */}
      {loading ? (
        <p className="text-center text-white/60 animate-pulse">Loading...</p>
      ) : recordings.length === 0 ? (
        <p className="text-center text-white/50">No recordings yet. Start capturing your flow.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {recordings.map((r) => {
            const isVideo = r.path?.endsWith('.webm') || r.path?.endsWith('.mp4');
            const assetUrl = `https://uaqbxdxihdanenkpjsyp.supabase.co/storage/v1/object/public/recordings/${r.path}`;
            return (
              <div
                key={r.id}
                className="flex gap-6 bg-white/5 rounded-2xl border border-white/10 shadow-xl p-4 backdrop-blur-md"
              >
                {/* 🎥 Media */}
                <div className="w-1/2 relative">
                  {isVideo ? (
                    <video
                      controls
                      src={assetUrl}
                      onLoadedMetadata={(e) => {
                        const videoEl = e.currentTarget;
                        const waitForDuration = () => {
                          if (videoEl.duration && !isNaN(videoEl.duration) && isFinite(videoEl.duration)) {
                            setDurations((prev) => ({
                              ...prev,
                              [r.id]: formatTime(videoEl.duration),
                            }));
                          } else {
                            setTimeout(waitForDuration, 200);
                          }
                        };
                        waitForDuration();
                      }}
                      className="rounded-xl w-full border border-yellow-400"
                    />
                  ) : (
                    <audio
                      controls
                      src={assetUrl}
                      className="rounded-xl w-full border border-yellow-400"
                    />
                  )}
                  {durations[r.id] && (
                    <div className="absolute bottom-1 right-2 text-xs text-white/80 bg-black/60 px-2 py-0.5 rounded-full">
                      {durations[r.id]}
                    </div>
                  )}
                </div>

                {/* 🧠 Transcript + Tools */}
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-sm text-white/40 mb-1">
                      {new Date(r.created_at).toLocaleString()}
                    </p>
                    {r.transcript ? (
                      <div className="bg-black/30 p-3 rounded-xl text-sm text-white/80 space-y-2">
                        <p className="leading-relaxed">{r.transcript.slice(0, 180)}...</p>
                      </div>
                    ) : (
                      <p className="text-yellow-300 text-sm">⚠️ Transcript in progress.</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-white/80">
                    <button className="px-3 py-1 border border-white/20 rounded-full hover:bg-white/10 transition">
                      ✂️ Trim
                    </button>
                    <button className="px-3 py-1 border border-white/20 rounded-full hover:bg-white/10 transition">
                      🎨 Stylize
                    </button>
                    <button className="px-3 py-1 border border-white/20 rounded-full hover:bg-white/10 transition">
                      🎬 Runway AI
                    </button>
                    <button
                      onClick={() => handleDelete(r.path, r.id)}
                      className="ml-auto text-red-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
