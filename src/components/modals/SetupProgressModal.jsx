import React from 'react';
import { Check, X, Sparkles, Briefcase, Wrench, ShoppingBag, Book, ListChecks, HelpCircle, ShieldAlert, Users, ArrowRightLeft, Bell, Tag, Mic, MessageSquare, Activity, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export function SetupProgressModal({ isOpen, onClose }) {
    const navigate = useNavigate();

    // Map section IDs to their icons and routes
    const sectionConfig = {
        'overview': { icon: Home, route: '/overview' },
        'business-info': { icon: Briefcase, route: '/business-info' },
        'services': { icon: Wrench, route: '/services' },
        'products': { icon: ShoppingBag, route: '/products' },
        'documents': { icon: Book, route: '/knowledge' },
        'policies': { icon: ListChecks, route: '/policies' },
        'faqs': { icon: HelpCircle, route: '/faqs' },
        'scenarios': { icon: ShieldAlert, route: '/scenarios' },
        'staff': { icon: Users, route: '/staff' },
        'transfers': { icon: ArrowRightLeft, route: '/transfers' },
        'notifications': { icon: Bell, route: '/notifications' },
        'tags': { icon: Tag, route: '/tags' },
        'voice': { icon: Mic, route: '/voice' },
        'greetings': { icon: MessageSquare, route: '/greetings' },
        'behaviors': { icon: Activity, route: '/behaviors' },
    };

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

    const handleSectionClick = (sectionId) => {
        const config = sectionConfig[sectionId];
        if (config?.route) {
            navigate(config.route);
            onClose();
        }
    };

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
                    <div className="flex items-center justify-between mb-6">
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

                    {/* Semi-Circle Progress */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-48 h-24 mb-4">
                            <svg className="w-full h-full" viewBox="0 0 200 100">
                                {/* Background arc */}
                                <path
                                    d="M 20 90 A 80 80 0 0 1 180 90"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    className="text-slate-200 dark:text-slate-700"
                                />
                                {/* Progress arc */}
                                <path
                                    d="M 20 90 A 80 80 0 0 1 180 90"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    strokeDasharray={`${(progress / 100) * 251.2}, 251.2`}
                                    className={cn(
                                        "transition-all duration-700",
                                        isAllComplete
                                            ? "text-green-500 dark:text-green-400"
                                            : "text-blue-600 dark:text-blue-500"
                                    )}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-end justify-center pb-2">
                                <div className="text-center">
                                    <div className={cn(
                                        "text-3xl font-bold mb-1",
                                        isAllComplete
                                            ? "text-green-700 dark:text-green-400"
                                            : "text-slate-900 dark:text-white"
                                    )}>
                                        {progress}%
                                    </div>
                                    <p className={cn(
                                        "text-xs font-medium",
                                        isAllComplete
                                            ? "text-green-600 dark:text-green-300"
                                            : "text-slate-600 dark:text-slate-400"
                                    )}>
                                        {completedCount} of {totalCount} complete
                                    </p>
                                </div>
                            </div>
                        </div>

                        {isAllComplete && (
                            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300 animate-in fade-in slide-in-from-bottom-2">
                                <Sparkles className="w-4 h-4" />
                                <span className="font-medium">You're all set!</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section List */}
                <div className="p-4 max-h-[400px] overflow-y-auto">
                    <div className="space-y-1.5">
                        {allSections.map((section) => {
                            const config = sectionConfig[section.id];
                            const Icon = config?.icon;

                            return (
                                <button
                                    key={section.id}
                                    onClick={() => handleSectionClick(section.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-3 rounded-lg transition-all group",
                                        "hover:bg-blue-50 dark:hover:bg-blue-900/20",
                                        "hover:shadow-sm hover:-translate-y-0.5",
                                        section.isComplete
                                            ? "bg-slate-50/50 dark:bg-slate-800/30"
                                            : "bg-white dark:bg-slate-800/50"
                                    )}
                                >
                                    {/* Status Icon */}
                                    <div className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
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

                                    {/* Page Icon */}
                                    {Icon && (
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                                            "bg-slate-100 dark:bg-slate-700/50",
                                            "group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30"
                                        )}>
                                            <Icon className={cn(
                                                "w-4 h-4 transition-colors",
                                                "text-slate-600 dark:text-slate-400",
                                                "group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                            )} />
                                        </div>
                                    )}

                                    <span className={cn(
                                        "text-sm font-medium flex-1 text-left transition-colors",
                                        section.isComplete
                                            ? "text-slate-700 dark:text-slate-300"
                                            : "text-slate-500 dark:text-slate-400",
                                        "group-hover:text-blue-700 dark:group-hover:text-blue-300"
                                    )}>
                                        {section.title}
                                    </span>
                                </button>
                            );
                        })}
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
