import React, { useState } from 'react';
import { UploadCloud, Globe, Loader2, Sparkles, Plus, Trash2, Info, FileCheck, FileCode, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { WizardAutoFillBanner } from './components/WizardAutoFillBanner';
import { WizardField } from './components/WizardField';
import { WizardInput, WizardTextarea } from './components/WizardSmartInputs';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';

export default function WizardFormContentPolicy({ formData, onChange, activeField }) {
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, processing, done, dismissed
    const [tooltipOpen, setTooltipOpen] = useState({});

    // Mobile Tooltip Toggle
    const toggleTooltip = (id, e) => {
        if (e) e.preventDefault();
        setTooltipOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const isError = (field) => formData.errors?.[field];

    // Initialize policies list if empty
    const policies = formData.policies && formData.policies.length > 0
        ? formData.policies
        : [{ title: formData.policyTitle || '', content: formData.policyContent || '', isAutoFilled: false }];

    const firstPolicyTitle = policies[0]?.title || '';
    // Show keyword suggestion banner inside the first card (legacy behavior requested to change? "put suggestion below title")
    // Use the same logic as before for keyword titles
    const showKeywordBanner = firstPolicyTitle && (firstPolicyTitle.toLowerCase().includes('heater') || firstPolicyTitle.toLowerCase().includes('hot water')) && !formData.isContextActive && !formData.autoFillDismissed;

    const updatePolicy = (index, field, value) => {
        const newPolicies = [...policies];
        newPolicies[index] = { ...newPolicies[index], [field]: value };
        // Clear auto-fill flag on edit
        if (newPolicies[index].isAutoFilled) newPolicies[index].isAutoFilled = false;

        onChange('policies', newPolicies);

        // Sync legacy fields for first item (backward compatibility)
        if (index === 0) {
            if (field === 'title') onChange('policyTitle', value);
            if (field === 'content') onChange('policyContent', value);
        }
    };

    const addPolicy = () => {
        onChange('policies', [...policies, { title: '', content: '', isAutoFilled: false }]);
    };

    const removePolicy = (index) => {
        const newPolicies = policies.filter((_, i) => i !== index);
        onChange('policies', newPolicies);
        // Sync legacy
        if (index === 0 && newPolicies.length > 0) {
            onChange('policyTitle', newPolicies[0].title);
            onChange('policyContent', newPolicies[0].content);
        }
    };

    const handleMockUpload = (type) => {
        setUploadStatus('uploading');

        // 1. Simulate Upload
        setTimeout(() => {
            setUploadStatus('processing');

            // 2. Simulate Analysis
            setTimeout(() => {
                setUploadStatus('done');
                // Don't activate context yet, wait for user to accept "Knowledge Found"
                // Store temp filename to show in green card
                onChange('tempContextFileName', type === 'upload' ? 'Standard_Operating_Procedures.pdf' : 'Compliance_Web_Export.pdf');
            }, 2000);
        }, 1500);
    };

    // Auto-fill logic from Banner
    const handleAutoFill = (source) => {
        let mockPolicies = [];

        if (source === 'keyword') {
            mockPolicies = [
                { title: "Heater Installation Standards", content: "All heater installations must comply with AS/NZS 5601. ensure proper ventilation and clearance from combustible materials.", isAutoFilled: true },
                { title: "Hot Water System Warranty", content: "5-year warranty on tank, 1-year on parts. Warranty void if not serviced annually by a licensed technician.", isAutoFilled: true },
                { title: "Gas Leak Emergency Protocol", content: "In case of gas leak, shut off main valve immediately, ventilate the area, and contact emergency services. Do not operate electrical switches.", isAutoFilled: true }
            ];
            onChange('contextFileName', 'SOP_Database');
        } else {
            // Document source
            mockPolicies = [
                { title: "PPE Requirements", content: "All field staff must wear steel-capped boots, high-vis vests, and safety glasses at all times on construction sites.", isAutoFilled: true },
                { title: "Customer Interaction Policy", content: "Staff must introduce themselves, present ID, and explain the scope of work before commencing any job.", isAutoFilled: true },
                { title: "Vehicle Usage Policy", content: "Company vehicles are for business use only. Daily logs must be maintained and any damage reported immediately.", isAutoFilled: true }
            ];
            onChange('contextFileName', formData.tempContextFileName || 'Uploaded_Doc.pdf');
        }

        onChange('isContextActive', true);
        onChange('policies', mockPolicies);
        onChange('policyTitle', mockPolicies[0].title);
        onChange('policyContent', mockPolicies[0].content);

        // If coming from upload flow, layout might change, but essentially we are now "active"
    };

    const handleDismissUpload = () => {
        setUploadStatus('idle');
        onChange('isContextActive', false);
        onChange('tempContextFileName', null);
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 relative">

            {/* Top Section: Policy Source / Upload / Analysis Status */}
            {!formData.isContextActive && uploadStatus !== 'dismissed' && (
                <div className="relative">
                    {/* Source Cards */}
                    <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">Policy Source</h3>
                        </div>

                        {uploadStatus === 'done' ? (
                            /* Knowledge Found Banner (Green Card) - Replaces Updalod Cards */
                            <WizardAutoFillBanner
                                type="suggestion"
                                theme="emerald"
                                title="Knowledge Found"
                                description={
                                    <>I found 3 relevant policies in <strong>{formData.tempContextFileName}</strong>. Want me to auto-fill them?</>
                                }
                                onAutoFill={() => handleAutoFill('document')}
                                onDismiss={handleDismissUpload}
                            />
                        ) : (
                            /* Selection Cards */
                            <div className="grid grid-cols-2 gap-4">
                                {/* Upload Card */}
                                <div
                                    onClick={() => handleMockUpload('upload')}
                                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group h-40"
                                >
                                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <UploadCloud className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-blue-500" />
                                    </div>
                                    <div className="text-center space-y-1">
                                        <div className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">Upload Document</div>
                                        <div className="text-xs text-slate-400 dark:text-slate-500">PDF, DOCX, TXT</div>
                                    </div>
                                </div>

                                {/* Web Link Card */}
                                <div
                                    onClick={() => handleMockUpload('web')}
                                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:border-purple-400 dark:hover:border-purple-600 transition-all cursor-pointer group h-40"
                                >
                                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Globe className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-purple-500" />
                                    </div>
                                    <div className="text-center space-y-1">
                                        <div className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">Web Link</div>
                                        <div className="text-xs text-slate-400 dark:text-slate-500">Extract from URL</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Uploading/Nav Overlay - ONLY covers this top section */}
                    {(uploadStatus === 'uploading' || uploadStatus === 'processing') && (
                        <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800">
                            <div className="relative mb-4">
                                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center animate-pulse">
                                    <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-1 shadow-md">
                                    <Sparkles className="w-4 h-4 text-purple-500 animate-bounce" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
                                {uploadStatus === 'uploading' ? 'Uploading...' : 'Analyzing Policies...'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-xs">
                                {uploadStatus === 'uploading' ? 'Securing your file' : 'Extracting clauses'}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Context Active Banner (Displayed if policies are populated from source) */}
            {formData.isContextActive && formData.contextFileName && (
                <WizardAutoFillBanner
                    type="active"
                    theme={formData.contextFileName?.includes('SOP') ? 'emerald' : 'purple'}
                    title={policies.length > 1 ? "Policies Generated" : "Knowledge Base Active"}
                    fileName={formData.contextFileName}
                    description={`Generated ${policies.length} policies from source.`}
                    onRemoveContext={() => {
                        onChange('isContextActive', false);
                        onChange('policies', [{ title: '', content: '' }]);
                        onChange('policyTitle', '');
                        onChange('policyContent', '');
                        setUploadStatus('idle');
                    }}
                />
            )}


            {/* Policy List */}
            <div className="space-y-6">
                {policies.map((policy, index) => (
                    <div key={index} className={`p-4 rounded-xl border transition-all duration-500 animate-in fade-in slide-in-from-bottom-2 ${policy.isAutoFilled ? 'bg-emerald-50/30 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'}`}>

                        {/* Header & Delete */}
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Policy #{index + 1}</h4>
                            {policies.length > 1 && (
                                <button
                                    onClick={() => removePolicy(index)}
                                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {/* Title Field */}
                            <div>
                                <WizardField
                                    label="Policy Title"
                                    required
                                    tooltip="A short, descriptive name for this policy."
                                    tooltipOpen={tooltipOpen[`title-${index}`]}
                                    onTooltipToggle={() => toggleTooltip(`title-${index}`)}
                                    error={index === 0 ? isError('policyTitle') : null}
                                    isAutoFilled={policy.isAutoFilled}
                                >
                                    <WizardInput
                                        value={policy.title}
                                        onChange={(val) => updatePolicy(index, 'title', val)}
                                        placeholder="e.g. Refund Policy"
                                        highlight={((activeField === 'policyTitle' && index === 0) || !!policy.isAutoFilled).toString()}
                                        className={index === 0 && isError('policyTitle') ? 'border-red-300 focus-visible:ring-red-200' : ''}
                                    />
                                </WizardField>

                                {/* Keyword Suggestion Banner - Below Title as requested */}
                                {index === 0 && showKeywordBanner && (
                                    <div className="mt-2">
                                        <WizardAutoFillBanner
                                            type="suggestion"
                                            theme="emerald"
                                            title="Knowledge Found"
                                            description={
                                                <>I found 3 relevant policies for "{firstPolicyTitle}" in your database. Auto-fill them?</>
                                            }
                                            onAutoFill={() => handleAutoFill('keyword')}
                                            onDismiss={() => onChange('autoFillDismissed', true)}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Content Field */}
                            <WizardField
                                label="Policy Content"
                                required
                                tooltip="The full text of the policy that Sophiie should reference."
                                tooltipOpen={tooltipOpen[`content-${index}`]}
                                onTooltipToggle={() => toggleTooltip(`content-${index}`)}
                                error={index === 0 ? isError('policyContent') : null}
                                isAutoFilled={policy.isAutoFilled}
                            >
                                <WizardTextarea
                                    value={policy.content}
                                    onChange={(val) => updatePolicy(index, 'content', val)}
                                    placeholder="Type the policy details here..."
                                    highlight={((activeField === 'policyContent' && index === 0) || !!policy.isAutoFilled).toString()}
                                    className={index === 0 && isError('policyContent') ? 'border-red-300 focus-visible:ring-red-200' : ''}
                                />
                            </WizardField>
                        </div>
                    </div>
                ))}

                <Button
                    variant="outline"
                    className="w-full border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={addPolicy}
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Another Policy
                </Button>
            </div>
        </div>
    );
}
