//src/app/recordings/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Sparkles } from 'lucide-react';

export default function RecordingDetailPage() {
  const { id } = useParams();
  const [recording, setRecording] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState('');

  useEffect(() => {
    const fetchRecording = async () => {
      const { data } = await supabase
        .from('recordings')
        .select('*')
        .eq('path', decodeURIComponent(id as string))
        .single();

      if (data) setRecording(data);
      setLoading(false);
    };

    fetchRecording();
  }, [id]);
  const askAiLi = async () => {
    setChat('');
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) {
      console.warn('🔒 No user found');
      return;
    }
  
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'This is a transcript from a user session.' },
          { role: 'system', content: recording.transcript },
          { role: 'user', content: 'What are the key takeaways from this recording?' }
        ],
        tone: 'Culturally Fluent Mentor',
        assetId: recording.path,
        userId: user.id
      })
    });
  
    const { reply } = await res.json();
    setChat(reply);
  };
  

  const isVideo = recording?.path?.endsWith('.webm') || recording?.path?.endsWith('.mp4');
  const assetUrl = `https://uaqbxdxihdanenkpjsyp.supabase.co/storage/v1/object/public/recordings/${recording?.path}`;

  if (loading) return <p className="text-white text-center p-6">Loading recording...</p>;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 space-y-10">
      {/* 🪞 Mirror Header */}
      <div className="text-center bg-white/5 backdrop-blur-md border border-white/10 px-6 py-6 rounded-2xl shadow-xl max-w-xl mx-auto">
        <h1 className="text-3xl font-bold">Recording Playback</h1>
        <p className="text-white/70 text-sm mt-1">Your thoughts — on record and remixable.</p>
      </div>

      {/* 🎥 Asset */}
      <div className="max-w-3xl mx-auto">
        {isVideo ? (
          <video
            controls
            src={assetUrl}
            className="w-full rounded-xl shadow-xl border border-yellow-400"
          />
        ) : (
          <audio
            controls
            src={assetUrl}
            className="w-full border border-yellow-400 rounded-xl"
          />
        )}
      </div>

      {/* 📄 Transcript */}
      {recording?.transcript && (
        <div className="max-w-3xl mx-auto bg-white/5 p-5 border border-white/10 rounded-xl space-y-3">
          <h2 className="text-lg font-semibold text-yellow-300">Transcript</h2>
          <p className="text-white/80 whitespace-pre-wrap leading-relaxed">
            {recording.transcript}
          </p>
        </div>
      )}

      {/* 🤖 Ask AiLi */}
      <div className="max-w-3xl mx-auto space-y-4">
        <button
          onClick={askAiLi}
          className="flex items-center gap-2 bg-white/10 border border-white/20 px-5 py-2 rounded-full hover:bg-white/20 transition text-white"
        >
          <Sparkles className="animate-pulse" size={16} /> Ask AiLi about this
        </button>

        {chat && (
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl whitespace-pre-wrap text-white/80">
            {chat}
          </div>
        )}
      </div>
    </main>
  );
}
