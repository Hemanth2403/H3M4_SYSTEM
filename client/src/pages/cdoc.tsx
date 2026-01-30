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

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        toast.promise(new Promise(res => setTimeout(res, 2500)), {
            loading: "Running Fourier Transform on ingress signals...",
            success: () => {
                setIsAnalyzing(false);
                return "Signal Clean: No hidden steganographic payloads detected.";
            },
            error: "Scan interrupted"
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
        <div className="h-[calc(100vh-120px)] overflow-hidden flex flex-col gap-6 animate-in fade-in duration-700">
            {/* Header / Emergency Broadcast */}
            <div className={cn(
                "flex items-center justify-between px-6 py-4 rounded-xl border transition-all duration-500",
                isLockdown ? "bg-red-500/20 border-red-500 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.3)]" : "bg-destructive/10 border-destructive/20 animate-pulse"
            )}>
                <div className="flex items-center gap-4">
                    <Radio className={cn("h-6 w-6", isLockdown ? "text-red-500" : "text-destructive")} />
                    <div>
                        <h2 className={cn("text-sm font-heading font-extrabold uppercase tracking-tighter", isLockdown ? "text-red-500" : "text-destructive")}>
                            {isLockdown ? `CRITICAL SYSTEM LOCKDOWN: 00:00:${lockdownTimer.toString().padStart(2, '0')}` : "System Wide Alert: Active Infiltration Simulation"}
                        </h2>
                        <p className={cn("text-[10px] font-mono", isLockdown ? "text-red-500/70" : "text-destructive/80")}>
                            {isLockdown ? "NETWORK_NODES_DETACHED | ENCRYPTED_VAULT_ACTIVE" : "ENCRYPTED_SIGNAL_DETACHED | SOURCE: RED_TEAM_ALPHA"}
                        </p>
                    </div>
                </div>
                <Badge variant="outline" className={cn("font-bold text-[10px]", isLockdown ? "bg-red-500/10 border-red-500 text-red-500" : "bg-destructive/10 border-destructive text-destructive")}>
                    THREAT_LVL: {isLockdown ? '99' : metrics?.threatLevel || '70'}%
                </Badge>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
                {/* Left: Global Visualization (The WOW Factor) */}
                <div className="lg:col-span-3 flex flex-col gap-6 overflow-hidden">
                    <div className="flex-1 glass-panel rounded-2xl relative overflow-hidden bg-black/40 border-white/5 p-6 flex items-center justify-center">
                        {/* Abstract animated grid map */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #26d962 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                        </div>

                        <div className="relative w-full h-full flex flex-col items-center justify-center">
                            <div className="relative">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                    className="w-[450px] h-[450px] rounded-full border border-primary/10 flex items-center justify-center relative"
                                >
                                    <div className="w-[350px] h-[350px] rounded-full border-2 border-primary/5 border-dashed" />
                                    <div className="w-[200px] h-[200px] rounded-full border border-primary/20" />

                                    {/* Scanning Beam */}
                                    <motion.div
                                        className="absolute top-1/2 left-1/2 w-1/2 h-1 bg-gradient-to-r from-primary to-transparent origin-left"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        style={{ top: 'calc(50% - 0.5px)', left: '50%' }}
                                    />

                                    {/* Orbiting Nodes */}
                                    {[...Array(3)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute h-2 w-2 bg-primary rounded-full shadow-[0_0_10px_rgba(38,217,98,0.8)]"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
                                            style={{
                                                top: '50%',
                                                left: '50%',
                                                marginLeft: -4,
                                                marginTop: -4,
                                                transformOrigin: `${120 + i * 40}px center`
                                            }}
                                        />
                                    ))}
                                </motion.div>

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center space-y-2">
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <Globe className="h-28 w-28 text-primary mx-auto" />
                                        </motion.div>
                                        <div className="font-mono text-[8px] text-primary/60 tracking-[0.4em] uppercase">Sector_Sync_Active</div>
                                    </div>
                                </div>

                                {/* Animated "Attacks" */}
                                <AnimatePresence>
                                    {attacks.map((id) => (
                                        <motion.div
                                            key={id}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{
                                                scale: [0, 1.5, 0],
                                                opacity: [0, 0.8, 0],
                                                x: [Math.random() * 400 - 200, Math.random() * 200 - 100],
                                                y: [Math.random() * 400 - 200, Math.random() * 200 - 100]
                                            }}
                                            exit={{ scale: 2, opacity: 0 }}
                                            transition={{ duration: 4, repeat: Infinity, delay: (id % 5) * 1.5 }}
                                            className="absolute h-4 w-4 rounded-full bg-destructive shadow-[0_0_20px_rgba(239,68,68,0.8)]"
                                        />
                                    ))}
                                </AnimatePresence>

                                {/* Waveform Scan Overlay */}
                                <AnimatePresence>
                                    {isAnalyzing && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: "100%" }}
                                            exit={{ height: 0 }}
                                            className="absolute top-0 left-0 w-full bg-primary/10 border-b-2 border-primary z-20 pointer-events-none"
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Overlay Controls */}
                        <div className="absolute top-6 left-6 grid grid-cols-1 gap-4">
                            <div className="p-4 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md space-y-2 min-w-[150px]">
                                <h3 className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                                    <Activity className="h-3 w-3 text-primary" /> Entropy
                                </h3>
                                <div className="text-xl font-mono font-bold text-white tracking-widest">
                                    {metrics?.entropy || '92.4'}<span className="text-[10px] text-muted-foreground ml-1">σ</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md space-y-2 min-w-[150px]">
                                <h3 className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                                    <Zap className="h-3 w-3 text-orange-500" /> Integrity
                                </h3>
                                <div className="text-xl font-mono font-bold text-white tracking-widest">
                                    {metrics?.integrity || '99.9'}<span className="text-[10px] text-muted-foreground ml-1">%</span>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-6 right-6 p-4 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md space-y-2 text-right">
                            <h3 className="text-[10px] font-bold text-muted-foreground uppercase">Signal Strength</h3>
                            <div className="flex gap-1 justify-end items-end h-6">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: (parseFloat(metrics?.signalStrength || '88') > (i * 15)) ? [8, 16, 12] : 4 }}
                                        transition={{ duration: 0.5, repeat: Infinity }}
                                        className={cn("w-1.5 rounded-full", (parseFloat(metrics?.signalStrength || '88') > (i * 15)) ? "bg-primary" : "bg-white/10")}
                                    />
                                ))}
                            </div>
                            <div className="text-[8px] font-mono text-muted-foreground">{metrics?.signalStrength || '88.1'} dBm</div>
                        </div>

                        <div className="absolute bottom-6 right-6">
                            <Button
                                size="sm"
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                className="bg-primary text-black font-bold text-xs gap-2 shadow-[0_0_20px_rgba(38,217,98,0.3)]"
                            >
                                {isAnalyzing ? <Activity className="h-3 w-3 animate-spin" /> : <Search className="h-3 w-3" />}
                                {isAnalyzing ? "SCANNING..." : "ANALYZE WAVEFORM"}
                            </Button>
                        </div>
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

                    {/* Lower Stream */}
                    <div className="h-40 glass-panel rounded-2xl bg-[#0c141c]/40 border-white/5 flex flex-col font-mono text-[10px] text-primary/80">
                        <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Terminal className="h-3 w-3" /> LIVE_P2P_FORENSICS
                            </div>
                            <div className="text-[8px] opacity-50 uppercase tracking-widest">Shard: #882-9</div>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-1 scrollbar-hide">
                            <AnimatePresence mode="popLayout">
                                {events?.map((event: SecurityEvent) => (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={cn(
                                            "flex gap-3 font-bold items-center p-1 px-2 rounded",
                                            event.type === 'PURGE' || event.type === 'LOCKDOWN' ? "bg-primary/10 text-primary" : "text-primary/70"
                                        )}
                                    >
                                        <span className="opacity-40 font-mono text-[8px]">[{new Date(event.timestamp).toLocaleTimeString()}]</span>
                                        <span className="flex-1">--- {event.description} ---</span>
                                        <Badge variant="outline" className="text-[8px] h-3 border-primary/30 uppercase">{event.severity}</Badge>
                                    </motion.div>
                                ))}

                                {peers?.map((scan: P2PPeer) => (
                                    <motion.div
                                        key={scan.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="grid grid-cols-7 gap-2 items-center hover:bg-white/5 p-1 rounded transition-colors group"
                                    >
                                        <span className="text-white/20 col-span-1">[{new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                                        <span className="text-primary font-bold col-span-1">PEER_{scan.peerId}</span>
                                        <span className="opacity-50 font-mono text-[9px] truncate col-span-1">{scan.hash}</span>
                                        <span className="col-span-1 text-muted-foreground">{scan.isp}</span>
                                        <Badge variant="outline" className="col-span-1 text-[8px] h-4 inline-flex items-center justify-center opacity-70 group-hover:opacity-100">{scan.type}</Badge>
                                        <div className="col-span-1 flex items-center gap-1">
                                            <div className={cn("h-1 w-1 rounded-full", scan.status === 'VALID' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse')} />
                                            <span className={cn(scan.status === 'VALID' ? 'text-emerald-500' : 'text-red-500 font-bold')}>{scan.status}</span>
                                        </div>
                                        <div className="col-span-1 flex items-center gap-2">
                                            <Progress value={parseInt(scan.reputation)} className="h-1 bg-white/5 w-8" />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleDeepScan(scan)}
                                            >
                                                <Search className="h-2 w-2 text-primary" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Right: Operational Controls */}
                <div className="flex flex-col gap-6">
                    <div className="p-6 rounded-2xl bg-card/20 border border-white/10 space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Zap className="h-4 w-4 text-orange-500" /> Auto-Mitigation
                            </h3>
                            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs">IP Rate Limiting</span>
                                    <Badge className="bg-emerald-500/20 text-emerald-500 text-[8px] border-emerald-500/30">ACTIVE</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs">WAF Edge Shield</span>
                                    <Badge className="bg-emerald-500/20 text-emerald-500 text-[8px] border-emerald-500/30">ACTIVE</Badge>
                                </div>
                                <div className="flex items-center justify-between opacity-50">
                                    <span className="text-xs">Quantum Hardening</span>
                                    <Badge variant="outline" className="text-[8px] border-white/10 uppercase">Pending</Badge>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Server className="h-4 w-4 text-blue-500" /> Infrastructure Load
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px]">
                                        <span>CORE_CPU</span>
                                        <span className="text-primary font-mono">14%</span>
                                    </div>
                                    <Progress value={14} className="h-1 bg-white/5" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px]">
                                        <span>NETWORK_BANDWIDTH</span>
                                        <span className="text-orange-500 font-mono">68%</span>
                                    </div>
                                    <Progress value={68} className="h-1 bg-white/5 [&>div]:bg-orange-500" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 space-y-3 border-t border-white/5">
                            <Button
                                onClick={handleVerifyLedger}
                                variant="outline"
                                disabled={isLedgerChecking}
                                className="w-full border-white/10 font-bold gap-2 group"
                            >
                                <Activity className={cn("h-4 w-4 text-emerald-500", isLedgerChecking && "animate-pulse")} />
                                {isLedgerChecking ? "VERIFYING..." : "INSTANT LEDGER CHECK"}
                                <div className={cn(
                                    "h-1.5 w-1.5 rounded-full ml-auto",
                                    ledgerStatus === "SYNCED" ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-orange-500 animate-ping"
                                )} />
                            </Button>
                            <Button
                                onClick={() => setIsMissionBriefOpen(true)}
                                variant="outline"
                                className="w-full border-white/10 font-bold gap-2"
                            >
                                <Terminal className="h-4 w-4 text-primary" /> VIEW MISSION BRIEF
                            </Button>
                            <Button
                                onClick={handleLockdown}
                                disabled={isLockdown}
                                className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold gap-2 mt-4"
                            >
                                <ShieldAlert className="h-4 w-4" /> INITIATE LOCKDOWN
                            </Button>
                            <Button
                                onClick={handlePurge}
                                variant="outline"
                                disabled={isPurging || isLockdown}
                                className={cn(
                                    "w-full border-white/10 font-bold gap-2 relative overflow-hidden",
                                    isPurging && "border-primary/50 text-primary"
                                )}
                            >
                                <Crosshair className={cn("h-4 w-4", isPurging && "animate-spin")} />
                                {isPurging ? "PURGING_VECTOR..." : "TARGET PURGE"}
                                {isPurging && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 h-1 bg-primary"
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 3 }}
                                    />
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 min-h-[300px]">
                        <SecurityAnalyst />
                    </div>
                </div>
            </div>

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
