
import React, { useState } from 'react';
import { MessageSquare, Mail, Check, X, Search, Phone, Globe, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { TeamMemberSelector } from './components/TeamMemberSelector';

export default function WizardFormContentNotificationAssignment({ step, formData, onChange, onSwitchMode }) {
    const [tagSearch, setTagSearch] = useState('');
    const [tooltipOpen, setTooltipOpen] = useState({});

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

    const availableTags = TAG_OPTIONS.filter(t => !formData.assignTags.includes(t.value) && t.label.toLowerCase().includes(tagSearch.toLowerCase()));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 relative pb-32 md:pb-0">
            {/* Team Member */}
            <div className="space-y-3">
                <Label className={`flex items-center gap-2 ${isError('assignMemberId') ? 'text-red-500' : 'text-slate-900 dark:text-slate-100'}`}>
                    Team Member *
                    <TooltipProvider>
                        <Tooltip delayDuration={0} open={tooltipOpen['member']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, member: open }))}>
                            <TooltipTrigger asChild onClick={(e) => toggleTooltip('member', e)}>
                                <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                <p>Who should receive this notification.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </Label>
                <TeamMemberSelector
                    value={formData.assignMemberId}
                    onChange={(val) => {
                        onChange('assignMemberId', val);
                        if (isError('assignMemberId')) onChange('errors', { ...formData.errors, assignMemberId: false });
                    }}
                    onAddNew={() => onSwitchMode('staff')}
                />
            </div>

            {/* Notification Method */}
            <div className="space-y-3">
                <Label className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    Notification Method *
                    <TooltipProvider>
                        <Tooltip delayDuration={0} open={tooltipOpen['method']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, method: open }))}>
                            <TooltipTrigger asChild onClick={(e) => toggleTooltip('method', e)}>
                                <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                <p>How they should be notified.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </Label>
                <div className="grid grid-cols-2 gap-4">
                    <div
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.assignMethodSms ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'}`}
                        onClick={() => onChange('assignMethodSms', !formData.assignMethodSms)}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.assignMethodSms ? 'bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                            <MessageSquare className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">SMS</span>
                        {formData.assignMethodSms && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-auto" />}
                    </div>
                    <div
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.assignMethodEmail ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'}`}
                        onClick={() => onChange('assignMethodEmail', !formData.assignMethodEmail)}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.assignMethodEmail ? 'bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                            <Mail className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Email</span>
                        {formData.assignMethodEmail && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-auto" />}
                    </div>
                </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
                <Label className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    Tags
                    <TooltipProvider>
                        <Tooltip delayDuration={0} open={tooltipOpen['tags']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, tags: open }))}>
                            <TooltipTrigger asChild onClick={(e) => toggleTooltip('tags', e)}>
                                <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                <p>Tags that trigger this notification.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </Label>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-2">
                    <div className="flex flex-wrap gap-2 mb-3">
                        {formData.assignTags && formData.assignTags.length > 0 ? (
                            formData.assignTags.map(tagVal => {
                                const tagInfo = TAG_OPTIONS.find(t => t.value === tagVal) || { label: tagVal, color: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300' };
                                return (
                                    <Badge key={tagVal} className={`gap-1 pr-1.5 hover:opacity-80 transition-opacity cursor-pointer border-transparent ${tagInfo.color}`}>
                                        {tagInfo.label}
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onChange('assignTags', formData.assignTags.filter(t => t !== tagVal));
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
                                if (formData.assignTags && !formData.assignTags.includes(val)) {
                                    onChange('assignTags', [...formData.assignTags, val]);
                                    setTagSearch(''); // Clear search after selection
                                } else if (!formData.assignTags) {
                                    onChange('assignTags', [val]);
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

            {/* Sources */}
            <div className="space-y-3">
                <Label className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    Source *
                    <TooltipProvider>
                        <Tooltip delayDuration={0} open={tooltipOpen['source']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, source: open }))}>
                            <TooltipTrigger asChild onClick={(e) => toggleTooltip('source', e)}>
                                <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                <p>Events that trigger this notification.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 -mt-2">When should this person be notified?</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                        { id: 'assignSourceCall', label: 'Phone Call', icon: Phone },
                        { id: 'assignSourceWebform', label: 'Webform', icon: Globe },
                        { id: 'assignSourceChatbot', label: 'Chatbot', icon: MessageSquare },
                        { id: 'assignSourceSms', label: 'Incoming SMS', icon: MessageSquare },
                        { id: 'assignSourceEmail', label: 'Incoming Email', icon: Mail },
                    ].map(source => (
                        <div
                            key={source.id}
                            className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${formData[source.id] ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'}`}
                            onClick={() => onChange(source.id, !formData[source.id])}
                        >
                            <Checkbox
                                checked={formData[source.id]}
                                onCheckedChange={(checked) => onChange(source.id, checked)}
                                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-slate-300 dark:border-slate-600"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">{source.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
