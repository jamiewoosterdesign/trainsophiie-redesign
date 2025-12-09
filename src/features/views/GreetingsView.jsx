import React, { useState, useRef } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Phone, MessageCircle, Play, Mic, Plus, Wand2, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';

export default function GreetingsView() {
    const { startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);
    const [activeTab, setActiveTab] = useState('phone');

    // State for Phone
    const [phoneGreeting, setPhoneGreeting] = useState("Hi, Thanks for calling Vision Electrical. You're speaking with Sophiie, an AI assistant. How can I help you today?");
    const [phoneClosing, setPhoneClosing] = useState("Thanks for calling Vision Electrical. Have a great day!");
    const [omitGreeting, setOmitGreeting] = useState(false);
    const [recordingDisclosure, setRecordingDisclosure] = useState(true);
    const [welcomeDelay, setWelcomeDelay] = useState(1);

    // State for Chatbot
    const [chatGreeting, setChatGreeting] = useState("Hi there! I'm Sophiie, the Vision Electrical AI assistant. How can I help you?");
    const [chatClosing, setChatClosing] = useState("Thanks for chatting with us. Goodbye!");

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            {/* Header */}
            {/* Header */}
            <PageHeader
                title="Greetings & Closings"
                subtitle="Manage how Sophiie starts and ends conversations."
                scrollDirection={scrollDirection}
            />

            {/* Main Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-slate-950 relative">
                <div className="max-w-7xl mx-auto w-full space-y-8">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    {/* Custom Tabs */}
                    <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex w-full mb-6">
                        <button
                            onClick={() => setActiveTab('phone')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'phone' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            <Phone className="w-4 h-4" /> Phone Calls
                        </button>
                        <button
                            onClick={() => setActiveTab('chatbot')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'chatbot' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            <MessageCircle className="w-4 h-4" /> Chatbot
                        </button>
                    </div>

                    {activeTab === 'phone' && (
                        <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                            <div className="flex flex-col gap-6">
                                {/* Greeting Section */}
                                <section className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                <MessageSquare className="w-5 h-5 text-slate-500" /> Greeting Message
                                            </h2>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">The first thing Sophiie says when answering a call.</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500 dark:text-slate-400">Omit greeting</span>
                                            <Switch checked={omitGreeting} onCheckedChange={setOmitGreeting} />
                                        </div>
                                    </div>
                                    <div className="relative mb-3 flex-1">
                                        <Textarea
                                            value={phoneGreeting}
                                            onChange={(e) => setPhoneGreeting(e.target.value)}
                                            className="min-h-[120px] text-base pb-10 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 h-full"
                                            disabled={omitGreeting}
                                        />
                                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Voice Input">
                                                <Mic className="w-4 h-4" />
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Generate with AI">
                                                <Wand2 className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2 animate-in fade-in mb-4">
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mr-1 mt-0.5">Vars:</span>
                                        {['{Customer First Name}', '{Customer Last Name}', '{Business Name}', '{Agent Name}'].map(v => (
                                            <Badge
                                                key={v}
                                                variant="outline"
                                                className="bg-white dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600 hover:border-blue-300 hover:text-blue-600 cursor-pointer transition-colors"
                                                onClick={() => setPhoneGreeting(phoneGreeting + ' ' + v)}
                                            >
                                                {v}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                        <Button size="sm" variant="secondary" className="gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700">
                                            <Play className="w-3 h-3" /> Preview Audio
                                        </Button>
                                        <Button size="sm" variant="outline" className="gap-2 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700">
                                            <Mic className="w-3 h-3" /> Record Custom
                                        </Button>
                                    </div>
                                </section>

                                {/* Closing Section */}
                                <section className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col">
                                    <div className="mb-4">
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <PhoneOff className="w-5 h-5 text-slate-500" /> Closing Message
                                        </h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">What Sophiie says before hanging up.</p>
                                    </div>
                                    <div className="relative mb-3 flex-1">
                                        <Textarea
                                            value={phoneClosing}
                                            onChange={(e) => setPhoneClosing(e.target.value)}
                                            className="min-h-[100px] text-base pb-10 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 h-full"
                                        />
                                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Voice Input">
                                                <Mic className="w-4 h-4" />
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Generate with AI">
                                                <Wand2 className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2 animate-in fade-in mb-4">
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mr-1 mt-0.5">Vars:</span>
                                        {['{Customer First Name}', '{Customer Last Name}', '{Business Name}', '{Agent Name}'].map(v => (
                                            <Badge
                                                key={v}
                                                variant="outline"
                                                className="bg-white dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600 hover:border-blue-300 hover:text-blue-600 cursor-pointer transition-colors"
                                                onClick={() => setPhoneClosing(phoneClosing + ' ' + v)}
                                            >
                                                {v}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                        <Button size="sm" variant="secondary" className="gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700">
                                            <Play className="w-3 h-3" /> Preview Audio
                                        </Button>
                                    </div>
                                </section>
                            </div>

                            {/* Additional Settings */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between">
                                    <div className="max-w-[80%]">
                                        <h3 className="font-bold text-slate-900 dark:text-white">Call Recording Disclosure</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Inform caller that the call is being recorded for quality assurance.</p>
                                    </div>
                                    <Switch checked={recordingDisclosure} onCheckedChange={setRecordingDisclosure} />
                                </section>

                                <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between">
                                    <div className="max-w-[70%]">
                                        <h3 className="font-bold text-slate-900 dark:text-white">Welcome Delay (Seconds)</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pause before Sophiie starts speaking.</p>
                                    </div>
                                    <div className="w-20">
                                        <Input
                                            type="number"
                                            value={welcomeDelay}
                                            onChange={(e) => setWelcomeDelay(e.target.value)}
                                            min={0}
                                            max={10}
                                            className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                        />
                                    </div>
                                </section>
                            </div>
                        </div>
                    )}

                    {activeTab === 'chatbot' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Chatbot Greeting */}
                                <section className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col">
                                    <div className="mb-4">
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <MessageSquare className="w-5 h-5 text-slate-500" /> Chat Greeting
                                        </h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">The initial message displayed in the chat widget.</p>
                                    </div>
                                    <div className="relative mb-3 flex-1">
                                        <Textarea
                                            value={chatGreeting}
                                            onChange={(e) => setChatGreeting(e.target.value)}
                                            className="min-h-[100px] text-base pb-10 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 h-full"
                                        />
                                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Voice Input">
                                                <Mic className="w-4 h-4" />
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Generate with AI">
                                                <Wand2 className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-2 pt-2">
                                        <Button size="sm" variant="ghost" className="gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                            <Plus className="w-3 h-3" /> Add Variable
                                        </Button>
                                    </div>
                                </section>

                                {/* Chatbot Closing */}
                                <section className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col">
                                    <div className="mb-4">
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <MessageSquare className="w-5 h-5 text-slate-500" /> Chat Closing
                                        </h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Fixed message shown when the conversation ends.</p>
                                    </div>
                                    <div className="relative mb-3 flex-1">
                                        <Textarea
                                            value={chatClosing}
                                            onChange={(e) => setChatClosing(e.target.value)}
                                            className="min-h-[100px] text-base pb-10 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 h-full"
                                        />
                                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Voice Input">
                                                <Mic className="w-4 h-4" />
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Generate with AI">
                                                <Wand2 className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
