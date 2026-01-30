import { useState, useEffect, useRef } from "react";
import { Terminal, Bot, Send, Activity, Shield, Zap, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
    role: "assistant" | "system" | "user";
    content: string;
    type?: "alert" | "info" | "success" | "neutral";
}

export function SecurityAnalyst() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Neural link established. I am monitoring Shard #882 in real-time. System status: NOMINAL.",
            type: "neutral"
        }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate AI Response
        setTimeout(() => {
            setIsTyping(false);
            const response = getAIResponse(input);
            setMessages(prev => [...prev, response]);
        }, 1500);
    };

    const getAIResponse = (query: string): Message => {
        const q = query.toLowerCase();
        if (q.includes("threat") || q.includes("status")) {
            return {
                role: "assistant",
                content: "Current threat level is elevated (70%). Detected 12 anomalous packet clusters in the Singapore region. Recommended Action: Initialize Deep Scan on Shard #882.",
                type: "alert"
            };
        }
        if (q.includes("who") || q.includes("identity")) {
            return {
                role: "assistant",
                content: "Origin identified as RED_TEAM_ALPHA. Historical correlation suggests this is a high-fidelity infiltration simulation from the Central Governance Node.",
                type: "info"
            };
        }
        if (q.includes("mitigate") || q.includes("fix")) {
            return {
                role: "assistant",
                content: "Executing predictive mitigation protocols. Blacklisting egress points 0x92 and 0xFA. System integrity at 99.9%.",
                type: "success"
            };
        }
        return {
            role: "assistant",
            content: "Understood. Maintaining surveillance on all ingress streams. Awaiting your directive.",
            type: "neutral"
        };
    };

    return (
        <div className="flex flex-col h-full glass-panel border-white/5 bg-black/40 rounded-2xl overflow-hidden font-mono">
            <div className="p-4 border-b border-white/5 bg-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                    <Bot className="h-4 w-4" /> AI_SECURITY_ANALYST
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[8px] text-muted-foreground uppercase">Neural Link: Active</span>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-hide">
                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "max-w-[85%] p-3 rounded-xl text-[10px] leading-relaxed",
                                msg.role === "user"
                                    ? "ml-auto bg-primary/20 border border-primary/30 text-primary-foreground"
                                    : "mr-auto bg-white/5 border border-white/10 text-muted-foreground",
                                msg.type === "alert" && "border-red-500/50 bg-red-500/10 text-red-400",
                                msg.type === "success" && "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
                                msg.type === "info" && "border-blue-500/50 bg-blue-500/10 text-blue-400"
                            )}
                        >
                            <div className="flex items-center gap-2 mb-1 opacity-50 font-bold uppercase text-[8px]">
                                {msg.role === "user" ? <Shield className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                                {msg.role}
                            </div>
                            {msg.content}
                        </motion.div>
                    ))}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mr-auto bg-white/5 border border-white/10 p-3 rounded-xl text-[10px] text-muted-foreground flex gap-1"
                        >
                            <span className="animate-bounce">.</span>
                            <span className="animate-bounce delay-100">.</span>
                            <span className="animate-bounce delay-200">.</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="p-4 border-t border-white/5 flex gap-2 bg-black/20">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Query the Security Analyst..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] focus:outline-none focus:border-primary/50 text-white placeholder:text-muted-foreground/30"
                />
                <Button size="icon" onClick={handleSend} className="bg-primary hover:bg-primary/80 text-black h-8 w-8">
                    <Send className="h-3 w-3" />
                </Button>
            </div>
        </div>
    );
}
