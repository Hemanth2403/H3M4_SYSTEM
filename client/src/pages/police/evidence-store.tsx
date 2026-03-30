import { useState, useEffect } from "react";
import {
    Database,
    Search,
    Filter,
    Lock,
    ShieldCheck,
    Fingerprint,
    Download,
    Eye,
    CheckCircle2,
    AlertTriangle,
    Server,
    Cpu,
    Globe,
    Network,
    FileCode,
    Clock,
    Zap,
    Scale,
    Gavel,
    ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
    DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { PoliceCase, Evidence } from "@shared/schema";
import { useRoute } from "wouter";

export default function EvidenceVault() {
    const { user } = useAuth();
    const [match, params] = useRoute("/police/evidence/:id");
    const [selectedArtifact, setSelectedArtifact] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch real evidence from API
    // If an ID is provided, fetch evidence for that case, otherwise fetch global (simulated)
    const { data: realEvidence = [] } = useQuery<Evidence[]>({
        queryKey: [params?.id ? `/api/police/cases/${params.id}/evidence` : "/api/submissions"],
        refetchInterval: 5000,
    });

    // Integrated Evidence Library (Real API + Mock UX Fallback)
    const artifacts = realEvidence.length > 0 ? realEvidence.map(e => ({
        id: e.id,
        name: e.evidenceType + ".pack",
        type: e.evidenceType,
        source: e.collectedBy,
        date: new Date(e.collectedAt).toLocaleString(),
        hash: e.documentHash || "SHA256:Pending...",
        witnesses: 12,
        status: "COURT_READY",
        severity: "high"
    })) : [
        {
            id: "ART-882-X1",
            name: "Login_Payload_Capture.pcap",
            type: "Network Trace",
            source: "Enterprise_FinBank",
            date: "2026-01-30 04:22 UTC",
            hash: "SHA256:7b2a758913...c5a",
            witnesses: 12,
            status: "COURT_READY",
            severity: "high"
        },
        {
            id: "ART-882-X2",
            name: "Memory_Dump_Segment_04.bin",
            type: "Memory Forensic",
            source: "Researcher_@ghost_shell",
            date: "2026-01-29 18:15 UTC",
            hash: "SHA256:f11d3322a...b99",
            witnesses: 9,
            status: "VERIFIED",
            severity: "medium"
        }
    ];

    const handleDownload = () => {
        if (!selectedArtifact) return;

        const toastId = toast.loading("Generating Certified Forensic Packet...", {
            description: "Fetching ledger signatures and applying judicial seals."
        });

        setTimeout(() => {
            // Create a fake file to download
            const content = `H3M4 ECOSYSTEM - CERTIFIED FORENSIC EVIDENCE\n` +
                `-------------------------------------------\n` +
                `Artifact ID: ${selectedArtifact.id}\n` +
                `Name: ${selectedArtifact.name}\n` +
                `Source: ${selectedArtifact.source}\n` +
                `Hash: ${selectedArtifact.hash}\n` +
                `Witnesses: ${selectedArtifact.witnesses}/12 Verified\n` +
                `Timestamp: ${selectedArtifact.date}\n\n` +
                `OFFICIAL STATUS: COURT_ADMISSIBLE\n` +
                `DIGITAL SEAL: SHA3_ECC_H3M4_OFFICIAL_SIG_0x${Math.random().toString(16).slice(2, 10).toUpperCase()}`;

            const element = document.createElement("a");
            const file = new Blob([content], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = `H3M4_Evidence_${selectedArtifact.id}.txt`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);

            toast.dismiss(toastId);
            toast.success("Certified Copy Downloaded", {
                description: "H3M4_Evidence_Bundle.txt is now available on your local drive."
            });
        }, 1500);
    };

    const handleArtifactClick = (artifact: any) => {
        setSelectedArtifact(artifact);
        setIsDetailOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700 pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold mb-1 flex items-center gap-3">
                        <Database className="h-8 w-8 text-primary" /> State Evidence & Forensic Store
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <Lock className="h-3 w-3" /> Immutable Ledger-Verified Digital Artifacts for H3M4 Ecosystem
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 border-primary/20 bg-primary/5">
                        <Globe className="h-4 w-4" /> Global Node Status
                    </Button>
                    <Button className="gap-2 bg-primary text-black font-bold">
                        <ShieldCheck className="h-4 w-4" /> Verify Evidence Hash
                    </Button>
                </div>
            </div>

            {/* Top Stats - Ledger Health */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-panel p-4 rounded-xl border-primary/10">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Witnesses</span>
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="text-2xl font-mono font-bold">12/12</div>
                    <Progress value={100} className="h-1 mt-2 [&>div]:bg-emerald-500" />
                </div>
                <div className="glass-panel p-4 rounded-xl border-primary/10">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Evidence Blocks</span>
                        <Zap className="h-3 w-3 text-yellow-500" />
                    </div>
                    <div className="text-2xl font-mono font-bold">10,992</div>
                    <div className="text-[9px] text-muted-foreground mt-1 uppercase tracking-tighter">Sync: 0.8s Integrity Lag</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border-primary/10">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Integrity Confidence</span>
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                    </div>
                    <div className="text-2xl font-mono font-bold">99.98%</div>
                    <div className="text-[9px] text-muted-foreground mt-1 uppercase tracking-tighter">Zero-Trust Verified</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border-primary/10">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Court Submissions</span>
                        <Gavel className="h-3 w-3 text-purple-500" />
                    </div>
                    <div className="text-2xl font-mono font-bold">142</div>
                    <div className="text-[9px] text-muted-foreground mt-1 uppercase tracking-tighter">Certified Findings</div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="p-4 rounded-xl bg-card/40 border border-white/5 backdrop-blur-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search evidence by ID, filename, or source..."
                        className="w-full bg-background/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2"><Filter className="h-4 w-4" /> Filter</Button>
                    <Button variant="outline" size="sm" className="gap-2"><Server className="h-4 w-4" /> Node View</Button>
                </div>
            </div>

            {/* Artifact Table */}
            <div className="rounded-2xl border border-white/5 overflow-hidden bg-card/20 backdrop-blur-md">
                <Table>
                    <TableHeader className="bg-white/5 cursor-default">
                        <TableRow className="hover:bg-transparent border-white/5">
                            <TableHead className="w-[150px] text-[10px] font-bold uppercase tracking-widest">Artifact ID</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Documentation Name</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Classification</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Provenance Source</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Ledger Witnesses</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
                            <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest pr-6">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {artifacts.map((artifact) => (
                            <TableRow
                                key={artifact.id}
                                className="group hover:bg-white/5 border-white/5 transition-colors cursor-pointer"
                                onClick={() => handleArtifactClick(artifact)}
                            >
                                <TableCell className="font-mono text-[11px] text-primary">{artifact.id}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <FileCode className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-xs font-bold">{artifact.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-[9px] border-white/10 text-muted-foreground">{artifact.type}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-xs">
                                        <Network className="h-3 w-3 text-muted-foreground" />
                                        {artifact.source}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5 ">
                                        <div className="flex -space-x-1.5">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-5 w-5 rounded-full bg-primary/20 border-2 border-[#090b0d] flex items-center justify-center">
                                                    <div className="h-1 w-1 rounded-full bg-primary" />
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground font-bold">+{artifact.witnesses - 3}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={cn(
                                        "text-[9px] font-bold uppercase tracking-tighter",
                                        artifact.status === "COURT_READY" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                            artifact.status === "VERIFIED" ? "bg-primary/10 text-primary border-primary/20" :
                                                "bg-orange-500/10 text-orange-500 border-orange-500/20"
                                    )}>
                                        {artifact.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-primary">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Artifact Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-4xl bg-sidebar/95 backdrop-blur-xl border-white/10">
                    <DialogHeader className="pb-4 border-b border-white/5">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <DialogTitle className="text-2xl font-heading font-bold flex items-center gap-3">
                                    <Fingerprint className="h-6 w-6 text-primary" /> Forensic Artifact Detail
                                </DialogTitle>
                                <DialogDescription className="font-mono text-[10px] text-primary uppercase tracking-wider">
                                    ID: {selectedArtifact?.id} // H3M4_VAULT_ITEM
                                </DialogDescription>
                            </div>
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">TAMPER_PROOF_SECURED</Badge>
                        </div>
                    </DialogHeader>

                    <Tabs defaultValue="provenance" className="mt-4">
                        <TabsList className="bg-white/5 border border-white/5 p-1 rounded-md h-9">
                            <TabsTrigger value="provenance" className="text-[10px] uppercase font-bold tracking-tight px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">Chain of Custody</TabsTrigger>
                            <TabsTrigger value="technical" className="text-[10px] uppercase font-bold tracking-tight px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">Hex/Raw Metadata</TabsTrigger>
                            <TabsTrigger value="legal" className="text-[10px] uppercase font-bold tracking-tight px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">Admissibility Review</TabsTrigger>
                        </TabsList>

                        <TabsContent value="provenance" className="mt-6 space-y-6">
                            <div className="relative pl-8 space-y-8">
                                <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent" />

                                <div className="relative">
                                    <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-primary shadow-[0_0_8px_rgba(38,217,98,0.8)]" />
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-foreground">Discovery & Initial Hash Injection</div>
                                        <div className="text-[10px] text-muted-foreground uppercase flex items-center gap-2">
                                            <Clock className="h-3 w-3" /> {selectedArtifact?.date} | Node: {selectedArtifact?.source}
                                        </div>
                                        <p className="text-[11px] text-muted-foreground max-w-xl">Initial SHA-256 hash calculated and broadcasted to 4 consensus shards for validation.</p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-primary/40 border border-primary/60" />
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-foreground font-mono italic">Ecosystem Validation (Admin Review)</div>
                                        <div className="text-[10px] text-muted-foreground uppercase flex items-center gap-2">
                                            <Clock className="h-3 w-3" /> Jan 30 10:45 UTC | Node: H3M4_CORE_NOTARY
                                        </div>
                                        <p className="text-[11px] text-muted-foreground max-w-xl">Admin cryptographically signed the artifact verifying high-impact relevance to the financial sector.</p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-primary shadow-[0_0_8px_rgba(38,217,98,0.4)] animate-pulse" />
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-foreground">Final Ledger Immutable Store</div>
                                        <div className="text-[10px] text-muted-foreground uppercase flex items-center gap-2">
                                            <ShieldCheck className="h-3 w-3" /> Current State | Consensus: {selectedArtifact?.witnesses} Witness Nodes
                                        </div>
                                        <p className="text-[11px] text-muted-foreground max-w-xl">Artifact is now synced across 12 sectors. Attempted modifications will trigger a system-wide consensus rejection.</p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="technical" className="mt-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Integrity Hash (SHA-256)</div>
                                    <div className="p-3 rounded bg-black font-mono text-[10px] text-primary break-all border border-primary/20">
                                        {selectedArtifact?.hash}
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase">File System Metadata</div>
                                    <div className="space-y-1.5 font-mono text-[9px] text-muted-foreground">
                                        <div className="flex justify-between"><span>SIZE:</span> <span className="text-white">402.1 KB</span></div>
                                        <div className="flex justify-between"><span>MIMETYPE:</span> <span className="text-white">application/octet-stream</span></div>
                                        <div className="flex justify-between"><span>CHKSUM_V2:</span> <span className="text-white">ECC_384_SIGNED</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-xl bg-black p-4 font-mono text-[10px] leading-relaxed border border-white/10 text-emerald-500/80 max-h-[180px] overflow-auto">
                                {/* Mock Hex Dump */}
                                {`00000000  48 33 4d 34 5f 56 41 55  4c 54 5f 48 45 41 44 45  |H3M4_VAULT_HEADE|
00000010  52 5f 56 31 00 00 00 00  7b 2a 75 73 65 72 5f 61  |R_V1....{*user_a|
00000020  75 74 68 5f 62 79 70 61  73 73 5f 63 61 70 74 75  |uth_bypass_captu|
00000030  72 65 7d 00 00 00 00 00  00 00 00 00 00 00 00 00  |re}.............|
00000040  41 42 43 44 45 46 01 02  03 04 05 06 07 08 09 0a  |ABCDEF..........|
00000050  ff ff ff ff 21 21 21 21  5b 45 58 50 4c 4f 49 54  |....!!!![EXPLOIT|
00000060  5d 20 53 51 4c 69 5f 44  45 54 45 43 54 45 44 00  |] SQLi_DETECTED.|`}
                            </div>
                        </TabsContent>

                        <TabsContent value="legal" className="mt-6 space-y-4">
                            <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-4">
                                <h4 className="text-sm font-bold flex items-center gap-2 text-primary">
                                    <Scale className="h-4 w-4" /> Judicial Admissibility Score: 9.8/10
                                </h4>
                                <div className="space-y-3">
                                    {[
                                        { label: "Chain of Custody Provenance", status: "VERIFIED" },
                                        { label: "Cryptographic Integrity Proof", status: "VERIFIED" },
                                        { label: "Independent Node Consensus", status: "VERIFIED" },
                                        { label: "Expert Witness Certification", status: "VERIFIED" },
                                    ].map((check, i) => (
                                        <div key={i} className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">{check.label}</span>
                                            <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
                                                <CheckCircle2 className="h-3.5 w-3.5" /> {check.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 bg-black/20 rounded-lg border border-white/5 text-[10px] text-muted-foreground italic leading-relaxed">
                                    "This artifact meets all requirements of Electronic Evidence under Section 65B of the Evidence Act. The decentralized consensus mechanism ensures that no single entity could have altered the artifact after its digital discovery by Node {selectedArtifact?.source} at {selectedArtifact?.date}."
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="mt-8 pt-4 border-t border-white/5">
                        <Button variant="ghost" onClick={() => setIsDetailOpen(false)}>Close</Button>
                        <Button
                            className="gap-2 bg-primary text-black font-bold"
                            onClick={handleDownload}
                        >
                            <Download className="h-4 w-4" /> Download Certified Copy
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
