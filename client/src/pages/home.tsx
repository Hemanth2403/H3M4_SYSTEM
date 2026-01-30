import { useAuth } from "@/context/auth-context";
import { Link } from "wouter";
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
    Fingerprint
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
                    label="Active Threat Signals"
                    value="18"
                    icon={Activity}
                    trend="+3 since last sync"
                    trendUp={true}
                    delay={0.1}
                />
                <StatCard
                    label="Passive Risk Indicators"
                    value="47"
                    icon={Zap}
                    trend="+12 emerging"
                    trendUp={true}
                    delay={0.2}
                />
                <StatCard
                    label="Sectors Monitored"
                    value="6"
                    icon={Network}
                    trend="Optimal Coverage"
                    trendUp={true}
                    delay={0.3}
                />
                <StatCard
                    label="Intelligence Confidence"
                    value="HIGH"
                    icon={Database}
                    trend="Verified @ 92%"
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
            </div>

            {/* Featured Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 overflow-hidden bg-primary/2 hover:border-primary/40 transition-all group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
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
                            <Clock className="h-4 w-4 text-primary" /> System Broadcast
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { text: "B2R Protocol v2.5 finalized", time: "2h ago" },
                            { text: "New validator node online: FRA-01", time: "5h ago" },
                            { text: "Governance meeting: 14:00 UTC", time: "Today" }
                        ].map((update, i) => (
                            <div key={i} className="flex justify-between items-center group cursor-default">
                                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{update.text}</span>
                                <span className="text-[9px] font-mono text-muted-foreground/50">{update.time}</span>
                            </div>
                        ))}
                    </CardContent>
                    <div className="p-6 pt-0">
                        <Link href="/ledger">
                            <Button variant="ghost" className="w-full justify-between text-[10px] font-bold font-mono tracking-widest text-muted-foreground hover:text-primary p-0 h-auto">
                                VIEW GLOBAL LEDGER <ArrowRight className="h-3 w-3" />
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* Instant Verification Widget */}
                <Card className="bg-primary/5 border-primary/20 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Fingerprint className="h-16 w-16 text-primary" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                            <Shield className="h-3 w-3" /> Instant Ledger Check
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[9px] text-muted-foreground uppercase font-mono">Input Document/Intelligence Hash</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="0x7f83... (SHA-256)"
                                    className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-[10px] font-mono focus:border-primary/50 outline-none"
                                />
                                <Button size="sm" onClick={() => {
                                    toast.info("Verifying Hash Ancestry...", {
                                        description: "Tracing Merkle inclusion in Global Shard #882."
                                    });
                                    setTimeout(() => {
                                        toast.success("Integrity Confirmed", {
                                            description: "Hash matches validated intelligence anchored on 2026-01-30."
                                        });
                                    }, 2000);
                                }} className="bg-primary text-black font-bold h-7 px-3">VERIFY</Button>
                            </div>
                        </div>
                        <p className="text-[8px] text-muted-foreground leading-relaxed">
                            Verify the provenance of any document against our immutable record.
                        </p>
                    </CardContent>
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
