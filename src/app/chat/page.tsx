// app/chat/page.tsx
import { Suspense } from 'react';
import ChatClient from './ChatClient';

export const dynamic = 'force-dynamic';

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-6 text-white">Loading AiLi chat...</div>}>
      <ChatClient />
    </Suspense>
  );
}
