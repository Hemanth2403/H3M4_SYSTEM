import { useState, useEffect } from "react";
import {
    ShieldAlert,
    Globe,
    Zap,
    Activity,
    Server,
    Lock,
    Eye,
    Terminal,
    Radio,
    Search,
    ChevronRight,
    Crosshair
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CdocMetrics, SecurityEvent, P2PPeer } from "@shared/schema";
import { SecurityAnalyst } from "@/components/security-analyst";

export default function CDOC() {
    const [isPurging, setIsPurging] = useState(false);
    const [isLockdown, setIsLockdown] = useState(false);
    const [lockdownTimer, setLockdownTimer] = useState(30);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isAssetViewOpen, setIsAssetViewOpen] = useState(false);

    // Real-time API Queries
    const { data: metrics } = useQuery<CdocMetrics>({
        queryKey: ["/api/cdoc/metrics"],
        refetchInterval: 2000,
        enabled: !isLockdown && !isPurging
    });

    const { data: peers } = useQuery<P2PPeer[]>({
        queryKey: ["/api/cdoc/peers"],
        refetchInterval: 3000,
        enabled: !isLockdown && !isPurging
    });

    const { data: events } = useQuery<SecurityEvent[]>({
        queryKey: ["/api/cdoc/events"],
        refetchInterval: 5000,
    });

    const [attacks, setAttacks] = useState([...Array(5)].map((_, i) => i));

    const [selectedScan, setSelectedScan] = useState<any>(null);
    const [sentinelMode, setSentinelMode] = useState<"PASSIVE" | "ACTIVE" | "NEURAL">("ACTIVE");
    const [neuralLog, setNeuralLog] = useState<string[]>([]);
    const [isDeepScanning, setIsDeepScanning] = useState(false);
    const [isLedgerChecking, setIsLedgerChecking] = useState(false);
    const [isMissionBriefOpen, setIsMissionBriefOpen] = useState(false);
    const [ledgerStatus, setLedgerStatus] = useState<"SYNCED" | "VERIFYING" | "ALERT">("SYNCED");

    const addEventMutation = useMutation({
        mutationFn: async (event: Omit<SecurityEvent, "id" | "timestamp">) => {
            const res = await apiRequest("POST", "/api/cdoc/events", event);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/cdoc/events"] });
        }
    });

    useEffect(() => {
        if (isLockdown || isPurging) return;

        const interval = setInterval(() => {
            setAttacks(prev => {
                if (prev.length < 12 && Math.random() > 0.7) {
                    return [...prev, prev.length ? Math.max(...prev) + 1 : 0];
                }
                return prev;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, [isLockdown, isPurging]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isLockdown && lockdownTimer > 0) {
            timer = setInterval(() => setLockdownTimer(t => t - 1), 1000);
        } else if (lockdownTimer === 0) {
            setIsLockdown(false);
            setLockdownTimer(30);
            toast.success("Lockdown Protocol Complete", {
                description: "System integrity restored. All nodes purged."
            });
        }
        return () => clearInterval(timer);
    }, [isLockdown, lockdownTimer]);

    const handleLockdown = () => {
        setIsLockdown(true);
        addEventMutation.mutate({
            type: "LOCKDOWN",
            description: "Global Node Isolation Initiated [Protocol 0x99]",
            severity: "CRITICAL"
        });
        toast.error("LOCKDOWN INITIATED", {
            description: "Executing Global Node Isolation [Protocol 0x99]",
            duration: 5000
        });
    };

    const handlePurge = () => {
        setIsPurging(true);
        setAttacks([]); // Clear attacks immediately for visual impact

        toast.loading("TARGET PURGE INITIALIZED", {
            description: "Executing packet-level isolation across Shard #882.",
            duration: 3000
        });

        const purgeSequence = [
            "SCANNING_NODES_FOR_MALICIOUS_VECTORS...",
            "ISOLATING_TARGET_SHARD_882...",
            "REMOVING_VECTORS_AT_EDGE...",
            "FLUSHING_CDN_CACHE_FOR_PURGE...",
            "SHARD_882_INTEGRITY_RESTORED"
        ];

        purgeSequence.forEach((step, i) => {
            setTimeout(() => {
                addEventMutation.mutate({
                    type: "PURGE",
                    description: step,
                    severity: "INFO"
                });

                if (i === 4) {
                    setIsPurging(false);
                    toast.dismiss(); // Remove loading toast
                    toast.success("PURGE COMPLETE", {
                        description: "Network integrity restored. All identified vectors blacklisted."
                    });
                }
            }, (i + 1) * 700);
        });
    };

    const handleThreatHunt = () => {
        setIsAnalyzing(true);
        toast.promise(new Promise(res => setTimeout(res, 3500)), {
            loading: "Cross-referencing active telemetry with Global Threat Feed (MITRE ATT&CK)...",
            success: () => {
                setIsAnalyzing(false);
                return "Hunt Complete: Zero confirmed IOCs originating from known APT groups.";
            },
            error: "Hunt interrupted"
        });
    };

    const handleDeepScan = (scan: any) => {
        setIsDeepScanning(true);
        setSelectedScan(scan);
        toast.loading(`INITIALIZING DEEP_SCAN ON ${scan.id}`, {
            description: "Deconstructing packet headers and routing metadata.",
            duration: 2000
        });

        setTimeout(() => {
            setIsDeepScanning(false);
            toast.success("DEEP_SCAN COMPLETE", {
                description: `Correlation found between node ${scan.id} and previous Red Team signatures.`
            });
        }, 2000);
    };

    const handleVerifyLedger = () => {
        setIsLedgerChecking(true);
        setLedgerStatus("VERIFYING");
        toast.loading("VERIFYING LEDGER INTEGRITY", {
            description: "Executing Merkle Tree reconciliation across all active Shards.",
            duration: 3000
        });

        setTimeout(() => {
            setIsLedgerChecking(false);
            setLedgerStatus("SYNCED");
            toast.success("LEDGER VERIFIED", {
                description: "All blocks matched. Consistency quorum reached (12/12)."
            });
        }, 3500);
    };

    const handleModeChange = (mode: "PASSIVE" | "ACTIVE" | "NEURAL") => {
        setSentinelMode(mode);
        const descriptions = {
            PASSIVE: "Observational mode. Logging all inbound RPC calls without mitigation.",
            ACTIVE: "Standard defense mode. Rate limiting active nodes based on threshold.",
            NEURAL: "Heuristic analysis enabled. Correlating signal entropy in real-time."
        };
        toast.info(`SENTINEL MODE: ${mode}`, {
            description: descriptions[mode]
        });

        if (mode === "NEURAL") {
            setNeuralLog(["INITIALIZING_NEURAL_LAYER...", "LOAD_CORES: 12/12", "PATTERN_MATCHER_SYNCED"]);
        }
    };

    useEffect(() => {
        if (sentinelMode === "NEURAL") {
            const interval = setInterval(() => {
                const patterns = [
                    "ANOMALY_DETECTED: Shard_882_Signal_Spike",
                    "CORRELATING: Peer_X92 <-> Peer_A31",
                    "NEURAL_FILTER: 99.8% Efficiency",
                    "SYNTAX_FLUSH: Success",
                    "HEURISTIC_MATCH: [0x92...F1]"
                ];
                setNeuralLog(prev => [patterns[Math.floor(Math.random() * patterns.length)], ...prev].slice(0, 5));
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [sentinelMode]);

    return (
        <div className="h-[calc(100vh-100px)] w-full overflow-hidden flex flex-col bg-black/95 p-4 gap-4 animate-in fade-in duration-700">
            {/* 1. Tactical Header Bar */}
            <div className="flex-none h-16 border border-white/10 bg-white/5 rounded-xl flex items-center justify-between px-6 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className={cn("h-8 w-8 rounded flex items-center justify-center border", isLockdown ? "bg-red-500/20 border-red-500 animate-pulse" : "bg-primary/20 border-primary")}>
                        <ShieldAlert className={cn("h-5 w-5", isLockdown ? "text-red-500" : "text-primary")} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-[0.2em] leading-none text-white">
                            CDOC <span className="text-primary">WAR ROOM</span>
                        </h1>
                        <div className="flex items-center gap-2 text-[10px] font-mono opacity-60">
                            <span className={cn("h-1.5 w-1.5 rounded-full", isLockdown ? "bg-red-500" : "bg-emerald-500 animate-pulse")} />
                            {isLockdown ? "CRITICAL_LOCKDOWN_ACTIVE" : "OPERATIONAL_STATUS: GREEN"}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="text-right">
                        <div className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Global Threat Level</div>
                        <div className="text-2xl font-black font-mono leading-none flex justify-end items-baseline gap-1">
                            {metrics?.threatLevel || '12'}<span className="text-sm opacity-50">%</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="text-right">
                        <div className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Active Peers</div>
                        <div className="text-2xl font-black font-mono leading-none flex justify-end items-baseline gap-1 text-primary">
                            {peers?.length || '8'}<span className="text-sm opacity-50">/ 12</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Grid Layout */}
            <div className="flex-1 min-h-0 grid grid-cols-12 grid-rows-6 gap-4">

                {/* LEFT PANEL: Intel & Metrics (Row 1-6, Col 1-3) */}
                <div className="col-span-3 row-span-6 flex flex-col gap-4">
                    {/* Metrics Card */}
                    <div className="flex-[2] rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-4 relative overflow-hidden group">
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
                            <Activity className="h-3 w-3" /> System Telemetry
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="p-3 rounded bg-black/40 border border-white/5">
                                <div className="text-[9px] uppercase text-muted-foreground mb-1">Network Entropy</div>
                                <div className="text-lg font-mono text-white">{metrics?.entropy || '94.2'}σ</div>
                                <Progress value={metrics?.entropy || 94} className="h-1 mt-2 bg-white/5" />
                            </div>
                            <div className="p-3 rounded bg-black/40 border border-white/5">
                                <div className="text-[9px] uppercase text-muted-foreground mb-1">Signal Integrity</div>
                                <div className="text-lg font-mono text-white">{metrics?.integrity || '99.9'}%</div>
                                <Progress value={metrics?.integrity || 99} className="h-1 mt-2 bg-white/5" />
                            </div>
                            <div className="p-3 rounded bg-black/40 border border-white/5">
                                <div className="text-[9px] uppercase text-muted-foreground mb-1">Core Load</div>
                                <div className="text-lg font-mono text-white">14%</div>
                                <Progress value={14} className="h-1 mt-2 bg-white/5" />
                            </div>
                        </div>
                    </div>

                    {/* Sentinel Mode Status */}
                    <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col justify-center gap-2">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
                            <Eye className="h-3 w-3" /> Sentinel Mode
                        </h3>
                        <div className="text-xl font-black font-mono text-primary uppercase">{sentinelMode}</div>
                        <p className="text-[10px] text-muted-foreground leading-tight">
                            {sentinelMode === "NEURAL" ? "Heuristic patterns active." : "Standard rule-based filtering."}
                        </p>
                    </div>
                </div>

                {/* CENTER PANEL: The MAP (Row 1-4, Col 4-9) */}
                <div className="col-span-6 row-span-4 rounded-2xl border border-white/10 bg-[#050505] relative overflow-hidden group">
                    {/* Grid BG */}
                    <div className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }}
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)]" />

                    {/* MAP CONTENT */}
                    <div className="relative w-full h-full p-8">
                        {/* SVG Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <defs>
                                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="rgba(38, 217, 98, 0)" />
                                    <stop offset="50%" stopColor="rgba(38, 217, 98, 0.3)" />
                                    <stop offset="100%" stopColor="rgba(38, 217, 98, 0)" />
                                </linearGradient>
                            </defs>
                            {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                                const rad = (deg * Math.PI) / 180;
                                const x2 = 50 + 30 * Math.cos(rad);
                                const y2 = 50 + 30 * Math.sin(rad);
                                return <line key={i} x1="50%" y1="50%" x2={`${x2}%`} y2={`${y2}%`} stroke="url(#lineGradient)" strokeDasharray="4 4" className="opacity-40" />;
                            })}
                        </svg>

                        {/* Radar Sweep */}
                        <AnimatePresence>
                            {isAnalyzing && (
                                <motion.div
                                    initial={{ rotate: 0, opacity: 0 }}
                                    animate={{ rotate: 360, opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute top-1/2 left-1/2 w-[160%] h-[160%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(38,217,98,0.15)_60deg,transparent_100deg)] rounded-full pointer-events-none"
                                />
                            )}
                        </AnimatePresence>

                        {/* Center Core */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                            <div className="relative h-20 w-20 rounded-full bg-black border-2 border-primary/50 flex items-center justify-center shadow-[0_0_30px_rgba(38,217,98,0.2)]">
                                <ShieldAlert className="h-8 w-8 text-primary" />
                                <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" />
                            </div>
                            <div className="mt-2 text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">Core_Sys</div>
                        </div>

                        {/* Nodes representing Listed Companies */}
                        {["JPM", "GS", "MS", "BLK", "C", "WFC"].map((ticker, i) => {
                            const deg = i * 60;
                            const rad = (deg * Math.PI) / 180;
                            const left = 50 + 30 * Math.cos(rad);
                            const top = 50 + 30 * Math.sin(rad);
                            return (
                                <motion.div
                                    key={ticker}
                                    className="absolute flex flex-col items-center group cursor-pointer"
                                    style={{ left: `${left}%`, top: `${top}%`, transform: 'translate(-50%, -50%)' }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => handleDeepScan({ id: ticker, peerId: ticker, type: 'ENTITY_NODE' })}
                                >
                                    <div className={cn(
                                        "h-12 w-12 rounded-xl flex items-center justify-center border transition-all duration-300 relative overflow-hidden",
                                        isAnalyzing ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(38,217,98,0.4)]" : "bg-black/80 border-white/10 group-hover:border-primary/50"
                                    )}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Server className={cn("h-5 w-5", isAnalyzing ? "text-primary" : "text-slate-400 group-hover:text-primary")} />
                                    </div>
                                    <div className="mt-2 px-2 py-1 rounded bg-black/50 border border-white/5 backdrop-blur-md">
                                        <div className="text-[10px] font-black font-mono text-white tracking-widest">{ticker}</div>
                                    </div>
                                    {/* Status Indicator */}
                                    <div className="mt-1 flex items-center gap-1">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[8px] text-emerald-500 font-bold uppercase">SECURE</span>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Attack Packets */}
                        <AnimatePresence>
                            {attacks.map((id) => {
                                const deg = (id % 6) * 60;
                                const rad = (deg * Math.PI) / 180;
                                const startX = 50 + 30 * Math.cos(rad);
                                const startY = 50 + 30 * Math.sin(rad);
                                return (
                                    <motion.div
                                        key={id}
                                        className="absolute h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] z-20"
                                        initial={{ left: `${startX}%`, top: `${startY}%`, opacity: 1, scale: 1 }}
                                        animate={{ left: "50%", top: "50%", opacity: [1, 0.5, 0], scale: 0.5 }}
                                        transition={{ duration: 1.5, ease: "linear" }}
                                    />
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Map Overlay Controls */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
                        <Button
                            size="lg"
                            onClick={handleThreatHunt}
                            disabled={isAnalyzing}
                            className={cn(
                                "h-12 px-8 font-black text-xs uppercase tracking-[0.2em] shadow-2xl border-2 transition-all",
                                isAnalyzing ? "bg-red-500/10 text-red-500 border-red-500 animate-pulse" : "bg-primary text-black border-primary hover:scale-105"
                            )}
                        >
                            {isAnalyzing ? "SCANNING..." : "INITIATE THREAT HUNT"}
                        </Button>
                    </div>

                    {/* Lockdown Overlay Overlay */}
                    <AnimatePresence>
                        {isLockdown && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-red-600/10"
                                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                />
                                <div className="text-center space-y-12 relative z-50">
                                    <motion.div
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: [0.8, 1.2, 0.8] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="text-8xl font-black text-red-500 opacity-20 select-none tracking-tighter"
                                    >
                                        LOCKDOWN
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* RIGHT PANEL: Controls (Row 1-6, Col 10-12) */}
                <div className="col-span-3 row-span-6 flex flex-col gap-4">
                    {/* Actions Group */}
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Response Protocols</h3>
                        <div className="space-y-3">
                            <Button onClick={handleLockdown} disabled={isLockdown} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold tracking-wider">
                                <ShieldAlert className="mr-2 h-4 w-4" /> LOCKDOWN
                            </Button>
                            <Button onClick={handlePurge} disabled={isPurging || isLockdown} variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10 font-bold tracking-wider">
                                <Crosshair className="mr-2 h-4 w-4" /> PURGE VECTORS
                            </Button>
                            <Button onClick={handleVerifyLedger} disabled={isLedgerChecking} variant="outline" className="w-full border-white/10 hover:bg-white/5 font-bold tracking-wider">
                                <Activity className="mr-2 h-4 w-4" /> VERIFY LEDGER
                            </Button>
                        </div>
                    </div>

                    {/* Mitigation Status */}
                    <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-4 space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Countermeasures</h3>
                        <div className="space-y-2">
                            {['IP Rate Limiting', 'WAF Edge Shield', 'Packet Inspection'].map((item) => (
                                <div key={item} className="flex items-center justify-between p-2 rounded bg-black/20 text-[10px]">
                                    <span>{item}</span>
                                    <Badge className="bg-emerald-500/20 text-emerald-500 border-none h-4">ACTIVE</Badge>
                                </div>
                            ))}
                            <div className="flex items-center justify-between p-2 rounded bg-black/20 text-[10px] opacity-70">
                                <span>Quantum Decryption</span>
                                <Badge variant="outline" className="border-white/20 text-muted-foreground h-4">OFFLINE</Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CENTER BOTTOM PANEL: Live Terminal (Row 5-6, Col 4-9) - Spanning 2 Rows */}
                <div className="col-span-6 row-span-2 rounded-xl border border-white/10 bg-black/80 font-mono text-[10px] p-4 flex flex-col overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-2 opacity-20">
                        <Terminal className="h-6 w-6" />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                        <Radio className="h-3 w-3" /> Live Event Stream // Shard_882
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-white/10">
                        <AnimatePresence initial={false}>
                            {[...(events || []), ...(neuralLog.map(l => ({ id: Math.random(), timestamp: new Date(), description: l, severity: 'INFO', type: 'NEURAL' as any })))].slice(0, 8).map((log: any) => (
                                <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2 text-white/70 border-b border-white/5 pb-1">
                                    <span className="opacity-30">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                    <span className={cn(log.severity === 'CRITICAL' ? 'text-red-500' : 'text-emerald-500')}>{log.type}</span>
                                    <span>{log.description}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

            </div>

            {/* Dialogs unchanged */}
            {/* Asset Telemetry Dialog */}
            <Dialog open={isAssetViewOpen} onOpenChange={setIsAssetViewOpen}>
                <DialogContent className="max-w-2xl bg-[#0a0a0b] border-white/10 p-0 overflow-hidden shadow-[0_0_50px_rgba(38,217,98,0.15)]">
                    <div className="p-6 bg-primary/10 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <ShieldAlert className="h-8 w-8 text-primary" />
                                <motion.div
                                    className="absolute inset-0 bg-primary/20 blur-xl rounded-full"
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-heading font-black uppercase tracking-tighter">Sentinel Guard v8.4</DialogTitle>
                                <DialogDescription className="text-xs font-mono opacity-50 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    CORE_STATUS: OPERATIONAL | ID: SG-992-ALPHA
                                </DialogDescription>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            {(["PASSIVE", "ACTIVE", "NEURAL"] as const).map(mode => (
                                <Button
                                    key={mode}
                                    size="sm"
                                    variant={sentinelMode === mode ? "default" : "outline"}
                                    onClick={() => handleModeChange(mode)}
                                    className={cn(
                                        "text-[10px] h-6 font-bold uppercase px-3 transition-all",
                                        sentinelMode === mode ? "bg-primary text-black" : "border-white/10 text-muted-foreground hover:bg-white/5"
                                    )}
                                >
                                    {mode}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 grid grid-cols-3 gap-8">
                        <div className="col-span-2 space-y-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                                        <Activity className="h-3 w-3 text-emerald-500" /> Uptime
                                    </div>
                                    <div className="text-2xl font-mono text-white tracking-widest">1,242:12:45</div>
                                </div>
                                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                                        <Radio className="h-3 w-3 text-primary" /> Sync Lag
                                    </div>
                                    <div className="text-2xl font-mono text-primary tracking-widest">0.08ms</div>
                                </div>
                                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                                        <Crosshair className="h-3 w-3 text-red-500" /> Packet Loss
                                    </div>
                                    <div className="text-2xl font-mono text-emerald-500 tracking-widest">0.0004%</div>
                                </div>
                                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                                        <Lock className="h-3 w-3 text-blue-500" /> Auth Quorum
                                    </div>
                                    <div className="text-2xl font-mono text-white tracking-widest">12/12</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                                    <Terminal className="h-3 w-3 text-primary" /> Mode Performance Insights
                                </h4>
                                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Zap className="h-16 w-16" />
                                    </div>
                                    <div className="relative z-10 space-y-4">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-white uppercase tracking-wider">Mitigation Efficiency</span>
                                            <span className="font-mono text-primary">99.8%</span>
                                        </div>
                                        <Progress value={99.8} className="h-2 bg-white/5" />
                                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                                            Currently in <span className="text-primary font-bold">{sentinelMode}</span> mode.
                                            {sentinelMode === "NEURAL" ? " Deep heuristic analysis is correlating signal noise for latent attack vectors." :
                                                sentinelMode === "ACTIVE" ? " Active monitoring is preventing Shard overflow via edge-based rate limiting." :
                                                    " Observational protocols only. Network metrics are being captured for retrospective analysis."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1 flex flex-col gap-4">
                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                                <Activity className="h-3 w-3 text-white" /> Live Neural Activity
                            </h4>
                            <div className="flex-1 rounded-2xl bg-black/40 border border-white/5 p-4 font-mono text-[9px] overflow-hidden space-y-2">
                                {sentinelMode === "NEURAL" ? (
                                    <AnimatePresence mode="popLayout">
                                        {neuralLog.map((log, i) => (
                                            <motion.div
                                                key={log + i}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="text-primary/70 line-clamp-1 border-l border-primary/20 pl-2 py-0.5"
                                            >
                                                {`> ${log}`}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-center opacity-30 px-4 italic">
                                        Neural analytics disabled in {sentinelMode} mode.
                                    </div>
                                )}
                            </div>
                            <Button
                                onClick={() => handleModeChange("NEURAL")}
                                disabled={sentinelMode === "NEURAL"}
                                className="w-full bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase border border-white/10"
                            >
                                Re-Sync Neural Layer
                            </Button>
                        </div>
                    </div>

                    <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-end gap-3">
                        <Button variant="ghost" size="sm" onClick={() => setIsAssetViewOpen(false)} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">DISMISS</Button>
                        <Button size="sm" onClick={() => setIsAssetViewOpen(false)} className="bg-primary text-black font-bold text-[10px] uppercase tracking-widest px-6 shadow-[0_0_20px_rgba(38,217,98,0.2)]">SYSTEM_CORE_ACK</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Deep Scan Dialog */}
            <Dialog open={!!selectedScan} onOpenChange={(open) => !open && setSelectedScan(null)}>
                <DialogContent className="max-w-md bg-black border-white/10 p-0 overflow-hidden shadow-[0_0_40px_rgba(239,68,68,0.1)]">
                    {selectedScan && (
                        <>
                            <div className="p-6 bg-destructive/10 border-b border-white/5 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-destructive/20 border border-destructive/30 flex items-center justify-center">
                                    <Search className="h-6 w-6 text-destructive" />
                                </div>
                                <div>
                                    <DialogTitle className="text-sm font-black uppercase tracking-widest">DEEP_FORENSIC_SCAN</DialogTitle>
                                    <DialogDescription className="text-[10px] font-mono text-destructive">NODE_ID: {selectedScan.id}</DialogDescription>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Diagnostic Correlation</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-mono">
                                            <span className="opacity-50 text-white">Ingress Port Integrity</span>
                                            <span className="text-emerald-500 font-bold">STABLE</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-mono">
                                            <span className="opacity-50 text-white">Payload Signature</span>
                                            <span className="text-red-500 font-bold">SUSPICIOUS_VAL</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-mono">
                                            <span className="opacity-50 text-white">Routing Entropy</span>
                                            <span className="text-white">92.4σ</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Intelligence Match</span>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed italic border-l-2 border-primary/30 pl-3">
                                        Correlation matrix indicates a 94.2% match with 'Shadow RPC' attack vector observed in Shard 102.
                                    </p>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button
                                        onClick={() => {
                                            toast.error(`NODE ${selectedScan.id} BLACKLISTED`, {
                                                description: "Origin IP blocked at the edge for 24 hours."
                                            });
                                            setSelectedScan(null);
                                        }}
                                        className="flex-1 bg-destructive text-white font-bold text-[10px] uppercase h-9"
                                    >
                                        BLACKLIST NODE
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setSelectedScan(null)}
                                        className="flex-1 border-white/10 text-white font-bold text-[10px] uppercase h-9"
                                    >
                                        QUARANTINE_ONLY
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Mission Brief Dialog */}
            <Dialog open={isMissionBriefOpen} onOpenChange={setIsMissionBriefOpen}>
                <DialogContent className="max-w-2xl bg-black border-white/10 p-0 overflow-hidden shadow-[0_0_50px_rgba(38,217,98,0.1)]">
                    <div className="p-8 space-y-8">
                        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <Terminal className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-heading font-black uppercase tracking-tighter">Mission Brief: Red Team Alpha</DialogTitle>
                                <DialogDescription className="text-xs font-mono opacity-50 uppercase">Operation: Silent Shard | Priority: CRITICAL</DialogDescription>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Objective</h4>
                                <p className="text-sm text-white/80 leading-relaxed font-head">
                                    Neutralize the "Shadow RPC" ingress vectors targeting Shard #882. The attackers are using signal steganography to mask peer coordination.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Success Metrics</h4>
                                <ul className="space-y-2 text-xs font-mono">
                                    <li className="flex items-center gap-2 text-emerald-500">
                                        <div className="h-1 w-1 bg-emerald-500 rounded-full" /> Consensus Quorum: 100%
                                    </li>
                                    <li className="flex items-center gap-2 text-emerald-500">
                                        <div className="h-1 w-1 bg-emerald-500 rounded-full" /> Malicious Peers Purged: 12+
                                    </li>
                                    <li className="flex items-center gap-2 text-white/50">
                                        <div className="h-1 w-1 bg-white/20 rounded-full" /> Latency Delta: &lt;0.05ms
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-3 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                            <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">Technical Intel</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Red Team Alpha has successfully bypassed Shard 102 defenses using a multi-hop relay strategy. We must use <strong>Sentinel Guard v8.4</strong> in <strong>Neural Mode</strong> to identify the underlying communication pattern before executing a full Target Purge.
                            </p>
                        </div>

                        <div className="flex gap-3 justify-end pt-4">
                            <Button variant="ghost" onClick={() => setIsMissionBriefOpen(false)} className="text-xs font-bold uppercase tracking-widest text-muted-foreground">DISMISS</Button>
                            <Button onClick={() => setIsMissionBriefOpen(false)} className="bg-primary text-black font-bold text-xs uppercase tracking-widest px-8 shadow-[0_0_25px_rgba(38,217,98,0.3)]">I UNDERSTAND</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
