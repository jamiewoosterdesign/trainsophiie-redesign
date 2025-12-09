
import React from 'react';
import { Sparkles, FileCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WizardAutoFillBanner({
    type = 'suggestion', // 'suggestion' | 'active'
    theme = 'purple', // 'purple' | 'emerald'
    title = 'Knowledge Found',
    description,
    fileName,
    onAutoFill,
    onDismiss,
    onRemoveContext,
    children
}) {
    const isPurple = theme === 'purple';

    // Suggestion Banner (e.g. "I found 5 FAQs...")
    if (type === 'suggestion') {
        const bgClass = isPurple ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800' : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800';
        const iconBgClass = isPurple ? 'bg-white dark:bg-purple-800/50 text-purple-600 dark:text-purple-300' : 'bg-white dark:bg-emerald-800/50 text-emerald-600 dark:text-emerald-400';
        const titleColor = isPurple ? 'text-purple-900 dark:text-purple-100' : 'text-emerald-900 dark:text-emerald-100';
        const descColor = isPurple ? 'text-purple-700 dark:text-purple-300' : 'text-emerald-700 dark:text-emerald-300';
        const btnClass = isPurple ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700';
        const dismissColor = isPurple ? 'text-purple-500 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-200' : 'text-emerald-500 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-200';

        return (
            <div className={`${bgClass} border rounded-xl p-4 flex gap-4 animate-in slide-in-from-top-2 mb-4`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 ${iconBgClass}`}>
                    <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h4 className={`font-bold text-sm ${titleColor}`}>{title}</h4>
                    <div className={`text-xs mt-1 mb-3 ${descColor}`}>
                        {description || children}
                    </div>
                    {onAutoFill && (
                        <div className="flex gap-3 items-center">
                            <Button
                                size="sm"
                                className={`${btnClass} text-white h-8 shadow-sm`}
                                onClick={onAutoFill}
                            >
                                Yes, Auto-fill All
                            </Button>
                            {onDismiss && (
                                <button
                                    onClick={onDismiss}
                                    className={`text-xs font-medium ${dismissColor}`}
                                >
                                    Dismiss
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Active Context Banner (e.g. "Active Context: SOP.pdf")
    if (type === 'active') {
        const bgClass = 'bg-emerald-50/95 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800';
        const iconBgClass = 'bg-white dark:bg-emerald-800/50 text-emerald-600 dark:text-emerald-400';

        return (
            <div className={`${bgClass} backdrop-blur-sm flex items-center justify-between px-4 py-3 rounded-xl border animate-in fade-in zoom-in-95 duration-300 mb-4`}>
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${iconBgClass}`}>
                        <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-emerald-900 dark:text-emerald-100">{title || 'Active Context'}</div>
                        <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">{fileName}</div>
                    </div>
                </div>
                {onRemoveContext && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemoveContext();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:text-emerald-900 dark:hover:text-emerald-200 transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                        Remove Context
                    </button>
                )}
            </div>
        );
    }

    return null;
}
