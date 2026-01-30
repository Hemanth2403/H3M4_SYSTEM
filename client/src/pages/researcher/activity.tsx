import { useQuery } from "@tanstack/react-query";
import { Submission } from "@shared/schema";
import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle2, XCircle, AlertCircle, MessageSquare, History, Shield, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { DisclosureModal } from "@/components/disclosure-modal";
import { useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResearchActivity() {
    const { user } = useAuth();
    const { data: submissions = [], isLoading } = useQuery<Submission[]>({
        queryKey: ["/api/submissions"],
    });

    // Filter to only show submissions by the current user
    const mySubmissions = submissions.filter(s => s.author === user?.name || s.userId === user?.id);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "verified":
                return <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/20">VERIFIED</Badge>;
            case "rejected":
                return <Badge variant="destructive" className="bg-destructive/20 text-destructive border-destructive/20">REJECTED</Badge>;
            default:
                return <Badge variant="outline" className="text-amber-500 border-amber-500/20 animate-pulse">PENDING REVIEW</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "verified":
                return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
            case "rejected":
                return <XCircle className="h-5 w-5 text-destructive" />;
            default:
                return <Clock className="h-5 w-5 text-amber-500" />;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.history.back()}
                        className="rounded-full hover:bg-white/5"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-heading font-bold mb-1 flex items-center gap-2">
                            <History className="h-8 w-8 text-primary" />
                            Research Activity Tracker
                        </h1>
                        <p className="text-muted-foreground">Monitor your submission governance, feedback, and validation status.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <Badge variant="outline" className="text-primary border-primary/30">
                            {mySubmissions.length} TOTAL SUBMISSIONS
                        </Badge>
                    </div>
                    <DisclosureModal />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-4">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-32 w-full rounded-xl bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : mySubmissions.length === 0 ? (
                        <Card className="bg-card/20 border-white/5 border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <AlertCircle className="h-12 w-12 mb-4 opacity-20" />
                                <p>No research submissions tracked yet.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        mySubmissions.map((sub) => (
                            <Card key={sub.id} className="bg-card/20 border-white/10 hover:border-primary/30 transition-all overflow-hidden">
                                <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono text-muted-foreground">#{sub.id.substring(0, 8)}</span>
                                            <Badge variant="outline" className="text-[9px] uppercase tracking-tighter border-primary/30 text-primary bg-primary/5">
                                                {sub.category}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-lg">{sub.title}</CardTitle>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {getStatusBadge(sub.status)}
                                        <span className="text-[10px] text-muted-foreground uppercase font-mono">
                                            {new Date(sub.submittedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 rounded-lg bg-black/20 border border-white/5">
                                        <div className="mt-1">{getStatusIcon(sub.status)}</div>
                                        <div className="flex-1 space-y-2">
                                            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                                <MessageSquare className="h-3.5 w-3.5" />
                                                Admin Feedback & Governance Decision
                                            </div>
                                            <div className="text-sm border-l-2 border-primary/30 pl-3 py-1 italic text-foreground/80">
                                                {sub.adminFeedback || (sub.status === "pending"
                                                    ? "Your submission is currently in the priority review queue. Check back soon for validation notes."
                                                    : "Governance decision finalized. No additional comments provided.")}
                                            </div>
                                        </div>
                                    </div>

                                    {sub.status === "verified" && (
                                        <div className="pt-2">
                                            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-emerald-500 mb-1">
                                                <span>Reputation Accrual</span>
                                                <span>+1,200 REP Verified</span>
                                            </div>
                                            <Progress value={100} className="h-1 bg-emerald-500/10 [&>div]:bg-emerald-500" />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                <div className="space-y-4">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Trust Score Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-3xl font-mono font-bold">985</div>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                                Your trust score increases as your research is verified by H3M4 governance.
                                Higher scores unlock <span className="text-primary font-bold italic">restricted test missions</span>.
                            </p>
                            <Progress value={78} className="h-1.5" />
                            <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                                <span>78% TO MASTER TIER</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/40 border-white/10 overflow-hidden">
                        <CardHeader className="pb-2 bg-white/5">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Zap className="h-4 w-4 text-yellow-500" /> Top Contributors
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {[
                                { name: "ghost_shell", rep: "14.2k", rank: 1 },
                                { name: "void_walker", rep: "12.8k", rank: 2 },
                                { name: "cipher_punk", rep: "11.5k", rank: 3 },
                                { name: user?.name, rep: "0.9k", rank: 45 }
                            ].map((hero, i) => (
                                <div key={i} className={`flex items-center justify-between p-3 border-b border-white/5 last:border-0 ${hero.name === user?.name ? "bg-primary/10" : ""}`}>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-mono text-muted-foreground w-4">#{hero.rank}</span>
                                        <span className="text-xs font-bold">{hero.name}</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-primary">{hero.rep}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-card/40 border-white/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                Governance Workflow
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { label: "Internal Pilot Review", status: "Active" },
                                { label: "Peer Consensus", status: "Coming Soon" },
                                { label: "Police Validation", status: "Optional" }
                            ].map((step, i) => (
                                <div key={i} className="flex items-center justify-between text-[10px]">
                                    <span className="text-white/60">{step.label}</span>
                                    <Badge variant="outline" className="text-[8px] h-4 py-0 border-white/10 uppercase">{step.status}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
