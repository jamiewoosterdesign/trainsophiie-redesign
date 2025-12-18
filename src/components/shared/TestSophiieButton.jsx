import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Sparkles, RefreshCw, Minus, MessageCircle } from 'lucide-react';
import sophiieProfile from '@/images/sophiie-profile2-white-bg.png';

export function TestSophiieButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* The Modal Triggered State */}
            {isOpen && (
                <div className="fixed bottom-24 right-8 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="w-[380px] h-[550px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">

                        {/* Header */}
                        <div className="h-16 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 bg-white dark:bg-slate-900 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-slate-900 overflow-hidden border border-slate-100 dark:border-slate-700">
                                    <img src={sophiieProfile} alt="Sophiie" className="w-full h-full object-cover" />
                                </div>
                                <span className="font-semibold text-slate-700 dark:text-slate-200">Call with Sophiie</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mr-2">
                                    <MessageCircle className="w-4 h-4" />
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                            {/* Background decoration */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                            <div className="w-28 h-28 rounded-full bg-slate-100 dark:bg-slate-800 mb-6 relative flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl z-10">
                                <img src={sophiieProfile} alt="Sophiie" className="w-full h-full object-cover" />
                            </div>

                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 relative z-10">Test Sophiie</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-[260px] relative z-10">
                                Check how Sophiie handles your customers
                            </p>

                            <div className="flex flex-col items-center gap-2 mb-10 relative z-10">
                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold rounded-full uppercase tracking-wider">
                                    Session Ended
                                </span>
                                <span className="text-xs text-slate-400">Call Ended</span>
                            </div>

                            <Button variant="outline" className="gap-2 w-full max-w-xs h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 relative z-10 text-slate-600 dark:text-slate-200">
                                Start new conversation <RefreshCw className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* The Floating Button */}
            <div className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-5 fade-in duration-500 delay-300">
                {isOpen ? (
                    <Button
                        onClick={() => setIsOpen(false)}
                        className="h-11 px-5 rounded-full shadow-lg shadow-slate-500/20 bg-slate-500 hover:bg-slate-600 text-white gap-2 font-medium transition-all"
                    >
                        <X className="w-4 h-4" /> Close Testing
                    </Button>
                ) : (
                    <Button
                        onClick={() => setIsOpen(true)}
                        className="h-11 px-5 rounded-full shadow-xl shadow-blue-500/30 bg-[#0ea5e9] hover:bg-[#0284c7] dark:bg-[#0ea5e9] dark:hover:bg-[#0284c7] text-white dark:text-white gap-2 font-medium hover:scale-105 transition-all"
                    >
                        <Sparkles className="w-4 h-4 fill-white/20" /> Test Sophiie
                    </Button>
                )}
            </div>
        </>
    );
}
