// import { useEffect, useState } from "react";

// const STORAGE_KEY = "streamtv-theme";

// function getInitialTheme() {
//   if (typeof window === "undefined") return "dark";
//   const saved = localStorage.getItem(STORAGE_KEY);
//   if (saved === "light" || saved === "dark") return saved;
//   return window.matchMedia("(prefers-color-scheme: light)").matches
//     ? "light"
//     : "dark";
// }

// // Returns [theme, toggleTheme] and keeps the <html class="dark"> in sync.
// export default function useTheme() {
//   const [theme, setTheme] = useState(getInitialTheme);

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", theme === "dark");
//     localStorage.setItem(STORAGE_KEY, theme);
//   }, [theme]);

//   const toggleTheme = () =>
//     setTheme((prev) => (prev === "dark" ? "light" : "dark"));

//   return [theme, toggleTheme];
// }

import { useEffect, useState } from "react";

const STORAGE_KEY = "streamtv-theme";

function getInitialTheme() {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export default function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    // থিম অনুযায়ী ক্লাসের সিঙ্কিং
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // নতুন অংশ: সিস্টেম থিম পরিবর্তন হলে অটোমেটিক আপডেট
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");

    const handleSystemThemeChange = (e) => {
      // যদি ইউজার আগে থেকে কোনো ম্যানুয়াল থিম সেভ না করে থাকে, তবেই অটো-আপডেট হবে
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? "light" : "dark");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, []);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return [theme, toggleTheme];
}
