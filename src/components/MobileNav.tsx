// src/components/MobileNav.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  PlayCircle,
  Video,
  MessageSquareText,
  Sparkles,
  BarChart,
  Users,
  BookOpen,
} from 'lucide-react';

const nav = [
  { href: '/dashboard', label: 'Home', icon: <Home size={22} /> },
  { href: '/syllabus', label: 'Syllabus', icon: <BookOpen size={22} /> },
  { href: '/vault', label: 'Chat', icon: <MessageSquareText size={22} /> },
  { href: '/console', label: 'ATM', icon: <Sparkles size={22} /> },
  { href: '/stream', label: 'Live', icon: <PlayCircle size={22} /> },
  //{ href: '/profile/stats', label: 'Stats', icon: <BarChart size={22} /> },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-black border-t border-gray-800 flex justify-around items-center h-14 z-50">
      {nav.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex flex-col items-center text-xs ${
            pathname === href ? 'text-white font-bold' : 'text-gray-500'
          }`}
        >
          {icon}
          <span className="mt-1">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
