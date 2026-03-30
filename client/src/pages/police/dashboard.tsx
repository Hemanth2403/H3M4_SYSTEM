import { useState } from "react";
import {
    Shield,
    Search,
    FileText,
    AlertCircle,
    CheckCircle2,
    Clock,
    Scale,
    Users,
    Fingerprint,
    Database,
    ArrowRight,
    Plus,
    Filter,
    Download,
    Eye,
    Link as LinkIcon,
    Gavel,
    Building,
    Building2,
    History as HistoryIcon,
    Loader2,
    Zap,
    Smartphone,
    UserX,
    Binary,
    Brain
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Submission, PoliceCase } from "@shared/schema";
import { AIForensicLab } from "@/components/police/automated-forensic-lab";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";

export default function PoliceDashboard() {
    const { user } = useAuth();
    const [, setLocation] = useLocation();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCase, setSelectedCase] = useState<string | null>(null);
    const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
    const [isThreatSearchOpen, setIsThreatSearchOpen] = useState(false);
    const [isEvidenceViewOpen, setIsEvidenceViewOpen] = useState(false);
    const [isEnterpriseReportsOpen, setIsEnterpriseReportsOpen] = useState(false);
    const [isCourtSuccessOpen, setIsCourtSuccessOpen] = useState(false);
    const [iocQuery, setIocQuery] = useState("");
    const [iocResults, setIocResults] = useState<any[] | null>(null);
    const [isSearchingIOC, setIsSearchingIOC] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [isBreachCheckOpen, setIsBreachCheckOpen] = useState(false);
    const [breachQuery, setBreachQuery] = useState("");
    const [breachResult, setBreachResult] = useState<any>(null);
    const [isSearchingBreach, setIsSearchingBreach] = useState(false);
    const [newCaseData, setNewCaseData] = useState({
        firNumber: "",
        caseTitle: "",
        caseType: "fraud",
        priority: "medium",
        victimDetails: "",
        suspectDetails: ""
    });
    const [filterStatus, setFilterStatus] = useState<string>("All Cases");
    const [isLinkingToCase, setIsLinkingToCase] = useState<string | null>(null); // threatId being linked
    const [targetCaseId, setTargetCaseId] = useState<string>("");

    // Fetch threat signals for investigation
    const { data: submissions = [] } = useQuery<Submission[]>({
        queryKey: ["/api/submissions"],
        refetchInterval: 10000,
    });

    // Fetch police cases from API
    const { data: cases = [], refetch: refetchCases, isLoading: isCasesLoading } = useQuery<PoliceCase[]>({
        queryKey: ["/api/police/cases"],
        refetchInterval: 3000,
    });

    console.log(`[POLICE_UI] Synced ${cases.length} cases from ledger.`);

    // Filter verified threats for search
    const verifiedThreats = (submissions || []).filter(s => s.status === "verified");

    // Stats
    const stats = {
        totalCases: Array.isArray(cases) ? cases.length : 0,
        openCases: Array.isArray(cases) ? cases.filter(c => c.status === "open" || c.status === "investigating").length : 0,
        closedCases: Array.isArray(cases) ? cases.filter(c => c.status === "closed").length : 0,
        convictions: Array.isArray(cases) ? cases.filter(c => c.courtStatus === "convicted").length : 0,
    };

    const filteredCases = cases.filter(c => {
        if (filterStatus === "All Cases") return true;
        if (filterStatus === "Open Cases") return c.status === "open" || c.status === "investigating";
        if (filterStatus === "Closed Cases") return c.status === "closed";
        if (filterStatus === "Convictions") return c.courtStatus === "convicted";
        return true;
    });

    const handleNewCase = async () => {
        try {
            setIsScanning(true);
            const response = await fetch("/api/police/cases", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firNumber: newCaseData.firNumber,
                    caseTitle: newCaseData.caseTitle,
                    caseType: newCaseData.caseType,
                    priority: newCaseData.priority,
                    assignedOfficer: user?.id,
                    victimDetails: newCaseData.victimDetails || "",
                    suspectDetails: newCaseData.suspectDetails || "",
                    linkedThreats: null,
                    linkedIOCs: null,
                    evidenceReports: null,
                    courtStatus: null,
                    closedAt: null
                })
            });

            if (response.ok) {
                const createdCase = await response.json();
                // Wait for the intelligence scan simulation
                setTimeout(async () => {
                    setIsScanning(false);
                    toast.success("H3M4 Intelligence Scan Complete", {
                        description: `FIR ${newCaseData.firNumber} registered and auto-mapped to research findings.`
                    });
                    setIsNewCaseOpen(false);

                    // Redirect to the analysis page to show "feeding of details"
                    setLocation(`/police/analysis/${createdCase.id}`);

                    setNewCaseData({
                        firNumber: "",
                        caseTitle: "",
                        caseType: "fraud",
                        priority: "medium",
                        victimDetails: "",
                        suspectDetails: ""
                    });

                    // Force a hard refetch
                    await refetchCases();
                    queryClient.invalidateQueries({ queryKey: ["/api/police/cases"] });
                }, 2000);
            } else {
                setIsScanning(false);
                const errorData = await response.json();
                toast.error("Registration Failed", {
                    description: errorData.message || "Ensure FIR number is unique."
                });
            }
        } catch (error) {
            setIsScanning(false);
            toast.error("Network Error", {
                description: "Failed to connect to the H3M4 ecosystem."
            });
        }
    };

    const handleLinkThreat = async (threatId: string) => {
        if (!targetCaseId) {
            toast.error("No Case Selected", {
                description: "Please select a case to link this intelligence to."
            });
            return;
        }

        try {
            const targetCase = cases.find(c => c.id === targetCaseId);
            if (!targetCase) return;

            let existingThreats = [];
            try {
                existingThreats = JSON.parse(targetCase.linkedThreats || "[]");
            } catch (e) {
                existingThreats = [];
            }

            if (existingThreats.includes(threatId)) {
                toast.info("Already Linked", {
                    description: "This threat signal is already anchored to the FIR ledger."
                });
                setIsLinkingToCase(null);
                return;
            }

            const updatedThreats = [...existingThreats, threatId];

            const response = await fetch(`/api/police/cases/${targetCaseId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    linkedThreats: JSON.stringify(updatedThreats),
                    status: "investigating"
                })
            });

            if (response.ok) {
                toast.success(`Threat Linked to ${targetCase.firNumber}`, {
                    description: "Forensic artifact hash anchored to the FIR ledger."
                });
                queryClient.invalidateQueries({ queryKey: ["/api/police/cases"] });
                setIsLinkingToCase(null);
                setTargetCaseId("");
            } else {
                throw new Error("Ledger update failed");
            }
        } catch (error) {
            toast.error("Bridge Error", {
                description: "Failed to anchor threat to the case ledger."
            });
        }
    };

    const handleIOCSearch = async () => {
        if (!iocQuery) return;
        setIsSearchingIOC(true);
        setIocResults([]);

        try {
            const results: any[] = [];
            const queryLower = iocQuery.toLowerCase();

            // 1. Search Research Intel
            verifiedThreats.forEach(threat => {
                const threatText = `${threat.title} ${threat.description} ${threat.affectedSystems || ""} ${threat.poc || ""}`.toLowerCase();
                if (threatText.includes(queryLower)) {
                    results.push({
                        type: "INTEL",
                        val: threat.title,
                        risk: threat.severity.toUpperCase(),
                        hits: 1,
                        source: `Researcher @${threat.author}`
                    });
                }
            });

            // 2. Check if it's an IP for OSINT
            const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
            if (ipRegex.test(iocQuery)) {
                try {
                    const osintRes = await fetch(`/api/osint/enrich/${iocQuery}`);
                    if (osintRes.ok) {
                        const data = await osintRes.json();
                        results.unshift({
                            type: "IP",
                            val: data.ip,
                            risk: data.riskScore > 50 ? "CRITICAL" : "MEDIUM",
                            hits: 1,
                            source: `H3M4 Node / ${data.isp}`,
                            location: data.location
                        });
                    }
                } catch (e) {
                    console.error("OSINT check failed", e);
                }
            }

            setIocResults(results.length > 0 ? results : null);
        } catch (error) {
            toast.error("Lookup Failure", {
                description: "The H3M4 search node timed out."
            });
        } finally {
            setIsSearchingIOC(false);
        }
    };

    const handleBreachSearch = () => {
        if (!breachQuery) return;
        setIsSearchingBreach(true);
        setBreachResult(null);

        // Simulate API delay
        setTimeout(() => {
            setIsSearchingBreach(false);
            setBreachResult({
                telephones: [breachQuery || "919876543210", "919988776655", "918765432109"],
                addresses: [
                    "H.No 12/4, Sector 18, Near Shiv Mandir, Noida, UP, 201301",
                    "Flat 402, Green Valley Apts, Indiranagar, Bangalore, 560038",
                    "B-116 3rd Floor, Gandhi Vihar, Delhi, 110009"
                ],
                documentNumber: "5477 8222 8888",
                fullName: "Rahul V. Sharma",
                fatherName: "Vikram Raj Sharma",
                region: "DELHI AIRTEL; UP WEST JIO; KARNATAKA BSNL",
                breachSources: ["HiTeckThroop (2025)", "Cellular Leak (1.8B Records)"],
                riskLevel: "CRITICAL"
            });
            toast.success("Intelligence Found", {
                description: "Target profile reconstructed from telecom leak."
            });
        }, 2000);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "open": return "bg-blue-500";
            case "investigating": return "bg-orange-500";
            case "closed": return "bg-green-500";
            default: return "bg-gray-500";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "critical": return "text-red-500 border-red-500";
            case "high": return "text-orange-500 border-orange-500";
            case "medium": return "text-yellow-500 border-yellow-500";
            default: return "text-green-500 border-green-500";
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Enhanced Header with Ecosystem Explanation */}
            <div className="relative rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent p-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="relative">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Scale className="h-8 w-8 md:h-10 md:w-10 text-blue-500" />
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold">
                                    Police Investigation Portal
                                </h1>
                            </div>
                            <p className="text-muted-foreground text-lg mb-4">
                                Powered by H3M4 Threat Intelligence Ecosystem
                            </p>

                            {/* Ecosystem Flow Visualization */}
                            <div className="flex flex-wrap items-center gap-2 text-sm mt-4 p-4 rounded-xl bg-black/20 border border-white/10">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                                    <Shield className="h-4 w-4 text-cyan-500" />
                                    <span className="text-cyan-500 font-semibold">Researchers Discover</span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                    <CheckCircle2 className="h-4 w-4 text-purple-500" />
                                    <span className="text-purple-500 font-semibold">Admin Verifies</span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                                    <Users className="h-4 w-4 text-green-500" />
                                    <span className="text-green-500 font-semibold">Enterprises Mitigate</span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                    <Gavel className="h-4 w-4 text-blue-500" />
                                    <span className="text-blue-500 font-semibold">Police Investigate</span>
                                </div>
                            </div>

                            <div className="mt-3 text-xs text-muted-foreground italic">
                                💡 Access expert-verified threat intelligence from 1000+ security researchers for your criminal investigations
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30 py-1.5 px-3">
                                <span className="relative flex h-2 w-2 mr-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                OFFICER ON DUTY
                            </Badge>
                            <Button
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 gap-2"
                                onClick={() => setIsNewCaseOpen(true)}
                            >
                                <Plus className="h-4 w-4" /> Register New FIR
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Ledger Activity Feed */}
            <div className="glass-panel border-emerald-500/20 bg-emerald-500/5 rounded-xl px-4 py-2 flex items-center justify-between overflow-hidden">
                <div className="flex items-center gap-3 shrink-0">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live H3M4 Ledger Feed</span>
                </div>
                <div className="flex-1 px-8 overflow-hidden">
                    <div className="flex gap-12 whitespace-nowrap animate-marquee">
                        <span className="text-[10px] text-muted-foreground font-mono">BLOCK #8.2k ANCHORED [SHA3:0x882...eA1]</span>
                        <span className="text-[10px] text-emerald-500 font-mono">NEW FIR RECORDED: {cases[0]?.firNumber || "SCANNING..."}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">NODE CONSENSUS REACHED (12/12)</span>
                        <span className="text-[10px] text-primary font-mono">THREAT SIGNAL VERIFIED: SHARD_882</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 border-l border-emerald-500/10 pl-4">
                    <HistoryIcon className="h-3 w-3 text-emerald-500" />
                    <span className="text-[10px] text-muted-foreground font-mono uppercase">Syncing...</span>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Left Side: Global Forensic Lab Component */}
                <div className="xl:col-span-1 order-2 xl:order-1 pt-6 xl:pt-0">
                    <div className="sticky top-24 space-y-6">
                        <div className="glass-panel p-6 rounded-2xl border-primary/20 bg-primary/5 shadow-[0_0_50px_rgba(38,217,98,0.05)] relative overflow-hidden group">
                            <div className="absolute -right-10 -top-10 h-32 w-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
                            <div className="relative z-10">
                                <h2 className="text-xl font-heading font-black italic tracking-tighter mb-4 flex items-center gap-2">
                                    <Brain className="h-5 w-5 text-primary" /> GLOBAL FORENSIC LAB
                                </h2>
                                <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                                    Quick-scan any artifact for immediate Reactive AI intelligence correlation.
                                </p>
                                
                                <div className="p-0.5 rounded-xl border border-white/5 bg-black/40">
                                    <AIForensicLab />
                                </div>
                                
                                <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                                    <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                                        <span>Node Status</span>
                                        <span className="text-primary">Operational</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                                        <span>Latency</span>
                                        <span className="text-blue-400">0.8ms</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-2xl border-white/5 bg-white/[0.02] space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground italic">Investigator Notice</h3>
                            <p className="text-[10px] text-muted-foreground/80 leading-relaxed italic">
                                Preliminary scans only. Anchor evidence to specific FIRs via the case record.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Dashboard Content */}
                <div className="xl:col-span-3 order-1 xl:order-2 space-y-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                    className={cn(
                        "glass-panel rounded-xl p-6 border-primary/10 cursor-pointer transition-all hover:scale-[1.02]",
                        filterStatus === "All Cases" && "border-blue-500 ring-1 ring-blue-500 bg-blue-500/5"
                    )}
                    onClick={() => setFilterStatus("All Cases")}
                >
                    <div className="flex items-center justify-between mb-4">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <Badge className="bg-blue-500/20 text-blue-500">Active</Badge>
                    </div>
                    <div className="text-3xl font-bold mb-1">{stats.totalCases}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Total Cases</div>
                </div>

                <div
                    className={cn(
                        "glass-panel rounded-xl p-6 border-orange-500/10 cursor-pointer transition-all hover:scale-[1.02]",
                        filterStatus === "Open Cases" && "border-orange-500 ring-1 ring-orange-500 bg-orange-500/5"
                    )}
                    onClick={() => setFilterStatus("Open Cases")}
                >
                    <div className="flex items-center justify-between mb-4">
                        <AlertCircle className="h-8 w-8 text-orange-500" />
                        <Badge className="bg-orange-500/20 text-orange-500">Investigating</Badge>
                    </div>
                    <div className="text-3xl font-bold mb-1">{stats.openCases}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Open Cases</div>
                </div>

                <div
                    className={cn(
                        "glass-panel rounded-xl p-6 border-green-500/10 cursor-pointer transition-all hover:scale-[1.02]",
                        filterStatus === "Closed Cases" && "border-green-500 ring-1 ring-green-500 bg-green-500/5"
                    )}
                    onClick={() => setFilterStatus("Closed Cases")}
                >
                    <div className="flex items-center justify-between mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                        <Badge className="bg-green-500/20 text-green-500">Resolved</Badge>
                    </div>
                    <div className="text-3xl font-bold mb-1">{stats.closedCases}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Closed Cases</div>
                </div>

                <div
                    className={cn(
                        "glass-panel rounded-xl p-6 border-purple-500/10 cursor-pointer transition-all hover:scale-[1.02]",
                        filterStatus === "Convictions" && "border-purple-500 ring-1 ring-purple-500 bg-purple-500/5"
                    )}
                    onClick={() => setFilterStatus("Convictions")}
                >
                    <div className="flex items-center justify-between mb-4">
                        <Gavel className="h-8 w-8 text-purple-500" />
                        <Badge className="bg-purple-500/20 text-purple-500">Success</Badge>
                    </div>
                    <div className="text-3xl font-bold mb-1">{stats.convictions}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Convictions</div>
                </div>
            </div>

            {/* H3M4 Ecosystem Benefits for Police */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {/* Researcher Intelligence */}
                <div
                    className="glass-panel rounded-xl p-6 border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer group"
                    onClick={() => setIsThreatSearchOpen(true)}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Shield className="h-6 w-6 text-cyan-500" />
                        </div>
                        <div>
                            <h3 className="font-bold flex items-center gap-2">
                                Researcher Intelligence <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h3>
                            <p className="text-xs text-muted-foreground">Expert-Verified Threats</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Available Threats</span>
                            <span className="font-bold text-cyan-500">{verifiedThreats.length}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Verified by Admin</span>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="pt-2 border-t border-white/5">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Access technical attack patterns, PoCs, and IOCs discovered by security researchers.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Enterprise Incident Data */}
                <div
                    className="glass-panel rounded-xl p-6 border-green-500/20 hover:border-green-500/40 transition-all cursor-pointer group"
                    onClick={() => setIsEnterpriseReportsOpen(true)}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Building className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                            <h3 className="font-bold flex items-center gap-2">
                                Enterprise Reports <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h3>
                            <p className="text-xs text-muted-foreground">Victim Organizations</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Incident Reports</span>
                            <span className="font-bold text-green-500">24</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Loss Amount</span>
                            <span className="font-bold text-red-500">₹2.4Cr</span>
                        </div>
                        <div className="pt-2 border-t border-white/5">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Link enterprise breach reports to your FIR as victim evidence.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Investigation Success */}
                <div
                    className="glass-panel rounded-xl p-6 border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer group"
                    onClick={() => setIsCourtSuccessOpen(true)}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Gavel className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-bold flex items-center gap-2">
                                Court Success Rate <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h3>
                            <p className="text-xs text-muted-foreground">With H3M4 Evidence</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Conviction Rate</span>
                            <span className="font-bold text-blue-500">87%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Admissibility Verified</span>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="pt-2 border-t border-white/5">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Digital signatures, timestamps, and expert testimony support.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                    className="glass-panel rounded-xl p-6 border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer group"
                    onClick={() => setIsThreatSearchOpen(true)}
                >
                    <div className="flex items-center justify-between mb-4">
                        <Database className="h-8 w-8 text-cyan-500 group-hover:scale-110 transition-transform" />
                        <div className="flex items-center gap-2">
                            <Badge className="bg-cyan-500/20 text-cyan-500 text-xs">{verifiedThreats.length} Available</Badge>
                            <ArrowRight className="h-5 w-5 text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Search Researcher Findings</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                        Access {verifiedThreats.length} admin-verified vulnerabilities from security researchers
                    </p>
                    <div className="flex items-center gap-2 text-xs text-cyan-500">
                        <Shield className="h-3 w-3" />
                        <span>Expert PoCs & Attack Patterns</span>
                    </div>
                </div>

                <div
                    className="glass-panel rounded-xl p-6 border-primary/10 hover:border-primary/30 transition-all cursor-pointer group"
                    onClick={() => setIsEvidenceViewOpen(true)}
                >
                    <div className="flex items-center justify-between mb-4">
                        <Fingerprint className="h-8 w-8 text-yellow-500 group-hover:scale-110 transition-transform" />
                        <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">IOC Lookup</h3>
                    <p className="text-sm text-muted-foreground">
                        Search for IP addresses, file hashes, and other indicators of compromise
                    </p>
                </div>

                <Link href="/police/evidence">
                    <div className="glass-panel rounded-xl p-6 border-primary/10 hover:border-primary/30 transition-all cursor-pointer group h-full">
                        <div className="flex items-center justify-between mb-4">
                            <Download className="h-8 w-8 text-green-500 group-hover:scale-110 transition-transform" />
                            <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Evidence Vault</h3>
                        <p className="text-sm text-muted-foreground">
                            Access the immutable ledger and generate court-ready forensic reports.
                        </p>
                    </div>
                </Link>

                <div
                    className="glass-panel rounded-xl p-6 border-red-500/20 hover:border-red-500/40 transition-all cursor-pointer group"
                    onClick={() => {
                        // Open breach dialog
                        setIsBreachCheckOpen(true);
                    }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <Smartphone className="h-8 w-8 text-red-500 group-hover:scale-110 transition-transform" />
                        <ArrowRight className="h-5 w-5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Breach Bot Details</h3>
                    <p className="text-sm text-muted-foreground">
                        Fetch PII (Name, Aadhar, Address) from dark web dumps via Phone #.
                    </p>
                </div>
            </div >

            {/* Active Cases */}
            < div className="glass-panel rounded-xl p-6 border-primary/10" >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold">Active Investigations</h2>
                        <p className="text-sm text-muted-foreground">Displaying {filterStatus.toLowerCase()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select
                            className="bg-background border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All Cases">All Cases</option>
                            <option value="Open Cases">Open / Investigating</option>
                            <option value="Closed Cases">Closed</option>
                            <option value="Convictions">Convictions</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredCases.length > 0 ? (
                        filteredCases.map((policeCase) => (
                            <div
                                key={policeCase.id}
                                className="p-5 rounded-xl border border-white/10 bg-card/40 hover:bg-white/5 transition-all cursor-pointer group"
                                onClick={() => setLocation(`/police/analysis/${policeCase.id}`)}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Badge className={cn("font-mono text-xs", getStatusColor(policeCase.status))}>
                                                {policeCase.status.toUpperCase()}
                                            </Badge>
                                            <Badge variant="outline" className={cn("text-xs font-bold", getPriorityColor(policeCase.priority))}>
                                                {policeCase.priority.toUpperCase()}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground font-mono">
                                                {policeCase.firNumber}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold mb-2">{policeCase.caseTitle}</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            <strong>Victim:</strong> {policeCase.victimDetails || 'N/A'}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {policeCase.linkedThreats && JSON.parse(policeCase.linkedThreats).length > 0 && (
                                                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold">
                                                    <Zap className="h-3 w-3 mr-1" /> AI MAPPED FINDINGS: {JSON.parse(policeCase.linkedThreats).length}
                                                </Badge>
                                            )}
                                            {policeCase.linkedIOCs && JSON.parse(policeCase.linkedIOCs).length > 0 && (
                                                <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] font-bold">
                                                    <Fingerprint className="h-3 w-3 mr-1" /> IOCS DETECTED: {JSON.parse(policeCase.linkedIOCs).length}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            <strong>Suspect:</strong> {policeCase.suspectDetails || 'Unknown'}
                                        </p>
                                    </div>
                                    <Button size="sm" variant="outline" className="gap-2">
                                        <Eye className="h-3 w-3" /> View Case
                                    </Button>
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3 w-3" />
                                            Filed: {new Date(policeCase.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <LinkIcon className="h-3 w-3" />
                                            {policeCase.linkedThreats ? JSON.parse(policeCase.linkedThreats).length : 0} Linked Threats
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Fingerprint className="h-3 w-3" />
                                            {policeCase.linkedIOCs ? JSON.parse(policeCase.linkedIOCs).length : 0} IOCs
                                        </div>
                                        {policeCase.courtStatus && (
                                            <div className="flex items-center gap-2">
                                                <Gavel className="h-3 w-3 text-purple-500" />
                                                Court: {policeCase.courtStatus}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
                            <p className="text-muted-foreground">No cases found matching "{filterStatus}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>

        {/* New Case Dialog */}
            <Dialog open={isNewCaseOpen} onOpenChange={setIsNewCaseOpen}>
                <DialogContent className="bg-sidebar border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5 text-blue-500" />
                            Register New FIR
                        </DialogTitle>
                        <DialogDescription>
                            Create a new cyber crime investigation case
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        <div>
                            <Label>FIR Number</Label>
                            <Input
                                placeholder="FIR/2026/CYB/XXXX"
                                className="bg-background border-white/10"
                                value={newCaseData.firNumber}
                                onChange={(e) => setNewCaseData({ ...newCaseData, firNumber: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label>Case Title</Label>
                            <Input
                                placeholder="Brief description of the cybercrime"
                                className="bg-background border-white/10"
                                value={newCaseData.caseTitle}
                                onChange={(e) => setNewCaseData({ ...newCaseData, caseTitle: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Case Type</Label>
                                <Select
                                    value={newCaseData.caseType}
                                    onValueChange={(value) => setNewCaseData({ ...newCaseData, caseType: value })}
                                >
                                    <SelectTrigger className="bg-background border-white/10">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-sidebar border-white/10">
                                        <SelectItem value="fraud">Banking/UPI Fraud</SelectItem>
                                        <SelectItem value="ransomware">Ransomware Attack</SelectItem>
                                        <SelectItem value="data_breach">Data Breach</SelectItem>
                                        <SelectItem value="phishing">Phishing/Social Engineering</SelectItem>
                                        <SelectItem value="ddos">DDoS Attack</SelectItem>
                                        <SelectItem value="identity">Identity Theft</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Priority</Label>
                                <Select
                                    value={newCaseData.priority}
                                    onValueChange={(value) => setNewCaseData({ ...newCaseData, priority: value })}
                                >
                                    <SelectTrigger className="bg-background border-white/10">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-sidebar border-white/10">
                                        <SelectItem value="critical">Critical</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label>Victim Details</Label>
                            <Textarea
                                placeholder="Name, contact, loss amount, affected systems..."
                                className="bg-background border-white/10 min-h-[80px]"
                                value={newCaseData.victimDetails}
                                onChange={(e) => setNewCaseData({ ...newCaseData, victimDetails: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label>Suspect Information (if known)</Label>
                            <Textarea
                                placeholder="Name, IP address, location, modus operandi..."
                                className="bg-background border-white/10 min-h-[80px]"
                                value={newCaseData.suspectDetails}
                                onChange={(e) => setNewCaseData({ ...newCaseData, suspectDetails: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setIsNewCaseOpen(false)} disabled={isScanning}>
                                Cancel
                            </Button>
                            <Button
                                className="bg-blue-500 hover:bg-blue-600 min-w-[120px]"
                                onClick={handleNewCase}
                                disabled={isScanning}
                            >
                                {isScanning ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Scanning...
                                    </>
                                ) : (
                                    <>
                                        <FileText className="h-4 w-4 mr-2" />
                                        Register FIR
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Scanning Intelligence Overlay */}
                        <AnimatePresence>
                            {isScanning && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
                                >
                                    <div className="relative mb-6">
                                        <div className="h-24 w-24 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                                        <Shield className="h-10 w-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 font-heading tracking-widest uppercase">H3M4 AI Intelligence Mapping</h3>
                                    <div className="w-full max-w-xs space-y-3">
                                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-primary"
                                                initial={{ width: "0%" }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 2, ease: "linear" }}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[10px] text-primary font-mono animate-pulse">Scanning Researcher Database...</p>
                                            <p className="text-[10px] text-muted-foreground font-mono">Correlating Victim IP: {newCaseData.suspectDetails.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/)?.[0] || "Global Sync"}</p>
                                            <p className="text-[10px] text-muted-foreground font-mono">Mapping Attack Vectors...</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Threat Search Dialog */}
            <Dialog open={isThreatSearchOpen} onOpenChange={setIsThreatSearchOpen}>
                <DialogContent className="bg-sidebar border-white/10 max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-primary" />
                            Search Threat Intelligence Database
                        </DialogTitle>
                        <DialogDescription>
                            Find vulnerabilities and attack patterns matching your investigation
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input
                                placeholder="Search by attack type, IP, hash, CVE, keywords..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-background border-white/10"
                            />
                        </div>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {verifiedThreats
                                .filter(t =>
                                    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    t.category.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .slice(0, 10)
                                .map((threat) => (
                                    <div
                                        key={threat.id}
                                        className="p-4 rounded-xl border border-white/10 bg-card/40 hover:bg-white/5 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge className={cn(
                                                        "text-xs",
                                                        threat.severity === "critical" ? "bg-red-500" :
                                                            threat.severity === "high" ? "bg-orange-500" :
                                                                threat.severity === "medium" ? "bg-yellow-500" : "bg-green-500"
                                                    )}>
                                                        {threat.severity.toUpperCase()}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        {threat.category}
                                                    </Badge>
                                                </div>
                                                <h4 className="font-bold mb-1">{threat.title}</h4>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {threat.description}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {isLinkingToCase === threat.id ? (
                                                    <div className="flex gap-2 animate-in slide-in-from-right-2">
                                                        <Select value={targetCaseId} onValueChange={setTargetCaseId}>
                                                            <SelectTrigger className="w-[180px] h-8 text-[10px] bg-background border-white/10">
                                                                <SelectValue placeholder="Select FIR" />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-sidebar border-white/10">
                                                                {cases.filter(c => c.status !== 'closed').map(c => (
                                                                    <SelectItem key={c.id} value={c.id} className="text-[10px]">
                                                                        {c.firNumber} - {c.caseTitle.substring(0, 15)}...
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <Button
                                                            size="sm"
                                                            className="h-8 px-2 bg-primary text-black font-bold text-[10px]"
                                                            onClick={() => handleLinkThreat(threat.id)}
                                                        >
                                                            Confirm
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 px-2 text-[10px]"
                                                            onClick={() => setIsLinkingToCase(null)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="gap-2 h-8 text-[10px]"
                                                        onClick={() => setIsLinkingToCase(threat.id)}
                                                    >
                                                        <LinkIcon className="h-3 w-3" /> Link to Case
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-white/5">
                                            <span>Submitted: {new Date(threat.submittedAt).toLocaleDateString()}</span>
                                            <span>Author: {threat.author}</span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* IOC Lookup Dialog */}
            <Dialog open={isEvidenceViewOpen} onOpenChange={setIsEvidenceViewOpen} >
                <DialogContent className="bg-sidebar border-white/10 max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Fingerprint className="h-5 w-5 text-yellow-500" />
                            IOC (Indicators of Compromise) Lookup
                        </DialogTitle>
                        <DialogDescription>
                            Search for malicious IPs, file hashes, domains, and other forensic artifacts
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter IP address, file hash, domain, or CVE ID..."
                                className="bg-background border-white/10"
                                value={iocQuery}
                                onChange={(e) => setIocQuery(e.target.value)}
                            />
                            <Button className="bg-primary text-black font-bold" onClick={handleIOCSearch}>
                                {isSearchingIOC ? "Searching..." : "Search"}
                            </Button>
                        </div>

                        {iocResults ? (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-400">
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Results Found</div>
                                {iocResults.map((r, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-white/10 bg-black/40 flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center font-mono text-[10px] font-bold text-primary">{r.type}</div>
                                            <div>
                                                <div className="text-xs font-mono font-bold text-white mb-1">{r.val}</div>
                                                <div className="text-[9px] text-muted-foreground uppercase">Source: {r.source}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className={cn("text-[8px] mb-1 font-bold", r.risk === "CRITICAL" ? "text-red-500 border-red-500/20 bg-red-500/5" : "text-orange-500 border-orange-500/20 bg-orange-500/5")}>
                                                {r.risk} RISK
                                            </Badge>
                                            <div className="text-[9px] text-muted-foreground uppercase">{r.hits} Occurrences</div>
                                        </div>
                                    </div>
                                ))}
                                <Button className="w-full h-8 text-xs font-bold" variant="outline">Attach All to Current Case</Button>
                            </div>
                        ) : (
                            <div className="p-8 rounded-xl border border-dashed border-primary/30 bg-primary/5">
                                <div className="text-center text-sm text-muted-foreground">
                                    <Fingerprint className="h-12 w-12 mx-auto mb-2 text-primary/50" />
                                    <p>Enter an IOC to search across all verified threat reports</p>
                                    <p className="text-xs mt-1">Supported: IPv4, IPv6, MD5, SHA1, SHA256, domains</p>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Enterprise Reports Dialog */}
            <Dialog open={isEnterpriseReportsOpen} onOpenChange={setIsEnterpriseReportsOpen}>
                <DialogContent className="bg-sidebar border-white/10 max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-green-500" />
                            Enterprise Victim Intelligence
                        </DialogTitle>
                        <DialogDescription>
                            Incident reports and loss statements shared by victim organizations.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                        {[
                            { org: "GlobalFin Bank", date: "Jan 12, 2026", impact: "High", loss: "₹42L", type: "DB Leak" },
                            { org: "TechStream Services", date: "Jan 28, 2026", impact: "Medium", loss: "₹8L", type: "Ransomware" },
                            { org: "SafePay Systems", date: "Jan 30, 2026", impact: "Critical", loss: "₹1.4Cr", type: "Card Fraud" },
                        ].map((report, i) => (
                            <div key={i} className="p-4 rounded-xl border border-white/10 bg-card/40 flex items-center justify-between hover:bg-white/5 transition-all">
                                <div>
                                    <div className="text-sm font-bold text-white mb-1">{report.org}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{report.type} // {report.date}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-red-500">{report.loss}</div>
                                    <Badge className="text-[8px] bg-green-500/10 text-green-500 border-green-500/20">{report.impact} IMPACT</Badge>
                                </div>
                            </div>
                        ))}
                        <Button className="w-full gap-2">Request Detailed Forensic Packets</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Court Success Dialog */}
            <Dialog open={isCourtSuccessOpen} onOpenChange={setIsCourtSuccessOpen} >
                <DialogContent className="bg-sidebar border-white/10 max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Scale className="h-5 w-5 text-blue-500" />
                            Judicial Success Metrics
                        </DialogTitle>
                        <DialogDescription>
                            How H3M4 ecosystem evidence has impacted legal outcomes.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
                                <div className="text-2xl font-bold text-blue-500">87%</div>
                                <div className="text-[10px] text-muted-foreground uppercase">Conviction Rate</div>
                            </div>
                            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
                                <div className="text-2xl font-bold text-blue-500">1.2s</div>
                                <div className="text-[10px] text-muted-foreground uppercase">Avg Verification</div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Admissibility Factors</h4>
                            {[
                                "Tamper-Proof Ledger Hash (SHA-3)",
                                "Researcher Certified Identity Proofs",
                                "Enterprise Data Matching Verdicts",
                                "Decentralized Witness Consensus"
                            ].map((f, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span className="text-xs text-foreground/90">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Breach Bot Dialog */}
            <Dialog open={isBreachCheckOpen} onOpenChange={setIsBreachCheckOpen}>
                <DialogContent className="bg-sidebar border-red-500/20 max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-500">
                            <UserX className="h-5 w-5" />
                            Breach Data Extraction
                        </DialogTitle>
                        <DialogDescription>
                            Querying indexed Telegram bot dumps (Note: Authorized LEO Use Only)
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 mt-4">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Enter Target Phone Number (+91...)"
                                    className="pl-10 bg-black/40 border-red-500/20 focus-visible:ring-red-500"
                                    value={breachQuery}
                                    onChange={(e) => setBreachQuery(e.target.value)}
                                />
                            </div>
                            <Button
                                className="bg-red-500 hover:bg-red-600 font-bold"
                                onClick={handleBreachSearch}
                                disabled={isSearchingBreach}
                            >
                                {isSearchingBreach ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Fetch"
                                )}
                            </Button>
                        </div>

                        {/* Loading State */}
                        {isSearchingBreach && (
                            <div className="space-y-2 p-4 rounded-lg bg-black/20 border border-red-500/10">
                                <div className="flex items-center gap-2 text-xs text-red-400 font-mono animate-pulse">
                                    <Binary className="h-3 w-3" />
                                    <span>Decrypting Telegram Dump #8291...</span>
                                </div>
                                <div className="h-1 w-full bg-red-500/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "100%" }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        className="h-full bg-red-500/50 w-1/2"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Result State */}
                        {breachResult && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <UserX className="h-24 w-24 text-red-500" />
                                    </div>

                                    <div className="space-y-4 relative z-10 text-sm font-mono">
                                        <Badge className="bg-red-500 text-white hover:bg-red-600 border-none mb-2 w-full justify-center">
                                            ⚠️ TARGET PROFILE FOUND
                                        </Badge>

                                        {/* Telephones */}
                                        <div className="space-y-1">
                                            {breachResult.telephones.map((tel: string, i: number) => (
                                                <div key={i} className="flex items-center gap-2 text-white/90">
                                                    <Smartphone className="h-3 w-3 text-red-400" />
                                                    <span className="text-xs">Telephone: <span className="text-white font-bold">{tel}</span></span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Addresses */}
                                        <div className="space-y-1 pt-2 border-t border-red-500/20">
                                            {breachResult.addresses.map((addr: string, i: number) => (
                                                <div key={i} className="flex items-start gap-2 text-white/90">
                                                    <div className="mt-0.5"><Building2 className="h-3 w-3 text-red-400" /></div>
                                                    <span className="text-xs">Adres: <span className="text-white/80">{addr}</span></span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Document */}
                                        <div className="pt-2 border-t border-red-500/20">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-3 w-3 text-red-400" />
                                                <span className="text-xs text-white/90">Document number: <span className="text-red-400 font-bold tracking-widest">{breachResult.documentNumber}</span></span>
                                            </div>
                                        </div>

                                        {/* Profile */}
                                        <div className="pt-2 border-t border-red-500/20 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-3 w-3 text-red-400" />
                                                <span className="text-xs text-white/90">Full name: <span className="text-white font-bold">{breachResult.fullName}</span></span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <UserX className="h-3 w-3 text-red-400" />
                                                <span className="text-xs text-white/90">The name of the father: <span className="text-white font-bold">{breachResult.fatherName}</span></span>
                                            </div>
                                        </div>

                                        {/* Region */}
                                        <div className="pt-2 border-t border-red-500/20">
                                            <div className="flex items-start gap-2">
                                                <div className="mt-0.5"><Database className="h-3 w-3 text-red-400" /></div>
                                                <span className="text-xs text-white/90">Region: <span className="text-xs text-red-300">{breachResult.region}</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10" variant="outline">
                                    <Plus className="h-4 w-4 mr-2" /> Add Data to Investigation File
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
