import React, { useState, useRef } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { AddNewCard } from '@/components/shared/AddNewCard';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, ShieldAlert, Trash2, ArrowLeft, Zap, Waypoints, Search, ChevronLeft, ChevronRight, LayoutGrid, List, CheckCircle, X, MoreHorizontal, Copy, Power, Edit2 } from 'lucide-react';
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

// Expanded Mock Scenarios
const MOCK_SCENARIOS = [
    { id: 1, name: "Refund Request", trigger: "Customer asks for money back", action: "Check eligibility, process if < $50", type: "Refund", createdAt: 1700000000000 },
    { id: 2, name: "Angry Customer", trigger: "Sentiment is negative/hostile", action: "Apologize, escalate to human manager", type: "Complaint", createdAt: 1700000000001 },
    { id: 3, name: "Pricing Inquiry", trigger: "Customer asks for price list", action: "Email standard pricing PDF", type: "General", createdAt: 1700000000002 },
    { id: 4, name: "Cancel Subscription", trigger: "Customer wants to cancel", action: "Offer discount, then process cancellation", type: "Booking" },
    { id: 5, name: "Late Delivery", trigger: "Customer complains about delay", action: "Check status, refund shipping fee", type: "Complaint" },
    { id: 6, name: "Change Address", trigger: "Customer wants to change address", action: "Update CRM, confirm via email", type: "Booking" },
    { id: 7, name: "Warranty Claim", trigger: "Customer reports broken item", action: "Ask for photo, initiate return", type: "Refund" },
    { id: 8, name: "Speak to Human", trigger: "Customer asks specifically for person", action: "Transfer to support line", type: "General" },
    { id: 9, name: "Product Availability", trigger: "Customer asks if in stock", action: "Check inventory database", type: "General" },
    { id: 10, name: "Payment Failed", trigger: "System detects payment error", action: "Ask for alternative payment method", type: "Booking" },
    { id: 11, name: "Schedule Demo", trigger: "Customer wants to see product", action: "Book appointment in calendar", type: "Booking" },
    { id: 12, name: "Forgot Password", trigger: "Customer cannot login", action: "Send password reset link", type: "General" },
    { id: 13, name: "Upgrade Plan", trigger: "Customer wants more features", action: "Explain tiers, process upgrade", type: "Booking" },
    { id: 14, name: "Data Deletion", trigger: "Customer invokes GDPR rights", action: "Log request, notify legal team", type: "Complaint" },
    { id: 15, name: "Wrong Item Received", trigger: "Customer received incorrect product", action: "Ship correct item immediately", type: "Refund" },
];

export default function ScenariosView() {
    const { openWizard, startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();

    const [scenarios, setScenarios] = useState(MOCK_SCENARIOS);
    const [showSuccess, setShowSuccess] = useState({ show: false, type: 'created' }); // type: 'created' | 'saved'
    const [highlightedScenarioId, setHighlightedScenarioId] = useState(null);

    const handleCreateScenario = (data) => {
        // Create new scenario object
        const newScenarioId = `new-${Date.now()}`;
        const newScenario = {
            id: newScenarioId,
            name: data.scenarioName || 'New Scenario',
            trigger: data.protocolTrigger || 'No trigger defined',
            action: "Standard response", // Or extract from wizard if available
            type: "General", // Or extract from wizard
            isDraft: data.status === 'draft',
            createdAt: Date.now()
        };

        setScenarios(prev => [newScenario, ...prev]);

        // Show success modal
        setShowSuccess({ show: true, type: data.status === 'draft' ? 'saved' : 'created' });
        setHighlightedScenarioId(newScenarioId);

        // Auto-dismiss modal after 3 seconds
        setTimeout(() => setShowSuccess({ show: false, type: 'created' }), 3000);

        // Remove highlight after 6 seconds (3s modal + 3s fade out)
        setTimeout(() => setHighlightedScenarioId(null), 6000);
    };

    const handleDuplicateScenario = (scenario) => {
        const newScenario = {
            ...scenario,
            id: `dup-${Date.now()}`,
            name: `${scenario.name} 2`,
            active: false,
            isDraft: false,
            createdAt: Date.now()
        };
        setScenarios(prev => [newScenario, ...prev]);
        setShowSuccess({ show: true, type: 'created', message: 'Scenario Duplicated' });
        setTimeout(() => setShowSuccess({ show: false, type: 'created' }), 3000);
    };

    const handleToggleScenarioStatus = (id) => {
        setScenarios(prev => prev.map(s => s.id === id ? { ...s, active: s.active === false ? true : false } : s));
    };

    const handleDeleteScenario = (id) => {
        setScenarios(prev => prev.filter(s => s.id !== id));
    };

    const [view, setView] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 11;
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);

    // Filter & Sort Logic
    const filteredScenarios = scenarios
        .filter(scenario =>
            scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            scenario.trigger.toLowerCase().includes(searchQuery.toLowerCase()) ||
            scenario.action.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(scenario => filterType === 'all' || scenario.type === filterType)
        .sort((a, b) => {
            if (sortBy === 'date') return (b.createdAt || 0) - (a.createdAt || 0);
            // Sort by name (A-Z)
            return a.name.localeCompare(b.name);
        });

    // Pagination Logic
    const totalPages = Math.max(1, Math.ceil(filteredScenarios.length / ITEMS_PER_PAGE));
    const paginatedScenarios = filteredScenarios.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset page
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterType, sortBy, view]);

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300 relative">
            {/* Success Modal Overlay */}
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
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{showSuccess.type === 'saved' ? 'Scenario Saved' : 'Scenario Created!'}</h3>
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
                title="Scenarios & Restrictions"
                subtitle="Define handling rules for refunds, complaints, and general inquiries."
                scrollDirection={scrollDirection}
            >
                <Button onClick={() => openWizard('protocol', {}, (data) => handleCreateScenario(data))} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" /> Add Scenario
                </Button>
            </PageHeader>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:px-8 bg-slate-50/50 dark:bg-slate-950 px-4">
                <div className="max-w-7xl mx-auto w-full space-y-8">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    <div>
                        {/* Toolbar */}
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex flex-row justify-between items-center gap-4">
                                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <Waypoints className="w-5 h-5 text-slate-500" /> Scenarios
                                </h2>
                                <ViewToggle view={view} onViewChange={setView} />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        placeholder="Search scenarios..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 h-9 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full"
                                    />
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                                    <Select value={filterType} onValueChange={setFilterType}>
                                        <SelectTrigger className="w-[140px] h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                                            <SelectValue placeholder="Topic" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Topics</SelectItem>
                                            <SelectItem value="Refund">Refund</SelectItem>
                                            <SelectItem value="Complaint">Complaint</SelectItem>
                                            <SelectItem value="Booking">Booking</SelectItem>
                                            <SelectItem value="General">General</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-[140px] h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="date">Date Added</SelectItem>
                                            <SelectItem value="name">Name (A-Z)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Grid View */}
                        {view === 'grid' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                <AddNewCard
                                    title="Create Scenario"
                                    description="Handle refunds, complaints & more"
                                    onClick={() => openWizard('protocol', {}, (data) => handleCreateScenario(data))}
                                />
                                {/* Mobile Add Button (Top) */}
                                {currentPage === 1 && (
                                    <div className="md:hidden">
                                        <AddNewCard
                                            title="Create Scenario"
                                            onClick={() => openWizard('protocol')}
                                            variant="compact"
                                        />
                                    </div>
                                )}

                                {paginatedScenarios.map(proto => (
                                    <Card key={proto.id} className={`p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col h-full min-h-[290px] dark:bg-slate-900 dark:border-slate-800 group ${(proto.isDraft || proto.active === false) ? 'opacity-70 grayscale-[0.5]' : ''} ${proto.id === highlightedScenarioId ? (proto.isDraft ? 'animate-in zoom-in-0 duration-500 border-orange-500 shadow-orange-500/20 shadow-md ring-1 ring-orange-500/50' : 'animate-in zoom-in-0 duration-500 border-blue-500 shadow-blue-500/20 shadow-md ring-1 ring-blue-500/50') : ''}`} onClick={() => openWizard('protocol')}>
                                        <div className="flex justify-between items-start mb-4">
                                            <Badge variant="default" className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800">{proto.type}</Badge>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenuItem onClick={() => openWizard('protocol')}>
                                                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDuplicateScenario(proto)}>
                                                        <Copy className="w-4 h-4 mr-2" /> Duplicate
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleToggleScenarioStatus(proto.id)}>
                                                        <Power className={`w-4 h-4 mr-2 ${proto.active !== false ? "text-green-500" : "text-slate-400"}`} /> {proto.active !== false ? 'Disable' : 'Enable'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => handleDeleteScenario(proto.id)}>
                                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{proto.name}</h4>
                                        <div className="mb-4 flex-grow text-sm">
                                            <span className="text-slate-500 dark:text-slate-400">Trigger: </span>
                                            <span className="text-slate-900 dark:text-slate-100">{proto.trigger}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700 mb-4">
                                            <ArrowRight className="w-3 h-3 text-slate-400" />
                                            <span>{proto.action}</span>
                                        </div>

                                        <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <div>
                                                {proto.isDraft && <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">Incomplete</Badge>}
                                                {!proto.isDraft && (proto.active !== false ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>)}
                                            </div>
                                        </div>
                                    </Card>
                                ))}

                            </div>
                        )}

                        {/* Table View */}
                        {view === 'table' && (
                            <div className="hidden md:block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    <div className="col-span-3">Scenario</div>
                                    <div className="col-span-1">Type</div>
                                    <div className="col-span-4">Trigger</div>
                                    <div className="col-span-3">Action</div>
                                    <div className="col-span-1 text-right">Actions</div>
                                </div>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {currentPage === 1 && (
                                        <div onClick={() => openWizard('protocol', {}, (data) => handleCreateScenario(data))} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                                            <div className="col-span-12 flex items-center gap-3 text-slate-500 font-medium group-hover:text-blue-600">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500">
                                                    <Plus className="w-4 h-4" />
                                                </div>
                                                Create Scenario
                                            </div>
                                        </div>
                                    )}
                                    {paginatedScenarios.map(proto => (
                                        <div key={proto.id} className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${(proto.isDraft || proto.active === false) ? 'opacity-70 grayscale-[0.5]' : ''} ${proto.id === highlightedScenarioId ? (proto.isDraft ? 'bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-500 pl-5' : 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 pl-5') : ''}`} onClick={() => openWizard('protocol')}>
                                            <div className="col-span-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                                {proto.name}
                                                {proto.isDraft && <Badge variant="outline" className="text-[10px] h-5 bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">Incomplete</Badge>}
                                            </div>
                                            <div className="col-span-1">
                                                <Badge variant="outline" className="text-[10px] h-5">{proto.type}</Badge>
                                            </div>
                                            <div className="col-span-4 text-sm text-slate-500 dark:text-slate-400 truncate">{proto.trigger}</div>
                                            <div className="col-span-3 text-sm text-slate-500 dark:text-slate-400 truncate flex items-center gap-2">
                                                <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                                                {proto.action}
                                            </div>
                                            <div className="col-span-1 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                                        <DropdownMenuItem onClick={() => openWizard('protocol')}>
                                                            <Edit2 className="w-4 h-4 mr-2" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDuplicateScenario(proto)}>
                                                            <Copy className="w-4 h-4 mr-2" /> Duplicate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleToggleScenarioStatus(proto.id)}>
                                                            <Power className={`w-4 h-4 mr-2 ${proto.active !== false ? "text-green-500" : "text-slate-400"}`} /> {proto.active !== false ? 'Disable' : 'Enable'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => handleDeleteScenario(proto.id)}>
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
                                            title="Create Scenario"
                                            onClick={() => openWizard('protocol', {}, (data) => handleCreateScenario(data))}
                                            variant="compact"
                                        />
                                    )}
                                    {paginatedScenarios.map(proto => (
                                        <div key={proto.id} className={`p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm ${(proto.isDraft || proto.active === false) ? 'opacity-70 grayscale-[0.5]' : ''} ${proto.id === highlightedScenarioId ? (proto.isDraft ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10' : 'border-blue-500 bg-blue-50 dark:bg-blue-900/10') : ''}`} onClick={() => openWizard('protocol')}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{proto.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    {proto.isDraft && <Badge variant="outline" className="text-[10px] h-5 bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">Incomplete</Badge>}
                                                    <Badge variant="outline" className="text-[10px] h-5">{proto.type}</Badge>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Trigger: {proto.trigger}</p>
                                            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700 mt-auto">
                                                <ArrowRight className="w-3 h-3 text-slate-400" />
                                                <span>{proto.action}</span>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4">
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredScenarios.length)}</span> of <span className="font-medium">{filteredScenarios.length}</span> results
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

                    {/* Global Restrictions & Guardrails (Unchanged) */}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-slate-500" /> Restrictions
                        </h2>
                        <Card className="p-6 dark:bg-slate-900 dark:border-slate-800">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Define strict limits for the AI (Negative Constraints). These apply to every call.</p>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                        <div className="text-sm text-slate-700 dark:text-slate-300">
                                            <span className="font-bold text-slate-600 dark:text-slate-400 uppercase text-xs mr-2">Sophiie Must Never</span>
                                            Quote specific pricing unless explicitly listed in Services.
                                        </div>
                                    </div>
                                    <button className="text-slate-400 hover:text-red-500 dark:hover:text-red-400">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                        <div className="text-sm text-slate-700 dark:text-slate-300">
                                            <span className="font-bold text-slate-600 dark:text-slate-400 uppercase text-xs mr-2">Sophiie Must Never</span>
                                            Promise specific arrival times (give 2hr windows only).
                                        </div>
                                    </div>
                                    <button className="text-slate-400 hover:text-red-500 dark:hover:text-red-400">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex-1 relative">
                                        <span className="absolute left-3 top-3 text-slate-500 font-bold text-xs select-none uppercase">Never</span>
                                        <Input className="pl-14 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-white" placeholder="e.g. discuss politics or religion..." />
                                    </div>
                                    <Button variant="danger">Add Restriction</Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
