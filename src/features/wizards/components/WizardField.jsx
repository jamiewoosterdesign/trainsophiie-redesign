
import React from 'react';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';
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
    error
}) {
    // If we have an external tooltip controller (for mobile toggle support), use it.
    // Otherwise rely on default hover (though effectively we want external control for mobile).

    return (
        <div className={className}>
            {label && (
                <Label className={`mb-1.5 flex items-center gap-2 ${error ? 'text-red-500' : ''}`}>
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
            )}
            {children}
            {typeof error === 'string' && error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
}
