import React, { useState, useRef } from 'react';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Plus, Settings, Phone, ArrowLeft, Users, Search, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
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

// Expanded Mock Staff Data
const MOCK_STAFF = [
    { id: 1, name: "Sarah Jenkins", role: "Sales", status: "Available", initials: "SJ", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400", desc: "Handles new customer inquiries and pricing.", ext: "101" },
    { id: 2, name: "Mike Ross", role: "Support", status: "Busy", initials: "MR", color: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400", desc: "Technical support for existing clients.", ext: "102" },
    { id: 3, name: "Jessica Pearson", role: "Manager", status: "Available", initials: "JP", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400", desc: "Operations manager and escalations.", ext: "103" },
    { id: 4, name: "Louis Litt", role: "Legal", status: "Away", initials: "LL", color: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400", desc: "Legal counsel and contract review.", ext: "104" },
    { id: 5, name: "Donna Paulsen", role: "Admin", status: "Available", initials: "DP", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400", desc: "Executive assistant and office management.", ext: "105" },
    { id: 6, name: "Harvey Specter", role: "Sales", status: "In Meeting", initials: "HS", color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400", desc: "Senior closer and strategic accounts.", ext: "106" },
    { id: 7, name: "Rachel Zane", role: "Support", status: "Available", initials: "RZ", color: "bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400", desc: "Paralegal and research support.", ext: "107" },
    { id: 8, name: "Alex Williams", role: "Technician", status: "Offline", initials: "AW", color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400", desc: "Field technician for on-site repairs.", ext: "108" },
    { id: 9, name: "Katrina Bennett", role: "Legal", status: "Busy", initials: "KB", color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400", desc: "Associate attorney handling overflow.", ext: "109" },
    { id: 10, name: "Robert Zane", role: "Manager", status: "Available", initials: "RZ", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Managing partner.", ext: "110" },
    { id: 11, name: "Samantha Wheeler", role: "Sales", status: "Away", initials: "SW", color: "bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400", desc: "Aggressive sales tactics specialist.", ext: "111" },
    { id: 12, name: "Daniel Hardman", role: "Manager", status: "Offline", initials: "DH", color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400", desc: "Former managing partner.", ext: "112" },
    { id: 13, name: "Sheila Sazs", role: "Admin", status: "Available", initials: "SS", color: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400", desc: "Head of admissions and recruiting.", ext: "113" },
    { id: 14, name: "Harold Gunderson", role: "Support", status: "Busy", initials: "HG", color: "bg-lime-100 text-lime-600 dark:bg-lime-900/40 dark:text-lime-400", desc: "Junior associate, prone to errors.", ext: "114" },
    { id: 15, name: "Jenny Griffith", role: "Support", status: "Available", initials: "JG", color: "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/40 dark:text-fuchsia-400", desc: "Consultant and paralegal.", ext: "115" },
];

export default function StaffView() {
    const { openWizard, openSettings, startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();

    const [view, setView] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 11;
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);

    // Filter & Sort Logic
    const filteredStaff = MOCK_STAFF
        .filter(staff =>
            staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.role.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(staff => filterRole === 'all' || staff.role === filterRole)
        .filter(staff => filterStatus === 'all' || staff.status === filterStatus)
        .sort((a, b) => {
            // Sort by name (A-Z)
            return a.name.localeCompare(b.name);
        });

    // Pagination Logic
    const totalPages = Math.max(1, Math.ceil(filteredStaff.length / ITEMS_PER_PAGE));
    const paginatedStaff = filteredStaff.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset page
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterRole, filterStatus, sortBy, view]);

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-4 md:px-8 md:py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 shrink-0 sticky top-0 z-30 transition-shadow duration-300">
                <div className="w-full md:w-auto flex justify-between items-start">
                    <div className={`flex gap-4 transition-all duration-300 ${scrollDirection === 'down' ? 'items-center' : 'items-start'}`}>
                        <Button variant="ghost" size="icon" onClick={() => navigate('/overview')} className={`text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 shrink-0 transition-all duration-300 ${scrollDirection === 'down' ? 'mt-0' : 'mt-1'}`}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className={`font-bold text-slate-900 dark:text-white transition-all duration-300 ${scrollDirection === 'down' ? 'text-lg' : 'text-xl md:text-2xl'}`}>Team</h1>
                            <p className={`text-slate-500 dark:text-slate-400 text-sm transition-all duration-300 ${scrollDirection === 'down' ? 'max-h-0 opacity-0 mt-0' : 'max-h-20 opacity-100 mt-1'}`}>Manage team members and configure transfer logic.</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <Button variant="outline" onClick={openSettings} className="hidden md:flex w-full md:w-auto">
                        <Settings className="w-4 h-4 mr-2" /> Global Settings
                    </Button>
                    <Button onClick={() => openWizard('staff')} className="w-full md:w-auto">
                        <Plus className="w-4 h-4 mr-2" /> Add Team Member
                    </Button>
                </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto w-full space-y-8">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    {/* Toolbar */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-between items-center gap-4">
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <Users className="w-5 h-5 text-slate-500" /> Team Members
                            </h2>
                            <ViewToggle view={view} onViewChange={setView} />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Search team members..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-9 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                                <Select value={filterRole} onValueChange={setFilterRole}>
                                    <SelectTrigger className="w-[130px] h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <SelectItem value="Sales">Sales</SelectItem>
                                        <SelectItem value="Support">Support</SelectItem>
                                        <SelectItem value="Manager">Manager</SelectItem>
                                        <SelectItem value="Technician">Technician</SelectItem>
                                        <SelectItem value="Legal">Legal</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="w-[130px] h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="Available">Available</SelectItem>
                                        <SelectItem value="Busy">Busy</SelectItem>
                                        <SelectItem value="Away">Away</SelectItem>
                                        <SelectItem value="In Meeting">In Meeting</SelectItem>
                                        <SelectItem value="Offline">Offline</SelectItem>
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
                            <button onClick={() => openWizard('staff')}
                                className="hidden md:flex border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all min-h-[240px] group">
                                <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Plus className="w-6 h-6 text-blue-500" />
                                </div>
                                <span className="font-medium">Add Team Member</span>
                            </button>
                            {/* Mobile Add Button (Top) */}
                            {currentPage === 1 && (
                                <div className="md:hidden">
                                    <button onClick={() => openWizard('staff')}
                                        className="w-full flex items-center justify-center p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium gap-2">
                                        <Plus className="w-5 h-5" /> Add Team Member
                                    </button>
                                </div>
                            )}
                            {paginatedStaff.map(staff => (
                                <Card key={staff.id} className="p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer dark:bg-slate-900 dark:border-slate-800">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${staff.color}`}>{staff.initials}</div>
                                        <Badge variant="secondary">{staff.role}</Badge>
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{staff.name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{staff.desc}</p>
                                    <div className="flex items-center justify-between text-sm text-slate-400 dark:text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <span className={`flex items-center gap-1.5 font-medium ${staff.status === 'Available' ? 'text-green-600' : staff.status === 'Offline' ? 'text-slate-400' : 'text-orange-600'}`}>
                                            <div className={`w-2 h-2 rounded-full ${staff.status === 'Available' ? 'bg-green-600' : staff.status === 'Offline' ? 'bg-slate-400' : 'bg-orange-600'}`} />
                                            {staff.status}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Phone className="w-3 h-3" /> Ext. {staff.ext}
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
                                <div className="col-span-3">Team Member</div>
                                <div className="col-span-2">Role</div>
                                <div className="col-span-3">Status</div>
                                <div className="col-span-2">Extension</div>
                                <div className="col-span-2 text-right">Actions</div>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {currentPage === 1 && (
                                    <div onClick={() => openWizard('staff')} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                                        <div className="col-span-12 flex items-center gap-3 text-slate-500 font-medium group-hover:text-blue-600">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500">
                                                <Plus className="w-4 h-4" />
                                            </div>
                                            Add Team Member
                                        </div>
                                    </div>
                                )}
                                {paginatedStaff.map(staff => (
                                    <div key={staff.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => openWizard('staff')}>
                                        <div className="col-span-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                            <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${staff.color}`}>
                                                {staff.initials}
                                            </div>
                                            {staff.name}
                                        </div>
                                        <div className="col-span-2">
                                            <Badge variant="outline" className="text-[10px] h-5">{staff.role}</Badge>
                                        </div>
                                        <div className="col-span-3">
                                            <span className={`flex items-center gap-1.5 text-sm font-medium ${staff.status === 'Available' ? 'text-green-600' : staff.status === 'Offline' ? 'text-slate-400' : 'text-orange-600'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${staff.status === 'Available' ? 'bg-green-600' : staff.status === 'Offline' ? 'bg-slate-400' : 'bg-orange-600'}`} />
                                                {staff.status}
                                            </span>
                                        </div>
                                        <div className="col-span-2 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                            <Phone className="w-3 h-3" /> {staff.ext}
                                        </div>
                                        <div className="col-span-2 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                                <Settings className="w-4 h-4" />
                                            </Button>
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
                                    <button onClick={() => openWizard('staff')}
                                        className="w-full flex items-center justify-center p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium gap-2">
                                        <Plus className="w-5 h-5" /> Add Team Member
                                    </button>
                                )}
                                {paginatedStaff.map(staff => (
                                    <div key={staff.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm" onClick={() => openWizard('staff')}>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{staff.name}</h3>
                                            <Badge variant="outline" className="text-[10px] h-5">{staff.role}</Badge>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className={`flex items-center gap-1.5 text-xs font-medium ${staff.status === 'Available' ? 'text-green-600' : staff.status === 'Offline' ? 'text-slate-400' : 'text-orange-600'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${staff.status === 'Available' ? 'bg-green-600' : staff.status === 'Offline' ? 'bg-slate-400' : 'bg-orange-600'}`} />
                                                {staff.status}
                                            </span>
                                            <span className="text-xs text-slate-500">Ext. {staff.ext}</span>
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
                                Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredStaff.length)}</span> of <span className="font-medium">{filteredStaff.length}</span> results
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
