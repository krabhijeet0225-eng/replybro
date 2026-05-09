import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListReplyHistory,
  useDeleteReplyHistory,
  getListReplyHistoryQueryKey,
} from "@workspace/api-client-react";
import type { View } from "@/App";

const MODE_COLORS: Record<string, string> = {
  romantic: "#EC4899",
  funny: "#F59E0B",
  savage: "#EF4444",
  emotional: "#6C63FF",
};

export default function HistoryView({ setView }: { setView: (v: View) => void }) {
  const queryClient = useQueryClient();
  const { data: history = [], isLoading } = useListReplyHistory({ query: { queryKey: getListReplyHistoryQueryKey() } });
  const { mutate: deleteItem } = useDeleteReplyHistory({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListReplyHistoryQueryKey() }) },
  });

  return (
    <section className="dash">
      <div className="orb" style={{width:500,height:500,top:-200,right:-100,background:"rgba(108,99,255,.15)"}}/>
      <div style={{position:"relative",zIndex:1}}>
        <h2 className="font-syne" style={{fontSize:"clamp(22px,3vw,34px)",fontWeight:700,marginBottom:4}}>
          Reply <span className="grad-text">History</span>
        </h2>
        <p style={{color:"var(--muted)",fontSize:14,marginBottom:28}}>Every reply you've generated, saved for reference.</p>

        {isLoading && (
          <div style={{display:"flex",gap:6,justifyContent:"center",padding:"60px 0"}}>
            <span className="typing-dot"/><span className="typing-dot"/><span className="typing-dot"/>
          </div>
        )}

        {!isLoading && (history as any[]).length === 0 && (
          <div style={{textAlign:"center",padding:"80px 0"}}>
            <p style={{fontSize:48,marginBottom:16}}>💬</p>
            <p style={{fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:700,marginBottom:8}}>No replies yet</p>
            <p style={{color:"var(--muted)",marginBottom:24}}>Generate your first reply to see it here.</p>
            <button className="btn-hero" onClick={() => setView("dashboard")}>🔥 Generate a Reply</button>
          </div>
        )}

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:18}}>
          <AnimatePresence>
            {(history as any[]).map((item: any, i: number) => {
              const color = MODE_COLORS[item.mode] || "#6C63FF";
              const date = new Date(item.createdAt);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{opacity:0,y:20}}
                  animate={{opacity:1,y:0}}
                  exit={{opacity:0,scale:.95}}
                  transition={{delay:i*.04}}
                  className="glass-card"
                  style={{padding:22,position:"relative",overflow:"hidden"}}
                >
                  <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${color},transparent)`}}/>

                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:1.5,color,padding:"3px 10px",borderRadius:99,background:`${color}20`,border:`1px solid ${color}40`}}>{item.mode}</span>
                      <span style={{fontSize:12,color:item.interestLevel>=60?"#22D3EE":"#EF4444",fontWeight:700}}>{item.interestLevel}% interest</span>
                    </div>
                    <button
                      onClick={() => (deleteItem as Function)({ id: item.id })}
                      style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted2)",fontSize:18,lineHeight:1,padding:"0 2px"}}
                      title="Delete"
                    >×</button>
                  </div>

                  <p style={{fontSize:12,color:"var(--muted2)",marginBottom:10}}>
                    {date.toLocaleDateString()} · {date.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}
                  </p>

                  <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.6,marginBottom:12,padding:"10px 14px",background:"rgba(255,255,255,.03)",borderRadius:10,border:"1px solid rgba(255,255,255,.05)"}}>
                    {item.conversationSnippet.slice(0,120)}{item.conversationSnippet.length>120?"...":""}
                  </p>

                  <div style={{background:`${color}12`,border:`1px solid ${color}30`,borderRadius:12,padding:"12px 14px"}}>
                    <p style={{fontSize:11,color,fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Reply</p>
                    <p style={{fontSize:14,color:"var(--text)",lineHeight:1.6}}>"{item.reply}"</p>
                  </div>

                  <button
                    className="action-btn"
                    style={{marginTop:12}}
                    onClick={() => navigator.clipboard.writeText(item.reply)}
                  >
                    📋 Copy reply
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
