import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Plus, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_STAFF, MOCK_DEPARTMENTS } from '../data/mockData';

export function TeamMemberSelector({ value, onChange, onAddNew, multiple = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // Initial value sync not strictly needed since we respond to props, but okay.
    // Logic handles value prop directly.

    // Filter logic
    const filteredStaff = MOCK_STAFF.filter(staff =>
    (staff.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        staff.role.toLowerCase().includes(searchValue.toLowerCase()))
    );

    // Focus search input when opened
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            // slightly delayed to allow render
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 50);
        }
    }, [isOpen]);

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

    const handleSelect = (staffName) => {
        if (multiple) {
            const current = Array.isArray(value) ? value : [];
            let newValue;
            if (current.includes(staffName)) {
                newValue = current.filter(v => v !== staffName);
            } else {
                newValue = [...current, staffName];
            }
            onChange(newValue);
            // We keep it open for multiple selection simply because user might want to select more than one. 
            // "clicking anywhere on the actual input field simply open and closes the dropdown" applies to the trigger.
        } else {
            onChange(staffName);
            setIsOpen(false);
        }
    };

    const handleRemove = (staffName, e) => {
        e.stopPropagation();
        if (multiple) {
            const current = Array.isArray(value) ? value : [];
            onChange(current.filter(v => v !== staffName));
        } else {
            onChange('');
        }
    };

    // Helper to Get Staff Color/Initials for Badge
    const getStaff = (name) => MOCK_STAFF.find(s => s.name === name);

    return (
        <div className="relative space-y-2" ref={dropdownRef}>
            {/* Multi-select Badges (Above Input) */}
            {multiple && Array.isArray(value) && value.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 animate-in fade-in slide-in-from-bottom-1">
                    {value.map(name => {
                        const staff = getStaff(name);
                        return (
                            <Badge
                                key={name}
                                variant="secondary"
                                className="flex items-center gap-1 pr-1 pl-2 py-1 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer group"
                                onClick={(e) => handleRemove(name, e)}
                            >
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{name}</span>
                                <div className="group-hover:bg-slate-300 dark:group-hover:bg-slate-600 rounded-full p-0.5 transition-colors" >
                                    <X className="w-3 h-3 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200" />
                                </div>
                            </Badge>
                        );
                    })}
                </div>
            )}

            {/* Trigger (Input-like Div) */}
            <div
                className={`relative flex items-center justify-between w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm ring-offset-white cursor-pointer transition-all ${isOpen ? 'ring-2 ring-blue-500 ring-offset-2 border-blue-500' : 'hover:border-slate-300 dark:hover:border-slate-600'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={`mr-2 truncate ${(!value || (multiple && value.length === 0)) ? "text-slate-500" : "text-slate-900 dark:text-slate-100"}`}>
                    {multiple
                        ? (value && value.length > 0 ? "Add more staff..." : "Select Team Members...")
                        : (value || "Select Team Member...")
                    }
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* 'Add New Staff' Button (Below Input) */}
            {onAddNew && (
                <div className="flex justify-start">
                    <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-xs flex items-center gap-1"
                        onClick={onAddNew}
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add New Staff
                    </Button>
                </div>
            )}

            {/* Dropdown Content */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {/* Search Bar (Inside Dropdown) */}
                    <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                            <input
                                ref={searchInputRef}
                                className="w-full pl-8 pr-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                                placeholder="Search..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    {/* Results List */}
                    <div className="max-h-[250px] overflow-y-auto p-1 space-y-1">
                        {MOCK_DEPARTMENTS.map(dept => {
                            const departmentStaff = filteredStaff.filter(s => s.deptId === dept.id || (!s.deptId && dept.id === 'dept-2'));
                            if (departmentStaff.length === 0) return null;

                            return (
                                <div key={dept.id}>
                                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10">{dept.name}</div>
                                    {departmentStaff.map(staff => {
                                        const isSelected = multiple ? (Array.isArray(value) && value.includes(staff.name)) : value === staff.name;
                                        return (
                                            <div
                                                key={staff.id}
                                                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelect(staff.name);
                                                }}
                                            >
                                                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${staff.color}`}>
                                                    {staff.initials}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium">{staff.name}</div>
                                                    <div className="text-xs opacity-70">{staff.role} • {staff.status}</div>
                                                </div>
                                                {isSelected && <Check className="w-4 h-4" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                        {MOCK_DEPARTMENTS.every(dept => filteredStaff.filter(s => s.deptId === dept.id || (!s.deptId && dept.id === 'dept-2')).length === 0) && (
                            <div className="p-4 text-center text-slate-400 text-xs">No results found.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
