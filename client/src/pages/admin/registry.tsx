import { useState } from "react";
import {
    Search,
    Filter,
    ChevronDown,
    Download,
    ExternalLink,
    AlertCircle,
    ShieldCheck,
    Eye,
    MoreVertical,
    Plus,
    Clock,
    FileText,
    Layout,
    Settings,
    Shield,
    FileJson
} from "lucide-react";
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
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Submission } from "@shared/schema";
import { useAuth } from "@/context/auth-context";

const mockRegistry = [
    { id: "REG-902", title: "AWS IAM Privilege Escalation", category: "Cloud Security", severity: "critical", confidence: "98%", impact: "PCI-DSS", visibility: "enterprise", status: "Active" },
    { id: "REG-901", title: "SaaS API Logic Flaw", category: "API Security", severity: "high", confidence: "85%", impact: "GDPR", visibility: "enterprise", status: "Active" },
    { id: "REG-899", title: "Auth Bypass in Fintech Gateway", category: "Web App", severity: "critical", confidence: "94%", impact: "RBI", visibility: "police-only", status: "Active" },
    { id: "REG-895", title: "Misconfigured S3 Bucket (Sensitive Logs)", category: "Cloud Security", severity: "medium", confidence: "72%", impact: "ISO 27001", visibility: "public", status: "Passive" },
    { id: "REG-892", title: "Stored XSS via SVG Upload", category: "Web App", severity: "medium", confidence: "80%", impact: "None", visibility: "public", status: "Passive" },
    { id: "REG-888", title: "Zero-day in Kubernetes Ingress", category: "Infrastructure", severity: "high", confidence: "91%", impact: "SOC2", visibility: "enterprise", status: "Active" },
];

export default function IntelligenceRegistry() {
    const { user } = useAuth();
    const { data: submissions = [] } = useQuery<Submission[]>({
        queryKey: ["/api/submissions"],
    });

    const verifiedSubmissions = submissions.filter(s => s.status === "verified").map(s => ({
        id: s.cveId || `H3M4-${s.id?.toString().substring(0, 4)}`,
        title: s.title,
        category: s.category,
        severity: s.severity,
        cvss: s.cvssScore || "5.0",
        epss: s.epssScore || "0.01",
        exploitability: s.exploitability || "medium",
        complexity: s.complexity || "medium",
        impact: s.impactAnalysis?.substring(0, 10) || "Standard",
        visibility: "enterprise",
        description: s.description,
        status: "Active"
    }));

    const [searchTerm, setSearchTerm] = useState("");
    const [isExporting, setIsExporting] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);

    // Ecosystem Threat Summary State
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);
    const [reportType, setReportType] = useState<'executive' | 'technical'>('executive');
    const [timeRange, setTimeRange] = useState("Last 24 Hours");
    const [reportFormat, setReportFormat] = useState("JSON + PDF Format");
    const [isCompiling, setIsCompiling] = useState(false);

    const fullRegistry = [...verifiedSubmissions, ...mockRegistry.map(m => ({ ...m, cvss: "7.5", epss: "0.45", exploitability: "medium", complexity: "low", description: "Mocked registry entry for visualization." }))];

    const filteredRegistry = fullRegistry.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExport = () => {
        setIsSummaryOpen(true);
    };

    const runCompilation = () => {
        setIsCompiling(true);
        toast.info("Compiling Ecosystem Intelligence...", {
            description: `Aggregating ${reportType} data for ${timeRange}.`
        });

        setTimeout(() => {
            setIsCompiling(false);
            setIsSummaryOpen(false);
            toast.success("Security Report Ready", {
                description: `Ecosystem_Summary_${reportFormat.split(' ')[0]}.zip downloaded.`
            });
        }, 3000);
    };
    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold mb-1 flex items-center gap-3">
                        {user?.role === 'police' ? "Digital Forensic Registry" : "Intelligence Master Registry"}
                        <Badge variant="outline" className="text-[10px] border-primary/30 text-primary bg-primary/5 animate-pulse">
                            {user?.role === 'police' ? "COURT_CERTIFIED_SESSIONS" : "LIVE_SYNCING"}
                        </Badge>
                    </h1>
                    <p className="text-muted-foreground">
                        {user?.role === 'police'
                            ? "The authoritative registry for criminal forensic artifacts, technical proofs, and chain-of-custody reporting."
                            : "The authoritative registry for verified threat intelligence and compliance mapping."}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={handleExport}>
                        <Download className="h-4 w-4" /> Export DB
                    </Button>
                    <Button className="gap-2" onClick={() => setIsManualEntryOpen(true)}>
                        <Plus className="h-4 w-4" /> Manual Entry
                    </Button>
                </div>
            </div>

            {/* CVD-Style Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-panel p-4 rounded-xl border-primary/10">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total Vulnerabilities</div>
                    <div className="text-2xl font-bold font-heading">{fullRegistry.length}</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border-destructive/20">
                    <div className="text-[10px] font-bold text-destructive uppercase mb-1">Critical (CVSS 9.0+)</div>
                    <div className="text-2xl font-bold font-heading text-destructive">{fullRegistry.filter(i => parseFloat(i.cvss || "0") >= 9).length}</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border-emerald-500/20">
                    <div className="text-[10px] font-bold text-emerald-500 uppercase mb-1">Exploitation Probability</div>
                    <div className="text-2xl font-bold font-heading text-emerald-500">{(fullRegistry.reduce((acc, i) => acc + parseFloat(i.epss || "0"), 0) / fullRegistry.length * 100).toFixed(1)}%</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border-blue-500/20">
                    <div className="text-[10px] font-bold text-blue-500 uppercase mb-1">Active Mitigations</div>
                    <div className="text-2xl font-bold font-heading text-blue-500">88%</div>
                </div>
            </div>

            {/* Control Bar */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-card/40 border border-border backdrop-blur-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by ID, title, category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-background/50 border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2 text-xs">
                        <Filter className="h-3 w-3" /> Sector
                        <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 text-xs">
                        <AlertCircle className="h-3 w-3" /> Severity
                        <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                </div>
            </div>

            {/* Registry Table */}
            <div className="rounded-xl border border-white/10 overflow-hidden bg-card/20 backdrop-blur-sm">
                <Table>
                    <TableHeader className="bg-white/5">
                        <TableRow className="hover:bg-transparent border-white/10">
                            <TableHead className="w-[120px] font-mono text-[10px] uppercase">H3M4-ID</TableHead>
                            <TableHead className="font-semibold">Vulnerability Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>CVSS</TableHead>
                            <TableHead>EPSS</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRegistry.map((item) => (
                            <TableRow key={item.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                <TableCell className="font-mono text-xs text-primary font-bold">{item.id}</TableCell>
                                <TableCell>
                                    <div className="font-medium">{item.title}</div>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">{item.category}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`font-mono ${parseFloat(item.cvss) > 8 ? 'text-destructive border-destructive' : 'text-orange-500 border-orange-500'}`}>
                                        {item.cvss}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500" style={{ width: `${parseFloat(item.epss) * 100}%` }} />
                                        </div>
                                        <span className="text-[10px] font-mono opacity-50">{item.epss}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.status === 'Active' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'
                                        }`}>
                                        {item.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2 pr-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setSelectedItem(item)}
                                            className="h-8 w-8 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Detail View Dialog - CVEDetails Style */}
            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <DialogContent className="max-w-3xl bg-[#0a0f14] border-white/10 p-0 overflow-hidden shadow-2xl">
                    <div className="p-8 bg-gradient-to-br from-primary/10 to-transparent border-b border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Badge className="bg-primary/20 text-primary border-primary/30 font-mono text-lg px-3 py-1">{selectedItem?.id}</Badge>
                                <div className="h-8 w-[1px] bg-white/10" />
                                <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 font-mono">MITRE_MAPPED</Badge>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="text-[10px] text-muted-foreground uppercase font-bold">Base CVSS Score</div>
                                <div className={`text-4xl font-heading font-black ${parseFloat(selectedItem?.cvss || "0") > 9 ? 'text-destructive' : 'text-orange-500'}`}>
                                    {selectedItem?.cvss}
                                </div>
                            </div>
                        </div>
                        <DialogTitle className="text-3xl font-heading font-bold tracking-tight">{selectedItem?.title}</DialogTitle>
                    </div>

                    <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {/* Technical Breakdown Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Exploitability</h4>
                                <div className="text-lg font-bold uppercase text-primary">{selectedItem?.exploitability}</div>
                                <p className="text-[10px] text-muted-foreground mt-1">Ease of crafting proof-of-concept</p>
                            </div>
                            <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Attack Complexity</h4>
                                <div className="text-lg font-bold uppercase text-orange-500">{selectedItem?.complexity}</div>
                                <p className="text-[10px] text-muted-foreground mt-1">Technical prerequisites for access</p>
                            </div>
                            <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-2">EPSS Probability</h4>
                                <div className="text-lg font-bold uppercase text-emerald-500">{(parseFloat(selectedItem?.epss || "0") * 100).toFixed(2)}%</div>
                                <p className="text-[10px] text-muted-foreground mt-1">Likelihood of active exploitation</p>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold border-l-2 border-primary pl-3 uppercase tracking-widest">Description & Intelligence</h3>
                            <div className="bg-card/40 p-5 rounded-xl border border-white/5 leading-relaxed text-sm text-muted-foreground">
                                {selectedItem?.description || "No detailed intelligence provided for this record."}
                            </div>
                        </div>

                        {/* Compliance & Impact */}
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold border-l-2 border-blue-500 pl-3 uppercase tracking-widest">Compliance Impact</h3>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">PCI-DSS 4.1</Badge>
                                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">GDPR_ARTICLE_32</Badge>
                                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">SOC2_CC7.1</Badge>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold border-l-2 border-emerald-500 pl-3 uppercase tracking-widest">H3M4 Validator Log</h3>
                                <div className="font-mono text-[10px] text-emerald-500/70 p-4 bg-emerald-500/5 rounded-lg">
                                    [SYNC] ROOT_ANCHOR_VERIFIED<br />
                                    [SIGN] NODE_CONSENSUS: 12/12<br />
                                    [HASH] SHA256: 0x982e...e12a
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-black/60 border-t border-white/5 flex justify-between items-center px-8">
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                            <Clock className="h-3 w-3" /> LAST UPDATED: {new Date().toLocaleDateString()}
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" size="sm" onClick={() => setSelectedItem(null)}>Exit View</Button>
                            <Button size="sm" className="bg-primary text-black font-bold">
                                <Download className="h-3 w-3 mr-2" /> Download Forensic Report
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Manual Entry Dialog */}
            <Dialog open={isManualEntryOpen} onOpenChange={setIsManualEntryOpen}>
                <DialogContent className="max-w-xl bg-sidebar border-white/10">
                    <DialogHeader>
                        <DialogTitle>Manual Intelligence Entry</DialogTitle>
                        <DialogDescription>Add verified out-of-band intelligence to the global master registry.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Title</label>
                                <input className="w-full bg-black/40 border border-white/10 rounded-md p-2 text-sm" placeholder="Ex: Core Router Vulnerability" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Category</label>
                                <select className="w-full bg-black/40 border border-white/10 rounded-md p-2 text-sm">
                                    <option>Infrastructure</option>
                                    <option>API Security</option>
                                    <option>Web App</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-muted-foreground">Detailed Intelligence</label>
                            <textarea className="w-full bg-black/40 border border-white/10 rounded-md p-2 text-xs min-h-[100px]" placeholder="Paste forensic evidence or vulnerability description..." />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsManualEntryOpen(false)}>Cancel</Button>
                        <Button className="bg-primary text-black font-bold" onClick={() => {
                            toast.success("Intelligence Entry Propagating", {
                                description: "Awaiting quorum verification from validator nodes."
                            });
                            setIsManualEntryOpen(false);
                        }}>Anchor to Registry</Button>
                    </div>
                </DialogContent>
            </Dialog>
            {/* Ecosystem Threat Summary Dialog */}
            <Dialog open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
                <DialogContent className="max-w-md bg-[#0a0f14] border-white/10 p-8 overflow-hidden shadow-[0_0_50px_rgba(38,217,98,0.1)]">
                    <DialogHeader className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <FileText className="h-5 w-5 text-emerald-500" />
                            </div>
                            <DialogTitle className="text-xl font-heading font-bold">Ecosystem Threat Summary</DialogTitle>
                        </div>
                        <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
                            Generate a comprehensive security overview of verified threats and system status.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-8 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                onClick={() => setReportType('executive')}
                                className={`p-6 rounded-xl border transition-all cursor-pointer group ${reportType === 'executive' ? 'bg-emerald-500/5 border-emerald-500' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                            >
                                <div className={`p-2 rounded-md mb-4 inline-block ${reportType === 'executive' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-muted-foreground'}`}>
                                    <Shield className="h-4 w-4" />
                                </div>
                                <h3 className="text-sm font-bold mb-1">Executive</h3>
                                <p className="text-[10px] text-muted-foreground leading-tight">High-level summary for C-suite</p>
                            </div>

                            <div
                                onClick={() => setReportType('technical')}
                                className={`p-6 rounded-xl border transition-all cursor-pointer group ${reportType === 'technical' ? 'bg-emerald-500/5 border-emerald-500' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                            >
                                <div className={`p-2 rounded-md mb-4 inline-block ${reportType === 'technical' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-muted-foreground'}`}>
                                    <Settings className="h-4 w-4" />
                                </div>
                                <h3 className="text-sm font-bold mb-1">Technical</h3>
                                <p className="text-[10px] text-muted-foreground leading-tight">Deep dive into CVEs & IOCs</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Report Parameters</div>

                            <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">{timeRange}</span>
                                </div>
                                <select
                                    className="bg-transparent text-[10px] font-bold text-primary border-none cursor-pointer focus:ring-0 outline-none"
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                >
                                    <option className="bg-black">Last 24 Hours</option>
                                    <option className="bg-black">Last 7 Days</option>
                                    <option className="bg-black">Last 30 Days</option>
                                    <option className="bg-black">Custom Range</option>
                                </select>
                            </div>

                            <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <FileJson className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">{reportFormat}</span>
                                </div>
                                <select
                                    className="bg-transparent text-[10px] font-bold text-primary border-none cursor-pointer focus:ring-0 outline-none"
                                    value={reportFormat}
                                    onChange={(e) => setReportFormat(e.target.value)}
                                >
                                    <option className="bg-black">JSON + PDF Format</option>
                                    <option className="bg-black">CSV Spreadsheet</option>
                                    <option className="bg-black">Excel Report</option>
                                    <option className="bg-black">Raw Forensic JSON</option>
                                </select>
                            </div>
                        </div>

                        <Button
                            className="w-full h-12 bg-[#26d962] hover:bg-[#26d962]/90 text-black font-bold gap-2 text-sm shadow-[0_0_20px_rgba(38,217,98,0.2)]"
                            onClick={runCompilation}
                            disabled={isCompiling}
                        >
                            {isCompiling ? (
                                <>Compiling Data...</>
                            ) : (
                                <>
                                    <Download className="h-4 w-4" /> Compile & Export Report
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
