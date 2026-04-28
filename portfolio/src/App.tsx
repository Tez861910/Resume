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
import CockpitGame from "./pages/CockpitGame";
import { GameProvider } from "./three/game/GameContext";
import { CockpitModeProvider } from "./three/cockpit/CockpitModeProvider";

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
      <Challenge />
      <Contact />
    </>
  );
}

function AppShell() {
  const [isScrolled, setIsScrolled] = useState(false);

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
      <div className="relative z-[2] min-h-screen">
        <Navbar isScrolled={isScrolled} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/cockpit/*" element={<CockpitGame />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <CockpitModeProvider>
          <AppShell />
        </CockpitModeProvider>
      </GameProvider>
    </BrowserRouter>
  );
}

export default App;
