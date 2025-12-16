import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Check, X, ChevronRight, ArrowRightLeft, Sparkles, AlertCircle, Layers,
    Briefcase, Wrench, ShoppingBag, Book, ListChecks, HelpCircle, ShieldAlert,
    Users, Bell, Tag, Mic, MessageSquare, Activity, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import sophiieProfile from '@/images/sophiie-profile2-white-bg.png';
import { useDemo } from '@/context/DemoContext';
import { Button } from '@/components/ui/button';

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

export function SetupProgressModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const { setupProgress } = useDemo();

    if (!isOpen) return null;

    // Helper to find item
    const getItem = (id) => setupProgress.find(i => i.id === id) || { id, title: id, subtitle: '', route: '#', isComplete: false };

    // Grouping
    const requiredItems = [getItem('business-info'), getItem('services')];
    const recommendedItems = [getItem('faqs'), getItem('staff'), getItem('transfers'), getItem('greetings')];
    const optionalItems = [getItem('products'), getItem('documents'), getItem('policies'), getItem('scenarios')];
    const advancedItems = [getItem('voice'), getItem('behaviors'), getItem('tags'), getItem('notifications')];

    // Progress Calculation
    const countableItems = [...requiredItems, ...recommendedItems, ...optionalItems];
    const completedCount = countableItems.filter(i => i.isComplete).length;
    const totalCount = countableItems.length;
    // Safety check for 0 to avoid NaN
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const areRequiredComplete = requiredItems.every(i => i.isComplete);

    const handleItemClick = (route) => {
        navigate(route);
        onClose();
    };

    const ProgressItem = ({ item }) => {
        const Icon = ICON_MAP[item.id] || Layers;
        const isComplete = item.isComplete;

        return (
            <div
                onClick={() => handleItemClick(item.route)}
                className="group flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all cursor-pointer"
            >
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 transition-colors">
                        <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className={cn(
                            "text-sm font-bold truncate transition-colors",
                            isComplete ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white"
                        )}>
                            {item.title}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                            {item.subtitle}
                        </span>
                    </div>
                </div>

                <div className="pl-3">
                    {isComplete ? (
                        <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-1 animate-in zoom-in">
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                    ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-700 group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-colors" />
                    )}
                </div>
            </div>
        );
    };

    // New Header Style (Title Case, Darker)
    const SectionHeader = ({ title, icon: Icon, className }) => (
        <h3 className={cn("text-xs font-bold mb-2 flex items-center gap-2 px-1 mt-5 first:mt-1", className || "text-slate-700 dark:text-slate-300")}>
            {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
            {title}
        </h3>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-slate-50 dark:bg-slate-950 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="relative bg-white dark:bg-slate-900 p-6 flex flex-col items-center text-center border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>

                    <div className="relative mb-4">
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                        <img
                            src={sophiieProfile}
                            alt="Sophiie"
                            className="relative w-20 h-20 rounded-full object-cover ring-2 ring-white dark:ring-slate-900 shadow-lg"
                        />
                        {/* Avatar Checkmark - Consistent with grid items (Bottom Left or Right) */}
                        {progressPercentage === 100 && (
                            <div className="absolute bottom-0 right-0 bg-green-100 dark:bg-green-900/90 rounded-full p-1 shadow-lg z-20 ring-2 ring-white dark:ring-slate-950 animate-in zoom-in">
                                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                        )}
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                        Setup Progress
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
                        {completedCount} of {totalCount} steps completed ({progressPercentage}%)
                    </p>

                    <div className="w-64 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Content - Single Column Layout */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                    <SectionHeader title="Required Steps" icon={AlertCircle} />
                    <div className="grid grid-cols-1 gap-3">
                        {requiredItems.map(item => <ProgressItem key={item.id} item={item} />)}
                    </div>

                    <SectionHeader title="Recommended Improvements" icon={Sparkles} />
                    <div className="grid grid-cols-1 gap-3">
                        {recommendedItems.map(item => <ProgressItem key={item.id} item={item} />)}
                    </div>

                    <SectionHeader title="Optional" icon={Layers} />
                    <div className="grid grid-cols-1 gap-3">
                        {optionalItems.map(item => <ProgressItem key={item.id} item={item} />)}
                    </div>

                    <SectionHeader title="Advanced" icon={AlertTriangle} className="text-amber-600 dark:text-amber-500" />
                    <div className="grid grid-cols-1 gap-3">
                        {advancedItems.map(item => <ProgressItem key={item.id} item={item} />)}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
                    <div className="flex flex-col text-left">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {areRequiredComplete ? "Activate Sophiie" : "Setup Incomplete"}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {areRequiredComplete
                                ? "Mandatory steps complete. You can now divert calls."
                                : "Complete all Required sections to activate call diversion."}
                        </p>
                    </div>

                    <Button
                        onClick={() => { if (areRequiredComplete) { navigate('/activation'); onClose(); } }}
                        disabled={!areRequiredComplete}
                        className={cn(
                            "shadow-md text-xs font-bold uppercase tracking-wider h-10 px-6 rounded-xl transition-all",
                            areRequiredComplete
                                ? "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
                                : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none"
                        )}
                    >
                        Divert Calls Now {areRequiredComplete && <ArrowRightLeft className="w-3.5 h-3.5 ml-2" />}
                    </Button>
                </div>

            </div>
        </div>
    );
}
