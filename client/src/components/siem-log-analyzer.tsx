import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SecurityEvent } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Terminal, Database, Globe, Lock, ShieldAlert, Activity, 
    Crosshair, FileText, Filter, AlertTriangle, Eye, Zap 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function SiemLogAnalyzer() {
    const { data: events = [] } = useQuery<SecurityEvent[]>({
        queryKey: ["/api/cdoc/events"],
        refetchInterval: 2000,
    });

    const [activeTab, setActiveTab] = useState<"detection" | "enrichment" | "forensics">("detection");
    const [simulatedLogs, setSimulatedLogs] = useState<any[]>([]);

    useEffect(() => {
        // Hydrate feed with system events
        if (events.length > 0) {
            setSimulatedLogs(prev => {
                const newLogs = events.filter(e => !prev.find(p => p.id === e.id)).map(e => ({
                    ...e,
                    ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                    geo: ["RU", "CN", "US", "IR", "KP"][Math.floor(Math.random() * 5)],
                    mitre: `T${1000 + Math.floor(Math.random() * 500)}`
                }));
                return [...newLogs, ...prev].slice(0, 50);
            });
        }
    }, [events]);

    return (
        <div className="rounded-xl border border-primary/20 bg-black overflow-hidden flex flex-col h-[500px]">
             {/* Header */}
             <div className="h-14 border-b border-primary/20 bg-primary/5 flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-primary" />
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                            Centralized SIEM Analyzer
                            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 text-[9px] h-4 tracking-tighter ml-2">LIVE</Badge>
                        </h3>
                    </div>
                </div>
                <div className="flex bg-black/50 p-1 rounded-lg border border-white/5">
                    {["detection", "enrichment", "forensics"].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${activeTab === tab ? "bg-primary text-black" : "text-muted-foreground hover:text-white"}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* Left Feed: Active based on tab */}
                <div className="flex-[3] border-r border-white/10 flex flex-col bg-[#050505]">
                    
                    {activeTab === "detection" && (
                        <>
                            <div className="p-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between text-xs font-mono text-muted-foreground">
                                <span className="flex items-center gap-2"><Activity className="h-4 w-4" /> Real-Time Detection Feed</span>
                                <span className="text-primary animate-pulse">Scanning for anomalies...</span>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[10px]">
                                <AnimatePresence initial={false}>
                                    {simulatedLogs.map((log) => (
                                        <motion.div 
                                            key={log.id} 
                                            initial={{ opacity: 0, x: -20 }} 
                                            animate={{ opacity: 1, x: 0 }} 
                                            className={`p-2 rounded border flex flex-col gap-1 transition-colors ${log.severity === 'CRITICAL' ? 'bg-red-500/10 border-red-500/30' : log.severity === 'HIGH' ? 'bg-orange-500/10 border-orange-500/30' : 'bg-primary/5 border-primary/20'}`}
                                        >
                                            <div className="flex justify-between items-center text-muted-foreground">
                                                <span>[{new Date(log.timestamp).toLocaleTimeString()}] INGRESS &rarr; {log.id.split('-')[0]}</span>
                                                <Badge variant="outline" className={`text-[8px] h-3 uppercase ${log.severity === 'CRITICAL' ? 'text-red-500 border-red-500' : 'text-primary border-primary'}`}>
                                                    {log.type}
                                                </Badge>
                                            </div>
                                            <div className="text-white/80">{log.description}</div>
                                        </motion.div>
                                    ))}
                                    {simulatedLogs.length === 0 && (
                                        <div className="text-center opacity-30 italic py-10">Awaiting incident telemetry...</div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    )}

                    {activeTab === "enrichment" && (
                        <>
                            <div className="p-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between text-xs font-mono text-muted-foreground">
                                <span className="flex items-center gap-2"><Globe className="h-4 w-4" /> Contextual Log Enrichment</span>
                                <span>OSINT Correlation</span>
                            </div>
                            <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
                                {simulatedLogs.slice(0, 3).map((log, i) => (
                                    <div key={i} className="rounded-xl border border-white/10 bg-black p-4 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 h-full w-2 bg-gradient-to-b from-blue-500 to-purple-500 opacity-50" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Raw Target</div>
                                                <div className="font-mono text-xs text-white">{log.description.substring(0, 30)}...</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Enriched Context</div>
                                                <div className="flex gap-2">
                                                    <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">IP: {log.ip}</Badge>
                                                    <Badge className="bg-purple-500/20 text-purple-500 border-purple-500/30">GEO: {log.geo}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                                    <h4 className="text-xs font-bold text-blue-500 uppercase flex items-center gap-2"><Filter className="h-4 w-4"/> Rules Engine Applied</h4>
                                    <p className="text-[10px] text-muted-foreground">Adding IP context, mapping threat intelligence identities, and prioritizing vulnerability exposure before final dispatch.</p>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "forensics" && (
                        <>
                            <div className="p-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between text-xs font-mono text-muted-foreground">
                                <span className="flex items-center gap-2"><FileText className="h-4 w-4" /> Post-Incident Review & Compliance</span>
                                <span className="text-emerald-500">ISO-27037 Ready</span>
                            </div>
                            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Incident Containment Path</h4>
                                    {[
                                        { label: "Anomaly Detected", time: "+0.00s", color: "text-red-500" },
                                        { label: "Systems Isolated (Containment)", time: "+0.32s", color: "text-orange-500" },
                                        { label: "Root Cause Analyzed (Forensics)", time: "+1.15s", color: "text-blue-500" },
                                        { label: "Immutable Ledger Update", time: "+2.04s", color: "text-emerald-500" },
                                    ].map((step, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="w-16 font-mono text-[10px] text-right text-muted-foreground">{step.time}</div>
                                            <div className="h-2 w-2 rounded-full border border-white bg-white/10" />
                                            <div className={`font-mono text-xs font-bold ${step.color}`}>{step.label}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 rounded border border-white/10 bg-black/50 space-y-2">
                                    <h4 className="text-[10px] uppercase font-bold text-white tracking-widest flex items-center gap-2">
                                        <Lock className="h-3 w-3" /> Standardized Reporting
                                    </h4>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed text-justify">
                                        Forensic reconstruction successful. Chronological records rebuilt and cross-correlated. Audit trails formatted strictly to GDPR & HIPAA compliance parameters and anchored entirely on-chain to prevent modification/recurrence.
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                </div>

                {/* Right Panel: Global Dashboard Metrics */}
                <div className="flex-[1.5] bg-card/20 p-4 flex flex-col gap-4">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center border-b border-white/10 pb-2">Analysis Heuristics</h4>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-muted-foreground">Noise Reduction</span>
                            <span className="text-emerald-500 font-bold">94%</span>
                        </div>
                        <Progress value={94} className="h-1 bg-white/10 [&>div]:bg-emerald-500" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-muted-foreground">Alert Accuracy</span>
                            <span className="text-blue-500 font-bold">99.8%</span>
                        </div>
                        <Progress value={99.8} className="h-1 bg-white/10 [&>div]:bg-blue-500" />
                    </div>

                    <div className="mt-auto space-y-3">
                        <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg text-center space-y-1">
                            <ShieldAlert className="h-4 w-4 text-red-500 mx-auto" />
                            <div className="text-[10px] font-bold text-red-500 uppercase">Proactive Alerts</div>
                            <div className="text-xl font-mono text-white font-black">{simulatedLogs.filter(l => l.severity === 'CRITICAL').length}</div>
                        </div>
                        <div className="text-center text-[9px] text-muted-foreground leading-tight px-2">
                            SIEM intelligence correlates cross-system behavior dynamically isolating threats faster.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
