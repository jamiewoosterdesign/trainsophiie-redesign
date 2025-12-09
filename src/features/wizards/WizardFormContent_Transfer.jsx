
import React, { useState } from 'react';
import { Zap, PhoneForwarded, Mic, Wand2, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { TransferRoutingSelector } from './components/TransferRoutingSelector';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function WizardFormContentTransfer({ step, formData, onChange, onSwitchMode }) {
    const [tooltipOpen, setTooltipOpen] = useState({});

    const toggleTooltip = (id, e) => {
        if (e) e.preventDefault();
        setTooltipOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const isError = (field) => formData.errors?.[field];
    // --- STEP 1: TRANSFER DETAILS ---
    if (step === 1) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                    <Label className={`mb-2 flex items-center gap-2 ${isError('transferName') ? 'text-red-500' : ''}`}>
                        Transfer Rule Name *
                        <TooltipProvider>
                            <Tooltip delayDuration={0} open={tooltipOpen['name']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, name: open }))}>
                                <TooltipTrigger asChild onClick={(e) => toggleTooltip('name', e)}>
                                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                    <p>Name this rule so you can identify it.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                    <Input
                        placeholder="e.g. Sales Inquiry"
                        value={formData.transferName || ''}
                        onChange={(e) => {
                            onChange('transferName', e.target.value);
                            if (isError('transferName')) onChange('errors', { ...formData.errors, transferName: false });
                        }}
                        className={isError('transferName') ? 'border-red-300 focus-visible:ring-red-200' : ''}
                    />
                    {isError('transferName') && <p className="text-xs text-red-500 mt-1">Rule Name is required.</p>}
                </div>
                <div>
                    <Label className="mb-3 flex items-center gap-2">
                        Transfer Type *
                        <TooltipProvider>
                            <Tooltip delayDuration={0} open={tooltipOpen['type']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, type: open }))}>
                                <TooltipTrigger asChild onClick={(e) => toggleTooltip('type', e)}>
                                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                    <p>Warm (with intro) or Cold (blind) transfer.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            onClick={() => onChange('transferType', 'warm')}
                            className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${formData.transferType === 'warm' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                        >
                            <div className="flex items-center gap-2 mb-1 text-orange-600 dark:text-orange-400">
                                <Zap className="w-4 h-4" />
                                <span className="font-semibold text-slate-800 dark:text-slate-200">Warm Transfer</span>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">AI introduces caller to agent first.</div>
                        </div>
                        <div
                            onClick={() => onChange('transferType', 'cold')}
                            className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${formData.transferType === 'cold' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                        >
                            <div className="flex items-center gap-2 mb-1 text-blue-600 dark:text-blue-400">
                                <PhoneForwarded className="w-4 h-4" />
                                <span className="font-semibold text-slate-800 dark:text-slate-200">Cold Transfer</span>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Immediate connect, no intro.</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- STEP 2: HANDOFF MESSAGE ---
    if (step === 2) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                    <Label className="mb-2 flex items-center gap-2">
                        Handoff Message (Whisper)
                        <TooltipProvider>
                            <Tooltip delayDuration={0} open={tooltipOpen['whisper']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, whisper: open }))}>
                                <TooltipTrigger asChild onClick={(e) => toggleTooltip('whisper', e)}>
                                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                    <p>What the AI says to the agent before connecting.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                    <p className="text-xs text-slate-500 mb-3">What the AI says to the agent before connecting.</p>
                    <div className="relative">
                        <Textarea
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-3 text-sm font-mono bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed min-h-[100px] pb-10"
                            value={formData.transferSummary || ''}
                            onChange={(e) => onChange('transferSummary', e.target.value)}
                        />
                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Voice Input">
                                <Mic className="w-4 h-4" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Generate with AI">
                                <Wand2 className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mr-1">Vars:</span>
                        {['{Caller Name}', '{Reason}', '{Key Details}'].map(v => (
                            <Badge key={v} variant="outline" className="bg-white dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600 hover:border-blue-300 hover:text-blue-600 cursor-pointer transition-colors">{v}</Badge>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // --- STEP 3: ROUTING LOGIC ---
    if (step === 3) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <Label className="mb-4 flex items-center gap-2">
                    Routing Logic
                    <TooltipProvider>
                        <Tooltip delayDuration={0} open={tooltipOpen['routing']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, routing: open }))}>
                            <TooltipTrigger asChild onClick={(e) => toggleTooltip('routing', e)}>
                                <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                <p>Where the call should be transferred.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </Label>
                <div className="space-y-4">
                    {/* Reused Unified Routing Component */}
                    <TransferRoutingSelector
                        type={formData.transferDestinationType || 'staff'}
                        value={formData.transferDestinationValue || ''}
                        onChangeType={(val) => onChange('transferDestinationType', val)}
                        onChangeValue={(val) => onChange('transferDestinationValue', val)}
                        onAddNew={() => onSwitchMode('staff')}
                    />

                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                        <div>
                            <div className="font-medium text-slate-800 dark:text-white text-sm">Ignore Business Hours</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Transfer even if closed (Emergency)</div>
                        </div>
                        <input type="checkbox" className="toggle-checkbox" />
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
