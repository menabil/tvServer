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

// ৪টি JSON ফাইল ইম্পোর্ট করা হলো
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
  { name: "Bangla", icon: <Globe size={18} /> },
  { name: "English", icon: <Radio size={18} /> },
  { name: "Sports", icon: <Trophy size={18} /> },
  { name: "Movies", icon: <Film size={18} /> },
];

function App() {
  const [activeCategory, setActiveCategory] = useState("Bangla");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const videoRef = useRef(null);
  const hlsRef = useRef(null); // HLS ইনস্ট্যান্স ট্র্যাকিংয়ের জন্য (মেমোরি লিক রোধ করবে)

  const currentChannelsData = allCategoriesData[activeCategory] || [];

  // ক্যাটাগরি চেঞ্জ হলে প্রথম চ্যানেল লোড করার পারফেক্ট লজিক
  useEffect(() => {
    if (currentChannelsData.length > 0) {
      setSelectedChannel(currentChannelsData[0]);
    } else {
      setSelectedChannel(null);
    }
  }, [activeCategory]);

  // সুপার স্মুথ HLS ভিডিও প্লেয়ার লজিক (ক্লিনআপ সহ)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // আগের কোনো প্লেয়ার সচল থাকলে তা পুরোপুরি ধ্বংস (Destroy) করা হবে যাতে সাইট স্লো না হয়
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
        maxBufferLength: 10, // বাফারিং সাইজ কমিয়ে সাইট স্মুথ করা হয়েছে
        enableWorker: true, // ব্যাকগ্রাউন্ড ওয়ার্কার অন করে পারফরম্যান্স বাড়ানো হয়েছে
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
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans antialiased selection:bg-blue-500/30">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-600/20">
              <Tv className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Stream<span className="text-blue-500">TV</span>
            </h1>
          </div>

          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              placeholder={`Search in ${activeCategory}...`}
              className="w-full bg-slate-800/60 border border-slate-700/80 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* PLAYER SECTION */}
          <div className="lg:col-span-8 space-y-6">
            {/* Category Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    setActiveCategory(cat.name);
                    setSearchQuery("");
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all will-change-transform ${
                    activeCategory === cat.name
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
                      : "bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                  }`}
                >
                  {cat.icon} {cat.name} (
                  {allCategoriesData[cat.name]?.length || 0})
                </button>
              ))}
            </div>

            {/* Video Box */}
            <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl">
              <video
                ref={videoRef}
                controls
                muted
                className="w-full h-full object-contain"
                playsInline
              />
            </div>

            {/* Video Title */}
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
              <span className="bg-blue-500/10 text-blue-400 text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
                {activeCategory}
              </span>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-2">
                <PlayCircle className="text-blue-500" size={24} />
                {selectedChannel?.name || "No Channel Selected"}
              </h2>
            </div>
          </div>

          {/* CHANNEL LIST */}
          <div className="lg:col-span-4">
            <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/80 p-4 h-[calc(100vh-200px)] overflow-y-auto space-y-2 custom-scrollbar">
              <h3 className="font-bold text-lg mb-3 text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <Tv size={20} className="text-blue-500" /> {activeCategory} List
              </h3>

              {filteredChannels.length > 0 ? (
                filteredChannels.map((channel) => (
                  <div
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 will-change-auto ${
                      selectedChannel?.id === channel.id
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                        : "bg-slate-800/30 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                    }`}
                  >
                    <img
                      src={channel.logo}
                      alt=""
                      className="w-12 h-12 rounded-lg object-contain bg-slate-950 p-1 border border-slate-800"
                      loading="lazy" // ইমেজ লেজি লোড করার কারণে স্ক্রোলিং আরও স্মুথ হবে
                      onError={(e) => {
                        e.target.onerror = null; // লুপ আটকানোর জন্য
                        e.target.src =
                          "https://via.placeholder.com/150?text=TV";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {channel.name}
                      </p>
                      <p
                        className={`text-xs mt-0.5 ${selectedChannel?.id === channel.id ? "text-blue-200" : "text-slate-500"}`}
                      >
                        {activeCategory}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-500 italic text-sm">
                  No channels found in this folder...
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* CSS for Scrollbars */}
      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
}

export default App;
