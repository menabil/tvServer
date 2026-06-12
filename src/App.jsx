import React, { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import {
  Search,
  Tv,
  PlayCircle,
  Globe,
  Film,
  Trophy,
  Radio,
} from "lucide-react";

// ৪টি আলাদা JSON ফাইল ইম্পোর্ট
import banglaData from "./data/bangla.json";
import englishData from "./data/channel.json";
import sportsData from "./data/sports.json";
import moviesData from "./data/fifa.json";

const allCategoriesData = {
  Bangla: banglaData,
  English: englishData,
  Sports: sportsData,
  Movies: moviesData,
};

const categories = [
  { name: "Bangla", icon: <Globe size={16} /> },
  { name: "English", icon: <Radio size={16} /> },
  { name: "Sports", icon: <Trophy size={16} /> },
  { name: "Movies", icon: <Film size={16} /> },
];

function App() {
  const [activeCategory, setActiveCategory] = useState("Bangla");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const listContainerRef = useRef(null); // চ্যানেল লিস্টের স্ক্রোল কন্ট্রোল করার জন্য রেফারেন্স

  const currentChannelsData = allCategoriesData[activeCategory] || [];

  // ক্যাটাগরি চেঞ্জ হলে প্রথম চ্যানেল অটো-লোড এবং লিস্ট স্ক্রোল টপ করার পারফেক্ট লজিক
  useEffect(() => {
    if (currentChannelsData.length > 0) {
      setSelectedChannel(currentChannelsData[0]);
    } else {
      setSelectedChannel(null);
    }

    // অন্য ক্যাটাগরিতে গেলে স্ক্রোল পজিশন রিসেট করে একদম উপরে নিয়ে যাবে
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }
  }, [activeCategory]);

  // HLS ভিডিও প্লেয়ার ইঞ্জিন
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (!selectedChannel?.url) {
      video.src = "";
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 8,
        enableWorker: true,
        lowLatencyMode: true,
      });

      hlsRef.current = hls;
      hls.loadSource(selectedChannel.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => console.log("Autoplay blocked:", err));
      });

      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = selectedChannel.url;
      const playVideo = () => {
        video.play().catch((err) => console.log("Autoplay blocked:", err));
      };
      video.addEventListener("loadedmetadata", playVideo);
      return () => video.removeEventListener("loadedmetadata", playVideo);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [selectedChannel]);

  // সার্চ ফিল্টারিং
  const filteredChannels = currentChannelsData.filter((channel) => {
    return channel.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans antialiased selection:bg-blue-600/30">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-900 px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/30">
              <Tv className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white">
              Stream<span className="text-blue-500">TV</span>
            </h1>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80 md:w-96">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              size={16}
            />
            <input
              type="text"
              value={searchQuery}
              placeholder={`Search in ${activeCategory}...`}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </nav>

      {/* MAIN LAYOUT */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: PLAYER SECTION */}
          <div className="lg:col-span-8 space-y-4">
            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    setActiveCategory(cat.name);
                    setSearchQuery(""); // ক্যাটাগরি পরিবর্তন করলে সার্চ ফিল্ড খালি হবে
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs md:text-sm font-bold tracking-wide transition-all duration-150 whitespace-nowrap snap-shrink-0 ${
                    activeCategory === cat.name
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/40"
                  }`}
                >
                  {cat.icon} {cat.name}{" "}
                  <span className="opacity-60 text-xs font-normal">
                    ({allCategoriesData[cat.name]?.length || 0})
                  </span>
                </button>
              ))}
            </div>

            {/* Video Box Wrapper */}
            <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-slate-900 shadow-2xl relative w-full group">
              <video
                ref={videoRef}
                controls
                muted
                className="w-full h-full object-contain"
                playsInline
              />
            </div>

            {/* Video Info Title Card */}
            <div className="bg-slate-900/40 p-4 md:p-5 rounded-2xl border border-slate-900/60 backdrop-blur-sm">
              <span className="inline-block bg-blue-500/10 text-blue-400 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-widest border border-blue-500/10">
                {activeCategory}
              </span>
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 mt-2">
                <PlayCircle className="text-blue-500 flex-shrink-0" size={20} />
                <span className="truncate">
                  {selectedChannel?.name || "No Channel Selected"}
                </span>
              </h2>
            </div>
          </div>

          {/* RIGHT: CHANNEL LIST SECTION */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-slate-900/30 backdrop-blur-sm rounded-2xl border border-slate-900 p-4 h-[55vh] lg:h-[calc(100vh-140px)] flex flex-col">
              {/* Header Title */}
              <h3 className="font-bold text-sm text-slate-400 flex items-center gap-2 border-b border-slate-800/60 pb-3 mb-3 flex-shrink-0">
                <Tv size={16} className="text-blue-500" /> {activeCategory} LIST
              </h3>

              {/* Scrollable Channels Container (ref যুক্ত করা হয়েছে এখানে) */}
              <div
                ref={listContainerRef}
                className="overflow-y-auto flex-1 space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
              >
                {filteredChannels.length > 0 ? (
                  filteredChannels.map((channel) => (
                    <div
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-150 group border ${
                        selectedChannel?.id === channel.id
                          ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/10"
                          : "bg-slate-900/40 border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                      }`}
                    >
                      {/* Logo Wrapper */}
                      <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800/80 flex-shrink-0 overflow-hidden flex items-center justify-center p-1">
                        <img
                          src={channel.logo}
                          alt=""
                          className="w-full h-full object-contain"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/150/0f172a/ffffff?text=TV";
                          }}
                        />
                      </div>

                      {/* Text details */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-semibold text-sm truncate ${selectedChannel?.id === channel.id ? "text-white" : "text-slate-200 group-hover:text-white"}`}
                        >
                          {channel.name}
                        </p>
                        <p
                          className={`text-[11px] mt-0.5 ${selectedChannel?.id === channel.id ? "text-blue-200" : "text-slate-500"}`}
                        >
                          Live Stream
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-600 italic text-sm">
                    No channels found...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
