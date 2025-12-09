import React, { useState, useRef } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { AddNewCard } from '@/components/shared/AddNewCard';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Plus, Settings, Phone, ArrowLeft, Users, Search, ChevronLeft, ChevronRight, LayoutGrid, Clock, PhoneForwarded, CheckCircle, X, MoreHorizontal, Power, Trash2, Edit2 } from 'lucide-react';
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

// Expanded Mock Staff Data
const MOCK_STAFF = [
    { id: 1, name: "Sarah Jenkins", role: "Sales", status: "Available", initials: "SJ", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Handles new customer inquiries and pricing.", ext: "101", createdAt: 1700000000000 },
    { id: 2, name: "Mike Ross", role: "Support", status: "Busy", initials: "MR", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Technical support for existing clients.", ext: "102", createdAt: 1700000000001 },
    { id: 3, name: "Jessica Pearson", role: "Manager", status: "Available", initials: "JP", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Operations manager and escalations.", ext: "103", createdAt: 1700000000002 },
    { id: 4, name: "Louis Litt", role: "Legal", status: "Away", initials: "LL", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Legal counsel and contract review.", ext: "104" },
    { id: 5, name: "Donna Paulsen", role: "Admin", status: "Available", initials: "DP", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Executive assistant and office management.", ext: "105" },
    { id: 6, name: "Harvey Specter", role: "Sales", status: "In Meeting", initials: "HS", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Senior closer and strategic accounts.", ext: "106" },
    { id: 7, name: "Rachel Zane", role: "Support", status: "Available", initials: "RZ", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Paralegal and research support.", ext: "107" },
    { id: 8, name: "Alex Williams", role: "Technician", status: "Offline", initials: "AW", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Field technician for on-site repairs.", ext: "108" },
    { id: 9, name: "Katrina Bennett", role: "Legal", status: "Busy", initials: "KB", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Associate attorney handling overflow.", ext: "109" },
    { id: 10, name: "Robert Zane", role: "Manager", status: "Available", initials: "RZ", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Managing partner.", ext: "110" },
    { id: 11, name: "Samantha Wheeler", role: "Sales", status: "Away", initials: "SW", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Aggressive sales tactics specialist.", ext: "111" },
    { id: 12, name: "Daniel Hardman", role: "Manager", status: "Offline", initials: "DH", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Former managing partner.", ext: "112" },
    { id: 13, name: "Sheila Sazs", role: "Admin", status: "Available", initials: "SS", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Head of admissions and recruiting.", ext: "113" },
    { id: 14, name: "Harold Gunderson", role: "Support", status: "Busy", initials: "HG", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Junior associate, prone to errors.", ext: "114" },
    { id: 15, name: "Jenny Griffith", role: "Support", status: "Available", initials: "JG", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", desc: "Consultant and paralegal.", ext: "115" },
];

// Mock Departments Data
const MOCK_DEPARTMENTS = [
    { id: 'dept-1', name: 'Accounts', status: 'Active', members: 3, openStatus: 'Closed', routing: 'Call forwarding configured', color: 'bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400' },
    { id: 'dept-2', name: 'Support', status: 'Active', members: 5, openStatus: 'Open 24/7', routing: 'Round Robin', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' },
    { id: 'dept-3', name: 'Sales', status: 'Active', members: 4, openStatus: '9:00 AM - 5:00 PM', routing: 'Simultaneous Ring', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400' },
];

export default function StaffView() {
    const { openWizard, openSettings, startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();

    const [staffList, setStaffList] = useState(MOCK_STAFF);
    const [departments, setDepartments] = useState(MOCK_DEPARTMENTS);

    const [showSuccess, setShowSuccess] = useState({ show: false, type: 'created', message: '' });
    const [highlightedStaffId, setHighlightedStaffId] = useState(null);
    const [highlightedDeptId, setHighlightedDeptId] = useState(null);

    const handleCreateStaff = (data) => {
        const newStaffId = `new-staff-${Date.now()}`;
        const newStaff = {
            id: newStaffId,
            name: data.staffName || 'New Staff',
            role: data.staffRole || 'Support',
            status: "Available",
            initials: (data.staffName || 'NS').slice(0, 2).toUpperCase(),
            color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
            desc: data.staffBio || "No description",
            ext: "000",
            createdAt: Date.now(),
            isDraft: data.status === 'draft'
        };

        setStaffList(prev => [newStaff, ...prev]);
        setShowSuccess({ show: true, type: data.status === 'draft' ? 'saved' : 'created', message: data.status === 'draft' ? 'Staff Saved' : 'Staff Created!' });
        setHighlightedStaffId(newStaffId);

        setTimeout(() => setShowSuccess({ show: false, type: 'created', message: '' }), 3000);
        setTimeout(() => setHighlightedStaffId(null), 6000);
    };


    const handleCreateDepartment = (data) => {
        const newDeptId = `new-dept-${Date.now()}`;
        const newDept = {
            id: newDeptId,
            name: data.departmentName || 'New Department',
            status: 'Active',
            members: 0,
            openStatus: '9:00 AM - 5:00 PM',
            rotation: 'Round Robin',
            color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
            isDraft: data.status === 'draft'
        };

        setDepartments(prev => [newDept, ...prev]);
        setShowSuccess({ show: true, type: data.status === 'draft' ? 'saved' : 'created', message: data.status === 'draft' ? 'Department Saved' : 'Department Created!' });
        setHighlightedDeptId(newDeptId);

        setTimeout(() => setHighlightedDeptId(null), 6000);
    };

    const handleToggleDeptStatus = (id) => {
        setDepartments(prev => prev.map(d => d.id === id ? { ...d, active: d.active === false ? true : false, status: (d.active === false || d.status === 'Inactive') ? 'Active' : 'Inactive' } : d));
    };

    const handleDeleteDept = (id) => {
        setDepartments(prev => prev.filter(d => d.id !== id));
    };

    const handleToggleStaffStatus = (id) => {
        setStaffList(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'Inactive' ? 'Available' : 'Inactive' } : s));
    };

    const handleDeleteStaff = (id) => {
        setStaffList(prev => prev.filter(s => s.id !== id));
    };

    const [departmentView, setDepartmentView] = useState('grid');
    const [view, setView] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 11;
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);

    // Filter & Sort Logic
    const filteredStaff = staffList
        .filter(staff =>
            staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.role.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(staff => filterRole === 'all' || staff.role === filterRole)
        .filter(staff => filterStatus === 'all' || staff.status === filterStatus)
        .sort((a, b) => {
            if (sortBy === 'date') return (b.createdAt || 0) - (a.createdAt || 0); // Newest first
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
        <div className="flex flex-col h-full animate-in fade-in duration-300 relative">
            {/* Success Modal Overlay */}
            {showSuccess.show && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-3 w-80 border border-slate-100 dark:border-slate-800 relative">
                        <button
                            onClick={() => setShowSuccess({ show: false, type: 'created', message: '' })}
                            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center animate-in zoom-in duration-300 ${showSuccess.type === 'saved' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div className="text-center space-y-0.5">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{showSuccess.message}</h3>
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
                title="Staff & Departments"
                subtitle="Manage team members and configure transfer logic."
                scrollDirection={scrollDirection}
            >
                <Button
                    variant="secondary"
                    className="w-full md:w-auto bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
                    onClick={() => openWizard('department', {}, (data) => handleCreateDepartment(data))}
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Department
                </Button>
                <Button onClick={() => openWizard('staff', {}, (data) => handleCreateStaff(data))} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" /> Add New Staff
                </Button>
                <Button variant="outline" size="icon" onClick={openSettings} className="hidden md:flex" title="Global Settings">
                    <Settings className="w-4 h-4" />
                </Button>
            </PageHeader>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto w-full space-y-12">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    {/* Departments Section */}
                    <div className="space-y-6">
                        <div className="flex flex-row justify-between items-center gap-4">
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <LayoutGrid className="w-5 h-5 text-slate-500" /> Departments
                            </h2>
                            <ViewToggle view={departmentView} onViewChange={setDepartmentView} />
                        </div>

                        {departmentView === 'grid' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                <AddNewCard
                                    title="Add Department"
                                    description="Group staff members together"
                                    onClick={() => openWizard('department', {}, (data) => handleCreateDepartment(data))}
                                />
                                {/* Mobile Add Button (Top) */}
                                <div className="md:hidden">
                                    <AddNewCard
                                        title="Add Department"
                                        onClick={() => openWizard('department', {}, (data) => handleCreateDepartment(data))}
                                        variant="compact"
                                    />
                                </div>
                                {departments.map(dept => (
                                    <Card key={dept.id} onClick={() => openWizard('department')} className={`p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer dark:bg-slate-900 dark:border-slate-800 flex flex-col h-full min-h-[240px] group ${dept.isDraft ? 'opacity-70 grayscale-[0.5]' : ''} ${dept.id === highlightedDeptId ? (dept.isDraft ? 'animate-in zoom-in-0 duration-500 border-orange-500 shadow-orange-500/20 shadow-md ring-1 ring-orange-500/50' : 'animate-in zoom-in-0 duration-500 border-blue-500 shadow-blue-500/20 shadow-md ring-1 ring-blue-500/50') : ''}`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${dept.color}`}>
                                                <LayoutGrid className="w-5 h-5" />
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenuItem onClick={() => openWizard('department')}>
                                                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleToggleDeptStatus(dept.id)}>
                                                        <Power className={`w-4 h-4 mr-2 ${dept.status === 'Active' ? "text-green-500" : "text-slate-400"}`} /> {dept.status === 'Active' ? 'Disable' : 'Enable'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => handleDeleteDept(dept.id)}>
                                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{dept.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 flex-1 line-clamp-2">The {dept.name} department manages records and inquiries.</p>

                                        <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                <Users className="w-4 h-4 text-slate-400" /> {dept.members} team members
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                <Clock className="w-4 h-4 text-slate-400" /> {dept.openStatus}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                <PhoneForwarded className="w-4 h-4 text-slate-400" /> {dept.routing}
                                            </div>
                                            <div className="flex flex-col gap-1 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                                {dept.isDraft && <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800 w-fit">Incomplete</Badge>}
                                                {!dept.isDraft && (dept.status === 'Active' ? <Badge variant="success" className="w-fit">Active</Badge> : <Badge variant="secondary" className="w-fit">Inactive</Badge>)}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {departmentView === 'table' && (
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    <div className="col-span-3">Department</div>
                                    <div className="col-span-2">Status</div>
                                    <div className="col-span-2">Members</div>
                                    <div className="col-span-2">Hours</div>
                                    <div className="col-span-2">Routing</div>
                                    <div className="col-span-1 text-right">Actions</div>
                                </div>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    <div onClick={() => openWizard('department', {}, (data) => handleCreateDepartment(data))} className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                                        <div className="col-span-12 flex items-center gap-3 text-slate-500 font-medium group-hover:text-blue-600">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500">
                                                <Plus className="w-4 h-4" />
                                            </div>
                                            Add Department
                                        </div>
                                    </div>
                                    {/* Mobile Add Button for Table View */}
                                    <div className="md:hidden p-4">
                                        <AddNewCard
                                            title="Add Department"
                                            onClick={() => openWizard('department', {}, (data) => handleCreateDepartment(data))}
                                            variant="compact"
                                        />
                                    </div>
                                    {departments.map(dept => (
                                        <div key={dept.id} className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-6 py-4 items-start md:items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-b md:border-b-0 border-slate-100 dark:border-slate-800 last:border-0 ${(dept.isDraft || dept.status === 'Inactive' || dept.active === false) ? 'opacity-70 grayscale-[0.5]' : ''} ${dept.id === highlightedDeptId ? (dept.isDraft ? 'bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-500 pl-5' : 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 pl-5') : ''}`} onClick={() => openWizard('department')}>
                                            <div className="col-span-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${dept.color}`}>
                                                    <LayoutGrid className="w-4 h-4" />
                                                </div>
                                                {dept.name}
                                            </div>
                                            <div className="col-span-2 flex items-center justify-between md:justify-start">
                                                <span className="md:hidden text-xs text-slate-500">Status:</span>
                                                <Badge variant="outline" className={dept.isDraft ? "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800" : "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"}>{dept.isDraft ? 'Incomplete' : dept.status}</Badge>
                                            </div>
                                            <div className="col-span-2 flex items-center gap-2">
                                                <span className="md:hidden text-xs text-slate-500">Members:</span>
                                                <span className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-400" /> {dept.members}</span>
                                            </div>
                                            <div className="col-span-2 flex items-center gap-2">
                                                <span className="md:hidden text-xs text-slate-500">Hours:</span>
                                                <span className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {dept.openStatus}</span>
                                            </div>
                                            <div className="col-span-2 flex items-center gap-2">
                                                <span className="md:hidden text-xs text-slate-500">Routing:</span>
                                                <span className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1"><PhoneForwarded className="w-3.5 h-3.5 text-slate-400" /> {dept.routing}</span>
                                            </div>
                                            <div className="col-span-1 text-right hidden md:block">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                                        <DropdownMenuItem onClick={() => openWizard('department')}>
                                                            <Edit2 className="w-4 h-4 mr-2" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleToggleDeptStatus(dept.id)}>
                                                            <Power className={`w-4 h-4 mr-2 ${dept.active ? "text-green-500" : "text-slate-400"}`} /> {dept.active ? 'Disable' : 'Enable'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => handleDeleteDept(dept.id)}>
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
                    </div>

                    {/* Staff Section */}
                    <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
                        {/* Toolbar */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row justify-between items-center gap-4">
                                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-slate-500" /> Staff
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
                                    title="Add New Staff"
                                    description="Invite a new user to the team"
                                    onClick={() => openWizard('staff', {}, (data) => handleCreateStaff(data))}
                                />
                                {/* Mobile Add Button (Top) */}
                                {currentPage === 1 && (
                                    <div className="md:hidden">
                                        <AddNewCard
                                            title="Add New Staff"
                                            onClick={() => openWizard('staff', {}, (data) => handleCreateStaff(data))}
                                            variant="compact"
                                        />
                                    </div>
                                )}
                                {paginatedStaff.map(staff => (
                                    <Card key={staff.id} className={`p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer dark:bg-slate-900 dark:border-slate-800 group ${staff.isDraft ? 'opacity-70 grayscale-[0.5]' : ''} ${staff.id === highlightedStaffId ? (staff.isDraft ? 'animate-in zoom-in-0 duration-500 border-orange-500 shadow-orange-500/20 shadow-md ring-1 ring-orange-500/50' : 'animate-in zoom-in-0 duration-500 border-blue-500 shadow-blue-500/20 shadow-md ring-1 ring-blue-500/50') : ''}`} onClick={() => openWizard('staff')}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400`}>{staff.initials}</div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenuItem onClick={() => openWizard('staff')}>
                                                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleToggleStaffStatus(staff.id)}>
                                                        <Power className={`w-4 h-4 mr-2 ${staff.status !== 'Inactive' ? "text-green-500" : "text-slate-400"}`} /> {staff.status !== 'Inactive' ? 'Disable' : 'Enable'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => handleDeleteStaff(staff.id)}>
                                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{staff.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{staff.desc}</p>
                                        <div className="flex items-center justify-between text-sm text-slate-400 dark:text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex flex-col gap-1">
                                                {staff.isDraft && <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800 text-[10px] h-5 w-fit">Incomplete</Badge>}
                                                {!staff.isDraft && (
                                                    staff.status === 'Available' ? <Badge variant="success" className="w-fit">Available</Badge> :
                                                        staff.status === 'Offline' ? <Badge variant="outline" className="w-fit">Offline</Badge> :
                                                            <Badge variant="warning" className="w-fit">{staff.status}</Badge>
                                                )}
                                            </div>
                                            <Badge variant="secondary">{staff.role}</Badge>
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
                                        <div onClick={() => openWizard('staff', {}, (data) => handleCreateStaff(data))} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                                            <div className="col-span-12 flex items-center gap-3 text-slate-500 font-medium group-hover:text-blue-600">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500">
                                                    <Plus className="w-4 h-4" />
                                                </div>
                                                Add New Staff
                                            </div>
                                        </div>
                                    )}
                                    {paginatedStaff.map(staff => (
                                        <div key={staff.id} className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${(staff.isDraft || staff.status === 'Inactive') ? 'opacity-70 grayscale-[0.5]' : ''} ${staff.id === highlightedStaffId ? (staff.isDraft ? 'bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-500 pl-5' : 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 pl-5') : ''}`} onClick={() => openWizard('staff')}>
                                            <div className="col-span-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400`}>
                                                    {staff.initials}
                                                </div>
                                                {staff.name}
                                            </div>
                                            <div className="col-span-2">
                                                <Badge variant="outline" className="text-[10px] h-5">{staff.role}</Badge>
                                            </div>
                                            <div className="col-span-3">
                                                <span className={`flex items-center gap-1.5 text-sm font-medium ${staff.isDraft ? 'text-orange-600' : (staff.status === 'Available' ? 'text-green-600' : staff.status === 'Offline' ? 'text-slate-400' : 'text-orange-600')}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${staff.isDraft ? 'bg-orange-500' : (staff.status === 'Available' ? 'bg-green-600' : staff.status === 'Offline' ? 'bg-slate-400' : 'bg-orange-600')}`} />
                                                    {staff.isDraft ? 'Incomplete' : staff.status}
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
                                        <AddNewCard
                                            title="Add New Staff"
                                            onClick={() => openWizard('staff', {}, (data) => handleCreateStaff(data))}
                                            variant="compact"
                                        />
                                    )}
                                    {paginatedStaff.map(staff => (
                                        <div key={staff.id} className={`p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm ${(staff.isDraft || staff.status === 'Inactive') ? 'opacity-70 grayscale-[0.5]' : ''} ${staff.id === highlightedStaffId ? (staff.isDraft ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10' : 'border-blue-500 bg-blue-50 dark:bg-blue-900/10') : ''}`} onClick={() => openWizard('staff')}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{staff.name}</h3>
                                                <Badge variant="outline" className="text-[10px] h-5">{staff.role}</Badge>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className={`flex items-center gap-1.5 text-xs font-medium ${staff.isDraft ? 'text-orange-600' : (staff.status === 'Available' ? 'text-green-600' : staff.status === 'Offline' ? 'text-slate-400' : 'text-orange-600')}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${staff.isDraft ? 'bg-orange-500' : (staff.status === 'Available' ? 'bg-green-600' : staff.status === 'Offline' ? 'bg-slate-400' : 'bg-orange-600')}`} />
                                                    {staff.isDraft ? 'Incomplete' : staff.status}
                                                </span>
                                                {!staff.isDraft && <span className="text-xs text-slate-500">Ext. {staff.ext}</span>}
                                                {staff.isDraft && <Badge variant="outline" className="text-[10px] h-5 bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">Incomplete</Badge>}
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

        </div>
    );
}
