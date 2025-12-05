import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Plus, Settings, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';

export default function TransfersView() {
    const { openWizard, openSettings, startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <header className="bg-white border-b border-slate-100 px-4 py-4 md:px-8 md:py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
                <div className="w-full md:w-auto flex justify-between items-start">
                    <div className="flex items-start gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/overview')} className="text-slate-500 hover:text-slate-900 mt-1 shrink-0">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-slate-900">Transfers Configuration</h1>
                            <p className="text-slate-500 text-sm mt-1">Manage call transfer rules.</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={openSettings} className="md:hidden text-slate-400 hover:text-slate-600">
                        <Settings className="w-5 h-5" />
                    </Button>
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <Button variant="outline" onClick={openSettings} className="hidden md:flex w-full md:w-auto">
                        <Settings className="w-4 h-4 mr-2" /> Global Settings
                    </Button>
                    <Button onClick={() => openWizard('transfer')} className="w-full md:w-auto">
                        <Plus className="w-4 h-4 mr-2" /> Add Rule
                    </Button>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 relative">
                <div className="max-w-7xl mx-auto w-full">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                        <button onClick={() => openWizard('transfer')}
                            className="hidden md:flex border-2 border-dashed border-slate-300 rounded-xl p-6 flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 transition-all min-h-[240px] group">
                            <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6 text-blue-500" />
                            </div>
                            <span className="font-medium">Add Transfer Rule</span>
                        </button>
                        <Card className="p-6 hover:shadow-md transition-all cursor-pointer hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                                    <Users className="w-5 h-5" />
                                </div>
                                <Badge variant="warning">Warm</Badge>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-1">Sales Dept</h3>
                            <p className="text-sm text-slate-500 mb-4">When someone wants to speak to sales.</p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
