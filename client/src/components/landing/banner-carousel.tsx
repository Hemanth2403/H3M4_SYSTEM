import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Shield, Globe, FileCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'wouter';

// Slide Data representing the H3M4 Ecosystem
const slides = [
    {
        id: 1,
        title: "Unified Threat Vision",
        description: "Real-time threat signal correlation across the entire financial ecosystem. Detect patterns before they become breaches.",
        icon: Globe,
        color: "from-blue-500/20 to-cyan-500/20",
        border: "border-blue-500/30",
        text: "text-blue-400",
        link: "#vision"
    },
    {
        id: 2,
        title: "Regulatory Compliance",
        description: "Automated mapping to RBI, SEBI, and GDPR frameworks. Stay compliant with instant evidence generation and audit trails.",
        icon: FileCheck,
        color: "from-emerald-500/20 to-green-500/20",
        border: "border-emerald-500/30",
        text: "text-emerald-400",
        link: "#governance"
    },
    {
        id: 3,
        title: "Vetted Research Elite",
        description: "Access a closed network of verified security researchers. Crowdsourced intelligence without the noise.",
        icon: Users,
        color: "from-purple-500/20 to-pink-500/20",
        border: "border-purple-500/30",
        text: "text-purple-400",
        link: "#ecosystem"
    },
    {
        id: 4,
        title: "Enterprise Defense",
        description: "Proactive vulnerability management and risk forecasting tailored for modern fintech logic flaws.",
        icon: Shield,
        color: "from-orange-500/20 to-red-500/20",
        border: "border-orange-500/30",
        text: "text-orange-400",
        link: "#product"
    }
];

export function BannerCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);

        // Auto-advance every 5 seconds
        const interval = setInterval(() => {
            if (emblaApi.canScrollNext()) emblaApi.scrollNext();
        }, 5000);

        return () => {
            emblaApi.off('select', onSelect);
            clearInterval(interval);
        };
    }, [emblaApi, onSelect]);

    return (
        <div className="relative w-full px-4 md:px-8 pb-12 pt-4">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl w-full" ref={emblaRef}>
                <div className="flex">
                    {slides.map((slide) => (
                        <div className="flex-[0_0_100%] min-w-0 relative" key={slide.id}>
                            {/* Slide Content */}
                            <div className={cn(
                                "relative min-h-[500px] md:h-[400px] flex items-center justify-center p-6 md:p-20 overflow-hidden group",
                                "bg-gradient-to-br", slide.color
                            )}>
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
                                <slide.icon className={cn("absolute right-[-20%] md:right-[-10%] bottom-[-20%] md:bottom-[-10%] w-64 h-64 md:w-96 md:h-96 opacity-5 rotate-12 transition-transform duration-700 group-hover:scale-110", slide.text)} />

                                <div className="relative z-10 w-full max-w-4xl text-center md:text-left flex flex-col md:flex-row items-center gap-6 md:gap-12">
                                    <div className={cn("p-4 md:p-6 rounded-2xl bg-black/50 border backdrop-blur-md shadow-xl shrink-0", slide.border)}>
                                        <slide.icon className={cn("w-10 h-10 md:w-16 md:h-16", slide.text)} />
                                    </div>

                                    <div className="space-y-4 md:space-y-6">
                                        <h2 className="text-2xl md:text-5xl font-heading font-bold tracking-tight text-white">{slide.title}</h2>
                                        <p className="text-sm md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                                            {slide.description}
                                        </p>
                                        <div className="pt-2 md:pt-4">
                                            <Button variant="outline" className="border-white/10 hover:bg-white/10 text-white text-xs md:text-sm font-medium" asChild>
                                                <a href={slide.link}>
                                                    Learn More
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-center gap-4 mt-8">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={scrollPrev}
                    className="rounded-full hover:bg-white/10 text-muted-foreground hover:text-white"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <div className="flex items-center gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => emblaApi?.scrollTo(index)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                index === selectedIndex ? "w-8 bg-primary" : "bg-white/20 hover:bg-white/40"
                            )}
                        />
                    ))}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={scrollNext}
                    className="rounded-full hover:bg-white/10 text-muted-foreground hover:text-white"
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>
        </div>
    );
}
