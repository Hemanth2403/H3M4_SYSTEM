import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Terminal, Activity, Lock, Globe, Video, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { toast } from 'sonner';

export function LiveSecurityConsole() {
    const [logs, setLogs] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await fetch('/api/submissions');
                const data = await response.json();

                const serverLogs = data.map((sub: any) =>
                    `> [INTEL] NEW_SUBMISSION: ${sub.title.toUpperCase()} BY ${sub.author.toUpperCase()}`
                );

                const baseLogs = [
                    "INITIALIZING_SECURE_HANDSHAKE_V2.5...",
                    "> CONNECTING TO RBI_COMPLIANCE_NODE...",
                    "> [SUCCESS] BANK_GRADE_ENCRYPTION_ESTABLISHED",
                    "> SCANNING_THREAD_VECTORS: 14,203 ACTIVE",
                    "> DETECTED: EXPLOIT_ATTEMPT_BLOCKED [IP: 192.168.X.X]",
                    "> VALIDATING_RESEARCHER_SIGNATURES...",
                    "> [VERIFIED] CIPHER_01 ADDED NEW INTEL",
                    "> UPDATING_GLOBAL_THREAT_GRAPH...",
                    "> SYNCING_WITH_ENTERPRISE_DASHBOARD...",
                    "> SYSTEM_READY. AWAITING_OPERATOR_COMMAND."
                ];

                const allLogs = [...baseLogs, ...serverLogs];

                let i = 0;
                const interval = setInterval(() => {
                    setLogs(prev => [...prev, allLogs[i % allLogs.length]].slice(-10));
                    i++;
                    if (scrollRef.current) {
                        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                    }
                }, 1500);

                return () => clearInterval(interval);
            } catch (error) {
                console.error("Failed to fetch submissions:", error);
            }
        };

        fetchSubmissions();
    }, []);

    return (
        <div className="relative w-full overflow-hidden bg-black border-y border-white/5 py-12 md:py-24">
            {/* Background Video Simulation (Grid Animation) */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="w-full h-full bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">

                {/* Left Side: B2B Pitch */}
                <div className="space-y-6 md:space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-[10px] md:text-xs font-bold text-primary border border-primary/20 animate-pulse">
                        <Activity className="h-3 w-3" /> Live System Status: ONLINE
                    </div>
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-bold tracking-tight leading-tight">
                        Secure Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Digital Sovereignity</span>
                    </h2>
                    <p className="text-sm md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                        Don't just react to breaches. Join the H3M4 ecosystem to predict, prevent, and govern threats with military-grade precision.
                        Trusted by leading FinTechs and Law Enforcement.
                    </p>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 pt-4">
                        <Link href="/auth" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto h-12 md:h-14 px-8 text-sm md:text-base font-bold bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(38,217,98,0.3)]">
                                <Terminal className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Initialize Console
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto h-12 md:h-14 px-8 text-sm md:text-base border-white/10 hover:bg-white/5"
                            onClick={() => {
                                toast.info("Demo Video Coming Soon!", {
                                    description: "We're preparing a comprehensive walkthrough. For now, explore the live platform by clicking 'Initialize Console'."
                                });
                            }}
                        >
                            <Video className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Watch Demo
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-6 md:pt-8 text-[10px] md:text-xs font-mono text-muted-foreground">
                        <div className="flex items-center gap-1.5 md:gap-2">
                            <ShieldCheck className="h-3.5 w-3.5 md:h-4 w-4 text-emerald-500" /> SOC2 COMPLIANT
                        </div>
                        <div className="flex items-center gap-1.5 md:gap-2">
                            <Globe className="h-3.5 w-3.5 md:h-4 w-4 text-blue-500" /> GLOBAL GRIDS
                        </div>
                        <div className="flex items-center gap-1.5 md:gap-2">
                            <UserCheck className="h-3.5 w-3.5 md:h-4 w-4 text-purple-500" /> VETTED ELITE
                        </div>
                    </div>
                </div>

                {/* Right Side: Live Terminal Simulation */}
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl group">
                    {/* Window Controls */}
                    <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50" />
                            <div className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                            <div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/50" />
                        </div>
                        <div className="text-[10px] uppercase font-mono text-muted-foreground tracking-widest">
                            h3m4_core_v2.5.exe
                        </div>
                    </div>

                    {/* Terminal Content */}
                    <div className="p-6 font-mono text-xs md:text-sm h-[300px] overflow-hidden flex flex-col justify-end relative">
                        <div className="absolute inset-0 bg-transparent z-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />

                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-2"
                            >
                                <span className="text-green-500">➜</span> <span className={log.includes("[SUCCESS]") || log.includes("[VERIFIED]") ? "text-primary" : "text-muted-foreground"}>{log}</span>
                            </motion.div>
                        ))}
                        <div className="mt-2 animate-pulse text-primary">_</div>
                    </div>

                    {/* Reflection Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>

            </div>
        </div>
    );
}
