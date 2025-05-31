//src/app/page.tsx

'use client';
import GoogleLoginButton from '@/components/GoogleLoginButton';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <h1 className="text-4xl font-bold">👋 Welcome to AiLi</h1>
        <p className="text-white/70">Your AI-powered startup ally</p>
        <GoogleLoginButton />
      </div>
    </main>
  );
}
