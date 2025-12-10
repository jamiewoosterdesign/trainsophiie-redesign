import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export function PageSectionNav({ sections, activeSection, onNavigate }) {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (onNavigate) onNavigate(id);
        }
    };

    return (
        <>
            {/* Desktop: Horizontal Tab Bar */}
            <div className="hidden md:block sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="w-full flex justify-center px-8">
                    <div className="w-full max-w-7xl overflow-x-auto py-3 scrollbar-hide" style={{
                        scrollbarWidth: 'none', /* Firefox */
                        msOverflowStyle: 'none', /* IE and Edge */
                    }}>
                        {/* Hide scrollbar for Chrome, Safari and Opera */}
                        <style>{`
                            .scrollbar-hide::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        <div className="flex items-center justify-center gap-2 min-w-max">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0",
                                        activeSection === section.id
                                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                                    )}
                                >
                                    {/* Completion Indicator */}
                                    <div className={cn(
                                        "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                                        section.isComplete
                                            ? "bg-green-500 text-white"
                                            : "border-2 border-slate-300 dark:border-slate-600"
                                    )}>
                                        {section.isComplete && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                                    </div>
                                    <span>{section.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile: Dropdown Selector */}
            <div className="md:hidden sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm p-4">
                <Select
                    value={activeSection || sections[0]?.id}
                    onValueChange={(value) => scrollToSection(value)}
                >
                    <SelectTrigger className="w-full bg-white dark:bg-slate-800 dark:border-slate-700">
                        <SelectValue placeholder="Jump to section..." />
                    </SelectTrigger>
                    <SelectContent>
                        {sections.map((section) => (
                            <SelectItem key={section.id} value={section.id}>
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0",
                                        section.isComplete
                                            ? "bg-green-500 text-white"
                                            : "border-2 border-slate-300 dark:border-slate-600"
                                    )}>
                                        {section.isComplete && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                                    </div>
                                    <span>{section.title}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </>
    );
}
