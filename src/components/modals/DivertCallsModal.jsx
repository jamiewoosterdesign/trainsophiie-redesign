import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronDown, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DivertCallsModal({ isOpen, onClose }) {
    const [copied, setCopied] = useState(false);
    const forwardingNumber = "+12183074652";
    const dialCode = `**61*${forwardingNumber}**10#`;

    const handleCopy = () => {
        navigator.clipboard.writeText(dialCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <div className="p-6 pb-0">
                    <DialogHeader className="mb-4 text-left">
                        <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Divert Calls to Sophiie</DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400">
                            Follow these instructions to divert your calls to Sophiie
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2 mb-6">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Where is your mobile phone registered?
                        </label>
                        <button className="w-full max-w-[240px] flex items-center justify-between px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-900 dark:text-white">
                            <span className="flex items-center gap-2">
                                <span className="text-lg">🇦🇺</span>
                                <span className="text-sm font-medium">AU Australia</span>
                            </span>
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                        </button>
                    </div>
                </div>

                <div className="px-6 pb-6">
                    <Tabs defaultValue="iphone" className="w-full">
                        <TabsList className="w-full grid grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
                            <TabsTrigger
                                value="iphone"
                                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
                            >
                                iPhone
                            </TabsTrigger>
                            <TabsTrigger
                                value="android"
                                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
                            >
                                Android
                            </TabsTrigger>
                            <TabsTrigger
                                value="landline"
                                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
                            >
                                Landline
                            </TabsTrigger>
                        </TabsList>

                        {/* iPhone Content */}
                        <TabsContent value="iphone" className="mt-0 space-y-6 focus-visible:outline-none">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-slate-900 dark:text-white">How to divert calls for iPhone</h3>

                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 group">
                                    <code className="text-lg font-mono text-slate-700 dark:text-slate-200 break-all">
                                        Dial {dialCode}
                                    </code>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleCopy}
                                        className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-semibold text-slate-900 dark:text-white">iPhone Troubleshooting:</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    If call diversion is setup, but calls aren't diverting to Sophiie
                                </p>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 list-none">
                                    <li className="flex gap-2">
                                        <span className="font-medium text-slate-400">Step 1.</span>
                                        Go to your iPhone settings.
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-medium text-slate-400">Step 2.</span>
                                        Search for 'Live Voicemail' in the search bar.
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-medium text-slate-400">Step 3.</span>
                                        Turn the 'Live Voicemail' toggle off.
                                    </li>
                                </ul>
                            </div>
                        </TabsContent>

                        {/* Android Content */}
                        <TabsContent value="android" className="mt-0 space-y-6 focus-visible:outline-none">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-slate-900 dark:text-white">How to divert calls for Android</h3>

                                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                    <p><span className="font-medium text-slate-400 mr-2">Step 1.</span> Open the Phone app.</p>
                                    <p><span className="font-medium text-slate-400 mr-2">Step 2.</span> Tap the three-dot menu (top right) and select Settings.</p>
                                    <p><span className="font-medium text-slate-400 mr-2">Step 3.</span> Go to Calls, then Call forwarding or Supplementary services.</p>
                                    <p><span className="font-medium text-slate-400 mr-2">Step 4.</span> Tap Voice call.</p>
                                </div>

                                <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">You'll see several diversion options:</p>
                                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 ml-4 list-disc">
                                        <li>Always forward - not recommended for Sophiie</li>
                                        <li>Forward when busy</li>
                                        <li>Forward when unanswered</li>
                                        <li>Forward when unreachable</li>
                                    </ul>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl text-sm text-slate-700 dark:text-slate-300 border border-blue-100 dark:border-blue-900/30">
                                    <p className="font-medium mb-1">For each relevant option, enter:</p>
                                    <p className="font-mono bg-white dark:bg-slate-900/50 px-2 py-1 rounded inline-block text-blue-600 dark:text-blue-400 mb-1">
                                        International format: {forwardingNumber}
                                    </p>
                                    <p>Then tap Turn On or Enable.</p>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Android Troubleshooting:</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">If Sophiie isn't receiving your diverted calls:</p>
                                    <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc ml-4">
                                        <li>Make sure the correct number is saved in all three conditional options: busy, unanswered, and unreachable.</li>
                                        <li>Restart your phone after setting call forwarding.</li>
                                        <li>Test by calling your number from a second phone while it's busy, off, or unanswered.</li>
                                    </ul>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Landline Content */}
                        <TabsContent value="landline" className="mt-0 space-y-6 focus-visible:outline-none">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-slate-900 dark:text-white">How to divert calls for Landline</h3>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    Speak to your landline provider (Telstra, Optus, TPG, etc.), and ask them to divert your calls after 5 rings to:
                                </p>
                                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg flex items-center justify-center">
                                    <code className="text-lg font-mono text-slate-900 dark:text-white">
                                        International format: {forwardingNumber}
                                    </code>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
