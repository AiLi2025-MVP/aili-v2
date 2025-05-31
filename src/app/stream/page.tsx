// src/app/stream/page.tsx

'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function StreamPage() {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const hasUploaded = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getMedia = async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    };
    getMedia();
  }, []);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const startCountdown = () => {
    setCountdown(3);
    let tick = 3;
    const interval = setInterval(() => {
      tick -= 1;
      setCountdown(tick);
      if (tick === 0) {
        clearInterval(interval);
        startRecording();
      }
    }, 1000);
  };

  const startRecording = () => {
    if (!stream) return;
    recordedChunks.current = [];
    hasUploaded.current = false;

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm; codecs=vp9,opus',
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      if (hasUploaded.current) return;
      hasUploaded.current = true;

      const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
      const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const file = new File([blob], `recording-${uniqueId}.webm`, {
        type: 'video/webm',
      });

      await uploadRecording(file);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const uploadRecording = async (file: File) => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const path = `${user.id}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('recordings')
      .upload(path, file);

    if (uploadError) {
      console.error('Upload error:', uploadError.message);
      return;
    }

    const { error: insertError } = await supabase.from('recordings').insert({
      user_id: user.id,
      path,
      transcript: null,
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error('DB insert error:', insertError.message);
    }

    await new Promise((res) => setTimeout(res, 1500)); // allow Supabase storage sync

    await fetch('/api/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assetId: path, userId: user.id }),
    });

    router.push('/recordings');
  };

  return (
    <main className="relative min-h-screen bg-transparent text-white px-6 py-16 space-y-6 overflow-hidden">
      {/* 🎥 Background */}
      <div className="fixed inset-0 -z-10">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/videos/live_stream.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* 📍 Header Block */}
      <div className="relative z-10 max-w-xl mx-auto text-center space-y-4 backdrop-blur-md bg-white/10 border border-white/20 px-6 py-6 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold">Record Your Vision</h1>
        <p className="text-white/70">AiLi is listening. Record freely. She’ll pull out the gold.</p>
      </div>

      {/* 🔴 Record Button */}
      <div className="flex justify-center">
        <button
          onClick={recording ? stopRecording : startCountdown}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-full shadow transition"
        >
          {recording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>

      {/* 🎛️ Live Video Preview */}
      <div
        className={`relative w-full max-w-xl mx-auto aspect-video overflow-hidden rounded-xl shadow-xl transition-all duration-300 ${
          recording ? 'border-4 border-yellow-400 animate-pulse' : 'border border-white/10'
        }`}
      >
        <video
          ref={videoRef}
          autoPlay
          muted={!recording}
          playsInline
          className="w-full h-full object-cover"
        />
        {!recording && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-semibold">
            {countdown > 0 ? `Recording in ${countdown}...` : 'Live Stream is Ready'}
          </div>
        )}
      </div>

      {/* 📡 Broadcasting Toggle */}
      <div className="text-center pt-4">
        <p className="text-sm uppercase text-white/60 tracking-wide">Broadcasting To</p>
        <div className="flex justify-center gap-6 mt-2">
          {['ig', 'tiktok', 'x'].map((platform) => (
            <button
              key={platform}
              onClick={() => togglePlatform(platform)}
              className={`w-14 h-14 overflow-hidden border-2 rounded-xl transition ${
                selectedPlatforms.includes(platform)
                  ? 'border-yellow-400 bg-yellow-500/10'
                  : 'border-white/20 bg-white/10 hover:bg-white/20'
              }`}
            >
              <img
                src={`/logos/${platform}.png`}
                alt={platform}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* ⏳ Uploading Feedback */}
      {loading && (
        <div className="flex items-center gap-2 justify-center animate-pulse text-white/60">
          <Sparkles className="animate-spin" /> Uploading & transcribing...
        </div>
      )}

      {/* 🎬 View Recordings Button */}
      <div className="fixed bottom-20 right-6 z-30">
        <Link
          href="/recordings"
          className="text-sm font-semibold px-5 py-2 rounded-full border border-yellow-400 text-yellow-300 bg-white/5 backdrop-blur hover:bg-yellow-500 hover:text-black transition shadow-md"
        >
          View My Recordings →
        </Link>
      </div>
    </main>
  );
}
