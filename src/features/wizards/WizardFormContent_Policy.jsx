
import React, { useState } from 'react';
import { WizardAutoFillBanner } from './components/WizardAutoFillBanner';
import { WizardField } from './components/WizardField';
import { WizardInput, WizardTextarea } from './components/WizardSmartInputs';

export default function WizardFormContentPolicy({ formData, onChange, activeField }) {
    const [isLoading, setIsLoading] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState({});

    // Mobile Tooltip Toggle
    const toggleTooltip = (id) => {
        setTooltipOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const isError = (field) => formData.errors?.[field];

    // Simulate AI generation for Policy
    const handleAIGenerate = (field) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            if (field === 'policyContent') {
                onChange(field, "1. All refunds must be processed within 14 days.\n2. Original receipt is required.\n3. Items must be in original packaging.");
                onChange('isContextActive', true);
                onChange('contextFileName', 'AI Generated');
            }
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 relative">

            {/* Context Active Banner */}
            {formData.isContextActive && (
                <WizardAutoFillBanner
                    type="suggestion"
                    theme="purple"
                    title="Policy Generated"
                    description="Content generated based on standard retail guidelines."
                    onDismiss={() => {
                        onChange('isContextActive', false);
                        onChange('policyContent', '');
                    }}
                />
            )}

            <div className="space-y-6">
                <WizardField
                    label="Policy Title"
                    required
                    tooltip="A short, descriptive name for this policy."
                    tooltipOpen={tooltipOpen['policyTitle']}
                    onTooltipToggle={() => toggleTooltip('policyTitle')}
                    error={isError('policyTitle')}
                >
                    <WizardInput
                        value={formData.policyTitle}
                        onChange={(val) => {
                            onChange('policyTitle', val);
                            if (isError('policyTitle')) onChange('errors', { ...formData.errors, policyTitle: false });
                        }}
                        placeholder="e.g. Refund Policy"
                        highlight={(activeField === 'policyTitle').toString()}
                        className={isError('policyTitle') ? 'border-red-300 focus-visible:ring-red-200' : ''}
                    />
                </WizardField>

                <WizardField
                    label="Policy Content"
                    required
                    tooltip="The full text of the policy that Sophiie should reference."
                    tooltipOpen={tooltipOpen['policyContent']}
                    onTooltipToggle={() => toggleTooltip('policyContent')}
                    error={isError('policyContent')}
                >
                    <WizardTextarea
                        value={formData.policyContent}
                        onChange={(val) => {
                            onChange('policyContent', val);
                            if (isError('policyContent')) onChange('errors', { ...formData.errors, policyContent: false });
                        }}
                        placeholder="Type the policy details here..."
                        highlight={(activeField === 'policyContent').toString()}
                        onAIClick={() => handleAIGenerate('policyContent')}
                        className={isError('policyContent') ? 'border-red-300 focus-visible:ring-red-200' : ''}
                    />
                </WizardField>
            </div>
        </div>
    );
}
