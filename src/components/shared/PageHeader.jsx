import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function PageHeader({
    title,
    subtitle,
    scrollDirection,
    onBack,
    backPath = '/overview',
    showBackButton = true,
    icon,
    className,
    children
}) {
    const navigate = useNavigate();
    const handleBack = onBack || (() => navigate(backPath));

    const isScrolledDown = scrollDirection === 'down';

    return (
        <header className={cn(
            "bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-4 md:px-8 md:py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 shrink-0 sticky top-0 z-30 transition-shadow duration-300",
            className
        )}>
            <div className={cn(
                "flex gap-4 transition-all duration-300",
                isScrolledDown ? "items-center" : "items-start"
            )}>
                {showBackButton && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleBack}
                        className={cn(
                            "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 shrink-0 transition-all duration-300",
                            isScrolledDown ? "mt-0" : "mt-1"
                        )}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                )}
                <div>
                    <div className="flex items-center gap-3">
                        {icon && icon}
                        <div>
                            <h1 className={cn(
                                "font-bold text-slate-900 dark:text-white transition-all duration-300",
                                isScrolledDown ? "text-lg" : "text-xl md:text-2xl"
                            )}>
                                {title}
                            </h1>
                            {subtitle && (
                                <p className={cn(
                                    "text-slate-500 dark:text-slate-400 text-sm transition-all duration-300",
                                    isScrolledDown ? "max-h-0 opacity-0 mt-0" : "max-h-20 opacity-100 mt-1"
                                )}>
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {children && (
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    {children}
                </div>
            )}
        </header>
    );
}
