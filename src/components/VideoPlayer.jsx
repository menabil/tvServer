import { useRef } from "react";
import { AlertTriangle, Settings2 } from "lucide-react";
import useHls from "../hooks/useHls";

export default function VideoPlayer({ channel }) {
  const videoRef = useRef(null);
  const { levels, currentLevel, changeLevel, error } = useHls(videoRef, channel);

  const qualityOptions = [...levels.keys()]
    .map((i) => ({ index: i, height: levels[i].height }))
    .sort((a, b) => b.height - a.height);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-black shadow-sm">
      <video
        ref={videoRef}
        controls
        muted
        playsInline
        className="h-full w-full object-contain"
      />

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/90 px-6 text-center text-sm text-zinc-300">
          <AlertTriangle className="text-[var(--accent)]" size={28} />
          <p className="max-w-xs">{error}</p>
        </div>
      )}

      {!error && qualityOptions.length > 1 && (
        <label className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/60 px-2 py-1.5 text-xs font-medium text-white backdrop-blur">
          <Settings2 size={14} className="text-white/70" />
          <select
            value={currentLevel}
            onChange={(e) => changeLevel(Number(e.target.value))}
            className="bg-transparent text-xs focus:outline-none [&>option]:text-black"
          >
            <option value={-1}>Auto</option>
            {qualityOptions.map((opt) => (
              <option key={opt.index} value={opt.index}>
                {opt.height}p
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}
