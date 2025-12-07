import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MOCK_ALL_CATEGORIES = [
    "Plumbers",
    "Electricians",
    "Builders",
    "Carpenters",
    "Painters And Decorators",
    "Roofers",
    "Roof Plumbers",
    "Roof Tiling",
    "HVAC",
    "Landscaping",
    "Pest Control",
    "Locksmith",
    "Glaziers",
    "Concreters"
];

export function CategorySelector({ onSelect, usedCategories = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const filteredCategories = MOCK_ALL_CATEGORIES.filter(cat =>
        cat.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative" ref={wrapperRef}>
            <Button
                variant="secondary"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full md:w-auto justify-between gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
            >
                <span>Add Category</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-1 w-72 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 dark:bg-slate-900 dark:border-slate-800">
                    <div className="p-3 border-b border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input
                                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                placeholder="Search trade category..."
                                autoFocus
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto p-1">
                        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trade</div>
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((cat) => {
                                const isUsed = usedCategories.includes(cat);
                                return (
                                    <div
                                        key={cat}
                                        className={`px-3 py-2.5 text-sm rounded-md flex items-center justify-between gap-2 transition-colors ${isUsed
                                                ? 'text-slate-400 cursor-not-allowed bg-slate-50 dark:bg-slate-800/50'
                                                : 'text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer'
                                            }`}
                                        onClick={() => {
                                            if (!isUsed) {
                                                if (onSelect) onSelect(cat);
                                                setIsOpen(false);
                                                setSearchTerm('');
                                            }
                                        }}
                                    >
                                        <span>{cat} {isUsed && <span className="ml-2 text-slate-400 font-normal">- Already Used</span>}</span>
                                        {isUsed && <Check className="w-3.5 h-3.5 text-slate-400" />}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="px-3 py-4 text-sm text-slate-400 text-center">
                                No categories found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
