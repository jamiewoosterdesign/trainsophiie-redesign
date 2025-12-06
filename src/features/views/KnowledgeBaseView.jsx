import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { UploadCloud, Plus, Settings, FileText, Globe, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_DOCS, MOCK_WEB } from '@/lib/mockData';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';

export default function KnowledgeBaseView() {
    const { openWizard, startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('library');

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-4 md:px-8 md:py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
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

            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-slate-950 relative">
                <div className="max-w-7xl mx-auto w-full">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    {/* Tabs */}
                    <div className="flex items-center gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-full">
                        <button
                            onClick={() => setActiveTab('library')}
                            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === 'library'
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                                }`}
                        >
                            <FileText className="w-4 h-4" /> Library (Files)
                        </button>
                        <button
                            onClick={() => setActiveTab('web')}
                            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === 'web'
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                                }`}
                        >
                            <Globe className="w-4 h-4" /> Web Sources
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">

                        {/* 1. Add New Card (Always First) */}
                        <button onClick={() => openWizard('document')}
                            className="hidden md:flex border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all min-h-[240px] group">
                            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6 text-blue-500" />
                            </div>
                            <span className="font-medium">{activeTab === 'library' ? 'Upload Document' : 'Add Web Source'}</span>
                        </button>

                        {/* 2. Content Cards */}
                        {activeTab === 'library' ? (
                            MOCK_DOCS.map(doc => (
                                <Card key={doc.id} className="p-6 group hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col h-full min-h-[240px] dark:bg-slate-900 dark:border-slate-800">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 cursor-pointer">
                                            <Settings className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1">{doc.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{doc.date} • {doc.size}</p>
                                    <div className="mt-auto pt-4 flex gap-2">
                                        <Badge variant="success">Active</Badge>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            MOCK_WEB.map(site => (
                                <Card key={site.id} className="p-6 group hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col h-full min-h-[240px] dark:bg-slate-900 dark:border-slate-800">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                                            <Globe className="w-5 h-5" />
                                        </div>
                                        <div className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 cursor-pointer">
                                            <Settings className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1">{site.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{site.url}</p>
                                    <div className="mt-auto pt-4 flex gap-2">
                                        <Badge variant="outline">Synced</Badge>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
