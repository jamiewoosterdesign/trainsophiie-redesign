import React, { useState, useRef } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { AddNewCard } from '@/components/shared/AddNewCard';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { Tag, Plus, ArrowLeft, Search, Pencil, Trash2, Filter, Info, AlertCircle, Sparkles, Bot, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Power, Copy } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import CreateCustomerTagModal from '@/components/modals/CreateCustomerTagModal';
import CreateInquiriesTagModal from '@/components/modals/CreateInquiriesTagModal';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';
import ViewToggle from '@/components/shared/ViewToggle';

const MOCK_CUSTOMER_TAGS = [
    { id: 1, name: 'VIP', color: 'bg-purple-500', colorHex: '#a855f7', description: 'Very Important Person', enabled: true, createdAt: 1700000000000 },
    { id: 2, name: 'New Customer', color: 'bg-green-500', colorHex: '#22c55e', description: 'First time customer', enabled: true, createdAt: 1700000000001 },
    { id: 3, name: 'Late Payer', color: 'bg-red-500', colorHex: '#ef4444', description: 'Historically pays late', enabled: true, createdAt: 1700000000002 },
];

const MOCK_INQUIRY_TAGS = [
    { id: 1, name: 'standard-job', color: 'bg-purple-100', colorHex: '#f3e8ff', description: 'Wants to book or schedule a service', enabled: true, isPreset: true, createdAt: 1700000000000 },
    { id: 2, name: 'complaint', color: 'bg-red-100', colorHex: '#fee2e2', description: 'Expresses dissatisfaction', enabled: true, isPreset: true, createdAt: 1700000000001 },
    { id: 3, name: 'urgent', color: 'bg-slate-200', colorHex: '#e2e8f0', description: 'Explicitly mentions urgency', enabled: true, isPreset: true, createdAt: 1700000000002 },
    { id: 4, name: 'Quote Request', color: 'bg-blue-500', colorHex: '#3b82f6', description: 'Looking for pricing', enabled: true, createdAt: 1700000000003 },
    // Mocking more items for pagination (total 20)
    ...Array.from({ length: 16 }).map((_, i) => ({
        id: 5 + i,
        name: `Inquiry Tag ${i + 1}`,
        color: ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-red-100'][i % 4],
        colorHex: '#e0e7ff',
        description: `Mock description for inquiry tag ${i + 1} to test pagination functionality.`,
        enabled: true,
        isPreset: false
    }))
];

const MOCK_AUTO_TAGS = [
    { id: 1, name: 'Solar Panel', color: 'bg-blue-300', colorHex: '#93c5fd', description: 'Solar panels to harness the suns light and transfer it in clean electricity', enabled: true, isAuto: true },
    { id: 2, name: 'Domestic Electrical', color: 'bg-yellow-100', colorHex: '#fef9c3', description: 'Residential electrical services including installations, upgrades and maintenance', enabled: true, isAuto: true },
    { id: 3, name: 'Commercial Electrical', color: 'bg-amber-800', colorHex: '#92400e', description: 'Fit outs, upgrades and maintenance', enabled: true, isAuto: true },
    { id: 4, name: 'Air Conditioning', color: 'bg-orange-500', colorHex: '#f97316', description: 'End-to-end design, supply and installation of air conditioning systems', enabled: true, isAuto: true },
];

const TagCard = ({ tag, onEdit, onDuplicate, onToggle, onDelete }) => (
    <Card
        className={`p-6 flex flex-col gap-3 dark:bg-slate-900 dark:border-slate-800 hover:shadow-md transition-all hover:-translate-y-1 group h-full justify-between ${tag.enabled === false ? 'opacity-70 grayscale-[0.5]' : ''}`}
        style={{ borderTop: `4px solid ${tag.colorHex}` }}
        onClick={() => onEdit && onEdit(tag)}
    >
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-md ${tag.color} shrink-0`}></div>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onEdit && onEdit(tag)}>
                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            {onDuplicate && (
                                <DropdownMenuItem onClick={() => onDuplicate(tag)}>
                                    <Copy className="mr-2 h-4 w-4" /> Duplicate
                                </DropdownMenuItem>
                            )}
                            {onToggle && (
                                <DropdownMenuItem onClick={() => onToggle(tag.id)}>
                                    <Power className="mr-2 h-4 w-4" />
                                    {tag.enabled ? 'Disable' : 'Enable'}
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {onDelete && (
                                <DropdownMenuItem className="text-red-600" onClick={() => onDelete(tag.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap mb-2">
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

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-lg mb-4 flex-grow">
                {tag.description}
            </p>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                <div className="flex flex-col gap-1">
                    {tag.isDraft && <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800 text-[10px] h-5 w-fit">Incomplete</Badge>}
                    {tag.enabled ? (
                        <Badge variant="success" className="w-fit">Active</Badge>
                    ) : (
                        <Badge variant="secondary" className="w-fit">Inactive</Badge>
                    )}
                </div>
            </div>
        </div>
    </Card>
);

function TagSection({ title, tags, onAdd, addLabel, addSubtitle, searchQuery, onSearchChange, icon: Icon, onEdit, view, onViewChange, onDuplicate, onToggle, onDelete }) {
    const [sortBy, setSortBy] = useState('date'); // 'date' | 'name' | 'status'
    const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'active' | 'inactive'
    const [filterType, setFilterType] = useState('all'); // 'all' | 'preset' | 'custom'
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 11;

    // Determine if we should show the "Type" filter
    const hasTypeDistinction = tags.some(tag => tag.isPreset || tag.isAuto);

    const filteredTags = tags
        .filter(tag =>
            tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tag.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(tag => {
            if (filterStatus === 'active') return tag.enabled;
            if (filterStatus === 'inactive') return !tag.enabled;
            return true;
        })
        .filter(tag => {
            if (!hasTypeDistinction) return true;
            if (filterType === 'preset') return tag.isPreset || tag.isAuto;
            if (filterType === 'custom') return !tag.isPreset && !tag.isAuto;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'date') return (b.createdAt || 0) - (a.createdAt || 0); // Newest first
            if (sortBy === 'status') {
                // Active first
                if (a.enabled === b.enabled) return 0;
                return a.enabled ? -1 : 1;
            }
            // Default to name
            return a.name.localeCompare(b.name);
        });

    // Pagination logic
    const totalPages = Math.max(1, Math.ceil(filteredTags.length / ITEMS_PER_PAGE));
    const paginatedTags = filteredTags.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterStatus, filterType, sortBy, view]);

    return (
        <div className="space-y-4">
            {/* Header / Search / Filters */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {Icon && <Icon className="w-5 h-5 text-slate-500" />} {title}
                    </h2>
                    <ViewToggle view={view} onViewChange={onViewChange} />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search tags..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9 h-9 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full"
                        />
                    </div>

                    {/* Filters & Sort */}
                    <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                        {/* Type Filter (Conditional) */}
                        {hasTypeDistinction && (
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="w-[130px] h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="preset">Preset / Auto</SelectItem>
                                    <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                            </Select>
                        )}

                        {/* Status Filter */}
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[130px] h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Sort */}
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[140px] h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="date">Date Added</SelectItem>
                                <SelectItem value="name">Name (A-Z)</SelectItem>
                                <SelectItem value="status">Active First</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Desktop View: Table Rows */}
            {view === 'table' && (
                <div className="hidden md:block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <div className="col-span-1">Colour</div>
                        <div className="col-span-4">Name</div>
                        <div className="col-span-5">Description</div>
                        <div className="col-span-2 text-right">Enabled</div>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {onAdd && currentPage === 1 && (
                            <div
                                onClick={() => onAdd(null)}
                                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                            >
                                <div className="col-span-1 flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 group-hover:border-blue-500 group-hover:text-blue-500">
                                    <Plus className="w-4 h-4" />
                                </div>
                                <div className="col-span-11 text-slate-500 dark:text-slate-400 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                    {addLabel}
                                </div>
                            </div>
                        )}

                        {paginatedTags.map((tag) => (
                            <div key={tag.id} className={`grid grid-cols-12 gap-4 px-6 py-4 items-center group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors ${tag.enabled === false ? 'opacity-70 grayscale-[0.5]' : ''}`}>
                                <div className="col-span-1">
                                    <div className={`w-6 h-6 rounded ${tag.color}`}></div>
                                </div>
                                <div className="col-span-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                    {tag.name}
                                    {tag.isPreset && (
                                        <TooltipProvider>
                                            <Tooltip delayDuration={300}>
                                                <TooltipTrigger asChild>
                                                    <div className="p-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-help flex items-center justify-center">
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
                                                    <div className="p-1 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-md border border-sky-100 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors cursor-help flex items-center justify-center">
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
                                <div className="col-span-5 text-sm text-slate-500 dark:text-slate-400 truncate">
                                    {tag.description}
                                </div>
                                <div className="col-span-2 flex items-center justify-end gap-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => onEdit && onEdit(tag)}>
                                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            {onDuplicate && (
                                                <DropdownMenuItem onClick={() => onDuplicate(tag)}>
                                                    <Copy className="mr-2 h-4 w-4" /> Duplicate
                                                </DropdownMenuItem>
                                            )}
                                            {onToggle && (
                                                <DropdownMenuItem onClick={() => onToggle(tag.id)}>
                                                    <Power className="mr-2 h-4 w-4" />
                                                    {tag.enabled ? 'Disable' : 'Enable'}
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            {onDelete && (
                                                <DropdownMenuItem className="text-red-600" onClick={() => onDelete(tag.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}

                        {filteredTags.length === 0 && !onAdd && (
                            <div className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                                No tags found matching your criteria.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Desktop Grid View */}
            {view === 'grid' && (
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {onAdd && (
                        <AddNewCard
                            title={addLabel}
                            description={addSubtitle}
                            onClick={() => onAdd(null)}
                            className="h-full"
                        />
                    )}
                    {paginatedTags.map(tag => (
                        <TagCard key={tag.id} tag={tag} onEdit={onEdit} onDuplicate={onDuplicate} onToggle={onToggle} onDelete={onDelete} />
                    ))}
                    {filteredTags.length === 0 && !onAdd && (
                        <div className="col-span-full p-8 text-center text-slate-500 dark:text-slate-400 text-sm bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                            No tags found matching your criteria.
                        </div>
                    )}
                </div>
            )}

            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-3">
                {onAdd && (
                    <AddNewCard
                        title={addLabel}
                        onClick={() => onAdd(null)}
                        variant="compact"
                    />
                )}

                {paginatedTags.map((tag) => (
                    <TagCard key={tag.id} tag={tag} onEdit={onEdit} onDuplicate={onDuplicate} onToggle={onToggle} onDelete={onDelete} />
                ))}

                {filteredTags.length === 0 && !onAdd && (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                        No tags found matching your criteria.
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredTags.length)}</span> of <span className="font-medium">{filteredTags.length}</span> results
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="text-sm font-medium text-slate-900 dark:text-white px-2">
                            Page {currentPage} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TagsView() {
    const navigate = useNavigate();
    const { startGlobalVoiceFlow } = useOutletContext();
    const [view, setView] = useState('grid'); // 'table' | 'grid'
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);

    // State for tags
    const [customerTags, setCustomerTags] = useState(MOCK_CUSTOMER_TAGS);
    const [inquiryTags, setInquiryTags] = useState(MOCK_INQUIRY_TAGS);

    // Modal Stats
    const [customerState, setCustomerState] = useState({ open: false, editData: null });
    const [inquiryState, setInquiryState] = useState({ open: false, editData: null });

    // Search states
    const [customerSearch, setCustomerSearch] = useState('');
    const [inquirySearch, setInquirySearch] = useState('');
    const [autoSearch, setAutoSearch] = useState('');

    const openCustomerModal = (data = null) => setCustomerState({ open: true, editData: data });
    const openInquiryModal = (data = null) => setInquiryState({ open: true, editData: data });

    const handleCustomerClose = (data) => {
        if (data && data.name) {
            setCustomerTags(prev => [data, ...prev]);
        }
        setCustomerState({ open: false, editData: null });
    };

    const handleInquiryClose = (data) => {
        if (data && data.name) {
            setInquiryTags(prev => [data, ...prev]);
        }
        setInquiryState({ open: false, editData: null });
    };

    // Cust Handlers
    const handleDuplicateCustomerTag = (tag) => {
        const newTag = { ...tag, id: Date.now(), name: `${tag.name} 2`, enabled: false, createdAt: Date.now() };
        setCustomerTags(prev => [newTag, ...prev]);
    };
    const handleToggleCustomerTag = (id) => {
        setCustomerTags(prev => prev.map(t => t.id === id ? { ...t, enabled: t.enabled === false ? true : false } : t));
    };
    const handleDeleteCustomerTag = (id) => {
        setCustomerTags(prev => prev.filter(t => t.id !== id));
    };

    // Inquiry Handlers
    const handleDuplicateInquiryTag = (tag) => {
        const newTag = { ...tag, id: Date.now(), name: `${tag.name} 2`, enabled: false, createdAt: Date.now() };
        setInquiryTags(prev => [newTag, ...prev]);
    };
    const handleToggleInquiryTag = (id) => {
        setInquiryTags(prev => prev.map(t => t.id === id ? { ...t, enabled: t.enabled === false ? true : false } : t));
    };
    const handleDeleteInquiryTag = (id) => {
        setInquiryTags(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            {/* Header */}
            {/* Header */}
            <PageHeader
                title="Tags Management"
                subtitle="Manage your customer and inquiry tags."
                scrollDirection={scrollDirection}
            >
                <Button onClick={() => openCustomerModal(null)} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" /> Add Customer Tag
                </Button>
                <Button variant="outline" onClick={() => openInquiryModal(null)} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" /> Add Inquiry Tag
                </Button>
            </PageHeader>

            {/* Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto w-full space-y-8">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    <TagSection
                        title="Customer Tags"
                        tags={customerTags}
                        addLabel="Add new customer tag"
                        addSubtitle="Create tags for call categorization"
                        onAdd={openCustomerModal}
                        onEdit={openCustomerModal}
                        searchQuery={customerSearch}
                        onSearchChange={setCustomerSearch}
                        icon={Tag}
                        view={view}
                        onViewChange={setView}
                        onDuplicate={handleDuplicateCustomerTag}
                        onToggle={handleToggleCustomerTag}
                        onDelete={handleDeleteCustomerTag}
                    />

                    <TagSection
                        title="Inquiry Tags"
                        tags={inquiryTags}
                        addLabel="Add new inquiry tag"
                        addSubtitle="Create tags for call categorization"
                        onAdd={openInquiryModal}
                        onEdit={openInquiryModal}
                        searchQuery={inquirySearch}
                        onSearchChange={setInquirySearch}
                        icon={Tag}
                        view={view}
                        onViewChange={setView}
                        onDuplicate={handleDuplicateInquiryTag}
                        onToggle={handleToggleInquiryTag}
                        onDelete={handleDeleteInquiryTag}
                    />

                    <TagSection
                        title="Auto-generated Tags"
                        tags={MOCK_AUTO_TAGS}
                        searchQuery={autoSearch}
                        onSearchChange={setAutoSearch}
                        icon={Tag}
                        view={view}
                    />
                </div>
            </div>

            {/* Modals */}
            {customerState.open && (
                <CreateCustomerTagModal
                    onClose={handleCustomerClose}
                    editData={customerState.editData}
                />
            )}
            {inquiryState.open && (
                <CreateInquiriesTagModal
                    onClose={handleInquiryClose}
                    editData={inquiryState.editData}
                />
            )}
        </div>
    );
}
