import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ProjectDetail from "./pages/ProjectDetail";
import PersistentShip from "./components/PersistentShip";
import WorldHUD from "./components/world/WorldHUD";
import SectionProgress from "./components/world/SectionProgress";
import PersistentWorldOverlay from "./components/world/PersistentWorldOverlay";
import RecruiterModeProvider, {
  useRecruiterMode,
} from "./components/world/RecruiterModeProvider";
import { GameProvider, useGame } from "./three/game/GameContext";
import DevSprintGame from "./three/game/DevSprintGame";
import {
  WorldStateProvider,
  useSharedWorldState,
} from "./three/world/WorldStateProvider";

function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return null;
}

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
    </>
  );
}

function AppShell() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isActive } = useGame();
  const { enabled: recruiterModeEnabled, isLiteMode } = useRecruiterMode();
  const world = useSharedWorldState();

  const showWorldUi = !isActive && !recruiterModeEnabled && !isLiteMode;
  const showImmersiveBackground = !recruiterModeEnabled && !isLiteMode;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <ScrollToHash />
      {showWorldUi && <PersistentWorldOverlay />}

      {showImmersiveBackground && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
        >
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              opacity: world.activeSection === "home" ? 0.12 : 0.05,
              background:
                "radial-gradient(circle at 50% 18%, rgba(251,191,36,0.1), transparent 42%)",
            }}
          />
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              opacity:
                world.activeSection === "projects"
                  ? 0.12
                  : world.activeSection === "skills"
                    ? 0.08
                    : 0.04,
              background:
                "radial-gradient(circle at 82% 28%, rgba(34,211,238,0.1), transparent 36%)",
            }}
          />
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              opacity: world.activeSection === "experience" ? 0.1 : 0.04,
              background:
                "radial-gradient(circle at 18% 72%, rgba(52,211,153,0.08), transparent 34%)",
            }}
          />
          <div
            className="absolute inset-x-0 top-0 h-px transition-opacity duration-500"
            style={{
              opacity: showWorldUi ? 0.18 : 0,
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)",
            }}
          />
        </div>
      )}

      <div className="relative z-[2] min-h-screen">
        <Navbar isScrolled={isScrolled} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
        <Footer />
      </div>

      {showWorldUi && <WorldHUD />}
      {showWorldUi && <SectionProgress />}

      {!recruiterModeEnabled && !isLiteMode && <PersistentShip />}

      {isActive && !isLiteMode && <DevSprintGame />}
    </>
  );
}

function WorldAwareApp() {
  const { isActive } = useGame();

  return (
    <RecruiterModeProvider>
      <WorldStateProvider
        challengeModeActive={isActive}
        sectionIds={[
          "home",
          "about",
          "skills",
          "experience",
          "projects",
          "contact",
        ]}
      >
        <AppShell />
      </WorldStateProvider>
    </RecruiterModeProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <WorldAwareApp />
      </GameProvider>
    </BrowserRouter>
  );
}

export default App;
