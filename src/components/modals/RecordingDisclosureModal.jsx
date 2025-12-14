import React, { useState, useEffect } from 'react';
import { X, Wand2, Mic, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export default function RecordingDisclosureModal({ isOpen, onClose, currentGreeting, onApply }) {
    if (!isOpen) return null;

    const [previewText, setPreviewText] = useState(currentGreeting);

    // When opening, if the text doesn't seem to have a disclosure, we append one for the "suggestion".
    // Simple heuristic: check for "recorded".
    useEffect(() => {
        if (isOpen) {
            const hasDisclosure = currentGreeting.toLowerCase().includes('recorded') || currentGreeting.toLowerCase().includes('monitor');
            if (!hasDisclosure) {
                setPreviewText(currentGreeting + "\n\nJust a quick note, this call is on a recorded line.");
            } else {
                setPreviewText(currentGreeting);
            }
        }
    }, [isOpen, currentGreeting]);

    return (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 border border-transparent dark:border-slate-800 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Preview</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Apply recording disclosure.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">

                        {/* Current Version */}
                        <div className="flex flex-col gap-2">
                            <span className="inline-flex self-start px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
                                Current Version
                            </span>
                            <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-slate-600 dark:text-slate-300 whitespace-pre-wrap shadow-sm text-sm leading-relaxed">
                                {currentGreeting}
                            </div>
                        </div>

                        {/* Disclosure Version */}
                        <div className="flex flex-col gap-2 relative">
                            <div className="flex justify-between items-center">
                                <span className="inline-flex self-start px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-xs font-medium text-blue-600 dark:text-blue-400">
                                    Recording Disclosure Version
                                </span>
                            </div>

                            <div className="flex-1 relative">
                                <Textarea
                                    value={previewText}
                                    onChange={(e) => setPreviewText(e.target.value)}
                                    className="h-full min-h-[200px] resize-none pb-12 bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-900/50 shadow-sm focus:border-blue-400 dark:focus:border-blue-700 focus:ring-blue-400/20"
                                />
                                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Voice Input">
                                        <Mic className="w-4 h-4" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Generate with AI">
                                        <Wand2 className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 gap-2">
                        <Wand2 className="w-4 h-4" /> Regenerate
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onClose} className="dark:bg-transparent dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                            Cancel
                        </Button>
                        <Button onClick={() => onApply(previewText)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                            Apply Recording Disclosure
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
