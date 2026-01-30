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

const mockRegistry = [
    { id: "REG-902", title: "AWS IAM Privilege Escalation", category: "Cloud Security", severity: "critical", confidence: "98%", impact: "PCI-DSS", visibility: "enterprise", status: "Active" },
    { id: "REG-901", title: "SaaS API Logic Flaw", category: "API Security", severity: "high", confidence: "85%", impact: "GDPR", visibility: "enterprise", status: "Active" },
    { id: "REG-899", title: "Auth Bypass in Fintech Gateway", category: "Web App", severity: "critical", confidence: "94%", impact: "RBI", visibility: "police-only", status: "Active" },
    { id: "REG-895", title: "Misconfigured S3 Bucket (Sensitive Logs)", category: "Cloud Security", severity: "medium", confidence: "72%", impact: "ISO 27001", visibility: "public", status: "Passive" },
    { id: "REG-892", title: "Stored XSS via SVG Upload", category: "Web App", severity: "medium", confidence: "80%", impact: "None", visibility: "public", status: "Passive" },
    { id: "REG-888", title: "Zero-day in Kubernetes Ingress", category: "Infrastructure", severity: "high", confidence: "91%", impact: "SOC2", visibility: "enterprise", status: "Active" },
];

export default function IntelligenceRegistry() {
    const { data: submissions = [] } = useQuery<Submission[]>({
        queryKey: ["/api/submissions"],
    });

    const verifiedSubmissions = submissions.filter(s => s.status === "verified").map(s => ({
        id: `REG-${s.id?.toString().substring(0, 3) || 'XXX'}`,
        title: s.title,
        category: s.category,
        severity: s.severity,
        confidence: "90%",
        impact: s.impactAnalysis?.substring(0, 10) || "Standard",
        visibility: "enterprise",
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

    const fullRegistry = [...verifiedSubmissions, ...mockRegistry];

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
                        Intelligence Master Registry
                        <Badge variant="outline" className="text-[10px] border-primary/30 text-primary bg-primary/5 animate-pulse">LIVE_SYNCING</Badge>
                    </h1>
                    <p className="text-muted-foreground">The authoritative registry for verified threat intelligence and compliance mapping.</p>
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
                    <Button variant="outline" size="sm" className="gap-2 text-xs">
                        <ShieldCheck className="h-3 w-3" /> Visibility
                        <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                </div>
            </div>

            {/* Registry Table */}
            <div className="rounded-xl border border-white/10 overflow-hidden bg-card/20 backdrop-blur-sm">
                <Table>
                    <TableHeader className="bg-white/5">
                        <TableRow className="hover:bg-transparent border-white/10">
                            <TableHead className="w-[100px] font-mono text-[10px] uppercase">ID</TableHead>
                            <TableHead className="font-semibold">Intelligence Title</TableHead>
                            <TableHead className="hidden md:table-cell">Category</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead className="hidden lg:table-cell">Confidence</TableHead>
                            <TableHead>Compliance</TableHead>
                            <TableHead className="hidden md:table-cell">Visibility</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRegistry.map((item) => (
                            <TableRow key={item.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                <TableCell className="font-mono text-xs text-muted-foreground">{item.id}</TableCell>
                                <TableCell>
                                    <div className="font-medium">{item.title}</div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{item.category}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`text-[10px] uppercase ${item.severity === 'critical' ? 'text-destructive border-destructive/30 bg-destructive/10' :
                                        item.severity === 'high' ? 'text-orange-500 border-orange-500/30 bg-orange-500/10' :
                                            'text-yellow-500 border-yellow-500/30 bg-yellow-500/10'
                                        }`}>
                                        {item.severity}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: item.confidence }} />
                                        </div>
                                        <span className="text-[10px] font-mono">{item.confidence}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-[10px] border-primary/20 text-primary/80">{item.impact}</Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <span className={`text-[10px] uppercase font-bold flex items-center gap-1.5 ${item.visibility === 'police-only' ? 'text-red-400' :
                                        item.visibility === 'enterprise' ? 'text-blue-400' :
                                            'text-green-400'
                                        }`}>
                                        <div className={`h-1 w-1 rounded-full ${item.visibility === 'police-only' ? 'bg-red-400' :
                                            item.visibility === 'enterprise' ? 'bg-blue-400' :
                                                'bg-green-400'
                                            }`} />
                                        {item.visibility}
                                    </span>
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
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Detail View Dialog */}
            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <DialogContent className="max-w-2xl bg-sidebar/95 backdrop-blur-xl border-white/10 p-0 overflow-hidden">
                    <div className="p-8 bg-primary/5 border-b border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary uppercase">{selectedItem?.id}</Badge>
                            <Badge className={selectedItem?.severity === 'critical' ? 'bg-destructive' : 'bg-primary'}>{selectedItem?.severity.toUpperCase()}</Badge>
                        </div>
                        <DialogTitle className="text-2xl font-heading font-bold">{selectedItem?.title}</DialogTitle>
                        <DialogDescription className="text-muted-foreground">Verification anchored on the H3M4 Global Ledger.</DialogDescription>
                    </div>
                    <div className="p-8 grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Category</h4>
                                <p className="text-sm font-medium">{selectedItem?.category}</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Compliance Mapping</h4>
                                <Badge variant="outline" className="border-primary/20 text-primary">{selectedItem?.impact}</Badge>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Visibility Layer</h4>
                                <p className="text-sm font-medium capitalize">{selectedItem?.visibility}</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Network Status</h4>
                                <span className="text-sm text-emerald-500 font-bold">VERIFIED_IMMUTABLE</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-black/40 border-t border-white/5 flex justify-end gap-3">
                        <Button variant="outline" size="sm" onClick={() => setSelectedItem(null)}>Close Registry</Button>
                        <Button size="sm" onClick={() => toast.success("Intelligence anchored to your session keys.")}>Clone to Workspace</Button>
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
