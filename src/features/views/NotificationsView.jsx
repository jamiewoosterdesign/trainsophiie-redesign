import React, { useState } from 'react';
import { Bell, UserPlus, ArrowLeft, Mail, MessageSquare, Phone, Globe, Pencil, Trash2, Search, ChevronLeft, ChevronRight, LayoutGrid, List, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useNavigate, useOutletContext } from 'react-router-dom';
import AssignTeamMemberModal from '@/components/modals/AssignTeamMemberModal';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';
import { ViewToggle } from '@/components/shared/ViewToggle';

// Expanded Mock Data
const MOCK_ASSIGNMENTS = [
    { id: 1, member: 'Sarah Wilson', methods: ['sms', 'email'], tags: ['VIP', 'Urgent'], sources: ['call', 'sms'], enabled: true },
    { id: 2, member: 'Mike Johnson', methods: ['email'], tags: ['New Customer'], sources: ['webform'], enabled: true },
    { id: 3, member: 'Emily Davis', methods: ['sms'], tags: ['Support'], sources: ['chatbot', 'email'], enabled: false },
    { id: 4, member: 'David Brown', methods: ['email', 'sms'], tags: ['Sales', 'High Value'], sources: ['webform', 'call'], enabled: true },
    { id: 5, member: 'Jessica Lee', methods: ['email'], tags: ['General'], sources: ['email'], enabled: true },
    { id: 6, member: 'Chris Martin', methods: ['sms'], tags: ['Technical'], sources: ['chatbot'], enabled: true },
    { id: 7, member: 'Ashley Taylor', methods: ['email'], tags: ['Billing'], sources: ['email', 'call'], enabled: true },
    { id: 8, member: 'Matthew Anderson', methods: ['sms', 'email'], tags: ['Emergency'], sources: ['call'], enabled: true },
    { id: 9, member: 'Olivia Thomas', methods: ['email'], tags: ['Feedback'], sources: ['webform'], enabled: false },
    { id: 10, member: 'Daniel Martinez', methods: ['sms'], tags: ['Returns'], sources: ['email', 'chatbot'], enabled: true },
    { id: 11, member: 'Sophia Hernandez', methods: ['email', 'sms'], tags: ['VIP'], sources: ['call'], enabled: true },
    { id: 12, member: 'James Wilson', methods: ['email'], tags: ['Support'], sources: ['webform'], enabled: true },
    { id: 13, member: 'Isabella Clark', methods: ['sms'], tags: ['Sales'], sources: ['call'], enabled: false },
    { id: 14, member: 'Ethan Lewis', methods: ['email'], tags: ['General'], sources: ['email'], enabled: true },
    { id: 15, member: 'Ava Walker', methods: ['sms', 'email'], tags: ['Urgent'], sources: ['call', 'sms'], enabled: true },
];

export default function NotificationsView() {
    const navigate = useNavigate();
    const { startGlobalVoiceFlow } = useOutletContext();
    const [showAssignModal, setShowAssignModal] = useState(false);

    const [view, setView] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'active' | 'inactive'
    const [sortBy, setSortBy] = useState('member');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 11;

    // Filter & Sort Logic
    const filteredAssignments = MOCK_ASSIGNMENTS
        .filter(a =>
            a.member.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .filter(a => {
            if (filterStatus === 'active') return a.enabled;
            if (filterStatus === 'inactive') return !a.enabled;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'status') return (a.enabled === b.enabled) ? 0 : a.enabled ? -1 : 1;
            return a.member.localeCompare(b.member);
        });

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredAssignments.length / ITEMS_PER_PAGE));
    const paginatedAssignments = filteredAssignments.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset page
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterStatus, sortBy, view]);

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-4 md:px-8 md:py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 shrink-0">
                <div className="flex items-start gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/overview')} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 mt-1 shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage team notifications and assignments.</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button onClick={() => setShowAssignModal(true)} className="w-full sm:w-auto">
                        <UserPlus className="w-4 h-4 mr-2" /> Assign New Team Member
                    </Button>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto w-full space-y-8">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    {/* Toolbar */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-slate-500" /> Notifications Settings
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
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="w-[130px] h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Enabled</SelectItem>
                                        <SelectItem value="inactive">Disabled</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[140px] h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="member">Name (A-Z)</SelectItem>
                                        <SelectItem value="status">Status</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Grid View (Cards) */}
                    {view === 'grid' && (
                        <div className="grid gap-4">
                            <button onClick={() => setShowAssignModal(true)}
                                className="hidden md:flex w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex-row items-center justify-center text-slate-400 dark:text-slate-500 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Plus className="w-5 h-5 text-blue-500" />
                                </div>
                                <span className="font-medium">Assign New Team Member</span>
                            </button>

                            {/* Mobile Add Button (Top) */}
                            {currentPage === 1 && (
                                <div className="md:hidden mb-2">
                                    <button onClick={() => setShowAssignModal(true)}
                                        className="w-full flex items-center justify-center p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium gap-2">
                                        <Plus className="w-5 h-5" /> Assign New Team Member
                                    </button>
                                </div>
                            )}

                            {paginatedAssignments.map((assignment) => (
                                <Card key={assignment.id} className="p-6 transition-all hover:shadow-md group dark:bg-slate-900 dark:border-slate-800">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                                        {/* Member Info */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2 md:mb-0">
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{assignment.member}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-sm text-slate-500 dark:text-slate-400">Notified via:</span>
                                                        <div className="flex gap-1">
                                                            {assignment.methods.includes('sms') && <Badge variant="secondary" className="gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"><MessageSquare className="w-3 h-3" /> SMS</Badge>}
                                                            {assignment.methods.includes('email') && <Badge variant="secondary" className="gap-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"><Mail className="w-3 h-3" /> Email</Badge>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 md:hidden">
                                                    <Switch checked={assignment.enabled} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tags & Sources */}
                                        <div className="flex-1 flex flex-col md:flex-row gap-6 md:items-center">
                                            <div className="flex-1">
                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tags</p>
                                                <div className="flex gap-2 flex-wrap">
                                                    {assignment.tags.map(tag => (
                                                        <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-medium border border-slate-200 dark:border-slate-700">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex-1 md:border-l md:border-slate-100 dark:md:border-slate-800 md:pl-6">
                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Sources</p>
                                                <div className="flex gap-2 flex-wrap text-slate-600 dark:text-slate-400">
                                                    {assignment.sources.map(source => (
                                                        <div key={source} className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 px-2 py-1 rounded text-xs">
                                                            <span className="capitalize">{source}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Controls */}
                                        <div className="hidden md:flex items-center gap-4 pl-4 border-l border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <Switch checked={assignment.enabled} />
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
                                <div className="col-span-3">Team Member</div>
                                <div className="col-span-3">Tags</div>
                                <div className="col-span-3">Sources</div>
                                <div className="col-span-2">Methods</div>
                                <div className="col-span-1 text-right">Enabled</div>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {currentPage === 1 && (
                                    <div onClick={() => setShowAssignModal(true)} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                                        <div className="col-span-12 flex items-center gap-3 text-slate-500 font-medium group-hover:text-blue-600">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500">
                                                <Plus className="w-4 h-4" />
                                            </div>
                                            Assign New Team Member
                                        </div>
                                    </div>
                                )}
                                {paginatedAssignments.map(a => (
                                    <div key={a.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => setShowAssignModal(true)}>
                                        <div className="col-span-3 font-medium text-slate-900 dark:text-white">{a.member}</div>
                                        <div className="col-span-3 flex flex-wrap gap-1">
                                            {a.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10px] border border-slate-200 dark:border-slate-700">{tag}</span>
                                            ))}
                                            {a.tags.length > 2 && <span className="text-[10px] text-slate-400">+{a.tags.length - 2}</span>}
                                        </div>
                                        <div className="col-span-3 text-sm text-slate-500 dark:text-slate-400 flex flex-wrap gap-1">
                                            {a.sources.map(s => <span key={s} className="capitalize">{s}</span>).reduce((prev, curr) => [prev, ', ', curr])}
                                        </div>
                                        <div className="col-span-2 flex gap-1">
                                            {a.methods.map(m => (
                                                <Badge key={m} variant="secondary" className="px-1 py-0 h-5 text-[10px] uppercase">{m}</Badge>
                                            ))}
                                        </div>
                                        <div className="col-span-1 text-right">
                                            <Switch checked={a.enabled} />
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
                                    <button onClick={() => setShowAssignModal(true)}
                                        className="w-full flex items-center justify-center p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium gap-2">
                                        <Plus className="w-5 h-5" /> Assign New
                                    </button>
                                )}
                                {paginatedAssignments.map(a => (
                                    <div key={a.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm" onClick={() => setShowAssignModal(true)}>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-900 dark:text-white">{a.member}</h3>
                                            <Switch checked={a.enabled} />
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                            Via: {a.methods.map(m => m.toUpperCase()).join(', ')}
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {a.tags.map(tag => (
                                                <span key={tag} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10px] border border-slate-200 dark:border-slate-700">{tag}</span>
                                            ))}
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
                                Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredAssignments.length)}</span> of <span className="font-medium">{filteredAssignments.length}</span> results
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

            {/* Modal */}
            {showAssignModal && (
                <AssignTeamMemberModal onClose={() => setShowAssignModal(false)} />
            )}
        </div>
    );
}
