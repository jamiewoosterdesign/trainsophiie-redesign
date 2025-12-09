
import React, { useState } from 'react';
import { Mic, Wand2, Sparkles, X, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function WizardFormContentStaff({ step, formData, onChange }) {
    const [tooltipOpen, setTooltipOpen] = useState({});

    const toggleTooltip = (id, e) => {
        if (e) e.preventDefault();
        setTooltipOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const isError = (field) => formData.errors?.[field];

    // --- STEP 1: DETAILS ---
    if (step === 1) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className={`mb-2 flex items-center gap-2 ${isError('staffName') ? 'text-red-500' : ''}`}>
                            First Name *
                            <TooltipProvider>
                                <Tooltip delayDuration={0} open={tooltipOpen['firstName']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, firstName: open }))}>
                                    <TooltipTrigger asChild onClick={(e) => toggleTooltip('firstName', e)}>
                                        <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                        <p>The staff member's first name.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Label>
                        <Input
                            value={formData.staffName || ''}
                            onChange={(e) => {
                                onChange('staffName', e.target.value);
                                if (isError('staffName')) onChange('errors', { ...formData.errors, staffName: false });
                            }}
                            placeholder="e.g. Sarah"
                            className={isError('staffName') ? 'border-red-300 focus-visible:ring-red-200' : ''}
                        />
                        {isError('staffName') && <p className="text-xs text-red-500 mt-1">First Name is required.</p>}
                    </div>
                    <div>
                        <Label className={`mb-2 flex items-center gap-2 ${isError('staffLastName') ? 'text-red-500' : ''}`}>
                            Last Name *
                            <TooltipProvider>
                                <Tooltip delayDuration={0} open={tooltipOpen['lastName']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, lastName: open }))}>
                                    <TooltipTrigger asChild onClick={(e) => toggleTooltip('lastName', e)}>
                                        <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                        <p>The staff member's surname.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Label>
                        <Input
                            value={formData.staffLastName || ''}
                            onChange={(e) => {
                                onChange('staffLastName', e.target.value);
                                if (isError('staffLastName')) onChange('errors', { ...formData.errors, staffLastName: false });
                            }}
                            placeholder="e.g. Connor"
                            className={isError('staffLastName') ? 'border-red-300 focus-visible:ring-red-200' : ''}
                        />
                        {isError('staffLastName') && <p className="text-xs text-red-500 mt-1">Last Name is required.</p>}
                    </div>
                </div>
                <div>
                    <Label className={`mb-2 flex items-center gap-2 ${isError('staffRole') ? 'text-red-500' : ''}`}>
                        Role *
                        <TooltipProvider>
                            <Tooltip delayDuration={0} open={tooltipOpen['role']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, role: open }))}>
                                <TooltipTrigger asChild onClick={(e) => toggleTooltip('role', e)}>
                                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                    <p>The staff member's job title or position.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                    <Input
                        value={formData.staffRole || ''}
                        onChange={(e) => {
                            onChange('staffRole', e.target.value);
                            if (isError('staffRole')) onChange('errors', { ...formData.errors, staffRole: false });
                        }}
                        placeholder="e.g. Senior Manager"
                        className={isError('staffRole') ? 'border-red-300 focus-visible:ring-red-200' : ''}
                    />
                    {isError('staffRole') && <p className="text-xs text-red-500 mt-1">Role is required.</p>}
                </div>
                <div>
                    <Label className="mb-2 block">Contact</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Phone Ext..." />
                        <Input placeholder="Email..." />
                    </div>
                </div>
            </div>
        );
    }

    // --- STEP 2: RESPONSIBILITIES ---
    if (step === 2) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                    <Label className="mb-2 flex items-center gap-2">
                        Responsibilities
                        <TooltipProvider>
                            <Tooltip delayDuration={0} open={tooltipOpen['resp']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, resp: open }))}>
                                <TooltipTrigger asChild onClick={(e) => toggleTooltip('resp', e)}>
                                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                    <p>Detailed description of what this staff member manages.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                    <p className="text-xs text-slate-500 mb-2">Tell Sophiie what this person handles.</p>
                    <div className="relative">
                        <Textarea
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[120px] pb-10 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            placeholder="e.g. Handles billing disputes..."
                            value={formData.staffResp || ''}
                            onChange={(e) => onChange('staffResp', e.target.value)}
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
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/50 rounded-lg p-4 flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400 mt-0.5" />
                    <div className="text-sm text-blue-800 dark:text-blue-200"><strong>AI Tip:</strong> Be specific. Instead of "Sales", say "Residential Sales".</div>
                </div>
            </div>
        );
    }

    // --- STEP 3: ROUTING RULES ---
    if (step === 3) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <Label className="mb-2 flex items-center gap-2">
                    Transfer Conditions
                    <TooltipProvider>
                        <Tooltip delayDuration={0} open={tooltipOpen['conditions']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, conditions: open }))}>
                            <TooltipTrigger asChild onClick={(e) => toggleTooltip('conditions', e)}>
                                <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                <p>Specific keywords or scenarios when calls should be transferred here.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </Label>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                    <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase block mb-2">Keywords</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline" className="bg-white dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700">Billing Issue <X className="w-3 h-3 ml-1 cursor-pointer" /></Badge>
                        <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">+ Add</button>
                    </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div>
                        <div className="font-medium text-slate-800 dark:text-white text-sm">Escalation Point</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Route angry calls here</div>
                    </div>
                    <Switch />
                </div>
            </div>
        );
    }

    return null;
}
