import { motion } from "framer-motion";
import type { View } from "@/App";

const FEATURES_LIST = [
  { icon:"🧠", title:"AI-Powered Replies",   desc:"Claude reads the vibe and crafts replies that sound human — not like a robot on a bad day.",   grad:"rgba(108,99,255,.15)" },
  { icon:"🧪", title:"A/B Reply Variants",   desc:"Get 3 different takes on every reply. Pick the one that hits.",                                  grad:"rgba(34,211,238,.15)"  },
  { icon:"🎯", title:"Rizz Score",            desc:"Paste your opening line and get a 0–100 score with brutally honest coaching.",                   grad:"rgba(245,158,11,.15)" },
  { icon:"📡", title:"Mood Detection",        desc:"AI reads the emotional subtext and breaks down the vibes in real time.",                         grad:"rgba(59,130,246,.15)"  },
  { icon:"💬", title:"Chat History",          desc:"Every reply is saved so you can revisit, copy, or compare past masterpieces.",                   grad:"rgba(16,185,129,.15)" },
  { icon:"🔊", title:"Voice Mode",            desc:"Hear your reply read aloud so you can feel the tone before you send it.",                        grad:"rgba(239,68,68,.15)"  },
  { icon:"🌍", title:"Multi-language",        desc:"Generate replies in 6 languages. Rizz has no borders.",                                          grad:"rgba(167,139,250,.15)"},
  { icon:"📊", title:"Relationship Tracker",  desc:"Track interest levels over time and get AI coaching for each person you're talking to.",         grad:"rgba(236,72,153,.15)" },
];

function Orbs() {
  return (
    <>
      <div className="orb" style={{width:600,height:600,top:-200,left:-200,background:"rgba(108,99,255,.18)"}}/>
      <div className="orb" style={{width:500,height:500,top:200,right:-150,background:"rgba(59,130,246,.12)"}}/>
      <div className="orb" style={{width:400,height:400,bottom:100,left:"30%",background:"rgba(236,72,153,.1)"}}/>
    </>
  );
}

export default function Landing({ setView }: { setView: (v: View) => void }) {
  return (
    <>
      <section className="hero">
        <Orbs/>
        <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center"}}>
          <motion.div className="hero-badge" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.1}}>
            <span className="hero-badge-dot"/> Powered by Claude AI · Free to try
          </motion.div>
          <motion.h1 className="hero-h1 font-syne" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:.2,duration:.7}}>
            Get perfect replies for<br/><span className="grad-text">any chat</span> instantly.
          </motion.h1>
          <motion.p className="hero-sub" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.35}}>
            Paste your conversation and let AI generate smart, funny, flirty or savage replies in seconds.
          </motion.p>
          <motion.div style={{display:"flex",gap:16,flexWrap:"wrap",justifyContent:"center"}} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.5}}>
            <button className="btn-hero" onClick={() => setView("dashboard")}>🔥 Generate a Reply</button>
            <button className="btn-ghost" onClick={() => setView("tracker")}>📊 Relationship Tracker</button>
          </motion.div>

          <motion.div style={{marginTop:64,width:"100%",maxWidth:660}} initial={{opacity:0,y:40,scale:.96}} animate={{opacity:1,y:0,scale:1}} transition={{delay:.7,duration:.8}}>
            <div className="glass-card" style={{padding:26,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at top right,rgba(108,99,255,.12),transparent 60%)"}}/>
              <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(108,99,255,.6),transparent)"}}/>
              <p style={{fontSize:12,color:"#6C63FF",letterSpacing:2,textTransform:"uppercase",fontWeight:600,marginBottom:14,position:"relative"}}>💬 Live Preview</p>
              <div style={{display:"flex",flexDirection:"column",gap:9,position:"relative"}}>
                {[
                  {f:"them",t:"hey, you coming to Jake's party saturday?"},
                  {f:"me",   t:"maybe, idk lol still deciding"},
                  {f:"them",t:"oh ok... would be cool if you came 👀"}
                ].map((m,i) => (
                  <div key={i} style={{display:"flex",justifyContent:m.f==="me"?"flex-end":"flex-start"}}>
                    <div style={{maxWidth:"70%",padding:"9px 15px",borderRadius:14,background:m.f==="me"?"linear-gradient(135deg,#6C63FF,#3B82F6)":"rgba(255,255,255,.07)",fontSize:14,lineHeight:1.5,borderBottomRightRadius:m.f==="me"?4:14,borderBottomLeftRadius:m.f==="them"?4:14}}>{m.t}</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:18,padding:"13px 16px",borderRadius:12,background:"rgba(108,99,255,.15)",border:"1px solid rgba(108,99,255,.3)",position:"relative"}}>
                <span style={{fontSize:13,color:"#A78BFA"}}>✨ AI Suggestion: </span>
                <span style={{fontSize:14}}>"haha caught me — honestly might show up just to see what the vibe is 👀"</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <hr className="divider"/>

      <section className="section">
        <div style={{position:"relative",zIndex:1}}>
          <motion.p className="section-label" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>Why ReplyBro</motion.p>
          <motion.h2 className="section-h2 font-syne" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
            Your unfair advantage<br/>in <span className="grad-text-pink">every conversation</span>
          </motion.h2>
          <div className="features-grid">
            {FEATURES_LIST.map((f,i) => (
              <motion.div key={f.title} className="feat-card" initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.07}}>
                <div className="feat-icon" style={{background:f.grad}}>{f.icon}</div>
                <p className="feat-title">{f.title}</p>
                <p className="feat-desc">{f.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div style={{textAlign:"center",marginTop:64}} initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>
            <button className="btn-hero" onClick={() => setView("dashboard")}>🚀 Start for free</button>
          </motion.div>
        </div>
      </section>

      <hr className="divider"/>

      <section style={{padding:"100px 60px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <Orbs/>
        <motion.div style={{position:"relative",zIndex:1}} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
          <h2 className="font-syne" style={{fontSize:"clamp(26px,4vw,46px)",fontWeight:700,letterSpacing:-1,maxWidth:620,margin:"0 auto 18px"}}>
            Stop overthinking. Start <span className="grad-text">winning conversations.</span>
          </h2>
          <p style={{color:"var(--muted)",marginBottom:34,fontSize:18,fontWeight:300}}>
            Join thousands already using ReplyBro to level up their texting game.
          </p>
          <button className="btn-hero" onClick={() => setView("dashboard")}>🔥 Try ReplyBro Free</button>
        </motion.div>
      </section>

      <hr className="divider"/>
    </>
  );
}
