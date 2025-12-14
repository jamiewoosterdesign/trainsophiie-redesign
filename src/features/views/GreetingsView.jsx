import React, { useState, useRef, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Phone, MessageCircle, Play, Mic, Plus, Wand2, PhoneOff, Clock, AlertTriangle, CheckCircle2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';
import RecordingDisclosureModal from '@/components/modals/RecordingDisclosureModal';
import RichVariableEditor from '@/components/shared/RichVariableEditor';

const PH_VARIABLES = [
    { label: 'Cust First Name', code: '{Customer First Name}', description: "Customer's first name" },
    { label: 'Cust Last Name', code: '{Customer Last Name}', description: "Customer's last name" },
    { label: 'Business Name', code: '{Business Name}', description: "Your company name" },
    { label: 'Agent Name', code: '{Agent Name}', description: "AI Agent's name" }
];

const CHAT_VARIABLES = [
    { label: 'Visitor Name', code: '{Visitor Name}', description: "Website visitor name" },
    { label: 'Business Name', code: '{Business Name}', description: "Your company name" },
];

export default function GreetingsView() {
    const { startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);
    const [activeTab, setActiveTab] = useState('phone');

    // State for Phone
    const [phoneGreeting, setPhoneGreeting] = useState("Hi, Thanks for calling Vision Electrical. You're speaking with Sophiie, an AI assistant. How can I help you today?");
    const [phoneClosing, setPhoneClosing] = useState("Thanks for calling Vision Electrical. Have a great day!");
    const [enableGreeting, setEnableGreeting] = useState(true);
    const [welcomeDelay, setWelcomeDelay] = useState(1);

    // Disclosure State
    const [isDisclosureModalOpen, setIsDisclosureModalOpen] = useState(false);

    // After Hours State
    const [enableAfterHours, setEnableAfterHours] = useState(false);
    const [afterHoursMessage, setAfterHoursMessage] = useState("Thanks for calling. We are currently closed. Please leave a message or call back during our business hours.");

    // State for Chatbot
    const [chatGreeting, setChatGreeting] = useState("Hi there! I'm Sophiie, the Vision Electrical AI assistant. How can I help you?");
    const [chatClosing, setChatClosing] = useState("Thanks for chatting with us. Goodbye!");

    // Helper to check if disclosure is present
    const hasDisclosure = useMemo(() => {
        const text = phoneGreeting.toLowerCase();
        return text.includes('recorded') || text.includes('monitor') || text.includes('quality');
    }, [phoneGreeting]);

    const handleApplyDisclosure = (newText) => {
        setPhoneGreeting(newText);
        setIsDisclosureModalOpen(false);
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            {/* Header */}
            <PageHeader
                title="Greetings & Closings"
                subtitle="Manage how Sophiie starts and ends conversations."
                scrollDirection={scrollDirection}
            />

            {/* Main Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950 relative">
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
                                            <span className="text-xs text-slate-500 dark:text-slate-400">Enable greeting</span>
                                            <Switch checked={enableGreeting} onCheckedChange={setEnableGreeting} />
                                        </div>
                                    </div>

                                    <RichVariableEditor
                                        value={phoneGreeting}
                                        onChange={setPhoneGreeting}
                                        variables={PH_VARIABLES}
                                        disabled={!enableGreeting}
                                        placeholder="Enter your greeting message here..."
                                        previewAudio={() => console.log('Preview audio')}
                                        onRecord={() => console.log('Record')}
                                        onAI={() => console.log('AI')}
                                    />
                                </section>

                                {/* After Hours Section */}
                                <section className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                <Clock className="w-5 h-5 text-slate-500" /> After Hours Message
                                            </h2>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Played when a call is received outside of business hours.</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500 dark:text-slate-400">Enable message</span>
                                            <Switch checked={enableAfterHours} onCheckedChange={setEnableAfterHours} />
                                        </div>
                                    </div>

                                    {/* Always render, just control disabled state to match desired behavior of "keeping it in view" */}
                                    <div className={`transition-opacity duration-200 ${enableAfterHours ? 'opacity-100' : 'opacity-60 grayscale'}`}>
                                        <RichVariableEditor
                                            value={afterHoursMessage}
                                            onChange={setAfterHoursMessage}
                                            variables={[
                                                { label: 'Cust First Name', code: '{Customer First Name}', description: "Customer's first name" },
                                                { label: 'Business Name', code: '{Business Name}', description: "Your company name" }
                                            ]}
                                            disabled={!enableAfterHours}
                                            placeholder="Enter your after-hours message..."
                                            previewAudio={() => console.log('Preview audio')}
                                            onRecord={() => console.log('Record')}
                                            onAI={() => console.log('AI')}
                                        />
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

                                    <RichVariableEditor
                                        value={phoneClosing}
                                        onChange={setPhoneClosing}
                                        variables={PH_VARIABLES}
                                        placeholder="Enter closing message..."
                                        previewAudio={() => console.log('Preview audio')}
                                        onRecord={() => console.log('Record')}
                                        onAI={() => console.log('AI')}
                                    />
                                </section>
                            </div>

                            {/* Additional Settings */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between gap-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white">Call Recording Disclosure</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Inform caller that the call is being recorded for quality assurance.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                        {hasDisclosure ? (
                                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                                <CheckCircle2 className="w-5 h-5" />
                                                <span className="text-sm font-medium">Included in Greeting</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                                <AlertTriangle className="w-5 h-5" />
                                                <span className="text-sm font-medium">Missing from Greeting</span>
                                            </div>
                                        )}

                                        <Button
                                            size="sm"
                                            variant={hasDisclosure ? "outline" : "default"}
                                            onClick={() => setIsDisclosureModalOpen(true)}
                                            className={hasDisclosure ? "" : "bg-amber-600 hover:bg-amber-700 text-white border-amber-600"}
                                        >
                                            {hasDisclosure ? (
                                                <>
                                                    <Edit2 className="w-3 h-3 mr-2" />
                                                    Edit
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-3 h-3 mr-2" />
                                                    Add
                                                </>
                                            )}
                                        </Button>
                                    </div>
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

                                    <RichVariableEditor
                                        value={chatGreeting}
                                        onChange={setChatGreeting}
                                        variables={CHAT_VARIABLES}
                                        placeholder="Enter chat greeting..."
                                        onRecord={() => console.log('Record')}
                                        onAI={() => console.log('AI')}
                                    />
                                </section>

                                {/* Chatbot Closing */}
                                <section className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col">
                                    <div className="mb-4">
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <MessageSquare className="w-5 h-5 text-slate-500" /> Chat Closing
                                        </h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Fixed message shown when the conversation ends.</p>
                                    </div>

                                    <RichVariableEditor
                                        value={chatClosing}
                                        onChange={setChatClosing}
                                        variables={CHAT_VARIABLES}
                                        placeholder="Enter chat closing..."
                                        onRecord={() => console.log('Record')}
                                        onAI={() => console.log('AI')}
                                    />
                                </section>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <RecordingDisclosureModal
                isOpen={isDisclosureModalOpen}
                onClose={() => setIsDisclosureModalOpen(false)}
                currentGreeting={phoneGreeting}
                onApply={handleApplyDisclosure}
            />
        </div>
    );
}
