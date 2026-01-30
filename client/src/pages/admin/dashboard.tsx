import {
    Shield,
    Users,
    Building2,
    Database,
    Activity,
    AlertTriangle,
    History,
    Scale,
    BellRing,
    TrendingUp,
    LifeBuoy,
    FileSearch,
    CheckCircle2,
    XCircle,
    Clock,
    ArrowRight,
    Network
} from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { ThreatChart } from "@/components/threat-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Submission } from "@shared/schema";

export default function AdminDashboard() {
    const { data: submissions = [] } = useQuery<Submission[]>({
        queryKey: ["/api/submissions"],
        staleTime: 0,
    });

    const pendingCount = submissions.filter(s => s.status === "pending").length;
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold mb-1 flex items-center gap-2">
                        <Shield className="h-8 w-8 text-primary" />
                        Admin Master View
                    </h1>
                    <p className="text-muted-foreground outline-none">Global governance, intelligence operations, and platform trust.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className="bg-primary/20 text-primary border-primary/30 py-1.5 px-3">
                        <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        SYSTEM HEALTH: OPTIMAL
                    </Badge>
                    <Link href="/admin/graph">
                        <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-primary hover:bg-primary/5">
                            <Network className="h-4 w-4" /> Signal Graph
                        </Button>
                    </Link>
                    <Link href="/admin/logs">
                        <Button variant="outline" size="sm" className="gap-2">
                            <History className="h-4 w-4" /> Audit Logs
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Global Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Submissions"
                    value="1,248"
                    icon={FileSearch}
                    trend="+14% this month"
                    trendUp={true}
                    delay={0}
                />
                <StatCard
                    label="Verified Threats"
                    value="312"
                    icon={CheckCircle2}
                    trend="85% Accuracy"
                    trendUp={true}
                    delay={0.1}
                />
                <StatCard
                    label="Active Enterprises"
                    value="41"
                    icon={Building2}
                    trend="3 pending setup"
                    trendUp={true}
                    delay={0.2}
                />
                <StatCard
                    label="Ledger Trust Nodes"
                    value="12 / 12"
                    icon={Network}
                    trend="100% Consensus"
                    trendUp={true}
                    delay={0.3}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Threat Master Registry Summary */}
                <div className="lg:col-span-2 glass-panel rounded-xl p-6 border-primary/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Database className="h-32 w-32" />
                    </div>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-heading font-semibold">Intelligence Registry Pulse</h3>
                            <p className="text-xs text-muted-foreground">Active vs Passive threat distribution</p>
                        </div>
                        <Link href="/admin/registry">
                            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 gap-2">
                                Manage Registry <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-destructive" /> Active Threats
                                </span>
                                <span className="text-xl font-bold text-destructive">18</span>
                            </div>
                            <p className="text-xs text-muted-foreground">High-confidence attack signals currently exploited in the wild.</p>
                            <Progress value={28} className="h-1.5 [&>div]:bg-destructive" />
                            <div className="text-[10px] text-muted-foreground flex justify-between">
                                <span>Critical: 8</span>
                                <span>High: 10</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-orange-500" /> Passive Threats
                                </span>
                                <span className="text-xl font-bold text-orange-500">47</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Observed pre-exploitation indicators and trending misconfigurations.</p>
                            <Progress value={72} className="h-1.5 [&>div]:bg-orange-500" />
                            <div className="text-[10px] text-muted-foreground flex justify-between">
                                <span>Medium: 32</span>
                                <span>Emerging: 15</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Predictive Accuracy (Incident Correlation)</h4>
                        <div className="h-[200px]">
                            <ThreatChart />
                        </div>
                        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-between">
                            <span className="text-xs text-foreground/80">"6 incidents matched predicted threat signals last week"</span>
                            <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary uppercase">92% Precision</Badge>
                        </div>
                    </div>
                </div>

                {/* Modules Sidebar */}
                <div className="space-y-4">
                    <h3 className="text-lg font-heading font-semibold mb-2">Operations Center</h3>

                    {/* Submission Review Module */}
                    <Link href="/admin/review">
                        <div className="p-4 rounded-xl border border-white/10 bg-card/40 hover:bg-white/5 transition-all cursor-pointer group relative overflow-hidden">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                    <History className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-sm">Review Queue</span>
                                        {pendingCount > 0 && <Badge className="bg-blue-500 font-mono text-[10px]">{pendingCount} NEW</Badge>}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Manual expert validation queue</p>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 h-1 bg-blue-500 w-1/3 group-hover:w-full transition-all duration-500" />
                        </div>
                    </Link>

                    {/* Researcher Management */}
                    <Link href="/admin/researchers">
                        <div className="p-4 rounded-xl border border-white/10 bg-card/40 hover:bg-white/5 transition-all cursor-pointer group relative overflow-hidden">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-sm">Researcher Ops</span>
                                        <span className="text-[10px] font-mono text-primary">27 ACTIVE / 114 PASSIVE</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Reputation, trust & payouts</p>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 h-1 bg-primary w-1/3 group-hover:w-full transition-all duration-500" />
                        </div>
                    </Link>

                    {/* Enterprise Management */}
                    <Link href="/admin/enterprises">
                        <div className="p-4 rounded-xl border border-white/10 bg-card/40 hover:bg-white/5 transition-all cursor-pointer group relative overflow-hidden">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-sm">Enterprise B2B</span>
                                        <span className="text-xs font-mono text-muted-foreground">41 ACTIVE</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">SLA, subscriptions & usage</p>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 h-1 bg-orange-500 w-1/3 group-hover:w-full transition-all duration-500" />
                        </div>
                    </Link>

                    {/* Compliance & Regulatory Monitor */}
                    <Link href="/admin/compliance">
                        <div className="p-4 rounded-xl border border-border bg-gradient-to-br from-card/80 to-primary/5 hover:border-primary/50 transition-all cursor-pointer group overflow-hidden">
                            <div className="flex items-center gap-3 mb-3">
                                <Scale className="h-5 w-5 text-primary" />
                                <span className="font-semibold text-sm">Regulatory Compliance</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-muted-foreground">
                                    <span>DPDP Act / RBI</span>
                                    <span className="text-primary">5 Firms Exposed</span>
                                </div>
                                <Progress value={65} className="h-1" />
                                <p className="text-[10px] text-muted-foreground">Sectors at high compliance risk: FinTech, Health</p>
                            </div>
                        </div>
                    </Link>

                    {/* Early Warning Controller */}
                    <div className="p-4 rounded-xl border border-border bg-card/40 hover:bg-white/5 transition-all cursor-pointer">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <BellRing className="h-4 w-4 text-destructive" />
                                <span className="font-semibold text-sm">Early Warning Engine</span>
                            </div>
                            <div className="flex h-2 w-2 rounded-full bg-destructive animate-pulse" />
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            <Button size="sm" variant="outline" className="text-[10px] h-7 border-destructive/20 text-destructive hover:bg-destructive/5">SEND ADVISORY</Button>
                            <Button size="sm" variant="outline" className="text-[10px] h-7">VIEW ALERTS</Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Audit & Logs Preview */}
            <div className="glass-panel rounded-xl p-6 border-white/5 bg-black/20">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <History className="h-4 w-4" /> Evidence & Audit Store (Court-Safe)
                    </h3>
                    <Link href="/admin/logs">
                        <Button variant="link" size="sm" className="text-xs text-primary p-0">View full audit trail &rarr;</Button>
                    </Link>
                </div>
                <div className="space-y-3">
                    {[
                        { action: "Enterprise Export", user: "Acme Corp (Enterprise)", target: "Tactical Report #502", time: "2 min ago", icon: FileSearch },
                        { action: "Auth Bypass", user: "SYSTEM (Risk Alert)", target: "Manipulation detected (UserID: r_202)", time: "15 min ago", icon: AlertTriangle },
                        { action: "Advisory Published", user: "Admin (H3M4)", target: "RBI Compliance Patch 4.1", time: "1 hour ago", icon: LifeBuoy },
                        { action: "Registry Sync", user: "Police Access Node", target: "CID/NCB Direct Sync", time: "3 hours ago", icon: CheckCircle2 },
                    ].map((log, i) => (
                        <div key={i} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                            <div className="p-1.5 rounded bg-white/5">
                                <log.icon className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                            <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                                <span className="text-xs font-semibold">{log.action}</span>
                                <span className="text-xs text-muted-foreground">{log.user}</span>
                                <span className="text-xs text-muted-foreground truncate">{log.target}</span>
                                <span className="text-[10px] font-mono text-muted-foreground text-right">{log.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
