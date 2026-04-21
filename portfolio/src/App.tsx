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
import { GameProvider, useGame } from "./three/game/GameContext";
import DevSprintGame from "./three/game/DevSprintGame";

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

function AppContent() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isActive } = useGame();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <ScrollToHash />
      <div className="min-h-screen">
        <Navbar isScrolled={isScrolled} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
        <Footer />
      </div>

      {/* Persistent cursor ship — visible on all sections below the hero */}
      <PersistentShip />

      {/* Dev Sprint mini-game overlay — mounts only when active */}
      {isActive && <DevSprintGame />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </BrowserRouter>
  );
}

export default App;
