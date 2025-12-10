
import React, { useState } from 'react';
import { Sparkles, FileCheck, X, Mic, Wand2, Info, ClipboardList, PhoneForwarded, Calendar, Mail, ShieldAlert, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { WizardAutoFillBanner } from './components/WizardAutoFillBanner';
import { WizardField } from './components/WizardField';
import { TransferRoutingSelector } from './components/TransferRoutingSelector';
import QuestionRulesEditorComponent from './QuestionRulesEditor';

export default function WizardFormContentService({ mode, step, formData, onChange, activeField, onSwitchMode }) {
    const [tooltipOpen, setTooltipOpen] = useState({});
    const [showGlobalDefaultModal, setShowGlobalDefaultModal] = useState(false);

    const toggleTooltip = (id, e) => {
        if (e) e.preventDefault();
        setTooltipOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const isError = (field) => formData.errors?.[field];

    // Ensure global message is initialized
    // In a real app, this might come from global settings

    // --- STEP 1: SERVICE DETAILS ---
    if (step === 1) {
        const showAutoFillBanner = formData.serviceName && (formData.serviceName.toLowerCase().includes('heater') || formData.serviceName.toLowerCase().includes('hot water')) && !formData.isContextActive && !formData.autoFillDismissed;

        return (
            <div className="space-y-6 pb-32 md:pb-0 animate-in fade-in slide-in-from-right-4 duration-300 relative">


                <div>
                    <Label className={`mb-1.5 flex items-center gap-2 ${isError('serviceName') ? 'text-red-500' : ''}`}>
                        Service Name *
                        <TooltipProvider>
                            <Tooltip delayDuration={0} open={tooltipOpen['serviceName']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, serviceName: open }))}>
                                <TooltipTrigger asChild onClick={(e) => toggleTooltip('serviceName', e)}>
                                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                    <p>The name of the service as clearly understood by customers.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                    <Input
                        placeholder="e.g., Hot Water System"
                        value={formData.serviceName || ''}
                        onChange={(e) => {
                            onChange('serviceName', e.target.value);
                            if (isError('serviceName')) onChange('errors', { ...formData.errors, serviceName: false });
                        }}
                        highlight={(activeField === 'serviceName').toString()}
                        className={isError('serviceName') ? 'border-red-300 focus-visible:ring-red-200' : ''}
                    />
                    {isError('serviceName') && <p className="text-xs text-red-500 mt-1">Service Name is required.</p>}
                </div>

                <div>
                    {/* Knowledge Found Banner */}
                    {showAutoFillBanner && (
                        <WizardAutoFillBanner
                            type="suggestion"
                            theme="emerald"
                            title="Knowledge Found"
                            description={
                                <>I found pricing and details for "Heater" in your <strong>SOP_Manual.pdf</strong>. Want me to auto-fill this?</>
                            }
                            onAutoFill={() => {
                                onChange('isContextActive', true);
                                onChange('contextFileName', 'SOP_Manual.pdf');
                                onChange('description', "Professional heater diagnosis and repair. We check gas/electric connections, pilot lights, and thermostats.");
                                onChange('price', "180.00");
                                onChange('priceMode', 'hourly');
                                onChange('durationValue', "60");
                                onChange('durationUnit', "minutes");
                                onChange('callOutFee', "50.00");
                                onChange('plusGst', true);
                                onChange('plusMaterials', true);
                                onChange('questions', [
                                    { id: '1', text: "Is the area easily accessible?", options: [], isAutoGenerated: true },
                                    { id: '2', text: "How old is the current unit?", options: [], isAutoGenerated: true },
                                    { id: '3', text: "Is it gas or electric?", options: [], isAutoGenerated: true }
                                ]);
                                onChange('autoFilledFields', { description: true, price: true, priceMode: true, duration: true, callOutFee: true, plusGst: true, plusMaterials: true });
                                onChange('serviceOutcome', 'collect');
                                onChange('serviceClosingScript', "e.g. I'll take your details and have someone from the team call you back shortly.");
                                onChange('errors', {});
                            }}
                            onDismiss={() => onChange('autoFillDismissed', true)}
                        />
                    )}

                    {/* Context Active Banner Overlay */}
                    {formData.isContextActive && (
                        <WizardAutoFillBanner
                            type="active"
                            theme="emerald"
                            fileName={formData.contextFileName}
                            onRemoveContext={() => {
                                onChange('isContextActive', false);
                                onChange('contextFileName', '');
                                onChange('description', '');
                                onChange('price', '');
                                onChange('durationValue', '');
                                onChange('callOutFee', '');
                                onChange('plusGst', false);
                                onChange('plusMaterials', false);
                                onChange('questions', []);
                                onChange('autoFilledFields', {});
                            }}
                        />
                    )}

                    <div className="flex justify-between items-center mb-1.5">
                        <Label className={`flex items-center gap-2 ${isError('description') ? 'text-red-500' : ''}`}>
                            Description *
                            <TooltipProvider>
                                <Tooltip delayDuration={0} open={tooltipOpen['description']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, description: open }))}>
                                    <TooltipTrigger asChild onClick={(e) => toggleTooltip('description', e)}>
                                        <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                        <p>A detailed explanation of what the service includes.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Label>
                        {formData.autoFilledFields?.description && (
                            <div className="flex items-center gap-1.5 text-emerald-600 animate-in fade-in bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md shadow-sm border border-emerald-100 dark:border-emerald-900/50">
                                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">AI Auto-filled</span>
                                <Sparkles className="w-3 h-3" />
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <Textarea
                            placeholder="Describe what this service entails..."
                            className={`min-h-[120px] pb-10 resize-y transition-all duration-500 ${formData.autoFilledFields?.description && activeField !== 'description' ? 'border-emerald-400 ring-1 ring-emerald-100 bg-emerald-50/10' : ''} ${isError('description') ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                            value={formData.description || ''}
                            onChange={(e) => {
                                onChange('description', e.target.value);
                                if (formData.autoFilledFields?.description) {
                                    onChange('autoFilledFields', { ...formData.autoFilledFields, description: false });
                                }
                                if (isError('description')) onChange('errors', { ...formData.errors, description: false });
                            }}
                            highlight={(activeField === 'description').toString()}
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
                    {isError('description') && <p className="text-xs text-red-500 mt-1">Description is required for the AI to understand the service.</p>}
                </div>

                {/* Estimated Duration */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <Label className="flex items-center gap-2">
                            Estimated Duration
                            <TooltipProvider>
                                <Tooltip delayDuration={0} open={tooltipOpen['duration']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, duration: open }))}>
                                    <TooltipTrigger asChild onClick={(e) => toggleTooltip('duration', e)}>
                                        <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                        <p>The typical time required to complete this service.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Label>
                        {formData.autoFilledFields?.duration && (
                            <div className="flex items-center gap-1.5 text-emerald-600 animate-in fade-in bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md shadow-sm border border-emerald-100 dark:border-emerald-900/50">
                                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">AI Auto-filled</span>
                                <Sparkles className="w-3 h-3" />
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={formData.durationValue || ''}
                                onChange={(e) => {
                                    onChange('durationValue', e.target.value);
                                    if (formData.autoFilledFields?.duration) {
                                        onChange('autoFilledFields', { ...formData.autoFilledFields, duration: false });
                                    }
                                }}
                                className={`transition-all duration-500 ${formData.autoFilledFields?.duration && activeField !== 'durationValue' ? 'border-emerald-400 ring-1 ring-emerald-100 bg-emerald-50/10' : ''}`}
                            />
                        </div>
                        <div className="w-[140px]">
                            <Select
                                value={formData.durationUnit || 'minutes'}
                                onValueChange={(val) => {
                                    onChange('durationUnit', val);
                                    if (formData.autoFilledFields?.duration) {
                                        onChange('autoFilledFields', { ...formData.autoFilledFields, duration: false });
                                    }
                                }}
                            >
                                <SelectTrigger className={formData.autoFilledFields?.duration ? 'border-emerald-400 ring-1 ring-emerald-100 bg-emerald-50/10' : ''}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="minutes">Minutes</SelectItem>
                                    <SelectItem value="hours">Hours</SelectItem>
                                    <SelectItem value="days">Days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div>
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                        <Label className="flex items-center gap-2">
                            Pricing Mode *
                            <TooltipProvider>
                                <Tooltip delayDuration={0} open={tooltipOpen['priceMode']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, priceMode: open }))}>
                                    <TooltipTrigger asChild onClick={(e) => toggleTooltip('priceMode', e)}>
                                        <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                        <p>How you charge for this service.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Label>
                        {formData.autoFilledFields?.priceMode && (
                            <div className="flex items-center gap-1.5 text-emerald-600 animate-in fade-in bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md shadow-sm border border-emerald-100 dark:border-emerald-900/50">
                                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">AI Auto-filled</span>
                                <Sparkles className="w-3 h-3" />
                            </div>
                        )}
                    </div>
                    <div className={`flex gap-2 mb-4 overflow-x-auto pb-2 p-1 -mx-1 ${formData.autoFilledFields?.priceMode ? 'bg-emerald-50/30 dark:bg-emerald-900/10 rounded-xl' : ''}`}>
                        {['fixed', 'hourly', 'range', 'na'].map(m => (
                            <div key={m}
                                onClick={() => {
                                    onChange('priceMode', m);
                                    if (formData.autoFilledFields?.priceMode) {
                                        onChange('autoFilledFields', { ...formData.autoFilledFields, priceMode: false });
                                    }
                                }}
                                className={`border rounded-full px-4 py-2 cursor-pointer whitespace-nowrap text-sm transition-all ${formData.priceMode === m ? (formData.autoFilledFields?.priceMode ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-medium ring-1 ring-emerald-500' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400 font-medium ring-1 ring-blue-500') : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
                            >
                                {m === 'fixed' ? 'Fixed' : m === 'hourly' ? 'Hourly' : m === 'range' ? 'Range' : 'Not Applicable'}
                            </div>
                        ))}
                    </div>

                    {formData.priceMode !== 'na' ? (
                        <div className="animate-in fade-in">
                            {formData.priceMode === 'range' ? (
                                <div className="flex gap-4">
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                                        <Input
                                            className={`pl-7 transition-all duration-500 ${formData.autoFilledFields?.price && activeField !== 'minPrice' ? 'border-emerald-400 ring-1 ring-emerald-100 bg-emerald-50/10' : ''} ${isError('price') ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                                            placeholder="Min"
                                            value={formData.minPrice || ''}
                                            onChange={(e) => {
                                                onChange('minPrice', e.target.value);
                                                // Update main price field for validation simplifiction if needed, or handle separately
                                                if (formData.autoFilledFields?.price) {
                                                    onChange('autoFilledFields', { ...formData.autoFilledFields, price: false });
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center text-slate-400">-</div>
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                                        <Input
                                            className={`pl-7 transition-all duration-500 ${formData.autoFilledFields?.price ? 'border-emerald-400 ring-1 ring-emerald-100 bg-emerald-50/10' : ''}`}
                                            placeholder="Max"
                                            value={formData.maxPrice || ''}
                                            onChange={(e) => {
                                                onChange('maxPrice', e.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                                    <Input
                                        className={`pl-7 transition-all duration-500 ${formData.autoFilledFields?.price && activeField !== 'price' ? 'border-emerald-400 ring-1 ring-emerald-100 bg-emerald-50/10' : ''} ${isError('price') ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                                        placeholder="0.00"
                                        value={formData.price || ''}
                                        onChange={(e) => {
                                            onChange('price', e.target.value);
                                            if (formData.autoFilledFields?.price) {
                                                onChange('autoFilledFields', { ...formData.autoFilledFields, price: false });
                                            }
                                            if (isError('price')) onChange('errors', { ...formData.errors, price: false });
                                        }}
                                    />
                                    {isError('price') && <p className="text-xs text-red-500 mt-1">Price is required.</p>}
                                </div>
                            )}

                            {formData.priceMode === 'hourly' && (
                                <div className="mt-4 space-y-4">
                                    <div className="animate-in fade-in slide-in-from-top-1">
                                        <Input
                                            placeholder="Add call out fee (optional)"
                                            className={`transition-all duration-500 ${formData.autoFilledFields?.callOutFee ? 'border-emerald-400 ring-1 ring-emerald-100 bg-emerald-50/10' : ''}`}
                                            value={formData.callOutFee || ''}
                                            onChange={(e) => {
                                                onChange('callOutFee', e.target.value);
                                                if (formData.autoFilledFields?.callOutFee) {
                                                    onChange('autoFilledFields', { ...formData.autoFilledFields, callOutFee: false });
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="flex gap-6 pt-1">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="plus-gst"
                                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                checked={formData.plusGst || false}
                                                onChange={(e) => {
                                                    onChange('plusGst', e.target.checked);
                                                    if (formData.autoFilledFields?.plusGst) {
                                                        onChange('autoFilledFields', { ...formData.autoFilledFields, plusGst: false });
                                                    }
                                                }}
                                            />
                                            <label
                                                htmlFor="plus-gst"
                                                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer ${formData.autoFilledFields?.plusGst ? 'text-emerald-700 font-bold' : 'text-slate-700 dark:text-slate-200'}`}
                                            >
                                                Plus GST
                                            </label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="plus-materials"
                                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                checked={formData.plusMaterials || false}
                                                onChange={(e) => {
                                                    onChange('plusMaterials', e.target.checked);
                                                    if (formData.autoFilledFields?.plusMaterials) {
                                                        onChange('autoFilledFields', { ...formData.autoFilledFields, plusMaterials: false });
                                                    }
                                                }}
                                            />
                                            <label
                                                htmlFor="plus-materials"
                                                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer ${formData.autoFilledFields?.plusMaterials ? 'text-emerald-700 font-bold' : 'text-slate-700 dark:text-slate-200'}`}
                                            >
                                                Plus materials
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="animate-in fade-in space-y-4 pt-2">
                            {/* Global Default Message Section */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                    <Info className="w-4 h-4" />
                                    <span className="text-sm font-medium">Using global default message</span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-xs bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                                    onClick={() => setShowGlobalDefaultModal(true)}
                                >
                                    Edit Global Default
                                </Button>
                            </div>

                            {/* Read-only Default Message Display */}
                            <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400 italic text-sm">
                                {formData.globalDefaultPriceMessage || "No default message set"}
                            </div>

                            {/* Custom Message Toggle */}
                            <div className="pt-2">
                                <div className="flex items-center gap-3 mb-4">
                                    <Switch
                                        id="use-custom-message"
                                        checked={formData.useCustomPriceMessage || false}
                                        onCheckedChange={(checked) => onChange('useCustomPriceMessage', checked)}
                                    />
                                    <Label htmlFor="use-custom-message" className="cursor-pointer font-medium text-slate-900 dark:text-slate-200">
                                        Use custom message response for this service
                                    </Label>
                                </div>

                                {/* Custom Message Input */}
                                {formData.useCustomPriceMessage && (
                                    <div className="animate-in fade-in slide-in-from-top-2">
                                        <Label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-200">
                                            Custom Message
                                            <TooltipProvider>
                                                <Tooltip delayDuration={0} open={tooltipOpen['customPrice']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, customPrice: open }))}>
                                                    <TooltipTrigger asChild onClick={(e) => toggleTooltip('customPrice', e)}>
                                                        <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                                        <p>A specific message to read out when this service's price is requested.</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </Label>
                                        <div className="relative">
                                            <Textarea
                                                value={formData.customPriceMessage || ""}
                                                onChange={(e) => onChange('customPriceMessage', e.target.value)}
                                                className="pr-10 min-h-[100px] resize-y"
                                                placeholder="Enter pricing explanation or terms (e.g., 'Quote on request', 'Contact for pricing', etc.)"
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

                            {/* Edit Global Default Modal */}
                            {showGlobalDefaultModal && (
                                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200">
                                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-[500px] max-w-[95vw] p-6 animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Edit Global Default Message</h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">This message will be used for all services with "Not Applicable" pricing that don't have a custom message.</p>
                                            </div>
                                            <button onClick={() => setShowGlobalDefaultModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="relative mb-6">
                                            <Textarea
                                                value={formData.globalDefaultPriceMessage || ""}
                                                onChange={(e) => onChange('globalDefaultPriceMessage', e.target.value)}
                                                className="min-h-[120px] resize-y text-base"
                                                placeholder="Enter pricing explanation or terms (e.g., 'Quote on request', 'Contact for pricing', etc.)"
                                                autoFocus
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

                                        <div className="flex justify-end gap-3">
                                            <Button variant="outline" onClick={() => setShowGlobalDefaultModal(false)} className="bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700">Cancel</Button>
                                            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowGlobalDefaultModal(false)}>Save Changes</Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- STEP 2: CONVERSATION FLOW ---
    if (step === 2) {
        return (
            <div className="space-y-8 pb-32 md:pb-0 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* AI Response Section */}
                <div>
                    <Label className="mb-1.5 flex items-center gap-2">
                        AI Response
                        <TooltipProvider>
                            <Tooltip delayDuration={0} open={tooltipOpen['aiResponse']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, aiResponse: open }))}>
                                <TooltipTrigger asChild onClick={(e) => toggleTooltip('aiResponse', e)}>
                                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                    <p>How Sophiie should boldy introduce the conversation flow.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                    <div className="relative">
                        <Textarea
                            placeholder="Sure, I can help with that."
                            className="min-h-[80px] pb-8 resize-y"
                            value={formData.aiResponse || ''}
                            onChange={(e) => onChange('aiResponse', e.target.value)}
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

                {/* Question Rules Section */}
                <div>
                    <QuestionRulesEditorComponent
                        questions={formData.questions || []}
                        onChange={(newQuestions) => onChange('questions', newQuestions)}
                    />
                </div>
            </div>
        );
    }

    // --- STEP 3: OUTCOME ---
    if (step === 3) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <Label className="block">Outcome</Label>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {[
                            { id: 'collect', label: 'Collect Info', icon: ClipboardList, color: 'text-orange-500' },
                            { id: 'transfer', label: 'Transfer', icon: PhoneForwarded, color: 'text-blue-500' },
                            { id: 'booking', label: 'Booking', icon: Calendar, color: 'text-purple-500' },
                            { id: 'send_info', label: 'Send Info', icon: Mail, color: 'text-green-500' }
                        ].map(opt => (
                            <div key={opt.id}
                                onClick={() => onChange('serviceOutcome', opt.id)}
                                className={`cursor-pointer h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${formData.serviceOutcome === opt.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                <div className={`mb-2 ${formData.serviceOutcome === opt.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                    <opt.icon className={`w-6 h-6 ${formData.serviceOutcome === opt.id ? 'text-blue-600 dark:text-blue-400' : opt.color}`} />
                                </div>
                                <div className={`font-semibold text-sm ${formData.serviceOutcome === opt.id ? 'text-blue-900 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>{opt.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Conditional Configuration */}
                    <div className="animate-in fade-in">
                        {formData.serviceOutcome === 'collect' && (
                            <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
                                <div>
                                    <Label className="mb-1.5 flex items-center gap-2 text-xs uppercase text-slate-500 dark:text-slate-400">
                                        Closing Script (Optional)
                                        <TooltipProvider>
                                            <Tooltip delayDuration={0} open={tooltipOpen['closingScript']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, closingScript: open }))}>
                                                <TooltipTrigger asChild onClick={(e) => toggleTooltip('closingScript', e)}>
                                                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                                    <p>What Sophiie should say before ending the interaction.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </Label>
                                    <div className="relative">
                                        <Textarea
                                            placeholder="e.g. I'll take your details and have someone from the team call you back shortly."
                                            className="min-h-[80px] pb-10 text-sm bg-white dark:bg-slate-800"
                                            value={formData.serviceClosingScript || ''}
                                            onChange={(e) => onChange('serviceClosingScript', e.target.value)}
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
                                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                        <HelpCircle className="w-3 h-3" /> Sophiie will automatically ask for name & contact details.
                                    </p>
                                </div>
                            </div>
                        )}

                        {formData.serviceOutcome === 'transfer' && (
                            <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
                                <div>
                                    <Label className="mb-1.5 flex items-center gap-2 text-xs uppercase text-slate-500 dark:text-slate-400">
                                        Destination
                                        <TooltipProvider>
                                            <Tooltip delayDuration={0} open={tooltipOpen['destination']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, destination: open }))}>
                                                <TooltipTrigger asChild onClick={(e) => toggleTooltip('destination', e)}>
                                                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                                    <p>Who or where to transfer the call to.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </Label>
                                    <TransferRoutingSelector
                                        type={formData.serviceDestinationType || 'staff'}
                                        value={formData.serviceDestinationValue || ''}
                                        onChangeType={(t) => onChange('serviceDestinationType', t)}
                                        onChangeValue={(v) => onChange('serviceDestinationValue', v)}
                                        onAddNew={() => onSwitchMode('staff')}
                                    />
                                </div>
                            </div>
                        )}

                        {formData.serviceOutcome === 'booking' && (
                            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-6 flex items-center gap-4">
                                <div className="w-12 h-12 bg-white dark:bg-purple-800/50 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 shadow-sm flex-shrink-0">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-purple-900 dark:text-purple-100 text-base">Calendar Active</h4>
                                    <p className="text-sm text-purple-700 dark:text-purple-300">Bookings will be added to <strong>Main Calendar (Synced)</strong>.</p>
                                </div>
                            </div>
                        )}

                        {formData.serviceOutcome === 'send_info' && (
                            <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
                                {/* Tabs for SMS / Email */}
                                <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex mb-4">
                                    <button
                                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${formData.serviceSendInfoType === 'sms' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                                        onClick={() => onChange('serviceSendInfoType', 'sms')}
                                    >
                                        SMS
                                    </button>
                                    <button
                                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${formData.serviceSendInfoType === 'email' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                                        onClick={() => onChange('serviceSendInfoType', 'email')}
                                    >
                                        Email
                                    </button>
                                </div>

                                {formData.serviceSendInfoType === 'sms' && (
                                    <div className="animate-in fade-in space-y-4 pt-2">
                                        <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg flex gap-3 border border-blue-100 dark:border-blue-900/50">
                                            <div className="text-blue-500 dark:text-blue-400 mt-0.5"><ShieldAlert className="w-4 h-4" /></div>
                                            <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                                                This action only works for <strong>phone calls</strong>. For chatbot and web calls, it will automatically fallback to "Continue Call".
                                            </p>
                                        </div>

                                        <div>
                                            <Label className="mb-1.5 block text-xs uppercase text-slate-500 dark:text-slate-400">SMS Message</Label>
                                            <Textarea
                                                placeholder="e.g. Thanks for calling! Here is the info you requested..."
                                                className="min-h-[80px]"
                                                value={formData.serviceSmsMessage || ''}
                                                onChange={(e) => onChange('serviceSmsMessage', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                {formData.serviceSendInfoType === 'email' && (
                                    <div className="animate-in fade-in space-y-4 pt-2">
                                        <div>
                                            <Label className="mb-1.5 block text-xs uppercase text-slate-500 dark:text-slate-400">Subject Line</Label>
                                            <Input
                                                placeholder="e.g. Information about [Service Name]"
                                                value={formData.serviceEmailSubject || ''}
                                                onChange={(e) => onChange('serviceEmailSubject', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="mb-1.5 block text-xs uppercase text-slate-500 dark:text-slate-400">Email Body</Label>
                                            <Textarea
                                                placeholder="Hi there, thanks for your interest..."
                                                className="min-h-[120px]"
                                                value={formData.serviceEmailBody || ''}
                                                onChange={(e) => onChange('serviceEmailBody', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
