import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { UploadCloud, Plus, Settings, FileText, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_DOCS, MOCK_WEB } from '@/lib/mockData';

export default function KnowledgeBaseView() {
    const { openWizard } = useOutletContext();
    const [activeTab, setActiveTab] = useState('library');

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <header className="bg-white border-b border-slate-100 px-8 py-5 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Knowledge Base</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage documents, PDFs, and website data.</p>
                </div>
                <Button onClick={() => openWizard('document')}>
                    <UploadCloud className="w-4 h-4 mr-2" /> Add Document
                </Button>
            </header>

            {/* Tabs */}
            <div className="px-8 pt-4 pb-0 border-b border-slate-100 flex gap-6">
                <button onClick={() => setActiveTab('library')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'library' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Library (Files)
                </button>
                <button onClick={() => setActiveTab('web')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'web' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Web Sources
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                    {/* 1. Add New Card (Always First) */}
                    <button onClick={() => openWizard('document')}
                        className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 transition-all min-h-[200px] group">
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6 text-blue-500" />
                        </div>
                        <span className="font-medium">{activeTab === 'library' ? 'Upload Document' : 'Add Web Source'}</span>
                    </button>

                    {/* 2. Content Cards */}
                    {activeTab === 'library' ? (
                        MOCK_DOCS.map(doc => (
                            <Card key={doc.id} className="p-6 relative group hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                                <div className="absolute top-4 right-4 text-slate-300 group-hover:text-slate-500 cursor-pointer">
                                    <Settings className="w-4 h-4" />
                                </div>
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${doc.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                    <FileText className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-slate-800 line-clamp-1">{doc.name}</h3>
                                <p className="text-xs text-slate-500 mt-1">{doc.date} • {doc.size}</p>
                                <div className="mt-4 flex gap-2">
                                    <Badge variant="success">Active</Badge>
                                </div>
                            </Card>
                        ))
                    ) : (
                        MOCK_WEB.map(site => (
                            <Card key={site.id} className="p-6 relative group hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                                <div className="absolute top-4 right-4 text-slate-300 group-hover:text-slate-500 cursor-pointer">
                                    <Settings className="w-4 h-4" />
                                </div>
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center mb-4">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-slate-800 line-clamp-1">{site.name}</h3>
                                <p className="text-xs text-slate-500 mt-1">{site.url}</p>
                                <div className="mt-4 flex gap-2">
                                    <Badge variant="outline">Synced</Badge>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
