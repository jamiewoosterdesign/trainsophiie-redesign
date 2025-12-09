import React, { useState, useRef } from 'react';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, ShieldAlert, Trash2, ArrowLeft, Zap, Waypoints, Search, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
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
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';
import { ViewToggle } from '@/components/shared/ViewToggle';

// Expanded Mock Scenarios
const MOCK_SCENARIOS = [
    { id: 1, name: "Refund Request", trigger: "Customer asks for money back", action: "Check eligibility, process if < $50", type: "Refund" },
    { id: 2, name: "Angry Customer", trigger: "Sentiment is negative/hostile", action: "Apologize, escalate to human manager", type: "Complaint" },
    { id: 3, name: "Pricing Inquiry", trigger: "Customer asks for price list", action: "Email standard pricing PDF", type: "General" },
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

    const [view, setView] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 11;
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);

    // Filter & Sort Logic
    const filteredScenarios = MOCK_SCENARIOS
        .filter(scenario =>
            scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            scenario.trigger.toLowerCase().includes(searchQuery.toLowerCase()) ||
            scenario.action.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(scenario => filterType === 'all' || scenario.type === filterType)
        .sort((a, b) => {
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
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-4 md:px-8 md:py-5 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 shrink-0 sticky top-0 z-30 transition-shadow duration-300">
                <div className={`flex gap-4 transition-all duration-300 ${scrollDirection === 'down' ? 'items-center' : 'items-start'}`}>
                    <Button variant="ghost" size="icon" onClick={() => navigate('/overview')} className={`text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 shrink-0 transition-all duration-300 ${scrollDirection === 'down' ? 'mt-0' : 'mt-1'}`}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className={`font-bold text-slate-900 dark:text-white transition-all duration-300 ${scrollDirection === 'down' ? 'text-lg' : 'text-xl md:text-2xl'}`}>Scenarios & Restrictions</h1>
                        <p className={`text-slate-500 dark:text-slate-400 text-sm transition-all duration-300 ${scrollDirection === 'down' ? 'max-h-0 opacity-0 mt-0' : 'max-h-20 opacity-100 mt-1'}`}>Define handling rules for refunds, complaints, and general inquiries.</p>
                    </div>
                </div>
                <Button onClick={() => openWizard('protocol')} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" /> Add Scenario
                </Button>
            </header>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950 px-4">
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
                                            <SelectItem value="name">Name (A-Z)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Grid View */}
                        {view === 'grid' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                <button onClick={() => openWizard('protocol')}
                                    className="hidden md:flex group border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all min-h-[240px]">
                                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                                        <Plus className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                                    </div>
                                    <span className="font-semibold text-lg">Create Scenario</span>
                                    <p className="text-xs text-center mt-2 opacity-70">Define new handling logic</p>
                                </button>
                                {/* Mobile Add Button (Top) */}
                                {currentPage === 1 && (
                                    <div className="md:hidden">
                                        <button onClick={() => openWizard('protocol')}
                                            className="w-full flex items-center justify-center p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium gap-2">
                                            <Plus className="w-5 h-5" /> Create Scenario
                                        </button>
                                    </div>
                                )}

                                {paginatedScenarios.map(proto => (
                                    <Card key={proto.id} className="p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col h-full min-h-[240px] dark:bg-slate-900 dark:border-slate-800">
                                        <div className="flex justify-between items-start mb-4">
                                            <Badge variant="default" className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800">{proto.type}</Badge>
                                        </div>
                                        <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{proto.name}</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex-grow">Trigger: {proto.trigger}</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700 mt-auto">
                                            <ArrowRight className="w-3 h-3 text-slate-400" />
                                            <span>{proto.action}</span>
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
                                    <div className="col-span-4">Action</div>
                                </div>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {currentPage === 1 && (
                                        <div onClick={() => openWizard('protocol')} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                                            <div className="col-span-12 flex items-center gap-3 text-slate-500 font-medium group-hover:text-blue-600">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500">
                                                    <Plus className="w-4 h-4" />
                                                </div>
                                                Create Scenario
                                            </div>
                                        </div>
                                    )}
                                    {paginatedScenarios.map(proto => (
                                        <div key={proto.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => openWizard('protocol')}>
                                            <div className="col-span-3 font-medium text-slate-900 dark:text-white">{proto.name}</div>
                                            <div className="col-span-1">
                                                <Badge variant="outline" className="text-[10px] h-5">{proto.type}</Badge>
                                            </div>
                                            <div className="col-span-4 text-sm text-slate-500 dark:text-slate-400 truncate">{proto.trigger}</div>
                                            <div className="col-span-4 text-sm text-slate-500 dark:text-slate-400 truncate flex items-center gap-2">
                                                <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                                                {proto.action}
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
                                        <button onClick={() => openWizard('protocol')}
                                            className="w-full flex items-center justify-center p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium gap-2">
                                            <Plus className="w-5 h-5" /> Create Scenario
                                        </button>
                                    )}
                                    {paginatedScenarios.map(proto => (
                                        <div key={proto.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm" onClick={() => openWizard('protocol')}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{proto.name}</h3>
                                                <Badge variant="outline" className="text-[10px] h-5">{proto.type}</Badge>
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
