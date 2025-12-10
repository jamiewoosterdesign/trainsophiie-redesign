import React, { useState } from 'react';
import { Mic2, Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export default function WizardEntryModal({ onSelectMode, onClose }) {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const handleSelect = (mode) => {
        // In a real app, we would save the 'dontShowAgain' preference here
        if (dontShowAgain) {
            console.log("Saving preference: Don't show entry modal again");
        }
        onSelectMode(mode, dontShowAgain);
    };

    return (
        <div className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none">
            {/* Modal Container */}
            <div className="pointer-events-auto relative group">
                {/* Purple to White Shimmer Border/Glow Effect */}
                <div className="absolute -inset-[1.5px] rounded-2xl bg-gradient-to-br from-purple-500 via-white/40 to-purple-500 opacity-70 blur-[2px] group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Main Card Content */}
                <div className="relative bg-slate-900/70 backdrop-blur-2xl text-white rounded-2xl shadow-[0_0_60px_rgba(168,85,247,0.35)] border border-white/10 p-10 w-full max-w-md animate-in zoom-in-95 duration-300">

                    {/* Close Button */}
                    <button
                        onClick={() => onClose(dontShowAgain)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold mb-2 tracking-tight text-white">How would you like to start?</h2>
                        <p className="text-slate-400 text-sm">Choose your preferred way to configure this service.</p>
                    </div>

                    <div className="space-y-4">
                        {/* Voice Setup Button (Glass Purple Style) */}
                        <button
                            onClick={() => handleSelect('voice')}
                            className="w-full group/btn relative overflow-hidden rounded-xl p-[1px] transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                            <div className="relative flex items-center gap-4 bg-slate-900/50 hover:bg-purple-900/30 backdrop-blur-sm p-4 rounded-[11px] border border-purple-500/30 group-hover/btn:border-purple-400/50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 box-border border-purple-400/20 flex items-center justify-center text-purple-200 group-hover/btn:text-white group-hover/btn:bg-purple-500/40 transition-colors flex-shrink-0">
                                    <Mic2 className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-white tracking-wide">Guided Voice Setup</div>
                                    <div className="text-xs text-purple-200/80 group-hover/btn:text-purple-100">Interactive AI Assistance</div>
                                </div>
                            </div>
                        </button>

                        {/* Manual Entry Button (Glass Slate Style) */}
                        <button
                            onClick={() => handleSelect('manual')}
                            className="w-full group/btn flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover/btn:text-white transition-colors">
                                <Keyboard className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-slate-200 group-hover/btn:text-white">Manual Entry</div>
                                <div className="text-xs text-slate-500 group-hover/btn:text-slate-400">I'll type the details myself</div>
                            </div>
                        </button>
                    </div>

                    {/* Footer Checkbox */}
                    <div className="mt-8 flex items-center justify-center gap-2">
                        <Checkbox
                            id="dont-show"
                            checked={dontShowAgain}
                            onCheckedChange={setDontShowAgain}
                            className="border-slate-400 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 w-4 h-4 rounded"
                        />
                        <label
                            htmlFor="dont-show"
                            className="text-xs text-slate-300 cursor-pointer hover:text-white select-none font-medium"
                        >
                            Don't show this again
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
