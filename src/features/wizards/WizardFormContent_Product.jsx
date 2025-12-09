
import React, { useState } from 'react';
import { WizardAutoFillBanner } from './components/WizardAutoFillBanner';
import { WizardField } from './components/WizardField';
import { WizardInput, WizardTextarea } from './components/WizardSmartInputs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from 'lucide-react';

export default function WizardFormContentProduct({ formData, onChange, activeField }) {
    const [tooltipOpen, setTooltipOpen] = useState({});

    // Mobile Tooltip Toggle
    const toggleTooltip = (id) => {
        setTooltipOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const showAutoFillBanner = formData.productName &&
        (formData.productName.toLowerCase().includes('heater') || formData.productName.toLowerCase().includes('hot water')) &&
        !formData.isContextActive &&
        !formData.autoFillDismissed;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 relative pb-32 md:pb-0">

            {/* Knowledge Found Banner */}
            {showAutoFillBanner && (
                <WizardAutoFillBanner
                    type="suggestion"
                    theme="purple"
                    title="Knowledge Found"
                    description={
                        <>I found product details for "Heater" in your <strong>Product_Catalog.pdf</strong>. Want me to auto-fill this?</>
                    }
                    onAutoFill={() => {
                        onChange('isContextActive', true);
                        onChange('contextFileName', 'Product_Catalog.pdf');
                        onChange('productName', "Premium Gas Heater 3000");
                        onChange('description', "Top-tier efficient gas heater with advanced safety features, remote control, and 5-year warranty. Suitable for large living areas.");
                        onChange('priceMode', 'fixed');
                        onChange('productPrice', "899.00");
                        onChange('autoFilledFields', { productName: true, description: true, priceMode: true, price: true });
                    }}
                    onDismiss={() => onChange('autoFillDismissed', true)}
                />
            )}

            {/* Product Name */}
            <WizardField
                label="Product Name"
                required
                tooltip="The display name of the product."
                tooltipOpen={tooltipOpen['productName']}
                onTooltipToggle={(open) => toggleTooltip('productName')}
                error={formData.errors?.productName}
            >
                <div className="relative">
                    <WizardInput
                        placeholder="e.g., Solar Panel"
                        value={formData.productName || ''}
                        onChange={(val) => {
                            onChange('productName', val);
                            if (formData.errors?.productName) {
                                onChange('errors', { ...formData.errors, productName: false });
                            }
                            if (formData.autoFilledFields?.productName) {
                                onChange('autoFilledFields', { ...formData.autoFilledFields, productName: false });
                            }
                        }}
                        className={formData.errors?.productName ? 'border-red-300 focus-visible:ring-red-200' : ''}
                        highlight={(activeField === 'productName' || formData.autoFilledFields?.productName)?.toString()}
                    />
                    {formData.autoFilledFields?.productName && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-emerald-600 animate-in fade-in bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md shadow-sm border border-emerald-100 dark:border-emerald-900/50">
                            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">AI Auto-filled</span>
                            <Sparkles className="w-3 h-3" />
                        </div>
                    )}
                </div>
            </WizardField>

            {/* Active Context Banner */}
            {formData.isContextActive && (
                <WizardAutoFillBanner
                    type="active"
                    theme="emerald" // Explicitly use active style
                    title="Active Context"
                    fileName={formData.contextFileName}
                    onRemoveContext={() => {
                        onChange('isContextActive', false);
                        onChange('contextFileName', '');
                        onChange('productName', '');
                        onChange('description', '');
                        onChange('productPrice', '');
                        onChange('priceMode', 'fixed');
                        onChange('autoFilledFields', {});
                    }}
                />
            )}

            {/* Pricing Mode & Values */}
            <div className="space-y-4">
                <WizardField
                    label="Pricing Mode"
                    required
                    tooltip="How you charge for this product."
                    tooltipOpen={tooltipOpen['priceMode']}
                    onTooltipToggle={() => toggleTooltip('priceMode')}
                    error={formData.errors?.priceMode}
                >
                    <div className="flex gap-2 mb-2 overflow-x-auto pb-1 -mx-1">
                        {['fixed', 'range', 'na'].map(m => (
                            <div key={m}
                                onClick={() => {
                                    onChange('priceMode', m);
                                    if (formData.errors?.priceMode) {
                                        onChange('errors', { ...formData.errors, priceMode: false });
                                    }
                                    if (formData.autoFilledFields?.priceMode) {
                                        onChange('autoFilledFields', { ...formData.autoFilledFields, priceMode: false });
                                    }
                                }}
                                className={`border rounded-full px-4 py-2 cursor-pointer whitespace-nowrap text-sm transition-all ${formData.priceMode === m
                                        ? (formData.autoFilledFields?.priceMode
                                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-medium ring-1 ring-emerald-500' // AI Highlight
                                            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400 font-medium ring-1 ring-blue-500')
                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                    }`}
                            >
                                {m === 'fixed' ? 'Fixed Price' : m === 'range' ? 'Price Range' : 'Not Applicable'}
                            </div>
                        ))}
                    </div>
                </WizardField>

                {formData.priceMode === 'fixed' && (
                    <WizardField
                        label="Price ($)"
                        required
                        tooltip="The cost of the product."
                        tooltipOpen={tooltipOpen['productPrice']}
                        onTooltipToggle={() => toggleTooltip('productPrice')}
                        error={formData.errors?.productPrice}
                    >
                        <div className="relative">
                            <div className="absolute left-3 top-2.5 text-slate-500 z-10">$</div>
                            <WizardInput
                                placeholder="0.00"
                                value={formData.productPrice || ''}
                                onChange={(val) => {
                                    onChange('productPrice', val);
                                    if (formData.errors?.productPrice) {
                                        onChange('errors', { ...formData.errors, productPrice: false });
                                    }
                                    if (formData.autoFilledFields?.price) {
                                        onChange('autoFilledFields', { ...formData.autoFilledFields, price: false });
                                    }
                                }}
                                className={`pl-7 ${formData.errors?.productPrice ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                                highlight={(activeField === 'productPrice' || formData.autoFilledFields?.price)?.toString()}
                            />
                            {formData.autoFilledFields?.price && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-emerald-600 animate-in fade-in bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md shadow-sm border border-emerald-100 dark:border-emerald-900/50">
                                    <Sparkles className="w-3 h-3" />
                                </div>
                            )}
                        </div>
                    </WizardField>
                )}

                {formData.priceMode === 'range' && (
                    <div className="grid grid-cols-2 gap-4">
                        <WizardField
                            label="Min Price ($)"
                            required
                            error={formData.errors?.minPrice}
                        >
                            <div className="relative">
                                <div className="absolute left-3 top-2.5 text-slate-500 z-10">$</div>
                                <WizardInput
                                    placeholder="0.00"
                                    value={formData.minPrice || ''}
                                    onChange={(val) => {
                                        onChange('minPrice', val);
                                        if (formData.errors?.minPrice) {
                                            onChange('errors', { ...formData.errors, minPrice: false });
                                        }
                                    }}
                                    className={`pl-7 ${formData.errors?.minPrice ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                                />
                            </div>
                        </WizardField>

                        <WizardField
                            label="Max Price ($)"
                            required
                            error={formData.errors?.maxPrice}
                        >
                            <div className="relative">
                                <div className="absolute left-3 top-2.5 text-slate-500 z-10">$</div>
                                <WizardInput
                                    placeholder="0.00"
                                    value={formData.maxPrice || ''}
                                    onChange={(val) => {
                                        onChange('maxPrice', val);
                                        if (formData.errors?.maxPrice) {
                                            onChange('errors', { ...formData.errors, maxPrice: false });
                                        }
                                    }}
                                    className={`pl-7 ${formData.errors?.maxPrice ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                                />
                            </div>
                        </WizardField>
                    </div>
                )}
            </div>

            {/* Description */}
            <WizardField
                label="Description"
                required
                tooltip="A detailed explanation of the product."
                tooltipOpen={tooltipOpen['description']}
                onTooltipToggle={(open) => toggleTooltip('description')}
                error={formData.errors?.description}
            >
                <div className="relative">
                    <WizardTextarea
                        placeholder="Describe the product..."
                        value={formData.description || ''}
                        onChange={(val) => {
                            onChange('description', val);
                            if (formData.errors?.description) {
                                onChange('errors', { ...formData.errors, description: false });
                            }
                            if (formData.autoFilledFields?.description) {
                                onChange('autoFilledFields', { ...formData.autoFilledFields, description: false });
                            }
                        }}
                        className={formData.errors?.description ? 'border-red-300 focus-visible:ring-red-200' : ''}
                        highlight={(activeField === 'description' || formData.autoFilledFields?.description)?.toString()}
                    />
                    {formData.autoFilledFields?.description && (
                        <div className="absolute top-2 right-12 flex items-center gap-1.5 text-emerald-600 animate-in fade-in bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md shadow-sm border border-emerald-100 dark:border-emerald-900/50">
                            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">AI Auto-filled</span>
                            <Sparkles className="w-3 h-3" />
                        </div>
                    )}
                </div>
            </WizardField>
        </div>
    );
}
