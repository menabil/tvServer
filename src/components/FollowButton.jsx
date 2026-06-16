import { Github } from "lucide-react";

export default function FollowButton({ username = "menabil" }) {
  return (
    <a
      href={`https://github.com/${username}`}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`Follow ${username} on GitHub`}
      className="flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--accent)] bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-white transition-all duration-200 hover:bg-transparent hover:text-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
    >
      <Github size={14} aria-hidden="true" />
      <span className="hidden sm:inline">Follow me</span>
    </a>
  );
}
