import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Check, Loader2, MoreVertical, PlayCircle } from "lucide-react";
import usePlayer from "../hooks/usePlayer";

export default function VideoPlayer({ channel }) {
  const videoRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const { qualities, activeQuality, selectQuality, loading, error } = usePlayer(
    videoRef,
    channel
  );

  // Close the quality menu whenever the channel changes.
  useEffect(() => setShowMenu(false), [channel]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-black shadow-lg">
      <video
        ref={videoRef}
        controls
        muted
        playsInline
        preload="none"
        className="h-full w-full object-contain"
      />

      {!channel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-sm text-zinc-400">
          <PlayCircle className="text-[var(--accent)]" size={32} />
          <p>Select a channel to start watching</p>
        </div>
      )}

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
        <div className="absolute bottom-3 right-3">
          <button
            onClick={() => setShowMenu((s) => !s)}
            aria-label="Video quality options"
            className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80"
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <div className="absolute bottom-10 right-0 min-w-32 overflow-hidden rounded-xl border border-white/10 bg-black/80 py-1 text-sm text-white backdrop-blur">
              <p className="px-3 pb-1 pt-1 text-[10px] font-bold uppercase tracking-widest text-white/50">
                Quality
              </p>
              <button
                onClick={() => {
                  selectQuality("auto");
                  setShowMenu(false);
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 hover:bg-white/10"
              >
                Auto
                {activeQuality === "auto" && <Check size={14} />}
              </button>
              {qualities.map((h) => (
                <button
                  key={h}
                  onClick={() => {
                    selectQuality(h);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center justify-between px-3 py-1.5 hover:bg-white/10"
                >
                  {h}p
                  {activeQuality === h && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
