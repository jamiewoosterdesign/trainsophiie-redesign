import React, { useState, useEffect } from 'react';
import { Mic2, ChevronUp, ChevronDown } from 'lucide-react';
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

    return (
        <div
            className={cn(
                "rounded-2xl text-white shadow-xl relative overflow-hidden transition-all duration-300 ease-in-out mb-10 bg-slate-900",
                isCollapsed ? "p-4 md:px-12 md:py-6" : "p-8 md:p-12"
            )}
        >
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-[#1e1b4b] to-[#4c1d95] opacity-80" />
                <div className="absolute w-[100%] h-[100%] top-0 left-0 overflow-hidden">
                    {/* Blob 1: Violet */}
                    <div className="absolute top-[10%] left-[10%] w-[60%] h-[60%] bg-[#4c1d95] rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-[moveInCircle_20s_linear_infinite]" />

                    {/* Blob 2: Indigo */}
                    <div className="absolute top-[10%] right-[10%] w-[50%] h-[50%] bg-[#1e1b4b] rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-[moveVertical_30s_ease-in-out_infinite]" />

                    {/* Blob 3: Sky Blue */}
                    <div className="absolute bottom-[20%] left-[20%] w-[50%] h-[50%] bg-[#0c4a6e] rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-[moveHorizontal_40s_ease-in-out_infinite]" />

                    {/* Blob 4: Cyan Highlight */}
                    <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[40%] bg-[#22d3ee] rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-[moveInCircle_40s_reverse_infinite]" />

                    {/* Blob 5: Extra Violet */}
                    <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-[#8b5cf6] rounded-full mix-blend-screen filter blur-[80px] opacity-40 animate-[moveVertical_25s_ease-in-out_infinite]" />
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
                    <div className="hidden md:block font-semibold text-lg">
                        Let's Train Sophiie.
                    </div>
                    <Button
                        onClick={onStartVoiceFlow}
                        className="w-full md:w-auto bg-transparent hover:bg-transparent text-[#4c1d95] border-none shadow-sm transition-all hover:scale-105 active:scale-95 relative overflow-hidden group p-0 rounded-full"
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[500%] h-[500%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#a855f7_50%,transparent_100%)] animate-[spin_3s_linear_infinite]" />
                        </div>
                        <div className="absolute inset-[3px] bg-white rounded-full group-hover:bg-blue-50 transition-colors" />
                        <div className="relative z-10 flex items-center px-6 py-2">
                            <Mic2 className="w-4 h-4 mr-2" /> <span>Guided Voice Setup</span>
                        </div>
                    </Button>
                </div>
            ) : (
                // Expanded View
                <>
                    <div className="relative z-10 max-w-2xl animate-in fade-in duration-500">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Let's Train Sophiie.</h1>
                        <p className="text-blue-50 text-lg mb-8 leading-relaxed">
                            Your AI receptionist learns from your business data. Use your voice to guide her training, or select the items below to configure Sophiie directly.
                        </p>
                        <Button
                            onClick={onStartVoiceFlow}
                            className="bg-transparent hover:bg-transparent text-[#4c1d95] border-none shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 relative overflow-hidden group p-0 rounded-full"
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-[500%] h-[500%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#a855f7_50%,transparent_100%)] animate-[spin_3s_linear_infinite]" />
                            </div>
                            <div className="absolute inset-[3px] bg-white rounded-full group-hover:bg-blue-50 transition-colors" />
                            <div className="relative z-10 flex items-center px-6 py-2">
                                <Mic2 className="w-4 h-4 mr-2" /> <span>Guided Voice Setup</span>
                            </div>
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
