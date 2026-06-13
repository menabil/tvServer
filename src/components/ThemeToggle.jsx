import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";

  return (
    <button
      onClick={onToggle}
      aria-label="Toggle light and dark theme"
      role="switch"
      aria-checked={isDark}
      className={`relative flex h-8 w-14 shrink-0 items-center rounded-full border border-[var(--border)] transition-colors duration-300 ${
        isDark ? "bg-[var(--surface-2)]" : "bg-[var(--accent-soft)]"
      }`}
    >
      <Sun
        size={13}
        className={`absolute left-1.5 text-[var(--accent)] transition-opacity duration-300 ${
          isDark ? "opacity-0" : "opacity-100"
        }`}
      />
      <Moon
        size={13}
        className={`absolute right-1.5 text-[var(--accent-2)] transition-opacity duration-300 ${
          isDark ? "opacity-100" : "opacity-0"
        }`}
      />
      <span
        className={`grid h-6 w-6 place-items-center rounded-full bg-[var(--accent)] text-white shadow transition-transform duration-300 ease-out ${
          isDark ? "translate-x-7" : "translate-x-1"
        }`}
      >
        {isDark ? <Moon size={13} /> : <Sun size={13} />}
      </span>
    </button>
  );
}
