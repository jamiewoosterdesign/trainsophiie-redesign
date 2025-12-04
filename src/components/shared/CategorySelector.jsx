import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CATEGORIES = [
    "Plumbing",
    "Electrical",
    "HVAC",
    "Cleaning",
    "Landscaping",
    "Pest Control",
    "Locksmith",
    "Moving",
    "Roofing",
    "Painting",
    "Carpentry",
    "Appliance Repair",
    "Handyman",
    "Security Systems",
    "Solar Installation"
];

export function CategorySelector({ onSelect }) {
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

    const filteredCategories = CATEGORIES.filter(cat =>
        cat.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative" ref={wrapperRef}>
            <Button
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full md:w-auto justify-between gap-2 bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
            >
                <span>Add Category</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-2 border-b border-slate-50 bg-slate-50">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 w-3.5 h-3.5 text-slate-400" />
                            <input
                                className="w-full pl-7 pr-2 py-1.5 text-xs border border-slate-200 rounded bg-white focus:outline-none focus:border-blue-400"
                                placeholder="Search categories..."
                                autoFocus
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto p-1">
                        <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available Categories</div>
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((cat) => (
                                <div
                                    key={cat}
                                    className="px-2 py-2 text-sm text-slate-700 hover:bg-blue-50 rounded cursor-pointer flex items-center gap-2 transition-colors"
                                    onClick={() => {
                                        if (onSelect) onSelect(cat);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                >
                                    {cat}
                                </div>
                            ))
                        ) : (
                            <div className="px-2 py-2 text-sm text-slate-400 text-center">
                                No categories found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
