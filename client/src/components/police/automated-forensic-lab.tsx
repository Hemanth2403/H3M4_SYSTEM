import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Upload, 
    FileSearch, 
    Cpu, 
    Activity, 
    CheckCircle2, 
    AlertTriangle, 
    ShieldAlert, 
    FileText,
    Brain,
    Loader2,
    Binary,
    Terminal,
    ChevronRight,
    Search,
    Fingerprint,
    Eraser,
    Mic,
    Languages,
    Tag,
    Eye,
    MessageSquare,
    Zap,
    Send,
    Database,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ForensicLabProps {
    caseId?: string;
}

type Mode = "threat_scan" | "evidence_analysis" | "redaction";

export function AIForensicLab({ caseId }: ForensicLabProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [activeMode, setActiveMode] = useState<Mode>("threat_scan");
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("");
    const [logs, setLogs] = useState<string[]>([]);
    const [results, setResults] = useState<any | null>(null);
    const [neuralQuery, setNeuralQuery] = useState("");
    const [chat, setChat] = useState<{role: 'user' | 'ai', msg: string}[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const logContainerRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }, [logs]);

    useEffect(() => {
        if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [chat]);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResults(null);
            setProgress(0);
            setLogs([]);
            setChat([]);
        }
    };

    const runAnalysis = async () => {
        if (!file) return;
        setIsAnalyzing(true);
        setResults(null);
        setLogs([]);
        setChat([]);
        
        const steps = activeMode === "threat_scan" ? [
            { p: 10, s: "Initializing H3M4 Forensic Mesh...", l: "Bridge connectivity verified." },
            { p: 40, s: "Scanning for Malware Signatures...", l: "Neural patterns matching 0x88...12." },
            { p: 70, s: "Heuristic Pattern Matching...", l: "Behavioral anomalies detected in stream." },
            { p: 100, s: "Scan Complete.", l: "Found critical threat vectors." }
        ] : activeMode === "evidence_analysis" ? [
            { p: 20, s: "AI Transcription Active...", l: "Transcribing audio to search-ready text." },
            { p: 60, s: "Neural Translation (Local)...", l: "Translating dialects to Standard English." },
            { p: 100, s: "Analysis Complete.", l: "Evidence enrichment successful." }
        ] : [
            { p: 30, s: "Privacy Guard Initializing...", l: "Scanning for PII (Names, IDs, Phones)." },
            { p: 70, s: "Executing Smart Redaction...", l: "Applying permanent cryptographic blur." },
            { p: 100, s: "Redaction Complete.", l: "Ready for judicial sharing." }
        ];

        for (const step of steps) {
            await new Promise(r => setTimeout(r, 800));
            setProgress(step.p);
            setStatus(step.s);
            addLog(step.l);
        }

        setIsAnalyzing(false);
        const findings = activeMode === "threat_scan" ? {
            threatScore: 92,
            verdict: "MALICIOUS ARTIFACT",
            findings: [
                { title: "Encoded Payloads", desc: "Detected base64-exfiltration to 103.22.45.1" },
                { title: "Registry Hooking", desc: "Process attempted persistence via HKLM" }
            ]
        } : activeMode === "evidence_analysis" ? {
            transcription: "...suspect mentioned 'QuickReward' app was used for the sweep. Coordinates mentioned match Mule House B...",
            summary: "Automated analysis confirms intent to defraud via third-party application.",
            tags: ["FRAUD_CONFIRMED", "AUDIO_ENRICHED", "PERSON_DETECTION"]
        } : {
            redactedItems: 18,
            items: [
                { type: "PII", name: "User Identity", status: "MASKED" },
                { type: "GEO", name: "GPS Data", status: "CLEANSED" }
            ]
        };
        
        setResults(findings);
        setChat([{ role: 'ai', msg: "Analysis complete. I've vectorized the findings. What would you like to know about this artifact?" }]);
        toast.success("Reactive AI Node Response Secured");
    };

    const handleChatQuery = async () => {
        if (!neuralQuery.trim()) return;
        const query = neuralQuery;
        setNeuralQuery("");
        setChat(prev => [...prev, { role: 'user', msg: query }]);
        setIsThinking(true);

        // Simulated AI response logic based on context
        await new Promise(r => setTimeout(r, 1500));
        let response = "I'm analyzing the localized vector database for that query...";
        
        if (query.toLowerCase().includes("pay") || query.toLowerCase().includes("money")) {
            response = "The artifact shows clear signs of financial exfiltration patterns. I detected a match with the 'Zeus' variant identified in the 2025 Ledger breach.";
        } else if (query.toLowerCase().includes("who") || query.toLowerCase().includes("suspect")) {
            response = "Correlating metadata with existing case files... Found 88% correspondence with 'Suspect X' profile in Shard #12. Geographic markers point to Eastern European exit nodes.";
        } else {
            response = "Based on the VESTA-4.5 neural mesh, this artifact possesses unauthorized escalation privileges. I recommend immediate isolation and anchor to judicial ledger.";
        }

        setChat(prev => [...prev, { role: 'ai', msg: response }]);
        setIsThinking(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-heading font-black flex items-center gap-2 text-white italic tracking-tighter">
                        <Brain className="h-6 w-6 text-primary" /> H3M4 NEURAL FORENSICS
                    </h2>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Reactive Intelligence Node [v.VESTA-4.5]</p>
                </div>
                <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                    {["threat_scan", "evidence_analysis", "redaction"].map(mode => (
                        <button
                            key={mode}
                            onClick={() => setActiveMode(mode as Mode)}
                            className={cn(
                                "px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all",
                                activeMode === mode ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
                            )}
                        >
                            {mode.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* File Upload & Logs */}
                <div className="lg:col-span-1 space-y-4">
                    <div 
                        className={cn(
                            "glass-panel p-6 rounded-2xl border-dashed border-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer group h-48",
                            file ? "border-primary/50 bg-primary/5" : "border-white/10 hover:border-primary/30"
                        )}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                        <Upload className={cn("h-8 w-8 mb-2 transition-colors", file ? "text-primary" : "text-muted-foreground")} />
                        <h4 className="font-bold text-xs text-white uppercase">{file ? file.name : "Load Evidence"}</h4>
                        <p className="text-[9px] text-muted-foreground mt-2 px-2 uppercase tracking-tighter italic">PCAP, JSON, Media, Dumps</p>
                    </div>

                    <Button 
                        className="w-full h-10 bg-primary text-black font-black text-xs italic"
                        disabled={!file || isAnalyzing}
                        onClick={runAnalysis}
                    >
                        {isAnalyzing ? <Loader2 className="animate-spin h-4 w-4" /> : <Zap className="h-4 w-4 mr-2" />}
                        {isAnalyzing ? "NEURAL MESH SYNC..." : "INITIALIZE AI SCAN"}
                    </Button>

                    <div className="glass-panel p-3 rounded-xl bg-black/60 border border-white/5 h-40 overflow-hidden flex flex-col">
                        <span className="text-[8px] font-black uppercase text-muted-foreground mb-2 flex items-center gap-1">
                            <Terminal className="h-2 w-2" /> Live Node Logs
                        </span>
                        <div ref={logContainerRef} className="flex-1 overflow-y-auto font-mono text-[9px] space-y-1 pr-2 scrollbar-none opacity-60">
                            {logs.map((log, i) => (
                                <div key={i} className="text-foreground/80 lowercase">
                                    <span className="text-primary/70">{">"}</span> {log}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI Interactive Analysis & Results */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                        {/* Results Column */}
                        <div className="md:col-span-2 space-y-4">
                            <AnimatePresence mode="wait">
                                {isAnalyzing ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-10 rounded-2xl border-white/5 h-full flex flex-col items-center justify-center space-y-4">
                                        <Activity className="h-12 w-12 text-primary animate-pulse" />
                                        <div className="text-sm font-mono text-primary animate-bounce">{status}</div>
                                        <Progress value={progress} className="w-48 h-1" />
                                    </motion.div>
                                ) : results ? (
                                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                                        <div className={cn(
                                            "glass-panel p-5 rounded-2xl border-l-4",
                                            activeMode === 'threat_scan' ? "border-l-red-500 bg-red-500/5" : "border-l-primary bg-primary/5"
                                        )}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <Badge className="bg-primary/20 text-primary border-none text-[8px] font-black italic uppercase">Reactive Insight</Badge>
                                                    <h3 className="text-lg font-black mt-1 uppercase italic tracking-tighter">Forensic Vector Report</h3>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-2xl font-black text-primary leading-none">
                                                        {activeMode === 'threat_scan' ? results.threatScore : (activeMode === 'redaction' ? results.redactedItems : "CLEAN")}
                                                    </span>
                                                    <p className="text-[8px] font-bold text-muted-foreground uppercase">{activeMode === 'threat_scan' ? "Severity" : "Units"}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 grid grid-cols-1 gap-2">
                                                {activeMode === "threat_scan" && results.findings.map((f:any, i:number) => (
                                                    <div key={i} className="p-3 rounded-lg bg-black/40 border border-white/5 flex gap-3">
                                                        <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
                                                        <div>
                                                            <div className="text-[10px] font-bold text-white uppercase">{f.title}</div>
                                                            <div className="text-[10px] text-muted-foreground italic">{f.desc}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {activeMode === "evidence_analysis" && (
                                                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                                                        <div className="text-[9px] font-black text-primary mb-2 uppercase tracking-widest flex items-center gap-2">
                                                            <Sparkles className="h-3 w-3" /> Neural Summary
                                                        </div>
                                                        <p className="text-[11px] text-foreground/80 leading-relaxed italic border-l-2 border-primary/30 pl-3">
                                                            {results.summary}
                                                        </p>
                                                        <div className="mt-3 flex gap-2">
                                                            {results.tags.map((t:string) => (
                                                                <Badge key={t} variant="outline" className="text-[8px] border-white/10 uppercase font-bold">{t}</Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Button variant="outline" className="w-full text-[9px] h-8 border-primary/20 text-primary uppercase font-black italic tracking-widest hover:bg-primary/10 transition-all">
                                            Anchor Findings to Judicial Ledger <ChevronRight className="h-3 w-3 ml-2" />
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <div className="glass-panel p-20 rounded-2xl border-white/5 border-dashed border-2 h-full flex flex-col items-center justify-center opacity-30">
                                        <Binary className="h-12 w-12 mb-2 animate-pulse" />
                                        <div className="text-[10px] font-black uppercase tracking-[0.3em]">Handshake Standby</div>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Neural Chat Column */}
                        <div className="md:col-span-1 glass-panel rounded-2xl border-white/5 bg-black/20 flex flex-col overflow-hidden relative border-t-2 border-t-primary/30">
                            <div className="p-3 border-b border-white/5 bg-black/40 flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase text-white flex items-center gap-2 italic">
                                    <MessageSquare className="h-3 w-3 text-primary" /> Neural Query Console
                                </span>
                                <Badge className="bg-primary text-black text-[8px] animate-pulse">Ready</Badge>
                            </div>
                            
                            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
                                {chat.length === 0 && (
                                    <div className="text-[10px] text-muted-foreground italic text-center py-10 opacity-50">
                                        Initialize scan to enable neural dialogue...
                                    </div>
                                )}
                                {chat.map((c, i) => (
                                    <motion.div 
                                        initial={{ opacity: 0, x: c.role === 'user' ? 10 : -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        key={i} 
                                        className={cn(
                                            "max-w-[90%] p-2 rounded-lg text-[10px] leading-relaxed",
                                            c.role === 'user' ? "bg-primary/10 ml-auto text-white border-r-2 border-primary" : "bg-black/40 text-muted-foreground border-l-2 border-primary/50"
                                        )}
                                    >
                                        {c.msg}
                                    </motion.div>
                                ))}
                                {isThinking && (
                                    <div className="flex gap-1 animate-pulse ml-2 text-primary">
                                        <div className="h-1 w-1 rounded-full bg-current" />
                                        <div className="h-1 w-1 rounded-full bg-current" />
                                        <div className="h-1 w-1 rounded-full bg-current" />
                                    </div>
                                )}
                            </div>

                            <div className="p-3 bg-black/40 border-t border-white/5">
                                <form onSubmit={(e) => { e.preventDefault(); handleChatQuery(); }} className="relative">
                                    <Input 
                                        placeholder="Ask AI about artifact..." 
                                        className="h-8 text-[9px] bg-black/60 border-white/10 pr-8 focus-visible:ring-primary"
                                        value={neuralQuery}
                                        onChange={(e) => setNeuralQuery(e.target.value)}
                                        disabled={!results || isThinking}
                                    />
                                    <button 
                                        type="submit"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-white transition-colors"
                                        disabled={!results || isThinking}
                                    >
                                        <Send className="h-3 w-3" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Intelligence Stream */}
            <div className="glass-panel p-3 rounded-xl border border-primary/20 bg-primary/5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 whitespace-nowrap border-r border-primary/20 pr-4">
                        <Database className="h-3 w-3 text-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase text-primary italic">Global Intel Pulse</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex gap-12 whitespace-nowrap animate-marquee py-1">
                            <span className="text-[9px] text-muted-foreground font-mono flex items-center gap-2 uppercase">
                                <Badge className="h-2 w-2 rounded-full p-0 bg-red-500" /> Detected Botnet #9822 exfiltration to 103.44.11
                            </span>
                            <span className="text-[9px] text-muted-foreground font-mono flex items-center gap-2 uppercase">
                                <Badge className="h-2 w-2 rounded-full p-0 bg-blue-500" /> New FIR Shard #0x82 anchored on judicial ledger
                            </span>
                            <span className="text-[9px] text-muted-foreground font-mono flex items-center gap-2 uppercase">
                                <Badge className="h-2 w-2 rounded-full p-0 bg-green-500" /> Node consensual verification reached (12/12)
                            </span>
                            <span className="text-[9px] text-muted-foreground font-mono flex items-center gap-2 uppercase">
                                <Badge className="h-2 w-2 rounded-full p-0 bg-yellow-500" /> AI correlated victim profile with Telegram breach DB
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
