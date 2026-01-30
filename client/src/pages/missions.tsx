import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
    Target,
    Shield,
    Zap,
    Lock,
    FileText,
    Gavel,
    AlertTriangle,
    ChevronRight,
    Search,
    CheckCircle2,
    Clock,
    Navigation,
    Scale,
    Globe
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { toast } from "sonner";

const mockMissions = [
    {
        id: "GAIA-01",
        title: "Zero-Day Disclosure Initiative",
        sector: "Infrastructure",
        reward: "Elite Credits (2.5x)",
        difficulty: "Critical",
        forecast: "Priority focus on SVG parsing and OAuth 2.0 bypasses in core fintech modules.",
        surfaces: ["XML Svg Parsers", "OAuth 2.0 Identity", "B2B Gateways"],
        status: "Priority",
        deadline: "Active Submission",
        brief: {
            objective: "Identify and document zero-day vulnerabilities in SVG rendering engines and OAuth 2.0 flow logic across the global infrastructure.",
            targets: ["https://gateway-gaia.h3m4.io", "https://s3.gaia-internal.net"],
            roe: [
                "Full forensic logging must be enabled on the local node.",
                "Submissions must include a verifiable PoC in a sandboxed environment.",
                "All findings are under mandatory 90-day responsible disclosure period."
            ],
            intel: "Passive monitoring has detected unusual payload patterns targeting the GAIA-cluster's XML entity expansion handlers."
        }
    },
    {
        id: "MSN-402",
        title: "Payment API OAuth Integrity Mission",
        sector: "FinTech",
        reward: "1,200 Rep",
        difficulty: "High",
        forecast: "Increased OAuth misconfig signals in regional banking gateways.",
        surfaces: ["OAuth 2.0 Flows", "Session Handling", "Callback URLs"],
        status: "Priority",
        deadline: "3 days left",
        brief: {
            objective: "Identify logic flaws in the multi-tenant OAuth 2.0 implementation that could lead to account takeover or unauthorized scope escalation.",
            targets: ["https://api-gateway.fin-shard-01.h3m4.io/v2/oauth", "https://auth.bank-node-88.net"],
            roe: [
                "No automated brute forcing of authentication endpoints.",
                "Testing must reside within the provided /v2/ route exclusively.",
                "Capture of admin session tokens must be reported immediately without secondary exfiltration."
            ],
            intel: "Observed pattern in similar fintech nodes indicates a failure to validate 'redirect_uri' against a whitelist during the authorization code swap."
        }
    },
    {
        id: "MSN-405",
        title: "Healthcare PII Leakage Validation",
        sector: "Healthcare",
        reward: "850 Rep",
        difficulty: "Medium",
        forecast: "Trending misconfigured S3 buckets in telemedicine SaaS.",
        surfaces: ["AWS S3", "IAM Policies", "Direct Object References"],
        status: "Open",
        deadline: "1 week left",
        brief: {
            objective: "Locate and verify non-PII diagnostic data leakage in public-facing storage clusters due to overly permissive IAM policies.",
            targets: ["telemed-archive-static-*", "s3://h3m4-forensic-storage/healthcare-node-x1"],
            roe: [
                "Download restricted to test-signed mock data files only.",
                "Actual patient UUIDs must be masked in submissions.",
                "Zero-interaction persistence is the goal; do not attempt to write to buckets."
            ],
            intel: "Automated scanners detected a spike in 'Action: s3:ListBucket' permissions granted to 'Principal: *' in the Frankfurt cluster."
        }
    },
    {
        id: "MSN-398",
        title: "Retail Payment Fraud Pattern Analysis",
        sector: "Retail",
        reward: "600 Rep",
        difficulty: "Medium",
        forecast: "New OTP bypass patterns observed in passive surveillance.",
        surfaces: ["SMS Gateways", "Rate Limiting", "Logic Consistency"],
        status: "Open",
        deadline: "5 days left",
        brief: {
            objective: "Analyze and bypass 2FA/OTP flows using logical session manipulation or rate limiting failures in the checkout gateway.",
            targets: ["https://checkout.retail-network.io/otp/verify", "https://api.sms-relay.h3m4.io"],
            roe: [
                "Only use the provided @test-user.h3m4.io identity for all attempts.",
                "Rate limit testing should be capped at 50 requests/second to prevent node degradation.",
                "Intercepting production SMS traffic is strictly forbidden."
            ],
            intel: "Telemetry suggests that the server-side session variable for 'correct_otp' may not be invalidated upon multiple failed attempts."
        }
    }
];

export default function MissionEngine() {
    const [activeMissions, setActiveMissions] = useState(mockMissions);
    const [selectedMission, setSelectedMission] = useState<any>(null);
    const [isBriefOpen, setIsBriefOpen] = useState(false);
    const [, setLocation] = useLocation();

    // Auto-open brief if ID is in URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const missionId = params.get('id');
        if (missionId) {
            const mission = mockMissions.find(m => m.id === missionId);
            if (mission) {
                setSelectedMission(mission);
                setIsBriefOpen(true);
            }
        }
    }, []);

    const startMission = (id: string) => {
        toast.success(`Mission ${id} protocol initiated`, {
            description: "Legal guardrails applied. Activity recording started.",
        });

        // Redirect to submission page after a brief delay
        setTimeout(() => {
            setLocation("/submit");
        }, 1500);
    };

    const openBrief = (mission: any) => {
        setSelectedMission(mission);
        setIsBriefOpen(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold mb-1 flex items-center gap-2">
                        <Target className="h-8 w-8 text-primary" />
                        Intelligence-Guided Missions
                    </h1>
                    <p className="text-muted-foreground">Governed test protocols based on real-time risk forecasts.</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <Scale className="h-5 w-5 text-primary" />
                    <div className="text-[10px] font-mono leading-tight">
                        <div className="text-foreground font-bold">LEGAL ENFORCEMENT ACTIVE</div>
                        <div className="text-muted-foreground">Scope strictly restricted to test targets.</div>
                    </div>
                </div>
            </div>

            {/* Intelligence Forecast Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-panel p-6 rounded-xl border-primary/10 bg-card/40 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Navigation className="h-32 w-32" />
                    </div>
                    <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" /> Current Surface Intelligence
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                            <div className="text-xs font-bold text-muted-foreground uppercase mb-2">High Likelihood Surface</div>
                            <div className="text-sm font-semibold mb-1">OAuth 2.0 Logic Flaws</div>
                            <p className="text-[11px] text-muted-foreground">Predicted 35% increase in attempted exploits in FinTech sector based on passive signals.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                            <div className="text-xs font-bold text-muted-foreground uppercase mb-2">Passive Observation</div>
                            <div className="text-sm font-semibold mb-1">S3 Bucket Exposure</div>
                            <p className="text-[11px] text-muted-foreground">42 new unencrypted buckets found in Healthcare sector. Validation needed.</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-xl border border-white/10 bg-sidebar/50 backdrop-blur-md flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium">Reputation Progression</span>
                        <span className="text-xs font-mono text-primary">Elite Tier</span>
                    </div>
                    <Progress value={78} className="h-2 mb-2" />
                    <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                        <span>985 / 1250 REP</span>
                        <span>Next Rank: Master</span>
                    </div>
                </div>
            </div>

            {/* Available Missions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeMissions.map((mission) => (
                    <Card key={mission.id} className="bg-card/20 border-white/10 hover:border-primary/50 transition-all group relative overflow-hidden backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className="text-[9px] uppercase tracking-tighter border-primary/30 text-primary bg-primary/5">{mission.sector}</Badge>
                                <Badge className={mission.status === 'Priority' ? 'bg-destructive' : 'bg-primary'}>{mission.status}</Badge>
                            </div>
                            <CardTitle className="text-lg font-heading leading-tight group-hover:text-primary transition-colors">{mission.title}</CardTitle>
                            <CardDescription className="text-xs flex items-center gap-2 mt-1">
                                <Clock className="h-3 w-3" /> {mission.deadline}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                                <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Intelligence Signal</div>
                                <p className="text-[11px] leading-relaxed italic text-foreground/80">"{mission.forecast}"</p>
                            </div>
                            <div className="space-y-2">
                                <div className="text-[10px] font-bold text-muted-foreground uppercase">Target Surfaces</div>
                                <div className="flex flex-wrap gap-1">
                                    {mission.surfaces.map(s => (
                                        <span key={s} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-muted-foreground uppercase">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2 border-t border-white/5 flex justify-between items-center bg-white/5">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground">Reward Pool</span>
                                <span className="text-sm font-mono font-bold text-primary">{mission.reward}</span>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="border-white/10 text-xs" onClick={() => openBrief(mission)}>Briefing</Button>
                                <Button size="sm" className="gap-2 text-[10px] font-bold" onClick={() => startMission(mission.id)}>
                                    Accept Protocol <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Legal & Governance Footer */}
            <div className="p-4 rounded-xl border border-white/10 bg-black/20 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-2 rounded bg-destructive/10 text-destructive">
                        <Gavel className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-sm font-bold">Scope Enforcement Protocol</div>
                        <p className="text-xs text-muted-foreground">Testing production environments without explicit mission scope is strictly prohibited.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-destructive">Recording Session Data (Court-Safe)</span>
                </div>
            </div>

            {/* Mission Brief Modal */}
            <Dialog open={isBriefOpen} onOpenChange={setIsBriefOpen}>
                <DialogContent className="max-w-3xl bg-[#0a0f14] border-white/10 p-0 overflow-hidden shadow-[0_0_50px_rgba(38,217,98,0.15)]">
                    <div className="p-8 bg-black/40 border-b border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Target className="h-32 w-32" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-3">
                                <Badge className="bg-primary text-black font-extrabold text-[9px] uppercase tracking-widest">{selectedMission?.status} PROTOCOL</Badge>
                                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">REF_ID: {selectedMission?.id}</span>
                            </div>
                            <DialogTitle className="text-3xl font-heading font-bold text-white italic">
                                {selectedMission?.title}
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
                                Authorized Sector: <span className="text-primary">{selectedMission?.sector}</span> | Reward: <span className="text-primary">{selectedMission?.reward}</span>
                            </DialogDescription>
                        </div>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                    <Target className="h-3 w-3" /> Operational Objective
                                </h4>
                                <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                                    {selectedMission?.brief.objective}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                    <Globe className="h-3 w-3" /> Authorized Target Surface
                                </h4>
                                <div className="space-y-2">
                                    {selectedMission?.brief.targets.map((t: string) => (
                                        <div key={t} className="flex items-center gap-3 p-3 rounded-lg bg-black/60 border border-white/5 group hover:border-primary/30 transition-colors">
                                            <div className="h-2 w-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                            <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors">{t}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 rounded-xl bg-destructive/5 border border-destructive/20 space-y-4">
                                <h4 className="text-[10px] font-bold text-destructive uppercase tracking-widest flex items-center gap-2">
                                    <Scale className="h-3 w-3" /> Mandatory Rules of Engagement (ROE)
                                </h4>
                                <div className="space-y-3">
                                    {selectedMission?.brief.roe.map((rule: string, i: number) => (
                                        <div key={i} className="flex items-start gap-3 text-xs text-muted-foreground leading-relaxed">
                                            <div className="h-1 w-1 rounded-full bg-destructive mt-1.5 shrink-0" />
                                            <span>{rule}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-4">
                                <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">Predictive Intel</h4>
                                <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-2">
                                    <Zap className="h-4 w-4 text-orange-500" />
                                    <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                                        "{selectedMission?.brief.intel}"
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-black border border-white/10 space-y-4">
                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Metadata</h4>
                                <div className="space-y-2 text-[10px] font-mono">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Encryption:</span>
                                        <span className="text-foreground">AES-256-GCM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Difficulty:</span>
                                        <span className="text-orange-500">{selectedMission?.difficulty}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Sync State:</span>
                                        <span className="text-emerald-500">LIVE</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={() => {
                                    startMission(selectedMission.id);
                                    setIsBriefOpen(false);
                                }}
                                className="w-full bg-primary text-black font-bold text-xs h-10 shadow-[0_0_20px_rgba(38,217,98,0.2)]"
                            >
                                START PROTOCOL NOW
                            </Button>
                        </div>
                    </div>

                    <div className="p-4 bg-black/40 border-t border-white/5 text-center">
                        <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-mono">All actions within this protocol are recorded via Shard #882 for legal provenance.</p>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
