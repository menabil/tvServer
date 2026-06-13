import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLenis } from "lenis/react";
import {
  Activity,
  Baby,
  BookOpen,
  Clapperboard,
  Film,
  GraduationCap,
  Languages,
  LayoutGrid,
  Music2,
  Newspaper,
  Search,
  Trophy,
  Tv,
} from "lucide-react";

import VideoPlayer from "./components/VideoPlayer";
import ChannelCard from "./components/ChannelCard";
import ThemeToggle from "./components/ThemeToggle";
import FollowButton from "./components/FollowButton";
import Pagination from "./components/Pagination";
import useTheme from "./hooks/useTheme";
import useIsMobile from "./hooks/useIsMobile";

// Lightweight metadata only — the actual channel lists are loaded on demand
// (see the data-loading effect below) so the first paint stays small and fast.
const CATEGORIES = [
  { id: "bangla", label: "Bangla", icon: Languages, count: 84 },
  { id: "sports", label: "Sports", icon: Activity, count: 244 },
  { id: "fifa", label: "FIFA", icon: Trophy, count: 13 },
  { id: "general", label: "General", icon: Tv, count: 1293 },
  { id: "news", label: "News", icon: Newspaper, count: 572 },
  { id: "entertainment", label: "Entertainment", icon: Clapperboard, count: 341 },
  { id: "movies", label: "Movies", icon: Film, count: 265 },
  { id: "music", label: "Music", icon: Music2, count: 420 },
  { id: "kids", label: "Kids", icon: Baby, count: 157 },
  { id: "religious", label: "Religious", icon: BookOpen, count: 491 },
  { id: "education", label: "Education", icon: GraduationCap, count: 136 },
  { id: "other", label: "Other", icon: LayoutGrid, count: 3297 },
];

const MAX_GROUP_CHIPS = 12;

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const isMobile = useIsMobile();
  const pageSize = isMobile ? 24 : 48;

  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const [group, setGroup] = useState("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [active, setActive] = useState(null); // nothing plays until the user picks a channel
  const [dataCache, setDataCache] = useState({});

  const lenis = useLenis();
  const scrollToTop = () => {
    if (typeof window === "undefined" || window.scrollY <= 40) return;
    if (lenis) lenis.scrollTo(0, { duration: 0.8 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const category = CATEGORIES.find((c) => c.id === categoryId);
  const channelData = dataCache[categoryId];
  const isLoadingCategory = !channelData;

  // Load a category's channel list only when it's first opened.
  useEffect(() => {
    if (dataCache[categoryId]) return;
    let cancelled = false;
    import(`./data/${categoryId}.json`).then((mod) => {
      if (!cancelled) {
        setDataCache((prev) => ({ ...prev, [categoryId]: mod.default }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [categoryId, dataCache]);

  // Only categories with more than one distinct "group" value get sub-filter chips.
  const groups = useMemo(() => {
    if (!channelData) return [];
    const counts = new Map();
    for (const ch of channelData) {
      const g = ch.group || "Other";
      counts.set(g, (counts.get(g) || 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_GROUP_CHIPS)
      .map(([name]) => name);
  }, [channelData]);

  const hasGroups = groups.length > 1;

  // Channels for the current category + group + search query.
  const filtered = useMemo(() => {
    if (!channelData) return [];
    const q = query.trim().toLowerCase();
    return channelData.filter((ch) => {
      const matchesGroup = !hasGroups || group === "All" || ch.group === group;
      const matchesQuery = !q || ch.name?.toLowerCase().includes(q);
      return matchesGroup && matchesQuery;
    });
  }, [channelData, group, query, hasGroups]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  // Switching category resets filters/pagination. Nothing auto-plays.
  const selectCategory = (id) => {
    setCategoryId(id);
    setGroup("All");
    setQuery("");
    setPage(1);
  };

  const selectGroup = (g) => {
    setGroup(g);
    setQuery("");
    setPage(1);
  };

  const handleSearch = (value) => {
    setQuery(value);
    setPage(1);
  };

  // Only an explicit click changes what's playing.
  const selectChannel = (channel) => {
    setActive(channel);
    scrollToTop();
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <Helmet>
        <title>{active ? `${active.name} · StreamTV` : "StreamTV — Live Channels"}</title>
        <meta
          name="description"
          content="Watch live Bangla, sports, news, movies, music and many more channels online with StreamTV."
        />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent)] text-white">
              <Tv size={18} />
            </span>
            <h1 className="font-display text-lg font-bold tracking-tight">
              Stream<span className="text-[var(--accent)]">TV</span>
            </h1>
          </div>

          <div className="relative order-3 w-full sm:order-2 sm:ml-auto sm:max-w-sm">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={`Search ${category.label}...`}
              className="w-full rounded-full border border-[var(--border)] bg-[var(--surface)] py-2 pl-9 pr-4 text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
            />
          </div>

          <div className="order-2 ml-auto flex items-center gap-2 sm:order-3 sm:ml-0">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <FollowButton username="menabil" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-5">
        {/* Player + sidebar (same height) */}
        <section className="grid items-stretch gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <VideoPlayer channel={active} />

            <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent-soft)] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                {active?.group || category.label}
              </span>
              <h2 className="mt-2 truncate font-display text-lg font-semibold">
                {active?.name || "Select a channel"}
              </h2>
            </div>
          </div>

          <aside className="flex flex-col gap-3 lg:col-span-1 lg:h-full">
            <div className="flex flex-1 flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
              <h3 className="px-1 pb-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                Categories
              </h3>
              <div
                data-lenis-prevent
                className="flex flex-1 flex-col gap-1 overflow-y-auto pr-1"
              >
                {CATEGORIES.map(({ id, label, icon: Icon, count }) => (
                  <button
                    key={id}
                    onClick={() => selectCategory(id)}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors duration-200 ${
                      categoryId === id
                        ? "bg-[var(--accent)] text-white"
                        : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                    }`}
                  >
                    <Icon size={15} className="shrink-0" />
                    <span className="truncate">{label}</span>
                    <span className="ml-auto text-xs opacity-70">{count}</span>
                  </button>
                ))}
              </div>
            </div>

            {hasGroups && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
                <h3 className="px-1 pb-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                  Sub-categories
                </h3>
                <div className="chip-row flex gap-2 overflow-x-auto px-1 pb-1">
                  {["All", ...groups].map((g) => (
                    <button
                      key={g}
                      onClick={() => selectGroup(g)}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
                        group === g
                          ? "bg-[var(--accent-2)] text-white"
                          : "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </section>

        {/* Channel grid */}
        <section>
          {isLoadingCategory ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {Array.from({ length: pageSize }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton flex flex-col items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3"
                >
                  <span className="h-12 w-12 rounded-lg bg-[var(--surface-2)]" />
                  <span className="h-3 w-3/4 rounded bg-[var(--surface-2)]" />
                </div>
              ))}
            </div>
          ) : paged.length > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {paged.map((channel) => (
                  <ChannelCard
                    key={channel.id}
                    channel={channel}
                    active={active?.id === channel.id}
                    onSelect={() => selectChannel(channel)}
                  />
                ))}
              </div>
              <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
            </>
          ) : (
            <p className="py-12 text-center text-sm italic text-[var(--text-muted)]">
              No channels found.
            </p>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--accent)] text-white">
                  <Tv size={16} />
                </span>
                <span className="font-display text-base font-bold">
                  Stream<span className="text-[var(--accent)]">TV</span>
                </span>
              </div>
              <p className="mt-3 max-w-sm text-sm text-[var(--text-muted)]">
                A simple live-channel hub for Bangla, sports, news, movies, music and
                more — all in one place.
              </p>
            </div>

            <div className="md:max-w-md md:flex-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] md:text-right">
                Browse by category
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-3">
                {CATEGORIES.map(({ id, label, icon: Icon, count }) => (
                  <button
                    key={id}
                    onClick={() => {
                      selectCategory(id);
                      scrollToTop();
                    }}
                    className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2 text-left text-sm font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
                  >
                    <Icon size={15} className="shrink-0" />
                    <span className="truncate">{label}</span>
                    <span className="ml-auto text-xs opacity-60">{count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-[var(--border)] pt-4 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} StreamTV. All streams belong to their respective broadcasters.</p>
            <p>Built with React, Vite &amp; Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
