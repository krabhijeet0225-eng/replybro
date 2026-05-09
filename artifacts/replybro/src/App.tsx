import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import HistoryView from "@/pages/history-view";
import Tracker from "@/pages/tracker";

export type View = "landing" | "dashboard" | "history" | "tracker";

const queryClient = new QueryClient();

function Navbar({ view, setView }: { view: View; setView: (v: View) => void }) {
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => setView("landing")}>
        <span style={{ background: "linear-gradient(135deg,#6C63FF,#22D3EE)", borderRadius: 10, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>💬</span>
        <span className="font-syne grad-text">ReplyBro</span>
      </div>
      <div className="nav-links">
        {([["landing","Home"],["dashboard","Dashboard"],["history","History"],["tracker","Tracker"]] as [View,string][]).map(([v,l]) => (
          <button key={v} className={`nav-link ${view===v?"active":""}`} onClick={() => setView(v)}>{l}</button>
        ))}
        <button className="btn-nav" onClick={() => setView("dashboard")}>Try Free →</button>
      </div>
    </nav>
  );
}

function App() {
  const [view, setView] = useState<View>("landing");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="noise" style={{ minHeight: "100vh", background: "var(--bg0)" }}>
        <Navbar view={view} setView={setView} />
        <AnimatePresence mode="wait">
          {view === "landing" && (
            <motion.div key="land" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Landing setView={setView} />
            </motion.div>
          )}
          {view === "dashboard" && (
            <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Dashboard />
              <hr className="divider" />
              <Footer />
            </motion.div>
          )}
          {view === "history" && (
            <motion.div key="hist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <HistoryView setView={setView} />
              <hr className="divider" />
              <Footer />
            </motion.div>
          )}
          {view === "tracker" && (
            <motion.div key="track" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Tracker />
              <hr className="divider" />
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="nav-logo" style={{ marginBottom: 7 }}>
          <span style={{ background: "linear-gradient(135deg,#6C63FF,#22D3EE)", borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>💬</span>
          <span className="font-syne grad-text" style={{ fontSize: 18 }}>ReplyBro</span>
        </div>
        <p className="footer-copy">© 2025 ReplyBro. Made with 💜 for every texting situation.</p>
      </div>
      <div className="footer-links">
        {["Privacy","Terms","Twitter","Discord"].map(l => <a key={l} className="footer-link">{l}</a>)}
      </div>
    </footer>
  );
}

export { Footer };
export default App;
