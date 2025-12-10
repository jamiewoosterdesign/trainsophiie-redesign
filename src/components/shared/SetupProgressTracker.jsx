import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export function SetupProgressTracker() {
    const navigate = useNavigate();
    const [expandedSection, setExpandedSection] = useState(null);
    const dropdownRefs = useRef({});

    // Setup progress data organized by sections
    const setupSections = [
        {
            id: 'knowledge',
            title: 'Knowledge Base',
            pages: [
                { id: 'business-info', title: 'Business Information', isComplete: true, route: '/business-info' },
                { id: 'services', title: 'Services', isComplete: true, route: '/services' },
                { id: 'products', title: 'Products', isComplete: true, route: '/products' },
                { id: 'documents', title: 'Documents', isComplete: true, route: '/knowledge' },
                { id: 'policies', title: 'Policies & Procedures', isComplete: true, route: '/policies' },
                { id: 'faqs', title: 'FAQs', isComplete: true, route: '/faqs' },
                { id: 'scenarios', title: 'Scenarios', isComplete: false, route: '/scenarios' },
            ]
        },
        {
            id: 'routing',
            title: 'Team & Routing',
            pages: [
                { id: 'staff', title: 'Staff & Departments', isComplete: true, route: '/staff' },
                { id: 'transfers', title: 'Transfers', isComplete: true, route: '/transfers' },
                { id: 'notifications', title: 'Notifications', isComplete: true, route: '/notifications' },
                { id: 'tags', title: 'Tags', isComplete: true, route: '/tags' },
            ]
        },
        {
            id: 'personality',
            title: 'Personality',
            pages: [
                { id: 'voice', title: 'Voice & Personality', isComplete: false, route: '/voice' },
                { id: 'greetings', title: 'Greetings & Closings', isComplete: true, route: '/greetings' },
                { id: 'behaviors', title: 'Behaviors', isComplete: false, route: '/behaviors' },
            ]
        }
    ];

    // Calculate overall progress
    const totalPages = setupSections.reduce((sum, section) => sum + section.pages.length, 0);
    const completedPages = setupSections.reduce((sum, section) =>
        sum + section.pages.filter(p => p.isComplete).length, 0
    );
    const overallProgress = Math.round((completedPages / totalPages) * 100);
    const remainingSteps = totalPages - completedPages;

    const handlePageClick = (route) => {
        navigate(route);
        setExpandedSection(null); // Close dropdown after navigation
    };

    const toggleSection = (sectionId) => {
        setExpandedSection(prev => prev === sectionId ? null : sectionId);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (expandedSection && dropdownRefs.current[expandedSection]) {
                if (!dropdownRefs.current[expandedSection].contains(event.target)) {
                    setExpandedSection(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [expandedSection]);

    return (
        <Card className="mb-8 shadow-sm">
            <div className="p-5 md:p-6">
                {/* Desktop Layout - Two Columns */}
                <div className="hidden md:flex gap-8">
                    {/* Left Column - Title and Subtitle */}
                    <div className="w-48 flex-shrink-0">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                            Setup Progress
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug">
                            Only {remainingSteps} steps left until Sophiie is ready
                        </p>
                    </div>

                    {/* Right Column - Progress Bar + Dropdowns */}
                    <div className="flex-1">
                        {/* Progress Bar */}
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                            <div
                                className="h-full bg-blue-500 transition-all duration-700 rounded-full"
                                style={{ width: `${overallProgress}%` }}
                            />
                        </div>

                        {/* Section Dropdowns Row */}
                        <div className="grid grid-cols-3 gap-3">
                            {setupSections.map((section) => {
                                const completed = section.pages.filter(p => p.isComplete).length;
                                const total = section.pages.length;
                                const isComplete = completed === total;
                                const isExpanded = expandedSection === section.id;

                                return (
                                    <div key={section.id} className="relative" ref={el => dropdownRefs.current[section.id] = el}>
                                        <button
                                            onClick={() => toggleSection(section.id)}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            className={cn(
                                                "w-full px-4 py-3 rounded-lg border transition-all text-sm font-medium flex items-center justify-between",
                                                isComplete
                                                    ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400"
                                                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                            )}
                                        >
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <span className={cn(
                                                    "font-semibold truncate",
                                                    isComplete && "text-green-700 dark:text-green-400"
                                                )}>
                                                    {section.title}
                                                </span>
                                                <span className={cn(
                                                    "text-xs font-normal whitespace-nowrap",
                                                    isComplete
                                                        ? "text-green-600 dark:text-green-500"
                                                        : "text-slate-500 dark:text-slate-400"
                                                )}>
                                                    {completed}/{total}
                                                </span>
                                            </div>
                                            <ChevronDown className={cn(
                                                "w-4 h-4 ml-2 flex-shrink-0 transition-transform",
                                                isExpanded && "rotate-180",
                                                isComplete ? "text-green-600 dark:text-green-500" : "text-slate-400"
                                            )} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {isExpanded && (
                                            <div className="absolute left-0 right-0 top-full mt-1 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                                                <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 py-1 max-h-64 overflow-y-auto">
                                                    {section.pages.map((page) => (
                                                        <button
                                                            key={page.id}
                                                            onClick={() => handlePageClick(page.route)}
                                                            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group text-left"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                {/* CheckCircle style matching overview cards */}
                                                                {page.isComplete ? (
                                                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                                ) : (
                                                                    <CheckCircle className="w-5 h-5 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                                                                )}
                                                                <span className={cn(
                                                                    "text-sm font-medium",
                                                                    page.isComplete
                                                                        ? "text-slate-700 dark:text-slate-300"
                                                                        : "text-slate-600 dark:text-slate-400"
                                                                )}>
                                                                    {page.title}
                                                                </span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden space-y-4">
                    {/* Title */}
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                            Setup Progress
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            Only {remainingSteps} steps left until Sophiie is ready
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-700 rounded-full"
                            style={{ width: `${overallProgress}%` }}
                        />
                    </div>

                    {/* Section Dropdowns */}
                    <div className="space-y-2">
                        {setupSections.map((section) => {
                            const completed = section.pages.filter(p => p.isComplete).length;
                            const total = section.pages.length;
                            const isComplete = completed === total;
                            const isExpanded = expandedSection === section.id;

                            return (
                                <div key={section.id} className="relative" ref={el => dropdownRefs.current[section.id] = el}>
                                    <button
                                        onClick={() => toggleSection(section.id)}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        className={cn(
                                            "w-full px-3 py-2.5 rounded-lg border transition-all text-sm font-medium flex items-center justify-between",
                                            isComplete
                                                ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400"
                                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "font-semibold text-xs",
                                                isComplete && "text-green-700 dark:text-green-400"
                                            )}>
                                                {section.title}
                                            </span>
                                            <span className={cn(
                                                "text-xs",
                                                isComplete
                                                    ? "text-green-600 dark:text-green-500"
                                                    : "text-slate-500 dark:text-slate-400"
                                            )}>
                                                {completed}/{total}
                                            </span>
                                        </div>
                                        <ChevronDown className={cn(
                                            "w-3.5 h-3.5 transition-transform",
                                            isExpanded && "rotate-180",
                                            isComplete ? "text-green-600 dark:text-green-500" : "text-slate-400"
                                        )} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isExpanded && (
                                        <div className="absolute left-0 right-0 top-full mt-1 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                                            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 py-1">
                                                {section.pages.map((page) => (
                                                    <button
                                                        key={page.id}
                                                        onClick={() => handlePageClick(page.route)}
                                                        className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {/* CheckCircle style matching overview cards */}
                                                            {page.isComplete ? (
                                                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                            ) : (
                                                                <CheckCircle className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                                                            )}
                                                            <span className={cn(
                                                                "text-xs font-medium",
                                                                page.isComplete
                                                                    ? "text-slate-700 dark:text-slate-300"
                                                                    : "text-slate-600 dark:text-slate-400"
                                                            )}>
                                                                {page.title}
                                                            </span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Card>
    );
}
