import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Upload, Clock, Plus, Trash2, Globe, RefreshCw, ChevronUp, ChevronDown, Check, Instagram, Twitter, Facebook, Linkedin, Wand2, ArrowRight, Settings, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';

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

export default function BusinessInfoView() {
    const navigate = useNavigate();
    const { startGlobalVoiceFlow } = useOutletContext();

    // --- State Management ---

    // Smart Schedule State
    const [schedules, setSchedules] = useState([
        { id: 1, days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], start: '09:00', end: '17:00' }
    ]);

    const [serviceTypes, setServiceTypes] = useState(['Domestic', 'Commercial']);
    const [experience, setExperience] = useState(15);

    // --- Logic ---

    const toggleDay = (scheduleId, day) => {
        setSchedules(prev => prev.map(schedule => {
            if (schedule.id === scheduleId) {
                if (schedule.days.includes(day)) {
                    return { ...schedule, days: schedule.days.filter(d => d !== day) };
                } else {
                    return { ...schedule, days: [...schedule.days, day] };
                }
            } else {
                return { ...schedule, days: schedule.days.filter(d => d !== day) };
            }
        }));
    };

    const addSchedule = () => {
        const newId = Math.max(0, ...schedules.map(s => s.id)) + 1;
        setSchedules([...schedules, { id: newId, days: [], start: '09:00', end: '17:00' }]);
    };

    const removeSchedule = (id) => {
        setSchedules(schedules.filter(s => s.id !== id));
    };

    const updateTime = (id, field, value) => {
        setSchedules(schedules.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const toggleServiceType = (type) => {
        if (serviceTypes.includes(type)) {
            setServiceTypes(serviceTypes.filter(t => t !== type));
        } else {
            setServiceTypes([...serviceTypes, type]);
        }
    };

    const assignedDays = schedules.flatMap(s => s.days);
    const closedDays = DAYS.filter(d => !assignedDays.includes(d));

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <header className="bg-white border-b border-slate-100 px-4 py-4 md:px-8 md:py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
                <div className="flex items-start gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/overview')} className="text-slate-500 hover:text-slate-900 mt-1 shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Business Information</h1>
                        <p className="text-slate-500 text-sm mt-1">Configure your business information</p>
                    </div>
                </div>
                <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
            </header>

            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                <div className="max-w-7xl mx-auto w-full space-y-8 relative">

                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    {/* Data Source Banner */}
                    <div className="bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                        <div className="bg-slate-50/50 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Data Sourced from Website</h3>
                                    <p className="text-xs text-slate-500">
                                        We pulled these details from <a href="#" className="text-blue-600 hover:underline">visionelectrical.com.au</a>.
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
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
                            </div>
                            <div>
                                <h2 className="font-bold text-lg text-slate-900">Basic Information</h2>
                                <p className="text-sm text-slate-500">Essential business details</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Company Name</Label>
                                <Input placeholder="e.g. Vision Electrical" defaultValue="Vision Electrical" />
                            </div>
                            <div className="space-y-2">
                                <Label>Public Email</Label>
                                <Input placeholder="info@example.com" defaultValue="info@visionelectrical.com.au" />
                            </div>
                            <div className="space-y-2">
                                <Label>Business Phone</Label>
                                <div className="flex gap-2">
                                    <div className="w-24 flex-shrink-0">
                                        <Select defaultValue="au">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="au">🇦🇺 +61</SelectItem>
                                                <SelectItem value="us">🇺🇸 +1</SelectItem>
                                                <SelectItem value="uk">🇬🇧 +44</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Input placeholder="434 998 497" defaultValue="434 998 497" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Website</Label>
                                <Input placeholder="https://example.com" defaultValue="https://visionelectrical.com.au/" />
                            </div>
                            <div className="space-y-2">
                                <Label>Country</Label>
                                <Select defaultValue="au">
                                    <SelectTrigger>
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
                                <Label>Currency</Label>
                                <Select defaultValue="aud">
                                    <SelectTrigger>
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
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" /><path d="M4 20h16" /><path d="M4 20v-2c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4v2" /></svg>
                            </div>
                            <div>
                                <h2 className="font-bold text-lg text-slate-900">Branding</h2>
                                <p className="text-sm text-slate-500">Personalise the platform with your organisation's brand</p>
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mb-4 text-slate-400 group-hover:text-blue-600 transition-colors">
                                <Upload className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-medium text-blue-600 mb-1">Click to upload <span className="text-slate-500 font-normal">or drag and drop</span></p>
                            <p className="text-xs text-slate-400">Max file size: 2MB. Recommended ratio 3:1 (810 x 270px)</p>
                        </div>
                    </Card>

                    {/* Social Profiles */}
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" x2="22" y1="12" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                            </div>
                            <div>
                                <h2 className="font-bold text-lg text-slate-900">Social Profiles</h2>
                                <p className="text-sm text-slate-500">Connect your social media accounts</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-slate-700">
                                    <Instagram className="w-4 h-4" /> Instagram
                                </Label>
                                <Input placeholder="username" defaultValue="vision.electrical" />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-slate-700">
                                    <Twitter className="w-4 h-4" /> X.com
                                </Label>
                                <Input placeholder="username" />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-slate-700">
                                    <Facebook className="w-4 h-4" /> Facebook
                                </Label>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-400 hidden sm:inline">facebook.com/</span>
                                    <Input placeholder="page-name" defaultValue="visionelectricalgc" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-slate-700">
                                    <Linkedin className="w-4 h-4" /> LinkedIn
                                </Label>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-400 hidden sm:inline">linkedin.com/company/</span>
                                    <Input placeholder="company-name" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Business Description */}
                    <Card className="p-6">
                        <h2 className="font-bold text-lg text-slate-900 mb-4">Business Description</h2>
                        <div className="relative">
                            <Textarea
                                className="min-h-[120px] pb-10"
                                placeholder="Describe your business..."
                                defaultValue="Gold Coast electricians providing domestic and commercial electrical, air conditioning (split & ducted) design/supply/install, CCTV, smoke alarms, generator changeovers, switchboard upgrades and maintenance across the region."
                            />
                            <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors text-slate-500 hover:text-blue-600" title="Voice Input">
                                    <Mic className="w-4 h-4" />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors text-slate-500 hover:text-blue-600" title="Generate with AI">
                                    <Wand2 className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Additional Details */}
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                            </div>
                            <div>
                                <h2 className="font-bold text-lg text-slate-900">Additional Details</h2>
                                <p className="text-sm text-slate-500">Categorization and history</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Main Category</Label>
                                <Select defaultValue="electricians">
                                    <SelectTrigger>
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
                                <Label>Service Types</Label>
                                <div className="flex flex-wrap gap-2">
                                    {['Domestic', 'Commercial', 'Industrial'].map(type => (
                                        <div
                                            key={type}
                                            onClick={() => toggleServiceType(type)}
                                            className={`cursor-pointer px-3 py-2 rounded-md border text-sm font-medium transition-all flex items-center gap-2 ${serviceTypes.includes(type)
                                                ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            {serviceTypes.includes(type) && <Check className="w-3.5 h-3.5" />}
                                            {type}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Year Founded</Label>
                                <Select defaultValue="2010">
                                    <SelectTrigger>
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
                                <Label>Experience (Years)</Label>
                                <div className="flex items-center">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-r-none h-10 w-10 border-r-0 border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 bg-white"
                                        onClick={() => setExperience(Math.max(0, experience - 1))}
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </Button>
                                    <div className="h-10 border-y border-slate-200 flex items-center justify-center w-20 bg-white font-medium text-slate-900">
                                        {experience}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-l-none h-10 w-10 border-l-0 border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 bg-white"
                                        onClick={() => setExperience(experience + 1)}
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Trading Hours - Smart Schedule Redesign */}
                    <Card className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                            <div>
                                <h2 className="font-bold text-lg text-slate-900">Trading Hours</h2>
                                <p className="text-sm text-slate-500">Set your availability by grouping days together</p>
                            </div>
                            <div className="w-full md:w-64">
                                <Select defaultValue="brisbane">
                                    <SelectTrigger>
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
                            {schedules.map((schedule, index) => (
                                <div key={schedule.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex flex-col gap-4">
                                        {/* Day Selector */}
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-wrap gap-2">
                                                {DAYS.map((day, i) => {
                                                    const isSelected = schedule.days.includes(day);
                                                    const isUsedElsewhere = schedules.some(s => s.id !== schedule.id && s.days.includes(day));

                                                    return (
                                                        <button
                                                            key={day}
                                                            onClick={() => toggleDay(schedule.id, day)}
                                                            className={cn(
                                                                "w-9 h-9 rounded-full text-xs font-bold transition-all flex items-center justify-center",
                                                                isSelected
                                                                    ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-100"
                                                                    : isUsedElsewhere
                                                                        ? "bg-slate-100 text-slate-300 hover:bg-slate-200 hover:text-slate-500"
                                                                        : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600"
                                                            )}
                                                            title={isUsedElsewhere ? `Assigned to another schedule` : day}
                                                        >
                                                            {SHORT_DAYS[i]}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            {schedules.length > 1 && (
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50" onClick={() => removeSchedule(schedule.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>

                                        {/* Time Inputs - Stack on Mobile */}
                                        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border border-slate-100">
                                            <div className="flex-1 space-y-1.5">
                                                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Open</Label>
                                                <Select
                                                    value={schedule.start}
                                                    onValueChange={(val) => updateTime(schedule.id, 'start', val)}
                                                >
                                                    <SelectTrigger className="w-full h-10 border-slate-200">
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
                                                    <SelectTrigger className="w-full h-10 border-slate-200">
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
                                <Button variant="outline" className="w-full border-dashed border-2 py-6 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50" onClick={addSchedule}>
                                    <Plus className="w-4 h-4 mr-2" /> Add More Hours
                                </Button>
                            )}

                            {/* Summary */}
                            {closedDays.length > 0 && (
                                <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg text-sm text-slate-500">
                                    <Clock className="w-4 h-4 mt-0.5 text-slate-400" />
                                    <p>
                                        Business is <span className="font-semibold text-slate-700">Closed</span> on: {closedDays.join(', ')}
                                    </p>
                                </div>
                            )}

                            {/* Outside Business Hours Rule */}
                            <div className="pt-4 border-t border-slate-100 mt-4">
                                <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                                            <Settings className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-900">Outside Business Hours</div>
                                            <div className="text-xs text-slate-500">Configure how calls are handled when closed</div>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 transition-colors" />
                                </a>
                            </div>
                        </div>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 pb-12">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">Save Changes</Button>
                    </div>

                </div>
            </div>
        </div>
    );
}
