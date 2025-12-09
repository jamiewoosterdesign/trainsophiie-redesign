
import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_STAFF, MOCK_DEPARTMENTS } from '../data/mockData';

export function TeamMemberSelector({ value, onChange, onAddNew }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const filteredStaff = MOCK_STAFF.filter(staff =>
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedStaff = MOCK_STAFF.find(s => s.id.toString() === value || s.name.toLowerCase() === value?.toLowerCase()) || (value ? { name: value } : null);

    return (
        <div className="relative space-y-2" ref={dropdownRef}>
            <div
                className={`flex h-10 w-full items-center justify-between rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer ${isOpen ? 'ring-2 ring-blue-500 ring-offset-2 border-blue-500' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    {selectedStaff ? (
                        <>
                            {selectedStaff.initials && (
                                <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${selectedStaff.color || 'bg-slate-100 text-slate-600'}`}>
                                    {selectedStaff.initials}
                                </div>
                            )}
                            <span className="text-slate-900 dark:text-slate-100">{selectedStaff.name}</span>
                            {selectedStaff.role && <span className="text-slate-400 dark:text-slate-500 text-xs">({selectedStaff.role})</span>}
                        </>
                    ) : (
                        <span className="text-slate-500 dark:text-slate-400">Select Team Member...</span>
                    )}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input
                                placeholder="Search staff..."
                                className="w-full pl-8 pr-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 rounded-md outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                    <div className="max-h-[250px] overflow-y-auto p-1 space-y-1">
                        {MOCK_DEPARTMENTS.map(dept => {
                            const departmentStaff = filteredStaff.filter(s => s.deptId === dept.id || (!s.deptId && dept.id === 'dept-2')); // Fallback for safety
                            if (departmentStaff.length === 0) return null;

                            return (
                                <div key={dept.id}>
                                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{dept.name}</div>
                                    {departmentStaff.map(staff => (
                                        <div
                                            key={staff.id}
                                            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${value === staff.id.toString() || value === staff.name ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
                                            onClick={() => {
                                                onChange(staff.name); // Using name as value to match simple select behavior
                                                setIsOpen(false);
                                            }}
                                        >
                                            <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${staff.color}`}>
                                                {staff.initials}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium">{staff.name}</div>
                                                <div className="text-xs opacity-70">{staff.role} • {staff.status}</div>
                                            </div>
                                            {value === staff.name && <Check className="w-4 h-4" />}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                        {filteredStaff.length === 0 && (
                            <div className="p-4 text-center text-slate-400 text-xs">No results found.</div>
                        )}
                    </div>
                    <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                        <Button
                            variant="default"
                            size="sm"
                            className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
                            onClick={() => {
                                setIsOpen(false);
                                onAddNew();
                            }}
                        >
                            <Plus className="w-3.5 h-3.5 mr-2" /> Add New Staff
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
