import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
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
import useTheme from "./hooks/useTheme";

import bangla from "./data/bangla.json";
import sports from "./data/sports.json";
import fifa from "./data/fifa.json";
import general from "./data/general.json";
import news from "./data/news.json";
import entertainment from "./data/entertainment.json";
import movies from "./data/movies.json";
import music from "./data/music.json";
import kids from "./data/kids.json";
import religious from "./data/religious.json";
import education from "./data/education.json";
import other from "./data/other.json";

const CATEGORIES = [
  { id: "bangla", label: "Bangla", icon: Languages, data: bangla },
  { id: "sports", label: "Sports", icon: Activity, data: sports },
  { id: "fifa", label: "FIFA", icon: Trophy, data: fifa },
  { id: "general", label: "General", icon: Tv, data: general },
  { id: "news", label: "News", icon: Newspaper, data: news },
  { id: "entertainment", label: "Entertainment", icon: Clapperboard, data: entertainment },
  { id: "movies", label: "Movies", icon: Film, data: movies },
  { id: "music", label: "Music", icon: Music2, data: music },
  { id: "kids", label: "Kids", icon: Baby, data: kids },
  { id: "religious", label: "Religious", icon: BookOpen, data: religious },
  { id: "education", label: "Education", icon: GraduationCap, data: education },
  { id: "other", label: "Other", icon: LayoutGrid, data: other },
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
          content="Watch live Bangla, sports, news, movies, music and many more channels online with StreamTV."
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

      {/* Hero / banner — fills the first screen */}
      <section className="flex min-h-[calc(100vh-65px)] flex-col justify-center border-b border-[var(--border)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6">
          <div className="animate-fade-in-up">
            <VideoPlayer channel={active} />
          </div>

          <div className="animate-fade-in-up-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent-soft)] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              {active?.group || category.label}
            </span>
            <h2 className="mt-2 truncate font-display text-lg font-semibold">
              {active?.name || "Select a channel"}
            </h2>
          </div>

          {/* Category tabs */}
          <div className="chip-row animate-fade-in-up-2 flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map(({ id, label, icon: Icon, data }) => (
              <button
                key={id}
                onClick={() => setCategoryId(id)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
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
          )}
        </div>
      </section>

      {/* Channel grid */}
      <main className="mx-auto max-w-7xl px-4 py-8">
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

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
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

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => {
                    setCategoryId(id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
                >
                  {label}
                </button>
              ))}
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
