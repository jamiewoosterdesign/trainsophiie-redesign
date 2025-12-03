import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
    Briefcase, Wrench, Book, ListChecks, HelpCircle, ShieldAlert,
    Users, ArrowRightLeft, Bell, Tag,
    Mic, MessageSquare, Activity,
    CheckCircle, ChevronRight, Mic2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const OverviewCard = ({ icon: Icon, title, description, status, link, colorClass, statusColor }) => {
    const navigate = useNavigate();

    return (
        <Card className={`p-6 flex flex-col h-full hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group ${colorClass.includes('ring-') ? colorClass.split(' ').filter(c => c.startsWith('ring') || c.startsWith('shadow') || c.startsWith('scale') || c.startsWith('transition') || c.startsWith('duration')).join(' ') : ''}`} onClick={() => navigate(link)}>
            <div className="flex-1">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${colorClass.split(' ').filter(c => !c.startsWith('ring') && !c.startsWith('shadow') && !c.startsWith('scale') && !c.startsWith('transition') && !c.startsWith('duration')).join(' ')}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">{title}</h3>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">{description}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                <div className="flex items-center gap-2">
                    {status === 'Complete' || status === 'Services added' || status === 'Documents added' || status === 'Policy added' || status === 'Faqs added' || status === 'Team added' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                        <CheckCircle className="w-4 h-4 text-slate-300" />
                    )}
                    <span className={`text-xs font-medium ${statusColor || 'text-slate-600'}`}>{status}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-400 hover:text-slate-900">
                    Edit <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
            </div>
        </Card>
    );
};

export default function OverviewView() {
    const { startGlobalVoiceFlow, voiceFlowStep } = useOutletContext();
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
                    colorClass: "bg-blue-50 text-blue-600",
                    statusColor: "text-slate-900"
                },
                {
                    title: "Services",
                    description: "Core services offered",
                    icon: Wrench,
                    status: "Services added",
                    link: "/services",
                    colorClass: `bg-green-50 text-green-600 ${voiceFlowStep === 'OVERVIEW' ? 'ring-4 ring-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.4)] scale-105 transition-all duration-500' : ''}`,
                    statusColor: "text-slate-900"
                },
                {
                    title: "Documents",
                    description: "PDFs and files Sophiie learns from.",
                    icon: Book,
                    status: "Documents added",
                    link: "/knowledge",
                    colorClass: "bg-orange-50 text-orange-600",
                    statusColor: "text-slate-900"
                },
                {
                    title: "Policies & Procedures",
                    description: "Cancellations, payment terms, procedures",
                    icon: ListChecks,
                    status: "Policy added",
                    link: "/policies",
                    colorClass: "bg-slate-100 text-slate-600",
                    statusColor: "text-slate-900"
                },
                {
                    title: "FAQs",
                    description: "Common questions Sophiie can answer",
                    icon: HelpCircle,
                    status: "Faqs added",
                    link: "/faqs",
                    colorClass: "bg-emerald-50 text-emerald-600",
                    statusColor: "text-slate-900"
                },
                {
                    title: "Scenarios",
                    description: "For situations that aren't products, services or FAQs",
                    icon: ShieldAlert,
                    status: "Complete",
                    link: "/scenarios",
                    colorClass: "bg-emerald-50 text-emerald-600",
                    statusColor: "text-slate-900"
                }
            ]
        },
        {
            title: "Team & Routing",
            items: [
                {
                    title: "Team",
                    description: "Add staff contacts for routing",
                    icon: Users,
                    status: "Team added",
                    link: "/staff",
                    colorClass: "bg-green-50 text-green-600",
                    statusColor: "text-slate-900"
                },
                {
                    title: "Transfers",
                    description: "Set up call transfer logic and parameters",
                    icon: ArrowRightLeft,
                    status: "Optional",
                    link: "/transfers",
                    colorClass: "bg-blue-50 text-blue-600",
                    statusColor: "text-slate-500"
                },
                {
                    title: "Notifications",
                    description: "Set up SMS/email/push alerts",
                    icon: Bell,
                    status: "Complete",
                    link: "/notifications",
                    colorClass: "bg-green-50 text-green-600",
                    statusColor: "text-slate-900"
                },
                {
                    title: "Tags",
                    description: "Organize or label conversations",
                    icon: Tag,
                    status: "Optional",
                    link: "/tags",
                    colorClass: "bg-blue-50 text-blue-600",
                    statusColor: "text-slate-500"
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
                    colorClass: "bg-blue-50 text-blue-600",
                    statusColor: "text-slate-500"
                },
                {
                    title: "Greetings & Closings",
                    description: "Custom intro/outro lines for voice calls",
                    icon: MessageSquare,
                    status: "Complete",
                    link: "/greetings",
                    colorClass: "bg-green-50 text-green-600",
                    statusColor: "text-slate-900"
                },
                {
                    title: "Interruption & Speed",
                    description: "How Sophie handles interruptions and speaking pace",
                    icon: Activity,
                    status: "Optional",
                    link: "/behaviors",
                    colorClass: "bg-blue-50 text-blue-600",
                    statusColor: "text-slate-500"
                }
            ]
        }
    ];

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300 overflow-y-auto bg-slate-50/50">
            <div className="p-8 max-w-7xl mx-auto w-full space-y-10">

                {/* Hero Banner */}
                <div className="rounded-2xl bg-gradient-to-r from-[#1e1b4b] to-[#4c1d95] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Let's Train Sophiie.</h1>
                        <p className="text-blue-100 text-lg mb-8 leading-relaxed opacity-90">
                            Your AI receptionist learns directly from your business data. You can guide her setup instantly with your voice or upload your existing documents to get started.
                        </p>
                        <Button onClick={startGlobalVoiceFlow} className="bg-white text-[#4c1d95] hover:bg-blue-50 border-none font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                            <Mic2 className="w-4 h-4 mr-2" /> Guided Voice Setup
                        </Button>
                    </div>

                    {/* Decorative background elements to match the feel */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                </div>

                {/* Sections */}
                {sections.map((section, idx) => (
                    <div key={idx}>
                        <h2 className="text-lg font-bold text-slate-900 mb-6">{section.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {section.items.map((item, itemIdx) => (
                                <OverviewCard key={itemIdx} {...item} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
