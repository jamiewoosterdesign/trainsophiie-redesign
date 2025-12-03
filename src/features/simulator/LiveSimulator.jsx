import React, { useState, useEffect, useRef } from 'react';
import { Bot, Mic, MicOff, Square, Headset, Zap, Send, RotateCcw, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { callGemini } from '@/lib/gemini';

export default function LiveSimulator({ mode, formData, step, onChange, updateFormFields, onStepAdvance, simulatorTab, setSimulatorTab, setActiveField }) {
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    // Voice State
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMicMuted, setIsMicMuted] = useState(false);
    const [voiceTranscript, setVoiceTranscript] = useState("");

    // Conversation State Machine
    // Phases: 'INIT', 'ASK_NAME', 'CONFIRM_NAME', 'CHECK_KB', 'KB_DECISION', 'ASK_DESC', 'ASK_UPLOAD', 'DONE'
    const [convoPhase, setConvoPhaseState] = useState('INIT');
    const convoPhaseRef = useRef('INIT');
    const setConvoPhase = (phase) => {
        convoPhaseRef.current = phase;
        setConvoPhaseState(phase);
    };

    const [tempName, setTempName] = useState("");
    const tempNameRef = useRef("");
    const setTempNameSafe = (name) => {
        tempNameRef.current = name;
        setTempName(name);
    };

    // Preview Chat State
    const [previewInput, setPreviewInput] = useState("");

    // Initialize Simulation
    useEffect(() => {
        setMessages([{ role: 'bot', text: "Hi, thanks for calling ABC Plumbing. How can I help you today?" }]);
    }, [mode]);

    // Voice Interaction Effect
    useEffect(() => {
        if (simulatorTab !== 'voice') {
            setActiveField(null);
            return;
        }

        const speak = (text) => {
            setIsSpeaking(true);
            const u = new SpeechSynthesisUtterance(text);
            u.onend = () => {
                setIsSpeaking(false);
                if (!isMicMuted) listen();
            };
            window.speechSynthesis.speak(u);
        };

        const listen = () => {
            if (isMicMuted) return;
            setIsListening(true);
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) return;

            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.start();

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setVoiceTranscript(transcript);
                handleVoiceInput(transcript);
            };

            recognition.onend = () => setIsListening(false);
        };

        // --- STATE MACHINE DRIVER ---
        if (mode === 'service' && !isSpeaking && !isListening && !voiceTranscript) {

            if (convoPhaseRef.current === 'INIT') {
                setConvoPhase('ASK_NAME');
                setActiveField('serviceName');
                const msg = "Let's set up a new service. What is the name of this service?";
                setMessages(prev => [...prev, { role: 'bot', text: msg }]);
                speak(msg);
            }
        }

    }, [simulatorTab, step, mode, isMicMuted]); // Removed convoPhase from dependencies to avoid re-binding loops, relying on ref

    const handleVoiceInput = (text) => {
        // Add user response to chat
        setMessages(prev => [...prev, { role: 'user', text: text }]);

        const currentPhase = convoPhaseRef.current;
        console.log("Handling Voice Input:", text, "Current Phase:", currentPhase);

        if (mode === 'service') {

            if (currentPhase === 'ASK_NAME') {
                // Capture Name temporarily
                setTempNameSafe(text);
                setConvoPhase('CONFIRM_NAME');

                // Immediate Confirmation
                setTimeout(() => {
                    const reply = `I heard ${text}. Is that correct?`;
                    setMessages(prev => [...prev, { role: 'bot', text: reply }]);
                    const u = new SpeechSynthesisUtterance(reply);
                    u.onend = () => {
                        setIsSpeaking(false); if (!isMicMuted) {
                            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                            if (SpeechRecognition) {
                                const recognition = new SpeechRecognition();
                                recognition.lang = 'en-US';
                                recognition.start();
                                recognition.onresult = (e) => {
                                    const t = e.results[0][0].transcript;
                                    setVoiceTranscript(t);
                                    handleVoiceInput(t);
                                };
                            }
                        }
                    };
                    window.speechSynthesis.speak(u);
                    setIsSpeaking(true);
                }, 500);
            }

            else if (currentPhase === 'CONFIRM_NAME') {
                if (text.toLowerCase().includes('yes') || text.toLowerCase().includes('yeah') || text.toLowerCase().includes('correct')) {
                    // Commit Name
                    onChange('serviceName', tempNameRef.current);

                    // Check for KB (Simulated) - Must match WizardFormContent logic (heater/hot water)
                    if (tempNameRef.current.toLowerCase().includes('heater') || tempNameRef.current.toLowerCase().includes('hot water')) {
                        // KB Found path
                        setConvoPhase('KB_DECISION');
                        const reply = "I have found relevant details in SOP_Manual.pdf. Would you like me to populate some of the fields with it?";
                        setMessages(prev => [...prev, { role: 'bot', text: reply }]);
                        const u = new SpeechSynthesisUtterance(reply);
                        u.onend = () => {
                            setIsSpeaking(false); if (!isMicMuted) {
                                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                                if (SpeechRecognition) {
                                    const recognition = new SpeechRecognition();
                                    recognition.lang = 'en-US';
                                    recognition.start();
                                    recognition.onresult = (e) => {
                                        const t = e.results[0][0].transcript;
                                        setVoiceTranscript(t);
                                        handleVoiceInput(t);
                                    };
                                }
                            }
                        };
                        window.speechSynthesis.speak(u);
                        setIsSpeaking(true);
                    } else {
                        // No KB path
                        setConvoPhase('ASK_UPLOAD');
                        const reply = "I didn't find any relevant documents. Do you want to upload one, or just describe the service manually?";
                        setMessages(prev => [...prev, { role: 'bot', text: reply }]);
                        const u = new SpeechSynthesisUtterance(reply);
                        u.onend = () => {
                            setIsSpeaking(false); if (!isMicMuted) {
                                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                                if (SpeechRecognition) {
                                    const recognition = new SpeechRecognition();
                                    recognition.lang = 'en-US';
                                    recognition.start();
                                    recognition.onresult = (e) => {
                                        const t = e.results[0][0].transcript;
                                        setVoiceTranscript(t);
                                        handleVoiceInput(t);
                                    };
                                }
                            }
                        };
                        window.speechSynthesis.speak(u);
                        setIsSpeaking(true);
                    }
                } else {
                    // Retry Name
                    setTempNameSafe("");
                    setConvoPhase('ASK_NAME');
                    const reply = "Sorry about that. Please say the name again.";
                    setMessages(prev => [...prev, { role: 'bot', text: reply }]);
                    const u = new SpeechSynthesisUtterance(reply);
                    u.onend = () => {
                        setIsSpeaking(false); if (!isMicMuted) {
                            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                            if (SpeechRecognition) {
                                const recognition = new SpeechRecognition();
                                recognition.lang = 'en-US';
                                recognition.start();
                                recognition.onresult = (e) => {
                                    const t = e.results[0][0].transcript;
                                    setVoiceTranscript(t);
                                    handleVoiceInput(t);
                                };
                            }
                        }
                    };
                    window.speechSynthesis.speak(u);
                    setIsSpeaking(true);
                }
            }

            else if (currentPhase === 'KB_DECISION') {
                if (text.toLowerCase().includes('yes') || text.toLowerCase().includes('sure') || text.toLowerCase().includes('please')) {
                    // Trigger Auto Fill & ADVANCE STEP
                    updateFormFields({
                        isContextActive: true,
                        contextFileName: 'SOP_Manual.pdf',
                        contextSource: 'SOP_Manual.pdf (Smart Find)',
                        description: "Professional heater diagnosis and repair. We check gas/electric connections, pilot lights, and thermostats.",
                        priceMode: 'na',
                        useCustomPriceMessage: true,
                        customPriceMessage: "Based on our SOP, heater repairs require an on-site diagnosis. We charge a $89 call-out fee which is waived if you proceed.",
                        questions: ["Is the area easily accessible?", "How old is the current unit?", "Is it gas or electric?"]
                    });

                    const reply = "Great. I've populated the fields for you. Moving to the next step.";
                    setMessages(prev => [...prev, { role: 'bot', text: reply }]);
                    const u = new SpeechSynthesisUtterance(reply);
                    window.speechSynthesis.speak(u);
                    setIsSpeaking(true);

                    // Advance Wizard
                    setTimeout(() => onStepAdvance(2), 4000);
                    setConvoPhase('DONE');

                } else {
                    setConvoPhase('ASK_DESC'); // Fallback to manual
                    setActiveField('description');
                    const reply = "Okay, let's do it manually. Please describe the service briefly.";
                    setMessages(prev => [...prev, { role: 'bot', text: reply }]);
                    const u = new SpeechSynthesisUtterance(reply);
                    u.onend = () => {
                        setIsSpeaking(false); if (!isMicMuted) {
                            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                            if (SpeechRecognition) {
                                const recognition = new SpeechRecognition();
                                recognition.lang = 'en-US';
                                recognition.start();
                                recognition.onresult = (e) => {
                                    const t = e.results[0][0].transcript;
                                    setVoiceTranscript(t);
                                    handleVoiceInput(t);
                                };
                            }
                        }
                    };
                    window.speechSynthesis.speak(u);
                    setIsSpeaking(true);
                }
            }

            else if (currentPhase === 'ASK_UPLOAD') {
                if (text.toLowerCase().includes('upload')) {
                    // Simulate Upload Trigger
                    const reply = "Okay, I'm opening the upload window for you.";
                    setMessages(prev => [...prev, { role: 'bot', text: reply }]);
                    const u = new SpeechSynthesisUtterance(reply);
                    window.speechSynthesis.speak(u);
                    setIsSpeaking(true);
                    // In real app, trigger file picker. Here we just say it.
                    setConvoPhase('DONE');
                } else {
                    setConvoPhase('ASK_DESC'); // Fallback to description
                    setActiveField('description');
                    const reply = "Understood. Please describe the service briefly.";
                    setMessages(prev => [...prev, { role: 'bot', text: reply }]);
                    const u = new SpeechSynthesisUtterance(reply);
                    u.onend = () => {
                        setIsSpeaking(false); if (!isMicMuted) {
                            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                            if (SpeechRecognition) {
                                const recognition = new SpeechRecognition();
                                recognition.lang = 'en-US';
                                recognition.start();
                                recognition.onresult = (e) => {
                                    const t = e.results[0][0].transcript;
                                    setVoiceTranscript(t);
                                    handleVoiceInput(t);
                                };
                            }
                        }
                    };
                    window.speechSynthesis.speak(u);
                    setIsSpeaking(true);
                }
            }

            else if (currentPhase === 'ASK_DESC') {
                onChange('description', text);
                setActiveField(null);
                const reply = "Description saved. Let's move to pricing.";
                setMessages(prev => [...prev, { role: 'bot', text: reply }]);
                const u = new SpeechSynthesisUtterance(reply);
                window.speechSynthesis.speak(u);
                setIsSpeaking(true);

                setTimeout(() => onStepAdvance(2), 2000);
                setConvoPhase('DONE');
            }
        }
    };

    const handlePreviewSend = async (text) => {
        if (!text.trim()) return;

        // User speaks
        setMessages(prev => [...prev, { role: 'user', text: text }]);
        setPreviewInput("");
        setIsTyping(true);

        // Use Gemini for Dynamic Chat Simulation
        const systemPrompt = `You are Sophiie, an AI receptionist for a company.
      Current Configuration Context:
      - Service being configured: ${formData.serviceName || 'Unknown'} (${formData.description || 'No description'})
      - Pricing: ${formData.priceMode === 'fixed' ? '$' + formData.price : formData.priceMode === 'na' ? formData.customPriceMessage : 'Standard rates'}
      - Staff: ${formData.staffName || 'Unknown'} (${formData.staffRole || 'Staff'})
      - Transfer Rule: ${formData.transferName || 'None'} -> ${formData.transferSummary || 'Standard transfer'}
      
      User (Owner testing the bot) says: "${text}"
      
      Reply briefly as Sophiie would to a customer, using the configuration context if relevant. If not relevant, just be helpful.`;

        const botResponse = await callGemini(systemPrompt);

        setIsTyping(false);
        setMessages(prev => [...prev, { role: 'bot', text: botResponse || "I'm having trouble connecting to my brain right now." }]);
    };

    const handlePreviewMic = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setPreviewInput(transcript); // Fill input instead of auto-sending
        };
    };


    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isTyping]);

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-50" />

            {/* INVITATION STATE */}
            {simulatorTab === 'invitation' && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                        <Bot className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">Configure {mode === 'service' ? 'Service' : 'Settings'}</h3>
                    <p className="text-slate-500 text-sm text-center mb-8 max-w-xs">How would you like to proceed with this setup?</p>

                    <div className="w-full max-w-xs space-y-4">
                        <button
                            onClick={() => setSimulatorTab('preview')}
                            className="w-full p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex items-center gap-4 text-left group"
                        >
                            <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600">
                                <Keyboard className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-800 group-hover:text-blue-700">Manual Entry</div>
                                <div className="text-xs text-slate-500">I'll type the details myself</div>
                            </div>
                        </button>

                        <button
                            onClick={() => setSimulatorTab('voice')}
                            className="w-full p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-purple-500 hover:shadow-md transition-all flex items-center gap-4 text-left group"
                        >
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-100">
                                <Mic className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-800 group-hover:text-purple-700">Voice Setup</div>
                                <div className="text-xs text-slate-500">Guide me through it</div>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* TABBED INTERFACE (Voice or Preview) */}
            {simulatorTab !== 'invitation' && (
                <>
                    <div className="px-4 py-3 bg-white border-b border-slate-200 flex justify-center items-center shadow-sm z-10 animate-in slide-in-from-top-2 relative">

                        <div className="flex p-1 bg-slate-100 rounded-lg">
                            <button
                                onClick={() => setSimulatorTab('preview')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${simulatorTab === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Live Preview
                            </button>
                            <button
                                onClick={() => setSimulatorTab('voice')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${simulatorTab === 'voice' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Voice Setup
                                {simulatorTab === 'voice' && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>}
                            </button>
                        </div>

                        <button
                            onClick={() => setMessages([{ role: 'bot', text: "Hi, thanks for calling ABC Plumbing. How can I help you today?" }])}
                            className="absolute right-4 text-xs text-slate-400 hover:text-slate-600 font-medium flex items-center"
                        >
                            <RotateCcw className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Subtitles */}
                    <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 text-center">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                            {simulatorTab === 'voice' ? "Sophiie will ask you questions to build your configuration." : "Test your current configuration by chatting with Sophiie."}
                        </p>
                    </div>

                    {simulatorTab === 'voice' ? (
                        <div className="flex-1 flex flex-col min-h-0 animate-in fade-in zoom-in-95">

                            {/* Chat History Container for Voice Mode - Scrollable & Flexible */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0" ref={scrollRef}>
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs text-white ${msg.role === 'bot' ? 'bg-purple-600' : 'bg-slate-400'}`}>
                                            {msg.role === 'bot' ? <Bot className="w-4 h-4" /> : <div className="font-bold">U</div>}
                                        </div>
                                        <div className={`py-2.5 px-3.5 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${msg.role === 'bot' ? 'bg-white text-slate-700 rounded-tl-sm border border-slate-100' : 'bg-purple-600 text-white rounded-tr-sm'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Active Listening State at Bottom - Fixed */}
                            <div className="flex-none w-full p-6 bg-white border-t border-slate-200 flex flex-col items-center justify-center">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${isSpeaking ? 'bg-purple-100 scale-110' : isListening ? 'bg-green-50 scale-105' : 'bg-slate-100'}`}>
                                    <div className={`w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center relative z-10`}>
                                        {isMicMuted ? (
                                            <MicOff className="w-6 h-6 text-slate-400" />
                                        ) : (
                                            <Bot className={`w-6 h-6 transition-colors ${isSpeaking ? 'text-purple-600' : isListening ? 'text-green-500' : 'text-slate-400'}`} />
                                        )}
                                    </div>
                                    {/* Pulse Rings */}
                                    {isSpeaking && !isMicMuted && (
                                        <>
                                            <div className="absolute w-20 h-20 rounded-full border-2 border-purple-200 animate-ping opacity-20"></div>
                                            <div className="absolute w-24 h-24 rounded-full border border-purple-100 animate-pulse opacity-40"></div>
                                        </>
                                    )}
                                    {isListening && !isMicMuted && (
                                        <div className="absolute w-20 h-20 rounded-full bg-green-500/10 animate-pulse"></div>
                                    )}
                                </div>

                                <div className="max-w-xs space-y-1 text-center min-h-[40px]">
                                    {isSpeaking && <p className="text-xs font-medium text-purple-600 animate-in fade-in">Sophiie is speaking...</p>}
                                    {isListening && <p className="text-xs font-medium text-green-600 animate-in fade-in">Listening...</p>}
                                    {!isSpeaking && !isListening && !voiceTranscript && (
                                        <Button size="sm" className="mt-2" onClick={() => setVoiceTranscript(' ')}>Start Conversation</Button>
                                    )}
                                </div>

                                <div className="mt-4 flex gap-4">
                                    {/* Mute and Stop Controls */}
                                    <Button variant="outline" size="icon" onClick={() => setIsMicMuted(!isMicMuted)} className={isMicMuted ? "bg-red-50 border-red-200 text-red-500" : ""}>
                                        {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                    </Button>
                                    {(isSpeaking || isListening) && (
                                        <Button variant="outline" size="icon" onClick={() => window.speechSynthesis.cancel()}>
                                            <Square className="w-4 h-4 fill-current" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col min-h-0 animate-in fade-in zoom-in-95">
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0" ref={scrollRef}>
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs text-white ${msg.role === 'bot' ? 'bg-blue-600' : msg.role === 'system' ? 'bg-orange-500' : 'bg-slate-400'}`}>
                                            {msg.role === 'bot' ? <Headset className="w-4 h-4" /> : msg.role === 'system' ? <Zap className="w-4 h-4" /> : <div className="font-bold">U</div>}
                                        </div>
                                        <div className={`py-2.5 px-3.5 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${msg.role === 'bot' ? 'bg-white text-slate-700 rounded-tl-sm border border-slate-100' : msg.role === 'system' ? 'bg-orange-50 text-orange-800 border border-orange-100 w-full' : 'bg-blue-600 text-white rounded-tr-sm'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex gap-3 animate-in fade-in">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white"><Headset className="w-4 h-4" /></div>
                                        <div className="bg-white border border-slate-100 py-3 px-4 rounded-2xl rounded-tl-sm flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75" />
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Interactive Input Area */}
                            <div className="p-4 bg-white border-t border-slate-200">
                                <form
                                    className="flex gap-2"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handlePreviewSend(previewInput);
                                    }}
                                >
                                    <div className="relative flex-1">
                                        <input
                                            className="w-full h-10 bg-slate-100 rounded-full border border-transparent px-4 pr-10 text-slate-700 text-sm focus:bg-white focus:border-blue-400 focus:outline-none transition-all"
                                            placeholder="Type a message..."
                                            value={previewInput}
                                            onChange={(e) => setPreviewInput(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={handlePreviewMic}
                                            className="absolute right-1 top-1 p-1.5 rounded-full text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                                        >
                                            <Mic className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!previewInput.trim()}
                                        className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                                    >
                                        <Send className="w-4 h-4 ml-0.5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
