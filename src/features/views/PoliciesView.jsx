import React, { useState, useRef } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { AddNewCard } from '@/components/shared/AddNewCard';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useOutletContext } from 'react-router-dom';
import { Plus, FileText, Edit2, Trash2, ShieldCheck, ArrowLeft, Search, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';
import { useNavigate } from 'react-router-dom';
import { ViewToggle } from '@/components/shared/ViewToggle';

// Expanded Mock Data
const MOCK_POLICIES = [
    { id: 1, title: 'Warranty', content: 'Our standard warranty covers manufacturing defects for 12 months from the date of purchase. This does not cover accidental damage or wear and tear.' },
    { id: 2, title: 'Cancellation Policy', content: 'Cancellations must be made at least 24 hours in advance to avoid a cancellation fee of $50.' },
    { id: 3, title: 'Privacy Policy', content: 'We are committed to protecting your privacy and will not share your personal information with third parties without your consent.' },
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

    const [view, setView] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 11;
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);

    // Filter & Sort Logic
    const filteredPolicies = MOCK_POLICIES
        .filter(policy =>
            policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            policy.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
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
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <PageHeader
                title="Policies & Procedures"
                subtitle="Define your business rules and standard operating procedures."
                scrollDirection={scrollDirection}
            >
                <Button onClick={() => openWizard('policy')} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" /> Add Policy
                </Button>
            </PageHeader>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto w-full space-y-8">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

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
                                onClick={() => openWizard('policy')}
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
                                <Card key={policy.id} className="p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group flex flex-col h-full min-h-[240px] dark:bg-slate-900 dark:border-slate-800">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 dark:hover:text-red-400">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{policy.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-4 flex-grow">{policy.content}</p>
                                </Card>
                            ))}


                        </div>
                    )}

                    {/* Table View */}
                    {view === 'table' && (
                        <div className="hidden md:block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                <div className="col-span-5">Policy Title</div>
                                <div className="col-span-6">Content</div>
                                <div className="col-span-1 text-right">Actions</div>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {currentPage === 1 && (
                                    <div onClick={() => openWizard('policy')} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                                        <div className="col-span-12 flex items-center gap-3 text-slate-500 font-medium group-hover:text-blue-600">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500">
                                                <Plus className="w-4 h-4" />
                                            </div>
                                            Add New Policy
                                        </div>
                                    </div>
                                )}
                                {paginatedPolicies.map(policy => (
                                    <div key={policy.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group" onClick={() => openWizard('policy')}>
                                        <div className="col-span-5 font-medium text-slate-900 dark:text-white">{policy.title}</div>
                                        <div className="col-span-6 text-sm text-slate-500 dark:text-slate-400 truncate">{policy.content}</div>
                                        <div className="col-span-1 text-right flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 dark:hover:text-red-400">
                                                <Trash2 className="w-4 h-4" />
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
                                        title="Add New Policy"
                                        onClick={() => openWizard('policy')}
                                        variant="compact"
                                    />
                                )}
                                {paginatedPolicies.map(policy => (
                                    <div key={policy.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm" onClick={() => openWizard('policy')}>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">{policy.title}</h3>
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
    );
}
