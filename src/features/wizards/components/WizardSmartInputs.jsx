
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
    const baseClasses = `min-h-[100px] pb-10 resize-y pr-10 transition-all duration-300 ${highlight === 'true' ? 'border-emerald-400 ring-1 ring-emerald-100 bg-emerald-50/10' : ''} ${className}`;

    const handleChange = (e) => {
        if (onChange) onChange(e.target.value);
    };

    return (
        <div className="relative">
            <Textarea
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className={baseClasses}
                {...props}
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
                {enableVoice && (
                    <div
                        className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                        title="Voice Input"
                        onClick={onVoiceClick}
                    >
                        <Mic className="w-4 h-4" />
                    </div>
                )}
                {enableAI && (
                    <div
                        className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                        title="Generate with AI"
                        onClick={onAIClick}
                    >
                        <Wand2 className="w-4 h-4" />
                    </div>
                )}
            </div>
        </div>
    );
}
