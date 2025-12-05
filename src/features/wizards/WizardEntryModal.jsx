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
            <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.4)] border border-white/10 p-8 w-full max-w-md relative animate-in zoom-in-95 duration-300">

                {/* Close Button */}
                <button
                    onClick={() => onClose(dontShowAgain)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">How would you like to start?</h2>
                    <p className="text-slate-400 text-sm">Choose your preferred way to configure this service.</p>
                </div>

                <div className="space-y-4">
                    {/* Voice Setup Button (Purple Banner Style) */}
                    <button
                        onClick={() => handleSelect('voice')}
                        className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#1e1b4b] to-[#4c1d95] p-[2px] transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="relative flex items-center gap-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-[10px] transition-colors">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white flex-shrink-0">
                                <Mic2 className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-white">Guided Voice Setup</div>
                                <div className="text-xs text-purple-200">Interactive AI Assistance</div>
                            </div>
                        </div>
                    </button>

                    {/* Manual Entry Button */}
                    <button
                        onClick={() => handleSelect('manual')}
                        className="w-full group flex items-center gap-4 p-4 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-800/50 hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-700 group-hover:bg-slate-600 flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
                            <Keyboard className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-slate-200 group-hover:text-white">Manual Entry</div>
                            <div className="text-xs text-slate-500 group-hover:text-slate-400">I'll type the details myself</div>
                        </div>
                    </button>
                </div>

                {/* Footer Checkbox */}
                <div className="mt-6 flex items-center justify-center gap-2">
                    <Checkbox
                        id="dont-show"
                        checked={dontShowAgain}
                        onCheckedChange={setDontShowAgain}
                        className="border-slate-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <label
                        htmlFor="dont-show"
                        className="text-xs text-slate-400 cursor-pointer hover:text-slate-300 select-none"
                    >
                        Don't show this again
                    </label>
                </div>
            </div>
        </div>
    );
}
