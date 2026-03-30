import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Network,
    Zap,
    ShieldCheck,
    AlertTriangle,
    Search,
    Filter,
    Activity,
    ArrowRight,
    Database,
    Info,
    Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ThreatSignal {
    id: string;
    score: number;
    severity: "critical" | "high" | "medium" | "low";
    confidence: number;
    attackVector: string[];
    iocs: string[];
    mitreAttack: string[];
    urgency: number;
    trend: string;
    affectedAssets: string[];
    timestamp: string;
}

export default function ThreatSignalGraph() {
    const { data: signals = [], isLoading } = useQuery<ThreatSignal[]>({
        queryKey: ["/api/threat-intelligence/signals"],
        refetchInterval: 5000, // Sync every 5 seconds for "active" feel
    });

    const [selectedNode, setSelectedNode] = useState<any>(null);

    // Transform API signals to graph nodes
    const nodes = signals.length > 0 ? signals.map((signal, index) => {
        // Create deterministic pseudo-random connections
        const connections = [];
        if (index > 0) connections.push(signals[index - 1].id);
        if (index < signals.length - 1) connections.push(signals[index + 1].id);

        return {
            id: signal.id,
            label: signal.attackVector[0] || "Detected Threat",
            type: "Live Signal",
            confidence: Math.round(signal.confidence * 100) || 85,
            status: signal.urgency > 7 ? "Critical" : "Active",
            sector: signal.affectedAssets[0] || "General",
            connections: connections,
            raw: signal
        };
    }) : [
        // Fallback/Demo Nodes if no data
        { id: "demo-1", label: "System Idle - Waiting for Signals", type: "System", confidence: 100, status: "Standby", sector: "Infrastructure", connections: [], raw: null }
    ];

    useEffect(() => {
        if (nodes.length > 0 && !selectedNode) {
            setSelectedNode(nodes[0]);
        }
    }, [nodes, selectedNode]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[500px]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    // Safe access to selected node or fallback
    const activeNode = selectedNode || nodes[0];

    return (
        <div className="space-y-6 animate-in fade-in duration-700 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold mb-1 flex items-center gap-2">
                        <Network className="h-8 w-8 text-primary" />
                        Threat Signal Graph
                    </h1>
                    <p className="text-muted-foreground italic">The H3M4 Core Brain: Correlating {signals.length} active live signals.</p>
                </div>
                <div className="flex gap-2">
                    <Badge className="bg-primary/20 text-primary border-primary/30 flex items-center gap-2 py-1.5 px-3">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        CORE BRAIN SYNCED
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Graph Visualizer */}
                <div className="lg:col-span-3 glass-panel rounded-xl border-white/5 bg-black/40 min-h-[500px] relative overflow-hidden flex items-center justify-center">
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(circle, #26d962 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                    {/* Pre-calculate positions */}
                    {(() => {
                        const getPos = (index: number, total: number) => {
                            if (total === 1) return { x: 50, y: 50 };
                            const angle = (index * (360 / total)) * (Math.PI / 180);
                            return {
                                x: 50 + 35 * Math.cos(angle),
                                y: 50 + 35 * Math.sin(angle)
                            };
                        };

                        const nodePositions = nodes.map((node, i) => ({
                            ...node,
                            ...getPos(i, nodes.length)
                        }));

                        return (
                            <>
                                {/* Dynamic Connection Lines */}
                                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                                    {nodePositions.map(node =>
                                        node.connections.map(targetId => {
                                            const targetNode = nodePositions.find(n => n.id === targetId);
                                            if (!targetNode) return null;
                                            return (
                                                <line
                                                    key={`${node.id}-${targetId}`}
                                                    x1={`${node.x}%`}
                                                    y1={`${node.y}%`}
                                                    x2={`${targetNode.x}%`}
                                                    y2={`${targetNode.y}%`}
                                                    stroke="#26d962"
                                                    strokeWidth="1"
                                                    strokeDasharray="5,5"
                                                />
                                            );
                                        })
                                    )}
                                    {/* Connections to Core */}
                                    {nodePositions.map((node, i) => (
                                        <line
                                            key={`core-${i}`}
                                            x1="50%"
                                            y1="50%"
                                            x2={`${node.x}%`}
                                            y2={`${node.y}%`}
                                            stroke="#26d962"
                                            strokeWidth="0.5"
                                            opacity="0.3"
                                        />
                                    ))}
                                </svg>

                                {/* Nodes Visual */}
                                <div className="relative w-full h-full flex items-center justify-center p-12">
                                    {nodePositions.map((node) => (
                                        <div
                                            key={node.id}
                                            style={{ left: `${node.x}%`, top: `${node.y}%` }}
                                            className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 transform hover:scale-110 ${activeNode.id === node.id ? 'z-30' : 'z-20'
                                                }`}
                                            onClick={() => setSelectedNode(node)}
                                        >
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className={`p-4 rounded-full border-2 bg-black/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)] ${activeNode.id === node.id ? 'border-primary shadow-[0_0_20px_rgba(38,217,98,0.4)]' : 'border-white/10'
                                                            }`}>
                                                            {node.type.includes('Signal') && <Zap className="h-6 w-6 text-primary" />}
                                                            {node.type.includes('System') && <Activity className="h-6 w-6 text-muted-foreground" />}
                                                            {!node.type.includes('Signal') && !node.type.includes('System') && <ShieldCheck className="h-6 w-6 text-blue-500" />}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-sidebar border-white/10 p-2">
                                                        <div className="text-xs font-bold">{node.label}</div>
                                                        <div className="text-[10px] text-muted-foreground uppercase">{node.type}</div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    ))}

                                    {/* Central Brain Node */}
                                    <div className="z-10 p-8 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm animate-pulse flex flex-col items-center">
                                        <Database className="h-10 w-10 text-primary mb-2" />
                                        <span className="text-[10px] font-mono text-primary uppercase font-bold tracking-widest leading-none">CORE GRAPH</span>
                                        <span className="text-[8px] font-mono text-muted-foreground uppercase">v2.1.0-stable</span>
                                    </div>
                                </div>
                            </>
                        );
                    })()}
                </div>

                {/* Signal Inspector */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-1">Signal Inspector</h3>
                    <div className="glass-panel p-6 rounded-xl border-primary/20 bg-primary/5 min-h-[400px]">
                        <div className="flex items-center justify-between mb-4">
                            <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">{activeNode.status}</Badge>
                            <span className="text-[10px] font-mono text-muted-foreground">ID: {activeNode.id.substring(0, 8)}</span>
                        </div>

                        <h2 className="text-xl font-heading font-bold mb-2">{activeNode.label}</h2>
                        <p className="text-xs text-muted-foreground mb-6 uppercase flex items-center gap-2">
                            {activeNode.type} <span className="h-1 w-1 rounded-full bg-muted-foreground" /> {activeNode.sector}
                        </p>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs font-bold">
                                    <span>Signal Confidence</span>
                                    <span className="text-primary">{activeNode.confidence}%</span>
                                </div>
                                <Progress value={activeNode.confidence} className="h-1.5" />
                            </div>

                            {activeNode.raw && (
                                <div className="space-y-3">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                                        <Info className="h-3 w-3" /> Technical Vectors
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {activeNode.raw.attackVector.map((vec: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="text-[9px]">{vec}</Badge>
                                        ))}
                                    </div>
                                    <p className="text-xs leading-relaxed text-foreground/80 mt-2">
                                        Detected IOCs: {activeNode.raw.iocs.length > 0 ? activeNode.raw.iocs.join(", ") : "None extracted"}
                                    </p>
                                </div>
                            )}

                            <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                                <div className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Connected Relationships</div>
                                <div className="space-y-2">
                                    {activeNode.connections.length > 0 ? activeNode.connections.map((connId: string) => (
                                        <div key={connId} className="flex items-center justify-between text-[11px] group cursor-pointer hover:text-primary transition-colors">
                                            <div className="flex items-center gap-2">
                                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                                <span className="font-mono">{connId.substring(0, 8)}...</span>
                                            </div>
                                            <Button variant="outline" className="text-[9px] h-6 px-2 gap-1 font-bold group border-white/5 bg-transparent">
                                                LINK <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </div>
                                    )) : <div className="text-[10px] text-muted-foreground italic">No direct correlates found.</div>}
                                </div>
                            </div>

                            <Button className="w-full gap-2 border-primary/20 hover:bg-primary/10 transition-colors" variant="outline">
                                View Audit Trace <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shared Threat Signal Pipeline View */}
            <div className="p-8 rounded-xl border border-white/10 bg-white/5">
                <h3 className="text-center text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8">Unified Threat Signal Pipeline</h3>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2 hidden md:block" />

                    {[
                        { role: "Researchers", action: "Signal Discovery", color: "text-primary" },
                        { role: "Bug Bounters", action: "Signal Validation", color: "text-blue-500" },
                        { role: "Governors", action: "Signal Curation", color: "text-purple-500" },
                        { role: "Police / Orgs", action: "Signal Consumption", color: "text-orange-500" },
                    ].map((step, i) => (
                        <div key={i} className="relative z-10 flex flex-col items-center text-center gap-2 group">
                            <div className={`h-12 w-12 rounded-full border border-white/10 bg-black flex items-center justify-center group-hover:border-primary/50 transition-all ${step.color}`}>
                                {i + 1}
                            </div>
                            <div>
                                <div className="text-sm font-bold">{step.role}</div>
                                <div className="text-[10px] uppercase font-mono text-muted-foreground">{step.action}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
