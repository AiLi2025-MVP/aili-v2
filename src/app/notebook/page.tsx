//src/app/notebook/page.tsx

// src/app/notebook/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface Log {
  id: number;
  prompt: string;
  tone: string | null;
  asset_id: string | null;
  created_at: string;
}

export default function NotebookPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('🔒 Could not fetch user for notebook:', userError?.message);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('chat_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('📓 Error fetching chat_logs:', error.message);
      } else {
        setLogs(data);
      }

      setLoading(false);
    };

    loadLogs();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 space-y-10">
      <h1 className="text-4xl font-bold text-center">📓 AiLi Notebook</h1>
      <p className="text-white/60 text-center max-w-2xl mx-auto">
        A log of your creative sparks, questions, and conversations with AiLi.
      </p>

      {loading ? (
        <p className="text-center text-white/50">Loading your notebook...</p>
      ) : logs.length === 0 ? (
        <p className="text-center text-white/50">
          No chats saved yet. Start exploring ideas with AiLi!
        </p>
      ) : (
        <ul className="space-y-4 max-w-3xl mx-auto">
          {logs.map((log) => (
            <li
              key={log.id}
              className="border border-white/10 bg-white/5 p-4 rounded-xl shadow backdrop-blur"
            >
              <div className="text-sm text-white/50">
                {new Date(log.created_at).toLocaleString()}
              </div>
              <div className="text-white text-base mt-1 whitespace-pre-wrap">
                {log.prompt}
              </div>
              {log.tone && (
                <div className="text-xs text-yellow-400 mt-1">
                  Tone: {log.tone}
                </div>
              )}
              {log.asset_id && (
                <Link
                  href={`/chat?assetId=${encodeURIComponent(log.asset_id)}`}
                  className="inline-block text-sm mt-2 text-blue-400 hover:underline"
                >
                  💬 Revisit this thread →
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
