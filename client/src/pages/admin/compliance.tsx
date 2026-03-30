import {
    Scale,
    ShieldCheck,
    AlertTriangle,
    Building2,
    FileText,
    BarChart3,
    Search,
    Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { toast } from "sonner";

const frameworkStats = [
    { name: "DPDP Act (India)", coverage: 82, risks: 12, critical: 5 },
    { name: "RBI Cyber Framework", coverage: 74, risks: 8, critical: 3 },
    { name: "CERT-In Advisory", coverage: 95, risks: 4, critical: 1 },
    { name: "ISO 27001:2022", coverage: 65, risks: 24, critical: 8 },
    { name: "PCDM-DSS v4.0", coverage: 88, risks: 6, critical: 2 },
];

const riskMapping = [
    { ent: "Global Bank Corp", framework: "RBI / DPDP", threat: "Auth Bypass in Gateway", severity: "Critical", status: "Open" },
    { ent: "HealthSafe Inc", framework: "DPDP / HIPAA", threat: "Exposed PII in S3", severity: "High", status: "Remediating" },
    { ent: "GovSecure India", framework: "CERT-In / ISO", threat: "K8s Ingress Zero-day", severity: "Critical", status: "Verified" },
    { ent: "TechNova SaaS", framework: "ISO 27001", threat: "API Logic Flaw", severity: "Medium", status: "Open" },
];

export default function ComplianceMonitor() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold mb-1">Compliance Intelligence</h1>
                    <p className="text-muted-foreground">Mapping verified threat intel to regulatory frameworks (DPDP, RBI, CERT-In).</p>
                </div>
                <Button
                    className="gap-2 bg-primary text-primary-foreground"
                    onClick={() => {
                        toast.loading("Generating comprehensive audit pack...");
                        setTimeout(() => toast.success("Audit Pack generated (PDF/CSV)"), 2000);
                    }}
                >
                    <FileText className="h-4 w-4" /> Generate Audit Pack
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Framework Maps" value="12" icon={Scale} trend="98% Coverage" trendUp={true} delay={0} />
                <StatCard label="Cross-Border Risks" value="5" icon={AlertTriangle} trend="High legal impact" trendUp={false} delay={0.1} />
                <StatCard label="Compliant Entities" value="28" icon={ShieldCheck} trend="+4 this month" trendUp={true} delay={0.2} />
                <StatCard label="Regulator Reports" value="156" icon={BarChart3} trend="Last 30 days" trendUp={true} delay={0.3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Framework Status */}
                <div className="lg:col-span-2 glass-panel rounded-xl p-6 border-white/5 bg-card/20">
                    <h3 className="text-lg font-heading font-semibold mb-6">Framework Adoption & Risk Exposure</h3>
                    <div className="space-y-6">
                        {frameworkStats.map((fs, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{fs.name}</span>
                                        <Badge variant="outline" className="text-[10px] h-4 border-primary/20 text-primary/80">{fs.coverage}% MAPPED</Badge>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold">{fs.risks} TOTAL RISKS</span>
                                        <span className="text-[10px] text-destructive uppercase font-bold">{fs.critical} CRITICAL</span>
                                    </div>
                                </div>
                                <Progress value={fs.coverage} className="h-1.5" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legal Risk Alert */}
                <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 relative overflow-hidden">
                        <div className="flex items-center gap-2 text-destructive mb-2">
                            <AlertTriangle className="h-5 w-5" />
                            <h4 className="font-bold text-sm uppercase">Regulatory Redline</h4>
                        </div>
                        <p className="text-xs leading-relaxed text-destructive/80 mb-4">
                            5 FinTech firms are currently exposed to severe DPDP Act violations via verified "Auth Bypass" research.
                        </p>
                        <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 text-xs font-bold"
                            onClick={() => {
                                toast.error("Initiating High-Priority Regulatory Disclosure...");
                                setTimeout(() => toast.success("Report securely transmitted to CERT-In/RBI"), 2000);
                            }}
                        >
                            CONTACT REGULATOR
                        </Button>
                    </div>

                    <div className="p-4 rounded-xl border border-white/10 bg-card/40">
                        <div className="flex items-center gap-2 mb-4">
                            <Building2 className="h-4 w-4 text-primary" />
                            <h4 className="font-bold text-sm">Sectorial Risk Trend</h4>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: "FinTech", val: 82, color: "bg-destructive" },
                                { label: "SaaS", val: 45, color: "bg-orange-500" },
                                { label: "Healthcare", val: 68, color: "bg-primary" },
                            ].map((s, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-bold uppercase">
                                        <span>{s.label}</span>
                                        <span>{s.val}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full ${s.color}`} style={{ width: `${s.val}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Risk Mapping Table */}
            <div className="rounded-xl border border-white/10 overflow-hidden bg-card/20 backdrop-blur-sm">
                <Table>
                    <TableHeader className="bg-white/5">
                        <TableRow className="hover:bg-transparent border-white/10">
                            <TableHead>Enterprise Entity</TableHead>
                            <TableHead>Applicable Framework</TableHead>
                            <TableHead>Verified Threat Signal</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Remediation</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {riskMapping.map((rm, i) => (
                            <TableRow key={i} className="border-white/5 hover:bg-white/5 transition-colors">
                                <TableCell className="font-semibold text-sm">{rm.ent}</TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
                                        {rm.framework.split(' / ').map((f, j) => (
                                            <Badge key={j} variant="outline" className="text-[9px] h-4">{f}</Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">{rm.threat}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`text-[10px] ${rm.severity === 'Critical' ? 'text-destructive border-destructive/30 bg-destructive/10' : 'text-orange-500 border-orange-500/30 bg-orange-500/10'
                                        }`}>{rm.severity}</Badge>
                                </TableCell>
                                <TableCell>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${rm.status === 'Open' ? 'bg-destructive/10 text-destructive' :
                                        rm.status === 'Remediating' ? 'bg-orange-500/10 text-orange-500' :
                                            'bg-primary/10 text-primary'
                                        }`}>
                                        {rm.status.toUpperCase()}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
