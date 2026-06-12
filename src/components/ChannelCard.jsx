import { useState } from "react";
import { Tv } from "lucide-react";

export default function ChannelCard({ channel, active, onSelect }) {
  const [broken, setBroken] = useState(false);

  return (
    <button
      onClick={onSelect}
      className={`group flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-colors ${
        active
          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/40"
      }`}
    >
      <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-lg bg-[var(--surface-2)]">
        {!broken && channel.logo ? (
          <img
            src={channel.logo}
            alt=""
            loading="lazy"
            className="h-full w-full object-contain p-1"
            onError={() => setBroken(true)}
          />
        ) : (
          <Tv size={20} className="text-[var(--text-muted)]" />
        )}
        {active && (
          <span className="live-dot absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
        )}
      </span>
      <span className="line-clamp-2 text-xs font-medium leading-tight text-[var(--text)]">
        {channel.name}
      </span>
    </button>
  );
}
