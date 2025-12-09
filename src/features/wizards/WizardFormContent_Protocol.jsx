
import React, { useState } from 'react';
import { ClipboardList, PhoneForwarded, Calendar, ShieldAlert, Mic, Wand2, Trash2, ScrollText, X, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { TransferRoutingSelector } from './components/TransferRoutingSelector';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function WizardFormContentProtocol({ step, formData, onChange, onSwitchMode }) {
    const [tooltipOpen, setTooltipOpen] = useState({});

    const toggleTooltip = (id, e) => {
        if (e) e.preventDefault();
        setTooltipOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const isError = (field) => formData.errors?.[field];
    // --- STEP 1: SCENARIO DETAILS ---
    if (step === 1) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                    <Label className={`mb-2 flex items-center gap-2 ${isError('scenarioName') ? 'text-red-500' : ''}`}>
                        Scenario Name *
                        <TooltipProvider>
                            <Tooltip delayDuration={0} open={tooltipOpen['name']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, name: open }))}>
                                <TooltipTrigger asChild onClick={(e) => toggleTooltip('name', e)}>
                                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                    <p>Name this scenario so you can find it later.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                    <Input
                        placeholder="e.g. Refund Request"
                        value={formData.scenarioName || ''}
                        onChange={(e) => {
                            onChange('scenarioName', e.target.value);
                            if (isError('scenarioName')) onChange('errors', { ...formData.errors, scenarioName: false });
                        }}
                        className={isError('scenarioName') ? 'border-red-300 focus-visible:ring-red-200' : ''}
                    />
                    {isError('scenarioName') && <p className="text-xs text-red-500 mt-1">Scenario Name is required.</p>}
                </div>

                <div>
                    <Label className={`mb-2 flex items-center gap-2 ${isError('protocolTrigger') ? 'text-red-500' : ''}`}>
                        Trigger Condition *
                        <TooltipProvider>
                            <Tooltip delayDuration={0} open={tooltipOpen['trigger']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, trigger: open }))}>
                                <TooltipTrigger asChild onClick={(e) => toggleTooltip('trigger', e)}>
                                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                    <p>What happens to start this protocol.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {['keyword', 'intent'].map(type => (
                            <div
                                key={type}
                                onClick={() => onChange('protocolTriggerType', type)}
                                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${formData.protocolTriggerType === type ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                            >
                                <div className="font-semibold text-slate-800 dark:text-slate-200 capitalize mb-1">{type === 'keyword' ? 'Specific Keywords' : 'Customer Intent'}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{type === 'keyword' ? 'Exact phrases (e.g. "Refund")' : 'Vague goals (e.g. Wants a job)'}</div>
                            </div>
                        ))}
                    </div>
                    <Input
                        placeholder={formData.protocolTriggerType === 'keyword' ? "Enter keywords..." : "Describe user goal..."}
                        value={formData.protocolTrigger || ''}
                        onChange={(e) => {
                            onChange('protocolTrigger', e.target.value);
                            if (isError('protocolTrigger')) onChange('errors', { ...formData.errors, protocolTrigger: false });
                        }}
                        className={isError('protocolTrigger') ? 'border-red-300 focus-visible:ring-red-200' : ''}
                    />
                    {isError('protocolTrigger') && <p className="text-xs text-red-500 mt-1">Trigger Condition is required.</p>}
                </div>
            </div>
        );
    }

    // --- STEP 2: ACTION LOGIC ---
    if (step === 2) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                    <Label className="mb-4 flex items-center gap-2">
                        Response Logic
                        <TooltipProvider>
                            <Tooltip delayDuration={0} open={tooltipOpen['logic']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, logic: open }))}>
                                <TooltipTrigger asChild onClick={(e) => toggleTooltip('logic', e)}>
                                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                    <p>How Sophiie should respond.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {[
                            { id: 'collect', label: 'Collect Info', icon: ClipboardList, color: 'text-orange-500' },
                            { id: 'transfer', label: 'Transfer', icon: PhoneForwarded, color: 'text-blue-500' },
                            { id: 'book', label: 'Booking', icon: Calendar, color: 'text-purple-500' },
                            { id: 'refuse', label: 'Refuse', icon: ShieldAlert, color: 'text-red-500' },
                        ].map(opt => (
                            <div
                                key={opt.id}
                                onClick={() => onChange('protocolAction', opt.id)}
                                className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center text-center transition-all ${formData.protocolAction === opt.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                            >
                                <div className={`w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center mb-2 shadow-sm ${opt.color}`}>
                                    <opt.icon className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-semibold capitalize text-slate-900 dark:text-slate-200">{opt.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conditional UI based on Action */}

                {/* Transfer Routing */}
                {formData.protocolAction === 'transfer' && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 animate-in fade-in">
                        <Label className="mb-2 block">Routing</Label>
                        <TransferRoutingSelector
                            type={formData.protocolDestinationType || 'staff'}
                            value={formData.protocolDestinationValue || ''}
                            onChangeType={(val) => onChange('protocolDestinationType', val)}
                            onChangeValue={(val) => onChange('protocolDestinationValue', val)}
                            onAddNew={() => onSwitchMode('staff')}
                        />
                    </div>
                )}

                {/* Book UI */}
                {formData.protocolAction === 'book' && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800 flex items-center gap-3 animate-in fade-in">
                        <div className="w-10 h-10 bg-white dark:bg-purple-800/50 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 shadow-sm">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-purple-900 dark:text-purple-100">Calendar Active</h4>
                            <p className="text-xs text-purple-700 dark:text-purple-300">Bookings will be added to <strong>Main Calendar (Synced)</strong>.</p>
                        </div>
                    </div>
                )}

                {/* Script Editor & Questions */}
                {(formData.protocolAction === 'script' || formData.protocolAction === 'collect') && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
                            <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase block mb-2">{formData.protocolAction === 'collect' ? 'Data Collection Script' : 'Response Script'}</Label>
                            <div className="relative">
                                <Textarea
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none pb-10 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                    rows={3}
                                    placeholder={formData.protocolAction === 'collect' ? "e.g. I need to take down some details first..." : "e.g. We do not offer refunds on sale items..."}
                                    value={formData.protocolScript || ''}
                                    onChange={(e) => onChange('protocolScript', e.target.value)}
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

                        {/* Reusing Questions Logic */}
                        <div>
                            <Label className="mb-2 block">Follow-up Questions</Label>
                            <div className="space-y-2 mb-3">
                                {formData.questions && formData.questions.length > 0 ? (
                                    formData.questions.map((q, i) => (
                                        <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm flex justify-between group">
                                            <span>{q.text || q}</span>
                                            <Trash2 className="w-4 h-4 text-slate-300 cursor-pointer hover:text-red-500" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-sm flex justify-between group">
                                        <span className="text-slate-800 dark:text-slate-200">Could you please provide the order number?</span>
                                        <Trash2 className="w-4 h-4 text-slate-300 cursor-pointer group-hover:text-red-500" />
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Input placeholder="Add a question..." className="h-9" />
                                <Button size="sm" variant="secondary">Add</Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Refusal Script */}
                {formData.protocolAction === 'refuse' && (
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200 animate-in fade-in">
                        <Label className="text-xs text-red-800 uppercase block mb-2">Polite Refusal Script</Label>
                        <div className="relative">
                            <Textarea
                                className="w-full rounded-lg border border-red-200 p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white pb-10"
                                rows={3}
                                placeholder="e.g. I apologize, but we are unable to process that request due to company policy."
                                value={formData.protocolScript || ''}
                                onChange={(e) => onChange('protocolScript', e.target.value)}
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
                )}
            </div>
        );
    }

    // --- STEP 3: SUMMARY ---
    if (step === 3) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ScrollText className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Scenario Summary</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Review the logic before activating.</p>
                </div>

                <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-slate-800">
                    <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-700 pb-3">
                        <Badge variant="outline" className="dark:text-white dark:border-slate-600">IF</Badge>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            User {formData.protocolTriggerType === 'intent' ? 'intends to' : 'says keyword'}:
                            <strong> "{formData.protocolTrigger || '...'}"</strong>
                        </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-700 pb-3">
                        <Badge variant="outline" className="dark:text-white dark:border-slate-600">THEN</Badge>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 capitalize">
                            Action: <strong>{formData.protocolAction}</strong>
                        </span>
                    </div>

                    {formData.protocolAction === 'transfer' && (
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="dark:text-white dark:border-slate-600">TO</Badge>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                Routing: <strong>{formData.protocolDestinationValue || 'Selected Team'}</strong>
                            </span>
                        </div>
                    )}

                    {(formData.protocolAction === 'script' || formData.protocolAction === 'collect') && (
                        <div className="flex items-start gap-2">
                            <Badge variant="outline" className="dark:text-white dark:border-slate-600">AND</Badge>
                            <div className="flex-1">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1">Ask Questions:</span>
                                <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400">
                                    {formData.questions && formData.questions.length > 0 ? formData.questions.map((q, i) => <li key={i}>{q.text || q}</li>) : <li>Default Questions</li>}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return null;
}
