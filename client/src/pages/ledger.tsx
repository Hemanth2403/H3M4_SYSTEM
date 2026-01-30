import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
    Database,
    Shield,
    Clock,
    ChevronLeft,
    Lock,
    Cpu,
    Network,
    CheckCircle2,
    ArrowUpRight,
    Activity,
    Box,
    Hash
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Loader2, Globe, FileJson, Terminal, Search } from "lucide-react";

interface LedgerBlock {
    id: string;
    height: number;
    hash: string;
    prevHash: string;
    timestamp: string;
    status: "confirmed" | "validating";
    type: "INTEL_DISCLOSURE" | "GOVERNANCE_DECISION" | "B2R_HANDSHAKE" | "PROTOCOL_UPDATE";
    payload: string;
}

export default function GlobalLedger() {
    const [blocks, setBlocks] = useState<LedgerBlock[]>([]);
    const [isSyncing, setIsSyncing] = useState(true);
    const [isLoadingArchive, setIsLoadingArchive] = useState(false);
    const [isExploringNodes, setIsExploringNodes] = useState(false);
    const [isShowingApiDocs, setIsShowingApiDocs] = useState(false);

    // Initial blocks
    useEffect(() => {
        const initialBlocks: LedgerBlock[] = [
            {
                id: "B-9921",
                height: 892104,
                hash: "0x7f83...9a2b",
                prevHash: "0x4a12...83e1",
                timestamp: "2 mins ago",
                status: "confirmed",
                type: "INTEL_DISCLOSURE",
                payload: "Stored XSS Vulnerability - SVG Parsing Engine"
            },
            {
                id: "B-9920",
                height: 892103,
                hash: "0x4a12...83e1",
                prevHash: "0xbc88...11f4",
                timestamp: "15 mins ago",
                status: "confirmed",
                type: "GOVERNANCE_DECISION",
                payload: "Intel Verified: Critical Vulnerability in Auth Middleware"
            },
            {
                id: "B-9919",
                height: 892102,
                hash: "0xbc88...11f4",
                prevHash: "0x55d1...ff22",
                timestamp: "1 hour ago",
                status: "confirmed",
                type: "B2R_HANDSHAKE",
                payload: "Enterprise Handshake Established: Global Bank X Researcher"
            }
        ];
        setBlocks(initialBlocks);
        setTimeout(() => setIsSyncing(false), 2000);
    }, []);

    // Simulate real-time block generation
    useEffect(() => {
        if (isSyncing) return;
        const interval = setInterval(() => {
            const types: LedgerBlock["type"][] = ["INTEL_DISCLOSURE", "GOVERNANCE_DECISION", "B2R_HANDSHAKE", "PROTOCOL_UPDATE"];
            const selectedType = types[Math.floor(Math.random() * types.length)];

            const newBlock: LedgerBlock = {
                id: `B-${Math.floor(Math.random() * 10000)}`,
                height: blocks[0]?.height + 1 || 892105,
                hash: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
                prevHash: blocks[0]?.hash || "0x...",
                timestamp: "Just now",
                status: "confirmed",
                type: selectedType,
                payload: selectedType === "INTEL_DISCLOSURE" ? "New Intelligence Node Anchored" :
                    selectedType === "GOVERNANCE_DECISION" ? "Consensus Protocol Finalized" :
                        selectedType === "B2R_HANDSHAKE" ? "Collaboration Node Initialized" : "Security Protocol Synced"
            };
            setBlocks(prev => [newBlock, ...prev.slice(0, 9)]);
        }, 8000);
        return () => clearInterval(interval);
    }, [isSyncing, blocks]);

    const handleLoadArchive = () => {
        setIsLoadingArchive(true);
        setTimeout(() => {
            const olderBlocks: LedgerBlock[] = [
                {
                    id: "B-9918",
                    height: 892101,
                    hash: "0x55d1...ff22",
                    prevHash: "0xaa33...bb11",
                    timestamp: "3 hours ago",
                    status: "confirmed",
                    type: "PROTOCOL_UPDATE",
                    payload: "Core Governance Ruleset Upgraded to v2.4"
                },
                {
                    id: "B-9917",
                    height: 892100,
                    hash: "0xaa33...bb11",
                    prevHash: "0x9922...cc44",
                    timestamp: "5 hours ago",
                    status: "confirmed",
                    type: "INTEL_DISCLOSURE",
                    payload: "API Gateway Rate Limit Bypass Investigation"
                }
            ];
            setBlocks(prev => [...prev, ...olderBlocks]);
            setIsLoadingArchive(false);
            toast.success("Historical blocks synchronized", {
                description: "Blockchain head verified against archival storage hubs."
            });
        }, 1500);
    };

    const handleDownloadProof = () => {
        toast.promise(new Promise(res => setTimeout(res, 2000)), {
            loading: "Generating Merkle Proof for current block height...",
            success: "merkle_proof_892104.json downloaded.",
            error: "Generation failed",
        });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Ledger Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
                            <Database className="h-8 w-8 text-primary" />
                            Global Intelligence Ledger
                        </h1>
                        <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest mt-1">
                            Permissioned Consensus Engine • Status: <span className="text-emerald-500 animate-pulse">RUNNING</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <div className="text-[10px] font-mono font-bold text-muted-foreground uppercase">Network Hashrate</div>
                        <div className="text-sm font-mono font-bold text-primary">48.2 EH/s</div>
                    </div>
                    <div className="h-10 w-px bg-white/10 hidden sm:block" />
                    <Button
                        variant="outline"
                        onClick={() => setIsExploringNodes(true)}
                        className="border-white/10 font-bold gap-2"
                    >
                        <Activity className="h-4 w-4" /> NODE_EXPLORER
                    </Button>
                </div>
            </div>

            {/* Network Health Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-card/20 border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Network className="h-3 w-3 text-blue-400" /> Active Validators
                        </h3>
                        <Badge variant="outline" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/5">100% ONLINE</Badge>
                    </div>
                    <div className="flex gap-1">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="h-6 flex-1 rounded-sm bg-emerald-500/20 border border-emerald-500/40 relative group">
                                <div className="absolute inset-0 bg-emerald-500 animate-pulse opacity-20" />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-2 py-1 rounded text-[8px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    NODE_ID: L-{(Math.random() * 100).toFixed(0)} | STAT: OK
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono">
                        Consensus reached across 12/12 forensic nodes in 840ms.
                    </p>
                </div>

                <div className="p-6 rounded-2xl bg-card/20 border border-white/5 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Lock className="h-3 w-3 text-orange-400" /> Cryptographic Integrity
                    </h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-muted-foreground underline underline-offset-4">MERKLE_ROOT_VERIFICATION</span>
                            <span className="text-emerald-500 font-bold">PASSING</span>
                        </div>
                        <Progress value={100} className="h-1 bg-white/5 [&>div]:bg-emerald-500" />
                        <div className="flex justify-between text-[10px] font-mono pt-1">
                            <span className="text-muted-foreground underline underline-offset-4">SIGNATURE_VALIDATION</span>
                            <span className="text-emerald-500 font-bold">100.0%</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col justify-center gap-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Shield className="h-24 w-24" />
                    </div>
                    <div className="text-2xl font-mono font-bold">{blocks[0]?.height.toLocaleString() || "..."}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Current Block Height</div>
                    <div className="text-[9px] font-mono text-muted-foreground">Genesis Block anchored Jan 20, 2026</div>
                </div>
            </div>

            {/* Block Explorer Table */}
            <div className="rounded-2xl border border-white/10 bg-card/20 overflow-hidden">
                <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Box className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-bold">Recent Blocks</h2>
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground animate-pulse">
                        {isSyncing ? "SYNCING_WITH_NODES..." : "REAL_TIME_PULSE_ACTIVE"}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-black/20">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Block ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Content Payload</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Forensic Hash</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Age</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {blocks.map((block) => (
                                    <motion.tr
                                        key={block.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-foreground">{block.id}</span>
                                                <span className="text-[9px] font-mono text-muted-foreground">#{block.height}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className={`text-[9px] border-white/10 ${block.type === 'INTEL_DISCLOSURE' ? 'text-primary' :
                                                block.type === 'GOVERNANCE_DECISION' ? 'text-orange-400' :
                                                    block.type === 'B2R_HANDSHAKE' ? 'text-blue-400' : 'text-purple-400'
                                                }`}>
                                                {block.type}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-foreground/80 font-medium truncate max-w-[200px] block">
                                                {block.payload}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-[10px] text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Hash className="h-3 w-3 text-primary/50" />
                                                {block.hash}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {block.timestamp}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-white/10 bg-white/5 flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={handleLoadArchive}
                        disabled={isLoadingArchive}
                        className="text-xs font-bold text-primary gap-2 hover:bg-primary/10"
                    >
                        {isLoadingArchive ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowUpRight className="h-3 w-3" />}
                        LOAD HISTORICAL ARCHIVE
                    </Button>
                </div>
            </div>

            {/* Bottom Insight */}
            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <div className="text-sm font-bold">Immutability Protocol Active</div>
                        <p className="text-xs text-muted-foreground">All intelligence stored is SHA-3 hashed and cannot be altered or deleted by any central authority.</p>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button
                        size="sm"
                        onClick={handleDownloadProof}
                        className="flex-1 md:flex-none border border-white/10 bg-white/5 font-bold"
                    >
                        DOWNLOAD MERKLE PROOF
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => setIsShowingApiDocs(true)}
                        className="bg-primary text-black font-bold"
                    >
                        API DOCUMENTATION
                    </Button>
                </div>
            </div>

            {/* Node Explorer Dialog */}
            <Dialog open={isExploringNodes} onOpenChange={setIsExploringNodes}>
                <DialogContent className="max-w-4xl bg-[#0a0f14] border-white/10 p-0 overflow-hidden">
                    <div className="bg-primary/10 p-6 border-b border-white/5">
                        <DialogTitle className="text-2xl font-heading font-bold flex items-center gap-3 italic">
                            <Globe className="h-6 w-6 text-primary" /> Forensic Node Topology
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground font-mono text-[10px] appearance-none uppercase tracking-widest mt-1">
                            Active Consensus Clusters • Layer 2 Validation State
                        </DialogDescription>
                    </div>
                    <div className="p-8 grid grid-cols-3 gap-6">
                        <div className="col-span-2 relative h-[300px] bg-black/40 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
                            {/* Abstract network visualization */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-30" />
                            <div className="relative flex flex-wrap gap-8 justify-center p-8 max-w-sm">
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            opacity: [0.5, 1, 0.5]
                                        }}
                                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                                        className="h-4 w-4 rounded-full bg-primary shadow-[0_0_15px_rgba(38,217,98,0.5)]"
                                    />
                                ))}
                            </div>
                            <div className="absolute bottom-4 left-4 text-[8px] font-mono text-primary/50">
                                SIMULATING_REAL_TIME_P2P_TRAFFIC...
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Cluster Status</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span>Primary Shard</span>
                                        <Badge variant="outline" className="text-[8px] h-4 border-emerald-500/20 text-emerald-500">SYNCED</Badge>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span>Archival Hub</span>
                                        <Badge variant="outline" className="text-[8px] h-4 border-emerald-500/20 text-emerald-500">ACTIVE</Badge>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span>Peer Propagation</span>
                                        <Badge variant="outline" className="text-[8px] h-4 border-orange-500/20 text-orange-500">OPTIMIZING</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-black border border-primary/20">
                                <h4 className="text-[10px] font-bold text-primary uppercase mb-2 flex items-center gap-2">
                                    <Terminal className="h-3 w-3" /> Node Info
                                </h4>
                                <div className="font-mono text-[9px] text-primary/80 space-y-1">
                                    <div>ADDR: 0x44...FA22</div>
                                    <div>VERSION: H3M4_CORE_1.2</div>
                                    <div>LATENCY: 8ms</div>
                                    <div>UPTIME: 142d 12h</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 border-t border-white/5 bg-black/20 flex justify-end">
                        <Button variant="ghost" className="text-xs" onClick={() => setIsExploringNodes(false)}>Exit Explorer</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* API Documentation Sheet */}
            <Sheet open={isShowingApiDocs} onOpenChange={setIsShowingApiDocs}>
                <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-[#0c141c] border-white/10 text-white p-0 overflow-hidden">
                    <div className="h-full flex flex-col">
                        <div className="p-8 bg-primary/5 border-b border-white/5">
                            <SheetHeader>
                                <SheetTitle className="text-3xl font-heading font-bold text-primary flex items-center gap-3">
                                    <FileJson className="h-7 w-7" /> API Documentation
                                </SheetTitle>
                                <SheetDescription className="text-muted-foreground font-mono text-[10px] appearance-none uppercase tracking-widest mt-2 leading-relaxed">
                                    H3M4 Protocol Interface Control • Connect to the global brain via REST/gRPC
                                </SheetDescription>
                            </SheetHeader>
                        </div>

                        <div className="flex-1 overflow-auto p-8 space-y-10">
                            {/* GET Blocks */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Badge className="bg-emerald-500 text-black font-bold h-5">GET</Badge>
                                    <span className="font-mono text-sm">/v1/ledger/blocks</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Retrieves paginated block data from the mainnet. Supports filtering by transaction type and forensic signature.
                                </p>
                                <div className="rounded-xl bg-black/60 p-4 border border-white/5 font-mono text-[10px] text-emerald-500/80">
                                    <div className="text-muted-foreground mb-1">// RESPONSE_SAMPLE</div>
                                    <div>{'{'}</div>
                                    <div className="pl-4">"height": 892104,</div>
                                    <div className="pl-4">"hash": "0x7f83...9a2b",</div>
                                    <div className="pl-4">"type": "INTEL_DISCLOSURE"</div>
                                    <div>{'}'}</div>
                                </div>
                            </div>

                            {/* POST Proof */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Badge className="bg-blue-500 text-white font-bold h-5">POST</Badge>
                                    <span className="font-mono text-sm">/v1/ledger/verify-ancestry</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Verify a local intelligence report against the global Merkle Root via cryptographic inclusion proof.
                                </p>
                                <div className="rounded-xl bg-black/60 p-4 border border-white/5 font-mono text-[10px] text-blue-500/80">
                                    <div className="text-muted-foreground mb-1">// REQUEST_PAYLOAD</div>
                                    <div>{'{'}</div>
                                    <div className="pl-4">"merkle_index": 44,</div>
                                    <div className="pl-4">"target_hash": "0x...a77"</div>
                                    <div>{'}'}</div>
                                </div>
                            </div>

                            {/* Auth Header */}
                            <div className="p-6 rounded-xl bg-primary/10 border border-primary/20 space-y-3">
                                <h4 className="text-sm font-bold flex items-center gap-2">
                                    <Lock className="h-4 w-4" /> Authentication Requirement
                                </h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Access is restricted to verified researcher IDs and enterprise service accounts. All requests must be signed with your **EDDSA_384** private key.
                                </p>
                                <Button variant="link" className="text-primary p-0 h-auto text-[10px] font-bold uppercase tracking-widest">Generate_API_Key_Pair</Button>
                            </div>
                        </div>

                        <div className="p-6 bg-black/40 border-t border-white/5 flex gap-3">
                            <Button className="flex-1 bg-primary text-black font-bold text-xs" onClick={() => setIsShowingApiDocs(false)}>Download Full SDK</Button>
                            <Button variant="outline" className="flex-1 text-xs border-white/10" onClick={() => setIsShowingApiDocs(false)}>Close Docs</Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
