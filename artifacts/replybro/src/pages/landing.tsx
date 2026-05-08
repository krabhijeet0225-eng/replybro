import { motion } from "framer-motion";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { MessageCircle, Zap, Shield, Sparkles, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-medium tracking-wide backdrop-blur-md inline-block">
              AI-Powered Texting Wingman
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter"
          >
            Never leave them <br />
            <span className="text-gradient-primary">on read again.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12 font-light leading-relaxed"
          >
            ReplyBro gives you the perfect response for every situation. Romantic, funny, savage, or deep — own the conversation.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            <Link href="/dashboard" className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95">
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity" />
              Start Generating
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Your personal <span className="text-gradient-pink">charisma engine.</span></h2>
            <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">We analyze the context, you pick the vibe, we deliver the magic.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MessageCircle, title: "Context Aware", desc: "Understands the nuance and history of your conversation." },
              { icon: Sparkles, title: "4 Unique Modes", desc: "Switch between Romantic, Funny, Savage, and Emotional instantly." },
              { icon: Zap, title: "Lightning Fast", desc: "Generates the perfect reply in milliseconds." },
              { icon: Shield, title: "Private & Secure", desc: "Your conversations are yours. We don't train on your personal data." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-8 rounded-3xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-primary">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-32 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative">
          <div className="glass-card rounded-[3rem] p-12 md:p-20 text-center overflow-hidden relative">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/30 rounded-full blur-[100px]" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]" />
            
            <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10">Ready to level up your game?</h2>
            <p className="text-xl text-muted-foreground mb-10 relative z-10 max-w-xl mx-auto">Join thousands of users who have already upgraded their texting game with ReplyBro.</p>
            
            <div className="relative z-10">
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-gradient-primary text-white rounded-full font-bold text-xl shadow-[0_0_30px_rgba(108,99,255,0.4)] hover:shadow-[0_0_50px_rgba(108,99,255,0.6)] transition-all hover:scale-105 active:scale-95">
                Try ReplyBro Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 relative z-10 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} ReplyBro. All rights reserved.</p>
      </footer>
    </Layout>
  );
}
