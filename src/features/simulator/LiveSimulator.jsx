import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import VoiceCommandBar from '@/components/shared/VoiceCommandBar';
import { Bot, Mic, MicOff, Square, Headset, Zap, Send, RotateCcw, Keyboard, Volume2, VolumeX, Play, Maximize2, FileText, Search, Highlighter, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X, List, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
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
    const [isFlowExpanded, setIsFlowExpanded] = useState(false);

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
        setMessages([{ role: 'bot', text: "Hi, thanks for calling Vision Electrical. How can I help you today?" }]);
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

    const generateSystemPrompt = (mode, formData, currentInput, history = []) => {
        let context = "";

        switch (mode) {
            case 'service':
                context = `
                Current Service Configuration:
                - Name: ${formData.serviceName || 'Unnamed Service'}
                - Description: ${formData.description || 'No description provided'}
                - Price: ${formData.priceMode === 'fixed'
                        ? (formData.price ? '$' + formData.price : 'NOT CONFIGURED (Missing)')
                        : formData.priceMode === 'hourly'
                            ? (formData.price ? '$' + formData.price + '/hr' : 'NOT CONFIGURED (Missing)')
                            : formData.priceMode === 'range'
                                ? (formData.minPrice && formData.maxPrice ? '$' + formData.minPrice + ' - $' + formData.maxPrice : 'NOT CONFIGURED (Missing)')
                                : 'Not applicable'
                    }
                - Duration: ${formData.durationValue ? formData.durationValue + ' ' + formData.durationUnit : 'Not specified'}
                - Outcome: ${formData.serviceOutcome || 'Not specified'}
                - Opening Script/AI Response: ${formData.aiResponse || 'None'}
                - Required Information to Collect (Follow-up Questions): ${formData.questions?.map(q => `Q: ${q.text} (Options: ${q.options?.map(o => o.text).join(', ') || 'None'})`).join('; ') || 'None'}
                `;
                break;
            case 'product':
                context = `
                Current Product Configuration:
                - Name: ${formData.productName || 'Unnamed Product'}
                - Description: ${formData.description || 'No description provided'}
                - Price: ${formData.productPrice ? '$' + formData.productPrice : 'Not specified'}
                - FAQs: ${formData.faqs?.map(q => `Q: ${q.question} A: ${q.answer}`).join('; ') || 'None'}
                `;
                break;
            case 'policy':
                context = `
                Current Policy Draft:
                - Title: ${formData.policyTitle || 'Unnamed Policy'}
                - Content: ${formData.policyContent || 'No content provided'}
                `;
                break;
            case 'faq':
                context = `
                Current FAQ Draft:
                - Question: ${formData.faqQuestion || 'No question'}
                - Answer: ${formData.faqAnswer || 'No answer'}
                - Additional FAQs: ${formData.faqs?.map(q => `Q: ${q.question} A: ${q.answer}`).join('; ') || 'None'}
                `;
                break;
            case 'protocol': // Scenarios
                context = `
                Current Scenario/Protocol Configuration:
                - Scenario Name: ${formData.scenarioName || 'Unnamed Scenario'}
                - Trigger: ${formData.protocolTrigger || 'No trigger defined'} (${formData.protocolTriggerType})
                - Description: ${formData.description || 'No description provided'}
                - Action: ${formData.protocolAction || 'Not specified'}
                - Opening Script/AI Response: ${formData.aiResponse || 'None'}
                - Closing/Refusal Script: ${formData.protocolScript || 'None'}
                - Required Information to Collect (Follow-up Questions): ${formData.questions?.map(q => `Q: ${q.text} (Options: ${q.options?.map(o => o.text).join(', ') || 'None'})`).join('; ') || 'None'}
                `;
                break;
            case 'transfer':
                context = `
                Current Transfer Rule Configuration:
                - Name: ${formData.transferName || 'Unnamed Rule'}
                - Type: ${formData.transferType || 'Warm Transfer'}
                - Summary/Handoff Message: ${formData.transferSummary || 'Standard handoff'}
                - Destination: ${formData.transferDestinationValue || 'Not specified'}
                `;
                break;
            default:
                context = "General Configuration Mode";
        }

        const historyText = history.map(m => `${m.role === 'user' ? 'Customer' : 'Sophiie'}: ${m.text}`).join('\n');

        return `You are Sophiie, an AI receptionist. 
        User is the business owner testing how you would respond to a customer based ONLY on the current configuration they are setting up.
        
        Business Name: Vision Electrical
        ${context}

        Conversation History:
        ${historyText}
        
        Instructions:
        1. Roleplay as Sophiie receiving a call/chat from a customer.
        2. Use the "Current Configuration" above as your ABSOLUTE source of truth. 
           - The user may update the configuration during the chat. Your answers must reflect the CURRENT values above, not past history.
        3. PRIORITY 1: Answer the user's immediate question DIRECTLY.
           - If the user asks for the price, cost, or rates, AND the price is configured above, YOU MUST tell them the price.
           - Do NOT ignore the question to ask a follow-up question. Answer FIRST, then ask.
        4. PRIORITY 2: Only AFTER answering the specific question, check if there are "Required Information to Collect" questions.
           - If yes, ask the NEXT missing question to keep the flow moving.
        5. CRITICAL: If the user EXPLICITLY asks for information that is missing or "NOT CONFIGURED":
           - FIRST: Respond honestly as Sophiie (e.g., "I'm not sure of the price right now, I'd need to check.").
           - SECOND: Add a new line and use the tag "[META]: ".
           - THIRD: After the tag, tell the business owner to add the missing info in the wizard.
           - Example: "I'd need to check on that. \n [META]: Please add a Price in the 'Service Details' step."
        6. FORMATTING RULES:
           - Do NOT prefix your response with "Sophiie:" or "AI:".
           - Do NOT repeat the greeting if it's already in the history.
           - Output ONLY the raw response text.
        
        Customer says: "${currentInput}"`;
    };

    const handlePreviewSend = async (text, isVoice = false) => {
        if (!text.trim()) return;

        // User speaks
        setMessages(prev => [...prev, { role: 'user', text: text }]);
        setPreviewInput("");
        setIsTyping(true);

        const systemPrompt = generateSystemPrompt(mode, formData, text, messages);

        // Pass key explicitly to bypass any env/HMR issues
        const botResponse = await callGemini(systemPrompt);

        setIsTyping(false);
        const finalText = botResponse || "I'm sorry, I'm having trouble connecting to the simulator right now.";

        // Split response if it contains [META]: tag
        if (finalText.includes('[META]:')) {
            const parts = finalText.split('[META]:');
            const inCharacterPart = parts[0].trim();

            // We set the FULL text (including META) to the chat so the bubble renders correctly with styling
            setMessages(prev => [...prev, { role: 'bot', text: finalText }]);

            // But we only SPEAK the in-character part
            if (inCharacterPart) {
                if ((isVoice || simulatorTab === 'voice' || (mode === 'service' && convoPhaseRef.current === 'DONE'))) {
                    speak(inCharacterPart);
                }
            }

        } else {
            // Normal response
            setMessages(prev => [...prev, { role: 'bot', text: finalText }]);

            if ((isVoice || simulatorTab === 'voice' || (mode === 'service' && convoPhaseRef.current === 'DONE'))) {
                speak(finalText);
            }
        }
    };

    const handlePreviewMic = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            handlePreviewSend(transcript, true);
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
                        onClick={() => setMessages([{ role: 'bot', text: "Hi, thanks for calling Vision Electrical. How can I help you today?" }])}
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

                    {/* Planned Conversation Flow Panel (Collapsible) */}
                    {(mode === 'service' || mode === 'protocol') && (
                        <div className={`border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out flex flex-col ${isFlowExpanded ? 'h-[40%]' : 'h-10'}`}>
                            {/* Toggle Header */}
                            <div
                                onClick={() => setIsFlowExpanded(!isFlowExpanded)}
                                className="flex items-center justify-between px-4 h-10 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    <List className="w-3.5 h-3.5" />
                                    Planned Conversation Flow
                                </div>
                                {isFlowExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                            </div>

                            {/* Content Area */}
                            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${!isFlowExpanded && 'hidden'}`}>

                                {/* AI Response Logic */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        <MessageSquare className="w-4 h-4 text-purple-500" />
                                        Initial AI Response
                                    </div>
                                    <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/50 rounded-lg p-3 text-sm text-purple-900 dark:text-purple-100 relative">
                                        {formData.aiResponse ? (
                                            <>"{formData.aiResponse}"</>
                                        ) : (
                                            <span className="text-purple-400 italic">No custom response configured (Standard greeting will apply)</span>
                                        )}
                                    </div>
                                </div>

                                {/* Question Rules Logic */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        <List className="w-4 h-4 text-blue-500" />
                                        Follow-up Questions
                                    </div>
                                    {formData.questions && formData.questions.length > 0 ? (
                                        <div className="space-y-3">
                                            {formData.questions.map((q, idx) => (
                                                <div key={q.id || idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                                                    <div className="flex gap-2">
                                                        <span className="text-xs font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded flex items-center h-5">Q{idx + 1}</span>
                                                        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{q.text}</p>
                                                    </div>
                                                    {q.options && q.options.length > 0 && (
                                                        <div className="mt-2 pl-8 space-y-1">
                                                            {q.options.map(opt => (
                                                                <div key={opt.id} className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                                                                    {opt.text}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-slate-400 italic pl-6">No follow-up questions configured.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Simulator Area */}
                    <div className="flex-1 flex flex-col min-h-0 relative">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm z-10 shadow-sm flex-none h-14">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-slate-900 dark:text-white">Live Preview</span>
                                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Test Mode</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {/* Only show refresh if not global UI or we want it here */}
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" ref={scrollRef}>
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm space-y-2 opacity-60">
                                    <RotateCcw className="w-8 h-8 mb-2 opacity-50" />
                                    <p>Interact with the preview to test your flow.</p>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-slate-400 text-white' : 'bg-blue-600 text-white'}`}>
                                        {msg.role === 'user' ? (
                                            <span className="font-bold text-xs">U</span>
                                        ) : (
                                            <Headset className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-sm'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-sm'
                                        }`}>
                                        {msg.text.split('\n').map((line, i) => (
                                            <React.Fragment key={i}>
                                                {line.startsWith('[META]:') ? (
                                                    <div className="mt-2 pt-2 border-t border-orange-200 dark:border-orange-900/30 text-orange-700 dark:text-orange-400 font-bold italic text-xs bg-orange-50 dark:bg-orange-900/10 p-2 rounded flex gap-2">
                                                        <Zap className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                        <span>{line.replace('[META]:', '').trim()}</span>
                                                    </div>
                                                ) : (
                                                    <p className={i > 0 ? 'mt-2' : ''}>{line}</p>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex items-start gap-3 animate-pulse">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                                        <Headset className="w-4 h-4" />
                                    </div>
                                    <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm">
                                        <div className="flex gap-1.5 pt-1">
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100" />
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex-none z-20 relative">
                            {/* Refresh Button - Floating */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                                <button
                                    onClick={() => setMessages([{ role: 'bot', text: "Hi, thanks for calling Vision Electrical. How can I help you today?" }])}
                                    className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center shadow-lg transition-all hover:scale-110"
                                    title="Reset Preview"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="relative flex items-center">
                                <input
                                    value={previewInput}
                                    onChange={(e) => setPreviewInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handlePreviewSend(previewInput);
                                        }
                                    }}
                                    placeholder="Type a message..."
                                    className="w-full pl-4 pr-24 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm text-slate-900 dark:text-white"
                                />
                                <div className="absolute right-2 flex items-center gap-1">
                                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                        <Mic className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handlePreviewSend(previewInput)}
                                        disabled={!previewInput.trim() || isTyping}
                                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                    >
                                        <Send className="w-4 h-4 ml-0.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
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
