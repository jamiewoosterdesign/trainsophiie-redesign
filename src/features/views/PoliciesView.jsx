import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, FileText, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const MOCK_POLICIES = [
    { id: 1, title: 'Warranty', content: 'Our standard warranty covers manufacturing defects for 12 months from the date of purchase. This does not cover accidental damage or wear and tear.' },
    { id: 2, title: 'Cancellation Policy', content: 'Cancellations must be made at least 24 hours in advance to avoid a cancellation fee of $50.' },
];

export default function PoliciesView() {
    const { openWizard, startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <header className="bg-white border-b border-slate-100 px-4 py-4 md:px-8 md:py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
                <div className="flex items-start gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/overview')} className="text-slate-500 hover:text-slate-900 mt-1 shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Policies & Procedures</h1>
                        <p className="text-slate-500 text-sm mt-1">Define your business rules and standard operating procedures.</p>
                    </div>
                </div>
                <Button onClick={() => openWizard('policy')} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" /> Add Policy
                </Button>
            </header>
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 relative">
                <div className="max-w-7xl mx-auto w-full">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                        <button onClick={() => openWizard('policy')}
                            className="hidden md:flex border-2 border-dashed border-slate-300 rounded-xl p-6 flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 transition-all min-h-[240px] group">
                            <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6 text-blue-500" />
                            </div>
                            <span className="font-medium">Add New Policy</span>
                        </button>
                        {MOCK_POLICIES.map(policy => (
                            <Card key={policy.id} className="p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group flex flex-col h-full min-h-[240px]">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                                        <FileText className="w-5 h-5" />
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
                                <h3 className="font-bold text-lg text-slate-900 mb-2">{policy.title}</h3>
                                <p className="text-sm text-slate-500 line-clamp-4 flex-grow">{policy.content}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
