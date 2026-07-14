import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Home from "./routes/Home.jsx";
import Metrics from "./routes/Metrics.jsx";
import About from "./routes/About.jsx";

function Nav() {
  const link =
    "text-sm uppercase tracking-widest text-muted hover:text-ink transition-colors";
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg">
          <span className="text-accent">chainscope</span>
          <span className="text-muted"> // ml supply-chain</span>
        </Link>
        <nav className="flex gap-6">
          <Link to="/" className={link}>
            demo
          </Link>
          <Link to="/metrics" className={link}>
            metrics
          </Link>
          <Link to="/about" className={link}>
            about
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-canvas font-mono text-ink">
        <Nav />
        <main className="mx-auto max-w-6xl p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/metrics" element={<Metrics />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <footer className="border-t border-border py-4 text-center text-xs text-muted">
          built for UN SDG 12 // powered by three trained models
        </footer>
      </div>
    </BrowserRouter>
  );
}
