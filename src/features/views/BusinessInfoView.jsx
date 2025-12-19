import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Upload, Clock, Plus, Trash2, Globe, RefreshCw, ChevronUp, ChevronDown, Check, Instagram, Twitter, Facebook, Linkedin, Wand2, ArrowRight, Settings, Mic, MapPin, Info, FileText, Pencil, Link, X, AlertTriangle, Loader2, Sparkles, Scan, Bot, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';
import { PageSectionNav } from '@/components/shared/PageSectionNav';
import { WizardTextarea } from '@/features/wizards/components/WizardSmartInputs';
import { useDemo } from '@/context/DemoContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SHORT_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Generate 30-minute intervals for the dropdown
const TIME_OPTIONS = [];
for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
        const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
        const ampm = i < 12 ? 'AM' : 'PM';
        const minute = j === 0 ? '00' : '30';
        const value = `${i.toString().padStart(2, '0')}:${minute}`;
        const label = `${hour}:${minute} ${ampm}`;
        TIME_OPTIONS.push({ value, label });
    }
}

// Initial data state
const INITIAL_DATA = {
    // Basic Information
    companyName: 'Vision Electrical',
    publicEmail: 'info@visionelectrical.com.au',
    businessPhone: '434 998 497',
    phoneCountry: 'au',
    website: 'https://visionelectrical.com.au/',
    country: 'au',
    currency: 'aud',

    // Branding
    logo: null,

    // Social Profiles (some left empty for demo)
    instagram: '',
    twitter: '',
    facebook: '',
    linkedin: '',

    // Business Description (empty for demo)
    description: '',

    // Location
    locationType: 'fixed',
    businessAddress: '17-19 Ereton Dr, Arundel QLD 4214, Australia',
    landmark: '',
    baseLocation: '',
    travelRadius: '',
    serviceAreas: 'Gold Coast\nTweed Heads\nBrisbane City\nSurfers Paradise\nBroadbeach\nBroadbeach Waters\nMermaid Beach',
    exceptions: '',

    // Additional Details
    mainCategory: 'electricians',
    serviceTypes: ['Domestic', 'Commercial'],
    yearFounded: '2010',
    experience: 15,

    // Trading Hours
    schedules: [
        { id: 1, days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], start: '09:00', end: '17:00' }
    ],
    timezone: 'brisbane'
};

export default function BusinessInfoView() {
    const navigate = useNavigate();
    const { startGlobalVoiceFlow } = useOutletContext();
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);
    const { currentProfile } = useDemo();

    // --- State Management ---
    const [formData, setFormData] = useState(currentProfile.businessInfo);
    const [initialData, setInitialData] = useState(currentProfile.businessInfo); // For dirty checking
    const [sourceUrl, setSourceUrl] = useState('visionelectrical.com.au');
    const [isEditingUrl, setIsEditingUrl] = useState(false);
    const [showAnalysisWarning, setShowAnalysisWarning] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisMode, setAnalysisMode] = useState('auto'); // 'auto' | 'review'
    const [showToast, setShowToast] = useState(null); // { message: string }

    useEffect(() => {
        setFormData(currentProfile.businessInfo);
        setInitialData(currentProfile.businessInfo);
    }, [currentProfile.id]);

    const [activeSection, setActiveSection] = useState(null);
    const [collapsed, setCollapsed] = useState({});

    const toggleSection = (id) => {
        setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // --- Validation & Completeness Logic ---
    const isBasicInfoComplete = useMemo(() => {
        return !!(
            formData.companyName?.trim() &&
            formData.publicEmail?.trim() &&
            formData.businessPhone?.trim() &&
            formData.website?.trim()
        );
    }, [formData.companyName, formData.publicEmail, formData.businessPhone, formData.website]);

    const isBrandingComplete = useMemo(() => {
        // For prototype, branding is optional but we'll mark it complete if logo exists
        return true; // Always complete for now
    }, [formData.logo]);

    const isSocialComplete = useMemo(() => {
        // At least one social profile filled
        return !!(
            formData.instagram?.trim() ||
            formData.twitter?.trim() ||
            formData.facebook?.trim() ||
            formData.linkedin?.trim()
        );
    }, [formData.instagram, formData.twitter, formData.facebook, formData.linkedin]);

    const isDescriptionComplete = useMemo(() => {
        return !!(formData.description?.trim() && formData.description.length > 20);
    }, [formData.description]);

    const isLocationComplete = useMemo(() => {
        if (formData.locationType === 'fixed') {
            return !!formData.businessAddress?.trim();
        } else if (formData.locationType === 'mobile') {
            return !!(formData.baseLocation?.trim() && formData.serviceAreas?.trim());
        } else {
            return true; // Remote/online needs no location
        }
    }, [formData.locationType, formData.businessAddress, formData.baseLocation, formData.serviceAreas]);

    const isAdditionalDetailsComplete = useMemo(() => {
        return !!(
            formData.mainCategory &&
            formData.serviceTypes?.length > 0 &&
            formData.yearFounded
        );
    }, [formData.mainCategory, formData.serviceTypes, formData.yearFounded]);

    const isTradingHoursComplete = useMemo(() => {
        // At least one schedule with at least one day
        return formData.schedules?.some(s => s.days.length > 0);
    }, [formData.schedules]);

    // Define sections for navigation
    const sections = useMemo(() => [
        { id: 'basic-info', title: 'Basic Information', isComplete: isBasicInfoComplete },
        { id: 'branding', title: 'Branding', isComplete: isBrandingComplete },
        { id: 'social', title: 'Social Profiles', isComplete: isSocialComplete },
        { id: 'description', title: 'Description', isComplete: isDescriptionComplete },
        { id: 'location', title: 'Location', isComplete: isLocationComplete },
        { id: 'additional', title: 'Additional Details', isComplete: isAdditionalDetailsComplete },
        { id: 'trading-hours', title: 'Trading Hours', isComplete: isTradingHoursComplete },
    ], [isBasicInfoComplete, isBrandingComplete, isSocialComplete, isDescriptionComplete, isLocationComplete, isAdditionalDetailsComplete, isTradingHoursComplete]);

    // Dirty state check
    const isDirty = useMemo(() => {
        return JSON.stringify(formData) !== JSON.stringify(initialData);
    }, [formData, initialData]);

    // --- Handlers ---
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleScheduleChange = (schedules) => {
        setFormData(prev => ({ ...prev, schedules }));
    };

    const handleSave = () => {
        console.log('Saving form data:', formData);
        // TODO: Implement actual save logic
    };

    // --- Schedule Logic (from original) ---
    // --- Schedule Logic (from original) ---

    const toggleDay = (scheduleId, day) => {
        const newSchedules = formData.schedules.map(schedule => {
            if (schedule.id === scheduleId) {
                if (schedule.days.includes(day)) {
                    return { ...schedule, days: schedule.days.filter(d => d !== day) };
                } else {
                    return { ...schedule, days: [...schedule.days, day] };
                }
            } else {
                return { ...schedule, days: schedule.days.filter(d => d !== day) };
            }
        });
        handleScheduleChange(newSchedules);
    };

    const addSchedule = () => {
        const newId = Math.max(0, ...formData.schedules.map(s => s.id)) + 1;
        handleScheduleChange([...formData.schedules, { id: newId, days: [], start: '09:00', end: '17:00' }]);
    };

    const removeSchedule = (id) => {
        handleScheduleChange(formData.schedules.filter(s => s.id !== id));
    };

    const updateTime = (id, field, value) => {
        handleScheduleChange(formData.schedules.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const toggleServiceType = (type) => {
        if (formData.serviceTypes.includes(type)) {
            handleChange('serviceTypes', formData.serviceTypes.filter(t => t !== type));
        } else {
            handleChange('serviceTypes', [...formData.serviceTypes, type]);
        }
    };

    const assignedDays = formData.schedules.flatMap(s => s.days);
    const closedDays = DAYS.filter(d => !assignedDays.includes(d));

    // --- Analysis Logic ---
    const handleUrlSave = () => {
        setIsEditingUrl(false);
        setShowAnalysisWarning(true);
    };

    const handleRefresh = () => {
        startAnalysis('auto'); // Or 'review', depending on desired default for refresh
    };

    const startAnalysis = (mode) => {
        setAnalysisMode(mode);
        setShowAnalysisWarning(false);
        setIsAnalyzing(true);

        // Simulate analysis
        setTimeout(() => {
            setIsAnalyzing(false);

            // Mock update data
            const newData = {
                ...formData,
                description: "Vision Electrical is a premier electrical service provider based in Arundel, QLD. Established in 2010, we specialise in domestic and commercial electrical solutions including solar panel installation, air conditioning, and general maintenance. We pride ourselves on quick response times and high-quality workmanship.",
                companyName: "Vision Electrical Pty Ltd",
                businessPhone: "0434 998 497",
                facebook: "visionelectrical_qld",
                instagram: "vision_electrical",
                linkedin: "vision-electrical-services",
                yearFounded: "2010",
                serviceTypes: [...formData.serviceTypes, 'Solar', 'Air Conditioning']
            };

            setFormData(newData);
            setShowToast({ message: "Website analyzed and business info updated" });
            setTimeout(() => setShowToast(null), 3000);

            if (mode === 'review') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 3000);
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300 relative">
            {/* Toast Notification */}
            {
                showToast && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[70] bg-slate-900 text-white px-3 py-3 md:py-2 rounded-xl md:rounded-full shadow-lg text-xs sm:text-sm font-medium animate-in slide-in-from-top-2 fade-in duration-300 flex items-center justify-center gap-2 w-[calc(100%-16px)] md:w-auto text-center whitespace-nowrap">
                        <Check className="w-4 h-4 text-green-400" />
                        {showToast.message}
                    </div>
                )
            }

            {/* Analysis Overlay */}
            {isAnalyzing && (
                <div className="absolute inset-0 z-[100] bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
                    <div className="flex flex-col items-center justify-center max-w-sm text-center p-8 space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
                            <div className="relative w-20 h-20 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden">
                                <Scan className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-[pulse_3s_ease-in-out_infinite]" />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-[shimmer_2s_infinite] -translate-y-full" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full border border-white dark:border-slate-800 shadow-sm animate-bounce">
                                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Analyzing Website...</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Retrieving business details, branding, and services from <span className="font-medium text-slate-700 dark:text-slate-300">{sourceUrl}</span>
                            </p>
                        </div>

                        <div className="w-64 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-[loading_2s_ease-in-out_infinite] w-1/2 rounded-full" />
                        </div>
                    </div>
                </div>
            )}

            {/* Warning Modal */}
            {showAnalysisWarning && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg p-0 overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
                        <div className="p-6 pb-0 flex gap-5">
                            <div className="hidden sm:flex w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/20 items-center justify-center flex-shrink-0 text-amber-600 dark:text-amber-500">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div className="flex-1 pt-1">
                                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Overwrite Business Info?</h3>
                                <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                                    Sourcing data from this website will <span className="font-semibold text-slate-700 dark:text-slate-200">overwrite your existing business information</span> with automated findings.
                                </p>

                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 mb-6 border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-start gap-3">
                                        <Bot className="w-5 h-5 text-purple-500 mt-0.5" />
                                        <div className="text-sm">
                                            <p className="font-medium text-slate-900 dark:text-white mb-1">AI Data Extraction</p>
                                            <p className="text-slate-500 dark:text-slate-400">We'll identify your address, contact details, service areas, and business description automatically.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowAnalysisWarning(false)}
                                className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => startAnalysis('review')}
                                className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                Manually Review
                            </Button>
                            <Button
                                onClick={() => startAnalysis('auto')}
                                className="bg-brand-navy hover:bg-brand-navy/90 text-white"
                            >
                                Auto Apply Changes
                            </Button>
                        </div>

                        <button
                            onClick={() => setShowAnalysisWarning(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            <PageHeader
                title="Business Information"
                subtitle="Configure your business information"
                scrollDirection={scrollDirection}
            >
                <Button
                    className="w-full md:w-auto bg-brand-navy hover:bg-brand-navy/90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    disabled={!isDirty}
                    onClick={handleSave}
                >
                    Save Changes
                </Button>
            </PageHeader>

            <div ref={scrollRef} className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950">
                {/* Page Section Navigation */}
                <PageSectionNav
                    sections={sections}
                    activeSection={activeSection}
                    onNavigate={setActiveSection}
                />

                <div className="p-4 md:p-8 space-y-8">
                    <div className="max-w-7xl mx-auto w-full space-y-8">
                        <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                        {/* Data Source Banner */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                            <div className="p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-100 dark:border-slate-800">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1 flex-1">
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            Data Sourced from Website
                                        </h3>

                                        {isEditingUrl ? (
                                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                                                <div className="relative">
                                                    <Link className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                                    <Input
                                                        value={sourceUrl}
                                                        onChange={(e) => setSourceUrl(e.target.value)}
                                                        className="h-8 pl-8 w-64 bg-slate-50 border-slate-200 focus-visible:ring-brand-navy text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus-visible:ring-brand-navy"
                                                        autoFocus
                                                    />
                                                </div>
                                                <Button size="sm" onClick={handleUrlSave} className="h-8 px-3 bg-brand-navy text-white hover:bg-brand-navy/90 text-xs shadow-sm">
                                                    Save
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => setIsEditingUrl(false)} className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 group w-fit">
                                                Source: <span className="font-medium text-slate-700 dark:text-slate-300">{sourceUrl}</span>
                                                <button
                                                    onClick={() => setIsEditingUrl(true)}
                                                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600 transition-all p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    title="Edit URL"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                                    <Button variant="secondary" className="flex-1 md:flex-none gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm dark:bg-transparent dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
                                        <Upload className="w-4 h-4" /> Upload Doc
                                    </Button>
                                    <Button onClick={handleRefresh} className="flex-1 md:flex-none gap-2 bg-brand-navy hover:bg-brand-navy/90 text-white shadow-md shadow-brand-navy/10 transition-all">
                                        <RefreshCw className="w-4 h-4" /> Refresh from URL
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <Card id="basic-info" className="dark:bg-slate-900 dark:border-slate-800 scroll-mt-24 overflow-hidden">
                            <div
                                onClick={() => toggleSection('basic-info')}
                                className="relative p-6 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-row items-center justify-between">
                                    <div className="space-y-0.5">
                                        <h2 className="font-bold text-lg text-slate-900 dark:text-white">Basic Information</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Essential business details</p>
                                    </div>
                                    <div className="pl-4">
                                        <div className={cn(
                                            "px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
                                            isBasicInfoComplete
                                                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                                : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                                        )}>
                                            {isBasicInfoComplete ? "Done" : "Required"}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-6 right-6 md:static text-slate-400">
                                    {collapsed['basic-info'] ? <ChevronDown /> : <ChevronUp />}
                                </div>
                            </div>

                            {!collapsed['basic-info'] && (
                                <div className="p-6 pt-0 animate-in slide-in-from-top-2">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300">Company Name</Label>
                                            <Input placeholder="e.g. Vision Electrical" value={formData.companyName} onChange={(e) => handleChange('companyName', e.target.value)} className="bg-white dark:bg-slate-800 dark:border-slate-700" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300">Public Email</Label>
                                            <Input placeholder="info@example.com" value={formData.publicEmail} onChange={(e) => handleChange('publicEmail', e.target.value)} className="bg-white dark:bg-slate-800 dark:border-slate-700" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300">Business Phone</Label>
                                            <div className="flex gap-2">
                                                <div className="w-24 flex-shrink-0">
                                                    <Select defaultValue="au">
                                                        <SelectTrigger className="bg-white dark:bg-slate-800 dark:border-slate-700">
                                                            <SelectValue placeholder="Country" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="au">🇦🇺 +61</SelectItem>
                                                            <SelectItem value="us">🇺🇸 +1</SelectItem>
                                                            <SelectItem value="uk">🇬🇧 +44</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <Input placeholder="434 998 497" value={formData.businessPhone} onChange={(e) => handleChange('businessPhone', e.target.value)} className="bg-white dark:bg-slate-800 dark:border-slate-700" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300">Website</Label>
                                            <Input placeholder="https://example.com" value={formData.website} onChange={(e) => handleChange('website', e.target.value)} className="bg-white dark:bg-slate-800 dark:border-slate-700" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300">Country</Label>
                                            <Select defaultValue="au">
                                                <SelectTrigger className="bg-white dark:bg-slate-800 dark:border-slate-700">
                                                    <SelectValue placeholder="Select Country" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="au">Australia</SelectItem>
                                                    <SelectItem value="us">United States</SelectItem>
                                                    <SelectItem value="uk">United Kingdom</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300">Currency</Label>
                                            <Select defaultValue="aud">
                                                <SelectTrigger className="bg-white dark:bg-slate-800 dark:border-slate-700">
                                                    <SelectValue placeholder="Select Currency" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="aud">Australian Dollar (AUD)</SelectItem>
                                                    <SelectItem value="usd">US Dollar (USD)</SelectItem>
                                                    <SelectItem value="gbp">British Pound (GBP)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Branding */}
                        <Card id="branding" className="dark:bg-slate-900 dark:border-slate-800 scroll-mt-24 overflow-hidden">
                            <div
                                onClick={() => toggleSection('branding')}
                                className="relative p-6 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" /><path d="M4 20h16" /><path d="M4 20v-2c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4v2" /></svg>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-row items-center justify-between">
                                    <div className="space-y-0.5">
                                        <h2 className="font-bold text-lg text-slate-900 dark:text-white">Branding</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Personalise with your brand</p>
                                    </div>
                                    <div className="pl-4">
                                        <div className={cn(
                                            "px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
                                            isBrandingComplete
                                                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                                : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                                        )}>
                                            {isBrandingComplete ? "Done" : "To Do"}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-6 right-6 md:static text-slate-400">
                                    {collapsed['branding'] ? <ChevronDown /> : <ChevronUp />}
                                </div>
                            </div>

                            {!collapsed['branding'] && (
                                <div className="p-6 pt-0 animate-in slide-in-from-top-2">

                                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm font-medium text-blue-600 mb-1">Click to upload <span className="text-slate-500 font-normal">or drag and drop</span></p>
                                        <p className="text-xs text-slate-400">Max file size: 2MB. Recommended ratio 3:1 (810 x 270px)</p>
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Social Profiles */}
                        <Card id="social" className="dark:bg-slate-900 dark:border-slate-800 scroll-mt-24 overflow-hidden">
                            <div
                                onClick={() => toggleSection('social')}
                                className="relative p-6 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" x2="22" y1="12" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-row items-center justify-between">
                                    <div className="space-y-0.5">
                                        <h2 className="font-bold text-lg text-slate-900 dark:text-white">Social Profiles</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Connect your social media</p>
                                    </div>
                                    <div className="pl-4">
                                        <div className={cn(
                                            "px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
                                            isSocialComplete
                                                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                                : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                                        )}>
                                            {isSocialComplete ? "Done" : "To Do"}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-6 right-6 md:static text-slate-400">
                                    {collapsed['social'] ? <ChevronDown /> : <ChevronUp />}
                                </div>
                            </div>

                            {!collapsed['social'] && (
                                <div className="p-6 pt-0 animate-in slide-in-from-top-2">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                <Instagram className="w-4 h-4" /> Instagram
                                            </Label>
                                            <Input placeholder="username" value={formData.instagram} onChange={(e) => handleChange('instagram', e.target.value)} className="bg-white dark:bg-slate-800 dark:border-slate-700" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                <Twitter className="w-4 h-4" /> X.com
                                            </Label>
                                            <Input placeholder="username" value={formData.twitter} onChange={(e) => handleChange('twitter', e.target.value)} className="bg-white dark:bg-slate-800 dark:border-slate-700" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                <Facebook className="w-4 h-4" /> Facebook
                                            </Label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-slate-400 hidden sm:inline">facebook.com/</span>
                                                <Input placeholder="page-name" value={formData.facebook} onChange={(e) => handleChange('facebook', e.target.value)} className="bg-white dark:bg-slate-800 dark:border-slate-700" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                <Linkedin className="w-4 h-4" /> LinkedIn
                                            </Label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-slate-400 hidden sm:inline">linkedin.com/company/</span>
                                                <Input placeholder="company-name" value={formData.linkedin} onChange={(e) => handleChange('linkedin', e.target.value)} className="bg-white dark:bg-slate-800 dark:border-slate-700" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Business Description */}
                        <Card id="description" className="dark:bg-slate-900 dark:border-slate-800 scroll-mt-24 overflow-hidden">
                            <div
                                onClick={() => toggleSection('description')}
                                className="relative p-6 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-row items-center justify-between">
                                    <div className="space-y-0.5">
                                        <h2 className="font-bold text-lg text-slate-900 dark:text-white">Business Description</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Detail your business offering</p>
                                    </div>
                                    <div className="pl-4">
                                        <div className={cn(
                                            "px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
                                            isDescriptionComplete
                                                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                                : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                                        )}>
                                            {isDescriptionComplete ? "Done" : "To Do"}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-6 right-6 md:static text-slate-400">
                                    {collapsed['description'] ? <ChevronDown /> : <ChevronUp />}
                                </div>
                            </div>

                            {!collapsed['description'] && (
                                <div className="p-6 pt-0 animate-in slide-in-from-top-2">
                                    <div className="relative">
                                        <WizardTextarea
                                            placeholder="Describe your business..."
                                            value={formData.description}
                                            onChange={(val) => handleChange('description', val)}
                                            className="bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 placeholder:text-slate-400 text-slate-900"
                                            highlight={!formData.description ? "true" : "false"}
                                        />
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Location Selection */}
                        <Card id="location" className="dark:bg-slate-900 dark:border-slate-800 scroll-mt-24 overflow-hidden">
                            <div
                                onClick={() => toggleSection('location')}
                                className="relative p-6 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-row items-center justify-between">
                                    <div className="space-y-0.5">
                                        <h2 className="font-bold text-lg text-slate-900 dark:text-white">Location</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Where you provide services</p>
                                    </div>
                                    <div className="pl-4">
                                        <div className={cn(
                                            "px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
                                            isLocationComplete
                                                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                                : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                                        )}>
                                            {isLocationComplete ? "Done" : "Required"}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-6 right-6 md:static text-slate-400">
                                    {collapsed['location'] ? <ChevronDown /> : <ChevronUp />}
                                </div>
                            </div>

                            {!collapsed['location'] && (
                                <div className="p-6 pt-0 animate-in slide-in-from-top-2">

                                    <div className="mb-6">
                                        <Label className="text-base font-semibold mb-3 block text-slate-900 dark:text-white">Do you work from a fixed location or are you mobile?</Label>
                                        <div className="md:hidden mb-4">
                                            <Select value={formData.locationType} onValueChange={(val) => handleChange('locationType', val)}>
                                                <SelectTrigger className="w-full bg-white dark:bg-slate-800 dark:border-slate-700">
                                                    <SelectValue placeholder="Select Location Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="fixed">Fixed Location</SelectItem>
                                                    <SelectItem value="mobile">Mobile Business</SelectItem>
                                                    <SelectItem value="remote">Remote/Online Business</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="hidden md:flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-full">
                                            {['Fixed Location', 'Mobile Business', 'Remote/Online Business'].map((type) => {
                                                let typeValue = 'fixed';
                                                if (type.includes('Mobile')) typeValue = 'mobile';
                                                if (type.includes('Remote')) typeValue = 'remote';

                                                return (
                                                    <button
                                                        key={typeValue}
                                                        onClick={() => handleChange('locationType', typeValue)}
                                                        className={cn(
                                                            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all",
                                                            formData.locationType === typeValue
                                                                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                                                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                                                        )}
                                                    >
                                                        {type}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {formData.locationType === 'fixed' && (
                                        <div className="space-y-6 animate-in fade-in">
                                            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg p-3 flex gap-3 text-sm text-blue-700 dark:text-blue-300">
                                                <Info className="w-5 h-5 shrink-0" />
                                                <p>You can search your address above or drag the pin on the map to select your exact location. The address field will update automatically.</p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="dark:text-slate-300">Business Address</Label>
                                                <div className="relative">
                                                    <Input defaultValue="17-19 Ereton Dr, Arundel QLD 4214, Australia" className="bg-white dark:bg-slate-800 dark:border-slate-700" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="dark:text-slate-300">Landmark</Label>
                                                <Input placeholder="Enter a nearby landmark or building name" className="bg-white dark:bg-slate-800 dark:border-slate-700" />
                                            </div>

                                            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-[300px] bg-slate-100 dark:bg-slate-800 relative group">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                        <MapPin className="w-4 h-4" /> Map Integration Placeholder
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {formData.locationType === 'mobile' && (
                                        <div className="space-y-6 animate-in fade-in">
                                            <div className="space-y-2">
                                                <Label className="dark:text-slate-300">Base Location</Label>
                                                <Input defaultValue="17-19 Ereton Dr, Arundel QLD 4214, Australia" className="bg-white dark:bg-slate-800 dark:border-slate-700" />
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Enter the primary address where your business is located</p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="dark:text-slate-300">Travel Radius (km)</Label>
                                                <Input placeholder="Enter radius in km" className="bg-white dark:bg-slate-800 dark:border-slate-700" />
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Maximum distance you're willing to travel from your base location</p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="dark:text-slate-300">Service Areas</Label>
                                                <div className="relative">
                                                    <WizardTextarea
                                                        value={typeof formData.serviceAreas === 'string' ? formData.serviceAreas : "Gold Coast\nTweed Heads\nBrisbane City\nSurfers Paradise\nBroadbeach\nBroadbeach Waters\nMermaid Beach"}
                                                        onChange={(val) => handleChange('serviceAreas', val)}
                                                        className="bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 placeholder:text-slate-400 text-slate-900"
                                                        enableAI={false}
                                                    />
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">List the specific areas you service (one per line)</p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="dark:text-slate-300">Exceptions</Label>
                                                <div className="relative">
                                                    <WizardTextarea
                                                        placeholder="Enter regions, towns, or suburbs that are not serviced (one per line)"
                                                        value={formData.exceptions || ''}
                                                        onChange={(val) => handleChange('exceptions', val)}
                                                        className="bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 placeholder:text-slate-400 text-slate-900"
                                                        enableAI={false}
                                                    />
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">List any areas within your radius that you don't service (one per line)</p>
                                            </div>
                                        </div>
                                    )}

                                    {formData.locationType === 'remote' && (
                                        <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in">
                                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
                                                <MapPin className="w-8 h-8" />
                                            </div>
                                            <h3 className="font-medium text-slate-900 dark:text-white">Remote/Online Business</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">No physical location configuration needed.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>

                        {/* Additional Details */}
                        <Card id="additional" className="dark:bg-slate-900 dark:border-slate-800 scroll-mt-24 overflow-hidden">
                            <div
                                onClick={() => toggleSection('additional')}
                                className="relative p-6 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-row items-center justify-between">
                                    <div className="space-y-0.5">
                                        <h2 className="font-bold text-lg text-slate-900 dark:text-white">Additional Details</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Categorization and history</p>
                                    </div>
                                    <div className="pl-4">
                                        <div className={cn(
                                            "px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
                                            isAdditionalDetailsComplete
                                                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                                : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                                        )}>
                                            {isAdditionalDetailsComplete ? "Done" : "To Do"}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-6 right-6 md:static text-slate-400">
                                    {collapsed['additional'] ? <ChevronDown /> : <ChevronUp />}
                                </div>
                            </div>

                            {!collapsed['additional'] && (
                                <div className="p-6 pt-0 animate-in slide-in-from-top-2">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300">Main Category</Label>
                                            <Select defaultValue="electricians">
                                                <SelectTrigger className="bg-white dark:bg-slate-800 dark:border-slate-700">
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="electricians">Electricians</SelectItem>
                                                    <SelectItem value="plumbers">Plumbers</SelectItem>
                                                    <SelectItem value="hvac">HVAC</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300">Service Types</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {['Domestic', 'Commercial', 'Industrial'].map(type => (
                                                    <div
                                                        key={type}
                                                        onClick={() => toggleServiceType(type)}
                                                        className={`cursor-pointer px-3 py-2 rounded-md border text-sm font-medium transition-all flex items-center gap-2 ${formData.serviceTypes.includes(type)
                                                            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                                                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                                            }`}
                                                    >
                                                        {formData.serviceTypes.includes(type) && <Check className="w-3.5 h-3.5" />}
                                                        {type}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300">Year Founded</Label>
                                            <Select defaultValue="2010">
                                                <SelectTrigger className="bg-white dark:bg-slate-800 dark:border-slate-700">
                                                    <SelectValue placeholder="Select Year" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[300px]">
                                                    {Array.from({ length: 2025 - 1800 + 1 }, (_, i) => 2025 - i).map(year => (
                                                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300">Experience (Years)</Label>
                                            <div className="flex items-center">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="rounded-r-none h-10 w-10 border-r-0 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900"
                                                    onClick={() => handleChange('experience', Math.max(0, formData.experience - 1))}
                                                >
                                                    <ChevronDown className="w-4 h-4" />
                                                </Button>
                                                <div className="h-10 border-y border-slate-200 dark:border-slate-700 flex items-center justify-center w-20 bg-white dark:bg-slate-800 font-medium text-slate-900 dark:text-white">
                                                    {formData.experience}
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="rounded-l-none h-10 w-10 border-l-0 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900"
                                                    onClick={() => handleChange('experience', formData.experience + 1)}
                                                >
                                                    <ChevronUp className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Trading Hours - Smart Schedule Redesign */}
                        <Card id="trading-hours" className="dark:bg-slate-900 dark:border-slate-800 scroll-mt-24 overflow-hidden">
                            <div
                                onClick={() => toggleSection('trading-hours')}
                                className="relative p-6 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-row items-center justify-between">
                                    <div className="space-y-0.5">
                                        <h2 className="font-bold text-lg text-slate-900 dark:text-white">Trading Hours</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Set availability</p>
                                    </div>
                                    <div className="pl-4">
                                        <div className={cn(
                                            "px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
                                            isTradingHoursComplete
                                                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                                : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                                        )}>
                                            {isTradingHoursComplete ? "Done" : "Required"}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-6 right-6 md:static text-slate-400">
                                    {collapsed['trading-hours'] ? <ChevronDown /> : <ChevronUp />}
                                </div>
                            </div>

                            {!collapsed['trading-hours'] && (
                                <div className="p-6 pt-0 animate-in slide-in-from-top-2">
                                    <div className="flex justify-end mb-6">
                                        <div className="w-full md:w-64">
                                            <Select defaultValue="brisbane">
                                                <SelectTrigger className="bg-white dark:bg-slate-800 dark:border-slate-700">
                                                    <SelectValue placeholder="Select Timezone" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="brisbane">Australia/Brisbane GMT +10:00</SelectItem>
                                                    <SelectItem value="sydney">Australia/Sydney GMT +11:00</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {formData.schedules.map((schedule, index) => (
                                            <div key={schedule.id} className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-4 animate-in fade-in slide-in-from-top-2">
                                                <div className="flex flex-col gap-4">
                                                    {/* Day Selector */}
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex flex-wrap gap-2">
                                                            {DAYS.map((day, i) => {
                                                                const isSelected = schedule.days.includes(day);
                                                                const isUsedElsewhere = formData.schedules.some(s => s.id !== schedule.id && s.days.includes(day));

                                                                return (
                                                                    <button
                                                                        key={day}
                                                                        onClick={() => toggleDay(schedule.id, day)}
                                                                        className={cn(
                                                                            "w-9 h-9 rounded-full text-xs font-bold transition-all flex items-center justify-center",
                                                                            isSelected
                                                                                ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-100 dark:ring-blue-900"
                                                                                : isUsedElsewhere
                                                                                    ? "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-500 dark:hover:text-slate-400"
                                                                                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400"
                                                                        )}
                                                                        title={isUsedElsewhere ? `Assigned to another schedule` : day}
                                                                    >
                                                                        {SHORT_DAYS[i]}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                        {formData.schedules.length > 1 && (
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50" onClick={() => removeSchedule(schedule.id)}>
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>

                                                    {/* Time Inputs - Stack on Mobile */}
                                                    <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                                                        <div className="flex-1 space-y-1.5">
                                                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Open</Label>
                                                            <Select
                                                                value={schedule.start}
                                                                onValueChange={(val) => updateTime(schedule.id, 'start', val)}
                                                            >
                                                                <SelectTrigger className="w-full h-10 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                                                    <div className="flex items-center gap-2">
                                                                        <Clock className="w-4 h-4 text-slate-400" />
                                                                        <SelectValue placeholder="Select time" />
                                                                    </div>
                                                                </SelectTrigger>
                                                                <SelectContent className="max-h-[200px]">
                                                                    {TIME_OPTIONS.map(time => (
                                                                        <SelectItem key={time.value} value={time.value}>
                                                                            {time.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="hidden sm:flex items-center justify-center pt-6">
                                                            <ArrowRight className="w-4 h-4 text-slate-300" />
                                                        </div>

                                                        <div className="flex-1 space-y-1.5">
                                                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Close</Label>
                                                            <Select
                                                                value={schedule.end}
                                                                onValueChange={(val) => updateTime(schedule.id, 'end', val)}
                                                            >
                                                                <SelectTrigger className="w-full h-10 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                                                    <div className="flex items-center gap-2">
                                                                        <Clock className="w-4 h-4 text-slate-400" />
                                                                        <SelectValue placeholder="Select time" />
                                                                    </div>
                                                                </SelectTrigger>
                                                                <SelectContent className="max-h-[200px]">
                                                                    {TIME_OPTIONS.map(time => (
                                                                        <SelectItem key={time.value} value={time.value}>
                                                                            {time.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Add Button */}
                                        {assignedDays.length < 7 && (
                                            <Button variant="outline" className="w-full border-dashed border-2 py-6 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/10 dark:border-slate-700 dark:hover:border-slate-600" onClick={addSchedule}>
                                                <Plus className="w-4 h-4 mr-2" /> Add More Hours
                                            </Button>
                                        )}

                                        {/* Summary */}
                                        {closedDays.length > 0 && (
                                            <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-sm text-slate-500 dark:text-slate-400">
                                                <Clock className="w-4 h-4 mt-0.5 text-slate-400" />
                                                <p>
                                                    Business is <span className="font-semibold text-slate-700 dark:text-slate-200">Closed</span> on: {closedDays.join(', ')}
                                                </p>
                                            </div>
                                        )}


                                    </div>
                                </div>
                            )}
                        </Card>

                    </div>
                </div>
            </div >
        </div >
    );
}
