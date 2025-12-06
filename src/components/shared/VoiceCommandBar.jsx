import React, { useEffect, useState } from 'react';
import { Mic, MicOff, X, Zap, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VoiceCommandBar({
    isOpen,
    isListening,
    isSpeaking,
    transcript,
    onMicToggle,
    onClose,
    isMicMuted,
    activeContext
}) {
    const [visualizerBars, setVisualizerBars] = useState(Array(12).fill(10));

    // Simulate audio visualizer
    useEffect(() => {
        if (isListening || isSpeaking) {
            const interval = setInterval(() => {
                setVisualizerBars(prev => prev.map(() => Math.max(10, Math.random() * 40)));
            }, 100);
            return () => clearInterval(interval);
        } else {
            setVisualizerBars(Array(12).fill(10));
        }
    }, [isListening, isSpeaking]);

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-[86px] md:bottom-6 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-[9999] animate-in slide-in-from-bottom-10 fade-in duration-500 flex justify-center">
            <div className="bg-slate-900/90 backdrop-blur-md text-white rounded-full shadow-2xl border border-white/10 p-2 pl-4 md:pl-6 pr-2 flex items-center gap-3 md:gap-6 w-full md:w-auto md:min-w-[400px] max-w-[600px] transition-all hover:scale-[1.01]">

                {/* Status Indicator / Visualizer */}
                <div className="flex items-center gap-1 h-8 w-16 justify-center">
                    {isListening || isSpeaking ? (
                        visualizerBars.map((height, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-1 rounded-full transition-all duration-100",
                                    isSpeaking ? "bg-purple-400" : "bg-green-400"
                                )}
                                style={{ height: `${height}%` }}
                            />
                        ))
                    ) : (
                        <div className="flex items-center gap-2 text-slate-400">
                            <div className="w-2 h-2 rounded-full bg-slate-500" />
                            <span className="text-xs font-medium uppercase tracking-wider">Ready</span>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col justify-center min-h-[40px]">
                    {activeContext && (
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                            <Zap className="w-3 h-3 text-purple-400" />
                            {activeContext}
                        </div>
                    )}
                    <div className="text-xs md:text-sm font-medium text-slate-100 truncate max-w-[200px] md:max-w-[300px]">
                        {isSpeaking ? (
                            <span className="text-purple-200">Sophiie is speaking...</span>
                        ) : isListening ? (
                            <span className="text-green-200">{transcript || "Listening..."}</span>
                        ) : (
                            <span className="text-slate-400">Tap microphone to speak</span>
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onMicToggle}
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                            isMicMuted
                                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                : isListening
                                    ? "bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                                    : "bg-slate-800 text-white hover:bg-slate-700"
                        )}
                    >
                        {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Glow Effect */}
            <div className={cn(
                "absolute inset-0 -z-10 rounded-full blur-2xl transition-opacity duration-500",
                isListening ? "bg-green-500/20 opacity-100" : isSpeaking ? "bg-purple-500/20 opacity-100" : "opacity-0"
            )} />
        </div>
    );
}
