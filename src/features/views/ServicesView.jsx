import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Clock, Share2, Sparkles, Zap, Hammer, ArrowLeft, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';
import { ViewToggle } from '@/components/shared/ViewToggle';
import { CategorySelector } from '@/components/shared/CategorySelector';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Mock Data for Electricians (20 items)
const MOCK_ELECTRICIANS = Array.from({ length: 20 }).map((_, i) => ({
    id: `elec-${i}`,
    name: `Electrical Service ${i + 1}`,
    desc: 'Install, maintain, and repair electrical control, wiring, and lighting systems.',
    time: ['45 mins', '60 mins', '90 mins'][i % 3],
    action: ['Book', 'Transfer'][i % 2],
    active: i < 15, // First 15 active
    icon: <Zap className="w-5 h-5 text-amber-500" />
}));

// Mock Data for Builders (5 items)
const MOCK_BUILDERS = Array.from({ length: 5 }).map((_, i) => ({
    id: `build-${i}`,
    name: `Builder Service ${i + 1}`,
    desc: 'Construction and structural repair services for residential properties.',
    time: ['2 hrs', '4 hrs', 'Day'][i % 3],
    action: 'Book',
    active: true,
    icon: <Hammer className="w-5 h-5 text-slate-500" />
}));

function ServiceSection({ title, services, openWizard, icon: Icon }) {
    const [view, setView] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterAction, setFilterAction] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 11;

    // Filter & Sort
    const filteredServices = services
        .filter(service =>
            service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.desc.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(service => {
            if (filterStatus === 'active') return service.active;
            if (filterStatus === 'inactive') return !service.active;
            return true;
        })
        .filter(service => {
            if (filterAction === 'all') return true;
            return service.action === filterAction;
        })
        .sort((a, b) => {
            if (sortBy === 'active') {
                return (a.active === b.active) ? 0 : a.active ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
        });

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredServices.length / ITEMS_PER_PAGE));
    const paginatedServices = filteredServices.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterStatus, filterAction, sortBy, view]);

    return (
        <div className="space-y-4">
            {/* Section Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {Icon && <Icon className="w-5 h-5 text-slate-500" />} {title}
                    </h2>
                    <ViewToggle view={view} onViewChange={setView} />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder={`Search ${title.toLowerCase()}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-9 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
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
                        <Select value={filterAction} onValueChange={setFilterAction}>
                            <SelectTrigger className="w-[130px] h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                                <SelectValue placeholder="Action" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Actions</SelectItem>
                                <SelectItem value="Book">Book</SelectItem>
                                <SelectItem value="Transfer">Transfer</SelectItem>
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
                    <button onClick={() => openWizard('service')}
                        className="hidden md:flex border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all min-h-[240px] group">
                        <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6 text-blue-500" />
                        </div>
                        <span className="font-medium">Create New Service</span>
                    </button>

                    {paginatedServices.map(service => (
                        <Card key={service.id} className="p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group dark:bg-slate-900 dark:border-slate-800 flex flex-col h-full justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">{service.icon}</div>
                                    {service.active && <Badge variant="success">Active</Badge>}
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{service.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{service.desc}</p>
                            </div>
                            <div className="flex items-center justify-between text-sm text-slate-400 dark:text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {service.time}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Share2 className="w-3 h-3" /> {service.action}
                                </span>
                            </div>
                        </Card>
                    ))}

                    {/* Mobile Add Button */}
                    <div className="md:hidden">
                        <button onClick={() => openWizard('service')}
                            className="w-full flex items-center justify-center p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium gap-2">
                            <Plus className="w-5 h-5" /> Create New Service
                        </button>
                    </div>
                </div>
            )}

            {/* Table View */}
            {view === 'table' && (
                <div className="hidden md:block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <div className="col-span-1">Icon</div>
                        <div className="col-span-4">Service</div>
                        <div className="col-span-4">Description</div>
                        <div className="col-span-2">Duration</div>
                        <div className="col-span-1 text-right">Status</div>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {currentPage === 1 && (
                            <div onClick={() => openWizard('service')} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                                <div className="col-span-1 flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500">
                                    <Plus className="w-4 h-4" />
                                </div>
                                <div className="col-span-11 text-slate-500 font-medium group-hover:text-blue-600">Create New Service</div>
                            </div>
                        )}
                        {paginatedServices.map(service => (
                            <div key={service.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => openWizard('service')}>
                                <div className="col-span-1 text-slate-600 dark:text-slate-400">{service.icon}</div>
                                <div className="col-span-4 font-medium text-slate-900 dark:text-white">{service.name}</div>
                                <div className="col-span-4 text-sm text-slate-500 dark:text-slate-400 truncate">{service.desc}</div>
                                <div className="col-span-2 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {service.time}</div>
                                <div className="col-span-1 text-right">
                                    {service.active && <Badge variant="success" className="justify-end">Active</Badge>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Mobile List View (Fallback for 'table' on mobile) */}
            <div className="md:hidden space-y-4">
                {view === 'table' && (
                    <>
                        {currentPage === 1 && (
                            <button onClick={() => openWizard('service')}
                                className="w-full flex items-center justify-center p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium gap-2">
                                <Plus className="w-5 h-5" /> Create New Service
                            </button>
                        )}
                        {paginatedServices.map(service => (
                            <Card key={service.id} className="p-4 hover:shadow-md transition-all cursor-pointer dark:bg-slate-900 dark:border-slate-800" onClick={() => openWizard('service')}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">{service.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white">{service.name}</h3>
                                    </div>
                                    {service.active && <Badge variant="success">Active</Badge>}
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{service.desc}</p>
                                <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {service.time}</span>
                                    <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> {service.action}</span>
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
                        Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredServices.length)}</span> of <span className="font-medium">{filteredServices.length}</span> results
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

export default function ServicesView() {
    const { openWizard, startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-4 md:px-8 md:py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 shrink-0">
                <div className="flex items-start gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/overview')} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 mt-1 shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Services Configuration</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Teach Sophiie what services you offer.</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <CategorySelector usedCategories={["Electricians", "Builders"]} />
                    <Button onClick={() => openWizard('service')} className="w-full md:w-auto">
                        <Plus className="w-4 h-4 mr-2" /> Add Service
                    </Button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto w-full space-y-12">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    <ServiceSection
                        title="Electricians"
                        icon={Zap}
                        services={MOCK_ELECTRICIANS}
                        openWizard={openWizard}
                    />

                    <ServiceSection
                        title="Builders"
                        icon={Hammer}
                        services={MOCK_BUILDERS}
                        openWizard={openWizard}
                    />
                </div>
            </div>
        </div>
    );
}
