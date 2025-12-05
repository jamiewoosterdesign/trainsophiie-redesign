import React, { useState } from 'react';
import { X, ChevronRight, Check, ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WizardFormContent from './WizardFormContent';
import LiveSimulator from '@/features/simulator/LiveSimulator';
import WizardEntryModal from './WizardEntryModal';


const USE_GLOBAL_VOICE_UI = true;

// Module-level variable to persist preference across modal opens but reset on page refresh
let skipEntryModalPreference = false;

export default function WizardModal({ mode, onSwitchMode, onClose }) {
    const [step, setStep] = useState(1);
    const [returnToMode, setReturnToMode] = useState(null);
    const [lastStepCache, setLastStepCache] = useState({ service: 1, transfer: 1, protocol: 1 });
    const [isDirty, setIsDirty] = useState(false);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [simulatorTab, setSimulatorTab] = useState('preview'); // Default to preview
    const [activeField, setActiveField] = useState(null);
    const [isMobileSimulatorOpen, setIsMobileSimulatorOpen] = useState(false);

    // Entry Modal State
    const [showEntryModal, setShowEntryModal] = useState(() => !skipEntryModalPreference);
    const [showVoiceTooltip, setShowVoiceTooltip] = useState(false);
    const [showToast, setShowToast] = useState(null);

    // Trigger tooltip if modal is skipped on mount
    React.useEffect(() => {
        if (!showEntryModal) {
            setShowVoiceTooltip(true);
            setTimeout(() => setShowVoiceTooltip(false), 5000);
        }
    }, []);

    const [formData, setFormData] = useState({
        serviceName: '',
        description: '',
        knowledgeSourceType: 'upload', // 'upload', 'kb'

        // Business Logic
        priceMode: 'fixed', // 'fixed', 'hourly', 'range', 'na'
        price: '',
        durationValue: '',
        durationUnit: 'minutes',
        customPriceMessage: '',
        useCustomPriceMessage: false,
        questions: [],

        // Outcome
        serviceOutcome: 'collect', // 'collect', 'transfer', 'booking', 'send_info'

        // Outcome: Collect
        serviceSendInfoType: 'team',
        serviceSendInfoValue: '',
        serviceClosingScript: '',

        // Outcome: Transfer
        serviceDestinationType: 'staff',
        serviceDestinationValue: '',

        // Outcome: Booking
        bookingLink: '',

        // Outcome: Send Info
        infoSource: '',
        sendInfoEmail: '',
        sendInfoPhone: '',
        sendInfoMessage: '',
        smsTemplates: [
            { id: '1', name: 'generic call back 24hr', content: 'thanks for calling we will get back to asap, usually within 24 hours.' }
        ],

        // Legacy / Other Modes (Keep for now to avoid breaking other wizards)
        staffName: '',
        staffRole: '',
        staffResp: '',
        scenarioName: '',
        protocolTrigger: '',
        protocolTriggerType: 'keyword',
        protocolAction: 'collect',
        protocolScript: '',
        protocolDestinationType: 'staff',
        protocolDestinationValue: '',
        transferName: '',
        transferType: 'warm',
        transferSummary: 'Hi, I have {Caller Name} on the line who needs assistance with {Reason}. They mentioned {Key Details}.',
        transferDestinationType: 'staff',
        transferDestinationValue: '',

        // Policy Mode
        policyName: '',
        policyContent: '',
    });

    const updateFormData = (field, value) => {
        if (simulatorTab === 'invitation') {
            setSimulatorTab('preview');
        }
        setFormData(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const updateFormFields = (fields) => {
        if (simulatorTab === 'invitation') {
            setSimulatorTab('preview');
        }
        setFormData(prev => ({ ...prev, ...fields }));
        setIsDirty(true);
    };

    const handleClose = () => {
        if (isDirty) {
            setShowSaveConfirm(true);
        } else {
            onClose();
        }
    };

    const handleSwitchMode = (newMode) => {
        setReturnToMode(mode);
        setLastStepCache(prev => ({ ...prev, [mode]: step }));
        onSwitchMode(newMode);
        setStep(1);
    };

    const handleBack = () => {
        if (returnToMode) {
            onSwitchMode(returnToMode);
            setStep(lastStepCache[returnToMode] || 1);
            setReturnToMode(null);
        } else if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSaveAndExit = () => {
        // In a real app, this would save the draft.
        // For now, we just close.
        onClose();
    };

    const handleEntryModeSelect = (selectedMode, dontShowAgain) => {
        setShowEntryModal(false);
        if (selectedMode === 'voice') {
            setSimulatorTab('voice');
        } else {
            setSimulatorTab('preview');
        }

        if (dontShowAgain) {
            skipEntryModalPreference = true;
            setShowToast({ message: "Preference saved. You can change this in Settings." });
            setTimeout(() => setShowToast(null), 3000);
        }

        // Trigger tooltip
        setShowVoiceTooltip(true);
        setTimeout(() => setShowVoiceTooltip(false), 5000); // Hide after 5s
    };

    const getWizardTitle = () => {
        switch (mode) {
            case 'service': return 'Add New Service';
            case 'staff': return 'Add Team Member';
            case 'protocol': return 'Create Scenario';
            case 'transfer': return 'Add Transfer Rule';
            case 'document': return 'Upload Document';
            case 'policy': return 'Add Policy';
            default: return 'Configuration';
        }
    };

    const getTotalSteps = () => {
        if (mode === 'service') return 2;
        if (mode === 'policy') return 1;
        // All other wizards have 3 steps
        return 3;
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">

            {/* Toast Notification */}
            {showToast && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[70] bg-slate-900 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium animate-in slide-in-from-top-2 fade-in duration-300 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    {showToast.message}
                </div>
            )}

            {/* Entry Modal Overlay */}
            {showEntryModal && (
                <WizardEntryModal
                    onSelectMode={handleEntryModeSelect}
                    onClose={(dontShowAgain) => {
                        setShowEntryModal(false);
                        if (dontShowAgain) {
                            skipEntryModalPreference = true;
                            setShowToast({ message: "Preference saved. You can change this in Settings." });
                            setTimeout(() => setShowToast(null), 3000);
                        }
                        setShowVoiceTooltip(true);
                        setTimeout(() => setShowVoiceTooltip(false), 5000);
                    }}
                />
            )}

            {/* Save Confirmation Dialog */}
            {showSaveConfirm && (
                <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/20">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-96 animate-in zoom-in-95">
                        <h3 className="font-bold text-lg mb-2">Unsaved Changes</h3>
                        <p className="text-sm text-slate-500 mb-6">You have unsaved changes. How would you like to proceed?</p>
                        <div className="flex flex-col gap-3">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11" onClick={handleSaveAndExit}>Save & Exit</Button>
                            <Button variant="danger" className="w-full h-11 bg-white" onClick={onClose}>Discard Changes</Button>
                            <button
                                className="w-full text-sm text-slate-400 hover:text-slate-600 mt-2 transition-colors"
                                onClick={() => setShowSaveConfirm(false)}
                            >
                                Keep Editing
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`bg-white w-full h-full md:w-[95vw] md:max-w-6xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative transition-all duration-500 ${simulatorTab === 'voice' ? 'ring-4 ring-purple-400/50 shadow-[0_0_50px_rgba(168,85,247,0.25)]' : ''} ${USE_GLOBAL_VOICE_UI && simulatorTab === 'voice' ? 'md:h-[80vh] md:mb-24' : 'md:h-[90vh]'}`}>

                {/* LEFT PANEL: WIZARD FORM */}
                <div className="w-full md:w-[55%] flex flex-col border-r border-slate-200 bg-white relative z-10 h-full">

                    {/* Header */}
                    <div className="px-4 py-4 md:px-8 md:py-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-white flex-shrink-0 gap-4 md:gap-0">
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {/* Back Arrow Removed */}
                            <div className="w-full md:w-auto">
                                <div className="flex justify-between items-center w-full md:w-auto">
                                    <h2 className="text-xl font-bold text-slate-900">{getWizardTitle()}</h2>
                                    <div className="flex items-center gap-2 md:hidden">
                                        <button
                                            onClick={() => setIsMobileSimulatorOpen(!isMobileSimulatorOpen)}
                                            className={`p-2 rounded-full transition-colors ${isMobileSimulatorOpen ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-100 text-slate-400'}`}
                                        >
                                            <MessageSquare className="w-6 h-6" />
                                        </button>
                                        <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 mt-3">
                                    {(
                                        {
                                            service: ['Service Details', 'Outcome'],
                                            staff: ['Personal Details', 'Role & Responsibilities', 'Transfer Logic'],
                                            protocol: ['Trigger & Condition', 'Response Logic', 'Review'],
                                            transfer: ['Rule Details', 'Handoff Message', 'Routing Logic'],
                                            document: ['Upload', 'Analyzing', 'Extraction Lab'],
                                            policy: ['Policy Details']
                                        }[mode] || ['Step 1', 'Step 2', 'Step 3']
                                    ).map((label, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2.5 h-2.5 rounded-full ${step > idx ? 'bg-blue-600' : step === idx + 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                                                <span className={`text-xs font-medium ${step === idx + 1 ? 'text-blue-700' : 'text-slate-400'} ${step !== idx + 1 ? 'hidden sm:inline' : ''}`}>{label}</span>
                                            </div>
                                            {idx < 2 && <div className="hidden sm:block w-8 h-[1px] bg-slate-200" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button onClick={handleClose} className="hidden md:block p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8">
                        <WizardFormContent
                            mode={mode}
                            step={step}
                            formData={formData}
                            onChange={updateFormData}
                            activeField={activeField}
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="px-4 py-4 md:px-8 md:py-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center flex-shrink-0">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={step === 1 && !returnToMode}
                            className={step === 1 && !returnToMode ? "opacity-50 cursor-not-allowed" : ""}
                        >
                            Back
                        </Button>
                        <div className="flex gap-3">
                            {step < getTotalSteps() ? (
                                <Button onClick={() => setStep(step + 1)} className="w-32">
                                    Next <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            ) : (
                                <Button className="w-32 bg-green-600 hover:bg-green-700" onClick={onClose}>
                                    Finish <Check className="w-4 h-4 ml-1" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: LIVE SIMULATOR (Desktop & Mobile Toggle) */}
                <div className={`${isMobileSimulatorOpen ? 'flex absolute inset-0 z-20' : 'hidden'} md:flex w-full md:w-[45%] bg-slate-50 flex-col relative overflow-hidden transition-all duration-300`}>
                    {/* Mobile Close Button for Simulator */}
                    <div className="md:hidden absolute top-4 right-4 z-30">
                        <button
                            onClick={() => setIsMobileSimulatorOpen(false)}
                            className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm text-slate-500 hover:text-slate-900"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <LiveSimulator
                        mode={mode}
                        formData={formData}
                        step={step}
                        onChange={updateFormData}
                        updateFormFields={updateFormFields}
                        onStepAdvance={(s) => setStep(s)}
                        simulatorTab={simulatorTab}
                        setSimulatorTab={setSimulatorTab}
                        setActiveField={setActiveField}
                        showVoiceTooltip={showVoiceTooltip}
                    />
                </div>

            </div>
        </div>
    );
}
