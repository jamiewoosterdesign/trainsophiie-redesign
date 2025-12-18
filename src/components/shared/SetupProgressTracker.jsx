import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Check, ArrowRightLeft, Sparkles, AlertCircle, Layers, ChevronRight,
    Briefcase, Wrench, ShoppingBag, Book, ListChecks, HelpCircle, ShieldAlert,
    Users, Bell, Tag, Mic, MessageSquare, Activity, CheckCircle2, AlertTriangle,
    Smartphone, Phone, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
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

    const handleMarkDivertDone = () => {
        setDivertStatus(prev => ({ ...prev, [selectedDivertType]: true }));
        setIsDivertModalOpen(false);
    };

    const handleToggleDivertStatus = (e, type) => {
        e.stopPropagation(); // Prevent opening modal if clicking the checkmark area directly (optional UX choice, usually clicking item opens modal)
        // Actually, let's keep it simple: clicking item opens modal. Toggling is done inside modal or maybe we add a visual indicator here.
        // User asked: "manually mark as complete when they press on an item" - usually implies a toggle or action. 
        // But also "modals... need an option within them to mark as done". 
        // Let's rely on the modal "Mark as Done" button for the primary action to mark true. 
        // But if user wants to toggle OFF, they might need a way? Let's just follow instructions: "mark as complete when they press on an item" could mean the interaction flow.
        // I'll stick to: Click item -> Open Modal -> Click "Mark Done" -> Modal Closes & Item gets Checkmark.
    };

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
    const countableItems = [...requiredItems, ...recommendedItems];
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
        <Card className="mb-8 border border-slate-200 dark:border-slate-800 relative bg-[#F4FBFF] dark:bg-slate-900/40 backdrop-blur-sm rounded-2xl shadow-sm dark:shadow-none">
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

            {/* Show All Link (Top Right) */}
            <div className="absolute top-6 right-8 z-20">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onShowAll}
                    className="h-6 px-2 text-slate-500 hover:text-slate-900 font-medium dark:text-slate-400 dark:hover:text-slate-200 hover:bg-transparent"
                >
                    Show All<span className="hidden sm:inline">&nbsp;Sections</span> <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>

            <div className="flex flex-col xl:flex-row relative z-10 p-6 md:p-8 gap-8">

                {/* Left Side: Identity & Actions - Tighter Stacking */}
                <div className="w-full xl:w-80 flex flex-col items-center flex-shrink-0 pb-8 xl:pb-0 xl:pr-8 border-b xl:border-b-0 xl:border-r border-slate-100 dark:border-slate-800 xl:border-none my-auto">
                    <div className="flex-1 flex flex-col items-center justify-center w-full">
                        <div className="relative mb-6 group cursor-pointer" onClick={() => navigate('/voice')}>
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

                        {/* Description Text */}
                        <p className="text-xs text-center text-slate-500 dark:text-slate-400 leading-relaxed px-5 w-full mt-1">
                            {areRequiredComplete
                                ? "Required steps are all complete. You can now divert calls to start using Sophiie."
                                : "Complete all Required sections to activate call diversion."}
                        </p>

                        {/* Activate Button / Dropdown */}
                        <div className="mt-6">
                            {!areRequiredComplete ? (
                                <TooltipProvider>
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <span tabIndex={0} className="inline-block cursor-default">
                                                <Button
                                                    disabled
                                                    className="justify-between gap-2 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-transparent dark:border-slate-700"
                                                >
                                                    <span className="flex items-center"><ArrowRightLeft className="w-4 h-4 mr-2" /> Divert Calls</span>
                                                </Button>
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-none">
                                            <p>Please complete all Required steps to activate call diversion.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            className="justify-between gap-2 group"
                                        >
                                            <span className="flex items-center"><ArrowRightLeft className="w-4 h-4 mr-2" /> Divert Calls</span>
                                            <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-64 p-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-xl" align="center">
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
                </div>

                <div className="flex-1 min-w-0">
                    <div className="space-y-8 mt-4">
                        {/* Required Section */}
                        <div>
                            <SectionHeader title="Required Steps" icon={AlertCircle} />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {requiredItems.map(item => (
                                    <ProgressItem key={item.id} item={item} />
                                ))}
                            </div>
                        </div>

                        {/* Recommended Section */}
                        {recommendedItems.length > 0 && (
                            <div>
                                <SectionHeader title="Recommended Improvements" icon={Sparkles} />
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {recommendedItems.map(item => (
                                        <ProgressItem key={item.id} item={item} />
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
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
        </Card>
    );
}
