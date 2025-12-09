import React, { useRef } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plug2, Sparkles, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';

const MOCK_INTEGRATIONS = [
    { id: 1, name: 'Google Calendar', description: 'Sync appointments and availability in real-time.', icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, status: 'active', connected: true },
    { id: 2, name: 'Salesforce', description: 'Create leads and log calls automatically.', icon: <Plug2 className="w-5 h-5 text-blue-500" />, status: 'inactive', connected: false },
    { id: 3, name: 'Stripe', description: 'Process payments and handle medical deposits securely.', icon: <Plug2 className="w-5 h-5 text-purple-500" />, status: 'inactive', connected: false },
    { id: 4, name: 'Slack', description: 'Send team notifications for urgent escalations.', icon: <Plug2 className="w-5 h-5 text-orange-500" />, status: 'inactive', connected: false },
];

export default function IntegrationsView() {
    const { startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <PageHeader
                title="Integrations"
                subtitle="Connect Sophiie to your existing tools."
                scrollDirection={scrollDirection}
            />
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-slate-950 relative">
                <div className="max-w-7xl mx-auto w-full">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                        <Plug2 className="w-5 h-5 text-slate-500" /> Available Integrations
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MOCK_INTEGRATIONS.map(integration => (
                            <Card key={integration.id} className="p-6 hover:shadow-md transition-all group dark:bg-slate-900 dark:border-slate-800">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                                        {integration.icon}
                                    </div>
                                    <Badge variant={integration.connected ? "success" : "outline"} className={integration.connected ? "" : "text-slate-500 dark:text-slate-400 dark:border-slate-700"}>
                                        {integration.connected ? 'Connected' : 'Not Connected'}
                                    </Badge>
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{integration.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{integration.description}</p>
                                <Button
                                    variant={integration.connected ? "outline" : "default"}
                                    className={`w-full ${integration.connected ? 'dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700' : ''}`}
                                >
                                    {integration.connected ? 'Manage Settings' : 'Connect'}
                                </Button>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
