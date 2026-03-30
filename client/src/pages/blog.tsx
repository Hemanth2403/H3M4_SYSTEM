import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ShieldCheck, ArrowLeft, Calendar, User, Clock, ChevronRight, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogPage() {
    const [selectedPost, setSelectedPost] = useState<any>(null);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (selectedPost) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [selectedPost]);

    const blogPosts = [
        {
            id: 1,
            title: "Beyond Zero-Trust: The Need for Shared Intelligence",
            excerpt: "In an era where ransomware groups operate like multinational corporations, defending in isolation is a mathematical losing proposition.",
            content: "Zero-Trust architecture is no longer enough. The modern financial enterprise spends millions on SIEM solutions, perimeter defenses, and Zero-Trust orchestration. Yet, FinTech breaches continue to surge. The root cause isn't a lack of tools; it’s a lack of connection. When Hacker X attacks Bank A, Bank B remains oblivious until the exploit is publicized months later. \n\nEnterprises hesitate to share breach data due to immediate reputation damage and regulatory fines. Conversely, ethical hackers struggle to report critical infrastructure vulnerabilities because the legal pathways are murky. Federated security isn't just about sharing IOCs; it's about establishing cryptographic trust where competitors can collaborate anonymously to achieve herd immunity across the entire sector.",
            date: "Oct 24, 2026",
            author: "M Hemanth Naik",
            readTime: "7 min read",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800&h=500"
        },
        {
            id: 2,
            title: "Automating Digital Forensics: From SIEM to FIR",
            excerpt: "How the H3M4 neural pipeline translates raw IOCs into legally admissible reports for local police jurisdictions.",
            content: "Law enforcement faces a massive bottleneck in cybercrime investigation: translating technical logs into legal evidence. Traditional Incident Response (IR) teams often inadvertently destroy chain-of-custody while triaging a breach. By the time a Police Cyber Cell receives the data, it's inadmissible in court. \n\nH3M4 utilizes an automated B2R (Byte-to-Record) engine. When an enterprise node detects an anomaly, the raw logs are instantly cryptographically hashed against ISO 27037 standards. These hashes are published to an immutable ledger. Instead of raw IP addresses, the law enforcement dashboard receives a fully structured, court-ready First Information Report (FIR) complete with an unbreakable chain of custody.",
            date: "Sep 15, 2026",
            author: "Forensics Team",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800&h=500"
        },
        {
            id: 3,
            title: "The Gamification of Ethical Hacking",
            excerpt: "Replacing static pentests with continuous, impact-scored bug hunting to mirror real-world threat actors efficiently.",
            content: "Annual penetration testing is dead. By the time a 300-page PDF report is generated, the threat landscape has already evolved. Modern bug bounty programs are a step forward, but they are often disconnected from active enterprise defense grids.\n\nWe integrate a Gamified Reputation Engine right into the H3M4 ecosystem. Ethical hackers aren't just paid bounties; their 'Trust Metric' scales based on the severity and validity of their S-Pulse reports. This ensures only elite, verified researchers are permitted to submit intelligence directly into the enterprise mitigation pipelines, turning ad-hoc hacking into a highly reliable, continuous defense mechanism.",
            date: "Aug 22, 2026",
            author: "System Admin",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1510511459019-5efa3ecc4bab?auto=format&fit=crop&q=80&w=800&h=500"
        },
        {
            id: 4,
            title: "RBI Compliance Automation in 2026",
            excerpt: "Aligning real-time vulnerability detection directly to regulatory mandates without manual audit overhead.",
            content: "Compliance audits are notoriously tedious. Financial institutions spend millions manually mapping their security posture to frameworks like the RBI Cyber Security Guidelines, SEBI regulations, and GDPR. This manual process is error-prone and slow.\n\nH3M4 introduces 'Compliance-as-Code'. As our ecosystem nodes detect vulnerabilities, they are automatically cross-referenced against global regulatory standards. If a database vulnerability violates a specific RBI data localization clause, the enterprise dashboard immediately flags the exact regulation code and severity. This allows organizations to be audit-ready 24/7, reducing compliance overhead by an estimated 70%.",
            date: "Jul 10, 2026",
            author: "Compliance Governance",
            readTime: "4 min read",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=500"
        },
        {
            id: 5,
            title: "Decentralized Reputation Scoring for Researchers",
            excerpt: "How our proprietary validation engine ensures only elite, trusted researchers participate in the ecosystem.",
            content: "Trust in cybersecurity is binary—you either have it, or you are compromised. Open bug bounty platforms struggle with high volumes of 'noise': automated, low-quality reports that waste enterprise triage teams' time.\n\nOur solution is a Decentralized Trust Ledger. Every researcher starts with a zero-knowledge identity. As they submit valid, verified intelligence, a multi-node consensus (incorporating system validators and enterprise feedback) permanently logs their accuracy to a blockchain ledger. High-reputation researchers gain the ability to bypass lower-tier filters, ensuring critical zero-day discoveries reach institutional defenders without delay.",
            date: "Jun 05, 2026",
            author: "Trust Node",
            readTime: "8 min read",
            image: "https://images.unsplash.com/photo-1614064641936-732431713502?auto=format&fit=crop&q=80&w=800&h=500"
        },
        {
            id: 6,
            title: "The Financial ROI of Collaborative Defense",
            excerpt: "A financial analysis of how shared threat indicators decrease enterprise spending on incident recovery.",
            content: "The average cost of a data breach in the financial sector surpassed $5.9 million in 2025. Over 60% of these expenses stem from post-breach recovery, system downtime, and regulatory fines. \n\nCollaborative defense changes the math. An independent economic study of the federated defense model showed that institutions participating in real-time IOC sharing experienced a 45% reduction in successful intrusions. For a mid-sized bank, an annual subscription to a federated intelligence grid yields a 1,200% Return on Investment by avoiding just a single coordinated ransomware campaign.",
            date: "May 18, 2026",
            author: "M Hemanth Naik",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=500"
        },
        {
            id: 7,
            title: "AI Hallucinations in Log Analysis",
            excerpt: "Why relying solely on Large Language Models for threat attribution is a dangerous enterprise gamble.",
            content: "LLMs are revolutionizing SOCs by summarizing massive log data. However, our research has identified a massive vulnerability: AI Hallucinations in attribution. When a model incorrectly attributes the tactics of an attack, it causes defenders to deploy the wrong countermeasures.\n\nH3M4 strictly requires 'Human-in-the-Loop' validation. While our Breach Bots use advanced neural networks to parse dark web unstructured data, zero deterministic firewall actions are taken without a cryptographic sign-off from a certified human Governor node. This hybrid approach ensures speed without sacrificing accuracy.",
            date: "Apr 02, 2026",
            author: "AI Research Division",
            readTime: "9 min read",
            image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800&h=500"
        },
        {
            id: 8,
            title: "The Rise of API Weaponization",
            excerpt: "Open banking brings innovation, but improperly secured APIs have become the new frontier for FinTech breaches.",
            content: "The transition to Open Banking has interconnected systems at an unprecedented scale. Unauthenticated APIs, broken object level authorization (BOLA), and mass assignment vulnerabilities have replaced traditional malware as the primary vector for banking breaches.\n\nIn this brief, we analyze how a single rogue API endpoint effectively bypassed traditional Web Application Firewalls (WAFs) in three separate institutions last quarter. Sharing these API attack signatures instantly across the network is the only way to counteract automated, multi-institutional sweeps by threat actors.",
            date: "Mar 15, 2026",
            author: "Enterprise Security",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800&h=500"
        },
        {
            id: 9,
            title: "Building Immune Systems, Not Walls",
            excerpt: "The philosophical shift required to transition from perimeter defense to predictive cyber readiness.",
            content: "For three decades, cybersecurity relied on building thicker, taller walls. But the perimeter is gone. With remote work, cloud infrastructure, and third-party vendor integrations, the 'wall' model is obsolete.\n\nWe must view FinTech cybersecurity as a biological immune system. When the immune system detects a novel virus in the respiratory system, it generates antibodies and alerts the entire body. H3M4 is that nervous system for the financial sector. An attack on a payment gateway in Mumbai must instantly vaccinate a retail bank in New York. This is the definition of true Cyber Sovereign Defense.",
            date: "Feb 28, 2026",
            author: "M Hemanth Naik",
            readTime: "10 min read",
            image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800&h=500"
        }
    ];

    return (
        <div className="min-h-screen bg-black text-foreground selection:bg-primary/30 relative">
            {/* Minimal Nav */}
            <nav className="fixed top-0 w-full z-40 border-b border-white/5 bg-black/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-xl font-heading font-bold tracking-tight">H3M4 Blog</span>
                    </Link>
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="flex gap-2 text-muted-foreground hover:text-white transition-colors">
                            <ArrowLeft className="h-4 w-4" /> Back to Core
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="pt-32 pb-32 max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-xs font-bold text-primary mb-6 uppercase tracking-widest shadow-[0_0_20px_rgba(38,217,98,0.1)]">
                        Thought Leadership
                    </div>
                    <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                        Intelligence Briefings
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Read the latest research on federated defense, automated forensics, and the future of institutional cyber readiness.
                    </p>
                </div>

                {/* Grid Layout for Blog Posts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post, i) => (
                        <div 
                            key={post.id} 
                            onClick={() => setSelectedPost(post)}
                            className="group flex flex-col bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-primary/40 hover:bg-white/[0.04] transition-all duration-500 hover:-translate-y-2 cursor-pointer shadow-lg animate-in fade-in slide-in-from-bottom-8"
                            style={{ animationFillMode: "both", animationDelay: `${i * 100}ms` }}
                        >
                            {/* Image Container */}
                            <div className="relative h-56 w-full overflow-hidden bg-white/5">
                                <div className="absolute inset-0 bg-primary/20 group-hover:opacity-0 transition-opacity z-10 mix-blend-overlay"></div>
                                <img 
                                    src={post.image} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            
                            {/* Content */}
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-4">
                                    <div className="flex items-center gap-1.5 text-primary">
                                        <Calendar className="h-3 w-3" /> {post.date}
                                    </div>
                                    <div className="flex items-center gap-1.5 opacity-60">
                                        <Clock className="h-3 w-3" /> {post.readTime}
                                    </div>
                                </div>
                                
                                <h3 className="text-2xl font-bold font-heading mb-4 text-white group-hover:text-primary transition-colors leading-tight">
                                    {post.title}
                                </h3>
                                
                                <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-grow">
                                    {post.excerpt}
                                </p>
                                
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                                            <User className="h-3 w-3 text-white" />
                                        </div>
                                        <span className="font-medium text-xs tracking-wide">{post.author}</span>
                                    </div>
                                    
                                    <div className="flex items-center text-xs font-bold text-primary tracking-widest uppercase opacity-70 group-hover:opacity-100 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/0 group-hover:border-primary/30 transition-all">
                                        Read <ArrowUpRight className="h-3.5 w-3.5 ml-1 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Reading Modal */}
            <AnimatePresence>
                {selectedPost && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                            onClick={() => setSelectedPost(null)}
                        />
                        
                        {/* Modal Content */}
                        <motion.div 
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-white/10 rounded-[2rem] shadow-2xl z-10 custom-scrollbar"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button 
                                onClick={() => setSelectedPost(null)}
                                className="absolute top-6 right-6 z-20 h-10 w-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Hero Image */}
                            <div className="h-64 sm:h-80 md:h-[400px] w-full relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />
                                <img 
                                    src={selectedPost.image} 
                                    alt={selectedPost.title} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 z-20">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/20 text-[10px] sm:text-xs font-bold text-primary mb-4 uppercase tracking-widest backdrop-blur-md">
                                        Intelligence Report
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white leading-tight">
                                        {selectedPost.title}
                                    </h2>
                                </div>
                            </div>

                            {/* Body Content */}
                            <div className="p-6 sm:p-10 md:p-12 bg-zinc-950">
                                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground font-mono mb-10 pb-10 border-b border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <span className="text-white/90 font-medium">{selectedPost.author}</span>
                                    </div>
                                    <div className="h-4 w-[1px] bg-white/20 hidden sm:block"></div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-primary" /> {selectedPost.date}
                                    </div>
                                    <div className="h-4 w-[1px] bg-white/20 hidden sm:block"></div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" /> {selectedPost.readTime}
                                    </div>
                                </div>

                                <div className="prose prose-invert prose-lg md:prose-xl max-w-none text-muted-foreground">
                                    {selectedPost.content.split('\\n\\n').map((paragraph: string, idx: number) => (
                                        <p key={idx} className="mb-6 leading-relaxed font-light text-white/80">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                                
                                <div className="mt-16 pt-8 border-t border-white/5 flex justify-end">
                                    <Button onClick={() => setSelectedPost(null)} className="rounded-full px-8 hover:bg-white hover:text-black transition-colors font-bold">
                                        Finish Reading
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            

        </div>
    );
}
