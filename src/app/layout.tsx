// src/app/layout.tsx

'use client';

import './globals.css';
import SessionProvider from '@/components/SessionProvider';
import MobileNav from '@/components/MobileNav';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  return null;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ScrollReset />
          {children}
          <MobileNav />
        </SessionProvider>
      </body>
    </html>
  );
}
