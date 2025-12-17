import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, Phone, X, RefreshCw, Loader2, PhoneCall, ChevronDown } from 'lucide-react';

export function CallSophiieModal({ isOpen, onClose }) {
    const [step, setStep] = useState('input'); // input, verify, ready, calling
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(30);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setStep('input');
            setOtp(['', '', '', '', '', '']);
            setIsLoading(false);
        }
    }, [isOpen]);

    // Countdown timer for code resend
    useEffect(() => {
        let timer;
        if (step === 'verify' && countdown > 0) {
            timer = setInterval(() => setCountdown(c => c - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [step, countdown]);

    const handleSendCode = () => {
        if (!phone) return;
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setStep('verify');
            setCountdown(30);
        }, 1500);
    };

    const handleVerifyCode = () => {
        if (otp.join('').length !== 6) return;
        setIsLoading(true);
        // Simulate Verification
        setTimeout(() => {
            setIsLoading(false);
            setStep('ready');
        }, 1500);
    };

    const handleStartCall = () => {
        setStep('calling');
        // Simulate Call Start
        setTimeout(() => {
            onClose(); // In a real app, this might trigger a persistent call UI or keep this open
        }, 3000);
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                {/* Step 1: Input Phone */}
                {step === 'input' && (
                    <div className="p-6">
                        <DialogHeader className="mb-6 space-y-3">
                            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Verify Phone Number</DialogTitle>
                            <DialogDescription className="text-slate-500 dark:text-slate-400">
                                Enter your phone number to receive a demo call from Sophiie. We'll verify ownership with a one-time code.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-slate-700 dark:text-slate-200">Phone Number</Label>
                                <div className="flex gap-3">
                                    <button className="w-[100px] flex items-center justify-between px-3 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                        <span className="text-2xl">🇦🇺</span>
                                        <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                    </button>
                                    <Input
                                        placeholder="Enter your phone number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="flex-1 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Checkbox id="save-num" className="mt-1" defaultChecked />
                                <div className="space-y-1">
                                    <Label htmlFor="save-num" className="text-sm font-medium text-slate-900 dark:text-white">Save this phone number to my account</Label>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Keep this number saved to receive demo calls anytime in the future. Otherwise, it will only be used for this one-time demo.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button variant="ghost" onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">Cancel</Button>
                                <Button onClick={handleSendCode} disabled={!phone || isLoading} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Code'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Verify Code */}
                {step === 'verify' && (
                    <div className="p-6">
                        <DialogHeader className="mb-6 space-y-3">
                            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Enter Verification Code</DialogTitle>
                            <DialogDescription className="text-slate-500 dark:text-slate-400">
                                We sent a 6-digit verification code to <span className="font-semibold text-slate-900 dark:text-white">{phone}</span>. Enter it below to confirm ownership.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-8">
                            <div className="flex justify-between gap-2">
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        id={`otp-${idx}`}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(idx, e)}
                                        className="w-12 h-14 text-center text-2xl font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                ))}
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Resend in {countdown}s
                                </p>
                                <div className="flex gap-3">
                                    <Button variant="ghost" onClick={() => setStep('input')} className="text-slate-500 hover:text-slate-700 dark:text-slate-400">Use different number</Button>
                                    <Button onClick={handleVerifyCode} disabled={otp.some(d => !d) || isLoading} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]">
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Ready to Call */}
                {(step === 'ready' || step === 'calling') && (
                    <div className="p-0">
                        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 flex items-center justify-center gap-2 border-b border-emerald-100 dark:border-emerald-900/30">
                            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1 rounded-full">
                                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Phone Verified!</span>
                        </div>

                        <div className="p-8 flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <PhoneCall className="w-8 h-8" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Try a demo call</h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                    Sophiie will call you at <span className="font-semibold text-slate-900 dark:text-white">{phone}</span>.
                                    <br />
                                    <span className="text-sm mt-1 block px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md inline-block mt-2">
                                        After this call, you will have <span className="font-bold text-slate-900 dark:text-white">5 demo calls</span> remaining.
                                    </span>
                                </p>
                            </div>

                            <div className="flex gap-3 w-full pt-2">
                                <Button variant="outline" onClick={onClose} className="flex-1 border-slate-200 dark:border-slate-800 bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                                    Cancel
                                </Button>
                                <Button onClick={handleStartCall} disabled={step === 'calling'} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2">
                                    {step === 'calling' ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" /> Calling...
                                        </>
                                    ) : (
                                        <>
                                            <Phone className="w-4 h-4" /> Start Demo Call
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
