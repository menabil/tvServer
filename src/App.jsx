import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Activity, Globe, Languages, Search, Trophy, Tv } from "lucide-react";

import VideoPlayer from "./components/VideoPlayer";
import ChannelCard from "./components/ChannelCard";
import ThemeToggle from "./components/ThemeToggle";
import useTheme from "./hooks/useTheme";

import bangla from "./data/bangla.json";
import international from "./data/channel.json";
import sports from "./data/sports.json";
import fifa from "./data/fifa.json";

const CATEGORIES = [
  { id: "bangla", label: "Bangla", icon: Languages, data: bangla },
  { id: "international", label: "International", icon: Globe, data: international },
  { id: "sports", label: "Sports", icon: Activity, data: sports },
  { id: "fifa", label: "FIFA", icon: Trophy, data: fifa },
];

const MAX_GROUP_CHIPS = 12;

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const [group, setGroup] = useState("All");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null);

  const category = CATEGORIES.find((c) => c.id === categoryId);

  // Only categories with more than one distinct "group" value get sub-filter chips.
  const groups = useMemo(() => {
    const counts = new Map();
    for (const ch of category.data) {
      const g = ch.group || "Other";
      counts.set(g, (counts.get(g) || 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_GROUP_CHIPS)
      .map(([name]) => name);
  }, [category]);

  const hasGroups = groups.length > 1;

  const channels = useMemo(() => {
    const q = query.trim().toLowerCase();
    return category.data.filter((ch) => {
      const matchesGroup = !hasGroups || group === "All" || ch.group === group;
      const matchesQuery = !q || ch.name?.toLowerCase().includes(q);
      return matchesGroup && matchesQuery;
    });
  }, [category, group, query, hasGroups]);

  // Reset filters when switching category.
  useEffect(() => {
    setGroup("All");
    setQuery("");
  }, [categoryId]);

  // Keep the player pointed at a valid channel as filters change.
  useEffect(() => {
    if (!channels.length) {
      setActive(null);
    } else if (!active || !channels.some((ch) => ch.id === active.id)) {
      setActive(channels[0]);
    }
  }, [channels]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <Helmet>
        <title>{active ? `${active.name} · StreamTV` : "StreamTV — Live Channels"}</title>
        <meta
          name="description"
          content="Watch live Bangla, international, sports and FIFA channels online with StreamTV."
        />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent)] text-white">
              <Tv size={18} />
            </span>
            <h1 className="font-display text-lg font-bold tracking-tight">
              Stream<span className="text-[var(--accent)]">TV</span>
            </h1>
          </div>

          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${category.label}...`}
              className="w-full rounded-full border border-[var(--border)] bg-[var(--surface)] py-2 pl-9 pr-4 text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
            />
          </div>

          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-5 px-4 py-5">
        {/* Player */}
        <VideoPlayer channel={active} />

        {/* Now playing */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent-soft)] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            {active?.group || category.label}
          </span>
          <h2 className="mt-2 truncate font-display text-lg font-semibold">
            {active?.name || "Select a channel"}
          </h2>
        </div>

        {/* Category tabs */}
        <div className="chip-row flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(({ id, label, icon: Icon, data }) => (
            <button
              key={id}
              onClick={() => setCategoryId(id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                categoryId === id
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              <Icon size={15} />
              {label}
              <span className="text-xs opacity-70">({data.length})</span>
            </button>
          ))}
        </div>

        {/* Group chips */}
        {hasGroups && (
          <div className="chip-row flex gap-2 overflow-x-auto pb-1">
            {["All", ...groups].map((g) => (
              <button
                key={g}
                onClick={() => setGroup(g)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  group === g
                    ? "bg-[var(--accent-2)] text-white"
                    : "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        )}

        {/* Channel grid */}
        {channels.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {channels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                active={active?.id === channel.id}
                onSelect={() => setActive(channel)}
              />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-sm italic text-[var(--text-muted)]">
            No channels found.
          </p>
        )}
      </main>
    </div>
  );
}
