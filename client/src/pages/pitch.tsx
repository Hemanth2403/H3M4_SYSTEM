import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    ChevronRight,
    ChevronLeft,
    Zap,
    Scale,
    Database,
    Network,
    Globe,
    ShieldAlert,
    BarChart3,
    Monitor,
    Cpu,
    Briefcase,
    Milestone,
    Users,
    Building2,
    ArrowRight,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { SiemLogAnalyzer } from "@/components/siem-log-analyzer";
// Asset Imports
import loginImg from "@assets/pitch/login.png";
import submitImg from "@assets/pitch/submit.png";
import policeImg from "@assets/pitch/police.png";
import adminImg from "@assets/pitch/admin.png";
import enterpriseImg from "@assets/product_shots/enterprise_home.png";

type SlideType = "hero" | "problem" | "market" | "vision" | "product" | "innovation" | "business" | "roadmap" | "functional";

interface Slide {
    type: SlideType;
    title: string;
    subtitle?: string;
    description: string;
    detailedExplanation?: string;
    icon?: any;
    accent?: "primary" | "emerald" | "blue" | "orange";
    stats?: { label: string; value: string }[];
    items?: { label: string; value: string; targetSlide?: number; detail?: string }[];
    image?: string;
    role?: string;
    isEnd?: boolean;
}

export default function PitchPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [activeFlashcard, setActiveFlashcard] = useState<{title: string; content: string} | null>(null);
    const [, setLocation] = useLocation();

    const slides: Slide[] = [
        // Slide 1: Cover / Title
        {
            type: "hero",
            title: "H3M4 Platform",
            subtitle: "Pitch Deck",
            description: "A Collaborative Cybersecurity Framework for FinTech.",
            detailedExplanation: "Built for Sovereign Enterprise Defense.",
            icon: Shield,
            accent: "primary",
        },
        // Slide 2: Table of Contents
        {
            type: "innovation",
            title: "Table of Contents",
            description: "Sequential overview of the H3M4 predictive readiness platform mid-semester defense.",
            items: [
                { label: "01", value: "Abstract & Motivation", targetSlide: 2 },
                { label: "02", value: "Literature & Context", targetSlide: 3 },
                { label: "03", value: "Incident & Log Context", targetSlide: 4 },
                { label: "04", value: "Problem & Objectives", targetSlide: 6 },
                { label: "05", value: "Methodology & Approach", targetSlide: 8 },
                { label: "06", value: "Implementation & Demo", targetSlide: 9 }
            ],
            icon: Milestone,
            accent: "emerald"
        },
        // Slide 3: Abstract
        {
            type: "vision",
            title: "Abstract",
            description: "A secure, decentralized architecture connecting vulnerability intelligence from researchers to enterprise defenses and forensic logs.",
            detailedExplanation: "Current systems are disconnected. H3M4 transforms vulnerability reporting by translating threat details securely to actionable enterprise defense and forensic evidence for law enforcement. This project proposes a cryptographic ecosystem generating predictive alerts and ISO-compliant investigation records, harmonizing cyber risk management across disconnected sectors.",
            icon: Globe,
            accent: "blue"
        },
        // Slide 4: Literature Review
        {
            type: "roadmap",
            title: "Literature Review",
            description: "Key findings and limitations from primary research formulating the basis of H3M4.",
            detailedExplanation: "Summarized from our separate Literature Review artifact, tracking 5 major academic and industrial papers regarding CTI sharing and Forensics.",
            items: [
                { label: "Paper 1: CTI Sharing (2019)", value: "Finding: STIX/TAXII reduces mitigation time. Limitation: Lack of non-repudiable legal connection." },
                { label: "Paper 2: Digital Forensics In IR (2004)", value: "Finding: Traditional IR destroys evidence. Limitation: Logs need real-time ISO-standards hashing." },
                { label: "Paper 3: Bug Bounty Economics (2015)", value: "Finding: Crowdsourcing finds more 0-days. Limitation: Patches insulate sectors, leaving others blind." },
                { label: "Paper 4: Blockchain in Security (2020)", value: "Finding: Ledgers ensure audit trails. Limitation: Public chains expose payload data dangerously." },
                { label: "Paper 5: Cloud Forensics (2016)", value: "Finding: Proactive collection is required. Limitation: Hard to balance privacy with forensic collection." }
            ],
            icon: Briefcase,
            accent: "emerald"
        },
        // Slide 4.5: Log Analysis
        {
            type: "functional",
            title: "Live Log Analysis Architecture",
            description: "Real-time demonstration of centralized event detection and forensics.",
            detailedExplanation: "This is a functional SIEM component pulling active system metrics and security events from the ecosystem, rather than a static slide.",
            icon: Database,
            accent: "blue"
        },
        // Slide 5: Motivation
        {
            type: "problem",
            title: "Project Motivation",
            description: "Inspired by recent high-profile ransomware attacks and the lack of unified intelligence dissemination.",
            detailedExplanation: "Recent breaches in the financial sector and delayed zero-day vulnerability responses highlighted a major gap. While researchers found exploits, enterprises learned too late, and law enforcement lacked verified digital trails for prosecution. The real world 'Intelligence Silence' became the core motivation to build this unified pipeline.",
            stats: [
                { label: "News Focus", value: "Zero-Day Delays" },
                { label: "Missing Link", value: "Forensic Evidence" }
            ],
            icon: Zap,
            accent: "orange"
        },
        // Slide 6: Problem Statement
        {
            type: "problem",
            title: "Problem Statement",
            description: "How can we securely synchronize vulnerability intelligence across researchers, enterprises, and law enforcement without losing chain-of-custody?",
            detailedExplanation: "Current reporting mechanisms are severely siloed. Bug bounty platforms do not automatically generate enterprise firewall rules, and they certainly don't prepare non-repudiable ISO 27037 compliant forensic hashes for police. This functional limitation creates an 'Attribution Chasm' hindering swift institutional response and eventually justice.",
            stats: [
                { label: "Key Question", value: "End-to-End Trust" },
                { label: "Limitation", value: "Siloed Pipelines" }
            ],
            icon: ShieldAlert,
            accent: "primary"
        },
        // Slide 7: Objectives
        {
            type: "business",
            title: "Project Objectives",
            description: "Three major milestones this platform aims to achieve conceptually and technically.",
            items: [
                { 
                    label: "Objective 1", 
                    value: "Develop a secure Vault protocol for researchers to seamlessly shard and submit vulnerability data.",
                    detail: "This objective focuses on creating a zero-trust environment where researchers can report findings via the 'S-Pulse' interface. It involves asymmetric encryption to protect exploit payloads during transit and ensuring that researchers retain credit through a mathematically verifiable signature."
                },
                { 
                    label: "Objective 2", 
                    value: "Automate real-time defensive posture alerts for integrated, connected enterprises.",
                    detail: "By bridging the 'Intelligence Silence', this milestone guarantees that once an exploit is validated by the system governors, immediate IOCs (Indicators of Compromise) and firewall mitigation rules are dispatched sector-wide. Organizations are patched collectively rather than waiting in silos."
                },
                { 
                    label: "Objective 3", 
                    value: "Generate immutable, court-ready mathematical forensic logs for Law Enforcement.",
                    detail: "To resolve the 'Attribution Chasm', H3M4 employs the B2R (Byte-to-Record) engine. This automatically maps raw log semantics into standardized legal reporting parameters (ISO 27037). These logs are hashed permanently on an immutable ledger, ensuring 100% chain-of-custody integrity."
                }
            ],
            icon: BarChart3,
            accent: "emerald"
        },
        // Slide 8: Methodology & Approach
        {
            type: "flowchart" as any,
            title: "Methodology",
            description: "The 'Quad-Node Handshake' approach ensuring isolated environments interact comprehensively securely.",
            detailedExplanation: "Using a zero-trust cryptographic mechanism to pass 'S-Pulse' signals. We map each interaction mathematically, verifying the researcher's submission, alerting the enterprise node for patching, and subsequently hashing an immutable FIR signature for the CDOC and Police entities.",
            icon: Network,
            accent: "primary"
        },
        // Slide 9: Implementation Tools & Settings
        {
            type: "roadmap",
            title: "Implementation Details",
            description: "Tools, technologies, and the lab environment parameters simulating the H3M4 ecosystem.",
            detailedExplanation: "The lab environment uses Vite, React, Node.js and PostgreSQL to simulate an enterprise-scale decentralized application. The scenario tracked features a 'Zero-Day' injection, its propagation, parallel mitigation, and logging.",
            items: [
                { label: "Frontend Layout", value: "React + Tailwind + Vite (Simulating Multi-Tenant Dashboards)" },
                { label: "Backend Core", value: "Node/Express with Postgres (Drizzle ORM for schema and ledger tracking)" },
                { label: "Lab Environment Scenario", value: "Researcher Submission → Enterprise Sector Patch → LEO Hash Evidence" }
            ],
            icon: Cpu,
            accent: "primary"
        },
        // Slide 10: Implemented Screens (Entrance)
        {
            type: "product",
            title: "Implemented Scenario - Login",
            description: "Multi-role biometric & key-based authentication. Every user is mapped to a unique 'Sovereign ID'.",
            detailedExplanation: "Zero-Trust structure. Zero-Anonymity. We mathematically verify every participant's cryptographic signature before any action is permitted inside the Vault platform. This ensures absolute accountability.",
            image: loginImg,
            role: "Security Handshake",
            accent: "emerald"
        },
        // Slide 11: Implemented Screens (Researcher)
        {
            type: "product",
            title: "Implemented Scenario - Discovery",
            description: "Elite researchers identify signals and submit sharded zero-day exploit data via the S-Pulse interface.",
            detailedExplanation: "Researchers use the submission interface to log verified artifacts. Each submission is heavily protected while allowing real-time impact scoring calculation.",
            image: submitImg,
            role: "Role 1: Intelligence Discovery",
            accent: "primary"
        },
        // Slide 12: Implemented Screens (Enterprise)
        {
            type: "product",
            title: "Implemented Scenario - Defense",
            description: "Enterprises receive real-time 'Sector Alerts' enabling them to deploy defenses before the exploit spreads.",
            detailedExplanation: "When a signal is validated successfully, it is instantly pushed to the institutional subscription nodes for completely automated firewall and patch management.",
            image: enterpriseImg,
            role: "Role 2: Institutional Defense",
            accent: "blue"
        },
        // Slide 13: Implemented Screens (Law Enforcement)
        {
            type: "product",
            title: "Implemented Scenario - Enforcement",
            description: "Technical intelligence artifacts combined with incident parameters provide a court-ready case signature.",
            detailedExplanation: "The platform's engine maps raw technical code findings into judicial report standards seamlessly. Officers receive a verified evidence package hash.",
            image: policeImg,
            role: "Role 3: Law Enforcement",
            accent: "orange"
        },
        // Slide 14: Conclusion
        {
            type: "hero",
            title: "Thank You",
            subtitle: "Questions & Discussion",
            description: "H3M4 Platform presentation concluded.",
            detailedExplanation: "Transforming reactive cyber defense into proactive intelligence correlation.",
            icon: Shield,
            accent: "emerald",
            isEnd: true,
        }
    ];


    const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
    const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0));

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" || e.key === " ") nextSlide();
            if (e.key === "ArrowLeft") prevSlide();
            if (e.key === "Escape") setLocation("/");
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const slide = slides[currentSlide];

    return (
        <div className="fixed inset-0 z-[100] bg-black text-white font-sans overflow-hidden select-none w-screen h-screen">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

            {/* Static Branding (Enlarged) */}
            <div className="absolute top-[5vh] left-[5vw] right-[5vw] z-[110] flex justify-between items-center">
                <div className="flex items-center gap-5 group cursor-pointer" onClick={() => setLocation("/")}>
                    <Shield className="h-[5.2vh] w-[5.2vh] text-primary" />
                    <span className="font-heading font-bold tracking-[0.2em] text-[2.4vh]">H3M4 <span className="text-muted-foreground font-normal">VAULT</span></span>
                </div>
                <div className="flex items-center gap-10">
                    <Badge variant="outline" className="text-[1.8vh] uppercase font-mono border-white/20 text-muted-foreground/80 px-4 py-1">Pitch Deck V1.0</Badge>
                    <button className="text-[1.8vh] text-muted-foreground hover:text-white transition-all font-mono tracking-[0.1em]" onClick={() => setLocation("/")}>[ EXIT_VAULT ]</button>
                </div>
            </div>

            <div className="absolute bottom-[5vh] right-[5vw] z-[110] flex items-center gap-8">
                <div 
                    className="text-[1.7vh] font-mono text-muted-foreground/40 uppercase tracking-[0.5em] cursor-pointer hover:text-white transition-colors"
                    title="Return to Table of Contents"
                    onClick={() => setCurrentSlide(1)}
                >
                    SLIDE {currentSlide + 1} / {slides.length}
                </div>
                <div className="flex bg-white/[0.05] backdrop-blur-3xl border border-white/20 rounded-full p-2 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevSlide}
                        disabled={currentSlide === 0}
                        className="hover:bg-white/10 rounded-full h-[6.5vh] w-[6.5vh] disabled:opacity-5 transition-all"
                    >
                        <ChevronLeft className="h-[3.2vh] w-[3.2vh]" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextSlide}
                        disabled={currentSlide === slides.length - 1}
                        className="hover:bg-white/10 rounded-full h-[6.5vh] w-[6.5vh] disabled:opacity-5 transition-all"
                    >
                        <ChevronRight className="h-[3.2vh] w-[3.2vh]" />
                    </Button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1.01 }}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full flex items-center justify-center relative px-[9vw] pt-[11vh]"
                >
                    {/* Hero Layout (Cover & End) */}
                    {slide.type === "hero" && (
                        <div className="flex flex-col items-center text-center space-y-[4vh] max-w-[85vw]">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
                                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                                transition={{ duration: 1.2, type: "spring" }}
                                className={slide.accent === 'emerald' ? 'text-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.05)]' : 'text-primary shadow-[0_0_100px_rgba(38,217,98,0.05)]'}
                            >
                                {slide.icon && <slide.icon className="h-[20vh] w-[20vh] lg:h-[28vh] lg:w-[28vh]" />}
                            </motion.div>
                            <div className="space-y-[2vh]">
                                <h1 className="text-[8vh] lg:text-[12vh] font-heading font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                                    {slide.title}
                                </h1>
                                <h2 className={`text-[2vh] lg:text-[3vh] font-heading font-bold uppercase tracking-[0.8em] ${slide.accent === 'emerald' ? 'text-emerald-500/80' : 'text-primary/80'}`}>
                                    {slide.subtitle}
                                </h2>
                            </div>
                            <div className="space-y-[1.5vh] max-w-[55vw]">
                                <p className="text-[2vh] lg:text-[2.2vh] text-white leading-relaxed font-medium italic text-justify">
                                    {slide.description}
                                </p>
                                <p className="text-[1.6vh] text-muted-foreground/60 leading-relaxed font-light text-justify text-balance">
                                    {slide.detailedExplanation}
                                </p>
                            </div>
                            {slide.isEnd && (
                                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                                    <Button
                                        size="lg"
                                        className="h-[8vh] px-[6vw] bg-emerald-500 text-black font-black text-[2.5vh] hover:bg-emerald-400 rounded-2xl shadow-[0_0_70px_rgba(16,185,129,0.3)] transition-all"
                                        onClick={() => setLocation("/auth")}
                                    >
                                        INITIATE MISSION <ChevronRight className="ml-4 h-[3vh] w-[3vh]" />
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* REDESIGNED SPLIT LAYOUT (Problem, Market, Vision, Product, Flowchart, Functional) */}
                    {(slide.type === "problem" || slide.type === "market" || slide.type === "vision" || slide.type === "product" || (slide.type as any) === "flowchart" || slide.type === "functional") && (
                        <div className="grid grid-cols-5 gap-[6vw] items-center w-full">
                            {/* Left Text Col (2/5) */}
                            <div className="col-span-2 space-y-[4vh]">
                                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                    {slide.icon && (
                                        <div className={`p-4 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${slide.accent === 'orange' ? 'text-orange-500' :
                                            slide.accent === 'blue' ? 'text-blue-500' :
                                                slide.accent === 'emerald' ? 'text-emerald-500' : 'text-primary'
                                            }`}>
                                            <slide.icon className="h-8 w-8" />
                                        </div>
                                    )}
                                </motion.div>

                                <div className="space-y-[2vh]">
                                    <h2 className="text-[6vh] lg:text-[8vh] font-heading font-black tracking-tight leading-[0.95]">{slide.title}</h2>
                                    <p className="text-[1.8vh] lg:text-[2.2vh] text-white leading-relaxed font-medium italic text-justify">&ldquo;{slide.description}&rdquo;</p>
                                    <p className="text-[1.6vh] text-muted-foreground/70 leading-relaxed font-light text-justify text-balance">{slide.detailedExplanation}</p>
                                </div>

                                {slide.role && (
                                    <Badge variant="outline" className={`px-4 py-1 text-[1.2vh] uppercase font-mono border-white/10 ${slide.accent === 'emerald' ? 'text-emerald-500' : 'text-primary'}`}>
                                        {slide.role}
                                    </Badge>
                                )}
                            </div>

                            {/* Right Visual Col (3/5) */}
                            <div className="col-span-3">
                                <motion.div
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 1 }}
                                    className="w-full relative"
                                >
                                    {/* Handle Stats (Problem, Vision, Market) */}
                                    {slide.stats && (
                                        <div className="grid grid-cols-1 gap-[3vh]">
                                            {slide.stats.map((s, i) => (
                                                <div key={i} className="bg-white/[0.03] border border-white/10 rounded-[3vh] p-[4vh] group hover:bg-white/[0.06] transition-all relative overflow-hidden">
                                                    <div className={`absolute top-0 left-0 h-full w-[0.4vh] bg-${slide.accent === 'orange' ? 'orange' : slide.accent === 'blue' ? 'blue' : 'primary'}-500/30 group-hover:w-[0.8vh] transition-all`} />
                                                    <div className="text-[7vh] lg:text-[9vh] font-black font-mono text-white italic leading-none tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]">{s.value}</div>
                                                    <div className="text-[1.2vh] uppercase tracking-[0.4em] text-primary/60 font-bold mt-[1vh] flex items-center gap-3">
                                                        <div className="h-[1px] w-6 bg-primary/20" />
                                                        {s.label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Handle Product Image */}
                                    {slide.image && (
                                        <div className="relative group perspective-2000">
                                            <div className={`absolute -inset-[5vh] rounded-full blur-[100px] opacity-10 ${slide.accent === 'emerald' ? 'bg-emerald-500' : 'bg-primary'}`} />
                                            <div className="relative rounded-[3vh] border border-white/20 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] bg-black/40 backdrop-blur-3xl group-hover:scale-[1.02] transition-all duration-700">
                                                <img src={slide.image} alt={slide.title} className="w-full h-auto opacity-100" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Handle Flowchart */}
                                    {(slide.type as any) === "flowchart" && (
                                        <div className="grid grid-cols-2 gap-[2vh] w-full">
                                            {[
                                                { icon: Users, label: "Researcher", phase: "Discovery", color: "emerald", targetSlide: 11 },
                                                { icon: Shield, label: "Governor", phase: "Validation", color: "primary" },
                                                { icon: Building2, label: "Enterprise", phase: "Mitigation", color: "blue", targetSlide: 12 },
                                                { icon: Scale, label: "Police", phase: "Enforcement", color: "orange", targetSlide: 13 }
                                            ].map((node, i) => (
                                                <div 
                                                    key={i} 
                                                    onClick={() => node.targetSlide !== undefined && setCurrentSlide(node.targetSlide)}
                                                    className={`bg-white/[0.02] border border-white/10 rounded-[2.5vh] p-[3vh] flex flex-col items-center text-center group transition-all ${node.targetSlide !== undefined ? 'cursor-pointer hover:bg-white/[0.08] hover:scale-[1.05] shadow-lg' : 'hover:bg-white/[0.05]'}`}
                                                >
                                                    {node.icon && (
                                                        <div className={`h-[8vh] w-[8vh] rounded-[2vh] bg-${node.color}-500/10 flex items-center justify-center text-${node.color}-500 mb-[2vh] group-hover:scale-110 transition-transform`}>
                                                            <node.icon className="h-[4vh] w-[4vh]" />
                                                        </div>
                                                    )}
                                                    <h4 className="text-[2vh] font-bold mb-[0.5vh]">{node.label}</h4>
                                                    <span className={`text-[1vh] font-mono text-${node.color}-500/60 uppercase tracking-widest`}>Phase {i + 1}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Handle Functional Component */}
                                    {slide.type === "functional" && (
                                        <div className="w-[120%] -ml-[10%] drop-shadow-2xl">
                                             <SiemLogAnalyzer />
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    )}

                    {/* REDESIGNED GRID LAYOUT (Innovation, Business, Roadmap) */}
                    {(slide.type === "innovation" || slide.type === "business" || slide.type === "roadmap") && (
                        <div className="flex flex-col items-center text-center space-y-[4vh] w-full max-w-[80vw]">
                            {slide.icon && (
                                <div className={`h-[10vh] w-[10vh] rounded-[3vh] bg-white/5 border border-white/20 flex items-center justify-center ${slide.accent === 'emerald' ? 'text-emerald-500' : slide.accent === 'blue' ? 'text-blue-500' : 'text-primary'
                                    }`}>
                                    <slide.icon className="h-[5vh] w-[5vh]" />
                                </div>
                            )}
                            <div className="space-y-[1vh]">
                                <h2 className="text-[6vh] lg:text-[8vh] font-heading font-black tracking-tight leading-none mb-[1vh]">{slide.title}</h2>
                                <p className="text-[1.8vh] text-muted-foreground/80 max-w-[50vw] mx-auto italic font-light text-justify text-balance">&ldquo;{slide.description}&rdquo;</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2vw] w-full items-stretch">
                                {slide.items?.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 + (i * 0.1) }}
                                        onClick={() => {
                                            if (item.targetSlide !== undefined) setCurrentSlide(item.targetSlide);
                                            else if (item.detail) setActiveFlashcard({ title: item.label, content: item.detail });
                                        }}
                                        className={`relative p-[3vh] rounded-[3vh] bg-white/[0.01] border border-white/10 text-left group overflow-hidden transition-all flex flex-col ${item.targetSlide !== undefined || item.detail ? 'cursor-pointer hover:bg-white/[0.08] hover:scale-[1.02] shadow-lg' : 'hover:bg-white/[0.04]'}`}
                                    >
                                        <div className={`absolute top-0 left-0 w-full h-[0.4vh] opacity-0 group-hover:opacity-100 transition-opacity bg-${slide.accent === 'emerald' ? 'emerald' : slide.accent === 'blue' ? 'blue' : 'primary'}-500 ${item.targetSlide !== undefined || item.detail ? 'opacity-50' : ''}`} />
                                        <div className="text-[1.2vh] text-primary/40 uppercase tracking-[0.4em] mb-[2vh] font-bold">{item.label}</div>
                                        <div className="text-[1.8vh] lg:text-[2vh] font-bold text-white/90 leading-snug text-justify text-balance flex-grow">{item.value}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Flashcard Overlay */}
            <AnimatePresence>
                {activeFlashcard && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                        onClick={() => setActiveFlashcard(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-[50vw] bg-zinc-950 border border-emerald-500/30 rounded-[3vh] p-[5vh] shadow-[0_0_100px_rgba(16,185,129,0.15)] flex flex-col gap-[3vh]"
                        >
                            <button 
                                onClick={() => setActiveFlashcard(null)}
                                className="absolute top-[3vh] right-[3vh] text-white/50 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10 cursor-pointer"
                                title="Close"
                            >
                                <X className="h-[3vh] w-[3vh]" /> 
                            </button>
                            
                            <Badge variant="outline" className="w-fit text-[1.5vh] px-4 py-1 text-emerald-500 border-emerald-500/20">{activeFlashcard.title}</Badge>
                            <p className="text-[2vh] lg:text-[2.2vh] text-white/90 leading-relaxed text-justify text-balance">
                                {activeFlashcard.content}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Global Background Progress Rail */}
            <div className="absolute bottom-0 left-0 w-full h-[0.8vh] bg-white/[0.05] z-[120]">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                    className={`h-full transition-all duration-500 ${slide.accent === 'emerald' ? 'bg-emerald-500' :
                        slide.accent === 'orange' ? 'bg-orange-500' :
                            slide.accent === 'blue' ? 'bg-blue-500' : 'bg-primary'
                        }`}
                />
            </div>
        </div>
    );
}
