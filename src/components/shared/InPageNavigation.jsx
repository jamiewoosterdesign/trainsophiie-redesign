import React, { useEffect, useState } from 'react';
import { Check, Circle, ChevronRight, Trophy, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function InPageNavigation({ sections, activeSection, onNavigate }) {
    const [progress, setProgress] = useState(0);
    const [isAllComplete, setIsAllComplete] = useState(false);

    useEffect(() => {
        const completedCount = sections.filter(s => s.isComplete).length;
        const totalCount = sections.length;
        const newProgress = Math.round((completedCount / totalCount) * 100);
        setProgress(newProgress);
        setIsAllComplete(completedCount === totalCount);
    }, [sections]);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (onNavigate) onNavigate(id);
        }
    };

    return (
        <div className="hidden xl:block sticky top-6 w-full max-w-[280px]">
            <div className={cn(
                "rounded-xl border shadow-sm transition-all duration-500 overflow-hidden",
                isAllComplete
                    ? "bg-gradient-to-b from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 border-green-200 dark:border-green-800"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            )}>
                {/* Header / Progress Area */}
                <div className={cn(
                    "p-5 border-b transition-colors duration-500",
                    isAllComplete
                        ? "border-green-200 dark:border-green-800/50 bg-green-100/50 dark:bg-green-900/20"
                        : "border-slate-100 dark:border-slate-800"
                )}>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className={cn(
                            "font-bold text-sm",
                            isAllComplete ? "text-green-800 dark:text-green-300" : "text-slate-900 dark:text-white"
                        )}>
                            {isAllComplete ? "Setup Complete!" : "Setup Progress"}
                        </h3>
                        <span className={cn(
                            "text-xs font-bold px-2 py-0.5 rounded-full",
                            isAllComplete
                                ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        )}>
                            {progress}%
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-700 ease-out",
                                isAllComplete ? "bg-green-500" : "bg-blue-600"
                            )}
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {isAllComplete && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-green-700 dark:text-green-300 animate-in fade-in slide-in-from-bottom-2">
                            <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span>Great job! You're ready to go.</span>
                        </div>
                    )}
                </div>

                {/* Section List */}
                <div className="p-2">
                    {sections.map((section, index) => (
                        <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all group",
                                // Active State (based on scroll position if we implemented that, or just hover)
                                activeSection === section.id
                                    ? "bg-slate-50 dark:bg-slate-800/50"
                                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            )}
                        >
                            {/* Icon / Status Indicator */}
                            <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                                section.isComplete
                                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-slate-100 text-slate-300 dark:bg-slate-800 dark:text-slate-600 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                            )}>
                                {section.isComplete ? (
                                    <Check className="w-3.5 h-3.5" />
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-current opacity-50" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <span className={cn(
                                    "block text-sm font-medium truncate",
                                    section.isComplete
                                        ? "text-slate-700 dark:text-slate-300"
                                        : "text-slate-500 dark:text-slate-400"
                                )}>
                                    {section.title}
                                </span>
                            </div>

                            <ChevronRight className={cn(
                                "w-4 h-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity",
                                activeSection === section.id && "opacity-100"
                            )} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile/Tablet Helper Text (Hidden here, usually this is desktop only component) */}
            <div className="mt-4 px-4 text-xs text-slate-400 text-center">
                <p>Scroll to navigate or click a section</p>
            </div>
        </div>
    );
}

// Mobile specific version (bottom bar or top sticky)
export function InPageNavigationMobile({ sections, progress, isAllComplete }) {
    // Can be implemented if needed, for now standardizing on desktop view request mainly but good to have a simple one
    return (
        <div className="xl:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-slate-900 px-4 py-2 rounded-full shadow-lg flex items-center gap-4 transition-all duration-300">
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 relative mx-auto">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                            className="text-white/20 dark:text-black/10"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className={cn("transition-all duration-500", isAllComplete ? "text-green-400 dark:text-green-600" : "text-blue-400 dark:text-blue-600")}
                            strokeDasharray={`${progress}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                    </svg>
                </div>
                <span className="text-sm font-medium whitespace-nowrap">
                    {isAllComplete ? "All Set!" : `${progress}% Complete`}
                </span>
            </div>
            {!isAllComplete && (
                <div className="h-4 w-px bg-white/20 dark:bg-black/10" />
            )}
            {!isAllComplete && (
                <span className="text-xs text-white/60 dark:text-black/60 whitespace-nowrap">
                    {sections.find(s => !s.isComplete)?.title || "Finish Up"}
                </span>
            )}
        </div>
    );
}
