import { useState, useEffect } from "react";
import { Tv } from "lucide-react";

export default function ChannelCard({ channel, active, onSelect }) {
  const [status, setStatus] = useState(channel?.logo ? "loading" : "broken");

  useEffect(() => {
    setStatus(channel?.logo ? "loading" : "broken");
  }, [channel?.logo]);

  return (
    <button
      onClick={onSelect}
      aria-current={active ? "true" : undefined}
      className={`group relative flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] ${active
          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/40"
        }`}
    >
      {active && (
        <span className="live-dot absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
      )}

      <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-lg bg-[var(--surface-2)]">
        {status === "loading" && (
          <span className="skeleton absolute inset-0 rounded-lg" />
        )}

        {status !== "broken" && channel?.logo && (
          <img
            src={channel?.logo}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className={`relative z-10 h-full w-full object-contain p-1 transition-opacity duration-300 ${status === "loaded" ? "opacity-100" : "opacity-0"
              }`}
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("broken")}
          />
        )}

        {status === "broken" && (
          <Tv size={20} className="text-[var(--text-muted)]" />
        )}
      </span>

      <span className="line-clamp-2 text-xs font-medium leading-tight text-[var(--text)]">
        {channel?.name}
      </span>
    </button>
  );
}
