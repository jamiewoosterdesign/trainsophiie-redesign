
import React, { useState } from 'react';
import { ClipboardList, PhoneForwarded, Calendar, ShieldAlert, Mic, Wand2, Trash2, ScrollText, X, Info, Sparkles, Loader2, Plus, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { TransferRoutingSelector } from './components/TransferRoutingSelector';
import QuestionRulesEditorComponent from './QuestionRulesEditor';
import { callGemini } from '@/lib/gemini';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function WizardFormContentProtocol({ step, formData, onChange, onSwitchMode, activeField }) {
    const [tooltipOpen, setTooltipOpen] = useState({});
    const [isGenerating, setIsGenerating] = useState({});

    // Template Form States
    const [showSmsTemplateForm, setShowSmsTemplateForm] = useState(false);
    const [newSmsTemplate, setNewSmsTemplate] = useState({ name: '', content: '' });

    const [showEmailTemplateForm, setShowEmailTemplateForm] = useState(false);
    const [newEmailTemplate, setNewEmailTemplate] = useState({ name: '', subject: '', content: '' });

    const handleSaveSmsTemplate = () => {
        onChange('protocolSmsMessage', newSmsTemplate.content);
        setShowSmsTemplateForm(false);
        setNewSmsTemplate({ name: '', content: '' });
    };

    const handleSaveEmailTemplate = () => {
        onChange('protocolEmailSubject', newEmailTemplate.subject);
        onChange('protocolEmailBody', newEmailTemplate.content);
        setShowEmailTemplateForm(false);
        setNewEmailTemplate({ name: '', subject: '', content: '' });
    };

    const toggleTooltip = (id, e) => {
        if (e) e.preventDefault();
        setTooltipOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const isError = (field) => formData.errors?.[field];

    const handleAutoGenerate = async (field) => {
        setIsGenerating(prev => ({ ...prev, [field]: true }));

        let prompt = "";
        const name = formData.scenarioName || "this scenario";
        const trigger = formData.protocolTrigger || "a customer request";
        const action = formData.protocolAction || "handle the situation";

        switch (field) {
            case 'description':
                prompt = `Write a clear, concise description (1-2 sentences) for a customer service scenario named "${name}", triggered by "${trigger}". Focus on the purpose of this workflow.`;
                break;
            case 'aiResponse':
                prompt = `Write a valid, natural response for an AI receptionist when a customer says something like "${trigger}". The context is "${name}". Keep it helpful and under 20 words.`;
                break;
            case 'protocolScript':
                if (action === 'refuse') {
                    prompt = `Write a polite but firm refusal script for an AI receptionist to say when a customer asks for "${trigger}" (${name}). Explain that we cannot accommodate this request.`;
                } else {
                    prompt = `Write a polite closing script for an AI receptionist to say after handling a request for "${name}". Confirm that the details are noted.`;
                }
                break;
            case 'protocolSmsMessage':
                prompt = `Write a short, professional SMS message (under 160 chars) to send to a customer regarding "${name}", confirming their request is being processed.`;
                break;
            case 'protocolEmailSubject':
                prompt = `Write a clear, professional email subject line for an update about "${name}".`;
                break;
            case 'protocolEmailBody':
                prompt = `Write a professional email body (3-4 sentences) regarding "${name}" to a customer. Keep it warm and direct.`;
                break;
            default:
                prompt = `Write text for ${field} in the context of ${name}.`;
        }

        try {
            const text = await callGemini(prompt);
            if (text) {
                onChange(field, text);
                if (isError(field)) onChange('errors', { ...formData.errors, [field]: false });
            }
        } catch (error) {
            console.error("Generation failed", error);
        } finally {
            setIsGenerating(prev => ({ ...prev, [field]: false }));
        }
    };

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

                <div>
                    <Label className={`flex items-center gap-2 mb-2 ${isError('description') ? 'text-red-500' : ''}`}>
                        Description (Optional)
                        <TooltipProvider>
                            <Tooltip delayDuration={0} open={tooltipOpen['description']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, description: open }))}>
                                <TooltipTrigger asChild onClick={(e) => toggleTooltip('description', e)}>
                                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                    <p>A detailed explanation of this scenario for the AI.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                    <div className="relative">
                        <Textarea
                            placeholder="Describe the context for this scenario..."
                            className={`min-h-[100px] pb-10 resize-y ${isError('description') ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                            value={formData.description || ''}
                            onChange={(e) => {
                                onChange('description', e.target.value);
                                if (isError('description')) onChange('errors', { ...formData.errors, description: false });
                            }}
                        />
                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Voice Input">
                                <Mic className="w-4 h-4" />
                            </div>
                            <div
                                className={`w-8 h-8 rounded-full ${isGenerating['description'] ? 'bg-blue-100 dark:bg-blue-900 cursor-not-allowed' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer'} flex items-center justify-center transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400`}
                                title="Generate with AI"
                                onClick={() => !isGenerating['description'] && handleAutoGenerate('description')}
                            >
                                {isGenerating['description'] ? <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" /> : <Wand2 className="w-4 h-4" />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- STEP 2: CONVERSATION FLOW ---
    if (step === 2) {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
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
                                    <p>The specific response Sophiie gives when this trigger is met.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                    <div className="relative">
                        <Textarea
                            placeholder="e.g. I can help you with that refund request."
                            className="min-h-[80px] pb-8 resize-y"
                            value={formData.aiResponse || ''}
                            onChange={(e) => onChange('aiResponse', e.target.value)}
                        />
                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Voice Input">
                                <Mic className="w-4 h-4" />
                            </div>
                            <div
                                className={`w-8 h-8 rounded-full ${isGenerating['aiResponse'] ? 'bg-blue-100 dark:bg-blue-900 cursor-not-allowed' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer'} flex items-center justify-center transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400`}
                                title="Generate with AI"
                                onClick={() => !isGenerating['aiResponse'] && handleAutoGenerate('aiResponse')}
                            >
                                {isGenerating['aiResponse'] ? <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" /> : <Wand2 className="w-4 h-4" />}
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
                            { id: 'send_info', label: 'Send Info', icon: Mail, color: 'text-green-500' },
                            { id: 'refuse', label: 'Refuse', icon: ShieldAlert, color: 'text-red-500' },
                        ].map(opt => (
                            <div
                                key={opt.id}
                                onClick={() => onChange('protocolAction', opt.id)}
                                className={`cursor-pointer h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${formData.protocolAction === opt.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                <div className={`mb-2 ${formData.protocolAction === opt.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                    <opt.icon className={`w-6 h-6 ${formData.protocolAction === opt.id ? 'text-blue-600 dark:text-blue-400' : opt.color}`} />
                                </div>
                                <div className={`font-semibold text-sm ${formData.protocolAction === opt.id ? 'text-blue-900 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>{opt.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Conditional Configuration */}
                    <div className="animate-in fade-in">
                        {/* Transfer Routing */}
                        {formData.protocolAction === 'transfer' && (
                            <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
                                <div>
                                    <Label className="mb-2 block">Routing</Label>
                                    <TransferRoutingSelector
                                        type={formData.protocolDestinationType || 'staff'}
                                        value={formData.protocolDestinationValue || ''}
                                        onChangeType={(val) => onChange('protocolDestinationType', val)}
                                        onChangeValue={(val) => onChange('protocolDestinationValue', val)}
                                        onAddNew={() => onSwitchMode('staff')}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Collect / Refuse Script */}
                        {(formData.protocolAction === 'collect' || formData.protocolAction === 'refuse') && (
                            <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
                                <Label className="mb-1.5 flex items-center gap-2 text-xs uppercase text-slate-500 dark:text-slate-400">
                                    {formData.protocolAction === 'refuse' ? 'Refusal Script' : 'Closing Script (Optional)'}
                                    <TooltipProvider>
                                        <Tooltip delayDuration={0} open={tooltipOpen['protocolScript']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, protocolScript: open }))}>
                                            <TooltipTrigger asChild onClick={(e) => toggleTooltip('protocolScript', e)}>
                                                <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                                <p>{formData.protocolAction === 'refuse' ? 'What Sophiie should say to politely refuse.' : 'What Sophiie should say before ending the interaction.'}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Label>
                                <div className="relative">
                                    <Textarea
                                        className={`w-full rounded-lg border p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none pb-10 bg-white dark:bg-slate-800 ${formData.protocolAction === 'refuse' ? 'border-red-200' : 'border-slate-300 dark:border-slate-700'}`}
                                        rows={3}
                                        placeholder={formData.protocolAction === 'refuse' ? "e.g. I apologize, but we are unable to process that request due to company policy." : "e.g. I'll make a note of that."}
                                        value={formData.protocolScript || ''}
                                        onChange={(e) => onChange('protocolScript', e.target.value)}
                                    />
                                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Voice Input">
                                            <Mic className="w-4 h-4" />
                                        </div>
                                        <div
                                            className={`w-8 h-8 rounded-full ${isGenerating['protocolScript'] ? 'bg-blue-100 dark:bg-blue-900 cursor-not-allowed' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer'} flex items-center justify-center transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400`}
                                            title="Generate with AI"
                                            onClick={() => !isGenerating['protocolScript'] && handleAutoGenerate('protocolScript')}
                                        >
                                            {isGenerating['protocolScript'] ? <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" /> : <Wand2 className="w-4 h-4" />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Send Info */}
                        {formData.protocolAction === 'send_info' && (
                            <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
                                {/* Tabs for SMS / Email */}
                                <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex mb-4">
                                    <button
                                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${(formData.protocolSendInfoType || 'sms') === 'sms' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                                        onClick={() => onChange('protocolSendInfoType', 'sms')}
                                    >
                                        SMS
                                    </button>
                                    <button
                                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${formData.protocolSendInfoType === 'email' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                                        onClick={() => onChange('protocolSendInfoType', 'email')}
                                    >
                                        Email
                                    </button>
                                </div>

                                {(formData.protocolSendInfoType || 'sms') === 'sms' && (
                                    <div className="animate-in fade-in space-y-6 pt-2">
                                        <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg flex gap-3 border border-blue-100 dark:border-blue-900/50">
                                            <div className="text-blue-500 dark:text-blue-400 mt-0.5"><ShieldAlert className="w-4 h-4" /></div>
                                            <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                                                This action only works for <strong>phone calls</strong>. For chatbot and web calls, it will automatically fallback to "Continue Call".
                                            </p>
                                        </div>

                                        <div>
                                            <Label className="mb-1 block font-semibold text-slate-900 dark:text-slate-100">SMS Content</Label>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">This is the SMS content that will be sent to your customer</p>
                                            <div className="relative">
                                                <Textarea
                                                    placeholder="e.g. Thanks for calling! Here is the info you requested..."
                                                    className="min-h-[120px] pb-10 bg-white dark:bg-slate-800"
                                                    value={formData.protocolSmsMessage || ''}
                                                    onChange={(e) => onChange('protocolSmsMessage', e.target.value)}
                                                />
                                                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Voice Input">
                                                        <Mic className="w-4 h-4" />
                                                    </div>
                                                    <div
                                                        className={`w-8 h-8 rounded-full ${isGenerating['protocolSmsMessage'] ? 'bg-blue-100 dark:bg-blue-900 cursor-not-allowed' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer'} flex items-center justify-center transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400`}
                                                        title="Generate with AI"
                                                        onClick={() => !isGenerating['protocolSmsMessage'] && handleAutoGenerate('protocolSmsMessage')}
                                                    >
                                                        {isGenerating['protocolSmsMessage'] ? <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" /> : <Wand2 className="w-4 h-4" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SMS Custom Templates UI */}
                                        <div className="pt-2">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-semibold text-slate-900 dark:text-white">SMS Templates</h4>
                                                {!showSmsTemplateForm && (
                                                    <Button variant="outline" size="sm" onClick={() => setShowSmsTemplateForm(true)} className="bg-white dark:bg-slate-800">
                                                        <Plus className="w-4 h-4 mr-2" /> New Template
                                                    </Button>
                                                )}
                                            </div>

                                            {showSmsTemplateForm && (
                                                <div className="bg-sky-50 dark:bg-slate-800/50 border border-sky-100 dark:border-slate-700 rounded-xl p-5 animate-in slide-in-from-top-2">
                                                    <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-4">New SMS Template</h5>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <Label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Template Name</Label>
                                                            <Input
                                                                placeholder="Enter template name"
                                                                value={newSmsTemplate.name}
                                                                onChange={(e) => setNewSmsTemplate({ ...newSmsTemplate, name: e.target.value })}
                                                                className="bg-white dark:bg-slate-800"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Content</Label>
                                                            <Textarea
                                                                placeholder="Enter SMS message content"
                                                                value={newSmsTemplate.content}
                                                                onChange={(e) => setNewSmsTemplate({ ...newSmsTemplate, content: e.target.value })}
                                                                className="min-h-[100px] bg-white dark:bg-slate-800"
                                                            />
                                                        </div>
                                                        <div className="flex justify-end gap-3 pt-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setShowSmsTemplateForm(false)}
                                                                className="bg-white dark:bg-slate-800"
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                onClick={handleSaveSmsTemplate}
                                                                className="bg-sky-600 hover:bg-sky-700 text-white"
                                                                disabled={!newSmsTemplate.content}
                                                            >
                                                                Save and Use Template
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {formData.protocolSendInfoType === 'email' && (
                                    <div className="animate-in fade-in space-y-6 pt-2">
                                        <div>
                                            <Label className="mb-1 block font-semibold text-slate-900 dark:text-slate-100">Email Subject</Label>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">This is the subject line for your customer will see</p>
                                            <Input
                                                placeholder="e.g. Information about [Scenario Name]"
                                                value={formData.protocolEmailSubject || ''}
                                                onChange={(e) => onChange('protocolEmailSubject', e.target.value)}
                                                className="bg-white dark:bg-slate-800"
                                            />
                                        </div>
                                        <div>
                                            <Label className="mb-1 block font-semibold text-slate-900 dark:text-slate-100">Email Content</Label>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">This is the email content that will be sent to your customer</p>
                                            <div className="relative">
                                                <Textarea
                                                    placeholder="Hi there..."
                                                    className="min-h-[160px] pb-10 bg-white dark:bg-slate-800"
                                                    value={formData.protocolEmailBody || ''}
                                                    onChange={(e) => onChange('protocolEmailBody', e.target.value)}
                                                />
                                                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Voice Input">
                                                        <Mic className="w-4 h-4" />
                                                    </div>
                                                    <div
                                                        className={`w-8 h-8 rounded-full ${isGenerating['protocolEmailBody'] ? 'bg-blue-100 dark:bg-blue-900 cursor-not-allowed' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer'} flex items-center justify-center transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400`}
                                                        title="Generate with AI"
                                                        onClick={() => !isGenerating['protocolEmailBody'] && handleAutoGenerate('protocolEmailBody')}
                                                    >
                                                        {isGenerating['protocolEmailBody'] ? <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" /> : <Wand2 className="w-4 h-4" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Email Custom Templates UI */}
                                        <div className="pt-2">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-semibold text-slate-900 dark:text-white">Email Templates</h4>
                                                {!showEmailTemplateForm && (
                                                    <Button variant="outline" size="sm" onClick={() => setShowEmailTemplateForm(true)} className="bg-white dark:bg-slate-800">
                                                        <Plus className="w-4 h-4 mr-2" /> New Template
                                                    </Button>
                                                )}
                                            </div>

                                            {showEmailTemplateForm && (
                                                <div className="bg-sky-50 dark:bg-slate-800/50 border border-sky-100 dark:border-slate-700 rounded-xl p-5 animate-in slide-in-from-top-2">
                                                    <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-4">New Email Template</h5>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <Label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Template Name</Label>
                                                            <Input
                                                                placeholder="Enter template name"
                                                                value={newEmailTemplate.name}
                                                                onChange={(e) => setNewEmailTemplate({ ...newEmailTemplate, name: e.target.value })}
                                                                className="bg-white dark:bg-slate-800"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Subject</Label>
                                                            <Input
                                                                placeholder="Email subject"
                                                                value={newEmailTemplate.subject}
                                                                onChange={(e) => setNewEmailTemplate({ ...newEmailTemplate, subject: e.target.value })}
                                                                className="bg-white dark:bg-slate-800"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Content</Label>
                                                            <Textarea
                                                                placeholder="Enter email message content"
                                                                value={newEmailTemplate.content}
                                                                onChange={(e) => setNewEmailTemplate({ ...newEmailTemplate, content: e.target.value })}
                                                                className="min-h-[100px] bg-white dark:bg-slate-800"
                                                            />
                                                        </div>
                                                        <div className="flex justify-end gap-3 pt-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setShowEmailTemplateForm(false)}
                                                                className="bg-white dark:bg-slate-800"
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                onClick={handleSaveEmailTemplate}
                                                                className="bg-sky-600 hover:bg-sky-700 text-white"
                                                                disabled={!newEmailTemplate.content}
                                                            >
                                                                Save and Use Template
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
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
