import React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AddNewCard({
    title,
    description,
    onClick,
    className,
    icon: Icon = Plus,
    variant = "default" // "default" | "compact"
}) {
    if (variant === "compact") {
        return (
            <button
                onClick={onClick}
                className={cn(
                    "w-full flex items-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium gap-3 group text-left",
                    className
                )}
            >
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex flex-col">
                    <span className="font-medium">{title}</span>
                    {description && (
                        <span className="text-xs opacity-70 font-normal">{description}</span>
                    )}
                </div>
            </button>
        );
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                "hidden md:flex border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all min-h-[240px] group gap-3",
                className
            )}
        >
            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-0 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-blue-500" />
            </div>
            <span className="font-medium">{title}</span>
            {description && (
                <p className="text-xs text-center opacity-70 font-normal max-w-[80%]">
                    {description}
                </p>
            )}
        </button>
    );
}
