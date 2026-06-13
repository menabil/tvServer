import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const goTo = (p) => onChange(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
        className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition-colors disabled:opacity-40 enabled:hover:border-[var(--accent)] enabled:hover:text-[var(--accent)]"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text)]">
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() => goTo(page + 1)}
        disabled={page === totalPages}
        className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition-colors disabled:opacity-40 enabled:hover:border-[var(--accent)] enabled:hover:text-[var(--accent)]"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
