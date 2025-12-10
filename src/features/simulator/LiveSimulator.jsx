import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import VoiceCommandBar from '@/components/shared/VoiceCommandBar';
import { Bot, Mic, MicOff, Square, Headset, Zap, Send, RotateCcw, Keyboard, Volume2, VolumeX, Play, Maximize2, FileText, Search, Highlighter, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { callGemini } from '@/lib/gemini';
import { getPreferredVoice, speakText } from '@/lib/voiceUtils';

const USE_GLOBAL_VOICE_UI = true;

export default function LiveSimulator({ mode, formData, step, onChange, updateFormFields, onStepAdvance, simulatorTab, setSimulatorTab, setActiveField, showVoiceTooltip, isMobile, onWizardClose }) {
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    // Voice State
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMicMuted, setIsMicMuted] = useState(false);
    const isMicMutedRef = useRef(false);
    useEffect(() => { isMicMutedRef.current = isMicMuted; }, [isMicMuted]);

    const [voiceTranscript, setVoiceTranscript] = useState("");

    // Conversation State Machine
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
    // Review Loop State
    const [reviewIndex, setReviewIndex] = useState(0);
    const reviewFields = [
        { name: 'description', label: 'Description', text: "For Description, I put: Professional heater diagnosis and repair. We check gas/electric connections, pilot lights, and thermostats." },
        { name: 'price', label: 'Price', text: "For Price, used an hourly rate of $180, plus a $50 call-out fee." },
        { name: 'durationValue', label: 'Duration', text: "I estimated the duration at 60 minutes." }
    ];

    const handleReviewField = (index) => {
        setConvoPhase('REVIEWING'); // Intermediate state while speaking
        const field = reviewFields[index];
        setActiveField(field.name);

        speakText(field.text, voices, () => {
            setConvoPhase('REVIEW_NEXT_CHOICE');
            const ask = "Do you want to review the next field or move on?";
            // Wait a brief moment before asking next
            speakText(ask, voices, () => {
                if (!isMicMutedRef.current && listenRef.current) listenRef.current();
            });
        });
    };

    const handleMoveToOutcome = () => {
        onStepAdvance(3); // Go to Outcome Step
        setActiveField(null);

        setConvoPhase('OUTCOME_SELECTION');
        const reply = "Which outcome option would you like to select from the available 4?";
        if (!USE_GLOBAL_VOICE_UI) setMessages(prev => [...prev, { role: 'bot', text: reply }]);
        speak(reply);
    };

    // Preview Chat State
    const [previewInput, setPreviewInput] = useState("");

    // Refs for circular dependencies
    const listenRef = useRef(null);
    const speakRef = useRef(null);

    // Load voices
    const [voices, setVoices] = useState([]);
    useEffect(() => {
        const loadVoices = () => {
            setVoices(window.speechSynthesis.getVoices());
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    // Initialize Simulation
    useEffect(() => {
        setMessages([{ role: 'bot', text: "Hi, thanks for calling ABC Plumbing. How can I help you today?" }]);
    }, [mode]);

    // --- SHARED VOICE FUNCTIONS ---
    const speak = (text) => {
        setIsSpeaking(true);
        speakText(text, voices, () => {
            setIsSpeaking(false);
            if (!isMicMutedRef.current && listenRef.current) {
                listenRef.current();
            }
        }, (e) => {
            console.error("Speech synthesis error", e);
            setIsSpeaking(false);
        });
    };
    speakRef.current = speak;

    const listen = () => {
        if (isMicMutedRef.current) return;

        setIsListening(true);
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setIsListening(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setVoiceTranscript(transcript);
            handleVoiceInput(transcript);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };
    };
    listenRef.current = listen;


    const handleVoiceInput = (text) => {
        // Don't add user response to chat in Global UI mode
        if (!USE_GLOBAL_VOICE_UI) {
            setMessages(prev => [...prev, { role: 'user', text: text }]);
        }

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
                    if (!USE_GLOBAL_VOICE_UI) setMessages(prev => [...prev, { role: 'bot', text: reply }]);
                    speak(reply);
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
                        if (!USE_GLOBAL_VOICE_UI) setMessages(prev => [...prev, { role: 'bot', text: reply }]);
                        speak(reply);
                    } else {
                        // No KB path
                        setConvoPhase('ASK_UPLOAD');
                        const reply = "I didn't find any relevant documents. Do you want to upload one, or just describe the service manually?";
                        if (!USE_GLOBAL_VOICE_UI) setMessages(prev => [...prev, { role: 'bot', text: reply }]);
                        speak(reply);
                    }
                } else {
                    // Retry Name
                    setTempNameSafe("");
                    setConvoPhase('ASK_NAME');
                    const reply = "Sorry about that. Please say the name again.";
                    if (!USE_GLOBAL_VOICE_UI) setMessages(prev => [...prev, { role: 'bot', text: reply }]);
                    speak(reply);
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
                        price: "180.00",
                        priceMode: 'hourly',
                        durationValue: "60",
                        durationUnit: "minutes",
                        callOutFee: "50.00",
                        plusGst: true,
                        plusMaterials: true,
                        questions: [
                            { id: '1', text: "Is the area easily accessible?", options: [], isAutoGenerated: true },
                            { id: '2', text: "How old is the current unit?", options: [], isAutoGenerated: true },
                            { id: '3', text: "Is it gas or electric?", options: [], isAutoGenerated: true }
                        ],
                        serviceOutcome: 'collect',
                        serviceClosingScript: "e.g. I'll take your details and have someone from the team call you back shortly.",
                        autoFilledFields: { description: true, price: true, priceMode: true, duration: true, callOutFee: true, plusGst: true, plusMaterials: true }
                    });

                    // ASK TO REVIEW or MOVE ON
                    setConvoPhase('REVIEW_CHOICE');
                    const reply = "Great I've populated the fields for you. Do you want to review what the system has added or move onto the next step?";
                    if (!USE_GLOBAL_VOICE_UI) setMessages(prev => [...prev, { role: 'bot', text: reply }]);
                    speak(reply);

                } else {
                    setConvoPhase('ASK_DESC'); // Fallback to manual
                    setActiveField('description');
                    const reply = "Okay, let's do it manually. Please describe the service briefly.";
                    if (!USE_GLOBAL_VOICE_UI) setMessages(prev => [...prev, { role: 'bot', text: reply }]);
                    speak(reply);
                }
            }

            else if (currentPhase === 'REVIEW_CHOICE') {
                if (text.toLowerCase().includes('review')) {
                    setReviewIndex(0);
                    handleReviewField(0);
                } else {
                    handleMoveToOutcome();
                }
            }

            else if (currentPhase === 'REVIEW_NEXT_CHOICE') {
                if (text.toLowerCase().includes('review') || text.toLowerCase().includes('next') || text.toLowerCase().includes('yes')) {
                    const nextIndex = reviewIndex + 1;
                    if (nextIndex < reviewFields.length) {
                        setReviewIndex(nextIndex);
                        handleReviewField(nextIndex);
                    } else {
                        handleMoveToOutcome();
                    }
                } else {
                    handleMoveToOutcome();
                }
            }

            else if (currentPhase === 'ASK_UPLOAD') {
                if (text.toLowerCase().includes('upload')) {
                    // Simulate Upload Trigger
                    const reply = "Okay, I'm opening the upload window for you.";
                    if (!USE_GLOBAL_VOICE_UI) setMessages(prev => [...prev, { role: 'bot', text: reply }]);
                    speak(reply);
                    setConvoPhase('DONE');

                } else {
                    setConvoPhase('ASK_DESC'); // Fallback to description
                    setActiveField('description');
                    const reply = "Understood. Please describe the service briefly.";
                    if (!USE_GLOBAL_VOICE_UI) setMessages(prev => [...prev, { role: 'bot', text: reply }]);
                    speak(reply);
                }
            }

            else if (currentPhase === 'ASK_DESC') {
                onChange('description', text);
                setActiveField(null);
                const reply = "Description saved. Let's move to pricing.";
                if (!USE_GLOBAL_VOICE_UI) setMessages(prev => [...prev, { role: 'bot', text: reply }]);
                speak(reply);
                // No step advance
                setConvoPhase('DONE');
            }

            else if (currentPhase === 'OUTCOME_SELECTION') {
                let outcome = null;
                if (text.toLowerCase().includes('collect')) outcome = 'collect';
                if (text.toLowerCase().includes('transfer')) outcome = 'transfer';
                if (text.toLowerCase().includes('book')) outcome = 'booking';
                if (text.toLowerCase().includes('send')) outcome = 'send_info';

                if (outcome) {
                    updateFormFields({ serviceOutcome: outcome });
                    setActiveField('serviceOutcome');
                    const reply = `Selected ${outcome.replace('_', ' ')}. Configuration complete.`;
                    if (!USE_GLOBAL_VOICE_UI) setMessages(prev => [...prev, { role: 'bot', text: reply }]);
                    speak(reply);
                    setConvoPhase('DONE');
                } else {
                    const reply = "I didn't catch that. Please say Collect, Transfer, Booking, or Send Info.";
                    if (!USE_GLOBAL_VOICE_UI) setMessages(prev => [...prev, { role: 'bot', text: reply }]);
                    speak(reply);
                }
            }
        }
    };

    // Voice Interaction Trigger
    useEffect(() => {
        if (simulatorTab !== 'voice') {
            setActiveField(null);
            // Reset phase if needed, or keep it?
            // setConvoPhase('INIT'); 
            return;
        }

        // --- STATE MACHINE DRIVER ---
        if (mode === 'service') {
            if (convoPhaseRef.current === 'INIT') {
                setConvoPhase('ASK_NAME');
                setActiveField('serviceName');
                const msg = "Let's set up a new service. What is the name of this service?";
                if (!USE_GLOBAL_VOICE_UI) setMessages(prev => [...prev, { role: 'bot', text: msg }]);
                // Use timeout to ensure refs are ready
                setTimeout(() => speak(msg), 100);
            }
        }

    }, [simulatorTab, mode]);

    const handlePreviewSend = async (text) => {
        if (!text.trim()) return;

        // User speaks
        setMessages(prev => [...prev, { role: 'user', text: text }]);
        setPreviewInput("");
        setIsTyping(true);

        // Use Gemini for Dynamic Chat Simulation
        const systemPrompt = `You are Sophiie, an AI receptionist for a company.
          Current Configuration Context:
          - Service/Product: ${formData.serviceName || formData.productName || 'Unknown'} (${formData.description || 'No description'})
          - Pricing: ${formData.priceMode === 'fixed' ? '$' + formData.price : formData.productPrice ? '$' + formData.productPrice : formData.priceMode === 'na' ? formData.customPriceMessage : 'Standard rates'}
          - Staff: ${formData.staffName || 'Unknown'} (${formData.staffRole || 'Staff'})
          - Transfer Rule: ${formData.transferName || 'None'} -> ${formData.transferSummary || 'Standard transfer'}
          - Questions: ${formData.questions?.map(q => q.text + (q.options ? ' (Options: ' + q.options.map(o => o.text).join(', ') + ')' : '')).join('; ') || 'None'}
          
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
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-900 to-transparent opacity-50" />

            {/* TABBED INTERFACE (Voice or Preview) - Hidden on mobile if embedded in WizardModal */}
            <div className={`px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm z-10 animate-in slide-in-from-top-2 relative ${isMobile ? 'hidden md:flex' : ''}`}>

                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">{mode === 'document' ? 'Document Preview' : 'Live Preview'}</h3>
                    <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-full">Test Mode</span>
                </div>

                <div className="flex items-center gap-2 relative">
                    {/* Close Button (Desktop Only) */}
                    {onWizardClose && (
                        <button
                            onClick={onWizardClose}
                            className="hidden md:flex w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 items-center justify-center transition-colors"
                            title="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Subtitles */}
            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 flex items-center justify-center relative min-h-[50px]">
                {/* Refresh Button */}
                <div className="absolute left-6">
                    <button
                        onClick={() => setMessages([{ role: 'bot', text: "Hi, thanks for calling ABC Plumbing. How can I help you today?" }])}
                        className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 flex items-center justify-center transition-all shadow-sm"
                        title="Reset Preview"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                </div>

                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                    {mode === 'document' ? (formData.contextFileName || "No Document Uploaded") : (simulatorTab === 'voice' ? "Voice Setup Active - Speak to Sophiie" : "Interact with the preview to test your flow.")}
                </p>
            </div>

            {/* DOCUMENT PREVIEW MODE */
                mode === 'document' ? (
                    <div className="flex-1 flex flex-col min-h-0 animate-in fade-in zoom-in-95 bg-slate-100 dark:bg-slate-900/50 relative">
                        {!formData.contextFileName ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                                <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                    <FileText className="w-10 h-10 text-slate-400" />
                                </div>
                                <h4 className="font-semibold text-slate-600 dark:text-slate-300 mb-1">No Document Uploaded</h4>
                                <p className="text-sm max-w-xs">Upload a PDF or text file in the wizard to see a preview here.</p>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col min-h-0 bg-slate-200/50 dark:bg-slate-950/50 relative">
                                {/* Mock PDF Toolbar */}
                                <div className="h-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-3 shadow-sm z-10">
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500"><ZoomOut className="w-3.5 h-3.5" /></Button>
                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 min-w-[3ch] text-center">100%</span>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500"><ZoomIn className="w-3.5 h-3.5" /></Button>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded px-2 py-0.5">
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500"><ChevronLeft className="w-3 h-3" /></Button>
                                        <span className="text-xs font-mono text-slate-600 dark:text-slate-400">1 / 5</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500"><ChevronRight className="w-3 h-3" /></Button>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500" title="Highlight Found Info"><Highlighter className="w-3.5 h-3.5" /></Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500" title="Search"><Search className="w-3.5 h-3.5" /></Button>
                                    </div>
                                </div>

                                {/* MAXIMIZE BUTTON (Overlay) */}
                                <button className="absolute bottom-4 right-4 z-30 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-800 transition-all hover:scale-105" title="Expand View">
                                    <Maximize2 className="w-5 h-5" />
                                </button>

                                {/* Mock PDF Content (Scrollable) */}
                                <div className="flex-1 overflow-y-auto p-8 flex justify-center custom-scrollbar">
                                    <div className="w-[80%] max-w-[600px] bg-white text-slate-900 shadow-xl min-h-[800px] relative p-10 space-y-4">
                                        {/* Mock Document Content */}
                                        <div className="h-4 w-1/3 bg-slate-200 mb-8" />
                                        <div className="space-y-2">
                                            <div className="h-2 w-full bg-slate-100" />
                                            <div className="h-2 w-full bg-slate-100" />
                                            <div className="h-2 w-2/3 bg-slate-100" />
                                        </div>

                                        {/* Section 2 - Potentially Highlighted */}
                                        <div className="pt-4 space-y-2">
                                            <div className="h-3 w-1/4 bg-slate-200 mb-2" />
                                            <div className={`h-2 w-full bg-slate-100 ${step >= 2 ? 'relative' : ''}`}>
                                                {step >= 2 && <div className="absolute inset-0 bg-yellow-200/50 border-b-2 border-yellow-400 animate-in fade-in duration-500" />}
                                            </div>
                                            <div className={`h-2 w-full bg-slate-100 ${step >= 2 ? 'relative' : ''}`}>
                                                {step >= 2 && <div className="absolute inset-0 bg-yellow-200/50 border-b-2 border-yellow-400 animate-in fade-in duration-500 delay-75" />}
                                            </div>
                                            <div className="h-2 w-4/5 bg-slate-100" />
                                        </div>

                                        <div className="pt-4 space-y-2">
                                            <div className="h-2 w-full bg-slate-100" />
                                            <div className="h-2 w-11/12 bg-slate-100" />
                                            <div className="h-2 w-full bg-slate-100" />
                                        </div>

                                        {/* Fake Graphic Image */}
                                        <div className="my-6 h-32 w-full bg-slate-50 border border-slate-100 rounded flex items-center justify-center">
                                            <div className="text-slate-300 text-xs uppercase font-bold tracking-widest">Figure 1.1</div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="h-2 w-full bg-slate-100" />
                                            <div className="h-2 w-5/6 bg-slate-100" />
                                            <div className="h-2 w-full bg-slate-100" />
                                            <div className="h-2 w-full bg-slate-100" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : null}

            {/* OLD VOICE UI (Only if Global UI is OFF) */}
            {mode !== 'document' && simulatorTab === 'voice' && !USE_GLOBAL_VOICE_UI && (
                <div className="flex-1 flex flex-col min-h-0 animate-in fade-in zoom-in-95">
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

                    <div className="flex-none w-full p-6 bg-white border-t border-slate-200 flex flex-col items-center justify-center">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${isSpeaking ? 'bg-purple-100 scale-110' : isListening ? 'bg-green-50 scale-105' : 'bg-slate-100'}`}>
                            <div className={`w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center relative z-10`}>
                                {isMicMuted ? (
                                    <MicOff className="w-6 h-6 text-slate-400" />
                                ) : (
                                    <Bot className={`w-6 h-6 transition-colors ${isSpeaking ? 'text-purple-600' : isListening ? 'text-green-500' : 'text-slate-400'}`} />
                                )}
                            </div>
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
            )}

            {/* PREVIEW UI (Always visible in Global Mode, or if Preview Tab active) */}
            {mode !== 'document' && (simulatorTab === 'preview' || (simulatorTab === 'voice' && USE_GLOBAL_VOICE_UI)) && (
                <div className="flex-1 flex flex-col min-h-0 animate-in fade-in zoom-in-95">
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0" ref={scrollRef}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs text-white ${msg.role === 'bot' ? 'bg-blue-600' : msg.role === 'system' ? 'bg-orange-500' : 'bg-slate-400 dark:bg-slate-600'}`}>
                                    {msg.role === 'bot' ? <Headset className="w-4 h-4" /> : msg.role === 'system' ? <Zap className="w-4 h-4" /> : <div className="font-bold">U</div>}
                                </div>
                                <div className={`py-2.5 px-3.5 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${msg.role === 'bot' ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-sm border border-slate-100 dark:border-slate-700' : msg.role === 'system' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 border border-orange-100 dark:border-orange-900/30 w-full' : 'bg-blue-600 text-white rounded-tr-sm'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-3 animate-in fade-in">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white"><Headset className="w-4 h-4" /></div>
                                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 py-3 px-4 rounded-2xl rounded-tl-sm flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-75" />
                                    <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-150" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                        <form
                            className="flex gap-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handlePreviewSend(previewInput);
                            }}
                        >
                            <div className="relative flex-1">
                                <input
                                    className="w-full h-10 bg-slate-100 dark:bg-slate-800 rounded-full border border-transparent px-4 pr-10 text-slate-700 dark:text-white text-sm focus:bg-white dark:focus:bg-slate-900 focus:border-blue-400 focus:outline-none transition-all"
                                    placeholder="Type a message..."
                                    value={previewInput}
                                    onChange={(e) => {
                                        setPreviewInput(e.target.value);
                                        // Auto-switch to manual mode if typing
                                        if (simulatorTab === 'voice') setSimulatorTab('preview');
                                    }}
                                    onFocus={() => {
                                        if (simulatorTab === 'voice') setSimulatorTab('preview');
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handlePreviewMic}
                                    className="absolute right-1 top-1 p-1.5 rounded-full text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
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

            {/* Global Voice UI Portal */}
            {USE_GLOBAL_VOICE_UI && simulatorTab === 'voice' && createPortal(
                <VoiceCommandBar
                    isOpen={true}
                    isListening={isListening}
                    isSpeaking={isSpeaking}
                    transcript={voiceTranscript}
                    isMicMuted={isMicMuted}
                    onMicToggle={() => setIsMicMuted(!isMicMuted)}
                    onClose={() => setSimulatorTab('preview')}
                    activeContext={
                        convoPhase === 'ASK_NAME' ? 'Editing: Service Name' :
                            convoPhase === 'ASK_DESC' ? 'Editing: Description' :
                                convoPhase === 'KB_DECISION' ? 'Reviewing: Knowledge Base' :
                                    convoPhase === 'CONFIRM_NAME' ? 'Confirming: Service Name' :
                                        'Voice Setup'
                    }
                />,
                document.body
            )}
        </div >
    );
}
