import React, { useState } from 'react';
import { Mic, Wand2, Sparkles, X, Info, Search, Plus, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function WizardFormContentStaff({ step, formData, onChange }) {
    const [tooltipOpen, setTooltipOpen] = useState({});
    const [tagSearch, setTagSearch] = useState('');

    const toggleTooltip = (id, e) => {
        if (e) e.preventDefault();
        setTooltipOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const isError = (field) => formData.errors?.[field];

    const TAG_OPTIONS = [
        { value: 'standard-job', label: 'standard-job', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
        { value: 'complaint', label: 'complaint', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
        { value: 'urgent', label: 'urgent', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
        { value: 'marketing', label: 'marketing', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
        { value: 'quotation-request', label: 'quotation-request', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
        { value: 'follow-up', label: 'follow-up', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300' },
    ];

    const availableTags = TAG_OPTIONS.filter(t => !formData.staffTags?.includes(t.value) && t.label.toLowerCase().includes(tagSearch.toLowerCase()));

    const handleAddUnavailability = () => {
        if (!formData.unavailDescription || (!formData.unavailRecurring && !formData.unavailStartDate)) return;

        const newUnavailability = {
            id: Date.now(),
            description: formData.unavailDescription,
            // Single Mode
            startDate: formData.unavailStartDate,
            endDate: formData.unavailEndDate || formData.unavailStartDate,
            startTime: formData.unavailStartTime ? formData.unavailStartTimeValue : null,
            endTime: formData.unavailEndTime ? formData.unavailEndTimeValue : null,
            // Recurring Mode
            recurring: formData.unavailRecurring,
            freq: formData.unavailRecurring ? formData.unavailFreq : null,
            days: formData.unavailRecurring ? formData.unavailDays : null,
            specificTime: formData.unavailRecurring ? formData.unavailSpecificTime : false,
            recStartTime: formData.unavailSpecificTime ? formData.unavailStartTimeValue : null,
            recEndTime: formData.unavailSpecificTime ? formData.unavailEndTimeValue : null,
        };

        onChange('unavailabilities', [...(formData.unavailabilities || []), newUnavailability]);

        // Reset form
        onChange('unavailDescription', '');
        onChange('unavailStartDate', '');
        onChange('unavailEndDate', '');
        onChange('unavailStartTime', false);
        onChange('unavailEndTime', false);
        onChange('unavailStartTimeValue', '');
        onChange('unavailEndTimeValue', '');
        onChange('unavailRecurring', false);
        onChange('unavailFreq', 'Weekly');
        onChange('unavailDays', []);
        onChange('unavailSpecificTime', false);
    };

    const DEPARTMENTS = [
        { value: 'sales', label: 'Sales' },
        { value: 'support', label: 'Support' },
        { value: 'billing', label: 'Billing' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'technical', label: 'Technical' },
    ];

    // --- STEP 1: DETAILS ---
    if (step === 1) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className={`mb-2 flex items-center gap-2 ${isError('staffName') ? 'text-red-500' : ''}`}>
                            First Name *
                            <TooltipProvider>
                                <Tooltip delayDuration={0} open={tooltipOpen['firstName']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, firstName: open }))}>
                                    <TooltipTrigger asChild onClick={(e) => toggleTooltip('firstName', e)}>
                                        <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                        <p>The staff member's first name.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Label>
                        <Input
                            value={formData.staffName || ''}
                            onChange={(e) => {
                                onChange('staffName', e.target.value);
                                if (isError('staffName')) onChange('errors', { ...formData.errors, staffName: false });
                            }}
                            placeholder="e.g. Sarah"
                            className={isError('staffName') ? 'border-red-300 focus-visible:ring-red-200' : ''}
                        />
                        {isError('staffName') && <p className="text-xs text-red-500 mt-1">First Name is required.</p>}
                    </div>
                    <div>
                        <Label className={`mb-2 flex items-center gap-2 ${isError('staffLastName') ? 'text-red-500' : ''}`}>
                            Last Name *
                            <TooltipProvider>
                                <Tooltip delayDuration={0} open={tooltipOpen['lastName']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, lastName: open }))}>
                                    <TooltipTrigger asChild onClick={(e) => toggleTooltip('lastName', e)}>
                                        <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                        <p>The staff member's surname.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Label>
                        <Input
                            value={formData.staffLastName || ''}
                            onChange={(e) => {
                                onChange('staffLastName', e.target.value);
                                if (isError('staffLastName')) onChange('errors', { ...formData.errors, staffLastName: false });
                            }}
                            placeholder="e.g. Connor"
                            className={isError('staffLastName') ? 'border-red-300 focus-visible:ring-red-200' : ''}
                        />
                        {isError('staffLastName') && <p className="text-xs text-red-500 mt-1">Last Name is required.</p>}
                    </div>
                </div>
                <div>
                    <Label className={`mb-2 flex items-center gap-2 ${isError('staffRole') ? 'text-red-500' : ''}`}>
                        Role *
                        <TooltipProvider>
                            <Tooltip delayDuration={0} open={tooltipOpen['role']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, role: open }))}>
                                <TooltipTrigger asChild onClick={(e) => toggleTooltip('role', e)}>
                                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                    <p>The staff member's job title or position.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                    <Input
                        value={formData.staffRole || ''}
                        onChange={(e) => {
                            onChange('staffRole', e.target.value);
                            if (isError('staffRole')) onChange('errors', { ...formData.errors, staffRole: false });
                        }}
                        placeholder="e.g. Senior Manager"
                        className={isError('staffRole') ? 'border-red-300 focus-visible:ring-red-200' : ''}
                    />
                    {isError('staffRole') && <p className="text-xs text-red-500 mt-1">Role is required.</p>}
                </div>

                {/* Department Selection */}
                <div>
                    <Label className="mb-2 flex items-center gap-2">
                        Department
                        <TooltipProvider>
                            <Tooltip delayDuration={0} open={tooltipOpen['dept']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, dept: open }))}>
                                <TooltipTrigger asChild onClick={(e) => toggleTooltip('dept', e)}>
                                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                    <p>The department this staff member belongs to.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                    <Select value={formData.staffDepartment} onValueChange={(val) => onChange('staffDepartment', val)}>
                        <SelectTrigger className="w-full bg-white dark:bg-slate-900">
                            <SelectValue placeholder="Select Department..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                            {DEPARTMENTS.map(dept => (
                                <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label className="mb-2 block">Contact</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Phone Ext..." />
                        <Input placeholder="Email..." />
                    </div>
                </div>
            </div>
        );
    }

    // --- STEP 2: RESPONSIBILITIES ---
    if (step === 2) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                    <Label className="mb-2 flex items-center gap-2">
                        Responsibilities
                        <TooltipProvider>
                            <Tooltip delayDuration={0} open={tooltipOpen['resp']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, resp: open }))}>
                                <TooltipTrigger asChild onClick={(e) => toggleTooltip('resp', e)}>
                                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                    <p>Detailed description of what this staff member manages.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                    <p className="text-xs text-slate-500 mb-2">Tell Sophiie what this person handles.</p>
                    <div className="relative">
                        <Textarea
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[120px] pb-10 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            placeholder="e.g. Handles billing disputes..."
                            value={formData.staffResp || ''}
                            onChange={(e) => onChange('staffResp', e.target.value)}
                        />
                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Voice Input">
                                <Mic className="w-4 h-4" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Generate with AI">
                                <Wand2 className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tags Section */}
                <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                        Tags
                        <TooltipProvider>
                            <Tooltip delayDuration={0} open={tooltipOpen['tags']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, tags: open }))}>
                                <TooltipTrigger asChild onClick={(e) => toggleTooltip('tags', e)}>
                                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                    <p>Tags associated with this staff member.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-2">
                        <div className="flex flex-wrap gap-2 mb-3">
                            {formData.staffTags && formData.staffTags.length > 0 ? (
                                formData.staffTags.map(tagVal => {
                                    const tagInfo = TAG_OPTIONS.find(t => t.value === tagVal) || { label: tagVal, color: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300' };
                                    return (
                                        <Badge key={tagVal} className={`gap-1 pr-1.5 hover:opacity-80 transition-opacity cursor-pointer border-transparent ${tagInfo.color}`}>
                                            {tagInfo.label}
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onChange('staffTags', formData.staffTags.filter(t => t !== tagVal));
                                                }}
                                                className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5"
                                            >
                                                <X className="w-3 h-3" />
                                            </div>
                                        </Badge>
                                    );
                                })
                            ) : (
                                <span className="text-sm text-slate-400 dark:text-slate-500 italic">No tags selected. Add tags below.</span>
                            )}
                        </div>

                        <div className="relative">
                            <Select
                                onValueChange={(val) => {
                                    if (formData.staffTags && !formData.staffTags.includes(val)) {
                                        onChange('staffTags', [...(formData.staffTags || []), val]);
                                        setTagSearch('');
                                    } else if (!formData.staffTags) {
                                        onChange('staffTags', [val]);
                                        setTagSearch('');
                                    }
                                }}
                            >
                                <SelectTrigger className="bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full">
                                    <SelectValue placeholder="Add a tag..." />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100">
                                    <div className="p-2 sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 z-10 w-full">
                                        <div className="relative w-full">
                                            <Search className="absolute left-2 top-1.5 w-3.5 h-3.5 text-slate-400" />
                                            <input
                                                className="w-full pl-7 pr-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 rounded-md text-slate-900 dark:text-slate-100 border-none focus:ring-0 outline-none placeholder:text-slate-400"
                                                placeholder="Search tags..."
                                                value={tagSearch}
                                                onChange={(e) => setTagSearch(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                onKeyDown={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    </div>
                                    {availableTags.map(t => (
                                        <SelectItem key={t.value} value={t.value} className="cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${t.color.split(' ')[0] || 'bg-slate-400'}`}></div>
                                                {t.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                    {availableTags.length === 0 && <div className="p-2 text-xs text-slate-400 text-center">No tags found</div>}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/50 rounded-lg p-4 flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400 mt-0.5" />
                    <div className="text-sm text-blue-800 dark:text-blue-200"><strong>AI Tip:</strong> Be specific. Instead of "Sales", say "Residential Sales".</div>
                </div>
            </div>
        );
    }

    // --- STEP 3: AVAILABILITY & ESCALATION ---
    if (step === 3) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 relative pb-10">

                {/* Escalation Point Section */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Escalation Point</h3>
                                <TooltipProvider>
                                    <Tooltip delayDuration={0} open={tooltipOpen['escalation']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, escalation: open }))}>
                                        <TooltipTrigger asChild onClick={(e) => toggleTooltip('escalation', e)}>
                                            <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                            <p>Configure how tasks or calls are escalated to this team member.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Configure escalation settings for this team member</p>
                        </div>
                    </div>

                    <div className="border border-slate-100 dark:border-slate-800 rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <div className="font-medium text-slate-900 dark:text-slate-100 text-sm">Assign this member as the contact for late invoice follow-ups</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">This team member will be assigned as the contact for late payment follow-ups.</div>
                        </div>
                        <Switch
                            checked={formData.escalationEnabled}
                            onCheckedChange={(c) => onChange('escalationEnabled', c)}
                        />
                    </div>

                    {formData.escalationEnabled && (
                        <div className="relative">
                            <Textarea
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px] pb-10 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                placeholder="Enter notes about the escalation..."
                                value={formData.escalationNotes || ''}
                                onChange={(e) => onChange('escalationNotes', e.target.value)}
                            />
                            <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Voice Input">
                                    <Mic className="w-4 h-4" />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Generate with AI">
                                    <Wand2 className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Unavailability Section */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Unavailability</h3>
                                <TooltipProvider>
                                    <Tooltip delayDuration={0} open={tooltipOpen['unavail']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, unavail: open }))}>
                                        <TooltipTrigger asChild onClick={(e) => toggleTooltip('unavail', e)}>
                                            <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                            <p>Set dates and times when this team member is not available.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Configure when this team member is unavailable</p>
                        </div>
                    </div>

                    <div className="space-y-4 bg-slate-50 dark:bg-slate-950/30 rounded-lg p-4 border border-slate-100 dark:border-slate-800/50">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">New Unavailability</h4>

                        <div className="space-y-4">
                            <div>
                                <Label className="text-xs font-medium mb-1.5 block text-slate-700 dark:text-slate-300">Description</Label>
                                <Input
                                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                                    placeholder="Brief description..."
                                    value={formData.unavailDescription || ''}
                                    onChange={(e) => onChange('unavailDescription', e.target.value)}
                                />
                            </div>

                            {/* Recurring Toggle */}
                            <div className="flex items-center gap-2 pt-1">
                                <Switch
                                    id="recurring"
                                    checked={formData.unavailRecurring}
                                    onCheckedChange={(c) => onChange('unavailRecurring', c)}
                                />
                                <Label htmlFor="recurring" className="text-sm font-normal text-slate-700 dark:text-slate-300 cursor-pointer">Recurring</Label>
                            </div>

                            {/* CONDITIONAL UI: RECURRING vs SINGLE */}
                            {!formData.unavailRecurring ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    {/* Start Block */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Start Date</Label>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    className="scale-75 origin-right"
                                                    checked={formData.unavailStartTime}
                                                    onCheckedChange={(c) => onChange('unavailStartTime', c)}
                                                />
                                                <span className="text-[10px] text-slate-500 dark:text-slate-400">Include time</span>
                                            </div>
                                        </div>
                                        <div className="relative group">
                                            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                                            <Input
                                                type="date"
                                                className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:text-slate-100 dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer relative"
                                                value={formData.unavailStartDate || ''}
                                                onChange={(e) => onChange('unavailStartDate', e.target.value)}
                                            />
                                        </div>

                                        {formData.unavailStartTime && (
                                            <div className="relative group animate-in fade-in slide-in-from-top-1 duration-200">
                                                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                                                <Input
                                                    type="time"
                                                    className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:text-slate-100 dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer relative"
                                                    value={formData.unavailStartTimeValue || ''}
                                                    onChange={(e) => onChange('unavailStartTimeValue', e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* End Block */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">End Date</Label>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    className="scale-75 origin-right"
                                                    checked={formData.unavailEndTime}
                                                    onCheckedChange={(c) => onChange('unavailEndTime', c)}
                                                />
                                                <span className="text-[10px] text-slate-500 dark:text-slate-400">Include time</span>
                                            </div>
                                        </div>
                                        <div className="relative group">
                                            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                                            <Input
                                                type="date"
                                                className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:text-slate-100 dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer relative"
                                                placeholder="Same as start date"
                                                value={formData.unavailEndDate || ''}
                                                onChange={(e) => onChange('unavailEndDate', e.target.value)}
                                            />
                                        </div>

                                        {formData.unavailEndTime && (
                                            <div className="relative group animate-in fade-in slide-in-from-top-1 duration-200">
                                                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                                                <Input
                                                    type="time"
                                                    className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:text-slate-100 dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer relative"
                                                    value={formData.unavailEndTimeValue || ''}
                                                    onChange={(e) => onChange('unavailEndTimeValue', e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* RECURRING FORM UI */
                                <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">Frequency</Label>
                                        <Select
                                            value={formData.unavailFreq || 'Weekly'}
                                            onValueChange={(val) => onChange('unavailFreq', val)}
                                        >
                                            <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                                <SelectValue placeholder="Select Frequency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Daily">Daily</SelectItem>
                                                <SelectItem value="Weekly">Weekly</SelectItem>
                                                <SelectItem value="Monthly">Monthly</SelectItem>
                                                <SelectItem value="Yearly">Yearly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">Days of week</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                                                const isSelected = formData.unavailDays?.includes(day);
                                                return (
                                                    <button
                                                        key={day}
                                                        onClick={() => {
                                                            const newDays = isSelected
                                                                ? formData.unavailDays.filter(d => d !== day)
                                                                : [...(formData.unavailDays || []), day];
                                                            onChange('unavailDays', newDays);
                                                        }}
                                                        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${isSelected
                                                            ? 'bg-blue-600 text-white border-blue-600'
                                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                            }`}
                                                    >
                                                        {day}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                id="specific-times"
                                                checked={formData.unavailSpecificTime}
                                                onCheckedChange={(c) => onChange('unavailSpecificTime', c)}
                                            />
                                            <Label htmlFor="specific-times" className="text-sm font-medium text-slate-900 dark:text-slate-100 cursor-pointer">Include specific times</Label>
                                        </div>

                                        {formData.unavailSpecificTime && (
                                            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs text-slate-500">Start Time</Label>
                                                    <div className="relative group">
                                                        <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                                                        <Input
                                                            type="time"
                                                            className="pl-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-slate-100 dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer relative"
                                                            value={formData.unavailStartTimeValue || ''}
                                                            onChange={(e) => onChange('unavailStartTimeValue', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs text-slate-500">End Time</Label>
                                                    <div className="relative group">
                                                        <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                                                        <Input
                                                            type="time"
                                                            className="pl-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-slate-100 dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer relative"
                                                            value={formData.unavailEndTimeValue || ''}
                                                            onChange={(e) => onChange('unavailEndTimeValue', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>

                        <div className="pt-2">
                            <Button
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={handleAddUnavailability}
                            >
                                <Plus className="w-4 h-4 mr-2" /> Add Unavailability
                            </Button>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Current Unavailabilities ({formData.unavailabilities?.length || 0})</h4>
                        </div>

                        {formData.unavailabilities && formData.unavailabilities.length > 0 ? (
                            <div className="space-y-4">
                                {formData.unavailabilities.map(item => (
                                    <div key={item.id} className="relative p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">

                                        {/* Top Badge & Delete */}
                                        <div className="flex items-start justify-between mb-4">
                                            {item.recurring ? (
                                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/50 rounded-full px-3 font-normal">
                                                    Recurring {item.freq?.toLowerCase()}
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full px-3 font-normal">
                                                    One-time
                                                </Badge>
                                            )}
                                            <button
                                                onClick={() => onChange('unavailabilities', formData.unavailabilities.filter(u => u.id !== item.id))}
                                                className="text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Description */}
                                        {item.description && (
                                            <div className="mb-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                                                {item.description}
                                            </div>
                                        )}

                                        {/* Date Grid */}
                                        <div className="grid grid-cols-2 gap-8 mb-4">
                                            <div>
                                                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">START DATE</div>
                                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                    {item.startDate ? new Date(item.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No start date'}
                                                    {item.startTime && <span className="text-slate-500 font-normal ml-1">at {item.startTime}</span>}
                                                    {item.recStartTime && <span className="text-slate-500 font-normal ml-1">at {item.recStartTime}</span>}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">END DATE</div>
                                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                    {item.endDate && item.endDate !== item.startDate ?
                                                        new Date(item.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                        : 'No end date'}
                                                    {item.endTime && <span className="text-slate-500 font-normal ml-1">at {item.endTime}</span>}
                                                    {item.recEndTime && <span className="text-slate-500 font-normal ml-1">at {item.recEndTime}</span>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Info Bar (Usage for Days) */}
                                        {item.recurring && item.days && item.days.length > 0 && (
                                            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs px-3 py-2 rounded-md">
                                                Repeats on {item.days.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                                <p className="text-sm text-slate-400 dark:text-slate-500 italic">No current or upcoming unavailabilities</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
