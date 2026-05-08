import { ReactNode } from "react";
import { Link } from "wouter";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden selection:bg-primary selection:text-white">
      <div className="noise-bg" />
      <header className="fixed top-0 left-0 right-0 z-40 glass-panel border-b border-b-white/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tighter flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white shadow-[0_0_15px_rgba(108,99,255,0.5)] group-hover:shadow-[0_0_25px_rgba(108,99,255,0.8)] transition-all">
              <span className="font-serif text-lg leading-none mt-[-2px]">R</span>
            </div>
            <span className="text-white">ReplyBro</span>
          </Link>
          <nav>
            <Link href="/dashboard" className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-all backdrop-blur-md border border-white/10 hover:border-white/30 text-sm">
              Open App
            </Link>
          </nav>
        </div>
      </header>
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
}
