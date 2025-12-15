import React, { useState } from 'react';
import { X, Settings, PhoneForwarded, Info, Loader2, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WizardTextarea } from './components/WizardSmartInputs';
import RichVariableEditor from '@/components/shared/RichVariableEditor';
import { callGemini } from '@/lib/gemini';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const TRANSFER_VARIABLES = [
    { label: 'Cust First Name', code: '{Customer First Name}', description: "Customer's first name" },
    { label: 'Cust Last Name', code: '{Customer Last Name}', description: "Customer's last name" },
    { label: 'Business Name', code: '{Business Name}', description: "Your company name" },
    { label: 'Agent Name', code: '{Agent Name}', description: "AI Agent's name" }
];

export default function SettingsModal({ onClose }) {
    const [formData, setFormData] = useState({
        transferTimeout: 30,
        maxTransfers: 2,
        transferMessage: "Please hold while I transfer you to a member of the team",
        fallbackMessage: "I apologise, but no one is available right now"
    });
    const [isGenerating, setIsGenerating] = useState({});
    const [tooltipOpen, setTooltipOpen] = useState({});
    const [voiceMode, setVoiceMode] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleTooltip = (id, e) => {
        if (e) e.preventDefault();
        setTooltipOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleAutoGenerate = async (field) => {
        if (isGenerating[field]) return;
        setIsGenerating(prev => ({ ...prev, [field]: true }));

        let prompt = "";
        if (field === 'transferMessage') {
            prompt = "Write a professional, polite message for an AI receptionist to say before transferring a call (approx 1 sentence).";
        } else if (field === 'fallbackMessage') {
            prompt = "Write a polite message for an AI receptionist to say when no staff members are available to take a call (approx 1 sentence).";
        }

        const text = await callGemini(prompt);
        if (text) handleChange(field, text);
        setIsGenerating(prev => ({ ...prev, [field]: false }));
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-[700px] max-w-[95vw] rounded-2xl shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">

                {/* Header matching WizardModal */}
                <div className="flex flex-col border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 rounded-t-2xl">
                    <div className="flex px-8 pt-6 pb-6 justify-between items-start">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">General Transfer Settings</h2>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setVoiceMode(!voiceMode)}
                                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-xs font-bold whitespace-nowrap ${voiceMode
                                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                {voiceMode ? (
                                    <>
                                        <Mic className="w-3.5 h-3.5 animate-pulse flex-shrink-0" /> Voice On
                                    </>
                                ) : (
                                    <>
                                        <Mic className="w-3.5 h-3.5 flex-shrink-0" /> Voice Off
                                    </>
                                )}
                            </button>

                            <button
                                onClick={onClose}
                                className="flex w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 items-center justify-center transition-colors"
                                title="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto">
                    {/* Top Row: Timeout & Max Transfers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label className="mb-2 flex items-center gap-2 text-slate-900 dark:text-slate-200">
                                Transfer Timeout (seconds)
                                <TooltipProvider>
                                    <Tooltip delayDuration={0} open={tooltipOpen['timeout']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, timeout: open }))}>
                                        <TooltipTrigger asChild onClick={(e) => toggleTooltip('timeout', e)}>
                                            <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-slate-900 text-white border-slate-900 z-[70]">
                                            <p>How long Sophiie waits for transfer to be answered before giving up</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Label>
                            <Input
                                type="number"
                                value={formData.transferTimeout}
                                onChange={(e) => handleChange('transferTimeout', e.target.value)}
                                className="bg-white dark:bg-slate-950 dark:border-slate-800"
                            />
                        </div>
                        <div>
                            <Label className="mb-2 flex items-center gap-2 text-slate-900 dark:text-slate-200">
                                Max Transfers per Department
                                <TooltipProvider>
                                    <Tooltip delayDuration={0} open={tooltipOpen['maxTransfers']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, maxTransfers: open }))}>
                                        <TooltipTrigger asChild onClick={(e) => toggleTooltip('maxTransfers', e)}>
                                            <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-slate-900 text-white border-slate-900 z-[70]">
                                            <p>Only applies when a department is selected as a transfer target</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Label>
                            <Input
                                type="number"
                                value={formData.maxTransfers}
                                onChange={(e) => handleChange('maxTransfers', e.target.value)}
                                className="bg-white dark:bg-slate-950 dark:border-slate-800"
                            />
                        </div>
                    </div>

                    {/* Transfer Message */}
                    <div>
                        <Label className="mb-2 flex items-center gap-2 text-slate-900 dark:text-slate-200">
                            Transfer Message
                            <TooltipProvider>
                                <Tooltip delayDuration={0} open={tooltipOpen['transferMsg']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, transferMsg: open }))}>
                                    <TooltipTrigger asChild onClick={(e) => toggleTooltip('transferMsg', e)}>
                                        <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 text-white border-slate-900 z-[70]">
                                        <p>Message Sophiie says before initiating a transfer</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Label>
                        <div className="relative">
                            <RichVariableEditor
                                value={formData.transferMessage}
                                onChange={(val) => handleChange('transferMessage', val)}
                                variables={TRANSFER_VARIABLES}
                                placeholder="Enter message..."
                                onAI={() => handleAutoGenerate('transferMessage')}
                                onRecord={() => console.log('Record')}
                                minHeight="100px"
                            />
                            {isGenerating['transferMessage'] && (
                                <div className="absolute bottom-3 right-12 animate-spin text-blue-500">
                                    <Loader2 className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Fallback Message */}
                    <div>
                        <Label className="mb-2 flex items-center gap-2 text-slate-900 dark:text-slate-200">
                            Fallback Message
                            <TooltipProvider>
                                <Tooltip delayDuration={0} open={tooltipOpen['fallbackMsg']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, fallbackMsg: open }))}>
                                    <TooltipTrigger asChild onClick={(e) => toggleTooltip('fallbackMsg', e)}>
                                        <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 text-white border-slate-900 z-[70]">
                                        <p>Message when transfers aren't possible</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Label>
                        <div className="relative">
                            <WizardTextarea
                                value={formData.fallbackMessage}
                                onChange={(val) => handleChange('fallbackMessage', val)}
                                className="bg-white dark:bg-slate-950 dark:border-slate-800 min-h-[100px]"
                                placeholder="Enter fallback message..."
                                onAIClick={() => handleAutoGenerate('fallbackMessage')}
                            />
                            {isGenerating['fallbackMessage'] && (
                                <div className="absolute bottom-3 right-12 animate-spin text-blue-500">
                                    <Loader2 className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-900/50 rounded-b-2xl">
                    <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white">Save Settings</Button>
                </div>
            </div>
        </div>
    );
}
