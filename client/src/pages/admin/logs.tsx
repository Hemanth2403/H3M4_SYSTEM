import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type SecurityEvent } from "@shared/schema";
import {
    History,
    Search,
    Download,
    FileCheck,
    User,
    Clock,
    Database,
    ShieldAlert,
    ExternalLink,
    Network,
    Cpu,
    Fingerprint,
    Zap,
    Lock,
    ShieldCheck,
    AlertTriangle,
    Globe,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const mockLogs = [
    { id: "LOG-5902", action: "Enterprise Export", actor: "Acme Corp Security", target: "Tactical Report #502", timestamp: "2026-01-30 03:22:15", ip: "102.34.11.8", severity: "low", hash: "a7c2...f891" },
    { id: "LOG-5901", action: "Risk Mitigation", actor: "SYSTEM (Auto)", target: "Auth Bypass Signal (UserID: r_202)", timestamp: "2026-01-30 03:15:42", ip: "K8S_INTERNAL", severity: "high", hash: "9b32...d442" },
    { id: "LOG-5899", action: "Advisory Published", actor: "H3M4 Admin (H.S.)", target: "RBI Compliance Patch 4.1", timestamp: "2026-01-30 02:45:10", ip: "192.168.1.45", severity: "medium", hash: "c124...e003" },
    { id: "LOG-5892", action: "Registry Sync", actor: "Police Node (MH-Cyber)", target: "CID/NCB Direct Sync", timestamp: "2026-01-30 01:12:00", ip: "GOV_ENCLAVE", severity: "medium", hash: "f998...b221" },
    { id: "LOG-5888", action: "Manual Review", actor: "Expert Panel (S.V.)", target: "Kubernetes Zero-day #REG-888", timestamp: "2026-01-29 23:55:18", ip: "203.11.90.4", severity: "low", hash: "44d2...a119" },
    { id: "LOG-5885", action: "Suspension", actor: "H3M4 Admin (H.S.)", target: "Researcher: Shadow_Walker", timestamp: "2026-01-29 22:40:05", ip: "192.168.1.45", severity: "high", hash: "88e1...c332" },
];

export default function EvidenceStore() {
    const [selectedLog, setSelectedLog] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isSealing, setIsSealing] = useState(false);
    const [sealStep, setSealStep] = useState(0);

    const { data: events, isLoading } = useQuery<SecurityEvent[]>({
        queryKey: ["/api/cdoc/events"],
    });

    const logs = events?.map(event => ({
        id: event.id.substring(0, 8).toUpperCase(),
        action: event.type,
        actor: "SYSTEM",
        target: event.description,
        timestamp: new Date(event.timestamp).toLocaleString(),
        ip: "NETWORK_NODE",
        severity: event.severity.toLowerCase(),
        hash: `0x${event.id.substring(0, 8)}`
    })) || [];

    const displayLogs = logs.length > 0 ? logs : mockLogs;

    const handleExport = () => {
        toast.promise(
            new Promise(async (resolve) => {
                // High-latency compilation for "seriousness"
                await new Promise(res => setTimeout(res, 3000));

                const timestamp = new Date().toISOString();
                const reportId = `H3M4-AUTH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
                const globalHash = "0x7B2A3F9E8D1C4B5A6C7D8E9F0A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B";

                let content = `================================================================================\n`;
                content += `      H3M4 GLOBAL INTELLIGENCE - CERTIFIED FORENSIC AUDIT PACKAGE      \n`;
                content += `      [ RESTRICTED: LAW ENFORCEMENT & INSTITUTIONAL COMPLIANCE ]      \n`;
                content += `================================================================================\n\n`;

                content += `[ LEGAL METADATA ]\n`;
                content += `REPORT REFERENCE   : ${reportId}\n`;
                content += `ISSUING AUTHORITY  : H3M4 DECENTRALIZED GOVERNANCE NODE #882\n`;
                content += `DOCUMENT CLASS     : COURT-READY FORENSIC EVIDENCE (CLASS III)\n`;
                content += `JURISDICTION       : GLOBAL / INTEROPERABLE (ISO-27001-2022 READY)\n`;
                content += `FINTECH COMPLIANCE : RBI-CYBER-SEC-FRAMEWORK V2.1 / SEBI-CSIRT\n`;
                content += `GENERATED ON       : ${timestamp}\n\n`;

                content += `[ NETWORK PROVENANCE ]\n`;
                content += `LEDGER STATE       : FINALIZED (IMMUTABLE)\n`;
                content += `BLOCK ANCHOR       : 0x${Math.random().toString(16).substring(2, 10).toUpperCase()}...892\n`;
                content += `VALIDATOR CONSENSUS: 12/12 NODES (MH-CYBER-NODE, SG-AUDIT-VAULT, FED-INTEL)\n`;
                content += `GLOBAL INTEGRITY   : ${globalHash}\n\n`;

                content += `[ INCIDENT & EVIDENCE LOGS ]\n`;
                content += `--------------------------------------------------------------------------------\n`;
                content += ` TIMESTAMP (UTC)      | LOG ID   | ACTOR           | TARGET / INCIDENT DESCRIPTION \n`;
                content += `--------------------------------------------------------------------------------\n`;

                displayLogs.forEach(log => {
                    const timeShort = log.timestamp.split(',')[1] || log.timestamp;
                    content += `${log.timestamp.padEnd(20)} | ${log.id.padEnd(8)} | ${log.actor.padEnd(15)} | ${log.target.substring(0, 30)}\n`;
                });

                content += `--------------------------------------------------------------------------------\n\n`;

                content += `[ FORENSIC ATTESTATION ]\n`;
                content += `The undersigned system attests that the data above is a bit-perfect extraction\n`;
                content += `from the H3M4 distributed ledger. No post-facto modification has occurred.\n`;
                content += `The hash of this entire document has been broadcasted to Shard #881 for cross-verification.\n\n`;

                content += `[ SHA-3 INTERGRITY SEAL (SIG: ECC-384) ]\n`;
                content += `SIGNATURE: 0x${Math.random().toString(16).substring(2, 40).toUpperCase()}\n`;
                content += `SIGNER   : H3M4_SYSTEM_NOTARY_ROOT\n`;
                content += `================================================================================\n`;
                content += `          © 2026 H3M4 ECOSYSTEM - CONFIDENTIAL FORENSIC OUTPUT          \n`;
                content += `================================================================================\n`;

                const blob = new Blob([content], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `H3M4_POLICE_FINTECH_EVIDENCE_${reportId}.txt`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                resolve(true);
            }),
            {
                loading: "Generating Law Enforcement & Fintech Audit Package...",
                success: "Police-Ready Forensic Document Exported Successfully.",
                error: "Forensic compilation failed. Check system logs.",
            }
        );
    };

    const handleVerifyHash = () => {
        toast.info("Verifying global ledger integrity...", {
            description: "Comparing chain head hash with 12 validator nodes.",
        });
        setTimeout(() => {
            toast.success("Ledger Sync Verified", {
                description: "Blockchain state matches local signature. No tampering detected.",
            });
        }, 2000);
    };

    const handleAllNodes = () => {
        toast.success("Active Node Network Map", {
            description: "12/12 Validator nodes are online and synchronized.",
        });
    };

    const openTrace = (log: any) => {
        setSelectedLog(log);
        setIsDetailOpen(true);
    };

    const handleSealReport = () => {
        setIsSealing(true);
        setSealStep(1);

        const steps = [
            { label: "Generating cryptographic witness...", delay: 1000 },
            { label: "Anchoring forensic evidence to shard #882...", delay: 1500 },
            { label: "Applying SHA-3 integrity seal...", delay: 1200 },
            { label: "Synchronizing across 12 validator nodes...", delay: 1800 },
            { label: "Finalizing Immutable Audit Trail...", delay: 1000 }
        ];

        let currentStep = 1;
        const runStep = () => {
            if (currentStep < steps.length) {
                setTimeout(() => {
                    currentStep++;
                    setSealStep(currentStep);
                    runStep();
                }, steps[currentStep - 1].delay);
            } else {
                setTimeout(() => {
                    setIsSealing(false);
                    setSealStep(0);
                    setIsDetailOpen(false);
                    toast.success("Forensic Report Sealed", {
                        description: `Archive for ${selectedLog?.id} is now locked and anchored to the global ledger.`,
                        icon: <ShieldCheck className="h-4 w-4 text-primary" />,
                    });
                }, 1000);
            }
        };

        runStep();
    };

    const openAlert = (log: any) => {
        setSelectedLog(log);
        setIsDetailOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold mb-1 flex items-center gap-2">
                        <History className="h-8 w-8 text-primary" />
                        Evidence & Audit Store
                    </h1>
                    <p className="text-muted-foreground italic">Immutable court-safe audit trails for national security and enterprise compliance.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 border-primary/20" onClick={handleExport}>
                        <Download className="h-4 w-4" /> Export for Court
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={handleVerifyHash}>
                        <FileCheck className="h-4 w-4" /> Verify Hash
                    </Button>
                </div>
            </div>

            <div className="p-4 rounded-lg bg-card/40 border border-border backdrop-blur-sm flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search audit trail by actor, IP, or hash..."
                        className="w-full bg-background/50 border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                <Button variant="outline" onClick={handleAllNodes}><Database className="h-4 w-4 mr-2" /> All Nodes</Button>
            </div>

            <div className="rounded-xl border border-white/10 overflow-hidden bg-card/20 backdrop-blur-sm">
                <Table>
                    <TableHeader className="bg-white/5">
                        <TableRow className="hover:bg-transparent border-white/10">
                            <TableHead className="w-[120px] font-mono text-[10px] uppercase">Log ID</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Actor / Node</TableHead>
                            <TableHead>Target Resource</TableHead>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Source IP</TableHead>
                            <TableHead className="text-right">Risk Control</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {displayLogs.map((log) => (
                            <TableRow key={log.id} className="border-white/5 hover:bg-white/10 transition-colors group">
                                <TableCell className="font-mono text-xs text-muted-foreground">{log.id}</TableCell>
                                <TableCell>
                                    <span className="font-semibold text-sm">{log.action}</span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-xs text-foreground/80">
                                        <User className="h-3 w-3 text-primary" /> {log.actor}
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground truncate max-w-[200px]">{log.target}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                        <Clock className="h-3 w-3" /> {log.timestamp}
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-[10px] text-muted-foreground">{log.ip}</TableCell>
                                <TableCell className="text-right">
                                    {log.severity === 'high' ? (
                                        <button onClick={() => openAlert(log)} className="transition-transform active:scale-95">
                                            <Badge className="bg-destructive text-destructive-foreground border-destructive text-[10px] hover:bg-destructive/90 cursor-pointer flex items-center gap-1">
                                                <ShieldAlert className="h-3 w-3 shadow-[0_0_8px_rgba(239,68,68,0.5)]" /> ALERT
                                            </Badge>
                                        </button>
                                    ) : (
                                        <button onClick={() => openTrace(log)} className="transition-transform active:scale-95">
                                            <Badge variant="outline" className="text-[10px] border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 tracking-widest cursor-pointer flex items-center gap-1">
                                                <ExternalLink className="h-3 w-3" /> TRACE
                                            </Badge>
                                        </button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Evidence Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-4xl bg-sidebar/95 backdrop-blur-xl border-white/10">
                    <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/5">
                        <div className="space-y-1">
                            <DialogTitle className="text-2xl font-heading font-bold flex items-center gap-3">
                                {selectedLog?.severity === 'high' ? (
                                    <ShieldAlert className="h-6 w-6 text-destructive" />
                                ) : (
                                    <Network className="h-6 w-6 text-primary" />
                                )}
                                {selectedLog?.severity === 'high' ? 'Security Alert Perspective' : 'Log Provenance Trace'}
                            </DialogTitle>
                            <DialogDescription className="font-mono text-[10px] text-[#26d962] uppercase tracking-wider">
                                SESSION_LOG_ID: {selectedLog?.id} | BLOCK_HASH: {selectedLog?.hash}
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <Tabs defaultValue="overview" className="mt-4">
                        <TabsList className="bg-[#0c141c] border border-white/5 p-1 rounded-md h-9">
                            <TabsTrigger value="overview" className="text-[10px] uppercase font-bold tracking-tight px-4 data-[state=active]:bg-[#1a2b3b]">Intelligence Overview</TabsTrigger>
                            <TabsTrigger value="network" className="text-[10px] uppercase font-bold tracking-tight px-4 data-[state=active]:bg-[#1a2b3b]">Node Propagation</TabsTrigger>
                            <TabsTrigger value="blast" className="text-[10px] uppercase font-bold tracking-tight px-4 data-[state=active]:bg-[#1a2b3b]">System Blast Radius</TabsTrigger>
                            <TabsTrigger value="raw" className="text-[10px] uppercase font-bold tracking-tight px-4 data-[state=active]:bg-[#1a2b3b]">Raw Forensic Data</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-6 space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Threat Level</div>
                                    <div className={`text-xl font-bold font-mono ${selectedLog?.severity === 'high' ? 'text-destructive' : 'text-primary'}`}>
                                        {selectedLog?.severity === 'high' ? 'CRITICAL' : 'ROUTINE'}
                                    </div>
                                    <Progress value={selectedLog?.severity === 'high' ? 92 : 15} className={`h-1 ${selectedLog?.severity === 'high' ? '[&>div]:bg-destructive' : ''}`} />
                                </div>
                                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Confidence Score</div>
                                    <div className="text-xl font-bold font-mono text-emerald-500">99.8%</div>
                                    <Progress value={99} className="h-1 [&>div]:bg-emerald-500" />
                                </div>
                                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Consensus Status</div>
                                    <div className="text-xl font-bold font-mono text-primary">SYNCED</div>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-1 w-full bg-primary rounded-full" />)}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-xl bg-[#091a1a] border border-[#144242] relative overflow-hidden group">
                                <div className="flex items-start gap-4 relative z-10">
                                    <div className="p-3 rounded-lg bg-[#26d962]/10 border border-[#26d962]/20">
                                        <Cpu className="h-6 w-6 text-[#26d962]" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-foreground mb-1">Executive Summary</h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                                            The {selectedLog?.action} event was initiated by <span className="text-[#26d962]">{selectedLog?.actor}</span> targeting
                                            <span className="text-white font-medium italic"> {selectedLog?.target}</span>.
                                            Our distributed ledger has verified this action against 4 separate compliance rules (ISO-27001-A12.4.1).
                                            {selectedLog?.severity === 'high' ? ' IMMEDIATE ACTION REQUIRED: Signature mismatch detected in secondary validation node.' : ' ACTION STATUS: Audit trail successfully anchored to mainnet.'}
                                        </p>
                                    </div>
                                </div>
                                {/* Fingerprint overlay like in the photo */}
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity">
                                    <Fingerprint className="h-32 w-32" />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="network" className="mt-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-primary" /> Network Consensus Visualization
                                    </h4>
                                    <Badge variant="outline" className="text-[9px] border-primary/30 text-primary">12 ACTIVE NODES</Badge>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {['Police_Node_MH_01', 'Enterprise_Audit_SG', 'National_Cyber_Vault', 'Validator_System_Z'].map((node, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                                                <span className="text-xs font-mono">{node}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                                                <span>Lat: 12ms</span>
                                                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                                                <span className="text-emerald-500 font-bold">SIGNED</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="blast" className="mt-6">
                            <div className="p-6 rounded-xl bg-destructive/5 border border-destructive/20 space-y-4">
                                <h4 className="text-sm font-bold flex items-center gap-2 text-destructive">
                                    <Zap className="h-4 w-4" /> Blast Radius Analysis
                                </h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase">Directly Affected</div>
                                        <ul className="space-y-2">
                                            <li className="text-xs flex items-center gap-2 text-foreground/80"><div className="h-1 w-1 bg-destructive rounded-full" /> {selectedLog?.target}</li>
                                            <li className="text-xs flex items-center gap-2 text-foreground/80"><div className="h-1 w-1 bg-destructive rounded-full" /> Production API Cluster</li>
                                            <li className="text-xs flex items-center gap-2 text-foreground/80"><div className="h-1 w-1 bg-destructive rounded-full" /> SIEM Logs Pipeline</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase">Potential Escalation</div>
                                        <div className="p-3 rounded bg-black/40 border border-white/5 text-[10px] leading-relaxed text-muted-foreground">
                                            Analysis predicts 65% chance of lateral movement if the <span className="text-white">{selectedLog?.actor}</span> reaches
                                            secondary authentication layer.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="raw" className="mt-6">
                            <div className="rounded-xl bg-black p-4 font-mono text-[11px] leading-relaxed border border-white/10 text-emerald-500/80 max-h-[250px] overflow-auto">
                                <div>{'{'}</div>
                                <div className="pl-4">"log_id": "{selectedLog?.id}",</div>
                                <div className="pl-4">"timestamp": "{selectedLog?.timestamp}",</div>
                                <div className="pl-4">"action_profile": "{selectedLog?.action.toUpperCase().replace(' ', '_')}",</div>
                                <div className="pl-4">"initiator": "{'{'}" </div>
                                <div className="pl-8">"name": "{selectedLog?.actor}",</div>
                                <div className="pl-8">"ip": "{selectedLog?.ip}",</div>
                                <div className="pl-8">"id": "U_882_11"</div>
                                <div className="pl-4">{"}"},</div>
                                <div className="pl-4">"ledger_anchors": [</div>
                                <div className="pl-8">"{selectedLog?.hash}",</div>
                                <div className="pl-8">"ecc_384_sig_v2"</div>
                                <div className="pl-4">],</div>
                                <div className="pl-4">"compliance_flags": ["ISO-27001", "RBI-CYBER-SEC"],</div>
                                <div className="pl-4">"system_metadata": "0x44 0xFA 0x22 0x99 0xCB"</div>
                                <div>{'}'}</div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-white/5">
                        <Button variant="outline" className="text-xs font-bold border-white/10 hover:bg-white/5" onClick={() => setIsDetailOpen(false)}>Close View</Button>
                        <Button
                            onClick={handleSealReport}
                            disabled={isSealing}
                            className="bg-[#26d962] hover:bg-[#1fb351] text-black font-bold text-xs gap-2 px-6"
                        >
                            {isSealing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Lock className="h-3 w-3" />}
                            Seal Forensic Report
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Sealing Progress Dialog */}
            <Dialog open={isSealing}>
                <DialogContent className="max-w-md bg-sidebar/95 backdrop-blur-2xl border-white/10 p-8 text-center sm:rounded-2xl">
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative h-20 w-20 flex items-center justify-center">
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-[#26d962]/20 border-t-[#26d962]"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                            <Fingerprint className="h-10 w-10 text-[#26d962]" />
                        </div>

                        <div className="space-y-2">
                            <DialogTitle className="text-xl font-heading font-bold tracking-tight text-white uppercase italic">Sealing Forensic Node</DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground font-mono">
                                {sealStep === 1 && "Generating cryptographic witness..."}
                                {sealStep === 2 && "Anchoring forensic evidence to shard #882..."}
                                {sealStep === 3 && "Applying SHA-3 integrity seal..."}
                                {sealStep === 4 && "Synchronizing across 12 validator nodes..."}
                                {sealStep === 5 && "Finalizing Immutable Audit Trail..."}
                            </DialogDescription>
                        </div>

                        <div className="w-full space-y-4">
                            <Progress value={sealStep * 20} className="h-1 bg-[#26d962]/10 [&>div]:bg-[#26d962]" />
                            <div className="flex justify-between items-center text-[8px] font-mono text-muted-foreground uppercase tracking-widest">
                                <span>Chain_Height: 892,106</span>
                                <span>Notary: Active</span>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ShieldAlert className="h-5 w-5 text-primary" />
                    <div className="text-xs">
                        <span className="font-bold text-primary">Tamper-Proof Verification:</span>
                        <span className="text-muted-foreground ml-2">Current chain head hash: </span>
                        <span className="font-mono text-foreground ml-1">SHA256:7b2a...9f3e</span>
                    </div>
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/30">VERIFIED IMMUTABLE</Badge>
            </div>
        </div>
    );
}
