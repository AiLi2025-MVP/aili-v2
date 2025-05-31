//src/components/GoogleLoginButton.tsx

'use client';

import { supabase } from '@/lib/supabaseClient';

export default function GoogleLoginButton() {
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/dashboard`

      },
    });

    if (error) {
      console.error('Google login error:', error.message);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      className="bg-white text-black font-semibold px-4 py-2 rounded-lg"
    >
      Sign in with Google
    </button>
  );
}
