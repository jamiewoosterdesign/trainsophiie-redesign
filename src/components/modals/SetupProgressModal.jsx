import React from 'react';
import { Check, X, Sparkles, Briefcase, Wrench, ShoppingBag, Book, ListChecks, HelpCircle, ShieldAlert, Users, ArrowRightLeft, Bell, Tag, Mic, MessageSquare, Activity, Home, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import sophiieAvatar from '@/avatars/sophiie-avatar.png';
import { useDemo } from '@/context/DemoContext';

export function SetupProgressModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const { setupProgress: allSections } = useDemo();

    // Mapping icons to sections
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

    const completedCount = allSections.filter(s => s.isComplete).length;
    const totalCount = allSections.length;
    const progress = Math.round((completedCount / totalCount) * 100);
    const isAllComplete = completedCount === totalCount;
    const areRequiredComplete = allSections.filter(s => s.tags?.includes('Required')).every(s => s.isComplete);

    const handleSectionClick = (section) => {
        if (section.route) {
            navigate(section.route);
            onClose();
        }
    };

    const getTagStyle = (tag) => {
        switch (tag) {
            case 'Required': return "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50";
            case 'Recommended': return "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50";
            case 'Optional': return "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
            case 'Advanced': return "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50";
            default: return "bg-slate-100 text-slate-600";
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className={cn(
                "w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]",
                "bg-white dark:bg-slate-900"
            )}>
                {/* Header Section with Avatar - Light/Dark mode compatible */}
                <div className="relative overflow-hidden bg-white dark:bg-slate-900 p-6 flex flex-col items-center justify-center text-center flex-shrink-0 border-b border-slate-100 dark:border-slate-800">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="relative z-10 flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse" />
                            <img
                                src={sophiieAvatar}
                                alt="Sophiie"
                                className="relative w-20 h-20 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-xl"
                            />
                            {isAllComplete && (
                                <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center animate-in zoom-in">
                                    <Check className="w-3 h-3 text-white" strokeWidth={4} />
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                {isAllComplete ? "Setup Complete!" : "Setup Progress"}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                {completedCount} of {totalCount} steps completed ({progress}%)
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-64 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-950/50">
                    <div className="grid gap-2">
                        {allSections.map((section) => (
                            <div
                                key={section.id}
                                onClick={() => handleSectionClick(section)}
                                className={cn(
                                    "group flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer bg-white dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800",
                                    section.isComplete
                                        ? "border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md"
                                        : "border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md ring-1 ring-transparent hover:ring-blue-100 dark:hover:ring-blue-900/20"
                                )}
                            >
                                <div className={cn(
                                    "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors mt-0.5",
                                    section.isComplete
                                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                        : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400"
                                )}>
                                    {section.isComplete ? <Check className="w-3 h-3" strokeWidth={3} /> : <div className="w-1.5 h-1.5 bg-current rounded-full" />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-0.5">
                                        <h4 className={cn(
                                            "font-semibold text-sm truncate",
                                            section.isComplete ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white"
                                        )}>
                                            {section.title}
                                        </h4>
                                        <div className="flex gap-1 flex-shrink-0">
                                            {section.tags.map(tag => (
                                                <span key={tag} className={cn(
                                                    "text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider",
                                                    getTagStyle(tag)
                                                )}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                                        {section.subtitle}
                                    </p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 self-center flex-shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer CTA - Restored Simplicity */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 flex items-center justify-between">
                    {areRequiredComplete ? (
                        <>
                            <div className="flex flex-col">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Activate Sophiie</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Mandatory steps complete. You can now divert calls.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/activation')}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                            >
                                Divert Calls Now
                                <ArrowRightLeft className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <div className="w-full text-center py-1">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Complete all <span className="font-bold text-red-500">Required</span> sections to activate call diversion.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
