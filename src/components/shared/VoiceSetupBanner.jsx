import React, { useState } from 'react';
import { Mic2, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function VoiceSetupBanner({ onStartVoiceFlow }) {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('voiceSetupBannerCollapsed');
        return saved === 'true';
    });

    React.useEffect(() => {
        localStorage.setItem('voiceSetupBannerCollapsed', isCollapsed);
    }, [isCollapsed]);

    return (
        <div
            className={cn(
                "rounded-2xl bg-gradient-to-r from-[#1e1b4b] to-[#4c1d95] text-white shadow-xl relative overflow-hidden transition-all duration-300 ease-in-out mb-10",
                isCollapsed ? "p-4 md:px-12 md:py-6" : "p-8 md:p-12"
            )}
        >
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
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pr-10 md:pr-12">
                    <div className="hidden md:block font-semibold text-lg">
                        Let's Train Sophiie.
                    </div>
                    <Button
                        onClick={onStartVoiceFlow}
                        className="w-full md:w-auto bg-white text-[#4c1d95] hover:bg-blue-50 border-none font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
                    >
                        <Mic2 className="w-4 h-4 mr-2" /> Guided Voice Setup
                    </Button>
                </div>
            ) : (
                // Expanded View
                <>
                    <div className="relative z-10 max-w-2xl animate-in fade-in duration-500">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Let's Train Sophiie.</h1>
                        <p className="text-blue-100 text-lg mb-8 leading-relaxed opacity-90">
                            Your AI receptionist learns directly from your business data. You can guide her setup instantly with your voice or upload your existing documents to get started.
                        </p>
                        <Button
                            onClick={onStartVoiceFlow}
                            className="bg-white text-[#4c1d95] hover:bg-blue-50 border-none font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                        >
                            <Mic2 className="w-4 h-4 mr-2" /> Guided Voice Setup
                        </Button>
                    </div>

                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                    <div className="absolute bottom-0 right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
                </>
            )}
        </div>
    );
}
