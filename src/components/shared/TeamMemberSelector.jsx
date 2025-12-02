import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TeamMemberSelector({ value, onChange, onAddNew }) {
    const [isOpen, setIsOpen] = useState(false);
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

    return (
        <div className="relative" ref={wrapperRef}>
            <div onClick={() => setIsOpen(!isOpen)}
                className="flex h-11 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white cursor-pointer hover:border-blue-400 focus:ring-2 focus:ring-blue-500 transition-all"
            >
                <span className={!value ? "text-slate-500" : "text-slate-900"}>{value || "Select a team member..."}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-2 border-b border-slate-50 bg-slate-50">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 w-3.5 h-3.5 text-slate-400" />
                            <input
                                className="w-full pl-7 pr-2 py-1.5 text-xs border border-slate-200 rounded bg-white focus:outline-none focus:border-blue-400"
                                placeholder="Search team..." autoFocus />
                        </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto p-1">
                        <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available Staff</div>
                        <div className="px-2 py-2 text-sm text-slate-700 hover:bg-blue-50 rounded cursor-pointer flex items-center gap-2 group transition-colors"
                            onClick={() => { onChange('Jamie Tester'); setIsOpen(false); }}
                        >
                            <div className="w-6 h-6 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-[10px] group-hover:bg-white">JT</div>
                            Jamie Tester
                        </div>
                        <div className="px-2 py-2 text-sm text-slate-700 hover:bg-blue-50 rounded cursor-pointer flex items-center gap-2 group transition-colors"
                            onClick={() => { onChange('Sarah Brown'); setIsOpen(false); }}
                        >
                            <div className="w-6 h-6 rounded bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center font-bold text-[10px] group-hover:bg-white">SB</div>
                            Sarah Brown
                        </div>
                    </div>
                    <div className="p-2 border-t border-slate-100 bg-slate-50">
                        <button onClick={() => { onAddNew(); setIsOpen(false); }}
                            className="w-full py-2 text-xs font-medium text-blue-600 border border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 rounded flex items-center justify-center gap-2 transition-colors"
                        >
                            <Plus className="w-3 h-3" /> Add New Team Member
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
