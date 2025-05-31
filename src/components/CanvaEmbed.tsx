// src/components/CanvaEmbed.tsx

export default function CanvaEmbed({ url }: { url: string }) {
    if (!url) return null;
  
    return (
      <div className="mt-6">
        <iframe
          src={url}
          width="100%"
          height="600"
          className="rounded-xl border border-white/10 shadow"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    );
  }
  