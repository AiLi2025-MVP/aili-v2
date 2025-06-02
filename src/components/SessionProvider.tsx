// src/components/SessionProvider.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const init = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');

      // ✅ DO NOT pass code/state — Supabase parses URL internally
      if (code && state && !localStorage.getItem('code_exchanged')) {
        const { error } = await supabase.auth.exchangeCodeForSession(); // ✅ correct usage

        if (error) {
          console.error('OAuth exchange error:', error.message);
        } else {
          console.log('✅ Session exchanged via PKCE');
          localStorage.setItem('code_exchanged', 'true');
        }

        router.replace(url.pathname);
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) await supabase.auth.refreshSession();

      setHydrated(true);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('code_exchanged');
      }
      if (session) {
        console.log('🔐 Session updated:', session.user.email);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  if (!hydrated) return <div className="text-white p-6">Initializing session...</div>;

  return <>{children}</>;
}
