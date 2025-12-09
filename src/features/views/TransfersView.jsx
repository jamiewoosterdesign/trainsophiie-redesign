import React, { useState, useRef } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { AddNewCard } from '@/components/shared/AddNewCard';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Plus, Settings, Users, ArrowLeft, PhoneForwarded, Search, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
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

// Local Mock Data for Transfer Rules
const MOCK_TRANSFER_RULES = [
    { id: 1, name: "Sales Dept", desc: "When someone wants to speak to sales or buy something.", type: "Warm", active: true },
    { id: 2, name: "Support Team", desc: "Technical issues, bugs, or troubleshooting.", type: "Cold", active: true },
    { id: 3, name: "Billing & Accounts", desc: "Invoices, refunds, and payment updates.", type: "Warm", active: true },
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

    const [view, setView] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all' | 'Warm' | 'Cold'
    const [sortBy, setSortBy] = useState('name');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 11;
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);

    // Filter & Sort Logic
    const filteredRules = MOCK_TRANSFER_RULES
        .filter(rule =>
            rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rule.desc.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(rule => {
            if (filterType === 'all') return true;
            return rule.type === filterType;
        })
        .sort((a, b) => {
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
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <PageHeader
                title="Transfers Configuration"
                subtitle="Manage call transfer rules."
                scrollDirection={scrollDirection}
            >
                <Button variant="outline" onClick={openSettings} className="hidden md:flex w-full md:w-auto dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700">
                    <Settings className="w-4 h-4 mr-2" /> Global Settings
                </Button>
                <Button onClick={() => openWizard('transfer')} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" /> Add Rule
                </Button>
            </PageHeader>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto w-full space-y-8">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

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
                                onClick={() => openWizard('transfer')}
                            />
                            {/* Mobile Add Button (Top) */}
                            {currentPage === 1 && (
                                <div className="md:hidden">
                                    <AddNewCard
                                        title="Add Transfer Rule"
                                        onClick={() => openWizard('transfer')}
                                        variant="compact"
                                    />
                                </div>
                            )}
                            {paginatedRules.map(rule => (
                                <Card key={rule.id} className="p-6 hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 dark:bg-slate-900 dark:border-slate-800 flex flex-col h-full justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <Badge variant={rule.type === 'Warm' ? 'warning' : 'outline'}>{rule.type}</Badge>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{rule.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{rule.desc}</p>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-slate-400 dark:text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <span className="flex items-center gap-1">
                                            {rule.active ? (
                                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                            ) : (
                                                <span className="w-2 h-2 rounded-full bg-slate-300" />
                                            )}
                                            {rule.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </Card>
                            ))}


                        </div>
                    )}

                    {/* Table View */}
                    {view === 'table' && (
                        <div className="hidden md:block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                <div className="col-span-5">Rule Name</div>
                                <div className="col-span-4">Description</div>
                                <div className="col-span-2">Type</div>
                                <div className="col-span-1 text-right">Status</div>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {currentPage === 1 && (
                                    <div onClick={() => openWizard('transfer')} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                                        <div className="col-span-12 flex items-center gap-3 text-slate-500 font-medium group-hover:text-blue-600">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500">
                                                <Plus className="w-4 h-4" />
                                            </div>
                                            Add Transfer Rule
                                        </div>
                                    </div>
                                )}
                                {paginatedRules.map(rule => (
                                    <div key={rule.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => openWizard('transfer')}>
                                        <div className="col-span-5 font-medium text-slate-900 dark:text-white">{rule.name}</div>
                                        <div className="col-span-4 text-sm text-slate-500 dark:text-slate-400 truncate">{rule.desc}</div>
                                        <div className="col-span-2">
                                            <Badge variant={rule.type === 'Warm' ? 'warning' : 'outline'}>{rule.type}</Badge>
                                        </div>
                                        <div className="col-span-1 text-right">
                                            <div className={`inline-flex w-2 h-2 rounded-full ${rule.active ? 'bg-green-500' : 'bg-slate-300'}`} title={rule.active ? 'Active' : 'Inactive'} />
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
                                        onClick={() => openWizard('transfer')}
                                        variant="compact"
                                    />
                                )}
                                {paginatedRules.map(rule => (
                                    <Card key={rule.id} className="p-4 hover:shadow-md transition-all cursor-pointer dark:bg-slate-900 dark:border-slate-800" onClick={() => openWizard('transfer')}>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-900 dark:text-white">{rule.name}</h3>
                                            <Badge variant={rule.type === 'Warm' ? 'warning' : 'outline'}>{rule.type}</Badge>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{rule.desc}</p>
                                        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2">
                                            <span className="flex items-center gap-1">
                                                <div className={`w-1.5 h-1.5 rounded-full ${rule.active ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                {rule.active ? 'Active' : 'Inactive'}
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
    );
}
