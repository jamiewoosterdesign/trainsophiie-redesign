import React, { useRef } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
    Briefcase, Wrench, Book, ListChecks, HelpCircle, ShieldAlert,
    Users, ArrowRightLeft, Bell, Tag,
    Mic, MessageSquare, Activity,
    ChevronRight, Mic2, ShoppingBag, Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';
import { SetupProgressTracker } from '@/components/shared/SetupProgressTracker';
import { ViewToggle } from '@/components/shared/ViewToggle';

const OverviewCard = ({ icon: Icon, title, description, status, link, colorClass, statusColor }) => {
    const navigate = useNavigate();
    const isComplete = status === 'Complete' || status === 'Services added' || status === 'Documents added' || status === 'Policy added' || status === 'Faqs added' || status === 'Team added';

    const iconColorClass = isComplete
        ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400";

    return (
        <Card className={`p-6 flex flex-col h-full hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group ${colorClass.includes('ring-') ? colorClass.split(' ').filter(c => c.startsWith('ring') || c.startsWith('shadow') || c.startsWith('scale') || c.startsWith('transition') || c.startsWith('duration')).join(' ') : ''}`} onClick={() => navigate(link)}>
            <div className="flex-1">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${iconColorClass}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{description}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                <div className="flex items-center gap-2">
                    <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${isComplete
                        ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                        : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                        }`}>
                        {status}
                    </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-300">
                    Edit <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
            </div>
        </Card>
    );
};

export default function OverviewView() {
    const { startGlobalVoiceFlow, voiceFlowStep } = useOutletContext();
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);
    const [viewMode, setViewMode] = React.useState('grid');
    const navigate = useNavigate();

    const sections = [
        {
            title: "Knowledge Base",
            items: [
                {
                    title: "Business Information",
                    description: "Logo, name, industry, working hours",
                    icon: Briefcase,
                    status: "Complete",
                    link: "/business-info",
                    colorClass: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
                    statusColor: "text-slate-900 dark:text-slate-200"
                },
                {
                    title: "Services",
                    description: "Core services offered",
                    icon: Wrench,
                    status: "Services added",
                    link: "/services",
                    colorClass: `bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 ${voiceFlowStep === 'OVERVIEW' ? 'ring-4 ring-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.4)] scale-105 transition-all duration-500' : ''}`,
                    statusColor: "text-slate-900 dark:text-slate-200"
                },
                {
                    title: "Products",
                    description: "Manage product catalog",
                    icon: ShoppingBag,
                    status: "Optional",
                    link: "/products",
                    colorClass: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
                    statusColor: "text-slate-500 dark:text-slate-400"
                },
                {
                    title: "Documents",
                    description: "PDFs and files Sophiie learns from.",
                    icon: Book,
                    status: "Documents added",
                    link: "/knowledge",
                    colorClass: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
                    statusColor: "text-slate-900 dark:text-slate-200"
                },
                {
                    title: "Policies & Procedures",
                    description: "Cancellations, payment terms, procedures",
                    icon: ListChecks,
                    status: "Policy added",
                    link: "/policies",
                    colorClass: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
                    statusColor: "text-slate-900 dark:text-slate-200"
                },
                {
                    title: "FAQs",
                    description: "Common questions Sophiie can answer",
                    icon: HelpCircle,
                    status: "Faqs added",
                    link: "/faqs",
                    colorClass: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
                    statusColor: "text-slate-900 dark:text-slate-200"
                },
                {
                    title: "Scenarios",
                    description: "For situations that aren't products, services or FAQs",
                    icon: ShieldAlert,
                    status: "Complete",
                    link: "/scenarios",
                    colorClass: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
                    statusColor: "text-slate-900 dark:text-slate-200"
                }
            ]
        },
        {
            title: "Team & Routing",
            items: [
                {
                    title: "Staff & Departments",
                    description: "Add staff contacts for routing",
                    icon: Users,
                    status: "Team added",
                    link: "/staff",
                    colorClass: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
                    statusColor: "text-slate-900 dark:text-slate-200"
                },
                {
                    title: "Transfers",
                    description: "Set up call transfer logic and parameters",
                    icon: ArrowRightLeft,
                    status: "Optional",
                    link: "/transfers",
                    colorClass: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
                    statusColor: "text-slate-500 dark:text-slate-400"
                },
                {
                    title: "Notifications",
                    description: "Set up SMS/email/push alerts",
                    icon: Bell,
                    status: "Complete",
                    link: "/notifications",
                    colorClass: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
                    statusColor: "text-slate-900 dark:text-slate-200"
                },
                {
                    title: "Tags",
                    description: "Organize or label conversations",
                    icon: Tag,
                    status: "Optional",
                    link: "/tags",
                    colorClass: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
                    statusColor: "text-slate-500 dark:text-slate-400"
                }
            ]
        },
        {
            title: "Personality",
            items: [
                {
                    title: "Voice & Personality",
                    description: "Choose voice, tone, attitude",
                    icon: Mic,
                    status: "Optional",
                    link: "/voice",
                    colorClass: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
                    statusColor: "text-slate-500 dark:text-slate-400"
                },
                {
                    title: "Greetings & Closings",
                    description: "Custom intro/outro lines for voice calls",
                    icon: MessageSquare,
                    status: "Complete",
                    link: "/greetings",
                    colorClass: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
                    statusColor: "text-slate-900 dark:text-slate-200"
                },
                {
                    title: "Interruption & Speed",
                    description: "How Sophie handles interruptions and speaking pace",
                    icon: Activity,
                    status: "Optional",
                    link: "/behaviors",
                    colorClass: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
                    statusColor: "text-slate-500 dark:text-slate-400"
                }
            ]
        }
    ];

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <PageHeader
                title="Overview"
                subtitle="Welcome to your Sophiie dashboard."
                scrollDirection={scrollDirection}
                showBackButton={false}
                icon={
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                        <Bot className="w-6 h-6" />
                    </div>
                }
            />
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto w-full space-y-10">

                    {/* Hero Banner */}
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    {/* Setup Progress Tracker */}
                    <SetupProgressTracker />

                    {/* Sections */}
                    {sections.map((section, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
                            <div className="flex flex-row justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{section.title}</h2>
                                <ViewToggle
                                    view={viewMode}
                                    onViewChange={setViewMode}
                                />
                            </div>
                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {section.items.map((item, itemIdx) => (
                                        <OverviewCard key={itemIdx} {...item} />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {section.items.map((item, itemIdx) => {
                                            const Icon = item.icon;
                                            const isComplete = item.status === 'Complete' || item.status === 'Services added' || item.status === 'Documents added' || item.status === 'Policy added' || item.status === 'Faqs added' || item.status === 'Team added';
                                            const iconColorClass = isComplete
                                                ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                                                : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400";

                                            return (
                                                <div
                                                    key={itemIdx}
                                                    onClick={() => navigate(item.link)}
                                                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                                                >
                                                    <div className="col-span-1">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColorClass}`}>
                                                            <Icon className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                    <div className="col-span-3 font-bold text-slate-900 dark:text-white">
                                                        {item.title}
                                                    </div>
                                                    <div className="col-span-6 text-sm text-slate-500 dark:text-slate-400">
                                                        {item.description}
                                                    </div>
                                                    <div className="col-span-2 text-right flex items-center justify-end gap-3">
                                                        <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${isComplete
                                                            ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                                            : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                                                            }`}>
                                                            {item.status}
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
