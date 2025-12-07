import React from 'react';
import { UploadCloud, Plus, Trash2, HelpCircle, ClipboardList, PhoneForwarded, Calendar, Mail, Sparkles, X, ShieldAlert, ScrollText, Zap, RotateCcw, Loader2, FileCheck, Book, CheckCircle2, Wrench, Shield, AlertTriangle, Wand2, Clock, Edit2, Copy, Mic, GripVertical, ArrowRight, CornerDownRight, ChevronRight, ChevronDown, Info, LayoutGrid, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function WizardFormContentDepartment({ mode, step, formData, onChange, activeField }) {
    // --- DEPARTMENT WIZARD ---
    const [tooltipOpen, setTooltipOpen] = React.useState({});
    const toggleTooltip = (id, e) => {
        e.preventDefault();
        setTooltipOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 relative pb-32 md:pb-0">
            {/* Header / Intro (Optional) */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 mb-6 border border-slate-100 dark:border-slate-800">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                        <LayoutGrid className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Create New Department</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure a new department to organize your team and manage call routing logic.</p>
                    </div>
                </div>
            </div>

            {/* Department Name */}
            <div>
                <div className="flex justify-between items-center mb-1.5">
                    <Label className="block">Department Name *</Label>
                </div>
                <Input
                    placeholder="e.g., Accounts, Support, Sales"
                    value={formData.departmentName}
                    onChange={(e) => onChange('departmentName', e.target.value)}
                    highlight={(activeField === 'departmentName')?.toString()}
                />
            </div>

            {/* Description */}
            <div>
                <div className="flex justify-between items-center mb-1.5">
                    <Label className="flex items-center gap-2">
                        Description
                        <TooltipProvider>
                            <Tooltip delayDuration={0} open={tooltipOpen['deptDesc']} onOpenChange={(open) => setTooltipOpen(prev => ({ ...prev, deptDesc: open }))}>
                                <TooltipTrigger asChild onClick={(e) => toggleTooltip('deptDesc', e)}>
                                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                    <p>Briefly describe the purpose of this department.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                </div>
                <div className="relative">
                    <Textarea
                        placeholder="What handles does this department cover?"
                        className="min-h-[120px] pb-10 resize-y"
                        value={formData.departmentDescription}
                        onChange={(e) => onChange('departmentDescription', e.target.value)}
                        highlight={(activeField === 'departmentDescription')?.toString()}
                    />
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Voice Input">
                            <Mic className="w-4 h-4" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Generate with AI">
                            <Wand2 className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Assigned Team Members (Simple Multi-select Simulation) */}
            <div>
                <Label className="mb-3 block">Assigned Team Members</Label>
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50 max-h-[200px] overflow-y-auto space-y-2">
                    {[
                        { name: 'Sarah Jenkins', role: 'Sales' },
                        { name: 'Mike Ross', role: 'Support' },
                        { name: 'Jessica Pearson', role: 'Manager' },
                        { name: 'Harvey Specter', role: 'Sales' },
                    ].map((member, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all cursor-pointer"
                            onClick={() => {
                                const current = formData.departmentMembers || [];
                                const exists = current.includes(member.name);
                                onChange('departmentMembers', exists ? current.filter(n => n !== member.name) : [...current, member.name]);
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.departmentMembers?.includes(member.name) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'}`}>
                                    {formData.departmentMembers?.includes(member.name) && <CheckCircle2 className="w-3.5 h-3.5" />}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-900 dark:text-slate-200">{member.name}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">{member.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">Select staff who belong to this department.</p>
            </div>

            {/* Routing Logic */}
            <div>
                <Label className="mb-1.5 block">Routing Distribution</Label>
                <Select value={formData.departmentRouting} onValueChange={(val) => onChange('departmentRouting', val)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select routing method" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Priority Order">Priority Order (Ring in order)</SelectItem>
                        <SelectItem value="Round Robin">Round Robin (Distribute evenly)</SelectItem>
                        <SelectItem value="Simultaneous">Simultaneous (Ring everyone)</SelectItem>
                        <SelectItem value="Weighted">Weighted Distribution</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1.5">Determines how incoming calls are distributed among available members.</p>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Active Department</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Department is available for routing and assignment.</span>
                </div>
                <Switch checked={formData.departmentActive} onCheckedChange={(c) => onChange('departmentActive', c)} />
            </div>

        </div>
    );
}
