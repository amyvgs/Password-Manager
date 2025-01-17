import { useEffect, useRef, useState } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function ThemeToggle() {
  // store within local storage and obtain value to persist;
  const [isDark, setIsDark] = useState(() => {
    const storedTheme = JSON.parse(localStorage.getItem("isDark")) || false;
    return storedTheme;
  });

  const divRef = useRef(null);
  const [maxTranslate, setMaxTranslate] = useState(0);

  // useEffect to set proper theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  },[isDark])

  // useEffect to determine width of inner div for transition
  useEffect(() => {
    const calcMaxTranslate = () => {
      if (divRef.current) {
        const divWidth = divRef.current.offsetWidth;
        const btnWidth = 32;
        setMaxTranslate(divWidth - btnWidth);
      }
    };

    calcMaxTranslate();

    // when resize is detected, recalculate
    window.addEventListener("resize", calcMaxTranslate);
    return () => window.removeEventListener("resize", calcMaxTranslate);
  }, []);

  const toggleDarkMode = () => {
    const currTheme = !isDark;
    setIsDark(!isDark);
    localStorage.setItem("isDark", JSON.stringify(currTheme));
  };

  return (
    <div className="flex flex-row items-center justify-between w-3/4 h-12 border-2 border-gray-300 dark:border-slate-800 shadow-lg mb-2 p-2 rounded-lg">
      <LightModeIcon />

      <div
        ref={divRef}
        className="rounded-3xl w-2/3 h-5 bg-gray-300 dark:bg-slate-800 shadow-inner shadow-black/30 p-1"
      >
        <div
          onClick={toggleDarkMode}
          style={{ transform: `translateX(${isDark ? maxTranslate : 0}px)` }}
          className={` rounded-full h-full w-6 bg-gray-400 hover:cursor-pointer transition-all ease-in-out duration-300 `}
        ></div>
      </div>

      <DarkModeIcon />
    </div>
  );
}
