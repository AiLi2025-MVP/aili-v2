//src/components/ui/ProfileSummaryCard.tsx

'use client';

export default function ProfileSummaryCard({ profile }: { profile: string }) {
  if (!profile) return null;

  const taglineMatch = profile.match(/Tagline:\s*"([^"]+)"/);
  const tagline = taglineMatch ? taglineMatch[1] : '';

  const traitsMatch = profile.match(/Personality Traits:\s*([\s\S]*?)Founder Archetype:/);
  const traitsList = traitsMatch
    ? traitsMatch[1]
        .trim()
        .split(/\d+\.\s+/)
        .filter(Boolean)
    : [];

  const archetypeMatch = profile.match(/Founder Archetype:\s*(.*?)\s*Creative Motto:/);
  const archetype = archetypeMatch ? archetypeMatch[1] : '';

  const mottoMatch = profile.match(/Creative Motto:\s*"([^"]+)"/);
  const motto = mottoMatch ? mottoMatch[1] : '';

  return (
    <section className="grid md:grid-cols-2 gap-4">
      <div className="bg-white/10 rounded-2xl p-4 border border-white/20 space-y-2">
        <h2 className="text-lg font-semibold text-yellow-300">Tagline</h2>
        <p className="text-white/90">{tagline || '—'}</p>
      </div>

      <div className="bg-white/10 rounded-2xl p-4 border border-white/20 space-y-2">
        <h2 className="text-lg font-semibold text-yellow-300">Personality Traits</h2>
        <ul className="text-white/90 list-disc list-inside space-y-1">
          {traitsList.map((trait, idx) => (
            <li key={idx}>{trait}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white/10 rounded-2xl p-4 border border-white/20 space-y-2 col-span-2">
        <h2 className="text-lg font-semibold text-yellow-300">Founder Archetype</h2>
        <p className="text-white/90">{archetype || '—'}</p>
      </div>

      <div className="bg-white/10 rounded-2xl p-4 border border-white/20 space-y-2 col-span-2">
        <h2 className="text-lg font-semibold text-yellow-300">Creative Motto</h2>
        <p className="text-white/90">{motto || '—'}</p>
      </div>
    </section>
  );
}
