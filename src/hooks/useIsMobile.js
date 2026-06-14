// import { useEffect, useState } from "react";

// // Tracks whether the viewport is below the given breakpoint (default: 640px / Tailwind "sm").
// export default function useIsMobile(breakpoint = 640) {
//   const [isMobile, setIsMobile] = useState(() =>
//     typeof window !== "undefined" ? window.innerWidth < breakpoint : false,
//   );

//   useEffect(() => {
//     const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
//     const onChange = () => setIsMobile(mq.matches);
//     onChange();
//     mq.addEventListener("change", onChange);
//     return () => mq.removeEventListener("change", onChange);
//   }, [breakpoint]);

//   return isMobile;
// }

import { useEffect, useState } from "react";

/**
 * Hook to track mobile viewport status.
 * @param {number} breakpoint - The width in pixels to trigger mobile state.
 * @returns {boolean} - Returns true if viewport is smaller than breakpoint.
 */
export default function useIsMobile(breakpoint = 640) {
  // প্রারম্ভিক স্টেট সেট করা (SSR এর জন্য নিরাপদ)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < breakpoint;
    }
    return false;
  });

  useEffect(() => {
    // মিডিয়া কুয়েরি সেটআপ
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    // আপডেট ফাংশন
    const onChange = (event) => {
      setIsMobile(event.matches);
    };

    // বর্তমান স্টেট সেট করা
    setIsMobile(mq.matches);

    // লিসেনার যুক্ত করা (আধুনিক ব্রাউজারের জন্য)
    mq.addEventListener("change", onChange);

    // ক্লিনআপ ফাংশন
    return () => {
      mq.removeEventListener("change", onChange);
    };
  }, [breakpoint]);

  return isMobile;
}
