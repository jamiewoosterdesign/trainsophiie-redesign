import React, { useState, useRef } from 'react';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { X, ChevronRight, Check, ArrowLeft, MessageSquare, Mic, MicOff, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import WizardFormContent from './WizardFormContent';
import LiveSimulator from '@/features/simulator/LiveSimulator';
import WizardEntryModal from './WizardEntryModal';


const USE_GLOBAL_VOICE_UI = true;

// Module-level variable to persist preference across modal opens but reset on page refresh
let skipEntryModalPreference = false;

export default function WizardModal({ mode, onSwitchMode, onClose, initialData }) {
    const [step, setStep] = useState(1);
    const [returnToMode, setReturnToMode] = useState(null);
    const [lastStepCache, setLastStepCache] = useState({ service: 1, transfer: 1, protocol: 1 });
    const [isDirty, setIsDirty] = useState(false);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [simulatorTab, setSimulatorTab] = useState('preview'); // Default to preview
    const [activeField, setActiveField] = useState(null);
    const [mobileTab, setMobileTab] = useState('wizard'); // 'wizard' | 'preview'
    const formScrollRef = useRef(null);
    const scrollDirection = useScrollDirection(formScrollRef);

    // Entry Modal State
    const [showEntryModal, setShowEntryModal] = useState(() => !skipEntryModalPreference && (!initialData || !initialData.id));
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
        productName: '',
        productPrice: '',
        knowledgeSourceType: 'upload', // 'upload', 'kb'

        // Business Logic
        priceMode: 'fixed', // 'fixed', 'hourly', 'range', 'na'
        price: '',
        minPrice: '',
        maxPrice: '',
        durationValue: '',
        durationUnit: 'minutes',
        callOutFee: '',
        plusGst: false,
        plusMaterials: false,
        customPriceMessage: '',
        useCustomPriceMessage: false,
        globalDefaultPriceMessage: "Prices vary based on complexity. We can provide a quote on site.",
        questions: [],

        // Outcome
        serviceOutcome: 'collect', // 'collect', 'transfer', 'booking', 'send_info'

        // Outcome: Collect
        serviceSendInfoType: 'sms',
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

        // Department Mode
        departmentName: '',
        departmentActive: true,
        departmentDescription: '',
        departmentHours: {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
        },
        departmentMembers: [],
        departmentRouting: 'Priority Order',

        // FAQ Mode
        faqQuestion: '',
        faqAnswer: '',
        // FAQ Mode
        faqQuestion: '',
        faqAnswer: '',
        faqs: [{ question: '', answer: '' }],

        // Notification Assignment Mode
        assignMemberId: '',
        assignMethodSms: false,
        assignMethodEmail: false,
        assignTags: [],
        assignSourceCall: false,
        assignSourceWebform: false,
        assignSourceChatbot: false,
        assignSourceSms: false,
        assignSourceEmail: false,

        // Merge Initial Data
        ...initialData
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
        // Return data with status: 'draft'
        onClose({ ...formData, status: 'draft' });
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
            case 'product': return 'Add New Product';
            case 'department': return 'Configure Department';
            case 'staff': return 'Add Team Member';
            case 'protocol': return 'Create Scenario';
            case 'transfer': return 'Add Transfer Rule';
            case 'document': return 'Upload Document';
            case 'policy': return 'Add Policy';
            case 'faq': return 'Add FAQ';
            case 'notification_assignment': return 'Assign Team Member';
            default: return 'Configuration';
        }
    };

    const getTotalSteps = () => {
        if (mode === 'service') return 3;
        if (mode === 'product') return 1;
        if (mode === 'department') return 1;
        if (mode === 'policy') return 1;
        if (mode === 'faq') return 1;
        if (mode === 'notification_assignment') return 1;
        // All other wizards have 3 steps
        return 3;
    };

    const validateStep = (currentStep) => {
        let newErrors = {};
        let isValid = true;

        if (mode === 'service') {
            if (currentStep === 1) {
                if (!formData.serviceName?.trim()) newErrors.serviceName = true;
                if (!formData.description?.trim()) newErrors.description = true;
                if (formData.priceMode === 'fixed' && !formData.price) newErrors.price = true;
                if (formData.priceMode === 'hourly' && !formData.price) newErrors.price = true;
                if (formData.priceMode === 'range' && !formData.price) newErrors.price = true;
            }
            if (currentStep === 3) {
                if (formData.serviceOutcome === 'send_info') {
                    // Using field names that match what was currently in the validation block, but maybe I should correct them if they are wrong?
                    // Actually, WizardFormContent_Service uses 'serviceSendInfoType'
                    if (formData.serviceSendInfoType === 'sms' && !formData.serviceSmsMessage) newErrors.serviceSmsMessage = true;
                    if (formData.serviceSendInfoType === 'email' && !formData.serviceEmailSubject) newErrors.serviceEmailSubject = true;

                    // Also support the legacy names if they were used, just in case
                    if (formData.sendInfoType === 'sms' && !formData.smsContent) newErrors.smsContent = true;
                    if (formData.sendInfoType === 'email' && !formData.emailSubject) newErrors.emailSubject = true;
                }
            }
        }

        if (mode === 'product') {
            if (!formData.productName?.trim()) newErrors.productName = "Product Name is required.";
            if (!formData.description?.trim()) newErrors.description = "Description is required.";
            if (formData.priceMode === 'fixed' && !formData.productPrice) newErrors.productPrice = "Price is required.";
            if (formData.priceMode === 'range') {
                if (!formData.minPrice) newErrors.minPrice = "Min Price is required.";
                if (!formData.maxPrice) newErrors.maxPrice = "Max Price is required.";
            }
        }

        if (mode === 'policy') {
            const hasTitle = !!formData.policyTitle?.trim();
            const hasContent = !!formData.policyContent?.trim();

            if (hasTitle && !hasContent) newErrors.policyContent = "Policy Content is required when Title is present.";
            if (!hasTitle && hasContent) newErrors.policyTitle = "Policy Title is required when Content is present.";
            if (!hasTitle && !hasContent) {
                newErrors.policyTitle = "Policy Title is required.";
                newErrors.policyContent = "Policy Content is required.";
            }
        }

        if (mode === 'faq') {
            const faqs = formData.faqs || [];
            const q = formData.faqQuestion?.trim();
            const a = formData.faqAnswer?.trim();

            if (q && !a) newErrors.faqAnswer = "Answer is required.";
            if (!q && a) newErrors.faqQuestion = "Question is required.";
            if (!q && !a && faqs.length === 0) {
                newErrors.faqQuestion = "Question is required.";
                newErrors.faqAnswer = "Answer is required.";
            }
        }

        if (mode === 'protocol' && currentStep === 1) {
            if (!formData.scenarioName?.trim()) newErrors.scenarioName = true;
            if (!formData.protocolTrigger?.trim()) newErrors.protocolTrigger = true;
        }

        setFormData(prev => ({ ...prev, errors: newErrors }));
        return isValid && Object.keys(newErrors).length === 0;
    };

    const isStepDisabled = () => {
        if (mode === 'document' && step === 1) {
            return !formData.contextFileName && !formData.isContextActive;
        }
        if (mode === 'transfer' && step === 1) {
            return !formData.transferName?.trim();
        }
        return false;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(step + 1);
        }
    };

    const handleFinish = () => {
        if (validateStep(step)) {
            if (returnToMode) {
                handleBack();
                setShowToast({ message: "Added successfully" });
                setTimeout(() => setShowToast(null), 3000);
            } else {
                onClose(formData);
            }
        }
    };

    return (
        <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200"
            onClick={(e) => {
                // Check if click is on backdrop (not the modal content)
                if (e.target === e.currentTarget) {
                    handleClose();
                }
            }}
        >

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
                <div className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-in zoom-in-95 border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">Unsaved Changes</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">You have unsaved changes. How would you like to proceed?</p>
                        <div className="flex flex-col gap-3">
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                                onClick={handleSaveAndExit}
                            >
                                Save & Exit
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full h-12 text-sm font-semibold bg-white dark:bg-slate-800 text-red-600 dark:text-slate-300 border-red-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-slate-700"
                                onClick={() => onClose()}
                            >
                                Discard Changes
                            </Button>
                            <button
                                className="w-full text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 py-3 transition-colors"
                                onClick={() => setShowSaveConfirm(false)}
                            >
                                Keep Editing
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`bg-white dark:bg-slate-900 w-full h-full md:w-[95vw] md:max-w-6xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative transition-all duration-500 ${simulatorTab === 'voice' ? 'ring-4 ring-purple-400/50 shadow-[0_0_50px_rgba(168,85,247,0.25)]' : ''} ${USE_GLOBAL_VOICE_UI && simulatorTab === 'voice' ? 'md:h-[80vh] md:mb-24' : 'md:h-[90vh]'}`}>

                {/* SHARED HEADER (Mobile Only) - Allows switching regardless of tab */}
                <div className="md:hidden flex-none">
                    <div className={`px-4 border-b border-slate-100 dark:border-slate-800 flex flex-col justify-between items-start bg-white dark:bg-slate-900 transition-all duration-300 ${scrollDirection === 'down' ? 'pt-2 pb-2 gap-2' : 'py-4 gap-4'}`}>
                        <div className="w-full">
                            <div className="flex items-center gap-3 w-full justify-between">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{getWizardTitle()}</h2>
                                </div>

                                {/* Mobile Controls (Voice & Close) */}
                                <div className="flex items-center gap-2">
                                    {/* Mobile Voice Toggle */}
                                    <div className="relative">
                                        {showVoiceTooltip && (
                                            <div className="absolute top-12 right-0 z-50 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl animate-in fade-in slide-in-from-top-2 w-40 text-center pointer-events-none">
                                                <div className="absolute -top-1 right-8 w-2 h-2 bg-slate-900 rotate-45" />
                                                Tap to toggle Voice
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setSimulatorTab(simulatorTab === 'voice' ? 'preview' : 'voice')}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-xs font-bold ${simulatorTab === 'voice'
                                                ? 'bg-purple-600 text-white shadow-md'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                                }`}
                                        >
                                            {simulatorTab === 'voice' ? <Mic className="w-3.5 h-3.5 animate-pulse" /> : <Mic className="w-3.5 h-3.5" />}
                                            {simulatorTab === 'voice' ? 'On' : 'Off'}
                                        </button>
                                    </div>

                                    <button onClick={handleClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {!['policy', 'faq', 'product', 'department', 'notification_assignment'].includes(mode) && (
                                <div className={`flex flex-wrap items-center gap-3 px-1 transition-all duration-300 overflow-hidden ${scrollDirection === 'down' ? 'max-h-0 opacity-0 mt-0' : 'max-h-20 opacity-100 mt-1'}`}>
                                    {(
                                        {
                                            service: ['Service Details', 'Conversation Flow', 'Outcome'],
                                            staff: ['Service Details', 'Conversation Flow', 'Outcome'],
                                            protocol: ['Trigger & Condition', 'Response Logic', 'Review'],
                                            transfer: ['Rule Details', 'Handoff Message', 'Routing Logic'],
                                            document: ['Upload', 'Review', 'Apply'],
                                        }[mode] || ['Step 1', 'Step 2', 'Step 3']
                                    ).map((label, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2.5 h-2.5 rounded-full ${step > idx ? 'bg-blue-600' : step === idx + 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                                                <span className={`text-xs font-medium ${step === idx + 1 ? 'text-blue-700' : 'text-slate-400'} ${step !== idx + 1 ? 'hidden' : ''}`}>{label}</span>
                                            </div>
                                            {idx < 2 && <div className="hidden sm:block w-8 h-[1px] bg-slate-200" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile Tabs */}
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-full mt-2">
                            <button
                                onClick={() => setMobileTab('wizard')}
                                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${mobileTab === 'wizard'
                                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                                    }`}
                            >
                                <Settings className="w-4 h-4" /> Set Up
                            </button>
                            <button
                                onClick={() => setMobileTab('preview')}
                                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${mobileTab === 'preview'
                                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                                    }`}
                            >
                                <MessageSquare className="w-4 h-4" /> Live Preview
                            </button>
                        </div>
                    </div>
                </div>


                {/* LEFT PANEL: WIZARD FORM (Visible if 'wizard' tab active on mobile, always on desktop) */}
                <div className={`${mobileTab === 'wizard' ? 'flex' : 'hidden'} md:flex w-full md:w-[55%] flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative z-10 flex-1 md:flex-auto min-h-0`}>

                    {/* Desktop Header (Hidden on Mobile) */}
                    <div className="hidden md:flex px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex-row justify-between items-start bg-white dark:bg-slate-900 flex-shrink-0">
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="w-full md:w-auto">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{getWizardTitle()}</h2>
                                {!['policy', 'faq', 'product', 'department', 'notification_assignment'].includes(mode) && (
                                    <div className="flex flex-wrap items-center gap-3 mt-3">
                                        {(
                                            {
                                                service: ['Service Details', 'Conversation Flow', 'Outcome'],
                                                staff: ['Service Details', 'Conversation Flow', 'Outcome'],
                                                protocol: ['Trigger & Condition', 'Response Logic', 'Review'],
                                                transfer: ['Rule Details', 'Handoff Message', 'Routing Logic'],
                                                document: ['Upload', 'Review', 'Apply'],
                                            }[mode] || ['Step 1', 'Step 2', 'Step 3']
                                        ).map((label, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2.5 h-2.5 rounded-full ${step > idx ? 'bg-blue-600' : step === idx + 1 ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                                    <span className={`text-xs font-medium ${step === idx + 1 ? 'text-blue-700 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} ${step !== idx + 1 ? 'hidden sm:inline' : ''}`}>{label}</span>
                                                </div>
                                                {idx < 2 && <div className="hidden sm:block w-8 h-[1px] bg-slate-200 dark:bg-slate-700" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Voice Toggle Button (Desktop) - Top Aligned */}
                        <div className="relative pt-1 pl-4">
                            {showVoiceTooltip && (
                                <div className="absolute top-14 right-0 z-50 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl animate-in fade-in slide-in-from-top-2 w-48 text-center pointer-events-none">
                                    <div className="absolute -top-1 right-4 w-2 h-2 bg-slate-900 rotate-45" />
                                    Toggle Voice Setup anytime here
                                </div>
                            )}
                            <button
                                onClick={() => setSimulatorTab(simulatorTab === 'voice' ? 'preview' : 'voice')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-xs font-bold ${simulatorTab === 'voice'
                                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                {simulatorTab === 'voice' ? (
                                    <>
                                        <Mic className="w-3.5 h-3.5 animate-pulse" /> Voice On
                                    </>
                                ) : (
                                    <>
                                        <Mic className="w-3.5 h-3.5" /> Voice Off
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div ref={formScrollRef} className="flex-1 overflow-y-auto p-4 pb-32 md:p-8">
                        <WizardFormContent
                            mode={mode}
                            step={step}
                            formData={formData}
                            onChange={updateFormData}
                            activeField={activeField}
                            onSwitchMode={handleSwitchMode}
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="px-4 py-4 md:px-8 md:py-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center flex-shrink-0">
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
                                isStepDisabled() ? (
                                    <TooltipProvider>
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <span tabIndex={0} className="cursor-not-allowed">
                                                    <Button onClick={handleNext} className="w-32 opacity-50 pointer-events-none">
                                                        Next <ChevronRight className="w-4 h-4 ml-1" />
                                                    </Button>
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent side="top" className="bg-slate-900 text-white border-slate-900 px-3 py-1.5 text-xs font-medium">
                                                <p>
                                                    {mode === 'document' ? "Please upload or select a document to continue." :
                                                        mode === 'transfer' ? "Please name this transfer rule to continue." :
                                                            "Please complete the required fields."}
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ) : (
                                    <Button onClick={handleNext} className="w-32">
                                        Next <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                )
                            ) : (
                                <Button className="w-32 bg-green-600 hover:bg-green-700" onClick={handleFinish}>
                                    Finish <Check className="w-4 h-4 ml-1" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: LIVE SIMULATOR (Visible if 'preview' tab active on mobile, always on desktop) */}
                <div className={`${mobileTab === 'preview' ? 'flex' : 'hidden'} md:flex w-full md:w-[45%] bg-slate-50 dark:bg-slate-950 flex-col relative overflow-hidden transition-all duration-300 md:h-auto flex-1 md:flex-auto min-h-0`}>
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
                        isMobile={true} // Hint to simulator
                        onWizardClose={handleClose}
                    />
                </div>

            </div>
        </div>
    );
}
