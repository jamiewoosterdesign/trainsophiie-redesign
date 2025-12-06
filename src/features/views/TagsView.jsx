import React, { useState } from 'react';
import { Tag, Plus, ArrowLeft, Search, Pencil, Trash2, Filter, Info, AlertCircle, Sparkles, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate, useOutletContext } from 'react-router-dom';
import CreateCustomerTagModal from '@/components/modals/CreateCustomerTagModal';
import CreateInquiriesTagModal from '@/components/modals/CreateInquiriesTagModal';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';

const MOCK_CUSTOMER_TAGS = [
    { id: 1, name: 'VIP', color: 'bg-purple-500', colorHex: '#a855f7', description: 'Very Important Person', enabled: true },
    { id: 2, name: 'New Customer', color: 'bg-green-500', colorHex: '#22c55e', description: 'First time customer', enabled: true },
    { id: 3, name: 'Late Payer', color: 'bg-red-500', colorHex: '#ef4444', description: 'Historically pays late', enabled: true },
];

const MOCK_INQUIRY_TAGS = [
    { id: 1, name: 'standard-job', color: 'bg-purple-100', colorHex: '#f3e8ff', description: 'Wants to book or schedule a service', enabled: true, isPreset: true },
    { id: 2, name: 'complaint', color: 'bg-red-100', colorHex: '#fee2e2', description: 'Expresses dissatisfaction', enabled: true, isPreset: true },
    { id: 3, name: 'urgent', color: 'bg-slate-200', colorHex: '#e2e8f0', description: 'Explicitly mentions urgency', enabled: true, isPreset: true },
    { id: 4, name: 'Quote Request', color: 'bg-blue-500', colorHex: '#3b82f6', description: 'Looking for pricing', enabled: true },
];

const MOCK_AUTO_TAGS = [
    { id: 1, name: 'Solar Panel', color: 'bg-blue-300', colorHex: '#93c5fd', description: 'Solar panels to harness the suns light and transfer it in clean electricity', enabled: true, isAuto: true },
    { id: 2, name: 'Domestic Electrical', color: 'bg-yellow-100', colorHex: '#fef9c3', description: 'Residential electrical services including installations, upgrades and maintenance', enabled: true, isAuto: true },
    { id: 3, name: 'Commercial Electrical', color: 'bg-amber-800', colorHex: '#92400e', description: 'Fit outs, upgrades and maintenance', enabled: true, isAuto: true },
    { id: 4, name: 'Air Conditioning', color: 'bg-orange-500', colorHex: '#f97316', description: 'End-to-end design, supply and installation of air conditioning systems', enabled: true, isAuto: true },
];

function TagSection({ title, tags, onAdd, addLabel, searchQuery, onSearchChange, icon: Icon, onEdit }) {
    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {/* Header / Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    {Icon && <Icon className="w-5 h-5 text-slate-500" />} {title}
                </h2>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search tags..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9 h-9 bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Desktop View: Table Rows */}
            <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <div className="col-span-1">Colour</div>
                    <div className="col-span-4">Name</div>
                    <div className="col-span-5">Description</div>
                    <div className="col-span-2 text-right">Enabled</div>
                </div>

                <div className="divide-y divide-slate-100">
                    {onAdd && (
                        <div
                            onClick={() => onAdd(null)}
                            className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 cursor-pointer transition-colors group"
                        >
                            <div className="col-span-1 flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500">
                                <Plus className="w-4 h-4" />
                            </div>
                            <div className="col-span-11 text-slate-500 font-medium group-hover:text-blue-600">
                                {addLabel}
                            </div>
                        </div>
                    )}

                    {filteredTags.map((tag) => (
                        <div key={tag.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center group hover:bg-slate-50/50 transition-colors">
                            <div className="col-span-1">
                                <div className={`w-6 h-6 rounded ${tag.color}`}></div>
                            </div>
                            <div className="col-span-4 font-medium text-slate-900 flex items-center gap-2">
                                {tag.name}
                                {tag.isPreset && (
                                    <TooltipProvider>
                                        <Tooltip delayDuration={300}>
                                            <TooltipTrigger asChild>
                                                <div className="p-1 bg-blue-50 text-blue-600 rounded-md border border-blue-100 hover:bg-blue-100 transition-colors cursor-help flex items-center justify-center">
                                                    <Sparkles className="w-3.5 h-3.5" />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                                <p>Built-in tag provided by Sophiie</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                                {tag.isAuto && (
                                    <TooltipProvider>
                                        <Tooltip delayDuration={300}>
                                            <TooltipTrigger asChild>
                                                <div className="p-1 bg-sky-50 text-sky-600 rounded-md border border-sky-100 hover:bg-sky-100 transition-colors cursor-help flex items-center justify-center">
                                                    <Bot className="w-3.5 h-3.5" />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                                <p>This tag has been automatically added and managed by Sophiie</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>
                            <div className="col-span-5 text-sm text-slate-500 truncate">
                                {tag.description}
                            </div>
                            <div className="col-span-2 flex items-center justify-end gap-3">
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mr-2">
                                    {onEdit && (
                                        <button onClick={() => onEdit(tag)} className="p-1.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600">
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                    <button className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-500">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <Switch checked={tag.enabled} />
                            </div>
                        </div>
                    ))}

                    {filteredTags.length === 0 && !onAdd && (
                        <div className="px-6 py-8 text-center text-slate-500 text-sm">
                            No tags found matching your search.
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-3">
                {onAdd && (
                    <button
                        onClick={() => onAdd(null)}
                        className="w-full flex items-center justify-center p-4 border border-dashed border-slate-300 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-all font-medium gap-2"
                    >
                        <Plus className="w-5 h-5" /> {addLabel}
                    </button>
                )}

                {filteredTags.map((tag) => (
                    <Card key={tag.id} className="p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full ${tag.color} shrink-0`}></div>
                                <div>
                                    <div className="font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                                        {tag.name}
                                        {tag.isPreset && (
                                            <TooltipProvider>
                                                <Tooltip delayDuration={300}>
                                                    <TooltipTrigger asChild>
                                                        <div className="p-1 bg-blue-50 text-blue-600 rounded-md border border-blue-100 flex items-center justify-center">
                                                            <Sparkles className="w-3.5 h-3.5" />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                                        <p>Built-in tag provided by Sophiie</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                        {tag.isAuto && (
                                            <TooltipProvider>
                                                <Tooltip delayDuration={300}>
                                                    <TooltipTrigger asChild>
                                                        <div className="p-1 bg-sky-50 text-sky-600 rounded-md border border-sky-100 flex items-center justify-center">
                                                            <Bot className="w-3.5 h-3.5" />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                                        <p>This tag has been automatically added and managed by Sophiie</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5">Enabled</p>
                                </div>
                            </div>
                            <Switch checked={tag.enabled} />
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg">
                            {tag.description}
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-50">
                            {onEdit && (
                                <Button size="sm" variant="ghost" className="h-8 text-slate-500" onClick={() => onEdit(tag)}>
                                    <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                                </Button>
                            )}
                            <Button size="sm" variant="ghost" className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                            </Button>
                        </div>
                    </Card>
                ))}

                {filteredTags.length === 0 && !onAdd && (
                    <div className="p-8 text-center text-slate-500 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        No tags found.
                    </div>
                )}
            </div>
        </div>
    );
}

export default function TagsView() {
    const navigate = useNavigate();
    const { startGlobalVoiceFlow } = useOutletContext();

    // Modal Stats
    const [customerState, setCustomerState] = useState({ open: false, editData: null });
    const [inquiryState, setInquiryState] = useState({ open: false, editData: null });

    // Search states
    const [customerSearch, setCustomerSearch] = useState('');
    const [inquirySearch, setInquirySearch] = useState('');
    const [autoSearch, setAutoSearch] = useState('');

    const openCustomerModal = (data = null) => setCustomerState({ open: true, editData: data });
    const openInquiryModal = (data = null) => setInquiryState({ open: true, editData: data });

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 px-4 py-4 md:px-8 md:py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 shrink-0">
                <div className="flex items-start gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/overview')} className="text-slate-500 hover:text-slate-900 mt-1 shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Tags Management</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage your customer and inquiry tags.</p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
                <div className="max-w-7xl mx-auto w-full space-y-8">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    <TagSection
                        title="Customer Tags"
                        tags={MOCK_CUSTOMER_TAGS}
                        addLabel="Add new customer tag"
                        onAdd={openCustomerModal}
                        onEdit={openCustomerModal}
                        searchQuery={customerSearch}
                        onSearchChange={setCustomerSearch}
                        icon={Tag}
                    />

                    <TagSection
                        title="Inquiry Tags"
                        tags={MOCK_INQUIRY_TAGS}
                        addLabel="Add new inquiry tag"
                        onAdd={openInquiryModal}
                        onEdit={openInquiryModal}
                        searchQuery={inquirySearch}
                        onSearchChange={setInquirySearch}
                        icon={Tag}
                    />

                    <TagSection
                        title="Auto-generated Tags"
                        tags={MOCK_AUTO_TAGS}
                        searchQuery={autoSearch}
                        onSearchChange={setAutoSearch}
                        icon={Tag}
                    />
                </div>
            </div>

            {/* Modals */}
            {customerState.open && (
                <CreateCustomerTagModal
                    onClose={() => setCustomerState({ open: false, editData: null })}
                    editData={customerState.editData} // Pass if you update CustomerModal too to accept it, ignoring for now as user verification focus is Inquiry
                />
            )}
            {inquiryState.open && (
                <CreateInquiriesTagModal
                    onClose={() => setInquiryState({ open: false, editData: null })}
                    editData={inquiryState.editData}
                />
            )}
        </div>
    );
}
