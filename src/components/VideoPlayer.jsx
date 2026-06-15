// import { useEffect, useRef, useState } from "react";
// import {
//   AlertTriangle,
//   Maximize,
//   Minimize,
//   Pause,
//   PictureInPicture2,
//   Play,
//   PlayCircle,
//   Settings,
//   Volume1,
//   Volume2,
//   VolumeX,
// } from "lucide-react";
// import usePlayer from "../hooks/usePlayer";

// export default function VideoPlayer({ channel }) {
//   const containerRef = useRef(null);
//   const videoRef = useRef(null);

//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMuted, setIsMuted] = useState(true);
//   const [volume, setVolume] = useState(1);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [showQualityMenu, setShowQualityMenu] = useState(false);

//   const { qualities, activeQuality, selectQuality, error } = usePlayer(
//     videoRef,
//     channel,
//   );

//   // Reset menu and play/pause state whenever the channel changes.
//   useEffect(() => {
//     setShowQualityMenu(false);
//     setIsPlaying(false);
//   }, [channel]);

//   // Keep the UI in sync with the underlying <video> element.
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     const onPlay = () => setIsPlaying(true);
//     const onPause = () => setIsPlaying(false);
//     const onVolume = () => {
//       setIsMuted(video.muted || video.volume === 0);
//       setVolume(video.volume);
//     };

//     video.addEventListener("play", onPlay);
//     video.addEventListener("pause", onPause);
//     video.addEventListener("volumechange", onVolume);
//     return () => {
//       video.removeEventListener("play", onPlay);
//       video.removeEventListener("pause", onPause);
//       video.removeEventListener("volumechange", onVolume);
//     };
//   }, []);

//   // Track fullscreen state.
//   useEffect(() => {
//     const onChange = () =>
//       setIsFullscreen(document.fullscreenElement === containerRef.current);
//     document.addEventListener("fullscreenchange", onChange);
//     return () => document.removeEventListener("fullscreenchange", onChange);
//   }, []);

//   const togglePlay = () => {
//     const video = videoRef.current;
//     if (!video) return;
//     if (video.paused) video.play().catch(() => {});
//     else video.pause();
//   };

//   const toggleMute = () => {
//     const video = videoRef.current;
//     if (!video) return;
//     video.muted = !video.muted;
//     if (!video.muted && video.volume === 0) {
//       video.volume = 1;
//     }
//   };

//   const handleVolume = (e) => {
//     const video = videoRef.current;
//     if (!video) return;
//     const value = Number(e.target.value);
//     video.volume = value;
//     video.muted = value === 0;
//   };

//   const toggleFullscreen = () => {
//     const el = containerRef.current;
//     if (!el) return;
//     if (document.fullscreenElement) document.exitFullscreen();
//     else el.requestFullscreen?.();
//   };

//   const togglePip = async () => {
//     const video = videoRef.current;
//     if (!video) return;
//     try {
//       if (document.pictureInPictureElement) {
//         await document.exitPictureInPicture();
//       } else if (document.pictureInPictureEnabled) {
//         await video.requestPictureInPicture();
//       }
//     } catch {
//       // Picture-in-picture isn't available for this stream — ignore.
//     }
//   };

//   const VolumeIcon =
//     isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

//   return (
//     <div
//       ref={containerRef}
//       className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-black shadow-lg"
//     >
//       <video
//         ref={videoRef}
//         playsInline
//         muted
//         preload="none"
//         onClick={togglePlay}
//         className="h-full w-full cursor-pointer object-contain"
//       />

//       {!channel && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-sm text-zinc-400">
//           <PlayCircle className="text-[var(--accent)]" size={32} />
//           <p>Select a channel to start watching</p>
//         </div>
//       )}

//       {error && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/90 px-6 text-center text-sm text-zinc-300">
//           <AlertTriangle className="text-[var(--accent)]" size={28} />
//           <p className="max-w-xs">{error}</p>
//         </div>
//       )}

//       {channel && !error && !isPlaying && (
//         <button
//           onClick={togglePlay}
//           aria-label="Play"
//           className="absolute inset-0 grid place-items-center bg-black/20 transition-colors hover:bg-black/30"
//         >
//           <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-black shadow-lg">
//             <Play size={26} fill="currentColor" />
//           </span>
//         </button>
//       )}

//       {channel && !error && (
//         <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
//           <span className="live-dot h-1.5 w-1.5 rounded-full bg-red-500" />
//           Live
//         </span>
//       )}

//       {/* Custom control bar */}
//       {channel && !error && (
//         <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
//           <button
//             onClick={togglePlay}
//             aria-label={isPlaying ? "Pause" : "Play"}
//             className="grid h-8 w-8 place-items-center rounded-full text-white transition-colors hover:bg-white/15"
//           >
//             {isPlaying ? <Pause size={16} /> : <Play size={16} />}
//           </button>

//           <button
//             onClick={toggleMute}
//             aria-label={isMuted ? "Unmute" : "Mute"}
//             className="grid h-8 w-8 place-items-center rounded-full text-white transition-colors hover:bg-white/15"
//           >
//             <VolumeIcon size={16} />
//           </button>

//           <input
//             type="range"
//             min="0"
//             max="1"
//             step="0.05"
//             value={isMuted ? 0 : volume}
//             onChange={handleVolume}
//             className="h-1 w-16 accent-[var(--accent)] sm:w-24"
//             aria-label="Volume"
//           />

//           <div className="ml-auto flex items-center gap-1">
//             {qualities.length > 1 && (
//               <div className="relative">
//                 <button
//                   onClick={() => setShowQualityMenu((s) => !s)}
//                   aria-label="Quality settings"
//                   className="grid h-8 w-8 place-items-center rounded-full text-white transition-colors hover:bg-white/15"
//                 >
//                   <Settings size={15} />
//                 </button>

//                 {showQualityMenu && (
//                   <div className="absolute bottom-10 right-0 min-w-32 overflow-hidden rounded-xl border border-white/10 bg-black/85 py-1 text-sm text-white backdrop-blur">
//                     <p className="px-3 pb-1 pt-1 text-[10px] font-bold uppercase tracking-widest text-white/50">
//                       Quality
//                     </p>
//                     <button
//                       onClick={() => {
//                         selectQuality("auto");
//                         setShowQualityMenu(false);
//                       }}
//                       className={`flex w-full items-center justify-between px-3 py-1.5 hover:bg-white/10 ${
//                         activeQuality === "auto" ? "text-[var(--accent)]" : ""
//                       }`}
//                     >
//                       Auto
//                     </button>
//                     {qualities.map((h) => (
//                       <button
//                         key={h}
//                         onClick={() => {
//                           selectQuality(h);
//                           setShowQualityMenu(false);
//                         }}
//                         className={`flex w-full items-center justify-between px-3 py-1.5 hover:bg-white/10 ${
//                           activeQuality === h ? "text-[var(--accent)]" : ""
//                         }`}
//                       >
//                         {h}p
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             <button
//               onClick={togglePip}
//               aria-label="Picture in picture"
//               className="grid h-8 w-8 place-items-center rounded-full text-white transition-colors hover:bg-white/15"
//             >
//               <PictureInPicture2 size={15} />
//             </button>

//             <button
//               onClick={toggleFullscreen}
//               aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
//               className="grid h-8 w-8 place-items-center rounded-full text-white transition-colors hover:bg-white/15"
//             >
//               {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import { useEffect, useRef, useState } from "react";
// import {
//   AlertTriangle,
//   Maximize,
//   Minimize,
//   Pause,
//   PictureInPicture2,
//   Play,
//   PlayCircle,
//   Settings,
//   Volume1,
//   Volume2,
//   VolumeX,
// } from "lucide-react";
// import usePlayer from "../hooks/usePlayer";

// export default function VideoPlayer({ channel }) {
//   const containerRef = useRef(null);
//   const videoRef = useRef(null);

//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMuted, setIsMuted] = useState(true);
//   const [volume, setVolume] = useState(1);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [showQualityMenu, setShowQualityMenu] = useState(false);

//   const { qualities, activeQuality, selectQuality, error } = usePlayer(
//     videoRef,
//     channel,
//   );

//   useEffect(() => {
//     setShowQualityMenu(false);
//     setIsPlaying(false);
//   }, [channel]);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     const onPlay = () => setIsPlaying(true);
//     const onPause = () => setIsPlaying(false);
//     const onVolume = () => {
//       setIsMuted(video.muted || video.volume === 0);
//       setVolume(video.volume);
//     };

//     video.addEventListener("play", onPlay);
//     video.addEventListener("pause", onPause);
//     video.addEventListener("volumechange", onVolume);
//     return () => {
//       video.removeEventListener("play", onPlay);
//       video.removeEventListener("pause", onPause);
//       video.removeEventListener("volumechange", onVolume);
//     };
//   }, [channel]); // Fix: channel dependecy add করা হয়েছে

//   useEffect(() => {
//     const onChange = () =>
//       setIsFullscreen(document.fullscreenElement === containerRef.current);
//     document.addEventListener("fullscreenchange", onChange);
//     return () => document.removeEventListener("fullscreenchange", onChange);
//   }, []);

//   const togglePlay = () => {
//     const video = videoRef.current;
//     if (!video) return;
//     if (video.paused) video.play().catch(() => {});
//     else video.pause();
//   };

//   const toggleMute = () => {
//     const video = videoRef.current;
//     if (!video) return;
//     video.muted = !video.muted;
//     if (!video.muted && video.volume === 0) {
//       video.volume = 1;
//     }
//   };

//   const handleVolume = (e) => {
//     const video = videoRef.current;
//     if (!video) return;
//     const value = Number(e.target.value);
//     video.volume = value;
//     video.muted = value === 0;
//   };

//   const toggleFullscreen = () => {
//     const el = containerRef.current;
//     if (!el) return;
//     if (document.fullscreenElement) document.exitFullscreen();
//     else el.requestFullscreen?.();
//   };

//   const togglePip = async () => {
//     const video = videoRef.current;
//     if (!video) return;
//     try {
//       if (document.pictureInPictureElement) {
//         await document.exitPictureInPicture();
//       } else if (document.pictureInPictureEnabled) {
//         await video.requestPictureInPicture();
//       }
//     } catch {
//       // Ignored
//     }
//   };

//   const VolumeIcon =
//     isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

//   return (
//     <div
//       ref={containerRef}
//       className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-black shadow-lg"
//     >
//       <video
//         ref={videoRef}
//         playsInline
//         muted={isMuted} // Fix: State এর সাথে sync করা হয়েছে
//         preload="none"
//         onClick={togglePlay}
//         className="h-full w-full cursor-pointer object-contain"
//       />

//       {!channel && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-sm text-zinc-400">
//           <PlayCircle className="text-[var(--accent)]" size={32} />
//           <p>Select a channel to start watching</p>
//         </div>
//       )}

//       {error && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/90 px-6 text-center text-sm text-zinc-300">
//           <AlertTriangle className="text-[var(--accent)]" size={28} />
//           <p className="max-w-xs">{error}</p>
//         </div>
//       )}

//       {channel && !error && !isPlaying && (
//         <button
//           onClick={togglePlay}
//           aria-label="Play"
//           className="absolute inset-0 grid place-items-center bg-black/20 transition-colors hover:bg-black/30"
//         >
//           <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-black shadow-lg">
//             <Play size={26} fill="currentColor" />
//           </span>
//         </button>
//       )}

//       {channel && !error && (
//         <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
//           <span className="live-dot h-1.5 w-1.5 rounded-full bg-red-500" />
//           Live
//         </span>
//       )}

//       {channel && !error && (
//         <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
//           <button
//             onClick={togglePlay}
//             aria-label={isPlaying ? "Pause" : "Play"}
//             className="grid h-8 w-8 place-items-center rounded-full text-white transition-colors hover:bg-white/15"
//           >
//             {isPlaying ? <Pause size={16} /> : <Play size={16} />}
//           </button>

//           <button
//             onClick={toggleMute}
//             aria-label={isMuted ? "Unmute" : "Mute"}
//             className="grid h-8 w-8 place-items-center rounded-full text-white transition-colors hover:bg-white/15"
//           >
//             <VolumeIcon size={16} />
//           </button>

//           <input
//             type="range"
//             min="0"
//             max="1"
//             step="0.05"
//             value={isMuted ? 0 : volume}
//             onChange={handleVolume}
//             className="h-1 w-16 accent-[var(--accent)] sm:w-24"
//             aria-label="Volume"
//           />

//           <div className="ml-auto flex items-center gap-1">
//             {qualities.length > 1 && (
//               <div className="relative">
//                 <button
//                   onClick={() => setShowQualityMenu((s) => !s)}
//                   aria-label="Quality settings"
//                   className="grid h-8 w-8 place-items-center rounded-full text-white transition-colors hover:bg-white/15"
//                 >
//                   <Settings size={15} />
//                 </button>

//                 {showQualityMenu && (
//                   <div className="absolute bottom-10 right-0 min-w-32 overflow-hidden rounded-xl border border-white/10 bg-black/85 py-1 text-sm text-white backdrop-blur">
//                     <p className="px-3 pb-1 pt-1 text-[10px] font-bold uppercase tracking-widest text-white/50">
//                       Quality
//                     </p>
//                     <button
//                       onClick={() => {
//                         selectQuality("auto");
//                         setShowQualityMenu(false);
//                       }}
//                       className={`flex w-full items-center justify-between px-3 py-1.5 hover:bg-white/10 ${
//                         activeQuality === "auto" ? "text-[var(--accent)]" : ""
//                       }`}
//                     >
//                       Auto
//                     </button>
//                     {qualities.map((h) => (
//                       <button
//                         key={h}
//                         onClick={() => {
//                           selectQuality(h);
//                           setShowQualityMenu(false);
//                         }}
//                         className={`flex w-full items-center justify-between px-3 py-1.5 hover:bg-white/10 ${
//                           activeQuality === h ? "text-[var(--accent)]" : ""
//                         }`}
//                       >
//                         {h}p
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             <button
//               onClick={togglePip}
//               aria-label="Picture in picture"
//               className="grid h-8 w-8 place-items-center rounded-full text-white transition-colors hover:bg-white/15"
//             >
//               <PictureInPicture2 size={15} />
//             </button>

//             <button
//               onClick={toggleFullscreen}
//               aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
//               className="grid h-8 w-8 place-items-center rounded-full text-white transition-colors hover:bg-white/15"
//             >
//               {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useRef, useState, useCallback } from "react";
import {
  AlertTriangle,
  Maximize,
  Minimize,
  Pause,
  PictureInPicture2,
  Play,
  PlayCircle,
  Settings,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import usePlayer from "../hooks/usePlayer";

export default function VideoPlayer({ channel }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const { qualities, activeQuality, selectQuality, error } = usePlayer(
    videoRef,
    channel,
  );

  useEffect(() => {
    setIsPlaying(false);
  }, [channel]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.paused ? video.play() : video.pause();
  }, []);

  const toggleFullscreen = () => {
    !document.fullscreenElement
      ? containerRef.current?.requestFullscreen()
      : document.exitFullscreen();
  };

  return (
    <div
      ref={containerRef}
      className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-black shadow-lg"
    >
      {/* এমবেড লিঙ্ক হলে আইফ্রেম, অন্যথায় ভিডিও */}
      {channel?.url?.includes("embed") ? (
        <iframe src={channel.url} className="h-full w-full" allowFullScreen />
      ) : (
        <video
          ref={videoRef}
          playsInline
          muted={isMuted}
          onClick={togglePlay}
          className="h-full w-full cursor-pointer object-contain"
        />
      )}

      {/* States */}
      {!channel && (
        <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
          <p>Select a channel</p>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 text-red-500">
          {error}
        </div>
      )}

      {/* Controls */}
      {channel && !error && (
        <div className="absolute bottom-0 w-full flex items-center gap-3 p-3 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition">
          <button onClick={togglePlay} className="text-white">
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              videoRef.current.volume = v;
              setIsMuted(v === 0);
            }}
            className="w-20"
          />

          <div className="ml-auto flex gap-3 text-white">
            {qualities.length > 1 && (
              <button onClick={() => setShowQualityMenu(!showQualityMenu)}>
                <Settings size={20} />
              </button>
            )}
            <button onClick={toggleFullscreen}>
              <Maximize size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
