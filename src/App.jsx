import { Component, lazy, Suspense, useState } from "react";
import Header from "./components/Header.jsx";
import Terminal from "./components/Terminal.jsx";
import About from "./components/About.jsx";
import { Skills, Education, Projects, Contact } from "./components/Sections.jsx";

// 3D scene alag chunk me load hota hai, taaki site ka first load fast rahe
const BackgroundScene = lazy(() => import("./components/BackgroundScene.jsx"));

// 3D tabhi chalao jab device WebGL support kare aur user ne "reduce motion" na lagaya ho
function canRun3D() {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

// Agar 3D me kuch bhi fail ho, to site normal (bina 3D) chalti rahe
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function App() {
  const [show3D] = useState(canRun3D);

  return (
    <>
      {show3D && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <BackgroundScene />
          </Suspense>
        </SceneBoundary>
      )}
      <Header />
      <div className="wrap">
        <section className="hero" id="top" style={{ borderTop: "none" }}>
          <h1>Shivam</h1>
          <p className="sub">
            Computer science student building practical software for learners, with a focus on AI, networks and data science.
          </p>
          <div className="win">
            <div className="win-bar">
              <span className="dot" style={{ background: "#ff5f56" }} />
              <span className="dot" style={{ background: "#ffbd2e" }} />
              <span className="dot" style={{ background: "#27c93f" }} />
              <span className="title">shivam@portfolio: ~</span>
            </div>
            <div className="win-body"><Terminal /></div>
          </div>
          <div className="cta">
            <a className="btn primary" href="#projects">./view-projects</a>
            <a className="btn" href="#contact">./contact-me</a>
          </div>
        </section>

        <About />
        <Skills />
        <Education />
        <Projects />
        <Contact />
      </div>

      <footer>
        <div className="wrap">
          &copy; 2026 Shivam · Built with React, Vite &amp; CSS · Hosted on GitHub Pages
        </div>
      </footer>
    </>
  );
}
