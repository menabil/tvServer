import { Github } from "lucide-react";

export default function FollowButton({ username = "menabil" }) {
  return (
    <a
      href={`https://github.com/${username}`}
      target="_blank"
      rel="noreferrer noopener"
      className="flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
    >
      <Github size={14} />
      <span className="hidden sm:inline">Follow me</span>
    </a>
  );
}
