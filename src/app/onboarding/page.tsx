//src/app/onboarding/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

const GOAL_OPTIONS = ['Create Content', 'Grow My Brand', 'Monetize My IP'];
const LEARN_OPTIONS = ['Reading + Writing', 'Watching + Visuals', 'AiLi Chat'];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  const [vibe, setVibe] = useState('pharrell');
  const [persona, setPersona] = useState('');
  const [creatorStyle, setCreatorStyle] = useState('');
  const [goal, setGoal] = useState('');
  const [learning, setLearning] = useState('');

  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);

        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_complete')
          .eq('id', user.id)
          .single();

        if (profile?.onboarding_complete) {
          router.push('/dashboard'); // prevent access if already complete
        }
      }
    };

    init();
  }, [router]);

  const avatars = ['pharrell', 'virgil', 'rihanna', 'like-no-other'];

  const handleSubmit = async () => {
    if (!userId) {
      router.push('/dashboard'); // fallback for guests
      return;
    }

    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      persona,
      creator_style: creatorStyle,
      goal,
      learning_style: learning,
      onboarding_complete: true,
    });

    if (!error) {
      router.push('/dashboard');
    } else {
      alert('❌ Failed to save profile');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#631fbd] via-[#e02c96] to-[#ffcb47] text-white px-4 py-16 flex flex-col items-center justify-center">
      <div className="relative max-w-xl w-full p-8 bg-white/10 border border-white/20 rounded-3xl backdrop-blur-md shadow-xl overflow-hidden text-center space-y-8">
        <Image
          src={`/avatars/${vibe}.jpg`}
          alt="Background"
          fill
          className="absolute inset-0 object-cover opacity-20 -z-10"
        />

        {step === 0 && (
          <>
            <h1 className="text-3xl font-bold">Who do you most vibe with?</h1>
            <div className="grid grid-cols-2 gap-4">
              {avatars.map((name) => (
                <button
                  key={name}
                  onClick={() => {
                    setVibe(name);
                    setStep(1);
                  }}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl overflow-hidden transition"
                >
                  <Image
                    src={`/avatars/${name}.jpg`}
                    alt={name}
                    width={500}
                    height={300}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-white text-lg capitalize">
                      {name.replace(/-/g, ' ')}
                    </h3>
                    <p className="text-sm text-white/70">
                      {name === 'pharrell' && 'Cultural Architect'}
                      {name === 'virgil' && 'Disruptive Minimalist'}
                      {name === 'rihanna' && 'Bold Brand Alchemist'}
                      {name === 'like-no-other' && 'Your Own Lane'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold">Founder DNA</h2>
            <input
              type="text"
              placeholder="Your persona (e.g. Visionary Builder)"
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              className="w-full p-3 mb-4 rounded bg-white/10 border border-white/20 text-white"
            />
            <input
              type="text"
              placeholder="Your creator style (e.g. Cultural Architect)"
              value={creatorStyle}
              onChange={(e) => setCreatorStyle(e.target.value)}
              className="w-full p-3 rounded bg-white/10 border border-white/20 text-white"
            />
            <button
              onClick={() => setStep(2)}
              disabled={!persona || !creatorStyle}
              className="mt-4 w-full py-3 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold transition disabled:opacity-30"
            >
              Next →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-4">What’s your #1 focus right now?</h2>
            <div className="space-y-3">
              {GOAL_OPTIONS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`w-full py-3 rounded-full font-medium border transition ${
                    goal === g
                      ? 'bg-yellow-400 text-black border-yellow-400'
                      : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(3)}
              disabled={!goal}
              className="mt-6 w-full py-3 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold transition disabled:opacity-30"
            >
              Next →
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-4">How do you learn best?</h2>
            <div className="space-y-3">
              {LEARN_OPTIONS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLearning(l)}
                  className={`w-full py-3 rounded-full font-medium border transition ${
                    learning === l
                      ? 'bg-yellow-400 text-black border-yellow-400'
                      : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!learning}
              className="mt-6 w-full py-3 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold transition disabled:opacity-30"
            >
              Launch AiLi Dashboard
            </button>
          </>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xl mt-6">
        <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/80 rounded-full transition-all"
            style={{ width: `${((step + 1) / 4) * 100}%` }}
          />
        </div>
        <p className="text-xs mt-2 text-white/60 text-center">Step {step + 1} of 4</p>
      </div>
    </main>
  );
}
