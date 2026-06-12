import { useState } from "react";
import { Tv } from "lucide-react";

export default function ChannelCard({ channel, active, onSelect }) {
  const [status, setStatus] = useState(channel.logo ? "loading" : "broken");

  return (
    <button
      onClick={onSelect}
      className={`group flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-colors duration-200 ${
        active
          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/40"
      }`}
    >
      <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-lg bg-[var(--surface-2)]">
        {status === "loading" && <span className="skeleton absolute inset-0" />}
        {status !== "broken" && channel.logo && (
          <img
            src={channel.logo}
            alt=""
            loading="lazy"
            decoding="async"
            className={`h-full w-full object-contain p-1 transition-opacity duration-300 ${
              status === "loaded" ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("broken")}
          />
        )}
        {status === "broken" && <Tv size={20} className="text-[var(--text-muted)]" />}
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
