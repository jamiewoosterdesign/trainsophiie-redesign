
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Wand2 } from 'lucide-react';

export function WizardInput({
    value,
    onChange,
    placeholder,
    highlight,
    className = "",
    iconRight, // For things like $ prefix or other embellishments
    ...props
}) {
    // Determine input classes
    const baseClasses = `transition-all duration-500 ${highlight === 'true' ? 'border-emerald-400 ring-1 ring-emerald-100 bg-emerald-50/10' : ''} ${className}`;

    // Helper for onChange to handle simple values
    const handleChange = (e) => {
        if (onChange) onChange(e.target.value);
    };

    return (
        <Input
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={baseClasses}
            {...props}
        />
    );
}

// The "Smart" Textarea with Mic and Wand icons absolute positioned
// The "Smart" Textarea with Mic and Wand icons in a footer panel
export function WizardTextarea({
    value,
    onChange,
    placeholder,
    className = "",
    highlight,
    enableVoice = true,
    enableAI = true,
    onVoiceClick,
    onAIClick,
    ...props
}) {
    // Wrapper classes to handle focus-within ring and border
    const wrapperClasses = `
        group relative rounded-xl border transition-all overflow-hidden flex flex-col bg-white dark:bg-slate-900
        ${highlight === 'true'
            ? 'border-emerald-400 ring-1 ring-emerald-100 bg-emerald-50/10'
            : 'border-slate-200 dark:border-slate-800 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10'}
        ${className}
    `;

    const handleChange = (e) => {
        if (onChange) onChange(e.target.value);
    };

    return (
        <div className={wrapperClasses}>
            <Textarea
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full p-4 border-none shadow-none focus-visible:ring-0 resize-y min-h-[100px] bg-transparent text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                {...props}
            />

            {/* Footer Toolbar */}
            <div className="flex items-center justify-end p-2 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1">
                    {enableVoice && (
                        <div
                            className="w-8 h-8 rounded-full bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer transition-colors text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400"
                            title="Voice Input"
                            onClick={onVoiceClick}
                        >
                            <Mic className="w-4 h-4" />
                        </div>
                    )}
                    {enableAI && (
                        <div
                            className="w-8 h-8 rounded-full bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer transition-colors text-slate-400 hover:text-purple-600 dark:text-slate-500 dark:hover:text-purple-400"
                            title="Generate with AI"
                            onClick={onAIClick}
                        >
                            <Wand2 className="w-4 h-4" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
