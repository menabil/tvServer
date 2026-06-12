import { useRef } from "react";
import { AlertTriangle, Loader2, Settings2 } from "lucide-react";
import usePlayer from "../hooks/usePlayer";

export default function VideoPlayer({ channel }) {
  const videoRef = useRef(null);
  const { qualities, activeQuality, selectQuality, loading, error } = usePlayer(
    videoRef,
    channel,
  );

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-black shadow-lg">
      <video
        ref={videoRef}
        controls
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-contain"
      />

      {loading && !error && (
        <div className="absolute inset-0 grid place-items-center bg-black/50">
          <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/90 px-6 text-center text-sm text-zinc-300">
          <AlertTriangle className="text-[var(--accent)]" size={28} />
          <p className="max-w-xs">{error}</p>
        </div>
      )}

      {!error && qualities.length > 1 && (
        <label className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/60 px-2 py-1.5 text-xs font-medium text-white backdrop-blur">
          <Settings2 size={14} className="text-white/70" />
          <select
            value={activeQuality}
            onChange={(e) =>
              selectQuality(
                e.target.value === "auto" ? "auto" : Number(e.target.value),
              )
            }
            className="bg-transparent text-xs focus:outline-none [&>option]:text-black"
          >
            <option value="auto">Auto</option>
            {qualities.map((h) => (
              <option key={h} value={h}>
                {h}p
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}
