//app/profile/stats/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function StatsProfilePage() {
  const [chatData, setChatData] = useState<any[]>([]);
  const [recordingData, setRecordingData] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fields = ['persona', 'creator_style', 'learning_style', 'goal'];

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load profile
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(prof);

      // Load stats
      const { data: chats } = await supabase
        .from('chat_logs')
        .select('created_at')
        .eq('user_id', user.id);

      const { data: recordings } = await supabase
        .from('recordings')
        .select('created_at, transcript')
        .eq('user_id', user.id);

      setChatData(chats || []);
      setRecordingData(recordings || []);
      setLoading(false);
    };

    load();
  }, []);

  const groupByDay = (entries: any[], field = 'created_at') => {
    const map: Record<string, number> = {};
    for (const entry of entries) {
      const day = new Date(entry[field]).toLocaleDateString();
      map[day] = (map[day] || 0) + 1;
    }
    return map;
  };

  const estimateDuration = (text: string) => {
    const words = text?.split(/\s+/).length || 0;
    return words > 0 ? Math.round(words / 2.5) : 0;
  };

  const groupedChats = groupByDay(chatData);
  const groupedDurations = groupByDay(
    recordingData.map(r => ({
      created_at: r.created_at,
      duration: estimateDuration(r.transcript),
    })),
    'created_at'
  );

  const chatChart = {
    labels: Object.keys(groupedChats),
    datasets: [{
      label: 'Chats per Day',
      data: Object.values(groupedChats),
      backgroundColor: 'rgba(147, 197, 253, 0.6)',
    }],
  };

  const recordingChart = {
    labels: Object.keys(groupedDurations),
    datasets: [{
      label: 'Recording Duration (min)',
      data: Object.values(groupedDurations),
      borderColor: 'rgba(255, 206, 86, 1)',
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
    }],
  };

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id);

    if (!error) {
      setEditing(false);
    } else {
      alert('❌ Failed to update profile.');
    }
  };

  if (loading) return <p className="text-white p-6">Loading profile & stats...</p>;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 max-w-5xl mx-auto space-y-16">
      <h1 className="text-3xl font-bold text-center">📊 My AiLi Profile</h1>

      {/* STATS */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Chat Frequency</h2>
        <Bar data={chatChart} options={{ responsive: true }} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Recording Durations</h2>
        <Line data={recordingChart} options={{ responsive: true }} />
      </section>

      {/* PROFILE VIEW */}
      {!editing && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">🧬 AiLi DNA</h2>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-2">
            {fields.map((f) => (
              <p key={f}>
                <strong className="capitalize">{f.replace('_', ' ')}:</strong>{' '}
                {profile[f] || '—'}
              </p>
            ))}
          </div>
          <button
            onClick={() => setEditing(true)}
            className="mt-4 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full transition"
          >
            Edit Profile
          </button>
        </section>
      )}

      {/* PROFILE EDIT */}
      {editing && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">✍️ Edit Profile</h2>
          {fields.map((f) => (
            <div key={f}>
              <label className="block text-sm text-white/70 mb-1 capitalize">{f.replace('_', ' ')}</label>
              <input
                type="text"
                value={profile[f] || ''}
                onChange={(e) => setProfile({ ...profile, [f]: e.target.value })}
                className="w-full p-3 bg-white/5 border border-white/10 rounded text-white placeholder-white/40"
              />
            </div>
          ))}
          <button
            onClick={handleSave}
            className="mt-4 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full transition"
          >
            Save Profile
          </button>
        </section>
      )}
    </main>
  );
}
