//src/components/ui/FigureCard.tsx

'use client';

import Image from 'next/image';

interface FigureCardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  href?: string;
  className?: string;
}

export default function FigureCard({
  title,
  subtitle,
  icon = '/aili-logo.svg',
  href = '#',
  className,
}: FigureCardProps) {
  return (
    <a
      href={href}
      className={`group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all shadow-md text-white space-y-2 ${className}`}
    >
      <div className="flex items-center gap-4">
        <Image
          src={icon}
          alt={title}
          width={48}
          height={48}
          className="bg-white/10 p-2 rounded-xl border border-white/10"
        />
        <h3 className="text-lg font-semibold leading-tight group-hover:text-white">
          {title}
        </h3>
      </div>
      {subtitle && <p className="text-sm text-white/60">{subtitle}</p>}
    </a>
  );
}
