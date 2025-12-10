import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Upload, Clock, Plus, Trash2, Globe, RefreshCw, ChevronUp, ChevronDown, Check, Instagram, Twitter, Facebook, Linkedin, Wand2, ArrowRight, Settings, Mic, MapPin, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';
import { PageSectionNav } from '@/components/shared/PageSectionNav';

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

    // --- State Management ---
    const [formData, setFormData] = useState(INITIAL_DATA);
    const [initialData] = useState(INITIAL_DATA);
    const [activeSection, setActiveSection] = useState(null);

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

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <PageHeader
                title="Business Information"
                subtitle="Configure your business information"
                scrollDirection={scrollDirection}
            >
                <Button
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!isDirty}
                    onClick={handleSave}
                >
                    Save Changes
                </Button>
            </PageHeader>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950">
                {/* Page Section Navigation */}
                <PageSectionNav
                    sections={sections}
                    activeSection={activeSection}
                    onNavigate={setActiveSection}
                />

                <div className="p-8">
                    <div className="max-w-7xl mx-auto w-full space-y-8">
                        <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                        {/* Data Source Banner */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm">

                            <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Data Sourced from Website</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            We pulled these details from <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">visionelectrical.com.au</a>.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    <Button variant="outline" size="sm" className="flex-1 md:flex-none gap-2 h-9 text-xs">
                                        <RefreshCw className="w-3.5 h-3.5" /> Refresh from URL
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1 md:flex-none gap-2 h-9 text-xs">
                                        <Upload className="w-3.5 h-3.5" /> Upload Doc
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <Card id="basic-info" className="p-6 dark:bg-slate-900 dark:border-slate-800 scroll-mt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg text-slate-900 dark:text-white">Basic Information</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Essential business details</p>
                                </div>
                            </div>

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
                        </Card>

                        {/* Branding */}
                        <Card id="branding" className="p-6 dark:bg-slate-900 dark:border-slate-800 scroll-mt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" /><path d="M4 20h16" /><path d="M4 20v-2c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4v2" /></svg>
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg text-slate-900 dark:text-white">Branding</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Personalise the platform with your organisation's brand</p>
                                </div>
                            </div>

                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-medium text-blue-600 mb-1">Click to upload <span className="text-slate-500 font-normal">or drag and drop</span></p>
                                <p className="text-xs text-slate-400">Max file size: 2MB. Recommended ratio 3:1 (810 x 270px)</p>
                            </div>
                        </Card>

                        {/* Social Profiles */}
                        <Card id="social" className="p-6 dark:bg-slate-900 dark:border-slate-800 scroll-mt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" x2="22" y1="12" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg text-slate-900 dark:text-white">Social Profiles</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Connect your social media accounts</p>
                                </div>
                            </div>

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
                        </Card>

                        {/* Business Description */}
                        <Card id="description" className="p-6 dark:bg-slate-900 dark:border-slate-800 scroll-mt-8">
                            <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Business Description</h2>
                            <div className="relative">
                                <Textarea
                                    className="min-h-[120px] pb-10 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                                    placeholder="Describe your business..."
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                />
                                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Voice Input">
                                        <Mic className="w-4 h-4" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Generate with AI">
                                        <Wand2 className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Location Selection */}
                        <Card id="location" className="p-6 dark:bg-slate-900 dark:border-slate-800 scroll-mt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg text-slate-900 dark:text-white">Location</h2>
                                </div>
                            </div>

                            <div className="mb-6">
                                <Label className="text-base font-semibold mb-3 block text-slate-900 dark:text-white">Do you work from a fixed location or are you mobile?</Label>
                                <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-full">
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
                                            <Textarea
                                                className="min-h-[100px] pb-10 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                                                defaultValue={"Gold Coast\nTweed Heads\nBrisbane City\nSurfers Paradise\nBroadbeach\nBroadbeach Waters\nMermaid Beach"}
                                            />
                                            <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Voice Input">
                                                    <Mic className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">List the specific areas you service (one per line)</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="dark:text-slate-300">Exceptions</Label>
                                        <div className="relative">
                                            <Textarea
                                                className="min-h-[100px] pb-10 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                                                placeholder="Enter regions, towns, or suburbs that are not serviced (one per line)"
                                            />
                                            <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Voice Input">
                                                    <Mic className="w-4 h-4" />
                                                </div>
                                            </div>
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
                        </Card>

                        {/* Additional Details */}
                        <Card id="additional" className="p-6 dark:bg-slate-900 dark:border-slate-800 scroll-mt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg text-slate-900 dark:text-white">Additional Details</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Categorization and history</p>
                                </div>
                            </div>

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
                        </Card>

                        {/* Trading Hours - Smart Schedule Redesign */}
                        <Card id="trading-hours" className="p-6 dark:bg-slate-900 dark:border-slate-800 scroll-mt-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                <div>
                                    <h2 className="font-bold text-lg text-slate-900 dark:text-white">Trading Hours</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Set your availability by grouping days together</p>
                                </div>
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
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    );
}
