
import React, { useState } from 'react';
import { UploadCloud, Globe, Loader2, Sparkles, FileCheck, X, Search, Wrench, HelpCircle, ShieldAlert, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function WizardFormContentDocument({ step, formData, onChange, activeField }) {
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, processing, done
    const [tooltipOpen, setTooltipOpen] = useState({});

    const toggleTooltip = (id, e) => {
        if (e) e.preventDefault();
        setTooltipOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleMockUpload = (type) => {
        setUploadStatus('uploading');

        // 1. Simulate Upload
        setTimeout(() => {
            setUploadStatus('processing');

            // 2. Simulate Analysis
            setTimeout(() => {
                setUploadStatus('done');
                // Mock Data Update
                onChange('isContextActive', true);
                onChange('contextFileName', type === 'upload' ? 'SOP_V2.pdf' : 'Knowledge_Base_Export.pdf');
            }, 2000);
        }, 1500);
    };

    // --- STEP 1: UPLOAD ---
    if (step === 1) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 min-h-[400px]">
                {uploadStatus === 'idle' && (
                    <React.Fragment>
                        <Label className="mb-3 flex items-center gap-2">
                            Select Source *
                            <TooltipProvider>
                                <Tooltip delayDuration={0} open={tooltipOpen['source']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, source: open }))}>
                                    <TooltipTrigger asChild onClick={(e) => toggleTooltip('source', e)}>
                                        <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                        <p>Choose where to import knowledge from (PDF, Word, or Web).</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Label>

                        {/* Stacked Layout as requested */}
                        <div className="flex flex-col gap-4">
                            <div
                                onClick={() => handleMockUpload('upload')}
                                className="group border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer h-24"
                            >
                                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-blue-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-slate-700 dark:text-slate-200">Upload Document</div>
                                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">PDF, DOCX, TXT</div>
                                </div>
                            </div>

                            <div className="group border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col gap-3 bg-slate-50 dark:bg-slate-900/50 hover:border-purple-400 dark:hover:border-purple-600 transition-all">
                                <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleMockUpload('web')}>
                                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <Globe className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-purple-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-slate-700 dark:text-slate-200">Web Source / Paste Link</div>
                                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">Import from URL</div>
                                    </div>
                                </div>

                                {/* Inline Input for Web Source */}
                                <div className="flex gap-2 mt-2 pl-[64px]">
                                    <Input placeholder="https://..." className="bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-slate-100 flex-1 h-9" />
                                    <Button size="sm" variant="secondary" onClick={() => handleMockUpload('web')} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 h-9">Fetch</Button>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                )}

                {uploadStatus === 'uploading' && (
                    <div className="flex flex-col items-center justify-center h-64 animate-in fade-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4 relative">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                        <h4 className="text-lg font-semibold text-slate-800 dark:text-white">Uploading Document...</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Securely transferring your file.</p>
                    </div>
                )}

                {uploadStatus === 'processing' && (
                    <div className="flex flex-col items-center justify-center h-64 animate-in fade-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-4 relative">
                            <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
                        </div>
                        <h4 className="text-lg font-semibold text-slate-800 dark:text-white">Analyzing Content...</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">I'm scanning for entities, policies, and pricing.</p>
                    </div>
                )}

                {uploadStatus === 'done' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Label className="mb-3 block">Selected Source</Label>
                        <div className="relative border-2 border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-900/10 rounded-xl p-6 flex flex-col items-center justify-center h-64 shadow-sm">
                            <div className="absolute top-3 right-3">
                                <button onClick={() => { setUploadStatus('idle'); onChange('isContextActive', false); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 shadow-sm animate-in zoom-in spin-in-12 duration-500">
                                <FileCheck className="w-7 h-7" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1">SOP_V2.pdf</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">2.4 MB • PDF Document</p>
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Analysis Complete</Badge>
                                <Badge variant="secondary" className="bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">12 Findings</Badge>
                            </div>
                            <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-6 max-w-xs">
                                Click "Next" to review what I found.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // --- STEP 2: REVIEW ---
    if (step === 2) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Review Findings</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[90%]">Please check if the following info is correct or relevant, on the next step you can decide where to apply it to Sophiie's training data.</p>
                    </div>
                </div>

                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search found items..."
                        className="pl-9 bg-white dark:bg-slate-900/50 dark:border-slate-700 dark:text-white"
                    />
                </div>

                <div className="space-y-4">
                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <Badge variant="secondary" className="cursor-pointer bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">Show All</Badge>
                        <Badge variant="outline" className="cursor-pointer bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">2 Services</Badge>
                        <Badge variant="outline" className="cursor-pointer bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">2 FAQs</Badge>
                        <Badge variant="outline" className="cursor-pointer bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800">1 Policy</Badge>
                    </div>

                    {/* Finding Card 1 - Service 1 */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex gap-4 hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Emergency Gas Repair</h4>
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">98% Match</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">"We offer 24/7 gas leak detection and repair services for residential properties..."</p>
                            <div className="mt-3 flex gap-2">
                                <Badge variant="secondary" className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">New Service</Badge>
                                <Badge variant="secondary" className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">$180 Fixed</Badge>
                            </div>
                        </div>
                        <div className="self-center">
                            <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                        </div>
                    </div>

                    {/* Finding Card 2 - Service 2 */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex gap-4 hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                            <Wrench className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Boiler Installation</h4>
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">92% Match</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">"Full boiler installation and certification with 5-year warranty..."</p>
                            <div className="mt-3 flex gap-2">
                                <Badge variant="secondary" className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">New Service</Badge>
                                <Badge variant="secondary" className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">From $2500</Badge>
                            </div>
                        </div>
                        <div className="self-center">
                            <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                        </div>
                    </div>

                    {/* Finding Card 3 - FAQ 1 */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex gap-4 hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0">
                            <HelpCircle className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Payment Policy FAQ</h4>
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">85% Match</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">"Payment is required upon completion of work. We accept credit cards and extensive..."</p>
                            <div className="mt-3 flex gap-2">
                                <Badge variant="secondary" className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Update FAQ</Badge>
                            </div>
                        </div>
                        <div className="self-center">
                            <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                        </div>
                    </div>

                    {/* Finding Card 4 - FAQ 2 */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex gap-4 hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0">
                            <HelpCircle className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Warranty Questions</h4>
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">88% Match</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">"All boiler installations come with a default 5-year warranty, provided annual service is..."</p>
                            <div className="mt-3 flex gap-2">
                                <Badge variant="secondary" className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">New FAQ</Badge>
                            </div>
                        </div>
                        <div className="self-center">
                            <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                        </div>
                    </div>

                    {/* Finding Card 5 - Policy */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex gap-4 hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400 flex-shrink-0">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Safety Protocol: Gas Leaks</h4>
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">95% Match</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">"Immediate evacuation required if gas smell exceeds threshold. Do not use electrical switches..."</p>
                            <div className="mt-3 flex gap-2">
                                <Badge variant="secondary" className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">New Policy</Badge>
                            </div>
                        </div>
                        <div className="self-center">
                            <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- STEP 3: APPLY ---
    if (step === 3) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Apply Data</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Confirm where data should be applied.</p>
                    </div>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800">5 Items Selected</Badge>
                </div>

                <div className="space-y-3">
                    {/* Service 1 */}
                    <div className="border border-blue-200 bg-blue-50/20 dark:bg-blue-900/10 dark:border-blue-800/50 rounded-xl p-4 flex gap-4 items-start">
                        <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg flex items-center justify-center text-blue-500 dark:text-blue-400 shadow-sm flex-shrink-0">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h5 className="font-bold text-slate-900 dark:text-white text-sm">Create Service: "Emergency Gas"</h5>
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">Detected pricing (<strong className="text-slate-700 dark:text-slate-300">$180/hr</strong>) and description.</p>
                            <Button size="sm" className="h-8 bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200 shadow-none dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900/60">Review & Add</Button>
                        </div>
                    </div>

                    {/* Service 2 */}
                    <div className="border border-blue-200 bg-blue-50/20 dark:bg-blue-900/10 dark:border-blue-800/50 rounded-xl p-4 flex gap-4 items-start">
                        <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg flex items-center justify-center text-blue-500 dark:text-blue-400 shadow-sm flex-shrink-0">
                            <Wrench className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h5 className="font-bold text-slate-900 dark:text-white text-sm">Create Service: "Boiler Install"</h5>
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">Detected pricing (<strong className="text-slate-700 dark:text-slate-300">$2500+</strong>).</p>
                            <Button size="sm" className="h-8 bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200 shadow-none dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900/60">Review & Add</Button>
                        </div>
                    </div>

                    {/* Policy */}
                    <div className="border border-orange-200 bg-orange-50/30 dark:bg-orange-900/10 dark:border-orange-800/50 rounded-xl p-4 flex gap-4 items-start">
                        <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg flex items-center justify-center text-orange-500 shadow-sm flex-shrink-0">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h5 className="font-bold text-slate-900 dark:text-white text-sm">Add Policy: "Gas Safety"</h5>
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">Important safety protocol for gas leaks.</p>
                            <div className="flex gap-2">
                                <Button size="sm" className="h-8 bg-orange-100 text-orange-800 hover:bg-orange-200 border border-orange-200 shadow-none dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800 dark:hover:bg-orange-900/60">View Details</Button>
                            </div>
                        </div>
                    </div>

                    {/* Conflict Detected */}
                    <div className="border border-red-200 bg-red-50/30 dark:bg-red-900/10 dark:border-red-800/50 rounded-xl p-4 flex gap-4 items-start">
                        <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg flex items-center justify-center text-red-500 shadow-sm flex-shrink-0">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h5 className="font-bold text-slate-900 dark:text-white text-sm">Conflict Detected</h5>
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">Doc says <strong className="text-slate-800 dark:text-slate-200">$150 call-out</strong>, but "General Plumbing" service is set to <strong className="text-slate-800 dark:text-slate-200">$99</strong>.</p>
                            <div className="flex gap-2">
                                <Button size="sm" className="h-8 bg-red-100 text-red-800 hover:bg-red-200 border border-red-200 shadow-none dark:bg-red-900/40 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/60">Overwrite Old Price</Button>
                                <Button size="sm" variant="ghost" className="h-8 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">Ignore</Button>
                            </div>
                        </div>
                    </div>

                    {/* FAQs Summary */}
                    <div className="border border-purple-200 bg-purple-50/30 dark:bg-purple-900/10 dark:border-purple-800/50 rounded-xl p-4 flex gap-4 items-start">
                        <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg flex items-center justify-center text-purple-500 shadow-sm flex-shrink-0">
                            <HelpCircle className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <h5 className="font-bold text-slate-900 dark:text-white text-sm">2 New FAQs Detected</h5>
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Payment Policy and Warranty Questions.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
