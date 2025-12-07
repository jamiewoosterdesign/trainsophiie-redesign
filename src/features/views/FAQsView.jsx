import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, MessageCircle, Edit2, Trash2, HelpCircle, ArrowLeft, Search, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
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
const MOCK_FAQS = [
    { id: 1, question: 'What are your opening hours?', answer: 'We are open Monday to Friday from 9am to 5pm, and Saturdays from 10am to 2pm. We are closed on Sundays and public holidays.' },
    { id: 2, question: 'Do you offer free quotes?', answer: 'Yes, we provide free, no-obligation quotes for all our services. You can request one online or over the phone.' },
    { id: 3, question: 'How long does a service take?', answer: 'A standard service typically takes between 45 to 60 minutes, depending on the complexity of the issue.' },
    { id: 4, question: 'What payment methods do you accept?', answer: 'We accept cash, credit cards (Visa, Mastercard), and bank transfers.' },
    { id: 5, question: 'Do you provide warranties?', answer: 'Yes, all our services come with a 30-day satisfaction guarantee and a 1-year warranty on parts.' },
    { id: 6, question: 'Can I cancel my booking?', answer: 'You can cancel your booking up to 24 hours in advance without any cancellation fee.' },
    { id: 7, question: 'Are your staff insured?', answer: 'Yes, all our staff members are fully insured and bonded for your peace of mind.' },
    { id: 8, question: 'Do you offer emergency services?', answer: 'Yes, we have a 24/7 emergency hotline for urgent issues that cannot wait until business hours.' },
    { id: 9, question: 'How can I contact support?', answer: 'You can reach our support team via email at support@company.com or by calling our main line.' },
    { id: 10, question: 'Do you have a loyalty program?', answer: 'Yes, we offer a loyalty program where you earn points for every service booked.' },
    { id: 11, question: 'What areas do you serve?', answer: 'We serve the entire metropolitan area and surrounding suburbs within a 50km radius.' },
    { id: 12, question: 'How do I track my request?', answer: 'You will receive an SMS and email with a tracking link once your request has been assigned.' },
    { id: 13, question: 'Is my data secure?', answer: 'We take data security seriously and use industry-standard encryption to protect your personal information.' },
    { id: 14, question: 'Can I reschedule my appointment?', answer: 'Yes, you can reschedule your appointment online or by calling us, subject to availability.' },
    { id: 15, question: 'Do you do commercial work?', answer: 'Yes, we provide services for both residential and commercial properties.' },
];

export default function FAQsView() {
    const { openWizard, startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();

    const [view, setView] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 11;

    // Filter & Sort Logic
    const filteredFAQs = MOCK_FAQS
        .filter(faq =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            // Sort by question name (A-Z)
            return a.question.localeCompare(b.question);
        });

    // Pagination Logic
    const totalPages = Math.max(1, Math.ceil(filteredFAQs.length / ITEMS_PER_PAGE));
    const paginatedFAQs = filteredFAQs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset page
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortBy, view]);

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-4 md:px-8 md:py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 shrink-0">
                <div className="flex items-start gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/overview')} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 mt-1 shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Train Sophiie to answer common customer questions.</p>
                    </div>
                </div>
                <Button onClick={() => openWizard('faq')} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" /> Add FAQ
                </Button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto w-full space-y-8">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    {/* Toolbar */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-slate-500" /> Question Bank
                            </h2>
                            <ViewToggle view={view} onViewChange={setView} />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Search questions..."
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
                                        <SelectItem value="name">Question (A-Z)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Grid View */}
                    {view === 'grid' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <button onClick={() => openWizard('faq')}
                                className="hidden md:flex border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all min-h-[240px] group">
                                <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Plus className="w-6 h-6 text-blue-500" />
                                </div>
                                <span className="font-medium">Add New FAQ</span>
                            </button>
                            {/* Mobile Add Button (Top) */}
                            {currentPage === 1 && (
                                <div className="md:hidden">
                                    <button onClick={() => openWizard('faq')}
                                        className="w-full flex items-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium gap-3 group">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Plus className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <span>Add New FAQ</span>
                                    </button>
                                </div>
                            )}
                            {paginatedFAQs.map(faq => (
                                <Card key={faq.id} className="p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group flex flex-col h-full min-h-[240px] dark:bg-slate-900 dark:border-slate-800">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                                            <MessageCircle className="w-5 h-5" />
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
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{faq.question}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-4 flex-grow">{faq.answer}</p>
                                </Card>
                            ))}


                        </div>
                    )}

                    {/* Table View */}
                    {view === 'table' && (
                        <div className="hidden md:block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                <div className="col-span-5">Question</div>
                                <div className="col-span-6">Answer</div>
                                <div className="col-span-1 text-right">Actions</div>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {currentPage === 1 && (
                                    <div onClick={() => openWizard('faq')} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                                        <div className="col-span-12 flex items-center gap-3 text-slate-500 font-medium group-hover:text-blue-600">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500">
                                                <Plus className="w-4 h-4" />
                                            </div>
                                            Add New FAQ
                                        </div>
                                    </div>
                                )}
                                {paginatedFAQs.map(faq => (
                                    <div key={faq.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group" onClick={() => openWizard('faq')}>
                                        <div className="col-span-5 font-medium text-slate-900 dark:text-white">{faq.question}</div>
                                        <div className="col-span-6 text-sm text-slate-500 dark:text-slate-400 truncate">{faq.answer}</div>
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
                                    <button onClick={() => openWizard('faq')}
                                        className="w-full flex items-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium gap-3 group">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Plus className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <span>Add New FAQ</span>
                                    </button>
                                )}
                                {paginatedFAQs.map(faq => (
                                    <div key={faq.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm" onClick={() => openWizard('faq')}>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">{faq.question}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{faq.answer}</p>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4">
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredFAQs.length)}</span> of <span className="font-medium">{filteredFAQs.length}</span> results
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
