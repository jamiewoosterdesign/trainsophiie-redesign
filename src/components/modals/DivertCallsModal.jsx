import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Copy, Check, Smartphone, Phone, CheckCircle2, AlertCircle, ChevronDown, X } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

export function DivertCallsModal({
    isOpen,
    onClose,
    deviceType = 'iphone',
    onChangeDeviceType,
    divertStatus = {},
    onMarkDone
}) {
    const [copied, setCopied] = useState(false);
    const forwardingNumber = "+12183074652";
    const dialCode = `**61*${forwardingNumber}*11*15#`; // Standard AU conditional divert code

    const handleCopy = () => {
        navigator.clipboard.writeText(dialCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Don't render dialog if not open
    if (!isOpen) return null;

    const isCurrentDone = divertStatus[deviceType];

    const DeviceSelector = ({ currentType }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors outline-none mb-6">
                    <Smartphone className="w-4 h-4 text-slate-400" />
                    {currentType} Setup
                    <ChevronDown className="w-3 h-3 opacity-50 ml-1" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 z-[10002]">
                <DropdownMenuItem onClick={() => onChangeDeviceType('iphone')} className="gap-2">
                    <Smartphone className="w-4 h-4 text-slate-400" /> iPhone
                    {divertStatus.iphone && <CheckCircle2 className="w-3 h-3 text-green-500 ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onChangeDeviceType('android')} className="gap-2">
                    <Smartphone className="w-4 h-4 text-slate-400" /> Android
                    {divertStatus.android && <CheckCircle2 className="w-3 h-3 text-green-500 ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onChangeDeviceType('landline')} className="gap-2">
                    <Phone className="w-4 h-4 text-slate-400" /> Landline
                    {divertStatus.landline && <CheckCircle2 className="w-3 h-3 text-green-500 ml-auto" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    const ModalFooter = () => (
        <div className="flex items-center gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 w-full">
            <Button variant="ghost" onClick={onClose} className="text-slate-500">Close</Button>
            <Button
                onClick={() => onMarkDone(!isCurrentDone)}
                variant={isCurrentDone ? "outline" : "default"}
                className={cn(
                    "ml-auto rounded-xl px-6 transition-all",
                    isCurrentDone
                        ? "border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-white dark:bg-slate-900 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/10"
                        : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800"
                )}
            >
                {isCurrentDone ? "Mark as Inactive" : "Mark as Done"}
            </Button>
        </div>
    );

    const renderContent = () => {
        switch (deviceType) {
            case 'iphone':
                return (
                    <>
                        {/* Left Column: Instructions */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-white dark:bg-slate-950 relative z-10">
                            <div>
                                <DeviceSelector currentType="iPhone" />
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                                    Divert Calls on iPhone
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                    The quickest way to set up call diversion is by dialling a unique code.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">1</div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Open Phone App</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Go to the keypad where you normally dial numbers.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">2</div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Dial the Activation Code</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Enter the code exactly as shown:</p>
                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 w-fit group cursor-pointer hover:border-blue-300 transition-colors" onClick={handleCopy}>
                                                <code className="text-lg font-mono text-slate-900 dark:text-white font-bold tracking-wider">
                                                    {dialCode}
                                                </code>
                                                <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 text-slate-400 group-hover:text-blue-500">
                                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">3</div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Press Call</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">You should see a success message on your screen.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <ModalFooter />
                        </div>

                        {/* Right Column: Visual/Troubleshooting */}
                        <div className="hidden md:flex w-full md:w-1/2 bg-slate-50 dark:bg-slate-900/50 p-8 md:p-12 flex-col justify-center relative overflow-hidden">
                            {/* Troubleshooting Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 max-w-sm mx-auto relative z-10">
                                <div className="flex items-center gap-3 mb-4 text-amber-600 dark:text-amber-500">
                                    <AlertCircle className="w-5 h-5" />
                                    <span className="font-bold text-sm uppercase tracking-wide">Troubleshooting</span>
                                </div>
                                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Calls not diverting?</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                    Some newer iPhones have a "Live Voicemail" feature that intercepts calls before they divert.
                                </p>
                                <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-3 text-sm text-amber-900 dark:text-amber-200 border border-amber-100 dark:border-amber-800/30">
                                    <strong>Fix:</strong> Settings &gt; Phone &gt; Live Voicemail &gt; <span className="font-bold">Turn OFF</span>
                                </div>
                            </div>

                            {/* Decoration */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                        </div>
                    </>
                );
            case 'android':
                return (
                    <>
                        {/* Left Column: Instructions */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-white dark:bg-slate-950 relative z-10">
                            <div className="flex-1 flex flex-col min-h-0">
                                <div>
                                    <DeviceSelector currentType="Android" />
                                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                                        Divert Calls on Android
                                    </h2>
                                    <p className="text-base text-slate-600 dark:text-slate-400 mb-6">
                                        On Android, this is usually done via the Phone app settings.
                                    </p>

                                    {/* Scrollable Steps Container */}
                                    <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                                        {[
                                            { title: "Open Phone App", desc: "Open your standard dialer app." },
                                            { title: "Go to Settings", desc: "Tap the 3-dots menu (top right) > Settings." },
                                            { title: "Find Calling Accounts", desc: "Look for 'Calling Accounts', 'Calls', or 'Supplementary Services'." },
                                            { title: "Select Call Forwarding", desc: "Tap 'Call Forwarding' or 'Voice Call forwarding'." },
                                            { title: "Configure Options", desc: "You'll see busy, unanswered, and unreachable options." },
                                            { title: "Enter Number", desc: "For each option, enter the number below and 'Enable'." }
                                        ].map((step, idx) => (
                                            <div key={idx} className="flex gap-4">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{step.title}</h4>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{step.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 pt-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Number to Enter</p>
                                        <div className="flex items-center justify-between gap-3 group cursor-pointer" onClick={handleCopy}>
                                            <code className="text-lg font-mono text-slate-900 dark:text-white font-bold">
                                                {forwardingNumber}
                                            </code>
                                            <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 text-slate-400 group-hover:text-blue-500 transition-colors">
                                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <ModalFooter />
                        </div>

                        {/* Right Column (Instructions/Tips) */}
                        <div className="hidden md:flex w-full md:w-1/2 p-8 md:p-12 flex-col justify-center bg-slate-50 dark:bg-slate-900/50 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Which options to set?</h3>
                                <ul className="space-y-3">
                                    {[
                                        { label: "Forward when busy", sub: "Calls divert when you decline or are on another call." },
                                        { label: "Forward when unanswered", sub: "Calls divert if you don't pick up." },
                                        { label: "Forward when unreachable", sub: "Calls divert when your phone is off or out of range." }
                                    ].map((opt, i) => (
                                        <li key={i} className="flex gap-3 items-start">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                            <div>
                                                <div className="font-medium text-slate-900 dark:text-white text-sm">{opt.label}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{opt.sub}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </>
                );
            case 'landline':
                return (
                    <>
                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-white dark:bg-slate-950 relative z-10">
                            <div>
                                <DeviceSelector currentType="Landline" />
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                                    Divert Calls on Landline
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                    Landline diversion is usually handled by your network provider or VoIP settings.
                                </p>

                                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Instructions</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Contact your provider (Telstra, Optus, TPG, etc.) and ask them to set up <span className="font-semibold text-slate-900 dark:text-white">"Call Forward Busy / No Answer"</span> to the number below.
                                        </p>
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Divert Number</p>
                                        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm group cursor-pointer" onClick={handleCopy}>
                                            <code className="text-lg font-mono text-slate-900 dark:text-white font-bold">{forwardingNumber}</code>
                                            <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 text-slate-400 group-hover:text-blue-500 transition-colors">
                                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <ModalFooter />
                        </div>

                        <div className="hidden md:flex w-full md:w-1/2 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden flex-col items-center justify-center p-12">
                            <div className="text-center relative z-10">
                                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-xl mx-auto mb-6">
                                    <Phone className="w-10 h-10 text-purple-500" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Need Help?</h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                                    VoIP systems can often be configured online via your provider's portal.
                                </p>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 pointer-events-none" />
                        </div>
                    </>
                );
            default: return null;
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-slate-950 w-full h-full md:h-auto md:max-w-4xl rounded-none md:rounded-3xl shadow-none md:shadow-2xl overflow-y-auto md:overflow-hidden animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300 border-0 md:border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:min-h-[500px] relative">
                {/* Close Button - Top Right */}
                <div className="fixed md:absolute top-4 right-4 z-50">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="rounded-full bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors h-8 w-8"
                    >
                        <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </Button>
                </div>
                {renderContent()}
            </div>
        </div>,
        document.body
    );
}
