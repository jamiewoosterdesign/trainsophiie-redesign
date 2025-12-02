import React, { useState } from 'react';
import { X, ChevronRight, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WizardFormContent from './WizardFormContent';
import LiveSimulator from '@/features/simulator/LiveSimulator';

export default function WizardModal({ mode, onSwitchMode, onClose }) {
    const [step, setStep] = useState(1);
    const [returnToMode, setReturnToMode] = useState(null);
    const [lastStepCache, setLastStepCache] = useState({ service: 1, transfer: 1, protocol: 1 });
    const [isDirty, setIsDirty] = useState(false);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [simulatorTab, setSimulatorTab] = useState('invitation'); // 'invitation', 'voice', 'preview'
    const [activeField, setActiveField] = useState(null);

    const [formData, setFormData] = useState({
        serviceName: '',
        description: '',
        knowledgeSourceType: 'upload', // 'upload', 'kb'

        // Business Logic
        priceMode: 'fixed', // 'fixed', 'hourly', 'range', 'na'
        price: '',
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

    const getWizardTitle = () => {
        switch (mode) {
            case 'service': return 'Add New Service';
            case 'staff': return 'Add Team Member';
            case 'protocol': return 'Create Scenario';
            case 'transfer': return 'Add Transfer Rule';
            case 'document': return 'Upload Document';
            default: return 'Configuration';
        }
    };

    const getTotalSteps = () => {
        // All wizards now have 3 steps based on App-dump.jsx
        return 3;
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">

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

            <div className="bg-white w-[95vw] h-[90vh] max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">

                {/* LEFT PANEL: WIZARD FORM */}
                <div className="w-full md:w-[55%] flex flex-col border-r border-slate-200 bg-white relative z-10">

                    {/* Header */}
                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
                        <div className="flex items-center gap-3">
                            {/* Back Arrow Removed */}
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{getWizardTitle()}</h2>
                                <div className="flex items-center gap-3 mt-3">
                                    {(
                                        {
                                            service: ['Identity & Knowledge', 'Business Logic', 'Outcome'],
                                            staff: ['Personal Details', 'Role & Responsibilities', 'Transfer Logic'],
                                            protocol: ['Trigger & Condition', 'Response Logic', 'Review'],
                                            transfer: ['Rule Details', 'Handoff Message', 'Routing Logic'],
                                            document: ['Upload', 'Analyzing', 'Extraction Lab']
                                        }[mode] || ['Step 1', 'Step 2', 'Step 3']
                                    ).map((label, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2.5 h-2.5 rounded-full ${step > idx ? 'bg-blue-600' : step === idx + 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                                                <span className={`text-xs font-medium ${step === idx + 1 ? 'text-blue-700' : 'text-slate-400'}`}>{label}</span>
                                            </div>
                                            {idx < 2 && <div className="w-8 h-[1px] bg-slate-200" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <WizardFormContent
                            mode={mode}
                            step={step}
                            formData={formData}
                            onChange={updateFormData}
                            activeField={activeField}
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
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

                {/* RIGHT PANEL: LIVE SIMULATOR */}
                <div className="w-full md:w-[45%] bg-slate-50 flex flex-col relative overflow-hidden">
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
                    />
                </div>

            </div>
        </div>
    );
}
