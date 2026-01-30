import { useState } from "react";
import {
    Users,
    ShieldCheck,
    MapPin,
    TrendingUp,
    Ban,
    History,
    AlertTriangle,
    MoreVertical,
    Verified
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
import { toast } from "sonner";

const mockResearchers = [
    { id: "R-101", name: "Cipher_Ghost", handle: "@ghost_shell", region: "India", domain: "Cloud Security", score: 94, earnings: "$12,400", submissions: 48, status: "Verified" },
    { id: "R-102", name: "Neo_Matrix", handle: "@neo_v", region: "Singapore", domain: "API Security", score: 88, earnings: "$8,200", submissions: 32, status: "Verified" },
    { id: "R-103", name: "Acid_Burn", handle: "@burn_acid", region: "USA", domain: "Web App", score: 91, earnings: "$15,600", submissions: 64, status: "Verified" },
    { id: "R-202", name: "Shadow_Walker", handle: "@walker", region: "Unknown", domain: "Identity", score: 42, earnings: "$400", submissions: 12, status: "Flagged" },
    { id: "R-105", name: "Zero_Cool", handle: "@zero", region: "Germany", domain: "Infrastructure", score: 96, earnings: "$22,000", submissions: 89, status: "Verified" },
];

export default function ResearcherManagement() {
    const [researchers, setResearchers] = useState(mockResearchers);

    const toggleBan = (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "Banned" ? "Verified" : "Banned";
        setResearchers(researchers.map(r => r.id === id ? { ...r, status: newStatus } : r));
        toast.message(`Researcher ${id} status updated to ${newStatus}`);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div>
                <h1 className="text-3xl font-heading font-bold mb-1">Researcher Operations</h1>
                <p className="text-muted-foreground">Governing global intelligence contributors and protecting platform integrity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Verified Contributors" value="452" icon={Verified} trend="+12 this week" trendUp={true} delay={0} />
                <StatCard label="Avg. Trust Score" value="82/100" icon={ShieldCheck} trend="+1.2% improvement" trendUp={true} delay={0.1} />
                <StatCard label="Active Suspensions" value="4" icon={AlertTriangle} trend="High manipulation attempt" trendUp={false} delay={0.2} />
            </div>

            <div className="rounded-xl border border-white/10 overflow-hidden bg-card/20 backdrop-blur-sm">
                <Table>
                    <TableHeader className="bg-white/5">
                        <TableRow className="hover:bg-transparent border-white/10">
                            <TableHead className="font-semibold">Researcher</TableHead>
                            <TableHead>Region & Domain</TableHead>
                            <TableHead>Submissions</TableHead>
                            <TableHead>Credibility</TableHead>
                            <TableHead>Total Earnings</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {researchers.map((res) => (
                            <TableRow key={res.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                            {res.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm">{res.name}</div>
                                            <div className="text-xs text-muted-foreground">{res.handle}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1 text-xs text-foreground/80">
                                            <MapPin className="h-3 w-3" /> {res.region}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground uppercase">{res.domain}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-sm">{res.submissions}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1 bg-white/10 rounded-full">
                                            <div
                                                className={`h-full rounded-full ${res.score > 80 ? 'bg-primary' : res.score > 50 ? 'bg-yellow-500' : 'bg-destructive'}`}
                                                style={{ width: `${res.score}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-mono">{res.score}%</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-sm text-primary">{res.earnings}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`text-[10px] ${res.status === 'Verified' ? 'text-primary border-primary/30 bg-primary/10' :
                                            res.status === 'Flagged' ? 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10' :
                                                'text-destructive border-destructive/30 bg-destructive/10'
                                        }`}>
                                        {res.status.toUpperCase()}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2 pr-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <History className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`h-8 w-8 hover:bg-destructive/10 ${res.status === 'Banned' ? 'text-primary' : 'text-destructive'}`}
                                            onClick={() => toggleBan(res.id, res.status)}
                                        >
                                            <Ban className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
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
