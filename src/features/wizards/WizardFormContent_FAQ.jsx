
import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { WizardAutoFillBanner } from './components/WizardAutoFillBanner';
import { WizardField } from './components/WizardField';
import { WizardInput, WizardTextarea } from './components/WizardSmartInputs';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function WizardFormContentFaq({ formData, onChange, activeField }) {
    const [tooltipOpen, setTooltipOpen] = useState({});

    const toggleTooltip = (id, e) => {
        if (e) e.preventDefault();
        setTooltipOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };
    const faqs = formData.faqs && formData.faqs.length > 0
        ? formData.faqs
        : [{ question: formData.faqQuestion || '', answer: formData.faqAnswer || '' }];

    const firstQuestion = faqs[0]?.question || '';
    const showAutoFillBanner = firstQuestion && (firstQuestion.toLowerCase().includes('heater') || firstQuestion.toLowerCase().includes('hot water')) && !formData.isContextActive && !formData.autoFillDismissed;

    const updateFaq = (index, field, value) => {
        const newFaqs = [...faqs];
        newFaqs[index] = { ...newFaqs[index], [field]: value };
        // Clear auto-fill flag on edit
        if (newFaqs[index].isAutoFilled) newFaqs[index].isAutoFilled = false;

        onChange('faqs', newFaqs);

        // Sync legacy fields for first item
        if (index === 0) {
            if (field === 'question') onChange('faqQuestion', value);
            if (field === 'answer') onChange('faqAnswer', value);
        }
    };

    const addFaq = () => {
        onChange('faqs', [...faqs, { question: '', answer: '' }]);
    };

    const removeFaq = (index) => {
        const newFaqs = faqs.filter((_, i) => i !== index);
        onChange('faqs', newFaqs);
        // Sync legacy
        if (index === 0 && newFaqs.length > 0) {
            onChange('faqQuestion', newFaqs[0].question);
            onChange('faqAnswer', newFaqs[0].answer);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 relative">

            {/* Knowledge Found Banner (Auto-fill Suggestion) */}
            {/* Knowledge Found Banner (Auto-fill Suggestion) */}
            {showAutoFillBanner && (
                <WizardAutoFillBanner
                    type="suggestion"
                    theme="emerald"
                    title="Knowledge Found"
                    description={
                        <>I found 5 relevant FAQs for "Heater" in your <strong>SOP_Manual.pdf</strong>. Want me to auto-fill them?</>
                    }
                    onAutoFill={() => {
                        const mockFaqs = [
                            { question: "How often should I service my heater?", answer: "Heaters should be serviced annually to ensure safety and efficiency.", isAutoFilled: true },
                            { question: "What should I do if my hot water stops?", answer: "Check your pilot light first. If it's out, try relighting it following the manufacturer's instructions.", isAutoFilled: true },
                            { question: "Do you install tankless systems?", answer: "Yes, we specialize in high-efficiency tankless hot water systems.", isAutoFilled: true },
                            { question: "How long is the warranty on new installs?", answer: "Our standard labor warranty is 12 months, plus the manufacturer's warranty on the unit (usually 5-10 years).", isAutoFilled: true },
                            { question: "Is my heater covered by insurance?", answer: "Damage from sudden events may be covered, but wear and tear usually isn't. Check with your provider.", isAutoFilled: true }
                        ];

                        onChange('isContextActive', true);
                        onChange('contextFileName', 'SOP_Manual.pdf');
                        onChange('faqs', mockFaqs);
                        onChange('faqQuestion', mockFaqs[0].question);
                        onChange('faqAnswer', mockFaqs[0].answer);
                        onChange('autoFilledFields', {}); // Clear old method
                    }}
                    onDismiss={() => onChange('autoFillDismissed', true)}
                />
            )}

            {/* Knowledge Extracted Banner (Context Active) */}
            {formData.isContextActive && (
                <WizardAutoFillBanner
                    type="active"
                    theme="emerald"
                    fileName={formData.contextFileName}
                    onRemoveContext={() => {
                        onChange('isContextActive', false);
                        onChange('faqs', [{ question: '', answer: '' }]);
                        onChange('faqQuestion', '');
                        onChange('faqAnswer', '');
                    }}
                />
            )}

            {/* FAQ List */}
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className={`p-4 rounded-xl border transition-all duration-500 animate-in fade-in slide-in-from-bottom-2 ${faq.isAutoFilled ? 'bg-emerald-50/30 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'}`}>
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">FAQ Item #{index + 1}</h4>
                            {faqs.length > 1 && (
                                <button
                                    onClick={() => removeFaq(index)}
                                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <Label className={`flex items-center gap-2 ${formData.errors?.faqQuestion ? 'text-red-500' : ''}`}>
                                        Question *
                                        <TooltipProvider>
                                            <Tooltip delayDuration={0} open={tooltipOpen[`q-${index}`]} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, [`q-${index}`]: open }))}>
                                                <TooltipTrigger asChild onClick={(e) => toggleTooltip(`q-${index}`, e)}>
                                                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                                    <p>The likely question a customer will ask.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </Label>
                                    {faq.isAutoFilled && (
                                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                                            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">AI Auto-filled</span>
                                            <Sparkles className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                                <WizardInput
                                    value={faq.question}
                                    onChange={(val) => {
                                        updateFaq(index, 'question', val);
                                        if (formData.errors?.faqQuestion) {
                                            onChange('errors', { ...formData.errors, faqQuestion: false });
                                        }
                                    }}
                                    placeholder="e.g. What are your opening hours?"
                                    className={`bg-white dark:bg-slate-950 font-medium ${faq.isAutoFilled ? 'border-emerald-400 ring-1 ring-emerald-100 dark:ring-emerald-900/20 bg-emerald-50/10' : ''} ${formData.errors?.faqQuestion ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                                />
                                {formData.errors?.faqQuestion && <p className="text-xs text-red-500 mt-1">{formData.errors.faqQuestion}</p>}
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <Label className={`flex items-center gap-2 ${formData.errors?.faqAnswer ? 'text-red-500' : ''}`}>
                                        Answer *
                                        <TooltipProvider>
                                            <Tooltip delayDuration={0} open={tooltipOpen[`a-${index}`]} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, [`a-${index}`]: open }))}>
                                                <TooltipTrigger asChild onClick={(e) => toggleTooltip(`a-${index}`, e)}>
                                                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                                    <p>The exact response Sophiie should give.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </Label>
                                    {faq.isAutoFilled && (
                                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                                            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">AI Auto-filled</span>
                                            <Sparkles className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                                <WizardTextarea
                                    value={faq.answer}
                                    onChange={(val) => {
                                        updateFaq(index, 'answer', val);
                                        if (formData.errors?.faqAnswer) {
                                            onChange('errors', { ...formData.errors, faqAnswer: false });
                                        }
                                    }}
                                    placeholder="e.g. We are open 9am to 5pm..."
                                    className={`bg-white dark:bg-slate-950 ${faq.isAutoFilled ? 'border-emerald-400 ring-1 ring-emerald-100 dark:ring-emerald-900/20 bg-emerald-50/10' : ''} ${formData.errors?.faqAnswer ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                                />
                                {formData.errors?.faqAnswer && <p className="text-xs text-red-500 mt-1">{formData.errors.faqAnswer}</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Button
                variant="outline"
                className="w-full border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={addFaq}
            >
                <Plus className="w-4 h-4 mr-2" /> Add Another FAQ
            </Button>
        </div>
    );
}
