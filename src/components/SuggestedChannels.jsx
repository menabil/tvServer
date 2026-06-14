import { useMemo, useState } from "react";
import { Shuffle, Tv } from "lucide-react";

const COUNT = 6;

function pickRandom(list, count) {
  if (!list || list.length === 0) return [];
  const pool = [...list];
  const picked = [];
  for (let i = 0; i < count && pool.length; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked;
}

export default function SuggestedChannels({ data, active, onSelect }) {
  const [seed, setSeed] = useState(0);

  const suggestions = useMemo(() => pickRandom(data, COUNT), [data, seed]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
      <div className="flex items-center justify-between px-1 pb-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
          Suggested for you
        </h3>
        <button
          onClick={() => setSeed((s) => s + 1)}
          aria-label="Shuffle suggestions"
          className="grid h-7 w-7 place-items-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--accent)]"
        >
          <Shuffle size={14} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
        {suggestions.length === 0 ? (
          <p className="px-1 text-sm italic text-[var(--text-muted)]">Loading…</p>
        ) : (
          suggestions.map((channel) => (
            <button
              key={channel.id}
              onClick={() => onSelect(channel)}
              className={`flex items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors duration-200 ${
                active?.id === channel.id
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--text)] hover:bg-[var(--surface-2)]"
              }`}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-[var(--surface-2)]">
                {channel.logo ? (
                  <img
                    src={channel.logo}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-contain p-1"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <Tv size={16} className="text-[var(--text-muted)]" />
                )}
              </span>
              <span className="truncate text-sm font-medium">{channel.name}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
