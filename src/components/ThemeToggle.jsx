import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";

  return (
    <button
      onClick={onToggle}
      aria-label="Toggle light and dark theme"
      role="switch"
      aria-checked={isDark}
      // ফিক্স ১ ও ৩: focus-visible রিং এবং active scale যোগ করা হয়েছে
      className={`relative flex h-8 w-14 shrink-0 items-center rounded-full border border-[var(--border)] transition-colors duration-300 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] ${isDark ? "bg-[var(--surface-2)]" : "bg-[var(--accent-soft)]"
        }`}
    >
      <Sun
        size={13}
        className={`absolute left-1.5 text-[var(--accent)] transition-opacity duration-300 ${isDark ? "opacity-0" : "opacity-100"
          }`}
      />
      <Moon
        size={13}
        className={`absolute right-1.5 text-[var(--accent-2)] transition-opacity duration-300 ${isDark ? "opacity-100" : "opacity-0"
          }`}
      />
      <span
        // ফিক্স ২: will-change যুক্ত করে পারফরম্যান্স অপ্টিমাইজ করা হয়েছে
        className={`grid h-6 w-6 place-items-center rounded-full bg-[var(--accent)] text-white shadow transition-transform duration-300 ease-out will-change-transform ${isDark ? "translate-x-7" : "translate-x-1"
          }`}
      >
        {isDark ? <Moon size={13} /> : <Sun size={13} />}
      </span>
    </button>
  );
}
