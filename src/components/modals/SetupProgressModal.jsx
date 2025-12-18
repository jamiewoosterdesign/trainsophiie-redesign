import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Check, X, ChevronRight, ArrowRightLeft, Sparkles, AlertCircle, Layers,
    Briefcase, Wrench, ShoppingBag, Book, ListChecks, HelpCircle, ShieldAlert,
    Users, Bell, Tag, Mic, MessageSquare, Activity, CheckCircle2, AlertTriangle,
    Smartphone, Phone, ChevronDown, ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import sophiieProfile from '@/images/sophiie-profile2-white-bg.png';
import { useDemo } from '@/context/DemoContext';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export function SetupProgressModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const { setupProgress } = useDemo();
    const [isDivertModalOpen, setIsDivertModalOpen] = useState(false);
    const [selectedDivertType, setSelectedDivertType] = useState('iphone');

    // Divert Status State (Persisted)
    const [divertStatus, setDivertStatus] = useState(() => {
        const saved = localStorage.getItem('sophiie_divert_status');
        return saved ? JSON.parse(saved) : { iphone: false, android: false, landline: false };
    });

    useEffect(() => {
        localStorage.setItem('sophiie_divert_status', JSON.stringify(divertStatus));
    }, [divertStatus]);

    const handleDivertClick = (type) => {
        setSelectedDivertType(type);
        setIsDivertModalOpen(true);
    };

    if (!isOpen) return null;

    // Helper to find item
    const getItem = (id) => setupProgress.find(i => i.id === id) || { id, title: id, subtitle: '', route: '#', isComplete: false };

    // Grouping
    const requiredItems = [getItem('business-info'), getItem('services')];
    const recommendedItems = [getItem('faqs'), getItem('staff'), getItem('transfers'), getItem('greetings')];
    const optionalItems = [getItem('products'), getItem('documents'), getItem('policies'), getItem('scenarios')];
    const advancedItems = [getItem('voice'), getItem('behaviors'), getItem('tags'), getItem('notifications')];

    // Progress Calculation
    const countableItems = [...requiredItems, ...recommendedItems];
    const completedCount = countableItems.filter(i => i.isComplete).length;
    const totalCount = countableItems.length;
    // Safety check for 0 to avoid NaN
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const areRequiredComplete = requiredItems.every(i => i.isComplete);

    const handleItemClick = (route) => {
        navigate(route);
        onClose();
    };

    const ProgressItem = ({ item, trackProgress = true }) => {
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
                            isComplete && trackProgress ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white"
                        )}>
                            {item.title}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                            {item.subtitle}
                        </span>
                    </div>
                </div>

                <div className="pl-3">
                    {trackProgress ? (
                        isComplete ? (
                            <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-1 animate-in zoom-in">
                                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                        ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-700 group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-colors" />
                        )
                    ) : (
                        <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
                    )}
                </div>
            </div>
        );
    };

    // New Header Style (Title Case, Darker)
    const SectionHeader = ({ title, icon: Icon, className }) => (
        <h3 className={cn("text-xs font-bold mb-3 flex items-center gap-2", className || "text-slate-700 dark:text-slate-300")}>
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
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 space-y-8">

                    {/* Core Setup Panel */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 px-1">
                            Core Setup
                            <span className="ml-2 text-xs font-normal text-slate-500">
                                (Impacts completion score)
                            </span>
                        </h3>

                        <div className="space-y-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div>
                                <SectionHeader title="Required Steps" icon={AlertCircle} />
                                <div className="grid grid-cols-1 gap-3">
                                    {requiredItems.map(item => <ProgressItem key={item.id} item={item} />)}
                                </div>
                            </div>

                            <div>
                                <SectionHeader title="Recommended Improvements" icon={Sparkles} />
                                <div className="grid grid-cols-1 gap-3">
                                    {recommendedItems.map(item => <ProgressItem key={item.id} item={item} />)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Configuration Panel */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 px-1">
                            Additional Configuration
                        </h3>

                        <div className="space-y-4 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                            <div>
                                <SectionHeader title="Optional Features" icon={Layers} />
                                <div className="grid grid-cols-1 gap-3">
                                    {optionalItems.map(item => <ProgressItem key={item.id} item={item} trackProgress={false} />)}
                                </div>
                            </div>

                            <div>
                                <SectionHeader title="Advanced Settings" icon={AlertTriangle} className="text-amber-600 dark:text-amber-500" />
                                <div className="grid grid-cols-1 gap-3">
                                    {advancedItems.map(item => <ProgressItem key={item.id} item={item} trackProgress={false} />)}
                                </div>
                            </div>
                        </div>
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

                    {!areRequiredComplete ? (
                        <TooltipProvider>
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <span tabIndex={0} className="inline-block cursor-default">
                                        <Button
                                            disabled
                                            className="justify-between gap-2 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-transparent dark:border-slate-700 h-10 px-4 rounded-xl font-bold text-sm min-w-[180px]"
                                        >
                                            <span className="flex items-center"><ArrowRightLeft className="w-4 h-4 mr-2" /> Divert Calls</span>
                                        </Button>
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-none">
                                    <p>Please complete all Required steps to activate call diversion.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    className="justify-between gap-2 group h-10 px-4 rounded-xl font-bold text-sm min-w-[180px]"
                                >
                                    <span className="flex items-center"><ArrowRightLeft className="w-4 h-4 mr-2" /> Divert Calls</span>
                                    <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" align="end" className="z-[200] w-64 p-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-xl mb-2">
                                <DropdownMenuLabel className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1.5">Select Device Type</DropdownMenuLabel>

                                <DropdownMenuItem onClick={() => handleDivertClick('iphone')} className="flex items-center justify-between p-3 rounded-lg cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-700">
                                            <Smartphone className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm text-slate-900 dark:text-white">iPhone</span>
                                            {divertStatus.iphone && <span className="text-[10px] text-green-600 font-medium">Active</span>}
                                        </div>
                                    </div>
                                    {divertStatus.iphone && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => handleDivertClick('android')} className="flex items-center justify-between p-3 rounded-lg cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800 group mt-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-700">
                                            <Smartphone className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm text-slate-900 dark:text-white">Android</span>
                                            {divertStatus.android && <span className="text-[10px] text-green-600 font-medium">Active</span>}
                                        </div>
                                    </div>
                                    {divertStatus.android && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => handleDivertClick('landline')} className="flex items-center justify-between p-3 rounded-lg cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800 group mt-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-700">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm text-slate-900 dark:text-white">Landline</span>
                                            {divertStatus.landline && <span className="text-[10px] text-green-600 font-medium">Active</span>}
                                        </div>
                                    </div>
                                    {divertStatus.landline && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                </DropdownMenuItem>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

            </div>

            <DivertCallsModal
                isOpen={isDivertModalOpen}
                onClose={() => setIsDivertModalOpen(false)}
                deviceType={selectedDivertType}
                onChangeDeviceType={handleDivertClick}
                divertStatus={divertStatus}
                onMarkDone={(isDone) => {
                    setDivertStatus(prev => ({ ...prev, [selectedDivertType]: isDone }));
                    if (isDone) setIsDivertModalOpen(false);
                }}
            />

        </div>
    );
}
