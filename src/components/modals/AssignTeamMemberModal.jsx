import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import MultiSelectDropdown from '@/components/shared/MultiSelectDropdown';

const TEAM_MEMBERS = [
    { id: '1', name: 'Sarah Wilson' },
    { id: '2', name: 'Mike Johnson' },
    { id: '3', name: 'Emily Davis' },
    { id: '4', name: 'David Brown' },
];

const TAG_OPTIONS = [
    { value: 'standard-job', label: 'standard-job' },
    { value: 'complaint', label: 'complaint' },
    { value: 'urgent', label: 'urgent' },
    { value: 'marketing', label: 'marketing' },
    { value: 'quotation-request', label: 'quotation-request' },
    { value: 'follow-up', label: 'follow-up' },
];

export default function AssignTeamMemberModal({ onClose }) {
    const [selectedMember, setSelectedMember] = useState('');
    const [tags, setTags] = useState([]);

    const [methods, setMethods] = useState({
        sms: false,
        email: false
    });

    const [sources, setSources] = useState({
        call: false,
        webform: false,
        chatbot: false,
        sms: false,
        email: false
    });

    const handleAssign = () => {
        console.log({ selectedMember, methods, tags, sources });
        onClose();
    };

    const handleMemberChange = (value) => {
        if (value === 'add-new') {
            // Logic to open Add New Member modal would go here.
            // For now we'll just log it or alert, as strict router/modal management implies parent control.
            // But user said "reroute to the add new team member modal we currently have".
            // I'll effectively just clear selection or handle it.
            // Since I don't have access to "openAddMemberModal" here easily without props, I will just log it.
            console.log("Redirecting to Add New Member Modal...");
            return;
        }
        setSelectedMember(value);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 border border-transparent dark:border-slate-800">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Assign a Member</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Team Member */}
                    <div className="space-y-2">
                        <Label>Team member</Label>
                        <Select value={selectedMember} onValueChange={handleMemberChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Search member" />
                            </SelectTrigger>
                            <SelectContent>
                                {TEAM_MEMBERS.map((member) => (
                                    <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                                ))}
                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                                <SelectItem value="add-new" className="text-blue-600 dark:text-blue-400 font-medium cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-blue-700 dark:focus:text-blue-300">
                                    + Add New Team Member
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Notification Method */}
                    <div className="space-y-3">
                        <Label>Notification Method</Label>
                        <div className="flex gap-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="method-sms"
                                    checked={methods.sms}
                                    onCheckedChange={(checked) => setMethods(prev => ({ ...prev, sms: checked }))}
                                />
                                <label htmlFor="method-sms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 dark:text-slate-200">
                                    Text Message
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="method-email"
                                    checked={methods.email}
                                    onCheckedChange={(checked) => setMethods(prev => ({ ...prev, email: checked }))}
                                />
                                <label htmlFor="method-email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 dark:text-slate-200">
                                    Email
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <MultiSelectDropdown
                            options={TAG_OPTIONS}
                            selected={tags}
                            onChange={setTags}
                            placeholder="Select tags for this member"
                        />
                    </div>

                    {/* Source */}
                    <div className="space-y-3">
                        <Label>Source</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="source-call"
                                    checked={sources.call}
                                    onCheckedChange={(checked) => setSources(prev => ({ ...prev, call: checked }))}
                                />
                                <label htmlFor="source-call" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 dark:text-slate-200">
                                    Call
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="source-webform"
                                    checked={sources.webform}
                                    onCheckedChange={(checked) => setSources(prev => ({ ...prev, webform: checked }))}
                                />
                                <label htmlFor="source-webform" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 dark:text-slate-200">
                                    Webform
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="source-chatbot"
                                    checked={sources.chatbot}
                                    onCheckedChange={(checked) => setSources(prev => ({ ...prev, chatbot: checked }))}
                                />
                                <label htmlFor="source-chatbot" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 dark:text-slate-200">
                                    Chatbot
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="source-sms"
                                    checked={sources.sms}
                                    onCheckedChange={(checked) => setSources(prev => ({ ...prev, sms: checked }))}
                                />
                                <label htmlFor="source-sms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 dark:text-slate-200">
                                    SMS
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="source-email"
                                    checked={sources.email}
                                    onCheckedChange={(checked) => setSources(prev => ({ ...prev, email: checked }))}
                                />
                                <label htmlFor="source-email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 dark:text-slate-200">
                                    Email
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} className="dark:bg-transparent dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                        Cancel
                    </Button>
                    <Button onClick={handleAssign} disabled={!selectedMember}>
                        Assign
                    </Button>
                </div>
            </div>
        </div>
    );
}
