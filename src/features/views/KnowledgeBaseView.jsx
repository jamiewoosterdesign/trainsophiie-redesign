import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { UploadCloud, Plus, Settings, FileText, Globe, ArrowLeft, Search, ChevronLeft, ChevronRight } from 'lucide-react';
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

// Expanded Mock Data - Docs
const MOCK_DOCS = [
    { id: 1, name: "SOP_Manual_2024.pdf", size: "2.4MB", date: "2 days ago", type: "pdf", status: "Active" },
    { id: 2, name: "Pricing_Guide_Q3.docx", size: "1.1MB", date: "1 week ago", type: "doc", status: "Active" },
    { id: 3, name: "Employee_Handbook.pdf", size: "3.5MB", date: "2 weeks ago", type: "pdf", status: "Active" },
    { id: 4, name: "Product_Catalog.pdf", size: "5.0MB", date: "1 month ago", type: "pdf", status: "Active" },
    { id: 5, name: "Safety_Procedures.docx", size: "500KB", date: "1 month ago", type: "doc", status: "Archived" },
    { id: 6, name: "Marketing_Plan.pptx", size: "8.2MB", date: "2 months ago", type: "ppt", status: "Active" },
    { id: 7, name: "Customer_Service_Scripts.docx", size: "800KB", date: "3 months ago", type: "doc", status: "Active" },
    { id: 8, name: "Technical_Specs.pdf", size: "1.2MB", date: "3 months ago", type: "pdf", status: "Active" },
    { id: 9, name: "Meeting_Minutes_Oct.docx", size: "150KB", date: "4 months ago", type: "doc", status: "Archived" },
    { id: 10, name: "Financial_Report_Q2.xlsx", size: "200KB", date: "5 months ago", type: "xls", status: "Confidential" },
    { id: 11, name: "Onboarding_Checklist.pdf", size: "300KB", date: "6 months ago", type: "pdf", status: "Active" },
    { id: 12, name: "Brand_Guidelines.pdf", size: "10MB", date: "1 year ago", type: "pdf", status: "Active" },
    { id: 13, name: "Training_Video_1.mp4", size: "150MB", date: "1 year ago", type: "video", status: "Active" },
    { id: 14, name: "Logo_Pack.zip", size: "25MB", date: "1 year ago", type: "archive", status: "Active" },
    { id: 15, name: "Legal_Contracts.pdf", size: "1.5MB", date: "2 years ago", type: "pdf", status: "Confidential" },
];

// Expanded Mock Data - Web
const MOCK_WEB = [
    { id: 1, name: "Website FAQs", url: "company.com/faq", status: "Synced" },
    { id: 2, name: "Contact Page", url: "company.com/contact", status: "Synced" },
    { id: 3, name: "About Us", url: "company.com/about", status: "Synced" },
    { id: 4, name: "Services Overview", url: "company.com/services", status: "Pending" },
    { id: 5, name: "Pricing Page", url: "company.com/pricing", status: "Synced" },
    { id: 6, name: "Blog: Industry Trends", url: "company.com/blog/trends", status: "Synced" },
    { id: 7, name: "Blog: Tips & Tricks", url: "company.com/blog/tips", status: "Synced" },
    { id: 8, name: "Support Portal", url: "support.company.com", status: "Error" },
    { id: 9, name: "Careers Page", url: "company.com/careers", status: "Synced" },
    { id: 10, name: "Terms of Service", url: "company.com/terms", status: "Synced" },
    { id: 11, name: "Privacy Policy", url: "company.com/privacy", status: "Synced" },
    { id: 12, name: "Case Studies", url: "company.com/case-studies", status: "Pending" },
    { id: 13, name: "Team Bios", url: "company.com/team", status: "Synced" },
    { id: 14, name: "Landing Page A", url: "company.com/promo-a", status: "Inactive" },
    { id: 15, name: "Landing Page B", url: "company.com/promo-b", status: "Inactive" },
];

function KnowledgeSection({ title, icon: Icon, data, type, openWizard }) {
    const [view, setView] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 11;

    // Filter & Sort Logic
    const filteredData = data
        .filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.url && item.url.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .filter(item => {
            if (type === 'library') {
                if (filterType === 'all') return true;
                return item.type === filterType;
            } else {
                if (filterStatus === 'all') return true;
                return item.status === filterStatus;
            }
        })
        .sort((a, b) => {
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
    }, [searchQuery, filterType, filterStatus, sortBy, view]);

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
                            placeholder={type === 'library' ? "Search documents..." : "Search web pages..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-9 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                        {type === 'library' && (
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="w-[130px] h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="pdf">PDF</SelectItem>
                                    <SelectItem value="doc">DOC/DOCX</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                        {type === 'web' && (
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-[130px] h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Synced">Synced</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
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
                    {/* Add Button - Always Visible on Grid */}
                    <button onClick={() => openWizard('document')}
                        className="hidden md:flex border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all min-h-[240px] group">
                        <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6 text-blue-500" />
                        </div>
                        <span className="font-medium">{type === 'library' ? 'Upload Document' : 'Add Web Source'}</span>
                    </button>

                    {paginatedData.map(item => (
                        <Card key={item.id} className="p-6 group hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col h-full min-h-[240px] dark:bg-slate-900 dark:border-slate-800">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                                    {type === 'library' ? <FileText className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                                </div>
                                <div className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 cursor-pointer">
                                    <Settings className="w-4 h-4" />
                                </div>
                            </div>
                            <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1">{item.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {type === 'library' ? `${item.date} • ${item.size}` : item.url}
                            </p>
                            <div className="mt-auto pt-4 flex gap-2">
                                <Badge variant={item.status === 'Synced' || item.status === 'Active' ? 'success' : 'outline'}>{item.status}</Badge>
                            </div>
                        </Card>
                    ))}

                    {/* Mobile Add Button - Always Visible on Grid */}
                    <div className="md:hidden">
                        <button onClick={() => openWizard('document')}
                            className="w-full flex items-center justify-center p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium gap-2">
                            <Plus className="w-5 h-5" /> {type === 'library' ? 'Upload Document' : 'Add Web Source'}
                        </button>
                    </div>
                </div>
            )}

            {/* Table View */}
            {view === 'table' && (
                <div className="hidden md:block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <div className="col-span-4">Name</div>
                        <div className="col-span-5">{type === 'library' ? 'Details' : 'URL'}</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {currentPage === 1 && (
                            <div onClick={() => openWizard('document')} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                                <div className="col-span-12 flex items-center gap-3 text-slate-500 font-medium group-hover:text-blue-600">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                    {type === 'library' ? 'Upload Document' : 'Add Web Source'}
                                </div>
                            </div>
                        )}
                        {paginatedData.map(item => (
                            <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => openWizard('document')}>
                                <div className="col-span-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                    {type === 'library' ? <FileText className="w-4 h-4 text-slate-400" /> : <Globe className="w-4 h-4 text-slate-400" />}
                                    {item.name}
                                </div>
                                <div className="col-span-5 text-sm text-slate-500 dark:text-slate-400 truncate">
                                    {type === 'library' ? `${item.date} • ${item.size}` : item.url}
                                </div>
                                <div className="col-span-2">
                                    <Badge variant={item.status === 'Synced' || item.status === 'Active' ? 'success' : 'outline'}>{item.status}</Badge>
                                </div>
                                <div className="col-span-1 text-right">
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
                            <button onClick={() => openWizard('document')}
                                className="w-full flex items-center justify-center p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium gap-2">
                                <Plus className="w-5 h-5" /> {type === 'library' ? 'Upload Document' : 'Add Web Source'}
                            </button>
                        )}
                        {paginatedData.map(item => (
                            <div key={item.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm" onClick={() => openWizard('document')}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</h3>
                                    <Badge variant={item.status === 'Synced' || item.status === 'Active' ? 'success' : 'outline'} className="text-[10px] h-5">{item.status}</Badge>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {type === 'library' ? `${item.date} • ${item.size}` : item.url}
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

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-4 md:px-8 md:py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 shrink-0">
                <div className="flex items-start gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/overview')} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 mt-1 shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Knowledge Base</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage documents, PDFs, and website data.</p>
                    </div>
                </div>
                <Button onClick={() => openWizard('document')} className="w-full md:w-auto">
                    <UploadCloud className="w-4 h-4 mr-2" /> Add Document
                </Button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto w-full space-y-12">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    <KnowledgeSection
                        title="Library (Files)"
                        icon={FileText}
                        data={MOCK_DOCS}
                        type="library"
                        openWizard={openWizard}
                    />

                    <KnowledgeSection
                        title="Web Sources"
                        icon={Globe}
                        data={MOCK_WEB}
                        type="web"
                        openWizard={openWizard}
                    />
                </div>
            </div>
        </div>
    );
}
