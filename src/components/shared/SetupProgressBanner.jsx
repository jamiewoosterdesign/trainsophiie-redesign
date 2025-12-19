import React from 'react';
import { Check, ChevronRight, Sparkles, Trophy, Briefcase, Wrench, ShoppingBag, Book, ListChecks, HelpCircle, ShieldAlert, Users, ArrowRightLeft, Bell, Tag, Mic, MessageSquare, Activity, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';

export function SetupProgressBanner() {
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
        }
    };

    return (
        <Card className={cn(
            "overflow-hidden transition-all duration-500",
            isAllComplete
                ? "bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 dark:from-green-900/20 dark:via-emerald-900/10 dark:to-green-900/20 border-green-200 dark:border-green-800/50"
                : "bg-white dark:bg-slate-900"
        )}>
            <div className="p-6">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                            isAllComplete
                                ? "bg-green-500 dark:bg-green-600"
                                : "bg-brand-navy"
                        )}>
                            {isAllComplete ? (
                                <Trophy className="w-6 h-6 text-white" />
                            ) : (
                                <Sparkles className="w-6 h-6 text-white" />
                            )}
                        </div>
                        <div>
                            <h3 className={cn(
                                "text-lg font-bold",
                                isAllComplete
                                    ? "text-green-800 dark:text-green-300"
                                    : "text-slate-900 dark:text-white"
                            )}>
                                {isAllComplete ? "Setup Complete! 🎉" : "Train Sophiie Setup"}
                            </h3>
                            <p className={cn(
                                "text-sm",
                                isAllComplete
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-slate-600 dark:text-slate-400"
                            )}>
                                {isAllComplete
                                    ? "All sections completed - Sophiie is ready to go!"
                                    : `${completedCount} of ${totalCount} sections complete`
                                }
                            </p>
                        </div>
                    </div>

                    {/* Progress Percentage */}
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <div className={cn(
                                "text-3xl font-bold",
                                isAllComplete
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-blue-600 dark:text-blue-500"
                            )}>
                                {progress}%
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                Progress
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full transition-all duration-700 rounded-full",
                                isAllComplete
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                    : "bg-gradient-to-r from-blue-500 to-blue-600"
                            )}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Section Icons Grid */}
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-15 gap-2">
                    {allSections.map((section) => {
                        const config = sectionConfig[section.id];
                        const Icon = config?.icon;

                        return (
                            <button
                                key={section.id}
                                onClick={() => handleSectionClick(section.id)}
                                className={cn(
                                    "group relative flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all",
                                    "hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-105",
                                    section.isComplete
                                        ? "bg-slate-50 dark:bg-slate-800/50"
                                        : "bg-slate-100/50 dark:bg-slate-800/30"
                                )}
                                title={section.title}
                            >
                                {/* Icon Container */}
                                <div className={cn(
                                    "relative w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                                    section.isComplete
                                        ? "bg-green-100 dark:bg-green-900/30"
                                        : "bg-slate-200 dark:bg-slate-700"
                                )}>
                                    {Icon && (
                                        <Icon className={cn(
                                            "w-5 h-5 transition-colors",
                                            section.isComplete
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-slate-400 dark:text-slate-500"
                                        )} />
                                    )}

                                    {/* Checkmark Badge */}
                                    {section.isComplete && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                                            <Check className="w-2.5 h-2.5 text-white" />
                                        </div>
                                    )}
                                </div>

                                {/* Section Title - Shows on hover */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-brand-navy dark:bg-slate-700 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                                    {section.title}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-brand-navy dark:bg-slate-700 rotate-45"></div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Completion Message */}
                {isAllComplete && (
                    <div className="mt-6 p-4 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800/50 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                                    Congratulations! You've completed all setup sections.
                                </p>
                                <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                                    Sophiie is now fully trained and ready to assist your customers.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
