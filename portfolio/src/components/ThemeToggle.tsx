import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../theme/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-11 w-11 items-center justify-center border transition-colors duration-200"
      style={{
        borderRadius: "4px",
        background: "transparent",
        borderColor: "var(--rule-strong)",
        color: "var(--ink)",
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
    </button>
  );
}
