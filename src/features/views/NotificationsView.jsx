import React, { useState, useRef } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { AddNewCard } from '@/components/shared/AddNewCard';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { Bell, UserPlus, ArrowLeft, Mail, MessageSquare, Phone, Globe, Pencil, Trash2, Search, ChevronLeft, ChevronRight, LayoutGrid, List, Plus, CheckCircle, X, MoreHorizontal, Copy, Power, Edit2 } from 'lucide-react';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useNavigate, useOutletContext } from 'react-router-dom';
import WizardModal from '@/features/wizards/WizardModal';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';
import { ViewToggle } from '@/components/shared/ViewToggle';

// Expanded Mock Data
const MOCK_ASSIGNMENTS = [
    { id: 1, member: 'Sarah Wilson', methods: ['sms', 'email'], tags: ['VIP', 'Urgent', 'Long Term', 'High Volume', 'Verified', 'Priority', 'Gold', 'Legacy', 'Local'], sources: ['call', 'sms'], enabled: true, createdAt: 1700000000000 },
    { id: 2, member: 'Mike Johnson', methods: ['email'], tags: ['All'], sources: ['webform'], enabled: true, createdAt: 1700000000001 },
    { id: 3, member: 'Emily Davis', methods: ['sms'], tags: ['Support', 'Billing', 'Returns', 'Complaints', 'Inquiries'], sources: ['chatbot', 'email'], enabled: false, createdAt: 1700000000002 },
    { id: 4, member: 'David Brown', methods: ['email', 'sms'], tags: ['Sales', 'High Value', 'Corporate', 'Enterprise', 'Partner', 'Strategic'], sources: ['webform', 'call'], enabled: true },
    { id: 5, member: 'Jessica Lee', methods: ['email'], tags: ['General'], sources: ['email'], enabled: true },
    { id: 6, member: 'Chris Martin', methods: ['sms'], tags: ['Technical', 'Admin', 'Root Access'], sources: ['chatbot'], enabled: true },
    { id: 7, member: 'Ashley Taylor', methods: ['email'], tags: ['Billing'], sources: ['email', 'call'], enabled: true },
    { id: 8, member: 'Matthew Anderson', methods: ['sms', 'email'], tags: ['Emergency', '24/7', 'On-Call', 'Supervisor'], sources: ['call'], enabled: true },
    { id: 9, member: 'Olivia Thomas', methods: ['email'], tags: ['Feedback'], sources: ['webform'], enabled: false },
    { id: 10, member: 'Daniel Martinez', methods: ['sms'], tags: ['Returns', 'RMA', 'Logistics'], sources: ['email', 'chatbot'], enabled: true },
    { id: 11, member: 'Sophia Hernandez', methods: ['email', 'sms'], tags: ['All'], sources: ['call'], enabled: true },
    { id: 12, member: 'James Wilson', methods: ['email'], tags: ['Support', 'Tier 1', 'Tier 2', 'Tier 3', 'Escalation', 'Manager'], sources: ['webform'], enabled: true },
    { id: 13, member: 'Isabella Clark', methods: ['sms'], tags: ['Sales'], sources: ['call'], enabled: false },
    { id: 14, member: 'Ethan Lewis', methods: ['email'], tags: ['General'], sources: ['email'], enabled: true },
    { id: 15, member: 'Ava Walker', methods: ['sms', 'email'], tags: ['Urgent'], sources: ['call', 'sms'], enabled: true },
];

export default function NotificationsView() {
    const navigate = useNavigate();
    const { startGlobalVoiceFlow } = useOutletContext();
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS);
    const [showSuccess, setShowSuccess] = useState(false);
    const [highlightedAssignmentId, setHighlightedAssignmentId] = useState(null);

    const handleAssignMember = (data) => {
        // If we are editing, we might handle update here, but for "Creation" flow focus:
        if (!editingAssignment) {
            const newId = Date.now();
            const newAssignment = {
                id: newId,
                member: "New Team Member", // In a real app, this would come from the wizard selection
                methods: ['email'],
                tags: ['General'],
                sources: ['webform'],
                enabled: true,
                createdAt: Date.now()
            };
            // Note: In a real app data would contain the structured wizard result.
            // For now, we mock the new entry based on generic wizard completion.

            setAssignments(prev => [newAssignment, ...prev]);
            setShowSuccess(true);
            setHighlightedAssignmentId(newId);
            setTimeout(() => setShowSuccess(false), 3000);
            setTimeout(() => setHighlightedAssignmentId(null), 6000);
        }
    };

    const handleDuplicateAssignment = (assignment) => {
        const newAssignment = {
            ...assignment,
            id: Date.now(),
            member: `${assignment.member} 2`,
            enabled: false,
            createdAt: Date.now()
        };
        setAssignments(prev => [newAssignment, ...prev]);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleToggleAssignment = (id) => {
        setAssignments(prev => prev.map(a => a.id === id ? { ...a, enabled: a.enabled === false ? true : false } : a));
    };

    const handleDeleteAssignment = (id) => {
        setAssignments(prev => prev.filter(a => a.id !== id));
    };

    const [view, setView] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'active' | 'inactive'
    const [sortBy, setSortBy] = useState('date');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 11;
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);

    // Filter & Sort Logic
    const filteredAssignments = assignments
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
            if (sortBy === 'date') return (b.createdAt || 0) - (a.createdAt || 0); // Newest first
            if (sortBy === 'status') return (a.enabled === b.enabled) ? 0 : a.enabled ? -1 : 1;
            return a.member.localeCompare(b.member);
        });

    const getTagStyle = (tagName) => {
        if (tagName === 'All') return 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white';

        const styles = {
            'VIP': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
            'Urgent': 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
            'New Customer': 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
            'Sales': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
            'Support': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
            'Billing': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
            'High Value': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
            'Refunds': 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
        };
        return styles[tagName] || 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    };

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

    const handleEdit = (assignment) => {
        const formDataShape = {
            assignMemberId: assignment.id,
            assignMethodSms: assignment.methods.includes('sms'),
            assignMethodEmail: assignment.methods.includes('email'),
            assignTags: assignment.tags,
            assignSourceCall: assignment.sources.includes('call'),
            assignSourceWebform: assignment.sources.includes('webform'),
            assignSourceChatbot: assignment.sources.includes('chatbot'),
            assignSourceSms: assignment.sources.includes('sms'),
            assignSourceEmail: assignment.sources.includes('email'),
        };
        setEditingAssignment(formDataShape);
        setShowAssignModal(true);
    };

    const handleNew = () => {
        setEditingAssignment(null);
        setShowAssignModal(true);
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300 relative">
            {/* Success Modal Overlay */}
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
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Assignment Created!</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Added to notify list.</p>
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
            {/* Header */}
            {/* Header */}
            <PageHeader
                title="Notifications"
                subtitle="Manage team notifications and assignments."
                scrollDirection={scrollDirection}
            >
                <Button onClick={handleNew} className="w-full sm:w-auto">
                    <UserPlus className="w-4 h-4 mr-2" /> Assign New Team Member
                </Button>
            </PageHeader>

            {/* Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto w-full space-y-8">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
                        {/* Toolbar */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row justify-between items-center gap-4">
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
                                            <SelectItem value="date">Date Added</SelectItem>
                                            <SelectItem value="member">Name (A-Z)</SelectItem>
                                            <SelectItem value="status">Status</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Grid View (Cards) */}
                        {view === 'grid' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                <AddNewCard
                                    title="Assign New Team Member"
                                    description="Set up alerts for a team member"
                                    onClick={handleNew}
                                />

                                {/* Mobile Add Button (Top) */}
                                {currentPage === 1 && (
                                    <div className="md:hidden">
                                        <AddNewCard
                                            title="Assign New Team Member"
                                            onClick={handleNew}
                                            variant="compact"
                                        />
                                    </div>
                                )}

                                {paginatedAssignments.map((assignment) => (
                                    <Card key={assignment.id} onClick={() => handleEdit(assignment)} className={`p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer dark:bg-slate-900 dark:border-slate-800 flex flex-col h-full min-h-[280px] group relative ${assignment.enabled === false ? 'opacity-70 grayscale-[0.5]' : ''} ${assignment.id === highlightedAssignmentId ? 'animate-in zoom-in-0 duration-500 border-blue-500 shadow-blue-500/20 shadow-md ring-1 ring-blue-500/50' : ''}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                {assignment.member.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenuItem onClick={() => handleEdit(assignment)}>
                                                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDuplicateAssignment(assignment)}>
                                                        <Copy className="w-4 h-4 mr-2" /> Duplicate
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleToggleAssignment(assignment.id)}>
                                                        <Power className={`w-4 h-4 mr-2 ${assignment.enabled ? "text-green-500" : "text-slate-400"}`} /> {assignment.enabled ? 'Disable' : 'Enable'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => handleDeleteAssignment(assignment.id)}>
                                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-1" title={assignment.member}>{assignment.member}</h3>

                                        {/* Text-based Methods (Email/SMS) */}
                                        <div className="flex flex-wrap items-center gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400">
                                            {assignment.methods.map(method => (
                                                <div key={method} className="flex items-center gap-2">
                                                    {method === 'sms' ? <MessageSquare className="w-4 h-4 text-slate-400" /> : <Mail className="w-4 h-4 text-slate-400" />}
                                                    <span className="capitalize">{method === 'sms' ? 'SMS' : 'Email'}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Methods (renamed from Sources) */}
                                        <div className="mb-4">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                                                <Globe className="w-3 h-3" /> Methods
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 text-slate-600 dark:text-slate-400">
                                                {assignment.sources.map(s => (
                                                    <div key={s} className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 px-2 h-6 rounded text-xs capitalize">
                                                        {s}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div className="mb-4">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                                                <UserPlus className="w-3 h-3" /> Tags
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {assignment.tags.slice(0, 3).map(tag => (
                                                    <span key={tag} className={`px-2 h-6 flex items-center rounded text-xs font-medium border truncate max-w-[150px] ${getTagStyle(tag)}`}>
                                                        {tag}
                                                    </span>
                                                ))}
                                                {assignment.tags.length > 3 && (
                                                    <span className="text-[10px] text-slate-400 flex items-center">+{assignment.tags.length - 3}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <div>
                                                {assignment.enabled ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
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
                                    <div className="col-span-2">Tags</div>
                                    <div className="col-span-3">Sources</div>
                                    <div className="col-span-2">Methods</div>
                                    <div className="col-span-1 text-right">Status</div>
                                    <div className="col-span-1 text-right">Actions</div>
                                </div>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {currentPage === 1 && (
                                        <div onClick={handleNew} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                                            <div className="col-span-12 flex items-center gap-3 text-slate-500 font-medium group-hover:text-blue-600">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500">
                                                    <Plus className="w-4 h-4" />
                                                </div>
                                                Assign New Team Member
                                            </div>
                                        </div>
                                    )}
                                    {paginatedAssignments.map(a => (
                                        <div key={a.id} className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${a.enabled === false ? 'opacity-70 grayscale-[0.5]' : ''} ${a.id === highlightedAssignmentId ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 pl-5' : ''}`} onClick={() => handleEdit(a)}>
                                            <div className="col-span-3 font-medium text-slate-900 dark:text-white">{a.member}</div>
                                            <div className="col-span-2 flex flex-wrap gap-1">
                                                {a.tags.slice(0, 2).map(tag => (
                                                    <span key={tag} className={`px-1.5 py-0.5 rounded text-[10px] border ${getTagStyle(tag)}`}>{tag}</span>
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
                                                {a.enabled ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                                            </div>
                                            <div className="col-span-1 text-right flex justify-end">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                                        <DropdownMenuItem onClick={() => handleEdit(a)}>
                                                            <Edit2 className="w-4 h-4 mr-2" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDuplicateAssignment(a)}>
                                                            <Copy className="w-4 h-4 mr-2" /> Duplicate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleToggleAssignment(a.id)}>
                                                            <Power className={`w-4 h-4 mr-2 ${a.enabled ? "text-green-500" : "text-slate-400"}`} /> {a.enabled ? 'Disable' : 'Enable'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => handleDeleteAssignment(a.id)}>
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
                                            title="Assign New"
                                            onClick={handleNew}
                                            variant="compact"
                                        />
                                    )}
                                    {paginatedAssignments.map(a => (
                                        <div key={a.id} className={`p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm ${a.id === highlightedAssignmentId ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : ''}`} onClick={() => handleEdit(a)}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-slate-900 dark:text-white">{a.member}</h3>
                                                <div className="flex items-center gap-2">
                                                    {a.enabled ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                                            <DropdownMenuItem onClick={() => handleEdit(a)}>
                                                                <Edit2 className="w-4 h-4 mr-2" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDuplicateAssignment(a)}>
                                                                <Copy className="w-4 h-4 mr-2" /> Duplicate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleToggleAssignment(a.id)}>
                                                                <Power className={`w-4 h-4 mr-2 ${a.enabled ? "text-green-500" : "text-slate-400"}`} /> {a.enabled ? 'Disable' : 'Enable'}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => handleDeleteAssignment(a.id)}>
                                                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
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
            </div>

            {/* Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 z-50">
                    <WizardModal
                        mode="notification_assignment"
                        initialData={editingAssignment}
                        onSwitchMode={() => { }}
                        onClose={(data) => {
                            if (data) handleAssignMember(data);
                            setShowAssignModal(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
