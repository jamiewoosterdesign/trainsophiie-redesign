import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import sophiieAvatar from '@/avatars/sophiie-avatar.png';

export function SetupProgressTracker() {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(1);
    const [isExpanded, setIsExpanded] = useState(false);

    const steps = [
        {
            id: 1,
            title: "Knowledge Base",
            description: "Build the foundation of your AI's knowledge.",
            tip: "Ensure your Knowledge Base is comprehensive so Sophiie can answer questions accurately.",
            items: [
                { id: 'business-info', title: 'Business Info', subtitle: 'Basic info, Location, Trading Hours', route: '/business-info', isComplete: true, tags: ['Required'] },
                { id: 'services', title: 'Services', subtitle: 'Service Name, Duration, Price', route: '/services', isComplete: true, tags: ['Required'] },
                { id: 'faqs', title: 'FAQs', subtitle: 'Common customer questions', route: '/faqs', isComplete: true, tags: ['Recommended'] },
                { id: 'products', title: 'Products', subtitle: 'Product catalog', route: '/products', isComplete: true, tags: ['Optional'] },
                { id: 'documents', title: 'Documents', subtitle: 'Upload PDFs & Files', route: '/knowledge', isComplete: true, tags: ['Optional'] },
                { id: 'policies', title: 'Policies', subtitle: 'Rules & Procedures', route: '/policies', isComplete: true, tags: ['Optional'] },
                { id: 'scenarios', title: 'Scenarios', subtitle: 'Edge cases', route: '/scenarios', isComplete: false, tags: ['Advanced'] }
            ]
        },
        {
            id: 2,
            title: "Team & Routing",
            description: "Define how calls and messages are distributed.",
            tip: "Make sure you complete all red required fields before diverting your calls to Sophiie.",
            items: [
                { id: 'staff', title: 'Staff & Departments', subtitle: 'Team members & groups', route: '/staff', isComplete: true, tags: ['Recommended'] },
                { id: 'transfers', title: 'Transfers', subtitle: 'Call handoff logic', route: '/transfers', isComplete: true, tags: ['Recommended'] },
                { id: 'notifications', title: 'Notifications', subtitle: 'Alert settings', route: '/notifications', isComplete: true, tags: ['Advanced'] },
                { id: 'tags', title: 'Tags', subtitle: 'Conversation labeling', route: '/tags', isComplete: true, tags: ['Advanced'] }
            ]
        },
        {
            id: 3,
            title: "Personality & Behavior",
            description: "Fine-tune how Sophiie speaks and interacts.",
            tip: "Review these settings to ensure Sophiie matches your brand's voice and handles conversations seamlessly.",
            items: [
                { id: 'greetings', title: 'Greetings & Closings', subtitle: 'Custom conversation scripts', route: '/greetings', isComplete: true, tags: ['Recommended'] },
                { id: 'voice', title: 'Voice & Personality', subtitle: 'Tone, Attitude, Voice selection', route: '/voice', isComplete: false, tags: ['Advanced'] },
                { id: 'behaviors', title: 'Behaviors', subtitle: 'Interruption & Speed', route: '/behaviors', isComplete: false, tags: ['Advanced'] }
            ]
        }
    ];

    const currentStepData = steps.find(s => s.id === activeStep);

    // Filter logic: show top 4 initially
    const visibleItems = isExpanded ? currentStepData.items : currentStepData.items.slice(0, 4);
    const hasMoreItems = currentStepData.items.length > 4;

    // Reset expansion when step changes
    useEffect(() => {
        setIsExpanded(false);
    }, [activeStep]);

    const handleNext = () => {
        if (activeStep < steps.length) setActiveStep(activeStep + 1);
    };

    const handlePrev = () => {
        if (activeStep > 1) setActiveStep(activeStep - 1);
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

    return (
        <Card className="mb-8 shadow-lg shadow-slate-200/50 dark:shadow-none overflow-hidden border-0 relative bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-6">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Top Navigation Badge - Pinned to absolute top left, closer to edges */}
            <div className="absolute top-4 left-4 z-20">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
                    Setup Progress
                </span>
            </div>

            <div className="flex flex-col md:flex-row relative z-10 gap-8 min-h-[300px]">

                {/* Left Side: Avatar, Static Title - Top Aligned */}
                <div className="md:w-1/3 flex flex-col items-center text-center justify-start md:max-w-xs mx-auto pt-8 pb-6 md:pb-0">
                    <div className="relative mb-5">
                        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full animate-pulse" />
                        <img
                            src={sophiieAvatar}
                            alt="Sophiie"
                            className="relative w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-xl"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" strokeWidth={4} />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 leading-tight w-full">
                        Setup Progress
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 w-full leading-relaxed px-6">
                        {currentStepData.tip}
                    </p>
                </div>

                {/* Right Side: Header & Step Content - Top Aligned */}
                <div className="flex-1 flex flex-col">

                    {/* Right Panel Header: Title/Desc Left | Counter Right */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pt-2">
                        <div className="text-left">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                {currentStepData.title}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {currentStepData.description}
                            </p>
                        </div>

                        {/* Step Counter Controls - Solid Background */}
                        <div className="flex items-center bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 p-1 shadow-sm flex-shrink-0 self-start sm:self-end">
                            <button
                                onClick={handlePrev}
                                disabled={activeStep === 1}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-600 dark:text-slate-300"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="mx-3 text-xs font-semibold text-slate-600 dark:text-slate-300 w-12 text-center select-none">
                                {activeStep} of {steps.length}
                            </span>
                            <button
                                onClick={handleNext}
                                disabled={activeStep === steps.length}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-600 dark:text-slate-300"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 transition-all duration-300 ease-in-out">
                        {visibleItems.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => navigate(item.route)}
                                className={cn(
                                    "group flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer h-full animate-in fade-in slide-in-from-right-2 duration-300 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900",
                                    item.isComplete
                                        ? "border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md"
                                        : "border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md ring-1 ring-transparent hover:ring-blue-100 dark:hover:ring-blue-900/20"
                                )}
                            >
                                <div className={cn(
                                    "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors mt-0.5",
                                    item.isComplete
                                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                        : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400"
                                )}>
                                    {item.isComplete ? <Check className="w-3 h-3" strokeWidth={3} /> : <div className="w-1.5 h-1.5 bg-current rounded-full" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                                        <h4 className={cn(
                                            "font-semibold text-sm truncate",
                                            item.isComplete ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white"
                                        )}>
                                            {item.title}
                                        </h4>
                                        <div className="flex gap-1 flex-shrink-0">
                                            {item.tags.map(tag => (
                                                <span key={tag} className={cn(
                                                    "text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider",
                                                    getTagStyle(tag)
                                                )}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                        {item.subtitle}
                                    </p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 self-center flex-shrink-0" />
                            </div>
                        ))}
                    </div>

                    {/* Show More / Show Less Toggle */}
                    {hasMoreItems && (
                        <div className="flex justify-center mt-3">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                title={isExpanded ? "Show Less" : "Show All"}
                            >
                                {isExpanded ? (
                                    <ChevronUp className="w-4 h-4" />
                                ) : (
                                    <ChevronDown className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
