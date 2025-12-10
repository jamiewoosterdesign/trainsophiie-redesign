import React from 'react';
import { Label } from '@/components/ui/label';
import { Info, Sparkles } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function WizardField({
    label,
    tooltip,
    required = false,
    children,
    className = "",
    tooltipOpen,
    onTooltipToggle,
    error,
    isAutoFilled
}) {
    // If we have an external tooltip controller (for mobile toggle support), use it.
    // Otherwise rely on default hover (though effectively we want external control for mobile).

    return (
        <div className={className}>
            {label && (
                <div className="flex items-center justify-between mb-1.5">
                    <Label className={`flex items-center gap-2 ${error ? 'text-red-500' : ''}`}>
                        {label} {required && "*"}
                        {tooltip && (
                            <TooltipProvider>
                                <Tooltip
                                    delayDuration={0}
                                    open={tooltipOpen}
                                    onOpenChange={onTooltipToggle}
                                >
                                    <TooltipTrigger asChild onClick={(e) => {
                                        e.preventDefault();
                                        if (onTooltipToggle) onTooltipToggle(!tooltipOpen);
                                    }}>
                                        <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                        <p>{tooltip}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </Label>
                    {isAutoFilled && (
                        <div className="flex items-center gap-1.5 text-emerald-600 animate-in fade-in bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md shadow-sm border border-emerald-100 dark:border-emerald-900/50">
                            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">AI Auto-filled</span>
                            <Sparkles className="w-3 h-3" />
                        </div>
                    )}
                </div>
            )}
            {children}
            {typeof error === 'string' && error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
}
