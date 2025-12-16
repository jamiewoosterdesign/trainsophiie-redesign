import React, { useState } from 'react';
import { Wand2, Bot, ArrowRight, ArrowLeft, Check, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import sophiieAvatar from '@/images/sophiie-profile2-white-bg.png';
import { cn } from '@/lib/utils';

export function WelcomeModal({ isOpen, onClose }) {
    const [step, setStep] = useState(1);

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
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 relative border border-slate-200 dark:border-slate-800">

                {/* Content Area */}
                <div className="p-8 pb-6 min-h-[400px] flex flex-col items-center justify-center text-center">

                    {/* STEP 1: WELCOME */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 w-full">
                            <div className="relative mx-auto w-24 h-24">
                                <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full animate-pulse" />
                                <img
                                    src={sophiieAvatar}
                                    alt="Sophiie"
                                    className="relative w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-xl"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center">
                                    <Sparkles className="w-3 h-3 text-white fill-white" />
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome to Sophiie!</h2>
                                <p className="text-slate-500 dark:text-slate-400">
                                    Let's get you started with testing your AI assistant.
                                </p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Ready to meet Sophiie?</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    Your AI assistant is ready to handle customer calls and messages. Let's test it out to see how it performs!
                                </p>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: TEST ANYWHERE */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 w-full text-left">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">Test Sophiie Anywhere</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-center">
                                    Learn where to access testing tools anytime
                                </p>
                            </div>

                            <div className="text-sm text-slate-600 dark:text-slate-300 space-y-4">
                                <p>
                                    You can test Sophiie anytime using the "Test Sophiie" button. This lets you simulate customer interactions and see how your AI assistant responds.
                                </p>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex gap-3">
                                <div className="bg-blue-100 dark:bg-blue-800 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-300">
                                    <Wand2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-0.5">Quick Access</h4>
                                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                        Look for the "Test Sophiie" button in the bottom-right corner of your screen - it's always there when you need it!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: TRAIN SOPHIIE */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 w-full text-left">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-lg">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Train Sophiie for Your Business</h2>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">
                                    Add your business information to improve your agent
                                </p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800 space-y-3">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                                    The Train Sophiie section contains various areas where you can add your business information:
                                </p>
                                <ul className="space-y-2">
                                    {[
                                        "Business hours and contact information",
                                        "Services and pricing details",
                                        "Frequently asked questions and scenarios",
                                        "Company policies and procedures"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                    <li className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 italic">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mt-1.5 flex-shrink-0" />
                                        And many more...
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex gap-3">
                                <div className="bg-blue-100 dark:bg-blue-800 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-300">
                                    <Wand2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-0.5">Pro Tip</h4>
                                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                        The more detailed information you provide, the better Sophiie will be at handling customer inquiries professionally and accurately.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer / Navigation */}
                <div className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 p-6 flex flex-col gap-6">
                    {/* Step Indicators */}
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    step === s ? "w-8 bg-blue-600" : "w-1.5 bg-slate-200 dark:bg-slate-700"
                                )}
                            />
                        ))}
                    </div>

                    <div className="flex justify-between items-center w-full">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            disabled={step === 1}
                            className={step === 1 ? "opacity-0 pointer-events-none" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Previous
                        </Button>

                        <Button
                            onClick={handleNext}
                            className={cn(
                                "w-32 transition-all",
                                step === 3 ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                            )}
                        >
                            {step === 3 ? "Get Started" : "Next"}
                            {step === 3 ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
