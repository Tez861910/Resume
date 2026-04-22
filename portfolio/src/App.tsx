import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Challenge from "./components/Challenge";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ProjectDetail from "./pages/ProjectDetail";
import PersistentShip from "./components/PersistentShip";
import PersistentWorldOverlay from "./components/world/PersistentWorldOverlay";
import CockpitFrame from "./components/cockpit/CockpitFrame";
import CockpitHUD from "./components/cockpit/CockpitHUD";
import WarpStreaks from "./components/cockpit/WarpStreaks";
import WarpSection from "./components/cockpit/WarpSection";
import CockpitOverlay from "./components/cockpit/CockpitOverlay";
import { CockpitModeProvider, useCockpit } from "./three/cockpit/CockpitModeProvider";
import { GameProvider, useGame } from "./three/game/GameContext";
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
      <WarpSection>
        <About />
      </WarpSection>
      <WarpSection>
        <Skills />
      </WarpSection>
      <WarpSection>
        <Experience />
      </WarpSection>
      <WarpSection>
        <Projects />
      </WarpSection>
      <WarpSection>
        <Challenge />
      </WarpSection>
      <WarpSection>
        <Contact />
      </WarpSection>
    </>
  );
}

function AppShell() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isActive } = useGame();
  const { isActive: isCockpitActive } = useCockpit();
  const world = useSharedWorldState();

  const showWorldUi = !isActive && !isCockpitActive;

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

      <WarpStreaks />

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
      </div>

      <div className="relative z-[2] min-h-screen">
        <Navbar isScrolled={isScrolled} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
        <Footer />
      </div>

      <CockpitFrame />
      {showWorldUi && <CockpitHUD />}

      <PersistentShip />

      <CockpitOverlay />
    </>
  );
}

function WorldAwareApp() {
  const { isActive } = useGame();

  return (
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
  );
}

function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <CockpitModeProvider>
          <WorldAwareApp />
        </CockpitModeProvider>
      </GameProvider>
    </BrowserRouter>
  );
}

export default App;
