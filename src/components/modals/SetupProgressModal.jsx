import React from 'react';
import { Check, Circle, Trophy, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function SetupProgressModal({ isOpen, onClose }) {
    // Mock data for all Train Sophiie pages
    const allSections = [
        { id: 'overview', title: 'Overview', isComplete: true },
        { id: 'business-info', title: 'Business Information', isComplete: true },
        { id: 'services', title: 'Services', isComplete: true },
        { id: 'products', title: 'Products', isComplete: true },
        { id: 'documents', title: 'Documents', isComplete: true },
        { id: 'policies', title: 'Policies', isComplete: true },
        { id: 'faqs', title: 'FAQs', isComplete: true },
        { id: 'scenarios', title: 'Scenarios & Restrictions', isComplete: false },
        { id: 'staff', title: 'Staff & Departments', isComplete: true },
        { id: 'transfers', title: 'Transfers', isComplete: true },
        { id: 'notifications', title: 'Notifications', isComplete: true },
        { id: 'tags', title: 'Tags', isComplete: true },
        { id: 'voice', title: 'Voice & Personality', isComplete: false },
        { id: 'greetings', title: 'Greetings & Closings', isComplete: true },
        { id: 'behaviors', title: 'Behaviors', isComplete: false },
    ];

    const completedCount = allSections.filter(s => s.isComplete).length;
    const totalCount = allSections.length;
    const progress = Math.round((completedCount / totalCount) * 100);
    const isAllComplete = completedCount === totalCount;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className={cn(
                "w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200",
                isAllComplete
                    ? "bg-gradient-to-b from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10"
                    : "bg-white dark:bg-slate-900"
            )}>
                {/* Header */}
                <div className={cn(
                    "p-6 border-b transition-colors",
                    isAllComplete
                        ? "border-green-200 dark:border-green-800/50 bg-green-100/50 dark:bg-green-900/20"
                        : "border-slate-100 dark:border-slate-800"
                )}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className={cn(
                            "text-xl font-bold",
                            isAllComplete ? "text-green-800 dark:text-green-300" : "text-slate-900 dark:text-white"
                        )}>
                            {isAllComplete ? "Setup Complete! 🎉" : "Train Sophiie Setup"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Progress Ring */}
                    <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path
                                    className="text-slate-200 dark:text-slate-700"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                />
                                <path
                                    className={cn(
                                        "transition-all duration-700",
                                        isAllComplete ? "text-green-500" : "text-blue-600"
                                    )}
                                    strokeDasharray={`${progress}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className={cn(
                                    "text-lg font-bold",
                                    isAllComplete ? "text-green-700 dark:text-green-400" : "text-slate-900 dark:text-white"
                                )}>
                                    {progress}%
                                </span>
                            </div>
                        </div>

                        <div className="flex-1">
                            <p className={cn(
                                "text-sm font-medium mb-1",
                                isAllComplete ? "text-green-700 dark:text-green-300" : "text-slate-600 dark:text-slate-400"
                            )}>
                                {completedCount} of {totalCount} sections complete
                            </p>
                            {isAllComplete && (
                                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300 animate-in fade-in slide-in-from-bottom-2">
                                    <Sparkles className="w-4 h-4" />
                                    <span>You're all set!</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section List */}
                <div className="p-4 max-h-[400px] overflow-y-auto">
                    <div className="space-y-1">
                        {allSections.map((section) => (
                            <div
                                key={section.id}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg transition-colors",
                                    section.isComplete
                                        ? "bg-slate-50/50 dark:bg-slate-800/30"
                                        : "bg-white dark:bg-slate-800/50"
                                )}
                            >
                                {/* Status Icon */}
                                <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                                    section.isComplete
                                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                        : "bg-slate-100 text-slate-300 dark:bg-slate-700 dark:text-slate-600"
                                )}>
                                    {section.isComplete ? (
                                        <Check className="w-3.5 h-3.5" />
                                    ) : (
                                        <div className="w-2 h-2 rounded-full bg-current opacity-50" />
                                    )}
                                </div>

                                <span className={cn(
                                    "text-sm font-medium flex-1",
                                    section.isComplete
                                        ? "text-slate-700 dark:text-slate-300"
                                        : "text-slate-500 dark:text-slate-400"
                                )}>
                                    {section.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                {!isAllComplete && (
                    <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                            Complete all sections to finish setting up Sophiie
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
