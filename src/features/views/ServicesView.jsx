import React, { useState, useRef, useEffect } from 'react';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Plus, Clock, Share2, Zap, Hammer, ArrowLeft, Search, ChevronLeft, ChevronRight, ChevronDown, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { cn } from "@/lib/utils";

const MOCK_ELECTRICIANS = [
    { id: 'elec-1', name: 'Switchboard Upgrade', desc: 'Upgrade old fuse box to modern circuit breaker panel with RCD protection.', time: '4 hrs', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-2', name: 'Powerpoint Installation', desc: 'Install new double power points in standard plasterboard walls.', time: '45 mins', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-3', name: 'LED Downlight Install', desc: 'Supply and install energy-efficient LED downlights throughout property.', time: '2 hrs', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-4', name: 'Ceiling Fan Installation', desc: 'Installation of ceiling fans with wall control or remote.', time: '90 mins', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-5', name: 'Safety Inspection', desc: 'Comprehensive electrical safety check and report for residential properties.', time: '60 mins', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-6', name: 'Smoke Alarm Testing', desc: 'Test, battery replacement, and verification of smoke alarm compliance.', time: '30 mins', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-7', name: 'EV Charger Install', desc: 'Installation of Level 2 Electric Vehicle home charging station.', time: '3 hrs', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-8', name: 'Emergency Fault Finding', desc: 'Urgent callout to diagnose and rectify power outages or electrical faults.', time: '60 mins', action: 'Transfer', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-9', name: 'Oven/Cooktop Connection', desc: 'Hardwiring of new electric ovens, cooktops, or stoves.', time: '60 mins', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-10', name: 'Data Cabling', desc: 'Cat6 data point installation for home networking and internet.', time: '60 mins', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-11', name: 'TV Wall Mounting', desc: 'Secure mounting of TV with concealed cabling and power point.', time: '90 mins', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-12', name: 'Garden Lighting', desc: 'Design and installation of outdoor low-voltage garden lighting systems.', time: '4 hrs', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-13', name: 'Security Camera Install', desc: 'Installation of wired security camera systems and DVR setup.', time: '5 hrs', action: 'Transfer', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-14', name: 'Consumer Mains Upgrade', desc: 'Upgrade of incoming power supply cables to meet new demand.', time: 'Day', action: 'Transfer', active: false, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-15', name: 'Sensor Light Install', desc: 'security sensor lights for driveways and entryways.', time: '45 mins', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-16', name: 'Bathroom Heater/Fan', desc: 'Install 3-in-1 bathroom heater, light, and exhaust fan units.', time: '2 hrs', action: 'Book', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-17', name: 'Hot Water System Repair', desc: 'Element and thermostat replacement for electric hot water systems.', time: '60 mins', action: 'Transfer', active: false, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-18', name: 'House Rewire', desc: 'Complete removal of old wiring and installation of new safe cabling.', time: '3 Days', action: 'Transfer', active: false, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-19', name: 'Surge Protection', desc: 'Installation of whole-house surge protection at the switchboard.', time: '45 mins', action: 'Book', active: false, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 },
    { id: 'elec-20', name: 'Test and Tag', desc: 'Electrical appliance testing and tagging for workplace compliance.', time: 'Varies', action: 'Book', active: false, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1 }
];

const MOCK_BUILDERS = [
    { id: 'build-1', name: 'Deck Installation', desc: 'Construction of timber or composite outdoor decking areas.', time: '3 Days', action: 'Transfer', active: true, icon: <Hammer className="w-5 h-5 text-slate-500" />, createdAt: 1 },
    { id: 'build-2', name: 'Bathroom Renovation', desc: 'Full bathroom strip out and remodel including waterproofing and tiling.', time: '2 Weeks', action: 'Transfer', active: true, icon: <Hammer className="w-5 h-5 text-slate-500" />, createdAt: 1 },
    { id: 'build-3', name: 'Kitchen Remodel', desc: 'Kitchen cabinetry installation, benchtop fitting, and splashbacks.', time: '1 Week', action: 'Transfer', active: true, icon: <Hammer className="w-5 h-5 text-slate-500" />, createdAt: 1 },
    { id: 'build-4', name: 'Pergola Construction', desc: 'Custom designed pergolas and patios for outdoor entertaining.', time: '4 Days', action: 'Transfer', active: true, icon: <Hammer className="w-5 h-5 text-slate-500" />, createdAt: 1 },
    { id: 'build-5', name: 'Structural Wall Removal', desc: 'Removal of load-bearing walls and installation of support beams.', time: '5 Days', action: 'Transfer', active: false, icon: <Hammer className="w-5 h-5 text-slate-500" />, createdAt: 1 }
];

function AddServiceDropdown({ onAdd }) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = React.useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const categories = ["Electricians", "Builders"];

    return (
        <div className="relative w-full md:w-auto" ref={wrapperRef}>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full md:w-auto justify-between gap-2"
            >
                <span className="flex items-center"><Plus className="w-4 h-4 mr-2" /> Add Service</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-1 w-full md:w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 dark:bg-slate-900 dark:border-slate-800">
                    <div className="p-1">
                        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Category</div>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className="w-full text-left px-3 py-2.5 text-sm rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 text-slate-700 dark:text-slate-200"
                                onClick={() => {
                                    onAdd(cat);
                                    setIsOpen(false);
                                }}
                            >
                                {cat === "Electricians" ? <Zap className="w-4 h-4 text-amber-500" /> : <Hammer className="w-4 h-4 text-slate-500" />}
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function ServiceSection({ title, services, openWizard, icon: Icon, onCreate, highlightedId }) {
    const [view, setView] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterAction, setFilterAction] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 11;
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);

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
            if (sortBy === 'date') {
                const dateA = a.createdAt || 0;
                const dateB = b.createdAt || 0;
                // Treat equal as stable (keep existing order if possible, though JS sort isn't always stable)
                // New items created with Date.now() will be larger, effectively appearing first
                return dateB - dateA;
            }
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

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterStatus, filterAction, sortBy, view]);

    return (
        <div className="space-y-4">
            {/* Section Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between items-center gap-4">
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
                    <button onClick={onCreate}
                        className="hidden md:flex border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all min-h-[240px] group">
                        <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6 text-blue-500" />
                        </div>
                        <span className="font-medium">Create New Service</span>
                        <p className="text-xs text-center mt-2 opacity-70 font-normal">Add the services you offer to customers</p>
                    </button>

                    {/* Mobile Add Button */}
                    {currentPage === 1 && (
                        <div className="md:hidden">
                            <button onClick={onCreate}
                                className="w-full flex items-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium gap-3 group">
                                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Plus className="w-5 h-5 text-blue-500" />
                                </div>
                                <span>Create New Service</span>
                            </button>
                        </div>
                    )}

                    {paginatedServices.map(service => (
                        <Card key={service.id}
                            className={`p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group dark:bg-slate-900 dark:border-slate-800 flex flex-col h-full justify-between ${service.id === highlightedId ? 'animate-in zoom-in-0 duration-500 border-blue-500 shadow-blue-500/20 shadow-md ring-1 ring-blue-500/50' : ''}`}
                        >
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
                            <div onClick={onCreate} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                                <div className="col-span-1 flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500">
                                    <Plus className="w-4 h-4" />
                                </div>
                                <div className="col-span-11 text-slate-500 font-medium group-hover:text-blue-600">Create New Service</div>
                            </div>
                        )}
                        {paginatedServices.map(service => (
                            <div key={service.id} onClick={onCreate} className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${service.id === highlightedId ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 pl-5' : ''}`}>
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
                            <button onClick={onCreate}
                                className="w-full flex items-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium gap-3 group">
                                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Plus className="w-5 h-5 text-blue-500" />
                                </div>
                                <span>Create New Service</span>
                            </button>
                        )}
                        {paginatedServices.map(service => (
                            <Card key={service.id} className={`p-4 hover:shadow-md transition-all cursor-pointer dark:bg-slate-900 dark:border-slate-800 ${service.id === highlightedId ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : ''}`} onClick={onCreate}>
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
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);

    // State for services
    const [elecServices, setElecServices] = useState(MOCK_ELECTRICIANS);
    const [buildServices, setBuildServices] = useState(MOCK_BUILDERS);
    const [showSuccess, setShowSuccess] = useState(false);
    const [highlightedServiceId, setHighlightedServiceId] = useState(null);

    const handleCreateService = (data, category) => {
        // Create new service object from wizard data
        const newServiceId = `new-${Date.now()}`;
        const newService = {
            id: newServiceId,
            name: data.serviceName || 'New Service',
            desc: data.description || 'No description',
            time: data.durationValue ? `${data.durationValue} ${data.durationUnit || 'mins'}` : 'Varies',
            action: data.serviceOutcome === 'transfer' ? 'Transfer' : 'Book',
            active: true,
            icon: category === 'Electricians' ? <Zap className="w-5 h-5 text-amber-500" /> : <Hammer className="w-5 h-5 text-slate-500" />,
            createdAt: Date.now(),
        };

        if (category === 'Electricians') {
            setElecServices(prev => [newService, ...prev]);
        } else {
            setBuildServices(prev => [newService, ...prev]);
        }

        // Show success modal
        setShowSuccess(true);
        setHighlightedServiceId(newServiceId);

        // Auto-dismiss modal after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);

        // Remove highlight after 6 seconds (3s modal + 3s fade out)
        setTimeout(() => setHighlightedServiceId(null), 6000);
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300 relative">
            {/* Success Modal Overlay - Updated Style */}
            {showSuccess && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-3 w-80 border border-slate-100 dark:border-slate-800 relative">
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 animate-in zoom-in duration-300">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div className="text-center space-y-0.5">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Service Created!</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Added to your list.</p>
                        </div>
                        {/* Progress bar to show auto-dismiss */}
                        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full animate-progress" style={{ width: '100%', animation: 'shrink 3s linear forwards' }}></div>
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

            <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-4 md:px-8 md:py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 shrink-0 sticky top-0 z-30 transition-shadow duration-300">
                <div className={`flex gap-4 transition-all duration-300 ${scrollDirection === 'down' ? 'items-center' : 'items-start'}`}>
                    <Button variant="ghost" size="icon" onClick={() => navigate('/overview')} className={`text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 shrink-0 transition-all duration-300 ${scrollDirection === 'down' ? 'mt-0' : 'mt-1'}`}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className={`font-bold text-slate-900 dark:text-white transition-all duration-300 ${scrollDirection === 'down' ? 'text-lg' : 'text-xl md:text-2xl'}`}>Services Configuration</h1>
                        <p className={`text-slate-500 dark:text-slate-400 text-sm transition-all duration-300 ${scrollDirection === 'down' ? 'max-h-0 opacity-0 mt-0' : 'max-h-20 opacity-100 mt-1'}`}>Teach Sophiie what services you offer.</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <CategorySelector usedCategories={["Electricians", "Builders"]} />
                    <AddServiceDropdown onAdd={(cat) => openWizard('service', { category: cat }, (data) => handleCreateService(data, cat))} />
                </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto w-full space-y-12">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    <ServiceSection
                        title="Electricians"
                        icon={Zap}
                        services={elecServices}
                        openWizard={openWizard}
                        highlightedId={highlightedServiceId}
                        onCreate={() => openWizard('service', { category: 'Electricians' }, (data) => handleCreateService(data, 'Electricians'))}
                    />

                    <ServiceSection
                        title="Builders"
                        icon={Hammer}
                        services={buildServices}
                        openWizard={openWizard}
                        highlightedId={highlightedServiceId}
                        onCreate={() => openWizard('service', { category: 'Builders' }, (data) => handleCreateService(data, 'Builders'))}
                    />
                </div>
            </div>
        </div>
    );
}
