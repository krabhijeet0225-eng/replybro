import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Contact = {
  id: number;
  name: string;
  status: string;
  note: string;
  trend: number[];
  last: string;
};

type Advice = {
  advice: string;
  nextMove: string;
  greenFlag: boolean;
};

const INITIAL_CONTACTS: Contact[] = [
  { id:1, name:"Alex", status:"Talking stage", note:"Met at a coffee shop", trend:[55,60,58,70,75,80], last:"2 days ago" },
  { id:2, name:"Jordan", status:"Situationship", note:"College friend, complicated", trend:[70,65,60,55,50,45], last:"yesterday" },
];

function Orbs() {
  return (
    <>
      <div className="orb" style={{width:500,height:500,top:-200,left:-100,background:"rgba(108,99,255,.12)"}}/>
      <div className="orb" style={{width:400,height:400,bottom:0,right:-100,background:"rgba(236,72,153,.08)"}}/>
    </>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return <p style={{fontSize:13,color:"var(--muted2)"}}>Add more data points</p>;
  const h=50, w=220, pad=6;
  const min = Math.min(...data)-5, max = Math.max(...data)+5;
  const pts = data.map((v,i) => [pad+i*(w-2*pad)/(data.length-1), h-pad-(v-min)/(max-min)*(h-2*pad)] as [number,number]);
  const d = "M"+pts.map(p=>p.join(",")).join("L");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i) => <circle key={i} cx={p[0]} cy={p[1]} r={i===pts.length-1?4:2} fill={i===pts.length-1?color:"rgba(255,255,255,.25)"}/>)}
    </svg>
  );
}

export default function Tracker() {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [sel, setSel]           = useState<number>(INITIAL_CONTACTS[0].id);
  const [newName, setNewName]   = useState("");
  const [advice, setAdvice]     = useState<Advice|null>(null);
  const [loading, setLoading]   = useState(false);

  const contact = contacts.find(c => c.id === sel);
  const trend   = contact?.trend ?? [];
  const latest  = trend[trend.length-1] ?? 0;
  const dir     = trend.length>=2 && trend[trend.length-1]>trend[trend.length-2] ? "↑" : "↓";
  const dc      = dir==="↑" ? "#22D3EE" : "#EF4444";

  function addContact() {
    if (!newName.trim()) return;
    const c: Contact = { id: Date.now(), name: newName.trim(), status:"New contact", note:"", trend:[50], last:"just now" };
    setContacts(cs => [...cs, c]);
    setSel(c.id);
    setNewName("");
    setAdvice(null);
  }

  function addPoint(v: number) {
    setContacts(cs => cs.map(c => c.id===sel ? {...c, trend:[...c.trend,v].slice(-12), last:"just now"} : c));
    setAdvice(null);
  }

  async function getAdvice() {
    if (!contact) return;
    setLoading(true); setAdvice(null);
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/replybro/advice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: contact.name, trend: contact.trend, note: contact.note }),
      });
      const data = await res.json();
      setAdvice(data);
    } catch {
      setAdvice({ advice: `The trend with ${contact.name} looks ${dir==="↑"?"positive":"concerning"}. Stay consistent.`, nextMove:"Send a casual voice note or meme.", greenFlag: latest>60 });
    } finally { setLoading(false); }
  }

  return (
    <section className="dash">
      <Orbs/>
      <div style={{position:"relative",zIndex:1}}>
        <h2 className="font-syne" style={{fontSize:"clamp(22px,3vw,34px)",fontWeight:700,marginBottom:4}}>
          Relationship <span className="grad-text">Tracker</span>
        </h2>
        <p style={{color:"var(--muted)",fontSize:14,marginBottom:24}}>Track vibes, interest levels & get AI coaching for every person you're talking to.</p>

        <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:20}}>
          {/* Contact list */}
          <div>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <input className="text-input" placeholder="Add person..." value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key==="Enter" && addContact()}
                style={{flex:1}}
              />
              <button className="btn-nav" style={{borderRadius:10,padding:"10px 14px",flexShrink:0}} onClick={addContact}>+</button>
            </div>
            {contacts.map(c => {
              const lv = c.trend[c.trend.length-1]||0;
              return (
                <div key={c.id} className="tracker-card"
                  style={{borderColor:sel===c.id?"rgba(108,99,255,.5)":"var(--rb-border)",background:sel===c.id?"rgba(108,99,255,.1)":"var(--glass)"}}
                  onClick={() => { setSel(c.id); setAdvice(null); }}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <p style={{fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:15}}>{c.name}</p>
                      <p style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{c.status}</p>
                    </div>
                    <span style={{fontSize:18,color:lv>=60?"#22D3EE":"#EF4444",fontFamily:"Syne,sans-serif",fontWeight:800}}>{lv}%</span>
                  </div>
                  <div className="tracker-bar">
                    <div className="tracker-fill" style={{width:`${lv}%`,background:lv>=60?"var(--grad1)":"linear-gradient(90deg,#EF4444,#F59E0B)"}}/>
                  </div>
                  <p style={{fontSize:11,color:"var(--muted2)"}}>Last: {c.last}</p>
                </div>
              );
            })}
          </div>

          {/* Contact detail */}
          {contact && (
            <motion.div key={contact.id} initial={{opacity:0,x:14}} animate={{opacity:1,x:0}}>
              <div className="glass-card" style={{padding:26,marginBottom:18}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:10}}>
                  <div>
                    <h3 className="font-syne" style={{fontSize:26,fontWeight:800}}>{contact.name}</h3>
                    <p style={{color:"var(--muted)",fontSize:14,marginTop:3}}>{contact.note||"No notes yet"}</p>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <p className="font-syne" style={{fontSize:44,fontWeight:800,lineHeight:1,color:latest>=60?"#22D3EE":"#EF4444"}}>{latest}%</p>
                    <p style={{fontSize:13,color:dc,fontWeight:600}}>Interest {dir==="↑"?"Trending up ↑":"Cooling off ↓"}</p>
                  </div>
                </div>

                <div style={{display:"flex",gap:20,flexWrap:"wrap",alignItems:"flex-start",marginBottom:18}}>
                  <div>
                    <p style={{fontSize:11,color:"var(--muted)",marginBottom:7,textTransform:"uppercase",letterSpacing:1}}>Interest trend</p>
                    <Sparkline data={trend} color={dir==="↑"?"#22D3EE":"#EF4444"}/>
                  </div>
                  <div style={{flex:1}}>
                    <p style={{fontSize:11,color:"var(--muted)",marginBottom:7,textTransform:"uppercase",letterSpacing:1}}>Add data point</p>
                    <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                      {[10,25,40,55,70,85,95].map(v => (
                        <button key={v} className="action-btn" onClick={() => addPoint(v)} style={{fontSize:12}}>{v}%</button>
                      ))}
                    </div>
                  </div>
                </div>

                <button className="btn-generate" onClick={getAdvice} disabled={loading} style={{maxWidth:280}}>
                  {loading ? <><div className="spinner"/>Getting advice...</> : <>🧠 Get AI Coaching</>}
                </button>

                <AnimatePresence>
                  {advice && !loading && (
                    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} style={{marginTop:18,padding:18,borderRadius:14,background:"rgba(108,99,255,.1)",border:"1px solid rgba(108,99,255,.3)"}}>
                      <p style={{fontSize:11,color:"var(--indigo)",marginBottom:8,textTransform:"uppercase",letterSpacing:1,fontWeight:600}}>🧠 AI Advice for {contact.name}</p>
                      <p style={{fontSize:15,lineHeight:1.7,color:"var(--text)",marginBottom:12}}>{advice.advice}</p>
                      <div style={{background:"rgba(34,211,238,.08)",border:"1px solid rgba(34,211,238,.2)",borderRadius:10,padding:12}}>
                        <p style={{fontSize:11,color:"#22D3EE",marginBottom:4,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>→ Next Move</p>
                        <p style={{fontSize:14,color:"var(--text)"}}>{advice.nextMove}</p>
                      </div>
                      <div style={{marginTop:10}}>
                        {advice.greenFlag
                          ? <span style={{fontSize:12,color:"#4ade80",background:"rgba(34,197,94,.1)",padding:"3px 10px",borderRadius:99,border:"1px solid rgba(34,197,94,.2)"}}>🟢 Green flags detected</span>
                          : <span style={{fontSize:12,color:"#f87171",background:"rgba(239,68,68,.1)",padding:"3px 10px",borderRadius:99,border:"1px solid rgba(239,68,68,.2)"}}>🔴 Proceed with caution</span>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
