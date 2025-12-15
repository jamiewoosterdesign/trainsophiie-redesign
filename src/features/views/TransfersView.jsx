import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { AddNewCard } from '@/components/shared/AddNewCard';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Plus, Settings, Users, ArrowLeft, PhoneForwarded, Search, ChevronLeft, ChevronRight, LayoutGrid, List, CheckCircle, X, MoreHorizontal, Copy, Power, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';
import { ViewToggle } from '@/components/shared/ViewToggle';
import { useDemo } from '@/context/DemoContext';

// Local Mock Data for Transfer Rules
const MOCK_TRANSFER_RULES = [
    { id: 1, name: "Sales Dept", desc: "When someone wants to speak to sales or buy something.", type: "Warm", active: true, createdAt: 1700000000000 },
    { id: 2, name: "Support Team", desc: "Technical issues, bugs, or troubleshooting.", type: "Cold", active: true, createdAt: 1700000000001 },
    { id: 3, name: "Billing & Accounts", desc: "Invoices, refunds, and payment updates.", type: "Warm", active: true, createdAt: 1700000000002 },
    { id: 4, name: "Escalations", desc: "Angry customers or manager requests.", type: "Warm", active: true },
    { id: 5, name: "General Inquiries", desc: "Business hours, location, and general info.", type: "Cold", active: true },
    { id: 6, name: "Marketing", desc: "Press, partnerships, and advertising.", type: "Cold", active: false },
    { id: 7, name: "HR Department", desc: "Job applications and internal matters.", type: "Cold", active: true },
    { id: 8, name: "Emergency Line", desc: "Urgent matters outside business hours.", type: "Warm", active: true },
    { id: 9, name: "Voicemail", desc: "When no staff members are available.", type: "Cold", active: true },
    { id: 10, name: "New Client Onboarding", desc: "Scheduling initial consultations.", type: "Warm", active: true },
    { id: 11, name: "Returns", desc: "RMA requests and return status.", type: "Cold", active: true },
    { id: 12, name: "Legal", desc: "Compliance and legal notices.", type: "Warm", active: false },
    { id: 13, name: "VIP Support", desc: "Dedicated line for premium customers.", type: "Warm", active: true },
    { id: 14, name: "International", desc: "Routing for non-local calls.", type: "Cold", active: true },
    { id: 15, name: "Feedback", desc: "Customer satisfaction surveys.", type: "Cold", active: true },
];

export default function TransfersView() {
    const { openWizard, openSettings, startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();
    const { isBlankState } = useDemo();

    const [rules, setRules] = useState(MOCK_TRANSFER_RULES);

    useEffect(() => {
        if (isBlankState) {
            setRules([]);
        } else {
            setRules(MOCK_TRANSFER_RULES);
        }
    }, [isBlankState]);

    const [showSuccess, setShowSuccess] = useState({ show: false, type: 'created' });
    const [highlightedRuleId, setHighlightedRuleId] = useState(null);

    const handleCreateRule = (data) => {
        const newRuleId = `new-rule-${Date.now()}`;
        const newRule = {
            id: newRuleId,
            name: data.transferName || 'New Transfer Rule',
            desc: "Custom transfer rule.",
            type: "Warm",
            active: data.status !== 'draft',
            isDraft: data.status === 'draft',
            createdAt: Date.now()
        };

        setRules(prev => [newRule, ...prev]);
        setShowSuccess({ show: true, type: data.status === 'draft' ? 'saved' : 'created' });
        setHighlightedRuleId(newRuleId);

        setTimeout(() => setHighlightedRuleId(null), 6000);
    };

    const handleDuplicateRule = (rule) => {
        const newRule = {
            ...rule,
            id: `dup-${Date.now()}`,
            name: `${rule.name} 2`,
            active: false,
            isDraft: false,
            createdAt: Date.now()
        };
        setRules(prev => [newRule, ...prev]);
        setShowSuccess({ show: true, type: 'created' }); // Just re-use created for minimal feedback
        setHighlightedRuleId(newRule.id);
        setTimeout(() => setShowSuccess({ show: false, type: 'created' }), 3000);
    };

    const handleToggleRuleStatus = (id) => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, active: r.active === false ? true : false } : r));
    };

    const handleDeleteRule = (id) => {
        setRules(prev => prev.filter(r => r.id !== id));
    };

    const [view, setView] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all' | 'Warm' | 'Cold'
    const [sortBy, setSortBy] = useState('date');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 11;
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);

    // Filter & Sort Logic
    const filteredRules = rules
        .filter(rule =>
            rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rule.desc.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(rule => {
            if (filterType === 'all') return true;
            return rule.type === filterType;
        })
        .sort((a, b) => {
            if (sortBy === 'date') return (b.createdAt || 0) - (a.createdAt || 0); // Newest first
            if (sortBy === 'active') return (a.active === b.active) ? 0 : a.active ? -1 : 1;
            return a.name.localeCompare(b.name);
        });

    // Pagination Logic
    const totalPages = Math.max(1, Math.ceil(filteredRules.length / ITEMS_PER_PAGE));
    const paginatedRules = filteredRules.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset page on filter change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterType, sortBy, view]);

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300 relative">
            {/* Success Modal Overlay */}
            {showSuccess.show && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-3 w-80 border border-slate-100 dark:border-slate-800 relative">
                        <button
                            onClick={() => setShowSuccess({ show: false, type: 'created' })}
                            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center animate-in zoom-in duration-300 ${showSuccess.type === 'saved' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div className="text-center space-y-0.5">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{showSuccess.type === 'saved' ? 'Rule Saved' : 'Rule Created!'}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{showSuccess.type === 'saved' ? 'You can finish it later.' : 'Added to your list.'}</p>
                        </div>
                        {/* Progress bar to show auto-dismiss */}
                        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                            <div className={`h-full rounded-full animate-progress ${showSuccess.type === 'saved' ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: '100%', animation: 'shrink 3s linear forwards' }}></div>
                        </div>
                    </div>
                </div>
            )}
            {/* Add keyframes for progress bar locally */}
            <style>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
            <PageHeader
                title="Transfers Configuration"
                subtitle="Manage call transfer rules."
                scrollDirection={scrollDirection}
            >
                <Button variant="outline" onClick={openSettings} className="hidden md:flex w-full md:w-auto dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700">
                    <Settings className="w-4 h-4 mr-2" /> Global Settings
                </Button>
                <Button onClick={() => openWizard('transfer', {}, (data) => handleCreateRule(data))} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" /> Add Rule
                </Button>
            </PageHeader>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto w-full space-y-8">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    {/* Global Settings Banner */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm">
                        <div
                            onClick={openSettings}
                            className="bg-slate-50/50 dark:bg-slate-800/50 rounded-lg p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors" />
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">General Transfer Settings</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Configure timeouts, hold messages, and fallback behaviors.</p>
                                </div>
                            </div>
                            <div className="mr-2">
                                <div className="w-8 h-8 rounded-full bg-slate-200/50 dark:bg-slate-700/50 flex items-center justify-center text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200 transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
                        {/* Toolbar */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row justify-between items-center gap-4">
                                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <PhoneForwarded className="w-5 h-5 text-slate-500" /> Transfer Rules
                                </h2>
                                <ViewToggle view={view} onViewChange={setView} />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        placeholder="Search transfer rules..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 h-9 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full"
                                    />
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                                    <Select value={filterType} onValueChange={setFilterType}>
                                        <SelectTrigger className="w-[130px] h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="Warm">Warm</SelectItem>
                                            <SelectItem value="Cold">Cold</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-[140px] h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="date">Date Added</SelectItem>
                                            <SelectItem value="name">Name (A-Z)</SelectItem>
                                            <SelectItem value="active">Active First</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Grid View */}
                        {view === 'grid' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                <AddNewCard
                                    title="Add Transfer Rule"
                                    description="Route calls to specific numbers"
                                    onClick={() => openWizard('transfer', {}, (data) => handleCreateRule(data))}
                                />
                                {/* Mobile Add Button (Top) */}
                                {currentPage === 1 && (
                                    <div className="md:hidden">
                                        <AddNewCard
                                            title="Add Transfer Rule"
                                            onClick={() => openWizard('transfer', {}, (data) => handleCreateRule(data))}
                                            variant="compact"
                                        />
                                    </div>
                                )}
                                {paginatedRules.map(rule => (
                                    <Card key={rule.id} className={`p-6 hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 dark:bg-slate-900 dark:border-slate-800 flex flex-col h-full justify-between group ${rule.isDraft ? 'opacity-70 grayscale-[0.5]' : ''} ${rule.id === highlightedRuleId ? (rule.isDraft ? 'animate-in zoom-in-0 duration-500 border-orange-500 shadow-orange-500/20 shadow-md ring-1 ring-orange-500/50' : 'animate-in zoom-in-0 duration-500 border-blue-500 shadow-blue-500/20 shadow-md ring-1 ring-blue-500/50') : ''}`} onClick={() => openWizard('transfer')}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenuItem onClick={() => openWizard('transfer')}>
                                                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDuplicateRule(rule)}>
                                                        <Copy className="w-4 h-4 mr-2" /> Duplicate
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleToggleRuleStatus(rule.id)}>
                                                        <Power className={`w-4 h-4 mr-2 ${rule.active ? "text-green-500" : "text-slate-400"}`} /> {rule.active ? 'Disable' : 'Enable'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => handleDeleteRule(rule.id)}>
                                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{rule.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{rule.desc}</p>

                                        <div className="flex items-center justify-between text-sm text-slate-400 dark:text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex flex-col gap-1">
                                                {rule.isDraft && <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800 text-[10px] h-5 w-fit">Incomplete</Badge>}
                                                {!rule.isDraft && (
                                                    rule.active ? <Badge variant="success" className="w-fit">Active</Badge> : <Badge variant="secondary" className="w-fit">Inactive</Badge>
                                                )}
                                            </div>
                                            <Badge variant={rule.type === 'Warm' ? 'warning' : 'outline'} className="rounded-md">{rule.type}</Badge>
                                        </div>
                                    </Card>
                                ))}


                            </div>
                        )}

                        {/* Table View */}
                        {view === 'table' && (
                            <div className="hidden md:block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    <div className="col-span-4">Rule Name</div>
                                    <div className="col-span-4">Description</div>
                                    <div className="col-span-2">Type</div>
                                    <div className="col-span-1 text-right">Status</div>
                                    <div className="col-span-1 text-right">Actions</div>
                                </div>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {currentPage === 1 && (
                                        <div onClick={() => openWizard('transfer', {}, (data) => handleCreateRule(data))} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                                            <div className="col-span-12 flex items-center gap-3 text-slate-500 font-medium group-hover:text-blue-600">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500">
                                                    <Plus className="w-4 h-4" />
                                                </div>
                                                Add Transfer Rule
                                            </div>
                                        </div>
                                    )}
                                    {paginatedRules.map(rule => (
                                        <div key={rule.id} className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${(rule.isDraft || rule.active === false) ? 'opacity-70 grayscale-[0.5]' : ''} ${rule.id === highlightedRuleId ? (rule.isDraft ? 'bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-500 pl-5' : 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 pl-5') : ''}`} onClick={() => openWizard('transfer')}>
                                            <div className="col-span-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                                {rule.name}
                                                {rule.isDraft && <Badge variant="outline" className="text-[10px] h-5 bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">Incomplete</Badge>}
                                            </div>
                                            <div className="col-span-4 text-sm text-slate-500 dark:text-slate-400 truncate">{rule.desc}</div>
                                            <div className="col-span-2">
                                                <Badge variant={rule.type === 'Warm' ? 'warning' : 'outline'}>{rule.type}</Badge>
                                            </div>
                                            <div className="col-span-1 text-right">
                                                {rule.isDraft && <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800 text-[10px] h-5 w-fit">Incomplete</Badge>}
                                                {!rule.isDraft && (
                                                    rule.active ? <Badge variant="success" className="w-fit">Active</Badge> : <Badge variant="secondary" className="w-fit">Inactive</Badge>
                                                )}
                                            </div>
                                            <div className="col-span-1 text-right flex justify-end">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                                        <DropdownMenuItem onClick={() => openWizard('transfer')}>
                                                            <Edit2 className="w-4 h-4 mr-2" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDuplicateRule(rule)}>
                                                            <Copy className="w-4 h-4 mr-2" /> Duplicate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleToggleRuleStatus(rule.id)}>
                                                            <Power className={`w-4 h-4 mr-2 ${rule.active ? "text-green-500" : "text-slate-400"}`} /> {rule.active ? 'Disable' : 'Enable'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => handleDeleteRule(rule.id)}>
                                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Mobile List View fallback */}
                        <div className="md:hidden space-y-4">
                            {view === 'table' && (
                                <>
                                    {currentPage === 1 && (
                                        <AddNewCard
                                            title="Add Transfer Rule"
                                            onClick={() => openWizard('transfer', {}, (data) => handleCreateRule(data))}
                                            variant="compact"
                                        />
                                    )}
                                    {paginatedRules.map(rule => (
                                        <Card key={rule.id} className={`p-4 hover:shadow-md transition-all cursor-pointer dark:bg-slate-900 dark:border-slate-800 ${rule.isDraft ? 'opacity-70 grayscale-[0.5]' : ''} ${rule.id === highlightedRuleId ? (rule.isDraft ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10' : 'border-blue-500 bg-blue-50 dark:bg-blue-900/10') : ''}`} onClick={() => openWizard('transfer')}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-slate-900 dark:text-white">{rule.name}</h3>
                                                <Badge variant={rule.isDraft ? 'outline' : (rule.type === 'Warm' ? 'warning' : 'outline')} className={rule.isDraft ? "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800" : ""}>{rule.isDraft ? 'Incomplete' : rule.type}</Badge>
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{rule.desc}</p>
                                            <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2">
                                                <span className={`flex items-center gap-1 ${rule.isDraft ? 'text-orange-600' : ''}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${rule.isDraft ? 'bg-orange-500' : (rule.active ? 'bg-green-500' : 'bg-slate-300')}`} />
                                                    {rule.isDraft ? 'Draft' : (rule.active ? 'Active' : 'Inactive')}
                                                </span>
                                            </div>
                                        </Card>
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4">
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredRules.length)}</span> of <span className="font-medium">{filteredRules.length}</span> results
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
                </div>
            </div>
        </div >
    );
}
