import { useQuery, useMutation } from "@tanstack/react-query";
import { Notification } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCircle2, AlertTriangle, Info, ShieldAlert, Trash2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationsPage() {
    const [filter, setFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const { data: notifications = [], isLoading } = useQuery<Notification[]>({
        queryKey: ["/api/notifications"],
    });

    const markReadMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiRequest("PATCH", `/api/notifications/${id}/read`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
        }
    });

    const filteredNotifications = notifications.filter(n => {
        const matchesFilter = filter === "all" || (filter === "unread" && n.isRead === "false") || (filter === "read" && n.isRead === "true");
        const matchesSearch = n.message.toLowerCase().includes(searchQuery.toLowerCase()) || n.type.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "alert": return <ShieldAlert className="h-5 w-5 text-destructive" />;
            case "warning": return <AlertTriangle className="h-5 w-5 text-orange-500" />;
            case "success": return <CheckCircle2 className="h-5 w-5 text-primary" />;
            default: return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
                <div className="space-y-1">
                    <div className="flex items-center gap-3 text-primary">
                        <Bell className="h-8 w-8" />
                        <h1 className="text-4xl font-heading font-black tracking-tighter uppercase italic">Protocol History</h1>
                    </div>
                    <p className="text-muted-foreground font-mono text-sm">System-wide intelligence signals and operational logs.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {["all", "unread", "read"].map((f) => (
                        <Button
                            key={f}
                            variant={filter === f ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter(f)}
                            className={cn(
                                "h-8 px-4 text-[10px] font-bold uppercase tracking-widest",
                                filter === f ? "bg-primary text-black" : "border-white/10 hover:bg-white/5"
                            )}
                        >
                            {f}
                        </Button>
                    ))}
                </div>
            </header>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search protocols (e.g. 'AWS', 'ATTACK')..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-mono"
                />
            </div>

            <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredNotifications.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 glass-panel rounded-3xl border-dashed border-white/5"
                        >
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/5 mb-4">
                                <Filter className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-heading font-bold mb-2">No Protocols Found</h3>
                            <p className="text-muted-foreground text-sm max-w-xs mx-auto">Try adjusting your filters or search query to find specific system signals.</p>
                        </motion.div>
                    ) : (
                        filteredNotifications.map((n, i) => (
                            <motion.div
                                key={n.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={cn(
                                    "group relative glass-panel p-6 rounded-2xl border-white/5 transition-all hover:bg-white/[0.02] flex items-start gap-6",
                                    n.isRead === "false" && "border-primary/20 bg-primary/[0.02]"
                                )}
                            >
                                <div className="mt-1 shrink-0">
                                    {getTypeIcon(n.type)}
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className={cn(
                                            "text-[8px] h-4 uppercase tracking-tighter font-bold border-white/10",
                                            n.type === "alert" && "text-destructive border-destructive/20 bg-destructive/5",
                                            n.type === "success" && "text-primary border-primary/20 bg-primary/5",
                                            n.type === "warning" && "text-orange-500 border-orange-500/20 bg-orange-500/5",
                                            n.type === "info" && "text-blue-500 border-blue-500/20 bg-blue-500/5"
                                        )}>
                                            {n.type} SIGNAL
                                        </Badge>
                                        <span className="text-[10px] font-mono text-muted-foreground uppercase">
                                            {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className={cn(
                                        "text-sm leading-relaxed transition-colors",
                                        n.isRead === "false" ? "text-foreground font-bold" : "text-muted-foreground"
                                    )}>
                                        {n.message}
                                    </p>
                                    <div className="pt-2 flex items-center gap-4 text-[10px] font-mono text-muted-foreground/60">
                                        <span>SIGNAL_ID: {n.id.substring(0, 8)}...</span>
                                        <span>ENCRYPTION: AES-256-GCM</span>
                                    </div>
                                </div>

                                {n.isRead === "false" && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => markReadMutation.mutate(n.id)}
                                        className="text-primary hover:text-primary hover:bg-primary/10 text-[10px] font-bold uppercase"
                                    >
                                        Acknowledge
                                    </Button>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
