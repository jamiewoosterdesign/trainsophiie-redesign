import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { AddNewCard } from '@/components/shared/AddNewCard';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { UploadCloud, Plus, Settings, FileText, Globe, ArrowLeft, Search, ChevronLeft, ChevronRight, Book, Link as LinkIcon, File, CheckCircle, X, Edit2, Trash2 } from 'lucide-react';
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
import { MoreHorizontal, Power, Copy } from 'lucide-react';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';
import { ViewToggle } from '@/components/shared/ViewToggle';
import { useDemo } from '@/context/DemoContext';

// Consolidated Mock Data
const ALL_KNOWLEDGE = [
    { id: 1, name: "SOP_Manual_2024.pdf", size: "2.4MB", date: "2 days ago", type: "pdf", status: "Active", source: "upload", createdAt: 1700000000000 },
    { id: 2, name: "Pricing_Guide_v3.pdf", size: "1.1MB", date: "5 days ago", type: "pdf", status: "Active", source: "upload", createdAt: 1700000000001 },
    { id: 3, name: "Service_Agreement.docx", size: "850KB", date: "1 week ago", type: "doc", status: "Active", source: "upload", createdAt: 1700000000002 },
    { id: 4, name: "Company_Website", size: "15 Pages", date: "Synced today", type: "web", status: "Active", source: "web", url: "https://visionelectrical.com.au", createdAt: 1700000000003 },
    { id: 5, name: "Troubleshooting_Guide.pdf", size: "4.2MB", date: "2 weeks ago", type: "pdf", status: "Active", source: "upload", createdAt: 1700000000004 },
    { id: 6, name: "Safety_Protocols.pdf", size: "1.8MB", date: "3 weeks ago", type: "pdf", status: "Active", source: "upload", createdAt: 1700000000005 },
    { id: 7, name: "Competitor_Analysis.xslx", size: "550KB", date: "1 month ago", type: "xls", status: "Archived", source: "upload", createdAt: 1700000000006 },
    { id: 8, name: "Onboarding_Checklist.docx", size: "320KB", date: "1 month ago", type: "doc", status: "Active", source: "upload", createdAt: 1700000000007 },
    { id: 9, name: "Customer_Feedback_Log.csv", size: "120KB", date: "2 days ago", type: "csv", status: "Active", source: "upload", createdAt: 1700000000008 },
    { id: 10, name: "Marketing_Assets.zip", size: "125MB", date: "4 days ago", type: "zip", status: "Active", source: "upload", createdAt: 1700000000009 },
    { id: 11, name: "Q4_Financials.pdf", size: "3.5MB", date: "Just now", type: "pdf", status: "Draft", source: "upload", createdAt: 1700000000010 },
];

export default function KnowledgeBaseView() {
    const { openWizard, startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();
    const { isBlankState } = useDemo();
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);

    const [knowledgeBase, setKnowledgeBase] = useState(ALL_KNOWLEDGE);
    const [showSuccess, setShowSuccess] = useState({ show: false, type: 'created' });
    const [highlightedKbId, setHighlightedKbId] = useState(null);

    useEffect(() => {
        if (isBlankState) {
            setKnowledgeBase([]);
        } else {
            setKnowledgeBase(ALL_KNOWLEDGE);
        }
    }, [isBlankState]);

    const handleCreateSource = (data) => {
        const newId = `new-kb-${Date.now()}`;
        const newSource = {
            id: newId,
            name: data.contextFileName || "New Knowledge Source",
            size: "0KB",
            date: "Just now",
            type: "txt",
            status: data.status === 'draft' ? "Draft" : "Active",
            source: data.knowledgeSourceType || "upload",
            url: data.knowledgeUrl || "",
            isDraft: data.status === 'draft',
            createdAt: Date.now()
        };

        if (newSource.source === 'web' && !newSource.name.includes('.')) {
            newSource.name = newSource.url || "New Web Source";
        }

        setKnowledgeBase(prev => [newSource, ...prev]);
        setShowSuccess({ show: true, type: data.status === 'draft' ? 'saved' : 'created' });
        setHighlightedKbId(newId);

        setTimeout(() => setShowSuccess({ show: false, type: 'created' }), 3000);
        setTimeout(() => setHighlightedKbId(null), 6000);
    };

    const handleToggleKbStatus = (id) => {
        setKnowledgeBase(prev => prev.map(i => i.id === id ? { ...i, active: i.active === false ? true : false } : i));
    };

    const handleDeleteKb = (id) => {
        setKnowledgeBase(prev => prev.filter(i => i.id !== id));
    };

    const [view, setView] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    // Filter & Sort Logic
    const filteredData = knowledgeBase
        .filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'date') return (b.createdAt || 0) - (a.createdAt || 0);
            return a.name.localeCompare(b.name);
        });

    const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortBy, view]);

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300 relative">
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
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{showSuccess.type === 'saved' ? 'Source Saved' : 'Source Added!'}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{showSuccess.type === 'saved' ? 'You can finish it later.' : 'Knowledge base updated.'}</p>
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
                title="Knowledge Base"
                subtitle="Manage documents, PDFs, and website data."
                scrollDirection={scrollDirection}
            >
                <Button onClick={() => openWizard('document', {}, (data) => handleCreateSource(data))} className="w-full md:w-auto">
                    <UploadCloud className="w-4 h-4 mr-2" /> Add Source
                </Button>
            </PageHeader>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto w-full space-y-12">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
                        {/* Toolbar */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row justify-between items-center gap-4">
                                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <Book className="w-5 h-5 text-slate-500" /> Documents & Sources
                                </h2>
                                <ViewToggle view={view} onViewChange={setView} />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        placeholder="Search sources..."
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
                                    title="Add New Source"
                                    description="Upload PDFs or add websites"
                                    onClick={() => openWizard('document', {}, (data) => handleCreateSource(data))}
                                />
                                {currentPage === 1 && (
                                    <div className="md:hidden">
                                        <AddNewCard
                                            title="Add New Source"
                                            onClick={() => openWizard('document')}
                                            variant="compact"
                                        />
                                    </div>
                                )}
                                {paginatedData.map(item => (
                                    <Card key={item.id} className={`p-6 hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 dark:bg-slate-900 dark:border-slate-800 flex flex-col h-full justify-between group ${item.isDraft ? 'opacity-70 grayscale-[0.5]' : ''} ${item.id === highlightedKbId ? (item.isDraft ? 'animate-in zoom-in-0 duration-500 border-orange-500 shadow-orange-500/20 shadow-md ring-1 ring-orange-500/50' : 'animate-in zoom-in-0 duration-500 border-blue-500 shadow-blue-500/20 shadow-md ring-1 ring-blue-500/50') : ''}`} onClick={() => openWizard('document', item)}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
                                                {item.source === 'web' ? <Globe className="w-5 h-5" /> : <File className="w-5 h-5" />}
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenuItem onClick={() => openWizard('document', item)}>
                                                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => handleDeleteKb(item.id)}>
                                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 truncate" title={item.name}>{item.name}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{item.date} • {item.size}</p>

                                        <div className="flex items-center justify-between text-sm text-slate-400 dark:text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex flex-col gap-1">
                                                {item.isDraft && <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800 text-[10px] h-5 w-fit">Incomplete</Badge>}
                                                {!item.isDraft && (
                                                    item.status !== 'Active' ? <Badge variant="secondary" className="w-fit">{item.status}</Badge> : <Badge variant="success" className="w-fit">Active</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs">
                                                {item.type.toUpperCase()}
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
                                    <div className="col-span-5">Name</div>
                                    <div className="col-span-3">Date Added</div>
                                    <div className="col-span-2">Type</div>
                                    <div className="col-span-1">Status</div>
                                    <div className="col-span-1 text-right">Actions</div>
                                </div>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {currentPage === 1 && (
                                        <div onClick={() => openWizard('document', {}, (data) => handleCreateSource(data))} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                                            <div className="col-span-12 flex items-center gap-3 text-slate-500 font-medium group-hover:text-blue-600">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500">
                                                    <Plus className="w-4 h-4" />
                                                </div>
                                                Add New Source
                                            </div>
                                        </div>
                                    )}
                                    {paginatedData.map(item => (
                                        <div key={item.id} className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group ${item.id === highlightedKbId ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 pl-5' : ''}`} onClick={() => openWizard('document', item)}>
                                            <div className="col-span-5 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                                {item.source === 'web' ? <Globe className="w-4 h-4 text-slate-400" /> : <File className="w-4 h-4 text-slate-400" />}
                                                {item.name}
                                                {item.isDraft && <Badge variant="outline" className="text-[10px] h-5 bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">Incomplete</Badge>}
                                            </div>
                                            <div className="col-span-3 text-sm text-slate-500 dark:text-slate-400">{item.date}</div>
                                            <div className="col-span-2 text-sm text-slate-500 dark:text-slate-400 uppercase">{item.type}</div>
                                            <div className="col-span-1">
                                                {!item.isDraft && (
                                                    item.status !== 'Active' ? <Badge variant="secondary">{item.status}</Badge> : <Badge variant="success">Active</Badge>
                                                )}
                                            </div>
                                            <div className="col-span-1 text-right flex justify-end">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                                        <DropdownMenuItem onClick={() => openWizard('document', item)}>
                                                            <Edit2 className="w-4 h-4 mr-2" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteKb(item.id)} className="text-red-600 dark:text-red-400">
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

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4">
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}</span> of <span className="font-medium">{filteredData.length}</span> results
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
