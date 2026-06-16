import { useEffect, useRef, useState, useCallback } from "react";
import shaka from "shaka-player/dist/shaka-player.compiled.js";

let polyfilled = false;

export default function usePlayer(videoRef, channel) {
  const playerRef = useRef(null);
  const [qualities, setQualities] = useState([]);
  const [activeQuality, setActiveQuality] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!polyfilled) {
      shaka.polyfill.installAll();
      polyfilled = true;
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !channel?.url) return;

    setQualities([]);
    setActiveQuality("auto");
    setError(null);
    setLoading(true);

    if (!shaka.Player.isBrowserSupported()) {
      setError("Browser not supported.");
      setLoading(false);
      return;
    }

    const player = new shaka.Player(video);
    playerRef.current = player;

    if (channel.kid && channel.key) {
      player.configure({ drm: { clearKeys: { [channel.kid]: channel.key } } });
    }

    player
      .load(channel.url)
      .then(() => {
        setLoading(false);
        video.play().catch(() => {});
        const tracks = player.getVariantTracks();
        const heights = [
          ...new Set(tracks.map((t) => t.height).filter(Boolean)),
        ].sort((a, b) => b - a);
        setQualities(heights);
      })
      .catch((err) => {
        console.error("Load error", err);
        setLoading(false);
        setError("This channel couldn't be loaded.");
      });

    return () => {
      player.destroy();
      playerRef.current = null;
    };
  }, [channel, videoRef]);

  const selectQuality = useCallback((height) => {
    const player = playerRef.current;
    if (!player) return;

    if (height === "auto") {
      player.configure({ abr: { enabled: true } });
      setActiveQuality("auto");
    } else {
      player.configure({ abr: { enabled: false } });
      const track = player.getVariantTracks().find((t) => t.height === height);
      if (track) {
        player.selectVariantTrack(track, true);
        setActiveQuality(height);
      }
    }
  }, []);

  return { qualities, activeQuality, selectQuality, loading, error };
}
