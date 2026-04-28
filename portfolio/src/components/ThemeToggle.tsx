import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../theme/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "var(--surface-soft)",
        borderColor: "var(--panel-border)",
        color: "var(--text-primary)",
        boxShadow: "var(--shadow-soft)",
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
    </button>
  );
}
