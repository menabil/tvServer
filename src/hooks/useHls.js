import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

// Loads a channel into a <video> element via hls.js, exposes the available
// quality levels (for the resolution switcher) and a friendly error message
// for streams the player can't handle (e.g. DASH/DRM playlists).
export default function useHls(videoRef, channel) {
  const hlsRef = useRef(null);
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(-1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    setLevels([]);
    setCurrentLevel(-1);
    setError(null);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    if (!video) return;

    if (!channel?.url) {
      video.removeAttribute("src");
      return;
    }

    const isDash = channel.type === "dash" || channel.url.endsWith(".mpd");
    if (isDash) {
      setError(
        "This channel streams in DASH/DRM format, which this player doesn't support yet."
      );
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 10,
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;
      hls.loadSource(channel.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_evt, data) => {
        setLevels(data.levels ?? []);
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_evt, data) => {
        if (!data.fatal) return;
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError();
            break;
          default:
            setError("This channel couldn't be loaded right now.");
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = channel.url;
      const onReady = () => video.play().catch(() => {});
      video.addEventListener("loadedmetadata", onReady);
      return () => video.removeEventListener("loadedmetadata", onReady);
    } else {
      setError("HLS playback isn't supported in this browser.");
    }

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [channel, videoRef]);

  const changeLevel = (index) => {
    if (!hlsRef.current) return;
    hlsRef.current.currentLevel = index;
    setCurrentLevel(index);
  };

  return { levels, currentLevel, changeLevel, error };
}
