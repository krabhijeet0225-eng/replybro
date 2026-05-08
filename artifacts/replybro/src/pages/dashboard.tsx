import { useState } from "react";
import { Layout } from "@/components/layout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  useGenerateReply, 
  useListReplyHistory, 
  useDeleteReplyHistory,
  getListReplyHistoryQueryKey,
  GenerateReplyBodyMode
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Send, Trash2, Zap, Heart, Flame, Smile, Frown, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MODES = [
  { id: "romantic", label: "Romantic", icon: Heart, color: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/20", activeBorder: "border-pink-500" },
  { id: "funny", label: "Funny", icon: Smile, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", activeBorder: "border-amber-500" },
  { id: "savage", label: "Savage", icon: Flame, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", activeBorder: "border-red-500" },
  { id: "emotional", label: "Emotional", icon: Frown, color: "text-indigo-400", bg: "bg-indigo-400/10", border: "border-indigo-400/20", activeBorder: "border-indigo-400" }
] as const;

export default function Dashboard() {
  const [conversation, setConversation] = useState("");
  const [selectedMode, setSelectedMode] = useState<GenerateReplyBodyMode>("funny");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: generateReply, isPending, data: response } = useGenerateReply({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListReplyHistoryQueryKey() });
        toast({ title: "Reply Generated!" });
      },
      onError: (err) => {
        toast({ title: "Failed to generate", description: "Please try again later.", variant: "destructive" });
      }
    }
  });

  const { data: history = [] } = useListReplyHistory({ query: { queryKey: getListReplyHistoryQueryKey() } });
  const { mutate: deleteHistory } = useDeleteReplyHistory({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListReplyHistoryQueryKey() });
      }
    }
  });

  const handleGenerate = () => {
    if (!conversation.trim()) {
      toast({ title: "Wait up!", description: "Paste a conversation first.", variant: "destructive" });
      return;
    }
    generateReply({ data: { conversation, mode: selectedMode } });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Main Generator Area */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-card rounded-3xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 font-serif">What did they say?</h2>
            <textarea 
              value={conversation}
              onChange={(e) => setConversation(e.target.value)}
              placeholder="Paste their text message here..."
              className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-5 text-lg text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
            />
            
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-8 mb-4">Choose the Vibe</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id as GenerateReplyBodyMode)}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                    selectedMode === mode.id 
                      ? `${mode.bg} ${mode.activeBorder} shadow-[0_0_20px_rgba(255,255,255,0.1)]` 
                      : `bg-white/5 ${mode.border} hover:bg-white/10`
                  }`}
                >
                  <mode.icon className={`w-6 h-6 mb-2 ${mode.color}`} />
                  <span className={`text-sm font-semibold ${selectedMode === mode.id ? "text-white" : "text-muted-foreground"}`}>
                    {mode.label}
                  </span>
                  {selectedMode === mode.id && (
                    <motion.div layoutId="activeMode" className="absolute inset-0 rounded-2xl border-2 border-current opacity-30 pointer-events-none" style={{ color: mode.color }} />
                  )}
                </button>
              ))}
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isPending}
              className="w-full mt-8 py-5 rounded-2xl bg-gradient-primary text-white font-bold text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(108,99,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Analyzing context...
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6" />
                  Generate Perfect Reply
                </>
              )}
              {isPending && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
            </button>
          </div>

          <AnimatePresence mode="popLayout">
            {response && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card rounded-3xl p-6 md:p-8 border-primary/30 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary" />
                
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" /> Suggested Reply
                    </h3>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-xl font-medium leading-relaxed">
                      "{response.reply}"
                    </div>
                    
                    <div className="mt-6 flex flex-wrap gap-2">
                      {response.signals.map((sig, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/70">
                          {sig}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="w-full md:w-64 space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Interest Level</h4>
                      <div className="flex items-end gap-2">
                        <span className={`text-5xl font-black ${response.interestLevel > 70 ? 'text-green-400' : response.interestLevel > 40 ? 'text-amber-400' : 'text-red-400'}`}>
                          {response.interestLevel}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Mood Analysis</h4>
                      {Object.entries(response.moodScores).map(([key, value]) => {
                        const modeConfig = MODES.find(m => m.id === key);
                        return (
                          <div key={key} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-medium text-white/60 capitalize">
                              <span>{key}</span>
                              <span>{value}%</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${value}%` }}
                                className={`h-full rounded-full ${modeConfig?.bg.replace('/10', '') || 'bg-primary'}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar History */}
        <div className="lg:col-span-4">
          <div className="glass-panel rounded-3xl p-6 h-full min-h-[600px] flex flex-col">
            <h3 className="text-lg font-bold font-serif mb-6 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" /> History
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {history.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">
                  <p>No replies generated yet.</p>
                </div>
              ) : (
                history.map((item) => {
                  const modeConfig = MODES.find(m => m.id === item.mode) || MODES[0];
                  return (
                    <motion.div 
                      key={item.id} 
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white/5 border border-white/5 p-4 rounded-2xl group hover:border-white/20 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${modeConfig.bg} ${modeConfig.color}`}>
                          {item.mode}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${item.interestLevel > 70 ? 'text-green-400' : item.interestLevel > 40 ? 'text-amber-400' : 'text-red-400'}`}>
                            {item.interestLevel}% interest
                          </span>
                          <button 
                            onClick={() => deleteHistory({ id: item.id })}
                            className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-white/60 line-clamp-2 mb-3">"{item.conversationSnippet}"</p>
                      <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                        <p className="text-sm font-medium text-white line-clamp-3">"{item.reply}"</p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
