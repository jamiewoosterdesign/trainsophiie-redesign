import React from 'react';

import { UploadCloud, Plus, Trash2, HelpCircle, ClipboardList, PhoneForwarded, Calendar, Mail, Sparkles, X, ShieldAlert, ScrollText, Zap, Loader2, FileCheck, Book, Shield, AlertTriangle, Wand2, Mic, Settings, Search, Filter, Info, Wrench } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import QuestionRulesEditorComponent from './QuestionRulesEditor';
import WizardFormContentDepartment from './WizardFormContent_Department';
export default function WizardFormContent({ mode, step, formData, onChange, activeField }) {

    // Unified State
    const [isLoading, setIsLoading] = React.useState(false);
    const [uploadStatus, setUploadStatus] = React.useState('idle'); // idle, uploading, processing, done

    // Mobile Tooltip State
    const [tooltipOpen, setTooltipOpen] = React.useState({});
    const toggleTooltip = (id, e) => {
        e.preventDefault();
        setTooltipOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };
    const [showGlobalDefaultModal, setShowGlobalDefaultModal] = React.useState(false);

    // --- FAQ WIZARD ---
    if (mode === 'faq') {


        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 relative">

                {/* Knowledge Found Banner */}
                {formData.isContextActive && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-4 flex gap-4 animate-in slide-in-from-top-2">
                        <div className="w-10 h-10 bg-white dark:bg-purple-800/50 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-300 shadow-sm flex-shrink-0">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-purple-900 dark:text-purple-100 text-sm">Knowledge Extracted</h4>
                            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1 mb-3">I've extracted the FAQ details from <strong>{formData.contextFileName}</strong>.</p>
                            <div className="flex gap-3 items-center">
                                <button
                                    onClick={() => {
                                        onChange('isContextActive', false);
                                        onChange('contextFileName', '');
                                        onChange('faqQuestion', '');
                                        onChange('faqAnswer', '');
                                    }}
                                    className="text-xs text-purple-500 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-200 font-medium"
                                >
                                    Clear & Start Over
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <Label className="mb-1.5 block">Question</Label>
                    <Input
                        placeholder="e.g., What are your opening hours?"
                        value={formData.faqQuestion}
                        onChange={(e) => onChange('faqQuestion', e.target.value)}
                        highlight={(activeField === 'faqQuestion').toString()}
                    />
                </div>



                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <Label className="block">Answer</Label>
                    </div>
                    <div className="relative">
                        <Textarea
                            placeholder="Write the answer here..."
                            className={`min-h-[200px] pb-10 resize-y transition-all duration-500 ${formData.isContextActive ? 'border-emerald-400 ring-1 ring-emerald-100 bg-emerald-50/10' : ''}`}
                            value={formData.faqAnswer}
                            onChange={(e) => onChange('faqAnswer', e.target.value)}
                            highlight={(activeField === 'faqAnswer').toString()}
                        />
                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                                            <Mic className="w-4 h-4" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                        <p>Voice Input</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                                            <Wand2 className="w-4 h-4" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                        <p>Generate with AI</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- POLICY WIZARD ---
    if (mode === 'policy') {


        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 relative">

                {/* Knowledge Found Banner */}
                {formData.isContextActive && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-4 flex gap-4 animate-in slide-in-from-top-2">
                        <div className="w-10 h-10 bg-white dark:bg-purple-800/50 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-300 shadow-sm flex-shrink-0">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-purple-900 dark:text-purple-100 text-sm">Knowledge Extracted</h4>
                            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1 mb-3">I've extracted the policy details from <strong>{formData.contextFileName}</strong>.</p>
                            <div className="flex gap-3 items-center">
                                <button
                                    onClick={() => {
                                        onChange('isContextActive', false);
                                        onChange('contextFileName', '');
                                        onChange('policyContent', '');
                                    }}
                                    className="text-xs text-purple-500 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-200 font-medium"
                                >
                                    Clear & Start Over
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <Label className="mb-1.5 block">Policy Title</Label>
                    <Input
                        placeholder="e.g., Annual Leave Policy"
                        value={formData.policyName}
                        onChange={(e) => onChange('policyName', e.target.value)}
                        highlight={(activeField === 'policyName').toString()}
                    />
                </div>



                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <Label className="block">Policy Content</Label>
                    </div>
                    <div className="relative">
                        <Textarea
                            placeholder="Write your policy details here..."
                            className={`min-h-[200px] pb-10 resize-y transition-all duration-500 ${formData.isContextActive ? 'border-emerald-400 ring-1 ring-emerald-100 bg-emerald-50/10' : ''}`}
                            value={formData.policyContent}
                            onChange={(e) => onChange('policyContent', e.target.value)}
                            highlight={(activeField === 'policyContent').toString()}
                        />
                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                                            <Mic className="w-4 h-4" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                        <p>Voice Input</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                                            <Wand2 className="w-4 h-4" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                        <p>Generate with AI</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- DEPARTMENT WIZARD ---
    if (mode === 'department') {
        return (
            <WizardFormContentDepartment
                mode={mode}
                step={step}
                formData={formData}
                onChange={onChange}
                activeField={activeField}
            />
        );
    }

    // --- SERVICE WIZARD ---
    // --- PRODUCT WIZARD ---
    if (mode === 'product') {


        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 relative pb-32 md:pb-0">

                {/* 1. Product Name (Moved to Top) */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <Label className="block">Product Name *</Label>
                        {formData.autoFilledFields?.productName && (
                            <div className="flex items-center gap-1.5 text-emerald-600 animate-in fade-in">
                                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">AI Auto-filled</span>
                                <Sparkles className="w-3 h-3" />
                            </div>
                        )}
                    </div>
                    <Input
                        placeholder="e.g., Solar Panel"
                        value={formData.productName || ''}
                        onChange={(e) => {
                            onChange('productName', e.target.value);
                            if (formData.autoFilledFields?.productName) {
                                onChange('autoFilledFields', { ...formData.autoFilledFields, productName: false });
                            }
                        }}
                        highlight={(activeField === 'productName')?.toString()}
                        className={`transition-all duration-500 ${formData.autoFilledFields?.productName ? 'border-emerald-400 ring-1 ring-emerald-100 bg-emerald-50/10' : ''}`}
                    />
                </div>

                {/* Knowledge Found Banner (Displayed if Active) */}
                {formData.isContextActive && (
                    <div className="bg-emerald-50/95 dark:bg-emerald-900/20 backdrop-blur-sm flex items-center justify-between px-4 py-3 rounded-xl border border-emerald-100 dark:border-emerald-800 animate-in fade-in zoom-in-95 duration-300 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white dark:bg-emerald-800/50 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                                <FileCheck className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-emerald-900 dark:text-emerald-100">Active Context</div>
                                <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">{formData.contextFileName}</div>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange('isContextActive', false);
                                onChange('contextFileName', '');
                                onChange('productName', '');
                                onChange('description', '');
                                onChange('productPrice', '');
                                onChange('priceMode', 'fixed');
                                onChange('autoFilledFields', {});
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:text-emerald-900 dark:hover:text-emerald-200 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                            Remove Context
                        </button>
                    </div>
                )}



                {/* 3. Pricing Section (Stacked) */}
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
                                        <p>How you charge for this product.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Label>
                        {formData.autoFilledFields?.priceMode && (
                            <div className="flex items-center gap-1.5 text-emerald-600 animate-in fade-in">
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
                                            className={`pl-7 transition-all duration-500 ${formData.autoFilledFields?.price ? 'border-emerald-400 ring-1 ring-emerald-100 bg-emerald-50/10' : ''}`}
                                            placeholder="Min"
                                            value={formData.minPrice || ''}
                                            onChange={(e) => {
                                                onChange('minPrice', e.target.value);
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
                                        className={`pl-7 transition-all duration-500 ${formData.autoFilledFields?.price ? 'border-emerald-400 ring-1 ring-emerald-100 bg-emerald-50/10' : ''}`}
                                        placeholder="0.00"
                                        value={formData.productPrice || ''}
                                        onChange={(e) => {
                                            onChange('productPrice', e.target.value);
                                            if (formData.autoFilledFields?.price) {
                                                onChange('autoFilledFields', { ...formData.autoFilledFields, price: false });
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-sm text-slate-500 italic p-2 bg-slate-50 rounded dark:bg-slate-800/50">
                            Pricing will be communicated as "Contact for pricing" or handled via custom message.
                        </div>
                    )}
                </div>

                {/* 4. Description (Stacked & Enhanced UI) */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <Label className="flex items-center gap-2">
                            Description *
                            <TooltipProvider>
                                <Tooltip delayDuration={0} open={tooltipOpen['description']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, description: open }))}>
                                    <TooltipTrigger asChild onClick={(e) => toggleTooltip('description', e)}>
                                        <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                        <p>A detailed explanation of the product features.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Label>
                        {formData.autoFilledFields?.description && (
                            <div className="flex items-center gap-1.5 text-emerald-600 animate-in fade-in">
                                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">AI Auto-filled</span>
                                <Sparkles className="w-3 h-3" />
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <Textarea
                            placeholder="Describe the product features and specs..."
                            className={`min-h-[120px] pb-10 resize-y transition-all duration-500 ${formData.autoFilledFields?.description ? 'border-emerald-400 ring-1 ring-emerald-100 bg-emerald-50/10' : ''}`}
                            value={formData.description || ''}
                            onChange={(e) => {
                                onChange('description', e.target.value);
                                if (formData.autoFilledFields?.description) {
                                    onChange('autoFilledFields', { ...formData.autoFilledFields, description: false });
                                }
                            }}
                            highlight={(activeField === 'description')?.toString()}
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
        );
    }

    // --- SERVICE WIZARD ---
    if (mode === 'service') {
        // Validation Helpers
        const isError = (field) => formData.errors?.[field];

        // Ensure global message is initialized (in a real app, this might come from global settings)
        if (formData.globalDefaultPriceMessage === undefined) {
            // We use a side-effect free way to default it for display if needed, 
            // but strictly we should probably init it. For now, we'll handle undefined in render.
        }

        // --- STEP 1: SERVICE DETAILS ---
        if (step === 1) {
            const showAutoFillBanner = formData.serviceName && (formData.serviceName.toLowerCase().includes('heater') || formData.serviceName.toLowerCase().includes('hot water')) && !formData.isContextActive;

            return (
                <div className="space-y-6 pb-32 md:pb-0 animate-in fade-in slide-in-from-right-4 duration-300 relative">
                    {/* Knowledge Found Banner */}
                    {showAutoFillBanner && (
                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-4 flex gap-4 animate-in slide-in-from-top-2">
                            <div className="w-10 h-10 bg-white dark:bg-purple-800/50 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-300 shadow-sm flex-shrink-0">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-purple-900 dark:text-purple-100 text-sm">Knowledge Found</h4>
                                <p className="text-xs text-purple-700 dark:text-purple-300 mt-1 mb-3">I found pricing and details for "Heater" in your <strong>SOP_Manual.pdf</strong>. Want me to auto-fill this?</p>
                                <div className="flex gap-3 items-center">
                                    <Button
                                        size="sm"
                                        className="bg-purple-600 hover:bg-purple-700 text-white h-8 shadow-sm"
                                        onClick={() => {
                                            onChange('isContextActive', true);
                                            onChange('contextFileName', 'SOP_Manual.pdf');
                                            onChange('description', "Professional heater diagnosis and repair. We check gas/electric connections, pilot lights, and thermostats.");
                                            onChange('price', "180.00");
                                            onChange('priceMode', 'hourly');
                                            onChange('questions', [
                                                { id: '1', text: "Is the area easily accessible?", options: [], isAutoGenerated: true },
                                                { id: '2', text: "How old is the current unit?", options: [], isAutoGenerated: true },
                                                { id: '3', text: "Is it gas or electric?", options: [], isAutoGenerated: true }
                                            ]);
                                            onChange('autoFilledFields', { description: true, price: true, priceMode: true });
                                            onChange('serviceOutcome', 'collect');
                                            onChange('serviceClosingScript', "e.g. I'll take your details and have someone from the team call you back shortly.");
                                            onChange('errors', {});
                                        }}
                                    >
                                        Yes, Auto-fill
                                    </Button>
                                    <button className="text-xs text-purple-500 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-200 font-medium">Dismiss</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Context Active Banner Overlay */}
                    {formData.isContextActive && (
                        <div className="bg-emerald-50/95 dark:bg-emerald-900/20 backdrop-blur-sm flex items-center justify-between px-4 py-3 rounded-xl border border-emerald-100 dark:border-emerald-800 animate-in fade-in zoom-in-95 duration-300 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white dark:bg-emerald-800/50 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                                    <FileCheck className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-emerald-900 dark:text-emerald-100">Active Context</div>
                                    <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">{formData.contextFileName}</div>
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange('isContextActive', false);
                                    onChange('contextFileName', '');
                                    onChange('description', '');
                                    onChange('price', '');
                                    onChange('questions', []);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:text-emerald-900 dark:hover:text-emerald-200 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                                Remove Context
                            </button>
                        </div>
                    )}

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
                            value={formData.serviceName}
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
                                <div className="flex items-center gap-1.5 text-emerald-600 animate-in fade-in">
                                    <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">AI Auto-filled</span>
                                    <Sparkles className="w-3 h-3" />
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <Textarea
                                placeholder="Describe what this service entails..."
                                className={`min-h-[120px] pb-10 resize-y transition-all duration-500 ${formData.autoFilledFields?.description ? 'border-emerald-400 ring-1 ring-emerald-100 bg-emerald-50/10' : ''} ${isError('description') ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                                value={formData.description}
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
                                <div className="flex items-center gap-1.5 text-emerald-600 animate-in fade-in">
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
                                                className={`pl-7 transition-all duration-500 ${formData.autoFilledFields?.price ? 'border-emerald-400 ring-1 ring-emerald-100 bg-emerald-50/10' : ''} ${isError('price') ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
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
                                            className={`pl-7 transition-all duration-500 ${formData.autoFilledFields?.price ? 'border-emerald-400 ring-1 ring-emerald-100 bg-emerald-50/10' : ''} ${isError('price') ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                                            placeholder="0.00"
                                            value={formData.price}
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
                                            checked={formData.useCustomPriceMessage}
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
                                                value={formData.serviceClosingScript}
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
                                            type={formData.serviceDestinationType}
                                            value={formData.serviceDestinationValue}
                                            onChangeType={(t) => onChange('serviceDestinationType', t)}
                                            onChangeValue={(v) => onChange('serviceDestinationValue', v)}
                                            onAddNew={() => console.log("Add new staff")}
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
                                                <Label className="mb-1.5 flex items-center gap-2 text-xs uppercase text-slate-500">
                                                    SMS Content
                                                    <TooltipProvider>
                                                        <Tooltip delayDuration={0} open={tooltipOpen['smsContent']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, smsContent: open }))}>
                                                            <TooltipTrigger asChild onClick={(e) => toggleTooltip('smsContent', e)}>
                                                                <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                                            </TooltipTrigger>
                                                            <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                                                <p>The text message to send to the caller.</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </Label>
                                                <div className="relative">
                                                    <Textarea
                                                        placeholder="e.g. Thanks for calling! Here is a summary of the next steps we discussed."
                                                        className="min-h-[100px] pb-10 text-sm bg-white dark:bg-slate-800"
                                                        value={formData.smsContent || ''}
                                                        onChange={(e) => onChange('smsContent', e.target.value)}
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

                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <Label className="block text-xs uppercase text-slate-500">SMS Templates</Label>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-6 text-xs text-blue-600 hover:bg-blue-50"
                                                        onClick={() => onChange('isCreatingTemplate', true)}
                                                    >
                                                        <Plus className="w-3 h-3 mr-1" /> New Template
                                                    </Button>
                                                </div>

                                                {/* Template Creation */}
                                                {formData.isCreatingTemplate && (
                                                    <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg mb-4 border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
                                                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">New SMS Template</div>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <Label className="mb-1.5 block text-xs">Template Name</Label>
                                                                <Input
                                                                    placeholder="Enter template name"
                                                                    className="bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                                                    value={formData.newTemplateName || ''}
                                                                    onChange={(e) => onChange('newTemplateName', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label className="mb-1.5 block text-xs">Content</Label>
                                                                <div className="relative">
                                                                    <Textarea
                                                                        placeholder="Enter SMS message content"
                                                                        className="bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-white min-h-[100px] pb-10"
                                                                        value={formData.newTemplateContent || ''}
                                                                        onChange={(e) => onChange('newTemplateContent', e.target.value)}
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
                                                            <div className="flex justify-end gap-2 pt-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => onChange('isCreatingTemplate', false)}
                                                                    className="bg-white dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 hover:bg-slate-200"
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                                                    onClick={() => {
                                                                        if (formData.newTemplateName && formData.newTemplateContent) {
                                                                            const newTemplate = {
                                                                                id: Date.now().toString(),
                                                                                name: formData.newTemplateName,
                                                                                content: formData.newTemplateContent
                                                                            };
                                                                            onChange('smsTemplates', [...(formData.smsTemplates || []), newTemplate]);
                                                                            onChange('smsContent', formData.newTemplateContent);
                                                                            onChange('isCreatingTemplate', false);
                                                                            onChange('newTemplateName', '');
                                                                            onChange('newTemplateContent', '');
                                                                        }
                                                                    }}
                                                                >
                                                                    Save and Use Template
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="space-y-2">
                                                    {formData.smsTemplates?.map(t => (
                                                        <div key={t.id} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 transition-colors cursor-pointer group flex justify-between items-start">
                                                            <div className="flex-1" onClick={() => onChange('smsContent', t.content)}>
                                                                <div className="font-semibold text-sm text-slate-700 dark:text-slate-200 mb-1">{t.name}</div>
                                                                <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{t.content}</div>
                                                            </div>
                                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 dark:text-slate-500 hover:text-blue-600"><Copy className="w-3 h-3" /></button>
                                                                <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 dark:text-slate-500 hover:text-blue-600"><Edit2 className="w-3 h-3" /></button>
                                                                <button
                                                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 dark:text-slate-500 hover:text-red-500"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        const newTemplates = formData.smsTemplates.filter(temp => temp.id !== t.id);
                                                                        onChange('smsTemplates', newTemplates);
                                                                    }}
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {formData.serviceSendInfoType === 'email' && (
                                        <div className="animate-in fade-in space-y-4 pt-2">
                                            <div>
                                                <Label className="mb-1.5 block text-xs uppercase text-slate-500">Email Subject</Label>
                                                <Input
                                                    placeholder="e.g. Summary of our conversation"
                                                    value={formData.emailSubject || ''}
                                                    onChange={(e) => onChange('emailSubject', e.target.value)}
                                                    className="bg-white dark:bg-slate-900 dark:border-slate-700"
                                                />
                                            </div>
                                            <div>
                                                <Label className="mb-1.5 block text-xs uppercase text-slate-500">Email Content</Label>
                                                <div className="relative">
                                                    <Textarea
                                                        placeholder="e.g. Thanks for calling! Here is a summary of the next steps we discussed."
                                                        className="min-h-[100px] pb-10 text-sm bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                                        value={formData.emailContent || ''}
                                                        onChange={(e) => onChange('emailContent', e.target.value)}
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

                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <Label className="block text-xs uppercase text-slate-500">Email Templates</Label>
                                                    <Button size="sm" variant="ghost" className="h-6 text-xs text-blue-600 hover:bg-blue-50">
                                                        <Plus className="w-3 h-3 mr-1" /> New Template
                                                    </Button>
                                                </div>
                                                <div className="text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 dark:text-slate-500 text-sm">
                                                    No EMAIL templates found. Create one to get started.
                                                </div>
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
    }

    // --- STAFF WIZARD ---
    if (mode === 'staff') {
        if (step === 1) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="mb-2 block">First Name</Label>
                            <Input value={formData.staffName} onChange={(e) => onChange('staffName', e.target.value)} placeholder="e.g. Sarah" />
                        </div>
                        <div>
                            <Label className="mb-2 block">Last Name</Label>
                            <Input placeholder="e.g. Connor" />
                        </div>
                    </div>
                    <div>
                        <Label className="mb-2 block">Role</Label>
                        <Input value={formData.staffRole} onChange={(e) => onChange('staffRole', e.target.value)} placeholder="e.g. Senior Manager" />
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
        if (step === 2) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <Label className="mb-2 block">Responsibilities</Label>
                        <p className="text-xs text-slate-500 mb-2">Tell Sophiie what this person handles.</p>
                        <div className="relative">
                            <Textarea
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[120px] pb-10 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                placeholder="e.g. Handles billing disputes..."
                                value={formData.staffResp}
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
        if (step === 3) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <Label className="mb-2 block">Transfer Conditions</Label>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <Label className="text-xs text-slate-500 uppercase block mb-2">Keywords</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline" className="bg-white">Billing Issue <X className="w-3 h-3 ml-1 cursor-pointer" /></Badge>
                            <button className="text-xs text-blue-600 hover:underline">+ Add</button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <div>
                            <div className="font-medium text-slate-800 dark:text-white text-sm">Escalation Point</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Route angry calls here</div>
                        </div>
                        <input type="checkbox" className="toggle-checkbox" />
                    </div>
                </div>
            );
        }
    }

    // --- PROTOCOL WIZARD ---
    if (mode === 'protocol') {
        if (step === 1) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <Label className="mb-2 block">Scenario Name</Label>
                        <Input
                            placeholder="e.g. Refund Request"
                            value={formData.scenarioName}
                            onChange={(e) => onChange('scenarioName', e.target.value)}
                        />
                    </div>

                    <div>
                        <Label className="mb-2 block">Trigger Condition</Label>
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
                            value={formData.protocolTrigger}
                            onChange={(e) => onChange('protocolTrigger', e.target.value)}
                        />
                    </div>
                </div>
            );
        }
        if (step === 2) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <Label className="mb-4 block">Response Logic</Label>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {[
                                { id: 'collect', label: 'Collect Info', icon: ClipboardList, color: 'text-orange-500' },
                                { id: 'transfer', label: 'Transfer', icon: PhoneForwarded, color: 'text-blue-500' },
                                { id: 'book', label: 'Booking', icon: Calendar, color: 'text-purple-500' }, // Changed CalendarCheck to Calendar
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
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 animate-in fade-in">
                            <Label className="mb-2 block">Routing</Label>
                            <TransferRoutingSelector
                                type={formData.protocolDestinationType}
                                value={formData.protocolDestinationValue}
                                onChangeType={(val) => onChange('protocolDestinationType', val)}
                                onChangeValue={(val) => onChange('protocolDestinationValue', val)}
                                onAddNew={() => { }}
                            />
                        </div>
                    )}

                    {/* Book UI */}
                    {formData.protocolAction === 'book' && (
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 flex items-center gap-3 animate-in fade-in">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-purple-900">Calendar Active</h4>
                                <p className="text-xs text-purple-700">Bookings will be added to <strong>Main Calendar (Synced)</strong>.</p>
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
                                        value={formData.protocolScript}
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
                                    {formData.questions.length > 0 ? (
                                        formData.questions.map((q, i) => (
                                            <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm flex justify-between group">
                                                <span>{q}</span>
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
                                    value={formData.protocolScript}
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
        if (step === 3) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ScrollText className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">Scenario Summary</h3>
                        <p className="text-sm text-slate-500">Review the logic before activating.</p>
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
                                        {formData.questions.length > 0 ? formData.questions.map((q, i) => <li key={i}>{q.text || q}</li>) : <li>Default Questions</li>}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
    }

    // --- TRANSFER WIZARD ---
    if (mode === 'transfer') {
        if (step === 1) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <Label className="mb-2 block">Transfer Rule Name</Label>
                        <Input
                            placeholder="e.g. Sales Inquiry"
                            value={formData.transferName}
                            onChange={(e) => onChange('transferName', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label className="mb-3 block">Transfer Type</Label>
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
        if (step === 2) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <Label className="mb-2 block">Handoff Message (Whisper)</Label>
                        <p className="text-xs text-slate-500 mb-3">What the AI says to the agent before connecting.</p>
                        <div className="relative">
                            <Textarea
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-3 text-sm font-mono bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed min-h-[100px] pb-10"
                                value={formData.transferSummary}
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
        if (step === 3) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <Label className="mb-4 block">Routing Logic</Label>
                    <div className="space-y-4">

                        {/* Reused Unified Routing Component */}
                        <TransferRoutingSelector
                            type={formData.transferDestinationType}
                            value={formData.transferDestinationValue}
                            onChangeType={(val) => onChange('transferDestinationType', val)}
                            onChangeValue={(val) => onChange('transferDestinationValue', val)}
                            onAddNew={() => { }}
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
    }


    // --- DOCUMENT WIZARD ---
    if (mode === 'document') {
        if (step === 1) {
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

            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 min-h-[400px]">
                    {uploadStatus === 'idle' && (
                        <React.Fragment>
                            <Label className="mb-3 block">Select Source</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div
                                    onClick={() => handleMockUpload('upload')}
                                    className="group border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer h-40"
                                >
                                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <UploadCloud className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-blue-500" />
                                    </div>
                                    <div className="text-sm font-bold text-slate-700 dark:text-slate-200">Upload Document</div>
                                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">PDF, DOCX</div>
                                </div>

                                <div
                                    onClick={() => handleMockUpload('kb')}
                                    className="group border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:border-purple-400 dark:hover:border-purple-600 transition-all cursor-pointer h-40"
                                >
                                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <Book className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-purple-500" />
                                    </div>
                                    <div className="text-sm font-bold text-slate-700 dark:text-slate-200">Select from KB</div>
                                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">Existing Files</div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Label className="mb-2 block">Or Add URL</Label>
                                <div className="flex gap-2">
                                    <Input placeholder="https://..." className="bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-slate-100" />
                                    <Button variant="secondary" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">Fetch</Button>
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

        if (step === 2) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex justify-between items-center mb-2">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Review Findings</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">The AI detected the following potential data points.</p>
                        </div>
                        <Button variant="outline" size="sm" className="hidden md:flex gap-2 text-slate-600 dark:text-slate-300">
                            <Settings className="w-4 h-4" /> Filters
                        </Button>
                    </div>

                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search found items..."
                            className="pl-9 bg-white dark:bg-slate-900/50 dark:border-slate-700 dark:text-white"
                        />
                    </div>

                    <div className="space-y-4">
                        {/* Mock Category Header */}
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">Services</Badge>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">2 Matches</span>
                        </div>

                        {/* Finding Card 1 */}
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

                        {/* Finding Card 2 */}
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
                    </div>
                </div>
            );
        }

        if (step === 3) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex justify-between items-center">
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Extraction Lab</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Confirm where data should be applied.</p>
                        </div>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800">2 Items Selected</Badge>
                    </div>

                    <div className="space-y-3">
                        {/* Item 1 - Service */}
                        <div className="border border-blue-200 bg-blue-50/20 dark:bg-blue-900/10 dark:border-blue-800/50 rounded-xl p-4 flex gap-4 items-start">
                            <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg flex items-center justify-center text-blue-500 dark:text-blue-400 shadow-sm flex-shrink-0">
                                <Wrench className="w-5 h-5" />
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

                        {/* Item 3 - Conflict */}
                        <div className="border border-orange-200 bg-orange-50/30 dark:bg-orange-900/10 dark:border-orange-800/50 rounded-xl p-4 flex gap-4 items-start">
                            <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg flex items-center justify-center text-orange-500 shadow-sm flex-shrink-0">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h5 className="font-bold text-slate-900 dark:text-white text-sm">Conflict Detected</h5>
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">Doc says <strong className="text-slate-800 dark:text-slate-200">$150 call-out</strong>, but "General Plumbing" service is set to <strong className="text-slate-800 dark:text-slate-200">$99</strong>.</p>
                                <div className="flex gap-2">
                                    <Button size="sm" className="h-8 bg-orange-100 text-orange-800 hover:bg-orange-200 border border-orange-200 shadow-none dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800 dark:hover:bg-orange-900/60">Overwrite Old Price</Button>
                                    <Button size="sm" variant="ghost" className="h-8 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">Ignore</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    return <div>Unknown Step</div>;
}



const TeamMemberSelector = ({ value, onChange, onAddNew }) => {
    return (
        <div className="space-y-2">
            <select
                className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 dark:text-slate-100"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">Select Team Member...</option>
                <option value="sarah">Sarah (Reception)</option>
                <option value="mike">Mike (Sales)</option>
                <option value="support">Support Team</option>
            </select>
            <div className="flex justify-end">
                <button onClick={onAddNew} className="text-xs text-blue-600 hover:underline font-medium flex items-center">
                    <Plus className="w-3 h-3 mr-1" /> Add New Member
                </button>
            </div>
        </div>
    );
};

const TransferRoutingSelector = ({ type, value, onChangeType, onChangeValue, onAddNew }) => {
    return (
        <div className="space-y-3">
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                {['staff', 'queue', 'external'].map(t => (
                    <button
                        key={t}
                        onClick={() => onChangeType(t)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${type === t ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                    >
                        {t === 'staff' ? 'Staff' : t === 'queue' ? 'Queue' : 'External'}
                    </button>
                ))}
            </div>

            {type === 'staff' && (
                <TeamMemberSelector value={value} onChange={onChangeValue} onAddNew={onAddNew} />
            )}

            {type === 'queue' && (
                <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 dark:text-slate-100"
                    value={value}
                    onChange={(e) => onChangeValue(e.target.value)}
                >
                    <option value="">Select Queue...</option>
                    <option value="general">General Support</option>
                    <option value="sales">Sales Team</option>
                    <option value="urgent">Urgent / Escalations</option>
                </select>
            )}

            {type === 'external' && (
                <Input
                    placeholder="+1 (555) 000-0000"
                    className="bg-white dark:bg-slate-800"
                    value={value}
                    onChange={(e) => onChangeValue(e.target.value)}
                />
            )}
        </div>
    );
};



