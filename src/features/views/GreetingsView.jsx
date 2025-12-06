import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Phone, MessageCircle, Play, Mic, Plus, Wand2, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';

export default function GreetingsView() {
    const { startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();
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
            <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-4 md:px-8 md:py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
                <div className="flex items-start gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/overview')} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 mt-1 shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Greetings & Closings</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage how Sophiie starts and ends conversations.</p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-slate-950 relative">
                <div className="max-w-7xl mx-auto w-full space-y-8">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    {/* Custom Tabs */}
                    <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl inline-flex mb-2">
                        <button
                            onClick={() => setActiveTab('phone')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'phone' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            <Phone className="w-4 h-4" /> Phone Calls
                        </button>
                        <button
                            onClick={() => setActiveTab('chatbot')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'chatbot' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            <MessageCircle className="w-4 h-4" /> Chatbot
                        </button>
                    </div>

                    {activeTab === 'phone' && (
                        <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                            {/* Greeting Section */}
                            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
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
                                <div className="relative mb-3">
                                    <Textarea
                                        value={phoneGreeting}
                                        onChange={(e) => setPhoneGreeting(e.target.value)}
                                        className="min-h-[120px] text-base pb-10 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700"
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
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="outline" className="gap-2 text-slate-600 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700">
                                        <Play className="w-3 h-3" /> Preview Audio
                                    </Button>
                                    <Button size="sm" variant="outline" className="gap-2 text-slate-600 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700">
                                        <Mic className="w-3 h-3" /> Record Custom
                                    </Button>
                                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
                                    <Button size="sm" variant="ghost" className="gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                        <Plus className="w-3 h-3" /> Add Variable
                                    </Button>
                                </div>
                            </section>

                            {/* Closing Section */}
                            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <div className="mb-4">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <PhoneOff className="w-5 h-5 text-slate-500" /> Closing Message
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">What Sophiie says before hanging up.</p>
                                </div>
                                <div className="relative mb-3">
                                    <Textarea
                                        value={phoneClosing}
                                        onChange={(e) => setPhoneClosing(e.target.value)}
                                        className="min-h-[100px] text-base pb-10 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700"
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
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="outline" className="gap-2 text-slate-600 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700">
                                        <Play className="w-3 h-3" /> Preview Audio
                                    </Button>
                                </div>
                            </section>

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
                            {/* Chatbot Greeting */}
                            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <div className="mb-4">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-slate-500" /> Chat Greeting
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">The initial message displayed in the chat widget.</p>
                                </div>
                                <div className="relative mb-3">
                                    <Textarea
                                        value={chatGreeting}
                                        onChange={(e) => setChatGreeting(e.target.value)}
                                        className="min-h-[100px] text-base pb-10 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700"
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
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="ghost" className="gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                        <Plus className="w-3 h-3" /> Add Variable
                                    </Button>
                                </div>
                            </section>

                            {/* Chatbot Closing */}
                            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <div className="mb-4">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-slate-500" /> Chat Closing
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Fixed message shown when the conversation ends.</p>
                                </div>
                                <div className="relative">
                                    <Textarea
                                        value={chatClosing}
                                        onChange={(e) => setChatClosing(e.target.value)}
                                        className="min-h-[100px] text-base pb-10 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700"
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
                    )}
                </div>
            </div>
        </div>
    );
}
