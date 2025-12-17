import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Check, ArrowRightLeft, Sparkles, AlertCircle, Layers, ChevronRight,
    Briefcase, Wrench, ShoppingBag, Book, ListChecks, HelpCircle, ShieldAlert,
    Users, Bell, Tag, Mic, MessageSquare, Activity, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import sophiieProfile from '@/images/sophiie-profile2-white-bg.png';
import { useDemo } from '@/context/DemoContext';
import { DivertCallsModal } from '@/components/modals/DivertCallsModal';

const ICON_MAP = {
    'business-info': Briefcase,
    'services': Wrench,
    'products': ShoppingBag,
    'documents': Book,
    'policies': ListChecks,
    'faqs': HelpCircle,
    'scenarios': ShieldAlert,
    'staff': Users,
    'transfers': ArrowRightLeft,
    'notifications': Bell,
    'tags': Tag,
    'voice': Mic,
    'greetings': MessageSquare,
    'behaviors': Activity
};

export function SetupProgressTracker({ onShowAll }) {
    const navigate = useNavigate();
    const { setupProgress } = useDemo();
    const [isDivertModalOpen, setIsDivertModalOpen] = React.useState(false);

    // Helper to find item from context
    const getItem = (id) => setupProgress.find(i => i.id === id) || { id, title: id, subtitle: '', route: '#', isComplete: false, tags: [] };

    const requiredItems = [
        getItem('business-info'),
        getItem('services')
    ];

    const recommendedItems = [
        getItem('faqs'),
        getItem('staff'),
        getItem('transfers'),
        getItem('greetings')
    ];

    // Rest are hidden behind modal
    const optionalItems = [getItem('products'), getItem('documents'), getItem('policies'), getItem('scenarios')];
    const advancedItems = [getItem('voice'), getItem('behaviors'), getItem('tags'), getItem('notifications')];

    // Progress Calculation
    const countableItems = [...requiredItems, ...recommendedItems, ...optionalItems];
    const completedCount = countableItems.filter(i => i.isComplete).length;
    const totalCount = countableItems.length;
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const areRequiredComplete = requiredItems.every(item => item.isComplete);

    const ProgressItem = ({ item }) => {
        const Icon = ICON_MAP[item.id] || Layers;
        const isComplete = item.isComplete;

        return (
            <div
                onClick={() => navigate(item.route)}
                className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer h-full"
            >
                <div className="flex items-center gap-4 min-w-0">
                    {/* Item Icon - Always Grey */}
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 transition-colors">
                        <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex flex-col min-w-0">
                        <span className={cn(
                            "text-sm font-bold truncate transition-colors mb-0.5",
                            isComplete ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white"
                        )}>
                            {item.title}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 truncate">
                            {item.subtitle}
                        </span>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="pl-4">
                    {isComplete ? (
                        <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-1 animate-in zoom-in">
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                    ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 dark:border-slate-700 group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-colors" />
                    )}
                </div>
            </div>
        );
    };

    const SectionHeader = ({ title, icon: Icon }) => (
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2 px-1 mt-2">
            {Icon && <Icon className="w-5 h-5 text-slate-800 dark:text-slate-200" />}
            {title}
        </h3>
    );

    return (
        <Card className="mb-8 overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-[#F4FBFF] dark:bg-slate-900/40 backdrop-blur-sm rounded-2xl shadow-sm dark:shadow-none">
            {/* Vibrant Background Blurs */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-pink-500/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

            {/* Title Badge (Top Left) - Tag Style (White/Grey) */}
            <div className="absolute top-6 left-8 z-20">
                <span className="px-2 h-6 flex items-center rounded text-xs font-medium border bg-white text-slate-600 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-700">
                    Setup Progress
                </span>
            </div>

            <div className="flex flex-col md:flex-row relative z-10 p-6 md:p-8 gap-8">

                {/* Left Side: Identity & Actions - Tighter Stacking */}
                <div className="md:w-80 flex flex-col items-center flex-shrink-0 pb-6 md:pb-0 md:pr-8">
                    <div className="flex-1 flex flex-col items-center justify-center w-full mt-10">
                        <div className="relative mb-4 group cursor-pointer" onClick={() => navigate('/voice')}>
                            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full group-hover:bg-blue-500/30 transition-all duration-500" />
                            <img
                                src={sophiieProfile}
                                alt="Sophiie"
                                className="relative w-32 h-32 rounded-full object-cover ring-2 ring-white dark:ring-slate-900 shadow-xl group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{progressPercentage}% Complete</span>
                        </div>
                        <div className="h-1.5 w-full max-w-[140px] bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                            {/* Always Gradient Progress Bar */}
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>

                        {/* Description Text - Matching width of button below (p-5 equivalent padding) */}
                        <p className="text-xs text-center text-slate-500 dark:text-slate-400 leading-relaxed px-5 w-full">
                            {areRequiredComplete
                                ? "Required steps are all complete. You can now divert calls to start using Sophiie."
                                : "Complete all Required sections to activate call diversion."}
                        </p>
                    </div>

                    {/* Activation Card - Simplified */}
                    <div className="w-full mt-8">
                        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4">
                                Activate Sophiie Now
                            </h3>

                            <Button
                                onClick={() => areRequiredComplete && setIsDivertModalOpen(true)}
                                disabled={!areRequiredComplete}
                                className={cn(
                                    "w-full h-10 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
                                    areRequiredComplete
                                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                                        : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none"
                                )}
                            >
                                Divert Calls {areRequiredComplete && <ArrowRightLeft className="w-3.5 h-3.5 ml-2" />}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="space-y-8 mt-4">
                        {/* Required Section */}
                        <div>
                            <SectionHeader title="Required Steps" icon={AlertCircle} />
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                {requiredItems.map(item => (
                                    <ProgressItem key={item.id} item={item} />
                                ))}
                            </div>
                        </div>

                        {/* Recommended Section */}
                        {recommendedItems.length > 0 && (
                            <div>
                                <SectionHeader title="Recommended Improvements" icon={Sparkles} />
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                    {recommendedItems.map(item => (
                                        <ProgressItem key={item.id} item={item} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Show All Button - "Edit >" Style */}
                        <div className="flex justify-end pt-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onShowAll}
                                className="h-8 px-2 text-slate-600 hover:text-slate-900 font-medium dark:text-slate-400 dark:hover:text-slate-200"
                            >
                                Show All Sections <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <DivertCallsModal isOpen={isDivertModalOpen} onClose={() => setIsDivertModalOpen(false)} />
        </Card>
    );
}
