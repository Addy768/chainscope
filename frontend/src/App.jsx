import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { DemoProvider, useDemo } from "./lib/demoMode.jsx";
import Home from "./routes/Home.jsx";
import Metrics from "./routes/Metrics.jsx";
import About from "./routes/About.jsx";

function DemoToggle() {
  const { demo, setDemo } = useDemo();
  return (
    <button
      onClick={() => setDemo(!demo)}
      className={`rounded-full border px-3 py-1 text-xs uppercase tracking-widest transition-colors ${
        demo
          ? "border-accent bg-accent/10 text-accent"
          : "border-border text-muted hover:text-ink"
      }`}
      title="Toggle offline demo (uses sample_predictions.json)"
    >
      demo {demo ? "on" : "off"}
    </button>
  );
}

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
        <nav className="flex items-center gap-6">
          <Link to="/" className={link}>demo</Link>
          <Link to="/metrics" className={link}>metrics</Link>
          <Link to="/about" className={link}>about</Link>
          <DemoToggle />
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-canvas font-mono text-ink">
          <Nav />
          <main className="mx-auto max-w-6xl p-6">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/metrics" element={<Metrics />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </ErrorBoundary>
          </main>
          <footer className="border-t border-border py-4 text-center text-xs text-muted">
            built for UN SDG 12 // powered by three trained models
          </footer>
        </div>
      </BrowserRouter>
    </DemoProvider>
  );
}
