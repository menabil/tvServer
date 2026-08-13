import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const goTo = (p) => onChange(Math.min(Math.max(1, p), totalPages));

  return (
    // ফিক্স ১: Semantic HTML এবং aria-label
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 pt-4"
    >
      <button
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
        aria-label="Go to previous page"
        // ফিক্স ২ ও ৩: disabled cursor এবং focus states যুক্ত করা হয়েছে
        className="grid h-9 w-9 place-items-center rounded-full border border-(--border)] bg-(--surface)] text-(--text)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:border-(--accent)] enabled:hover:text-(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg)]"
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </button>

      <span
        className="rounded-full border border-(--border)] bg-(--surface)] px-4 py-2 text-sm font-medium text-(--text)]"
        aria-current="page"
      >
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() => goTo(page + 1)}
        disabled={page === totalPages}
        aria-label="Go to next page"
        // ফিক্স ২ ও ৩: disabled cursor এবং focus states যুক্ত করা হয়েছে
        className="grid h-9 w-9 place-items-center rounded-full border border-(--border)] bg-(--surface)] text-(--text)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:border-(--accent)] enabled:hover:text-(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg)]"
      >
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}
