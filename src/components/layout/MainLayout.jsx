import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import WizardModal from '@/features/wizards/WizardModal';
import SettingsModal from '@/features/wizards/SettingsModal';
import VoiceCommandBar from '@/components/shared/VoiceCommandBar';
import { getPreferredVoice, speakText } from '@/lib/voiceUtils';

export default function MainLayout() {
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [wizardMode, setWizardMode] = useState('service');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Global Voice Flow State
    const [voiceFlowStep, setVoiceFlowStep] = useState('IDLE'); // IDLE, OVERVIEW, SERVICES
    const [voiceTranscript, setVoiceTranscript] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Load voices
    const [voices, setVoices] = useState([]);
    useEffect(() => {
        const loadVoices = () => {
            setVoices(window.speechSynthesis.getVoices());
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    // Speech Recognition
    const recognitionRef = useRef(null);

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            console.error("Speech recognition not supported");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setVoiceTranscript("");
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setVoiceTranscript(transcript);
            handleVoiceCommand(transcript);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    };

    const speak = (text) => {
        setIsSpeaking(true);
        stopListening(); // Stop listening while speaking
        speakText(text, voices, () => {
            console.log("Speech ended");
            setIsSpeaking(false);
            startListening(); // Auto-listen after speaking
        }, (e) => {
            console.error("Speech error:", e);
            setIsSpeaking(false);
        });
    };

    const startGlobalVoiceFlow = () => {
        setVoiceFlowStep('OVERVIEW');
        setVoiceTranscript("Sophiie is speaking...");
        speak("Welcome to Sophiie. Would you like to set up a new service?");
    };

    const handleVoiceCommand = (transcript) => {
        const text = transcript.toLowerCase();

        if (voiceFlowStep === 'OVERVIEW') {
            if (text.includes('yes') || text.includes('sure') || text.includes('okay') || text.includes('create')) {
                speak("Great. Taking you to the services page.");
                setTimeout(() => {
                    navigate('/services');
                    setVoiceFlowStep('SERVICES');
                    // Speak after navigation
                    setTimeout(() => {
                        speak("Here are your services. Say 'Create New' to add one.");
                    }, 500);
                }, 1500);
            }
        } else if (voiceFlowStep === 'SERVICES') {
            if (text.includes('create') || text.includes('new') || text.includes('add')) {
                speak("Opening the service wizard.");
                setTimeout(() => {
                    setVoiceFlowStep('IDLE');
                    openWizard('service');
                }, 1500);
            }
        }
    };

    const toggleMic = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const openWizard = (mode) => {
        setWizardMode(mode);
        setIsWizardOpen(true);
    };

    const openSettings = () => {
        setIsSettingsOpen(true);
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
            <Sidebar />
            <main className={`flex-1 flex flex-col h-full overflow-hidden relative bg-white transition-all duration-500 ${voiceFlowStep === 'OVERVIEW' ? 'ring-[12px] ring-inset ring-purple-500/30 shadow-[inset_0_0_50px_rgba(168,85,247,0.2)]' : ''}`}>
                <Outlet context={{ openWizard, openSettings, startGlobalVoiceFlow, voiceFlowStep }} />
            </main>

            {/* Global Voice Command Bar for Navigation Flow */}
            {voiceFlowStep !== 'IDLE' && (
                <VoiceCommandBar
                    isOpen={true}
                    isListening={isListening}
                    isSpeaking={isSpeaking}
                    transcript={voiceTranscript}
                    isMicMuted={false}
                    onMicToggle={toggleMic}
                    onClose={() => {
                        stopListening();
                        window.speechSynthesis.cancel();
                        setVoiceFlowStep('IDLE');
                    }}
                    activeContext={voiceFlowStep === 'OVERVIEW' ? 'Guided Setup: Overview' : 'Guided Setup: Services'}
                />
            )}

            {isWizardOpen && (
                <WizardModal
                    mode={wizardMode}
                    onSwitchMode={setWizardMode}
                    onClose={() => setIsWizardOpen(false)}
                />
            )}

            {isSettingsOpen && (
                <SettingsModal onClose={() => setIsSettingsOpen(false)} />
            )}
        </div>
    );
}
