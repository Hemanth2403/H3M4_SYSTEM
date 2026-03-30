import { useState } from "react";
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
    Network,
    Send
} from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { ThreatChart } from "@/components/threat-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Submission, SecurityEvent } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { SiemLogAnalyzer } from "@/components/siem-log-analyzer";

export default function AdminDashboard() {
    const { data: submissions = [] } = useQuery<Submission[]>({
        queryKey: ["/api/submissions"],
        staleTime: 0,
    });

    // Fetch real security events for alerts
    const { data: securityEvents = [] } = useQuery<SecurityEvent[]>({
        queryKey: ["/api/cdoc/events"],
        refetchInterval: 3000, // Real-time updates every 3 seconds
    });

    const [isAdvisoryOpen, setIsAdvisoryOpen] = useState(false);
    const [isAlertsOpen, setIsAlertsOpen] = useState(false);
    const [advisoryForm, setAdvisoryForm] = useState({
        title: "",
        severity: "medium",
        target: "all",
        message: ""
    });

    // Transform security events into alert format
    const liveAlerts = securityEvents
        .filter(event => event.severity !== "INFO") // Only show significant alerts
        .slice(0, 10) // Latest 10 alerts
        .map(event => ({
            id: event.id,
            title: event.description,
            severity: event.severity.toLowerCase(),
            target: event.type.includes("ATTACK") ? "Network Infrastructure" :
                event.type.includes("LOCKDOWN") ? "Global Systems" :
                    event.type.includes("PURGE") ? "Shard Network" :
                        "Security Perimeter",
            timestamp: new Date(event.timestamp).toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                month: 'short',
                day: 'numeric'
            }),
            status: event.type === "ATTACK" ? "active" :
                event.type === "LOCKDOWN" ? "mitigated" :
                    event.type === "PURGE" ? "resolved" : "monitoring"
        }));

    const handleSendAdvisory = () => {
        if (!advisoryForm.title || !advisoryForm.message) {
            toast.error("Please fill in all required fields");
            return;
        }

        toast.success("Advisory Sent Successfully", {
            description: `${advisoryForm.severity.toUpperCase()} advisory sent to ${advisoryForm.target}`
        });

        // Reset form
        setAdvisoryForm({
            title: "",
            severity: "medium",
            target: "all",
            message: ""
        });
        setIsAdvisoryOpen(false);
    };

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
                    <div className="p-4 rounded-xl border border-destructive/20 bg-gradient-to-br from-destructive/5 to-card/40 hover:border-destructive/40 transition-all">
                        <div className="flex items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2">
                                <BellRing className="h-4 w-4 text-destructive" />
                                <span className="font-semibold text-sm">Early Warning Engine</span>
                            </div>
                            <div className="flex h-2 w-2 rounded-full bg-destructive animate-pulse" />
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-[10px] h-7 border-destructive/20 text-destructive hover:bg-destructive/10"
                                onClick={() => setIsAdvisoryOpen(true)}
                            >
                                <Send className="h-3 w-3 mr-1" /> SEND ADVISORY
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-[10px] h-7 hover:bg-white/5"
                                onClick={() => setIsAlertsOpen(true)}
                            >
                                VIEW ALERTS
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Real-Time Centralized Log Analyzer (SIEM) */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Database className="h-4 w-4" /> Real-Time Log Analysis Engine
                    </h3>
                    <Link href="/admin/logs">
                        <Button variant="link" size="sm" className="text-xs text-primary p-0">Access Forensic Evidence Store &rarr;</Button>
                    </Link>
                </div>
                <SiemLogAnalyzer />
            </div>

            {/* Send Advisory Dialog */}
            <Dialog open={isAdvisoryOpen} onOpenChange={setIsAdvisoryOpen}>
                <DialogContent className="max-w-2xl bg-black/95 border-destructive/20">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-wider flex items-center gap-2">
                            <BellRing className="h-5 w-5 text-destructive" />
                            Send Security Advisory
                        </DialogTitle>
                        <DialogDescription>
                            Issue a critical security advisory to monitored entities. This will trigger immediate notifications.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        <div>
                            <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider">Advisory Title *</Label>
                            <Input
                                id="title"
                                placeholder="e.g., Critical Zero-Day Vulnerability in Trading APIs"
                                value={advisoryForm.title}
                                onChange={(e) => setAdvisoryForm({ ...advisoryForm, title: e.target.value })}
                                className="mt-2"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="severity" className="text-xs font-bold uppercase tracking-wider">Severity Level</Label>
                                <Select value={advisoryForm.severity} onValueChange={(val) => setAdvisoryForm({ ...advisoryForm, severity: val })}>
                                    <SelectTrigger className="mt-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="critical">🔴 Critical</SelectItem>
                                        <SelectItem value="high">🟠 High</SelectItem>
                                        <SelectItem value="medium">🟡 Medium</SelectItem>
                                        <SelectItem value="low">🟢 Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="target" className="text-xs font-bold uppercase tracking-wider">Target Entity</Label>
                                <Select value={advisoryForm.target} onValueChange={(val) => setAdvisoryForm({ ...advisoryForm, target: val })}>
                                    <SelectTrigger className="mt-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Monitored Entities</SelectItem>
                                        <SelectItem value="jpm">JPMorgan Chase</SelectItem>
                                        <SelectItem value="gs">Goldman Sachs</SelectItem>
                                        <SelectItem value="ms">Morgan Stanley</SelectItem>
                                        <SelectItem value="blk">BlackRock</SelectItem>
                                        <SelectItem value="c">Citigroup</SelectItem>
                                        <SelectItem value="wfc">Wells Fargo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider">Advisory Message *</Label>
                            <Textarea
                                id="message"
                                placeholder="Detailed threat intelligence, indicators of compromise, and recommended actions..."
                                value={advisoryForm.message}
                                onChange={(e) => setAdvisoryForm({ ...advisoryForm, message: e.target.value })}
                                className="mt-2 min-h-[120px]"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={() => setIsAdvisoryOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={handleSendAdvisory}
                            >
                                <Send className="h-4 w-4 mr-2" />
                                Send Advisory
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* View Alerts Dialog */}
            <Dialog open={isAlertsOpen} onOpenChange={setIsAlertsOpen}>
                <DialogContent className="max-w-4xl bg-black/95 border-white/10 max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-wider flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            Active Security Alerts
                        </DialogTitle>
                        <DialogDescription>
                            Real-time threat alerts and security advisories from the Early Warning Engine
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto space-y-3 mt-4">
                        {liveAlerts.length > 0 ? liveAlerts.map((alert) => (
                            <div
                                key={alert.id}
                                className={`p-4 rounded-xl border transition-all hover:bg-white/5 ${alert.severity === 'critical' ? 'border-red-500/30 bg-red-500/5' :
                                    alert.severity === 'high' ? 'border-orange-500/30 bg-orange-500/5' :
                                        alert.severity === 'medium' ? 'border-yellow-500/30 bg-yellow-500/5' :
                                            'border-white/10 bg-card/40'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Badge className={`${alert.severity === 'critical' ? 'bg-red-500' :
                                                alert.severity === 'high' ? 'bg-orange-500' :
                                                    alert.severity === 'medium' ? 'bg-yellow-500' :
                                                        'bg-green-500'
                                                } text-xs font-black`}>
                                                {alert.severity.toUpperCase()}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground font-mono">{alert.timestamp}</span>
                                        </div>
                                        <h4 className="font-semibold mb-1">{alert.title}</h4>
                                        <p className="text-xs text-muted-foreground">Target: <span className="text-primary font-mono">{alert.target}</span></p>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] uppercase">
                                        {alert.status}
                                    </Badge>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-sm">No active security alerts at this time.</p>
                                <p className="text-xs mt-2">System monitoring is operational.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/10">
                        <Button onClick={() => setIsAlertsOpen(false)}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
