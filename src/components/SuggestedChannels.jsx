import { useMemo, useState, useEffect } from "react";
import { Shuffle, Tv } from "lucide-react";

const COUNT = 6;

// অপ্টিমাইজড র‍্যান্ডম পিকার (Swap and Pop Method)
function pickRandom(list, count, excludeId) {
  if (!list || list.length === 0) return [];

  // ফিক্স ১: বর্তমানে অ্যাক্টিভ থাকা চ্যানেলটি সাজেশনে আসবে না
  const pool = list.filter((ch) => ch.id !== excludeId);
  const picked = [];

  // ফিক্স ৩: Splice এর বদলে Swap and Pop ব্যবহার করা হলো (Faster Performance)
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool[idx]);
    pool[idx] = pool[pool.length - 1];
    pool.pop();
  }
  return picked;
}

export default function SuggestedChannels({ data, active, onSelect }) {
  const [seed, setSeed] = useState(0);

  // অ্যাক্টিভ চ্যানেল বা সিড পরিবর্তন হলে নতুন লিস্ট তৈরি হবে
  const suggestions = useMemo(
    () => pickRandom(data, COUNT, active?.id),
    [data, seed, active?.id],
  );

  return (
    <div className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
      <div className="flex items-center justify-between px-1 pb-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
          Suggested for you
        </h3>
        <button
          onClick={() => setSeed((s) => s + 1)}
          aria-label="Shuffle suggestions"
          // ফিক্স ৪: কীবোর্ড ফোকাস স্টেট যুক্ত করা হলো
          className="grid h-10 w-10 place-items-center rounded-full text-[var(--text-muted)] transition-all duration-200 hover:bg-[var(--surface-2)] hover:text-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <Shuffle size={17} aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {suggestions.length === 0 ? (
          <p className="px-1 text-sm italic text-[var(--text-muted)]">
            {data?.length === 0 ? "No suggestions available." : "Loading…"}
          </p>
        ) : (
          suggestions.map((channel) => (
            <SuggestedItem
              key={channel.id}
              channel={channel}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ফিক্স ২: ইমেজ ফলব্যাক সুন্দরভাবে হ্যান্ডেল করার জন্য আলাদা সাব-কম্পোনেন্ট
function SuggestedItem({ channel, onSelect }) {
  const [imgStatus, setImgStatus] = useState(
    channel?.logo ? "loading" : "broken",
  );

  useEffect(() => {
    setImgStatus(channel?.logo ? "loading" : "broken");
  }, [channel?.logo]);

  return (
    <button
      onClick={() => onSelect(channel)}
      // ফিক্স ৪: ফোকাস স্টেট
      className="group flex items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-all duration-200 text-[var(--text)] hover:bg-[var(--surface-2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
    >
      <span className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-[var(--surface-2)]">
        {imgStatus !== "broken" && channel?.logo ? (
          <img
            src={channel.logo}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="relative z-10 h-full w-full object-contain p-1"
            onLoad={() => setImgStatus("loaded")}
            onError={() => setImgStatus("broken")}
          />
        ) : null}

        {(imgStatus === "broken" || !channel?.logo) && (
          <Tv size={16} className="text-[var(--text-muted)]" />
        )}
      </span>

      <span className="truncate text-base font-medium">{channel?.name}</span>
    </button>
  );
}
