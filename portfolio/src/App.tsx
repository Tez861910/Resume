import { lazy, Suspense, useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ProjectDetail from "./pages/ProjectDetail";
import ResumeDownloads from "./pages/ResumeDownloads";
import { CockpitModeProvider } from "./three/cockpit/CockpitModeProvider";
import { ThemeProvider } from "./theme/ThemeProvider";
import { siteConfig } from "./config/site";

// Lazy-loaded so the GPU-heavy three.js/r3f cockpit bundle is only fetched
// when the (currently disabled) /cockpit route is actually entered.
const CockpitGame = lazy(() => import("./pages/CockpitGame"));

function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: "smooth" }), 100);
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 32);
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
          <Route path="/resume" element={<ResumeDownloads />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          {/* Cockpit is temporarily disabled (siteConfig.cockpit.enabled).
              The route stays registered but redirects home until it is fixed. */}
          <Route
            path="/cockpit/*"
            element={
              siteConfig.cockpit.enabled ? (
                <Suspense fallback={null}>
                  <CockpitGame />
                </Suspense>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <CockpitModeProvider>
          <AppShell />
        </CockpitModeProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
