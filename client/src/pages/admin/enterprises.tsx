import {
    Building2,
    ShieldCheck,
    Users,
    Activity,
    Database,
    MoreVertical,
    ExternalLink,
    Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const mockEnterprises = [
    { id: "ENT-1", name: "Global Bank Corp", sector: "FinTech", tier: "Unlimited", users: 145, threatsViewed: 890, reports: 124, readiness: 85 },
    { id: "ENT-2", name: "HealthSafe Inc", sector: "Healthcare", tier: "Priority", users: 42, threatsViewed: 312, reports: 45, readiness: 62 },
    { id: "ENT-3", name: "TechNova SaaS", sector: "SaaS", tier: "Growth", users: 12, threatsViewed: 85, reports: 12, readiness: 78 },
    { id: "ENT-4", name: "GovSecure India", sector: "GovTech", tier: "Sovereign", users: 850, threatsViewed: 2400, reports: 560, readiness: 94 },
    { id: "ENT-5", name: "RetailChain Ltd", sector: "Retail", tier: "Standard", users: 8, threatsViewed: 24, reports: 5, readiness: 45 },
];

export default function EnterpriseManagement() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div>
                <h1 className="text-3xl font-heading font-bold mb-1">Enterprise Management</h1>
                <p className="text-muted-foreground">Monitoring real-world B2B adoption, usage metrics, and compliance readiness.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Onboarded Enterprises" value="41" icon={Building2} trend="12% CAGR" trendUp={true} delay={0} />
                <StatCard label="Avg. Readiness Score" value="74%" icon={Zap} trend="+4% vs last Q" trendUp={true} delay={0.1} />
                <StatCard label="Total Active Seats" value="1,049" icon={Users} trend="Direct platform impact" trendUp={true} delay={0.2} />
            </div>

            <div className="rounded-xl border border-white/10 overflow-hidden bg-card/20 backdrop-blur-sm">
                <Table>
                    <TableHeader className="bg-white/5">
                        <TableRow className="hover:bg-transparent border-white/10">
                            <TableHead className="font-semibold">Enterprise Name</TableHead>
                            <TableHead>Sector & Tier</TableHead>
                            <TableHead>Access Stats</TableHead>
                            <TableHead>Readiness Trend</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockEnterprises.map((ent) => (
                            <TableRow key={ent.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded bg-orange-500/10 flex items-center justify-center text-orange-500 text-xs font-bold">
                                            {ent.name.substring(0, 1).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm">{ent.name}</div>
                                            <div className="text-[10px] text-muted-foreground font-mono">{ent.id}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <div className="text-xs font-medium">{ent.sector}</div>
                                        <Badge variant="outline" className="w-fit text-[9px] h-4 border-orange-500/30 text-orange-500 bg-orange-500/5">{ent.tier}</Badge>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="grid grid-cols-3 gap-4 text-[10px] uppercase font-mono text-muted-foreground">
                                        <div>
                                            <div className="text-foreground font-bold">{ent.users}</div>
                                            <div>Users</div>
                                        </div>
                                        <div>
                                            <div className="text-foreground font-bold">{ent.threatsViewed}</div>
                                            <div>Threats</div>
                                        </div>
                                        <div>
                                            <div className="text-foreground font-bold">{ent.reports}</div>
                                            <div>Reports</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="w-32 space-y-1.5">
                                        <div className="flex items-center justify-between text-[10px] font-mono">
                                            <span>{ent.readiness}%</span>
                                            <span className={ent.readiness > 70 ? 'text-primary' : 'text-yellow-500'}>
                                                {ent.readiness > 70 ? 'STABLE' : 'AT RISK'}
                                            </span>
                                        </div>
                                        <Progress value={ent.readiness} className={`h-1 ${ent.readiness > 70 ? '[&>div]:bg-primary' : '[&>div]:bg-yellow-500'}`} />
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2 pr-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                                            <Activity className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
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
        </div>
    );
}
