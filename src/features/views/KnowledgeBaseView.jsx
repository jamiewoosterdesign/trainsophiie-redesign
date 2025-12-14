import React, { useState, useRef } from 'react';
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

// Consolidated Mock Data
const ALL_KNOWLEDGE = [
    { id: 1, name: "SOP_Manual_2024.pdf", size: "2.4MB", date: "2 days ago", type: "pdf", status: "Active", source: "upload", createdAt: Date.now() - 172800000 },
    { id: 2, name: "Pricing_Guide_Q3.docx", size: "1.1MB", date: "1 week ago", type: "doc", status: "Active", source: "upload", createdAt: Date.now() - 604800000 },
    { id: 3, name: "Employee_Handbook.pdf", size: "3.5MB", date: "2 weeks ago", type: "pdf", status: "Active", source: "upload", createdAt: Date.now() - 1209600000 },
    { id: 101, name: "Website FAQs", url: "company.com/faq", status: "Synced", source: "web" },
    { id: 102, name: "Contact Page", url: "company.com/contact", status: "Synced", source: "web" },
    { id: 4, name: "Product_Catalog.pdf", size: "5.0MB", date: "1 month ago", type: "pdf", status: "Active", source: "upload" },
    { id: 5, name: "Safety_Procedures.docx", size: "500KB", date: "1 month ago", type: "doc", status: "Archived", source: "upload" },
    { id: 103, name: "About Us", url: "company.com/about", status: "Synced", source: "web" },
    { id: 104, name: "Services Overview", url: "company.com/services", status: "Pending", source: "web" },
    { id: 6, name: "Marketing_Plan.pptx", size: "8.2MB", date: "2 months ago", type: "ppt", status: "Active", source: "upload" },
    { id: 7, name: "Customer_Service_Scripts.docx", size: "800KB", date: "3 months ago", type: "doc", status: "Active", source: "upload" },
    { id: 105, name: "Pricing Page", url: "company.com/pricing", status: "Synced", source: "web" },
    { id: 8, name: "Technical_Specs.pdf", size: "1.2MB", date: "3 months ago", type: "pdf", status: "Active", source: "upload" },
    { id: 106, name: "Blog: Industry Trends", url: "company.com/blog/trends", status: "Synced", source: "web" },
    { id: 107, name: "Blog: Tips & Tricks", url: "company.com/blog/tips", status: "Synced", source: "web" },
    { id: 9, name: "Meeting_Minutes_Oct.docx", size: "150KB", date: "4 months ago", type: "doc", status: "Archived", source: "upload" },
    { id: 108, name: "Support Portal", url: "support.company.com", status: "Error", source: "web" },
    { id: 109, name: "Careers Page", url: "company.com/careers", status: "Synced", source: "web" },
    { id: 10, name: "Financial_Report_Q2.xlsx", size: "200KB", date: "5 months ago", type: "xls", status: "Confidential", source: "upload" },
    { id: 110, name: "Terms of Service", url: "company.com/terms", status: "Synced", source: "web" },
    { id: 111, name: "Privacy Policy", url: "company.com/privacy", status: "Synced", source: "web" },
    { id: 11, name: "Onboarding_Checklist.pdf", size: "300KB", date: "6 months ago", type: "pdf", status: "Active", source: "upload" },
    { id: 112, name: "Case Studies", url: "company.com/case-studies", status: "Pending", source: "web" },
    { id: 12, name: "Brand_Guidelines.pdf", size: "10MB", date: "1 year ago", type: "pdf", status: "Active", source: "upload" },
    { id: 113, name: "Team Bios", url: "company.com/team", status: "Synced", source: "web" },
    { id: 13, name: "Training_Video_1.mp4", size: "150MB", date: "1 year ago", type: "video", status: "Active", source: "upload" },
    { id: 114, name: "Landing Page A", url: "company.com/promo-a", status: "Inactive", source: "web" },
    { id: 14, name: "Logo_Pack.zip", size: "25MB", date: "1 year ago", type: "archive", status: "Active", source: "upload" },
    { id: 115, name: "Landing Page B", url: "company.com/promo-b", status: "Inactive", source: "web" },
    { id: 15, name: "Legal_Contracts.pdf", size: "1.5MB", date: "2 years ago", type: "pdf", status: "Confidential", source: "upload" },
];

function KnowledgeSection({ title, icon: Icon, data, openWizard, highlightedId, handleCreateSource, onToggle, onDelete }) {
    const [view, setView] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSource, setFilterSource] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 11; // 11 items + 1 add card = 12 items (perfect grid)

    // Filter & Sort Logic
    const filteredData = data
        .filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.url && item.url.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .filter(item => {
            if (filterSource === 'all') return true;
            return item.source === filterSource;
        })
        .sort((a, b) => {
            if (sortBy === 'date') return (b.createdAt || 0) - (a.createdAt || 0); // Newest first
            return a.name.localeCompare(b.name);
        });

    // Pagination Logic
    const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterSource, sortBy, view]);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {Icon && <Icon className="w-5 h-5 text-slate-500" />}
                        {title}
                    </h2>
                    <ViewToggle view={view} onViewChange={setView} />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search documents and sources..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-9 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                        <Select value={filterSource} onValueChange={setFilterSource}>
                            <SelectTrigger className="w-[150px] h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                                <SelectValue placeholder="Source Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sources</SelectItem>
                                <SelectItem value="upload">Uploads</SelectItem>
                                <SelectItem value="web">Web Links</SelectItem>
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
                    {/* Add Button - Always Visible on Grid */}
                    <AddNewCard
                        title="Add New Source"
                        description="Upload PDFs or text files for knowledge"
                        onClick={() => openWizard('document', {}, (data) => handleCreateSource(data))}
                    />

                    {/* Mobile Add Button - Always Visible on Grid (Top) */}
                    {currentPage === 1 && (
                        <div className="md:hidden">
                            <AddNewCard
                                title="Add New Source"
                                onClick={() => openWizard('document', {}, (data) => handleCreateSource(data))}
                                variant="compact"
                            />
                        </div>
                    )}

                    {paginatedData.map(item => (
                        <Card key={item.id} className={`p-6 group hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer flex flex-col h-full min-h-[240px] dark:bg-slate-900 dark:border-slate-800 relative overflow-hidden ${(item.isDraft || item.active === false) ? 'opacity-70 grayscale-[0.5]' : ''} ${item.id === highlightedId ? (item.isDraft ? 'animate-in zoom-in-0 duration-500 border-orange-500 shadow-orange-500/20 shadow-md ring-1 ring-orange-500/50' : 'animate-in zoom-in-0 duration-500 border-blue-500 shadow-blue-500/20 shadow-md ring-1 ring-blue-500/50') : ''}`}>
                            {/* Accent Line Removed */}

                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-lg ${item.source === 'upload' ? 'bg-orange-50 dark:bg-orange-900/10 text-orange-600 dark:text-orange-400' : 'bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400'}`}>
                                    {item.source === 'upload' ? <FileText className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                                </div>
                                <div className="flex gap-1 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => openWizard('document', item)}>
                                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onToggle(item.id)}>
                                                <Power className="mr-2 h-4 w-4" />
                                                {item.active === false ? 'Enable' : 'Disable'}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600" onClick={() => onDelete(item.id)}>
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1 mb-1">{item.name}</h3>

                            {item.source === 'upload' ? (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                                    <File className="w-3 h-3" /> {item.type.toUpperCase()} • {item.size}
                                </p>
                            ) : (
                                <p className="text-xs text-blue-500 dark:text-blue-400 mt-1 flex items-center gap-1.5 line-clamp-1 hover:underline">
                                    <LinkIcon className="w-3 h-3" /> {item.url}
                                </p>
                            )}

                            <div className="mt-auto pt-4 flex gap-2 items-center justify-between border-t border-slate-100 dark:border-slate-800">
                                <Badge variant={item.isDraft ? 'outline' : (item.active === false ? 'secondary' : (item.status === 'Synced' || item.status === 'Active' ? 'success' : 'outline'))} className={item.isDraft ? "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800" : ""}>{item.isDraft ? 'Incomplete' : (item.active === false ? 'Inactive' : item.status)}</Badge>
                                <span className={`text-[10px] uppercase font-bold tracking-wider ${item.source === 'upload' ? 'text-orange-300' : 'text-blue-300'}`}>
                                    {item.source === 'upload' ? 'FILE' : 'WEB'}
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
                        <div className="col-span-5">Name</div>
                        <div className="col-span-4">Type / URL</div>
                        <div className="col-span-2">Status</div>
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
                            <div key={item.id} className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${(item.isDraft || item.active === false) ? 'opacity-70' : ''} ${item.id === highlightedId ? (item.isDraft ? 'bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-500 pl-5' : 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 pl-5') : ''}`} onClick={() => openWizard('document')}>
                                <div className="col-span-5 flex items-center gap-3">
                                    <div className={`p-1.5 rounded ${item.source === 'upload' ? 'bg-orange-50 dark:bg-orange-900/10 text-orange-600 dark:text-orange-400' : 'bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400'}`}>
                                        {item.source === 'upload' ? <FileText className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                                    </div>
                                    <div className="font-medium text-slate-900 dark:text-white">
                                        {item.name}
                                    </div>
                                </div>
                                <div className="col-span-4 text-sm text-slate-500 dark:text-slate-400 truncate">
                                    {item.source === 'upload' ? `${item.date} • ${item.size}` : item.url}
                                </div>
                                <div className="col-span-2">
                                    <Badge variant={item.isDraft ? 'outline' : (item.active === false ? 'secondary' : (item.status === 'Synced' || item.status === 'Active' ? 'success' : 'outline'))} className={item.isDraft ? "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800" : ""}>{item.isDraft ? "Incomplete" : (item.active === false ? 'Inactive' : item.status)}</Badge>
                                </div>
                                <div className="col-span-1 text-right flex justify-end" onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => openWizard('document', item)}>
                                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onToggle(item.id)}>
                                                <Power className="mr-2 h-4 w-4" />
                                                {item.active === false ? 'Enable' : 'Disable'}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600" onClick={() => onDelete(item.id)}>
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
                                title="Add New Source"
                                onClick={() => openWizard('document', {}, (data) => handleCreateSource(data))}
                                variant="compact"
                            />
                        )}
                        {paginatedData.map(item => (
                            <div key={item.id} className={`p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden ${(item.isDraft || item.active === false) ? 'opacity-70 grayscale-[0.5]' : ''} ${item.id === highlightedId ? (item.isDraft ? 'border-orange-500 shadow-md' : 'border-blue-500 shadow-md') : ''}`} onClick={() => openWizard('document')}>
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.isDraft ? 'bg-orange-500' : (item.source === 'upload' ? 'bg-orange-400' : 'bg-blue-400')}`} />
                                <div className="flex justify-between items-start mb-2 pl-2">
                                    <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={item.isDraft ? 'outline' : (item.active === false ? 'secondary' : (item.status === 'Synced' || item.status === 'Active' ? 'success' : 'outline'))} className={`text-[10px] h-5 ${item.isDraft ? "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800" : ""}`}>{item.isDraft ? "Incomplete" : (item.active === false ? 'Inactive' : item.status)}</Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => openWizard('document', item)}>
                                                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onToggle(item.id)}>
                                                    <Power className="mr-2 h-4 w-4" />
                                                    {item.active === false ? 'Enable' : 'Disable'}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600" onClick={() => onDelete(item.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 pl-2">
                                    {item.source === 'upload' ? `${item.date} • ${item.size}` : item.url}
                                </p>
                            </div>
                        ))}
                    </>
                )}
            </div>

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
    );
}

export default function KnowledgeBaseView() {
    const { openWizard, startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);

    const [knowledgeBase, setKnowledgeBase] = useState(ALL_KNOWLEDGE);
    const [showSuccess, setShowSuccess] = useState({ show: false, type: 'created' });
    const [highlightedKbId, setHighlightedKbId] = useState(null);

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

                    <KnowledgeSection
                        title="Documents & Sources"
                        icon={Book}
                        data={knowledgeBase}
                        openWizard={openWizard}
                        highlightedId={highlightedKbId}
                        handleCreateSource={handleCreateSource}
                        onToggle={handleToggleKbStatus}
                        onDelete={handleDeleteKb}
                    />
                </div>
            </div>
        </div>
    );
}
