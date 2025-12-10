
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_STAFF, MOCK_DEPARTMENTS } from '../data/mockData';

export function TeamMemberSelector({ value, onChange, onAddNew }) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value || '');
    const dropdownRef = useRef(null);

    // Sync inputValue with external value prop changes
    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                // Reset input to matched value if closed without selection? 
                // Or just leave it. Leaving it is usually fine, or we can force it to value.
                if (value) setInputValue(value);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef, value]);

    const filteredStaff = MOCK_STAFF.filter(staff =>
        staff.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        staff.role.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleSelect = (staffName) => {
        onChange(staffName);
        setInputValue(staffName);
        setIsOpen(false);
    };

    return (
        <div className="relative space-y-2" ref={dropdownRef}>
            <div className="relative">
                <input
                    className={`flex h-10 w-full items-center justify-between rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 dark:text-slate-100 ${isOpen ? 'ring-2 ring-blue-500 ring-offset-2 border-blue-500' : ''}`}
                    placeholder="Select Team Member..."
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onClick={() => setIsOpen(true)}
                />
                <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        // If input is focused and open, clicking this might blur it or just toggle.
                        // We want to toggle explicitly.
                        setIsOpen(!isOpen);
                    }}
                />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {/* Add New Button - Moved to Top */}
                    <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
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

                    <div className="max-h-[250px] overflow-y-auto p-1 space-y-1">
                        {MOCK_DEPARTMENTS.map(dept => {
                            const departmentStaff = filteredStaff.filter(s => s.deptId === dept.id || (!s.deptId && dept.id === 'dept-2'));
                            if (departmentStaff.length === 0) return null;

                            return (
                                <div key={dept.id}>
                                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{dept.name}</div>
                                    {departmentStaff.map(staff => (
                                        <div
                                            key={staff.id}
                                            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${value === staff.name ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
                                            onClick={() => handleSelect(staff.name)}
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
                </div>
            )}
        </div>
    );
}
