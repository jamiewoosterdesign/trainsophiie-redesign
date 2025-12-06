import React, { useState } from 'react';
import { Bell, UserPlus, ArrowLeft, Mail, MessageSquare, Phone, Globe, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useNavigate, useOutletContext } from 'react-router-dom';
import AssignTeamMemberModal from '@/components/modals/AssignTeamMemberModal';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';

const MOCK_ASSIGNMENTS = [
    {
        id: 1,
        member: 'Sarah Wilson',
        methods: ['sms', 'email'],
        tags: ['VIP', 'Urgent'],
        sources: ['call', 'sms'],
        enabled: true
    },
    {
        id: 2,
        member: 'Mike Johnson',
        methods: ['email'],
        tags: ['New Customer'],
        sources: ['webform'],
        enabled: true
    },
    {
        id: 3,
        member: 'Emily Davis',
        methods: ['sms'],
        tags: ['Support'],
        sources: ['chatbot', 'email'],
        enabled: false
    },
];

export default function NotificationsView() {
    const navigate = useNavigate();
    const { startGlobalVoiceFlow } = useOutletContext();
    const [showAssignModal, setShowAssignModal] = useState(false);

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-4 md:px-8 md:py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
                <div className="flex items-start gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/overview')} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 mt-1 shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage team notifications and assignments.</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button onClick={() => setShowAssignModal(true)} className="w-full sm:w-auto">
                        <UserPlus className="w-4 h-4 mr-2" /> Assign New Team Member
                    </Button>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto w-full space-y-8">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    <div>
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-slate-500" /> Notifications Settings
                        </h2>

                        <div className="grid gap-4">
                            {MOCK_ASSIGNMENTS.map((assignment) => (
                                <Card key={assignment.id} className="p-6 transition-all hover:shadow-md group dark:bg-slate-900 dark:border-slate-800">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                                        {/* Member Info & Controls */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2 md:mb-0">
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{assignment.member}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-sm text-slate-500 dark:text-slate-400">Notified via:</span>
                                                        <div className="flex gap-1">
                                                            {assignment.methods.includes('sms') && <Badge variant="secondary" className="gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"><MessageSquare className="w-3 h-3" /> SMS</Badge>}
                                                            {assignment.methods.includes('email') && <Badge variant="secondary" className="gap-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50"><Mail className="w-3 h-3" /> Email</Badge>}
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Controls visible on mobile always, desktop on group hover/always? User said edit/delete on hover. Toggle always. */}
                                                <div className="flex items-center gap-4 md:hidden">
                                                    <Switch checked={assignment.enabled} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tags & Sources */}
                                        <div className="flex-1 flex flex-col md:flex-row gap-6 md:items-center">
                                            <div className="flex-1">
                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tags</p>
                                                <div className="flex gap-2 flex-wrap">
                                                    {assignment.tags.map(tag => (
                                                        <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-medium border border-slate-200 dark:border-slate-700">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex-1 md:border-l md:border-slate-100 dark:md:border-slate-800 md:pl-6">
                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Sources</p>
                                                <div className="flex gap-2 flex-wrap text-slate-600 dark:text-slate-400">
                                                    {assignment.sources.map(source => (
                                                        <div key={source} className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 px-2 py-1 rounded text-xs">
                                                            {source === 'call' && <Phone className="w-3 h-3" />}
                                                            {source === 'webform' && <Globe className="w-3 h-3" />}
                                                            {source === 'chatbot' && <MessageSquare className="w-3 h-3" />}
                                                            {source === 'sms' && <MessageSquare className="w-3 h-3" />}
                                                            {source === 'email' && <Mail className="w-3 h-3" />}
                                                            <span className="capitalize">{source}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Desktop Controls */}
                                        <div className="hidden md:flex items-center gap-4 pl-4 border-l border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <Switch checked={assignment.enabled} />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showAssignModal && (
                <AssignTeamMemberModal onClose={() => setShowAssignModal(false)} />
            )}
        </div>
    );
}
