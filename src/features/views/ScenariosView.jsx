import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, ShieldAlert, Trash2, ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MOCK_SCENARIOS } from '@/lib/mockData';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';

export default function ScenariosView() {
    const { openWizard, startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <header className="bg-white border-b border-slate-100 px-4 py-4 md:px-8 md:py-5 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
                <div className="flex items-start gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/overview')} className="text-slate-500 hover:text-slate-900 mt-1 shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Scenarios & Restrictions</h1>
                        <p className="text-slate-500 text-sm mt-1">Define handling rules for refunds, complaints, and general inquiries.</p>
                    </div>
                </div>
                <Button onClick={() => openWizard('protocol')} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" /> Add Scenario
                </Button>
            </header>
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 relative">
                <div className="max-w-7xl mx-auto w-full space-y-8">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Scenarios</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <button onClick={() => openWizard('protocol')}
                                className="hidden md:flex border-2 border-dashed border-slate-300 rounded-xl p-5 flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 transition-all min-h-[240px]">
                                <Plus className="w-5 h-5 mb-2" />
                                <span className="text-sm font-medium">Create Scenario</span>
                            </button>
                            {MOCK_SCENARIOS.map(proto => (
                                <Card key={proto.id} className="p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col h-full min-h-[240px]">
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge variant="default" className="bg-indigo-50 text-indigo-600 border-indigo-100">If / Then</Badge>
                                    </div>
                                    <h4 className="font-bold text-lg text-slate-900 mb-1">{proto.name}</h4>
                                    <p className="text-sm text-slate-500 mb-4 flex-grow">Trigger: {proto.trigger}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 mt-auto">
                                        <ArrowRight className="w-3 h-3 text-slate-400" />
                                        <span>{proto.action}</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Global Restrictions & Guardrails */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Restrictions</h3>
                        <Card className="p-6">
                            <p className="text-sm text-slate-500 mb-6">Define strict limits for the AI (Negative Constraints). These apply to every call.</p>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                        <div className="text-sm text-slate-700">
                                            <span className="font-bold text-slate-600 uppercase text-xs mr-2">Sophiie Must Never</span>
                                            Quote specific pricing unless explicitly listed in Services.
                                        </div>
                                    </div>
                                    <button className="text-slate-400 hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                        <div className="text-sm text-slate-700">
                                            <span className="font-bold text-slate-600 uppercase text-xs mr-2">Sophiie Must Never</span>
                                            Promise specific arrival times (give 2hr windows only).
                                        </div>
                                    </div>
                                    <button className="text-slate-400 hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 pt-3 mt-2 border-t border-slate-100">
                                    <div className="flex-1 relative">
                                        <span className="absolute left-3 top-3 text-slate-500 font-bold text-xs select-none uppercase">Never</span>
                                        <Input className="pl-14" placeholder="e.g. discuss politics or religion..." />
                                    </div>
                                    <Button variant="danger">Add Restriction</Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
