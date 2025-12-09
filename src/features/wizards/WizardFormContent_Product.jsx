
import React, { useState } from 'react';
import { WizardAutoFillBanner } from './components/WizardAutoFillBanner';
import { WizardField } from './components/WizardField';
import { WizardInput, WizardTextarea } from './components/WizardSmartInputs';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles, HelpCircle, Plus, ChevronDown, X, Trash2, FileText, Upload, Info } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function WizardFormContentProduct({ formData, onChange, activeField, onSwitchMode }) {
    const [tooltipOpen, setTooltipOpen] = useState({});
    const [addFaqOpen, setAddFaqOpen] = useState(false);
    const addFaqRef = React.useRef(null);

    React.useEffect(() => {
        function handleClickOutside(event) {
            if (addFaqRef.current && !addFaqRef.current.contains(event.target)) {
                setAddFaqOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [addFaqRef]);

    // Mobile Tooltip Toggle
    const toggleTooltip = (id) => {
        setTooltipOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleAddFaqFromKb = () => {
        const newFaqs = [...(formData.productFaqs || []), {
            question: "What is the warranty period?",
            answer: "This product comes with a standard 2-year manufacturer warranty covering parts and labor."
        }];
        onChange('productFaqs', newFaqs);
    };

    const handleDismissFaq = (index) => {
        const newFaqs = [...(formData.productFaqs || [])];
        newFaqs.splice(index, 1);
        onChange('productFaqs', newFaqs);
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
                    <div className="flex gap-2 mb-2 overflow-x-auto p-1 -m-1">
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

            {/* Product FAQs */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
                            <HelpCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Product FAQs</h3>
                                <TooltipProvider>
                                    <Tooltip
                                        delayDuration={0}
                                        open={tooltipOpen['productFaqs']}
                                        onOpenChange={() => toggleTooltip('productFaqs')}
                                    >
                                        <TooltipTrigger asChild onClick={(e) => {
                                            e.preventDefault();
                                            toggleTooltip('productFaqs');
                                        }}>
                                            <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-slate-900 text-white border-slate-900">
                                            <p>Add Answers to frequently asked questions about this product</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Add frequently asked questions about this product</p>
                        </div>
                    </div>

                    {/* Custom Dropdown Button */}
                    <div className="relative self-end sm:self-auto" ref={addFaqRef}>
                        <Button
                            variant="outline"
                            onClick={() => setAddFaqOpen(!addFaqOpen)}
                            className="bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 hover:text-sky-800 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800 dark:hover:bg-sky-900/40 gap-0 pl-3 pr-2 h-9"
                        >
                            <span className="pr-3 border-r border-sky-200 dark:border-sky-800 mr-2 flex items-center font-medium">
                                <Plus className="w-4 h-4 mr-2" />
                                Add FAQ
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${addFaqOpen ? 'rotate-180' : ''}`} />
                        </Button>

                        {addFaqOpen && (
                            <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 dark:bg-slate-900 dark:border-slate-800">
                                <div className="p-1">
                                    <button
                                        onClick={() => {
                                            handleAddFaqFromKb();
                                            setAddFaqOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-slate-700 dark:text-slate-200"
                                    >
                                        <FileText className="w-4 h-4 text-slate-400" />
                                        From Knowledge Base
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (onSwitchMode) onSwitchMode('document');
                                            setAddFaqOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-slate-700 dark:text-slate-200"
                                    >
                                        <Upload className="w-4 h-4 text-slate-400" />
                                        Upload Document
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* FAQ List */}
                {formData.productFaqs && formData.productFaqs.length > 0 && (
                    <div className="grid gap-3 pt-2">
                        {formData.productFaqs.map((faq, index) => (
                            <div key={index} className="relative group p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={() => handleDismissFaq(index)}
                                    className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                    title="Remove FAQ"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <h4 className="font-medium text-slate-900 dark:text-slate-200 pr-8 mb-1">{faq.question}</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
