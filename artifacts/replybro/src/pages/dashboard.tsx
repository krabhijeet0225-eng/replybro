import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useGenerateReply,
  useListReplyHistory,
  useDeleteReplyHistory,
  getListReplyHistoryQueryKey,
} from "@workspace/api-client-react";

const MOCK_CONV = `Them: hey, you coming to jake's party saturday?
Me: maybe idk still deciding
Them: oh okay... no worries
Me: why do you ask
Them: just wanted to know if i'd see you there ig`;

const MODES = [
  { id:"romantic",  label:"Romantic",  icon:"💝", color:"#EC4899" },
  { id:"funny",     label:"Funny",     icon:"😂", color:"#F59E0B" },
  { id:"savage",    label:"Savage",    icon:"🔥", color:"#EF4444" },
  { id:"emotional", label:"Emotional", icon:"🫂", color:"#6C63FF" },
] as const;

const LANGUAGES = [
  { id:"english",    label:"🇺🇸 English"  },
  { id:"spanish",    label:"🇪🇸 Spanish"  },
  { id:"french",     label:"🇫🇷 French"   },
  { id:"hindi",      label:"🇮🇳 Hindi"    },
  { id:"japanese",   label:"🇯🇵 Japanese" },
  { id:"portuguese", label:"🇧🇷 Portug."  },
];

type ModeId = typeof MODES[number]["id"];

type GenerateResult = {
  variants: string[];
  mood: { flirty: number; playful: number; tension: number; warmth: number };
  interestLevel: number;
  signals: string[];
};

type RizzResult = {
  score: number;
  grade: string;
  verdict: string;
  pros: string[];
  cons: string[];
  improved: string;
};

function Orbs() {
  return (
    <>
      <div className="orb" style={{width:500,height:500,top:-200,left:-100,background:"rgba(108,99,255,.15)"}}/>
      <div className="orb" style={{width:400,height:400,bottom:0,right:-100,background:"rgba(59,130,246,.1)"}}/>
    </>
  );
}

function ArcMeter({ value }: { value: number }) {
  const r=70,cx=90,cy=88,sw=9,circ=Math.PI*r;
  const color = value>=70?"#22D3EE":value>=40?"#A78BFA":"#EF4444";
  const label = value>=75?"Very Interested 🔥":value>=50?"Kinda Interested 👀":value>=30?"Lukewarm 😐":"Not That Into It 💀";
  return (
    <div>
      <div style={{display:"flex",justifyContent:"center",padding:"6px 0 0"}}>
        <svg width="180" height="96" viewBox="0 0 180 96">
          <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth={sw} strokeLinecap="round"/>
          <motion.path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
            strokeDasharray={`${circ} ${circ}`}
            initial={{strokeDashoffset:circ}} animate={{strokeDashoffset:circ-(value/100)*circ}}
            transition={{duration:1.2,ease:"easeOut"}}/>
          <text x="90" y="80" textAnchor="middle" fill={color} fontSize="22" fontWeight="700" fontFamily="Syne,sans-serif">{value}%</text>
        </svg>
      </div>
      <p style={{textAlign:"center",fontFamily:"Syne,sans-serif",fontSize:18,fontWeight:700,color,marginTop:4}}>{value}%</p>
      <p style={{textAlign:"center",fontSize:13,color:"var(--muted)",marginTop:3}}>{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab]         = useState<"generate"|"rizz">("generate");
  const [conv, setConv]       = useState(MOCK_CONV);
  const [mode, setMode]       = useState<ModeId>("romantic");
  const [lang, setLang]       = useState("english");
  const [selV, setSelV]       = useState(0);
  const [copied, setCopied]   = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [opener, setOpener]   = useState("");

  const queryClient = useQueryClient();

  const { mutate: generateReply, isPending, data: result } = useGenerateReply({
    mutation: {
      onSuccess: () => {
        setSelV(0);
        queryClient.invalidateQueries({ queryKey: getListReplyHistoryQueryKey() });
      },
    },
  }) as { mutate: Function; isPending: boolean; data: GenerateResult | undefined };

  const { mutate: scoreRizz, isPending: rLoad, data: rResult } = useMutation({
    mutationFn: async (o: string): Promise<RizzResult> => {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/replybro/rizz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opener: o }),
      });
      return res.json();
    },
  });

  const { data: history = [] } = useListReplyHistory({ query: { queryKey: getListReplyHistoryQueryKey() } });
  const { mutate: deleteItem } = useDeleteReplyHistory({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListReplyHistoryQueryKey() }) },
  });

  function copy() {
    if (result?.variants?.[selV]) {
      navigator.clipboard.writeText(result.variants[selV]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function speak() {
    if (!result?.variants?.[selV]) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const utt = new SpeechSynthesisUtterance(result.variants[selV]);
    utt.rate=.95; utt.pitch=1.05;
    utt.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utt);
  }

  const rc = rResult ? (rResult.score>=80?"#22D3EE":rResult.score>=60?"#A78BFA":rResult.score>=40?"#F59E0B":"#EF4444") : "#6C63FF";

  return (
    <section className="dash">
      <Orbs/>
      <div style={{position:"relative",zIndex:1}}>
        <h2 className="font-syne" style={{fontSize:"clamp(22px,3vw,34px)",fontWeight:700,marginBottom:4}}>
          AI Reply <span className="grad-text">Dashboard</span>
        </h2>
        <p style={{color:"var(--muted)",fontSize:14,marginBottom:20}}>Paste your chat · Pick a vibe · Get the perfect reply</p>

        <div className="tabs">
          {([["generate","✨ Generate Reply"],["rizz","🎯 Rizz Score"]] as const).map(([id,label]) => (
            <button key={id} className={`tab-btn ${tab===id?"active":""}`} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>

        <div className="dash-grid">
          {/* ── Main column ── */}
          <div>
            <AnimatePresence mode="wait">
              {tab==="generate" && (
                <motion.div key="gen" initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:10}}>
                  <div className="glass-card" style={{padding:24,marginBottom:20}}>
                    <p style={{fontSize:12,color:"var(--muted)",letterSpacing:2,textTransform:"uppercase",fontWeight:600,marginBottom:10}}>Their message</p>
                    <textarea
                      className="chat-textarea"
                      value={conv}
                      onChange={e => setConv(e.target.value)}
                      placeholder="Paste their texts here..."
                    />

                    <p style={{fontSize:12,color:"var(--muted)",letterSpacing:2,textTransform:"uppercase",fontWeight:600,margin:"18px 0 4px"}}>Pick a vibe</p>
                    <div className="modes-grid">
                      {MODES.map(m => (
                        <button key={m.id} className={`mode-btn ${mode===m.id?"active":""}`} onClick={() => setMode(m.id)}
                          style={mode===m.id?{borderColor:m.color,background:`${m.color}22`,color:"var(--text)"}:{}}>
                          <span style={{fontSize:20}}>{m.icon}</span>
                          {m.label}
                        </button>
                      ))}
                    </div>

                    <p style={{fontSize:12,color:"var(--muted)",letterSpacing:2,textTransform:"uppercase",fontWeight:600,margin:"16px 0 4px"}}>Language</p>
                    <div className="lang-grid">
                      {LANGUAGES.map(l => (
                        <button key={l.id} className={`lang-btn ${lang===l.id?"active":""}`} onClick={() => setLang(l.id)}>{l.label}</button>
                      ))}
                    </div>

                    <button className="btn-generate" disabled={isPending} onClick={() => {
                      if (!conv.trim()) return;
                      (generateReply as Function)({ data: { conversation: conv, mode, lang } });
                    }}>
                      {isPending ? <><div className="spinner"/> Analyzing...</> : <>✨ Generate Reply</>}
                    </button>
                  </div>

                  <AnimatePresence>
                    {result && (
                      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                        {/* Variant cards */}
                        <p style={{fontSize:12,color:"var(--muted)",letterSpacing:2,textTransform:"uppercase",fontWeight:600,marginBottom:12}}>Pick your reply</p>
                        {result.variants.map((v, i) => (
                          <div key={i} className={`variant-card ${selV===i?"selected":""}`} onClick={() => setSelV(i)}>
                            <p style={{fontSize:12,color:"var(--muted)",marginBottom:6}}>Option {i+1}</p>
                            <p style={{fontSize:15,lineHeight:1.6,color:"var(--text)"}}>{v}</p>
                          </div>
                        ))}

                        {/* Actions */}
                        <div className="response-actions">
                          <button className="action-btn" onClick={copy}>{copied?"✓ Copied!":"📋 Copy"}</button>
                          <button className={`voice-btn ${speaking?"speaking":""}`} onClick={speak}>
                            🔊 {speaking?"Stop":"Hear it"}
                          </button>
                        </div>

                        {/* Signals */}
                        {result.signals?.length > 0 && (
                          <div style={{marginTop:16}}>
                            <p style={{fontSize:12,color:"var(--muted)",letterSpacing:2,textTransform:"uppercase",fontWeight:600,marginBottom:8}}>Conversation signals</p>
                            <div className="chips">
                              {result.signals.map((s,i) => <span key={i} className="chip">{s}</span>)}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {tab==="rizz" && (
                <motion.div key="rizz" initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}}>
                  <div className="glass-card" style={{padding:24,marginBottom:20}}>
                    <p style={{fontSize:12,color:"var(--muted)",letterSpacing:2,textTransform:"uppercase",fontWeight:600,marginBottom:10}}>Your opening line</p>
                    <input
                      className="text-input"
                      placeholder="e.g. 'hey, you look like trouble 😏'"
                      value={opener}
                      onChange={e => setOpener(e.target.value)}
                      onKeyDown={e => e.key==="Enter" && opener.trim() && scoreRizz(opener)}
                    />
                    <button className="btn-generate" disabled={rLoad} style={{marginTop:12}} onClick={() => opener.trim() && scoreRizz(opener)}>
                      {rLoad ? <><div className="spinner"/> Analyzing rizz...</> : <>🎯 Score My Rizz</>}
                    </button>
                  </div>

                  <AnimatePresence>
                    {rResult && (
                      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                        <div className="glass-card" style={{padding:24}}>
                          {/* Score circle */}
                          <div style={{display:"flex",alignItems:"center",gap:24,marginBottom:20,flexWrap:"wrap"}}>
                            <div style={{textAlign:"center"}}>
                              <div style={{width:90,height:90,borderRadius:"50%",border:`3px solid ${rc}`,display:"flex",alignItems:"center",justifyContent:"center",background:`${rc}15`}}>
                                <span style={{fontSize:28,fontWeight:800,color:rc,fontFamily:"Syne,sans-serif"}}>{rResult.score}</span>
                              </div>
                              <p style={{fontSize:22,fontWeight:800,color:rc,fontFamily:"Syne,sans-serif",marginTop:6}}>{rResult.grade}</p>
                            </div>
                            <div style={{flex:1}}>
                              <p style={{fontSize:18,fontWeight:600,color:"var(--text)",marginBottom:8,fontFamily:"Syne,sans-serif"}}>{rResult.verdict}</p>
                            </div>
                          </div>

                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                            <div style={{background:"rgba(34,197,94,.08)",border:"1px solid rgba(34,197,94,.2)",borderRadius:12,padding:14}}>
                              <p style={{fontSize:11,color:"#4ade80",fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>✓ What works</p>
                              {rResult.pros.map((p,i) => <p key={i} style={{fontSize:13,color:"var(--muted)",marginBottom:4}}>• {p}</p>)}
                            </div>
                            <div style={{background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.2)",borderRadius:12,padding:14}}>
                              <p style={{fontSize:11,color:"#f87171",fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>✗ What misses</p>
                              {rResult.cons.map((c,i) => <p key={i} style={{fontSize:13,color:"var(--muted)",marginBottom:4}}>• {c}</p>)}
                            </div>
                          </div>

                          <div style={{background:"rgba(108,99,255,.1)",border:"1px solid rgba(108,99,255,.3)",borderRadius:12,padding:14}}>
                            <p style={{fontSize:11,color:"var(--violet)",fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>✨ Upgraded version</p>
                            <p style={{fontSize:15,color:"var(--text)",fontStyle:"italic"}}>"{rResult.improved}"</p>
                            <button className="action-btn" style={{marginTop:10}} onClick={() => navigator.clipboard.writeText(rResult.improved)}>📋 Copy improved</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Sidebar ── */}
          <div>
            {/* Interest meter */}
            {result && (
              <div className="side-card" style={{marginBottom:18}}>
                <p className="side-card-title"><span className="side-dot" style={{background:"#22D3EE"}}/> Interest Level</p>
                <ArcMeter value={result.interestLevel}/>
              </div>
            )}

            {/* Mood breakdown */}
            {result && (
              <div className="side-card" style={{marginBottom:18}}>
                <p className="side-card-title"><span className="side-dot" style={{background:"#A78BFA"}}/> Mood Analysis</p>
                {Object.entries(result.mood).map(([key, val]) => {
                  const colors: Record<string,string> = {flirty:"#EC4899",playful:"#F59E0B",tension:"#EF4444",warmth:"#22D3EE"};
                  return (
                    <div key={key} className="mood-item">
                      <span className="mood-label">{key}</span>
                      <div className="mood-bar-bg">
                        <motion.div className="mood-bar-fill" initial={{width:0}} animate={{width:`${val}%`}} transition={{duration:.8,ease:"easeOut"}}
                          style={{background:colors[key]||"var(--indigo)"}}/>
                      </div>
                      <span className="mood-val">{val}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* History */}
            <div className="side-card">
              <p className="side-card-title"><span className="side-dot" style={{background:"var(--indigo)"}}/> Recent History</p>
              {history.length === 0 ? (
                <p style={{fontSize:13,color:"var(--muted2)",textAlign:"center",padding:"16px 0"}}>No replies yet</p>
              ) : (
                (history as any[]).slice(0,5).map((item: any) => (
                  <motion.div key={item.id} layout initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} className="hist-card" style={{marginBottom:10,position:"relative"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <span style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:1,color:"var(--indigo)"}}>{item.mode}</span>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:12,color:item.interestLevel>=60?"#22D3EE":"#EF4444",fontWeight:700}}>{item.interestLevel}%</span>
                        <button onClick={() => (deleteItem as Function)({ id: item.id })} style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted2)",fontSize:14,lineHeight:1}}>×</button>
                      </div>
                    </div>
                    <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
                      "{item.reply}"
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
