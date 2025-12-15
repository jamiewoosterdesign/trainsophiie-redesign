import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { AddNewCard } from '@/components/shared/AddNewCard';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useOutletContext } from 'react-router-dom';
import { Plus, FileText, Edit2, Trash2, ShieldCheck, ArrowLeft, Search, ChevronLeft, ChevronRight, LayoutGrid, List, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { MoreHorizontal, Power, Copy } from 'lucide-react';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';
import { useNavigate } from 'react-router-dom';
import { ViewToggle } from '@/components/shared/ViewToggle';
import { useDemo } from '@/context/DemoContext';

// Expanded Mock Data
const MOCK_POLICIES = [
    { id: 1, title: 'Warranty', content: 'Our standard warranty covers manufacturing defects for 12 months from the date of purchase. This does not cover accidental damage or wear and tear.', createdAt: 1700000000000 },
    { id: 2, title: 'Cancellation Policy', content: 'Cancellations must be made at least 24 hours in advance to avoid a cancellation fee of $50.', createdAt: 1700000000001 },
    { id: 3, title: 'Privacy Policy', content: 'We are committed to protecting your privacy and will not share your personal information with third parties without your consent.', createdAt: 1700000000002 },
    { id: 4, title: 'Return Policy', content: 'Items can be returned within 30 days of purchase for a full refund or exchange, provided they are in original condition.' },
    { id: 5, title: 'Payment Terms', content: 'Payment is due upon completion of service. We accept cash, credit cards, and bank transfers. A 50% deposit is required for large projects.' },
    { id: 6, title: 'Service Guarantee', content: 'We guarantee our workmanship for 30 days. If you are not satisfied with our service, we will re-do it at no extra cost.' },
    { id: 7, title: 'Code of Conduct', content: 'Our staff are expected to treat all customers with respect and professionalism. Abusive behavior will not be tolerated.' },
    { id: 8, title: 'Safety Procedures', content: 'All staff follow strict safety protocols to ensure a safe working environment for themselves and our clients.' },
    { id: 9, title: 'Complaint Handling', content: 'We take all complaints seriously. Please contact our support team to report any issues, and we will investigate promptly.' },
    { id: 10, title: 'Data Retention', content: 'We retain customer data for 7 years as required by law for tax and accounting purposes.' },
    { id: 11, title: 'Travel Fees', content: 'A travel fee may apply for services outside our standard service area. This will be quoted prior to booking.' },
    { id: 12, title: 'Emergency Service', content: 'Emergency services outside business hours incur a surcharge of $100 plus standard hourly rates.' },
    { id: 13, title: 'Confidentiality', content: 'We maintain strict confidentiality regarding all client information and business dealings.' },
    { id: 14, title: 'Feedback', content: 'We welcome feedback to improve our services. You can leave a review on our website or contact us directly.' },
    { id: 15, title: 'Dispute Resolution', content: 'In the event of a dispute, we agree to first try to resolve it through mediation before pursuing legal action.' },
];

export default function PoliciesView() {
    const { openWizard, startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();
    const { isBlankState } = useDemo();

    const [policies, setPolicies] = useState(MOCK_POLICIES);
    const [showSuccess, setShowSuccess] = useState({ show: false, type: 'created' }); // type: 'created' | 'saved'
    const [highlightedPolicyId, setHighlightedPolicyId] = useState(null);

    useEffect(() => {
        if (isBlankState) {
            setPolicies([]);
        } else {
            setPolicies(MOCK_POLICIES);
        }
    }, [isBlankState]);

    const handleCreatePolicy = (data) => {
        // Create new policy object
        const newPolicyId = `new-${Date.now()}`;
        const newPolicy = {
            id: newPolicyId,
            title: data.policyTitle || 'New Policy',
            content: data.policyContent || 'No content',
            isDraft: data.status === 'draft',
            createdAt: Date.now()
        };

        setPolicies(prev => [newPolicy, ...prev]);

        // Show success modal
        setShowSuccess({ show: true, type: data.status === 'draft' ? 'saved' : 'created' });
        setHighlightedPolicyId(newPolicyId);

        // Auto-dismiss modal after 3 seconds
        setTimeout(() => setShowSuccess({ show: false, type: 'created' }), 3000);

        // Remove highlight after 6 seconds (3s modal + 3s fade out)
        setTimeout(() => setHighlightedPolicyId(null), 6000);
    };

    const handleDuplicatePolicy = (policy) => {
        const newPolicy = {
            ...policy,
            id: `dup-${Date.now()}`,
            title: `${policy.title} 2`,
            active: false,
            isDraft: false,
            createdAt: Date.now()
        };
        setPolicies(prev => [newPolicy, ...prev]);
        setShowSuccess({ show: true, type: 'created' });
        setHighlightedPolicyId(newPolicy.id);
        setTimeout(() => setShowSuccess({ show: false, type: 'created' }), 3000);
    };

    const handleTogglePolicyStatus = (id) => {
        setPolicies(prev => prev.map(p => p.id === id ? { ...p, active: p.active === false ? true : false } : p));
    };

    const handleDeletePolicy = (id) => {
        setPolicies(prev => prev.filter(p => p.id !== id));
    };

    const [view, setView] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 11;
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);

    // Filter & Sort Logic
    const filteredPolicies = policies
        .filter(policy =>
            policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            policy.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'date') return (b.createdAt || 0) - (a.createdAt || 0); // Newest first
            // Sort by title (A-Z)
            return a.title.localeCompare(b.title);
        });

    // Pagination Logic
    const totalPages = Math.max(1, Math.ceil(filteredPolicies.length / ITEMS_PER_PAGE));
    const paginatedPolicies = filteredPolicies.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset page
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortBy, view]);

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
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{showSuccess.type === 'saved' ? 'Policy Saved' : 'Policy Created!'}</h3>
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
                title="Policies & Procedures"
                subtitle="Define your business rules and standard operating procedures."
                scrollDirection={scrollDirection}
            >
                <Button onClick={() => openWizard('policy', {}, (data) => handleCreatePolicy(data))} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" /> Add Policy
                </Button>
            </PageHeader>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto w-full space-y-8">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
                        {/* Toolbar */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row justify-between items-center gap-4">
                                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-slate-500" /> Active Policies
                                </h2>
                                <ViewToggle view={view} onViewChange={setView} />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        placeholder="Search policies..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 h-9 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full"
                                    />
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-[140px] h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="date">Date Added</SelectItem>
                                            <SelectItem value="name">Title (A-Z)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Grid View */}
                        {view === 'grid' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                <AddNewCard
                                    title="Add New Policy"
                                    description="Set rules for cancellations & terms"
                                    onClick={() => openWizard('policy', {}, (data) => handleCreatePolicy(data))}
                                />
                                {/* Mobile Add Button (Top) */}
                                {currentPage === 1 && (
                                    <div className="md:hidden">
                                        <AddNewCard
                                            title="Add New Policy"
                                            onClick={() => openWizard('policy')}
                                            variant="compact"
                                        />
                                    </div>
                                )}
                                {paginatedPolicies.map(policy => (
                                    <Card key={policy.id} className={`p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group flex flex-col h-full min-h-[240px] dark:bg-slate-900 dark:border-slate-800 ${policy.isDraft ? 'opacity-70 grayscale-[0.5]' : ''} ${policy.id === highlightedPolicyId ? (policy.isDraft ? 'animate-in zoom-in-0 duration-500 border-orange-500 shadow-orange-500/20 shadow-md ring-1 ring-orange-500/50' : 'animate-in zoom-in-0 duration-500 border-blue-500 shadow-blue-500/20 shadow-md ring-1 ring-blue-500/50') : ''}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => openWizard('policy', policy)}>
                                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDuplicatePolicy(policy)}>
                                                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleTogglePolicyStatus(policy.id)}>
                                                            <Power className="mr-2 h-4 w-4" />
                                                            {policy.active === false ? 'Enable' : 'Disable'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePolicy(policy.id)}>
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{policy.title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-4 flex-grow mb-4">{policy.content}</p>
                                        <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-800 flex gap-1">
                                            {policy.isDraft && <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800 text-[10px] h-5 w-fit">Incomplete</Badge>}
                                            {!policy.isDraft && (policy.active === false ? <Badge variant="secondary">Inactive</Badge> : <Badge variant="success">Active</Badge>)}
                                        </div>
                                    </Card>
                                ))}


                            </div>
                        )}

                        {/* Table View */}
                        {view === 'table' && (
                            <div className="hidden md:block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    <div className="col-span-4">Policy Title</div>
                                    <div className="col-span-5">Content</div>
                                    <div className="col-span-2">Status</div>
                                    <div className="col-span-1 text-right">Actions</div>
                                </div>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {currentPage === 1 && (
                                        <div onClick={() => openWizard('policy', {}, (data) => handleCreatePolicy(data))} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                                            <div className="col-span-12 flex items-center gap-3 text-slate-500 font-medium group-hover:text-blue-600">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500">
                                                    <Plus className="w-4 h-4" />
                                                </div>
                                                Add New Policy
                                            </div>
                                        </div>
                                    )}
                                    {paginatedPolicies.map(policy => (
                                        <div key={policy.id} className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group ${(policy.isDraft || policy.active === false) ? 'opacity-70' : ''} ${policy.id === highlightedPolicyId ? (policy.isDraft ? 'bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-500 pl-5' : 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 pl-5') : ''}`} onClick={() => openWizard('policy')}>
                                            <div className="col-span-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                                {policy.title}
                                            </div>
                                            <div className="col-span-5 text-sm text-slate-500 dark:text-slate-400 truncate">{policy.content}</div>
                                            <div className="col-span-2">
                                                {policy.isDraft && <Badge variant="outline" className="text-[10px] h-5 bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">Incomplete</Badge>}
                                                {!policy.isDraft && (policy.active === false ? <Badge variant="secondary">Inactive</Badge> : <Badge variant="success">Active</Badge>)}
                                            </div>
                                            <div className="col-span-1 text-right flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => openWizard('policy', policy)}>
                                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDuplicatePolicy(policy)}>
                                                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleTogglePolicyStatus(policy.id)}>
                                                            <Power className="mr-2 h-4 w-4" />
                                                            {policy.active === false ? 'Enable' : 'Disable'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePolicy(policy.id)}>
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
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
                                            title="Add New Policy"
                                            onClick={() => openWizard('policy', {}, (data) => handleCreatePolicy(data))}
                                            variant="compact"
                                        />
                                    )}
                                    {paginatedPolicies.map(policy => (
                                        <div key={policy.id} className={`p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm ${(policy.isDraft || policy.active === false) ? 'opacity-70 grayscale-[0.5]' : ''} ${policy.id === highlightedPolicyId ? (policy.isDraft ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10' : 'border-blue-500 bg-blue-50 dark:bg-blue-900/10') : ''}`} onClick={() => openWizard('policy')}>
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-slate-900 dark:text-white">{policy.title}</h3>
                                                <div className="flex items-center gap-2">
                                                    {policy.isDraft && <Badge variant="outline" className="text-[10px] h-5 bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">Incomplete</Badge>}
                                                    {!policy.isDraft && (policy.active === false ? <Badge variant="secondary">Inactive</Badge> : <Badge variant="success">Active</Badge>)}
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => openWizard('policy', policy)}>
                                                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDuplicatePolicy(policy)}>
                                                                <Copy className="mr-2 h-4 w-4" /> Duplicate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleTogglePolicyStatus(policy.id)}>
                                                                <Power className="mr-2 h-4 w-4" />
                                                                {policy.active === false ? 'Enable' : 'Disable'}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePolicy(policy.id)}>
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{policy.content}</p>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4">
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredPolicies.length)}</span> of <span className="font-medium">{filteredPolicies.length}</span> results
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
