import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Clock, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_SERVICES } from '@/lib/mockData';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { CategorySelector } from '@/components/shared/CategorySelector';

export default function ServicesView() {
    const { openWizard, voiceFlowStep, startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <header className="bg-white border-b border-slate-100 px-4 py-4 md:px-8 md:py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
                <div className="flex items-start gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/overview')} className="text-slate-500 hover:text-slate-900 mt-1 shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Services Configuration</h1>
                        <p className="text-slate-500 text-sm mt-1">Teach Sophiie what services you offer.</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <CategorySelector onSelect={(cat) => console.log('Selected category:', cat)} />
                    <Button onClick={() => openWizard('service')} className="w-full md:w-auto">
                        <Plus className="w-4 h-4 mr-2" /> Add Service
                    </Button>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 relative">
                <div className="max-w-7xl mx-auto w-full">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                        <button onClick={() => openWizard('service')}
                            className={`hidden md:flex border-2 border-dashed border-slate-300 rounded-xl p-6 flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 transition-all min-h-[240px] group ${voiceFlowStep === 'SERVICES' ? 'ring-[8px] ring-purple-400/50 shadow-[0_0_40px_rgba(168,85,247,0.3)] scale-105 border-purple-500 bg-purple-50/30' : ''}`}>
                            <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6 text-blue-500" />
                            </div>
                            <span className="font-medium">Create New Service</span>
                        </button>
                        {MOCK_SERVICES.map(service => (
                            <Card key={service.id} className="p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">{service.icon}</div>
                                    {service.active && <Badge variant="success">Active</Badge>}
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-1">{service.name}</h3>
                                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{service.desc}</p>
                                <div className="flex items-center justify-between text-sm text-slate-400 pt-4 border-t border-slate-100">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {service.time}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Share2 className="w-3 h-3" /> {service.action}
                                    </span>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
