import React, { useState, useEffect, useRef } from 'react';
import { Mic2, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function VoiceSetupBanner({ onStartVoiceFlow }) {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('voiceSetupBannerCollapsed');
        return saved === 'true';
    });

    useEffect(() => {
        localStorage.setItem('voiceSetupBannerCollapsed', isCollapsed);
    }, [isCollapsed]);

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const bannerRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!bannerRef.current) return;
            const rect = bannerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            setMousePos({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            ref={bannerRef}
            className={cn(
                "rounded-2xl text-white relative overflow-hidden transition-all duration-500 ease-in-out mb-10 border border-white/10",
                isCollapsed ? "p-4 md:px-12 md:py-6" : "p-8 md:p-12"
            )}
        >
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-slate-950">
                {/* Deep Base Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-indigo-950 to-blue-950 opacity-100" />

                <div className="absolute w-[100%] h-[100%] top-0 left-0 overflow-hidden">
                    {/* Blob 1: Deep Blue */}
                    <div className="absolute top-[10%] left-[10%] w-[60%] h-[60%] animate-[moveInCircle_20s_linear_infinite]">
                        <div
                            className="w-full h-full bg-blue-700 rounded-full mix-blend-screen filter blur-[100px] opacity-40 transition-transform duration-300 ease-out"
                            style={{ transform: `translate(${mousePos.x * 0.04}px, ${mousePos.y * 0.04}px)` }}
                        />
                    </div>

                    {/* Blob 2: Indigo */}
                    <div className="absolute top-[10%] right-[10%] w-[50%] h-[50%] animate-[moveVertical_30s_ease-in-out_infinite]">
                        <div
                            className="w-full h-full bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-50 transition-transform duration-300 ease-out"
                            style={{ transform: `translate(${mousePos.x * -0.05}px, ${mousePos.y * 0.05}px)` }}
                        />
                    </div>

                    {/* Blob 3: Sky Blue */}
                    <div className="absolute bottom-[20%] left-[20%] w-[50%] h-[50%] animate-[moveHorizontal_40s_ease-in-out_infinite]">
                        <div
                            className="w-full h-full bg-sky-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 transition-transform duration-300 ease-out"
                            style={{ transform: `translate(${mousePos.x * 0.03}px, ${mousePos.y * -0.03}px)` }}
                        />
                    </div>

                    {/* Blob 4: Cyan */}
                    <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[40%] animate-[moveInCircle_40s_reverse_infinite]">
                        <div
                            className="w-full h-full bg-cyan-500 rounded-full mix-blend-screen filter blur-[120px] opacity-40 transition-transform duration-300 ease-out"
                            style={{ transform: `translate(${mousePos.x * -0.06}px, ${mousePos.y * -0.06}px)` }}
                        />
                    </div>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20"
                title={isCollapsed ? "Expand" : "Collapse"}
            >
                {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>

            {isCollapsed ? (
                // Collapsed View
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pr-10 md:pr-12 relative z-10">
                    <div className="hidden md:flex items-center font-bold text-xl tracking-tight">
                        <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 shadow-sm mr-4">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-sky-200">
                            Let's Train Sophiie.
                        </span>
                    </div>
                    <Button
                        onClick={onStartVoiceFlow}
                        className="w-full md:w-auto bg-transparent hover:bg-transparent text-[#4c1d95] border-none shadow-sm transition-all hover:scale-105 active:scale-95 relative overflow-hidden group p-0 rounded-full"
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[500%] h-[500%] bg-[conic-gradient(from_90deg_at_50%_50%,#0000_0%,#38bdf8_50%,#a855f7_75%,#0000_100%)] animate-[spin_3s_linear_infinite]" />
                        </div>
                        <div className="absolute inset-[2.25px] bg-white rounded-full group-hover:bg-blue-50 transition-colors" />
                        <div className="relative z-10 flex items-center px-6 py-2">
                            <Mic2 className="w-4 h-4 mr-2" /> <span className="font-medium">Guided Voice Setup</span>
                        </div>
                    </Button>
                </div>
            ) : (
                // Expanded View
                <>
                    <div className="relative z-10 max-w-2xl animate-in fade-in duration-500 slide-in-from-bottom-4">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight flex items-center gap-4">
                            <div className="p-1.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 shadow-sm">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-sky-200">
                                Let's Train Sophiie.
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-indigo-100/90 mb-10 leading-relaxed max-w-xl">
                            Your AI receptionist learns from your business data. Use your voice to guide her training, or select the items below to configure Sophiie directly.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button
                                onClick={onStartVoiceFlow}
                                className="bg-transparent hover:bg-transparent text-[#4c1d95] border-none shadow-[0_0_40px_-10px_rgba(168,85,247,0.6)] hover:shadow-[0_0_60px_-15px_rgba(168,85,247,0.8)] transition-all hover:scale-105 active:scale-95 relative overflow-hidden group p-0 rounded-full"
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-[500%] h-[500%] bg-[conic-gradient(from_90deg_at_50%_50%,#0000_0%,#38bdf8_50%,#a855f7_75%,#0000_100%)] animate-[spin_3s_linear_infinite]" />
                                </div>
                                <div className="absolute inset-[2.25px] bg-white rounded-full group-hover:bg-blue-50 transition-colors" />
                                <div className="relative z-10 flex items-center px-8 py-3 text-lg">
                                    <Mic2 className="w-5 h-5 mr-2.5" /> <span className="font-semibold">Start Voice Session</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
