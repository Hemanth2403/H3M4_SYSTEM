import { Link } from "wouter";
import {
    ShieldCheck,
    Orbit,
    Zap,
    Users,
    Building2,
    Scale,
    ChevronRight,
    CheckCircle2,
    Lock,
    Eye,
    ArrowRight,
    Shield,
    Activity,
    Database,
    Search,
    Check,
    Cpu,
    Globe,
    Fingerprint,
    XCircle,
    Mail,
    Phone,
    MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Import the generated showcase image
import showcaseImg from '@assets/generated_images/abstract_cyberpunk_security_background.png';
import { BannerCarousel } from "@/components/landing/banner-carousel";
import accessLoginImg from '@assets/product_shots/access_login.png';
import researcherImg from '@assets/product_shots/researcher_dashboard.png';
import enterpriseImg from '@assets/product_shots/enterprise_home.png';
import intelFeedImg from '@assets/product_shots/intel_feed.png';
import policeImg from '@assets/product_shots/police_governance.png';
import { LiveSecurityConsole } from "@/components/landing/live-console";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-black text-foreground selection:bg-primary/30 scroll-smooth">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between relative">
                    <Link href="/" className="flex items-center gap-2 md:gap-4 shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-gradient-to-tr from-primary to-secondary p-[1px]">
                            <div className="h-full w-full rounded-xl bg-black flex items-center justify-center">
                                <ShieldCheck className="h-5 w-5 md:h-7 md:w-7 text-primary" />
                            </div>
                        </div>
                        <span className="text-2xl md:text-3xl font-heading font-bold tracking-tight">H3M4</span>
                    </Link>

                    <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-10 text-base font-medium text-muted-foreground">
                        <a href="#vision" className="hover:text-primary hover:bg-white/5 px-5 py-2.5 rounded-full transition-all">Vision</a>
                        <a href="#product" className="hover:text-primary hover:bg-white/5 px-5 py-2.5 rounded-full transition-all">Product</a>
                        <Link href="/pitch" className="hover:text-primary hover:bg-white/5 px-5 py-2.5 rounded-full transition-all cursor-pointer">Presentation</Link>
                        <a href="#governance" className="hover:text-primary hover:bg-white/5 px-5 py-2.5 rounded-full transition-all">Trust</a>
                    </div>

                    <div className="flex items-center gap-2 md:gap-6">
                        <Link href="/auth">
                            <Button variant="ghost" className="hidden sm:inline-flex text-sm md:text-base font-medium">Log In</Button>
                        </Link>
                        <Link href="/auth">
                            <Button className="h-10 md:h-12 px-4 md:px-8 text-xs md:text-base font-bold bg-primary text-black hover:bg-primary/90 rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105">
                                Access Vault
                            </Button>
                        </Link>

                    </div>
                </div >
            </nav >

            {/* Hero Section */}
            < section className="relative pt-24 pb-20 lg:pt-28 lg:pb-32 overflow-hidden" >
                {/* Animated Background Gradients */}
                < div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] pointer-events-none opacity-20 z-0" >
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px]" />
                    <div className="absolute top-20 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px]" />
                </div >

                <div className="relative w-full max-w-[1600px] mx-auto px-4 md:px-8 z-10">
                    <div className="text-center">
                        <div className="text-center max-w-4xl mx-auto pb-6 md:pb-10 px-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs font-medium text-primary mb-6 md:mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
                                <Globe className="h-3 w-3" /> <span>Global Intelligence Layer</span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-heading font-bold tracking-tight mb-6 md:mb-8 leading-[1.2] md:leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-1000 px-2">
                                Predictive Cyber Readiness <br />
                                <span className="text-muted-foreground/60">For The Modern Enterprise</span>
                            </h1>
                            <p className="text-sm md:text-lg lg:text-xl text-muted-foreground/80 leading-relaxed mb-8 md:mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 px-4">
                                H3M4 transforms unified security research into active threat signals and compliance forecasts.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
                                <Link href="/auth" className="w-full sm:w-auto">
                                    <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-sm md:text-base font-bold bg-white text-black hover:bg-gray-200 rounded-full transition-all">
                                        Initialize Protocol <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="/technical-case" className="w-full sm:w-auto">
                                    <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-sm md:text-base font-medium border-white/10 hover:bg-white/5 rounded-full">
                                        View Documentation
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Banner Carousel moved below the heading as requested */}
                        <div className="relative w-full mb-16">
                            <BannerCarousel />
                        </div>
                    </div>
                </div>
            </section >

            {/* The Mindset - Multi-Stakeholder Alignment */}
            < section id="vision" className="py-32 relative border-y border-white/5 bg-white/[0.01]" >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24 text-glow">
                        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-4 italic">The H3M4 Alignment</h2>
                        <h3 className="text-4xl lg:text-7xl font-heading font-black tracking-tighter">Unified Intelligence Pipeline</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
                        {[
                            { role: "Researchers", action: "Knowledge Discovery", desc: "Identify systemic pattern-level weaknesses before they scale.", icon: Search },
                            { role: "Validators", action: "Signal Strengthening", desc: "Perform controlled proofing to verify exploitability & impact.", icon: ShieldCheck },
                            { role: "Governors", action: "Quality Curation", desc: "Review, score, and translate signals into business risk.", icon: Fingerprint },
                            { role: "Consignees", action: "Actionable Outputs", desc: "Execute mitigation and public safety protocols immediately.", icon: Cpu },
                        ].map((step, i) => (
                            <div key={i} className="relative z-10 glass-panel p-10 rounded-[48px] border-white/5 bg-card/40 hover:bg-primary/5 transition-all group overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                                    <step.icon className="h-32 w-32" />
                                </div>
                                <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-black transition-all">
                                    <step.icon className="h-8 w-8" />
                                </div>
                                <div className="text-3xl font-heading font-black mb-1 tracking-tighter">{step.role}</div>
                                <div className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-6 italic">{step.action}</div>
                                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Platform Capabilities Showcase */}
            < section id="product" className="py-24 relative bg-black/40" >
                <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
                    <h2 className="text-4xl lg:text-6xl font-heading font-bold mb-6 tracking-tight">Operate With <span className="text-primary italic">Precision</span></h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">A unified ecosystem where signals turn into sovereign defense.</p>
                </div>

                <div className="max-w-7xl mx-auto px-6 space-y-32">
                    {/* Feature 1: Access */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <Link href="/auth" className="order-2 lg:order-1 relative group perspective-1000 cursor-pointer">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-10 group-hover:opacity-40 transition duration-1000"></div>
                            <img src={accessLoginImg} alt="Secure Access" className="relative rounded-2xl shadow-2xl border border-white/10 transform rotate-y-2 transition-transform duration-500 group-hover:rotate-0" />
                        </Link>
                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-xs font-bold text-primary mb-6 uppercase tracking-widest border border-primary/20">
                                <Lock className="h-3 w-3" /> Secure Gateway
                            </div>
                            <h3 className="text-3xl md:text-5xl font-heading font-bold mb-6">Role-Based Governance</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Security starts at the door. Whether you are a Researcher verifying a flaw or an Admin governing the grid,
                                the H3M4 Vault establishes a secure, encrypted session tailored to your specific clearance level.
                            </p>
                        </div>
                    </div>

                    {/* Feature 2: Enterprise Home */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-xs font-bold text-secondary mb-6 uppercase tracking-widest border border-secondary/20">
                                <Activity className="h-3 w-3" /> Executive View
                            </div>
                            <h3 className="text-3xl md:text-5xl font-heading font-bold mb-6">Mission-Ready Dashboard</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Enterprises get a unified view of active threat signals. Monitor 18+ active risks across your sectors,
                                track real-time compliance status (RBI/GDPR), and see verified intelligence confidence scores at a glance.
                                This unified portal serves Enterprises, Law Enforcement, and System Governors simultaneously.
                            </p>
                        </div>
                        <Link href="/auth" className="order-2 relative group perspective-1000 cursor-pointer">
                            <div className="absolute -inset-1 bg-gradient-to-r from-secondary to-purple-500 rounded-2xl blur opacity-10 group-hover:opacity-40 transition duration-1000"></div>
                            <img src={enterpriseImg} alt="Enterprise Dashboard" className="relative rounded-2xl shadow-2xl border border-white/10 transform -rotate-y-2 transition-transform duration-500 group-hover:rotate-0" />
                        </Link>
                    </div>

                    {/* Feature 3: Intel Feed */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <Link href="/auth" className="order-2 lg:order-1 relative group perspective-1000 cursor-pointer">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-primary rounded-2xl blur opacity-10 group-hover:opacity-40 transition duration-1000"></div>
                            <img src={intelFeedImg} alt="Intel Feed" className="relative rounded-2xl shadow-2xl border border-white/10 transform rotate-y-2 transition-transform duration-500 group-hover:rotate-0" />
                        </Link>
                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-500 mb-6 uppercase tracking-widest border border-emerald-500/20">
                                <Database className="h-3 w-3" /> Live Intelligence
                            </div>
                            <h3 className="text-3xl md:text-5xl font-heading font-bold mb-6">Real-Time Threat Stream</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                A continuous feed of verified vulnerabilities. Filter by severity (Critical, High), infrastructure type (AWS, SaaS),
                                and generate instant audit reports for your compliance teams.
                            </p>
                        </div>
                    </div>

                    {/* Feature 4: Researcher */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-xs font-bold text-orange-500 mb-6 uppercase tracking-widest border border-orange-500/20">
                                <Users className="h-3 w-3" /> Elite Network
                            </div>
                            <h3 className="text-3xl md:text-5xl font-heading font-bold mb-6">Vetted Researcher Profiles</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Track reputation, impact scores, and earnings. Our gamified vetting process ensures only the top 5% of
                                researchers can contribute to the ecosystem, ensuring high-fidelity signal.
                            </p>
                        </div>
                        <Link href="/auth" className="order-2 relative group perspective-1000 cursor-pointer">
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur opacity-10 group-hover:opacity-40 transition duration-1000"></div>
                            <img src={researcherImg} alt="Researcher Profile" className="relative rounded-2xl shadow-2xl border border-white/10 transform -rotate-y-2 transition-transform duration-500 group-hover:rotate-0" />
                        </Link>
                    </div>

                    {/* Feature 5: Police Governance */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <Link href="/auth" className="order-2 lg:order-1 relative group perspective-1000 cursor-pointer">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-primary rounded-2xl blur opacity-10 group-hover:opacity-40 transition duration-1000"></div>
                            <img src={policeImg} alt="Police Portal" className="relative rounded-2xl shadow-2xl border border-white/10 transform rotate-y-2 transition-transform duration-500 group-hover:rotate-0" />
                        </Link>
                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-xs font-bold text-blue-500 mb-6 uppercase tracking-widest border border-blue-500/20">
                                <Scale className="h-3 w-3" /> Police Governance
                            </div>
                            <h3 className="text-3xl md:text-5xl font-heading font-bold mb-6">Tactical Investigation Portal</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Empowering cyber-crime units with high-fidelity intelligence. Connect digital artifacts directly to FIRs,
                                access researcher-backed forensic analysis, and generate court-ready evidence packages on an immutable ledger.
                            </p>
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1 border-l-2 border-blue-500/30 pl-4">
                                    <span className="text-white font-bold text-sm italic">Digital Evidence</span>
                                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">Chain of Custody</span>
                                </div>
                                <div className="flex flex-col gap-1 border-l-2 border-primary/30 pl-4">
                                    <span className="text-white font-bold text-sm italic">Court Signed</span>
                                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">Judicial Review Ready</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Differentiator Comparison */}
            < section id="ecosystem" className="py-32 relative bg-white/[0.02] border-y border-white/5" >
                <div className="max-w-7xl mx-auto px-6 text-center mb-24">
                    <h2 className="text-sm font-black text-primary uppercase tracking-[0.4em] mb-4">Strategic Positioning</h2>
                    <h3 className="text-5xl lg:text-8xl font-heading font-black tracking-tighter">Moving Beyond The Bounty</h3>
                </div>

                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="glass-panel p-16 rounded-[48px] border-white/5 bg-white/5 opacity-60">
                        <div className="text-2xl font-black mb-12 uppercase tracking-[0.3em] text-muted-foreground italic">Legacy Model</div>
                        <div className="space-y-8">
                            {["Random Bug Hunting", "Static PDF Reports", "One-Time Pentesting", "No Predictive Signal", "Post-Breach Reaction"].map(t => (
                                <div key={t} className="flex items-center gap-6 text-muted-foreground line-through decoration-destructive/40">
                                    <XCircle className="h-6 w-6 text-destructive/40" />
                                    <span className="text-2xl font-bold tracking-tight">{t}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel p-16 rounded-[48px] border-primary/30 bg-primary/5 shadow-[0_40px_100px_rgba(38,217,98,0.15)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
                            <ShieldCheck className="h-64 w-64" />
                        </div>
                        <div className="text-2xl font-black mb-12 uppercase tracking-[0.3em] text-primary italic">The H3M4 Way</div>
                        <div className="space-y-8 relative z-10">
                            {["Early-Warning Signals", "Continuous Readiness", "Integrated Threat Graph", "Police-Safe Governance", "Pre-Incident Intelligence"].map(t => (
                                <div key={t} className="flex items-center gap-6 text-white group cursor-default">
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary transition-all">
                                        <Check className="h-5 w-5 text-primary group-hover:text-black" />
                                    </div>
                                    <span className="text-2xl lg:text-3xl font-black italic tracking-tighter group-hover:text-primary transition-colors">{t}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section >

            {/* Business Model Section */}
            <section id="business-model" className="py-24 relative bg-black border-t border-white/5">
                <div className="absolute top-0 right-0 p-20 opacity-20 pointer-events-none">
                    <Building2 className="h-96 w-96 text-primary/10" />
                </div>

                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-sm font-black text-primary uppercase tracking-[0.4em] mb-4">Sovereign Economics</h2>
                        <h3 className="text-4xl lg:text-7xl font-heading font-black tracking-tighter">The Value of <span className="text-muted-foreground">Permanence</span></h3>
                        <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
                            A sustainable ecosystem where security is an asset, not an expense.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Stream 1: Enterprise */}
                        <div className="group relative p-8 rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary/10" />
                            <div className="mb-8">
                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                    <Activity className="h-6 w-6" />
                                </div>
                                <h4 className="text-2xl font-bold font-heading mb-2">Enterprise Sovereign</h4>
                                <p className="text-sm text-muted-foreground">For Banks & Critical Infrastructure</p>
                            </div>
                            <div className="space-y-4 mb-8">
                                <div className="text-4xl font-black tracking-tight text-white">$50k<span className="text-lg text-muted-foreground font-medium">/yr</span></div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Full access to real-time risk signals, automated compliance mapping (RBI/GDPR), and the collective defense network.
                                </p>
                            </div>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-primary" /> Sector Risk Alerts</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-primary" /> Automated Patching</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-primary" /> Compliance Dashboards</li>
                            </ul>
                        </div>

                        {/* Stream 2: Government */}
                        <div className="group relative p-8 rounded-3xl border border-blue-500/20 bg-blue-500/[0.02] hover:bg-blue-500/[0.04] transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 to-blue-500/10" />
                            <div className="mb-8">
                                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                                    <Scale className="h-6 w-6" />
                                </div>
                                <h4 className="text-2xl font-bold font-heading mb-2">Institutional Grid</h4>
                                <p className="text-sm text-muted-foreground">For Law Enforcement & Regulators</p>
                            </div>
                            <div className="space-y-4 mb-8">
                                <div className="text-4xl font-black tracking-tight text-white">Custom<span className="text-lg text-muted-foreground font-medium"> Licensing</span></div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Deploying the "Tactical Investigation Suite" for cyber-crime units to receive court-ready evidence packages.
                                </p>
                            </div>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Evidence Packaging</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Forensic Chain of Custody</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Judicial Reporting</li>
                            </ul>
                        </div>

                        {/* Stream 3: Researcher */}
                        <div className="group relative p-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.02] hover:bg-emerald-500/[0.04] transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/50 to-emerald-500/10" />
                            <div className="mb-8">
                                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <h4 className="text-2xl font-bold font-heading mb-2">Network Handshake</h4>
                                <p className="text-sm text-muted-foreground">Marketplace Transaction Fee</p>
                            </div>
                            <div className="space-y-4 mb-8">
                                <div className="text-4xl font-black tracking-tight text-white">10%<span className="text-lg text-muted-foreground font-medium"> Fee</span></div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    A sustainability fee on all bounties paid to researchers, funding the verification and governance nodes.
                                </p>
                            </div>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Verified Payouts</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Reputation Scoring</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Legal Safe Harbor</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust & Ethics Section */}
            < section id="governance" className="py-40 border-t border-white/5 relative overflow-hidden" >
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center relative z-10">
                    <div className="h-24 w-24 rounded-[32px] bg-primary/10 border border-primary/30 flex items-center justify-center mb-12 shadow-[0_0_40px_rgba(38,217,98,0.2)]">
                        <Lock className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-5xl lg:text-8xl font-heading font-black mb-12 italic tracking-tighter leading-none">Built for Trust <br />& Governance</h2>
                    <p className="text-2xl text-muted-foreground max-w-4xl mb-24 leading-relaxed font-medium">
                        H3M4 operates under strict legal guardrails. Every research session is logged, every validator is verified,
                        and every signal is mapped to RBI & SEBI compliance standards for institutional safety.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full text-center">
                        {[
                            { label: "Compliance Mapping", fact: "RBI, SEBI, GDPR READY" },
                            { label: "Evidentiary Integrity", fact: "COURT-APPROVED LOGS" },
                            { label: "Access Security", fact: "SECURE IDENTITY TOKENS" },
                            { label: "Mission Ethics", fact: "RESPONSIBLE DISCLOSURE" },
                        ].map((item, i) => (
                            <div key={i} className="p-10 rounded-[32px] border border-white/5 bg-white/[0.02] group hover:border-primary/50 transition-all hover:-translate-y-2">
                                <div className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-[0.4em] mb-4">{item.label}</div>
                                <div className="text-xl font-black italic tracking-tight">{item.fact}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >


            {/* Live Security Operations Console */}
            < LiveSecurityConsole />

            {/* Minimal Startup Footer */}
            < footer className="py-20 border-t border-white/5 bg-black" >
                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row justify-between items-start gap-16">
                    <div className="flex flex-col items-start gap-4">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-8 w-8 text-primary" />
                            <span className="text-3xl font-heading font-black tracking-tighter">H3M4</span>
                        </div>
                        <p className="text-muted-foreground text-xs font-mono font-bold uppercase tracking-widest leading-relaxed">Bridging Security Research & Sovereign Readiness.</p>
                        <div className="flex items-start gap-3 mt-4 text-muted-foreground">
                            <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <div className="text-xs font-mono tracking-widest uppercase leading-relaxed max-w-[250px]">
                                <span className="text-white">National Forensic Sciences University</span><br />
                                Sector 9, Gandhinagar<br />
                                Gujarat, India 382007
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-muted-foreground">
                            <Mail className="h-4 w-4 text-primary" />
                            <a href="mailto:hemanthnaik24032005@gmail.com" className="text-xs font-mono tracking-widest uppercase hover:text-primary transition-colors">hemanthnaik24032005@gmail.com</a>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-muted-foreground">
                            <Phone className="h-4 w-4 text-primary" />
                            <a href="tel:7993782420" className="text-xs font-mono tracking-widest uppercase hover:text-primary transition-colors">+91 7993782420</a>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-start gap-16 text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">
                        <div className="space-y-4">
                            <div className="text-white mb-6 tracking-[1em] opacity-40">Resources</div>
                            <Link href="/pitch" className="block hover:text-primary transition-colors text-primary font-bold">Mid-Sem Presentation</Link>
                            <a href="#" className="block hover:text-primary transition-colors">Vision Paper</a>
                            <a href="#" className="block hover:text-primary transition-colors">Ethical Code</a>
                            <a href="#" className="block hover:text-primary transition-colors">Sector Maps</a>
                        </div>
                        <div className="space-y-4">
                            <div className="text-white mb-6 tracking-[1em] opacity-40">Governance</div>
                            <a href="#" className="block hover:text-primary transition-colors">RBI Compliance</a>
                            <Link href="/auth" className="block hover:text-primary transition-colors">Police Governance</Link>
                            <a href="#" className="block hover:text-primary transition-colors">Audit Trails</a>
                        </div>
                        <div className="space-y-4">
                            <div className="text-white mb-6 tracking-[1em] opacity-40">Legal</div>
                            <a href="#" className="block hover:text-primary transition-colors">Privacy</a>
                            <a href="#" className="block hover:text-primary transition-colors">Disclosure</a>
                            <a href="#" className="block hover:text-primary transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-white/5 text-center lg:text-left text-[10px] font-mono font-bold text-muted-foreground opacity-30 tracking-[0.5em] uppercase">
                    © 2026 H3M4 INTELLIGENCE ECOSYSTEM. ALL SYSTEMS ENCRYPTED.
                </div>
            </footer >
        </div >
    );
}
