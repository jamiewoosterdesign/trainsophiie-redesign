import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';


export default function MultiSelectDropdown({
    options = [],
    selected = [],
    onChange,
    placeholder = "Select tags...",
    label = "Tags"
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (optionValue) => {
        let newSelected;
        if (selected.includes(optionValue)) {
            newSelected = selected.filter(v => v !== optionValue);
        } else {
            newSelected = [...selected, optionValue];
        }
        onChange(newSelected);
    };

    const toggleAll = () => {
        if (selected.length === options.length) {
            onChange([]);
        } else {
            onChange(options.map(o => o.value));
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            {/* Trigger */}
            <div
                className="flex items-center justify-between w-full p-2 border border-slate-200 rounded-md bg-white cursor-pointer hover:border-slate-300 transition-colors min-h-[40px]"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex flex-wrap gap-1">
                    {selected.length === 0 && (
                        <span className="text-sm text-slate-400 pl-1">{placeholder}</span>
                    )}
                    {selected.length > 0 && (
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none">
                            {selected.length} tags selected
                        </Badge>
                    )}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div
                        className="flex items-center p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 bg-blue-50/30"
                        onClick={toggleAll}
                    >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${selected.length === options.length ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                            {selected.length === options.length && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm font-medium text-blue-600">(Select All)</span>
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                        <div className="py-1">
                            {options.map((option) => {
                                const isSelected = selected.includes(option.value);
                                return (
                                    <div
                                        key={option.value}
                                        className="flex items-center px-3 py-2.5 hover:bg-slate-50 cursor-pointer"
                                        onClick={() => toggleOption(option.value)}
                                    >
                                        <div className="flex-1 flex items-center justify-between">
                                            <span className="text-sm text-slate-700">{option.label}</span>
                                            {isSelected && <Check className="w-4 h-4 text-slate-900" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
