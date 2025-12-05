import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, MessageCircle, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const MOCK_FAQS = [
    { id: 1, question: 'What are your opening hours?', answer: 'We are open Monday to Friday from 9am to 5pm, and Saturdays from 10am to 2pm. We are closed on Sundays and public holidays.' },
    { id: 2, question: 'Do you offer free quotes?', answer: 'Yes, we provide free, no-obligation quotes for all our services. You can request one online or over the phone.' },
    { id: 3, question: 'How long does a service take?', answer: 'A standard service typically takes between 45 to 60 minutes, depending on the complexity of the issue.' },
];

export default function FAQsView() {
    const { openWizard, startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <header className="bg-white border-b border-slate-100 px-4 py-4 md:px-8 md:py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/overview')} className="text-slate-500 hover:text-slate-900">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Frequently Asked Questions</h1>
                        <p className="text-slate-500 text-sm mt-1">Train Sophiie to answer common customer questions.</p>
                    </div>
                </div>
                <Button onClick={() => openWizard('faq')} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" /> Add FAQ
                </Button>
            </header>
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 relative">
                <div className="max-w-7xl mx-auto w-full">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                        <button onClick={() => openWizard('faq')}
                            className="hidden md:flex border-2 border-dashed border-slate-300 rounded-xl p-6 flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 transition-all min-h-[240px] group">
                            <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6 text-blue-500" />
                            </div>
                            <span className="font-medium">Add New FAQ</span>
                        </button>
                        {MOCK_FAQS.map(faq => (
                            <Card key={faq.id} className="p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group flex flex-col h-full min-h-[240px]">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                                        <MessageCircle className="w-5 h-5" />
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-2">{faq.question}</h3>
                                <p className="text-sm text-slate-500 line-clamp-4 flex-grow">{faq.answer}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
