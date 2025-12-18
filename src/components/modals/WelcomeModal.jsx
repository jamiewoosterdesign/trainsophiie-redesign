import React, { useState } from 'react';
import { Wand2, Bot, ArrowRight, ArrowLeft, Check, Sparkles, Phone, MessageSquare, FileText, Settings, X, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import sophiieAvatar from '@/images/sophiie-profile2-white-bg.png';
import { cn } from '@/lib/utils';
import { SophiieLogo } from '@/components/icons/SophiieLogo';

export function WelcomeModal({ isOpen, onClose }) {
    const [step, setStep] = useState(1);

    // Reset step when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setStep(1);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            onClose();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            // onClose(); // Optional: prevent closing on backdrop
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row min-h-[550px]">

                {/* Left Column: Content & Navigation */}
                <div className="w-full md:w-1/2 p-12 flex flex-col justify-between relative z-10 bg-white dark:bg-slate-950">
                    <div>
                        {/* Step Indicator (Text) */}
                        <div className="text-sm font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-8">
                            Step {step} of 3
                        </div>

                        {/* Content Switcher */}
                        <div className="space-y-6">
                            {step === 1 && (
                                <div className="space-y-6 animate-in slide-in-from-left-4 fade-in duration-300">
                                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                                        Welcome to <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Sophiie AI</span>
                                    </h2>
                                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                        Your new AI receptionist is ready to transform how you handle customer communications. Available 24/7/365.
                                    </p>
                                    <div className="space-y-4 pt-4">
                                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                                <Check className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="font-medium">Handles missed calls automatically</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                                <Check className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="font-medium">Answers FAQs instantly</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-in slide-in-from-left-4 fade-in duration-300">
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                                        Train Your Agent
                                    </h2>
                                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                        Sophiie gets smarter with every piece of information you provide.
                                    </p>
                                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800 space-y-4">
                                        <div className="flex items-start gap-4">
                                            <FileText className="w-6 h-6 text-purple-500 mt-1" />
                                            <div>
                                                <h4 className="font-semibold text-slate-900 dark:text-white">Documents</h4>
                                                <p className="text-sm text-slate-500">Upload PDFs or link your website.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <Settings className="w-6 h-6 text-blue-500 mt-1" />
                                            <div>
                                                <h4 className="font-semibold text-slate-900 dark:text-white">Services</h4>
                                                <p className="text-sm text-slate-500">Define your pricing and offerings.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6 animate-in slide-in-from-left-4 fade-in duration-300">
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                                        Test & Verify
                                    </h2>
                                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                        Simulate real customer calls to see how she responds before going live.
                                    </p>
                                    <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-xl border border-blue-100 dark:border-blue-800">
                                        <Play className="w-6 h-6 shrink-0" />
                                        <p className="text-sm font-medium">Use the "Test Sophiie" button in the corner anytime to start a simulation.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Navigation */}
                    <div className="flex items-center gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/50">
                        {step > 1 && (
                            <Button variant="ghost" onClick={handleBack} className="pl-0 hover:pl-2 transition-all text-slate-500">
                                Back
                            </Button>
                        )}
                        <Button
                            onClick={handleNext}
                            className="ml-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 px-8 h-12 rounded-xl text-base font-semibold shadow-lg shadow-slate-200 dark:shadow-none"
                        >
                            {step === 3 ? "Let's Get Started" : "Continue"}
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>

                {/* Right Column: Visuals */}
                <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden flex items-center justify-center p-12">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                    {/* Visual 1: Avatar Hero */}
                    {step === 1 && (
                        <div className="relative animate-in zoom-in-50 duration-500">
                            <div className="absolute inset-0 bg-blue-500 blur-[80px] opacity-20 animate-pulse rounded-full" />
                            <div className="relative z-10 w-64 h-64 rounded-full p-2 border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <img
                                    src={sophiieAvatar}
                                    alt="Sophiie"
                                    className="w-full h-full rounded-full object-cover shadow-2xl ring-8 ring-white dark:ring-slate-800"
                                />
                                <div className="absolute bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg animate-bounce delay-1000">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Visual 2: Dashboard/Docs */}
                    {step === 2 && (
                        <div className="relative w-full max-w-sm animate-in slide-in-from-right-8 duration-500">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 transform rotate-3 transition-transform hover:rotate-0 duration-500">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                                        <SophiieLogo className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="h-2.5 w-24 bg-slate-200 dark:bg-slate-700 rounded-full mb-2" />
                                        <div className="h-2 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-700/50 shrink-0" />
                                            <div className="flex-1 space-y-2 py-1">
                                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full" />
                                                <div className="h-2 w-2/3 bg-slate-100 dark:bg-slate-700/50 rounded-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="absolute -right-4 -bottom-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 transform -rotate-6">
                                    <Check className="w-8 h-8 text-green-500" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Visual 3: Phone/Chat */}
                    {step === 3 && (
                        <div className="relative w-full max-w-xs animate-in slide-in-from-right-8 duration-500">
                            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border-4 border-slate-100 dark:border-slate-700 overflow-hidden transform hover:scale-105 transition-transform duration-500">
                                <div className="bg-slate-50 dark:bg-slate-900 p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                                    <img src={sophiieAvatar} className="w-10 h-10 rounded-full" alt="" />
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-white">Sophiie</div>
                                        <div className="text-xs text-green-500 font-medium">On Call • 00:24</div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4 bg-slate-50/50 dark:bg-slate-900/50 h-48 flex flex-col justify-end">
                                    <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-600 dark:text-slate-300">
                                        Hi! I can definitely help with that appointment.
                                    </div>
                                    <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none shadow-sm text-sm self-end">
                                        That would be great, thanks!
                                    </div>
                                </div>
                                <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800 flex justify-center pb-6">
                                    <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                                        <Phone className="w-6 h-6 fill-current" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
