import { useEffect, useRef, useState } from "react";
import shaka from "shaka-player/dist/shaka-player.compiled.js";

let polyfilled = false;

// Shaka Player can play both HLS (.m3u8) and DASH (.mpd), including
// ClearKey-encrypted DASH streams (kid/key from the channel entry).
// This hook handles loading, quality (resolution) switching and error/
// loading states for the player.
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
    setQualities([]);
    setActiveQuality("auto");
    setError(null);
    setLoading(false);

    if (!video || !channel?.url) return;

    if (!shaka.Player.isBrowserSupported()) {
      setError("This browser can't play live video.");
      return;
    }

    const player = new shaka.Player(video);
    playerRef.current = player;

    player.addEventListener("error", (event) => {
      console.error("Player error", event.detail);
      setLoading(false);
      setError("This channel couldn't be loaded right now.");
    });

    if (channel.kid && channel.key) {
      player.configure({
        drm: { clearKeys: { [channel.kid]: channel.key } },
      });
    }

    setLoading(true);
    player
      .load(channel.url)
      .then(() => {
        setLoading(false);
        video.play().catch(() => {});
        const heights = [
          ...new Set(
            player
              .getVariantTracks()
              .map((t) => t.height)
              .filter(Boolean),
          ),
        ].sort((a, b) => b - a);
        setQualities(heights);
      })
      .catch((err) => {
        console.error("Load error", err);
        setLoading(false);
        setError("This channel couldn't be loaded right now.");
      });

    return () => {
      player.destroy().catch(() => {});
      playerRef.current = null;
    };
  }, [channel, videoRef]);

  const selectQuality = (height) => {
    const player = playerRef.current;
    if (!player) return;

    if (height === "auto") {
      player.configure({ abr: { enabled: true } });
      setActiveQuality("auto");
      return;
    }

    player.configure({ abr: { enabled: false } });
    const track = player
      .getVariantTracks()
      .filter((t) => t.height === height)
      .sort((a, b) => b.bandwidth - a.bandwidth)[0];

    if (track) {
      player.selectVariantTrack(track, true);
      setActiveQuality(height);
    }
  };

  return { qualities, activeQuality, selectQuality, loading, error };
}
