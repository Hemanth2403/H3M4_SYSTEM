import { useAuth } from "@/context/auth-context";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
    Shield,
    Activity,
    Zap,
    Database,
    ArrowRight,
    UserCircle,
    Clock,
    LayoutDashboard,
    Lock,
    Network,
    Search,
    History as HistoryIcon,
    Fingerprint,
    Scale,
    ShieldCheck,
    Building2,
    Gavel
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { toast } from "sonner";

interface ActionCardProps {
    title: string;
    desc: string;
    icon: any;
    href: string;
    btnText: string;
    variant?: "primary" | "secondary" | "default";
}

function ActionCard({ title, desc, icon: Icon, href, btnText, variant = "default" }: ActionCardProps) {
    return (
        <Card className="bg-card/30 border-white/5 hover:border-white/10 transition-all flex flex-col justify-between overflow-hidden group">
            <CardHeader className="pb-4">
                <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500",
                    variant === "primary" ? "bg-primary/10 text-primary" :
                        variant === "secondary" ? "bg-secondary/10 text-secondary" :
                            "bg-white/5 text-muted-foreground"
                )}>
                    <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold">{title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed">{desc}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <Link href={href}>
                    <Button variant="ghost" className="w-full justify-between text-[10px] font-bold font-mono tracking-widest text-muted-foreground hover:text-primary p-0 h-auto group-hover:translate-x-1 transition-transform">
                        {btnText.toUpperCase()} <ArrowRight className="h-3 w-3" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}

export default function SharedHome() {
    const { user } = useAuth();

    // Fetch ecosystem data for live stats
    const { data: submissions = [] } = useQuery<any[]>({
        queryKey: ["/api/submissions"],
    });
    const { data: cases = [] } = useQuery<any[]>({
        queryKey: ["/api/police/cases"],
    });

    const verifiedThreats = submissions.filter(s => s.status === "verified");
    const activeInvestigations = cases.filter(c => c.status !== "closed");

    if (!user) return null;

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-extrabold tracking-tight mb-2">
                        Welcome to <span className="text-primary italic">H3M4 Intelligence Commons</span>
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <Lock className="h-4 w-4" /> Secure Session Established: <span className="font-mono text-foreground font-bold">{user.name}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20 shadow-[0_0_20px_rgba(38,217,98,0.1)]">
                    <div className="text-right">
                        <div className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Clearance Level</div>
                        <div className="text-sm font-bold text-primary">{user.role?.toUpperCase()} ACCESS</div>
                    </div>
                    <Badge variant="outline" className="h-10 w-10 p-0 flex items-center justify-center rounded-xl border-primary/30">
                        <UserCircle className="h-6 w-6 text-primary" />
                    </Badge>
                </div>
            </div>

            {/* Global Intelligence Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Verified Threat Signals"
                    value={verifiedThreats.length.toString()}
                    icon={Shield}
                    trend={`${submissions.length - verifiedThreats.length} pending review`}
                    trendUp={true}
                    delay={0.1}
                />
                <StatCard
                    label="Active Investigations"
                    value={activeInvestigations.length.toString()}
                    icon={Gavel}
                    trend="Syncing with LEO nodes"
                    trendUp={true}
                    delay={0.2}
                />
                <StatCard
                    label="Ecosystem Nodes"
                    value="12"
                    icon={Network}
                    trend="Consensus: Healthy"
                    trendUp={true}
                    delay={0.3}
                />
                <StatCard
                    label="Ledger Confidence"
                    value="99.8%"
                    icon={Database}
                    trend="SHA-3 Immutable"
                    trendUp={true}
                    delay={0.4}
                />
            </div>



            {/* Role-Specific Action Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.role === "researcher" && (
                    <>
                        <ActionCard
                            title="Discover New Targets"
                            desc="Browse verified intelligence and identify new attack surfaces."
                            icon={Search}
                            href="/intel"
                            btnText="Explore Intel Feed"
                            variant="primary"
                        />
                        <ActionCard
                            title="Submit Intelligence"
                            desc="Reveal a new vulnerability and earn reputation points."
                            icon={Shield}
                            href="/submit"
                            btnText="New Disclosure"
                            variant="secondary"
                        />
                        <ActionCard
                            title="Track My Progress"
                            desc="Monitor your rewards, feedback, and clearance level."
                            icon={HistoryIcon}
                            href="/activity"
                            btnText="View Activity"
                        />
                    </>
                )}

                {user.role === "enterprise" && (
                    <>
                        <ActionCard
                            title="Monitor Sector Risk"
                            desc="Real-time view of threats targeting the FinTech ecosystem."
                            icon={Activity}
                            href="/intel"
                            btnText="View Threat Feed"
                            variant="primary"
                        />
                        <ActionCard
                            title="Strategic Collaboration"
                            desc="Execute secure handshakes with top-tier researchers."
                            icon={Network}
                            href="/technical-case"
                            btnText="Initiate Case Review"
                            variant="secondary"
                        />
                        <ActionCard
                            title="Security Posture"
                            desc="Analyze your organization's risk metrics and compliance."
                            icon={LayoutDashboard}
                            href="/dashboard"
                            btnText="System Dashboard"
                        />
                    </>
                )}

                {user.role === "admin" && (
                    <>
                        <ActionCard
                            title="Governance Review"
                            desc="Approve or reject pending intelligence submissions."
                            icon={Lock}
                            href="/admin/review"
                            btnText="Review Queue"
                            variant="primary"
                        />
                        <ActionCard
                            title="Evidence & Audit"
                            desc="Trace forensic logs and manage the H3M4 ledger."
                            icon={Database}
                            href="/admin/logs"
                            btnText="Audit Store"
                            variant="secondary"
                        />
                        <ActionCard
                            title="Ecosystem Growth"
                            desc="Manage researcher personas and enterprise partners."
                            icon={UserCircle}
                            href="/admin/researchers"
                            btnText="User Management"
                        />
                    </>
                )}

                {user.role === "police" && (
                    <>
                        <ActionCard
                            title="Investigation Control"
                            desc="Manage active FIRs, case files, and ecosystem evidence chains."
                            icon={LayoutDashboard}
                            href="/police"
                            btnText="Police Dashboard"
                            variant="primary"
                        />
                        <ActionCard
                            title="Strategic Analysis"
                            desc="Build court-ready cases with H3M4 ecosystem correlation."
                            icon={Scale}
                            href="/police/analysis"
                            btnText="Case Analysis"
                            variant="secondary"
                        />
                        <ActionCard
                            title="Forensic Evidence"
                            desc="Access the immutable ledger-verified digital artifact store."
                            icon={Database}
                            href="/police/evidence"
                            btnText="Evidence Vault"
                        />
                    </>
                )}
            </div>

            {/* Featured Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 overflow-hidden bg-primary/2 hover:border-primary/40 transition-all group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-4">
                            <Badge className="bg-primary/20 text-primary border-primary/30 uppercase text-[10px] tracking-widest">Priority Protocol</Badge>
                            <span className="text-xs font-mono text-muted-foreground">MISSION_ID: GAIA-01</span>
                        </div>
                        <CardTitle className="text-3xl font-heading font-bold mb-2">Zero-Day Disclosure Initiative</CardTitle>
                        <CardDescription className="text-lg leading-relaxed max-w-xl">
                            We are currently prioritizing high-impact research in SVG parsing and OAuth 2.0 bypasses. Elite credits are boosted by <span className="text-primary font-bold">2.5x</span> for all verified submissions in these categories.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="flex flex-wrap gap-4 mt-6">
                            <Link href="/missions?id=GAIA-01">
                                <Button size="lg" className="h-12 px-8 font-bold bg-primary text-black hover:shadow-[0_0_20px_rgba(var(--primary),0.4)]">
                                    <Zap className="mr-2 h-4 w-4" /> View Mission Brief
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/20 border-white/10 backdrop-blur-sm relative flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5" />
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" /> Unified Activity Ledger
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            ...submissions.slice(0, 3).map(s => ({ text: `New Research: ${s.title.substring(0, 25)}...`, time: "Verified", icon: Shield, color: "text-primary" })),
                            ...cases.slice(0, 2).map(c => ({ text: `New FIR: ${c.firNumber}`, time: "Active", icon: Gavel, color: "text-blue-400" }))
                        ].length > 0 ? (
                            [
                                ...submissions.slice(0, 3).map(s => ({ text: `New Research: ${s.title.substring(0, 25)}...`, time: "Verified", icon: Shield, color: "text-primary" })),
                                ...cases.slice(0, 2).map(c => ({ text: `New FIR: ${c.firNumber}`, time: "Active", icon: Gavel, color: "text-blue-400" }))
                            ].map((update, i) => (
                                <div key={i} className="flex justify-between items-center group cursor-default">
                                    <div className="flex items-center gap-2">
                                        <update.icon className={cn("h-3 w-3", update.color)} />
                                        <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[150px]">{update.text}</span>
                                    </div>
                                    <span className="text-[9px] font-mono text-muted-foreground/50">{update.time}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-[10px] text-muted-foreground italic">Syncing with H3M4 ledger nodes...</p>
                        )}
                    </CardContent>
                    <div className="p-6 pt-0">
                        <Link href="/ledger">
                            <Button variant="ghost" className="w-full justify-between text-[10px] font-bold font-mono tracking-widest text-muted-foreground hover:text-primary p-0 h-auto">
                                VIEW FULL AUDIT TRAIL <ArrowRight className="h-3 w-3" />
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* Trending Intelligence (CVE-Details Style) */}
                <Card className="bg-card/20 border-white/10 backdrop-blur-sm relative flex flex-col overflow-hidden lg:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" /> Trending Intel
                            </div>
                            <Badge variant="outline" className="text-[8px] border-primary/20 text-primary">LIVE_FEED</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4 pt-2">
                        {verifiedThreats.length > 0 ? verifiedThreats
                            .sort((a, b) => parseFloat(b.cvssScore || "0") - parseFloat(a.cvssScore || "0"))
                            .slice(0, 4)
                            .map((intel, idx) => (
                                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] font-mono font-bold text-primary">{intel.cveId || `H3M4-${new Date().getFullYear()}-${intel.id.substring(0, 4)}`}</span>
                                        <div className="flex items-center gap-1">
                                            <div className="text-[8px] text-muted-foreground uppercase">CVSS</div>
                                            <span className={cn("text-[10px] font-black",
                                                parseFloat(intel.cvssScore || "0") >= 9 ? "text-destructive" :
                                                    parseFloat(intel.cvssScore || "0") >= 7 ? "text-orange-500" :
                                                        parseFloat(intel.cvssScore || "0") >= 4 ? "text-yellow-500" : "text-emerald-500"
                                            )}>{intel.cvssScore || "N/A"}</span>
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold truncate group-hover:text-primary transition-colors">{intel.title}</div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 flex-1">
                                            <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{ width: `${parseFloat(intel.epssScore || "0") * 100}%` }} />
                                            </div>
                                            <span className="text-[9px] font-mono text-muted-foreground">{intel.epssScore || "0.00"}</span>
                                        </div>
                                        <div className="text-[8px] text-muted-foreground uppercase font-bold ml-4">EPSS</div>
                                    </div>
                                </div>
                            )) : (
                            <div className="text-center py-6">
                                <p className="text-[10px] text-muted-foreground">No trending intelligence reported yet.</p>
                            </div>
                        )
                        }
                    </CardContent>
                    <div className="p-4 pt-0">
                        <Link href="/registry">
                            <Button variant="ghost" className="w-full justify-between text-[10px] font-bold font-mono tracking-widest text-muted-foreground hover:text-primary p-0 h-auto">
                                VIEW GLOBAL REGISTRY <ArrowRight className="h-3 w-3" />
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>


            {/* Shared Mission Info */}
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-center">
                <h3 className="text-sm font-bold font-mono tracking-[0.3em] text-muted-foreground uppercase mb-4">H3M4 Platform Intelligence Mission</h3>
                <p className="max-w-3xl mx-auto text-muted-foreground text-sm italic leading-loose">
                    "H3M4 is a governed cybersecurity intelligence platform that transforms trusted research into early-warning signals, compliance insights, and continuous readiness for enterprises and law enforcement."
                </p>
            </div>
        </div>
    );
}
