import React from 'react';
import { UploadCloud, Plus, Trash2, HelpCircle, ClipboardList, PhoneForwarded, Calendar, Mail, Sparkles, X, ShieldAlert, ScrollText, Zap, RotateCcw, Loader2, FileCheck, Book, CheckCircle2, Wrench, Shield, AlertTriangle, Wand2, Clock, Edit2, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TeamMemberSelector } from '@/components/shared/TeamMemberSelector';
import { TransferRoutingSelector } from '@/components/shared/TransferRoutingSelector';
import QuestionRulesEditor from './QuestionRulesEditor';

export default function WizardFormContent({ mode, step, formData, onChange, activeField }) {

    // --- SERVICE WIZARD ---
    if (mode === 'service') {
        if (step === 1) {
            const [isLoading, setIsLoading] = React.useState(false);
            const showAutoFillBanner = formData.serviceName && (formData.serviceName.toLowerCase().includes('heater') || formData.serviceName.toLowerCase().includes('hot water')) && !formData.isContextActive;

            const handleKnowledgeSelect = (type) => {
                setIsLoading(true);
                // Simulate analysis delay
                setTimeout(() => {
                    setIsLoading(false);
                    onChange('isContextActive', true);
                    onChange('contextFileName', 'SOP_Manual.pdf');
                    // Auto-fill data
                    onChange('description', "Professional heater diagnosis and repair. We check gas/electric connections, pilot lights, and thermostats.");
                    onChange('price', "180.00");
                    onChange('priceMode', 'hourly');
                    onChange('questions', [
                        { id: '1', text: "Is the area easily accessible?", options: [] },
                        { id: '2', text: "How old is the current unit?", options: [] },
                        { id: '3', text: "Is it gas or electric?", options: [] }
                    ]);
                    onChange('serviceOutcome', 'collect');
                    onChange('serviceClosingScript', "e.g. I'll take your details and have someone from the team call you back shortly.");
                }, 1500);
            };

            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 relative">


                    {/* Knowledge Found Banner */}
                    {showAutoFillBanner && (
                        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex gap-4 animate-in slide-in-from-top-2">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-purple-600 shadow-sm flex-shrink-0">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-purple-900 text-sm">Knowledge Found</h4>
                                <p className="text-xs text-purple-700 mt-1 mb-3">I found pricing and details for "Heater" in your <strong>SOP_Manual.pdf</strong>. Want me to auto-fill this?</p>
                                <div className="flex gap-3 items-center">
                                    <Button
                                        size="sm"
                                        className="bg-purple-600 hover:bg-purple-700 text-white h-8 shadow-sm"
                                        onClick={() => {
                                            onChange('isContextActive', true);
                                            onChange('contextFileName', 'SOP_Manual.pdf');
                                            onChange('description', "Professional heater diagnosis and repair. We check gas/electric connections, pilot lights, and thermostats.");
                                            onChange('price', "180.00");
                                            onChange('priceMode', 'hourly');
                                            onChange('questions', ["Is the area easily accessible?", "How old is the current unit?", "Is it gas or electric?"]);
                                            onChange('serviceOutcome', 'collect');
                                            onChange('serviceClosingScript', "e.g. I'll take your details and have someone from the team call you back shortly.");
                                        }}
                                    >
                                        Yes, Auto-fill
                                    </Button>
                                    <button className="text-xs text-purple-500 hover:text-purple-700 font-medium">Dismiss</button>
                                </div>
                            </div>
                        </div>
                    )}



                    <div>
                        <Label className="mb-1.5 block">Service Name</Label>
                        <Input
                            placeholder="e.g., Hot Water System"
                            value={formData.serviceName}
                            onChange={(e) => onChange('serviceName', e.target.value)}
                            highlight={(activeField === 'serviceName').toString()}

                        />
                    </div>

                    <div>
                        <Label className="mb-3 block">Knowledge Source</Label>
                        <div className="relative">
                            {/* Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div
                                    onClick={() => !formData.isContextActive && handleKnowledgeSelect('upload')}
                                    className={`group border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${formData.isContextActive ? 'opacity-50 pointer-events-none border-slate-200' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'}`}
                                >
                                    <UploadCloud className={`w-8 h-8 mb-2 text-blue-500 transition-colors ${formData.isContextActive ? 'text-slate-300' : 'group-hover:text-blue-600'}`} />
                                    <div className={`font-semibold text-sm transition-colors ${formData.isContextActive ? 'text-slate-400' : 'text-slate-900 group-hover:text-blue-700'}`}>Upload Doc</div>
                                    <div className="text-xs text-slate-500">PDF, DOCX</div>
                                </div>

                                <div
                                    onClick={() => !formData.isContextActive && handleKnowledgeSelect('kb')}
                                    className={`group border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${formData.isContextActive ? 'opacity-50 pointer-events-none border-slate-200' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'}`}
                                >
                                    <div className={`w-8 h-8 mb-2 flex items-center justify-center rounded-lg transition-colors ${formData.isContextActive ? 'bg-slate-100 text-slate-300' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                                        <Book className="w-5 h-5" />
                                    </div>
                                    <div className={`font-semibold text-sm transition-colors ${formData.isContextActive ? 'text-slate-400' : 'text-slate-900 group-hover:text-blue-700'}`}>Select from KB</div>
                                    <div className="text-xs text-slate-500">Existing Files</div>
                                </div>
                            </div>

                            {/* Loading Overlay */}
                            {isLoading && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl border border-slate-100">
                                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                                    <span className="text-sm font-medium text-blue-600 animate-pulse">Analyzing Document...</span>
                                </div>
                            )}

                            {/* Context Active Banner Overlay */}
                            {formData.isContextActive && (
                                <div className="absolute inset-0 bg-emerald-50/95 backdrop-blur-sm z-20 flex items-center justify-between px-6 rounded-xl border border-emerald-100 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
                                            <FileCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-emerald-900">Active Context</div>
                                            <div className="text-xs text-emerald-700 font-medium">{formData.contextFileName}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onChange('isContextActive', false);
                                            onChange('contextFileName', '');
                                            onChange('description', '');
                                            onChange('price', '');
                                            onChange('questions', []);
                                        }}
                                        className="p-2 hover:bg-emerald-100 rounded-full text-emerald-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <Label className="block">Description</Label>
                            {formData.isContextActive && (
                                <div className="flex items-center gap-1.5 text-emerald-600 animate-in fade-in">
                                    <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">AI Auto-filled</span>
                                    <Sparkles className="w-3 h-3" />
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <Textarea
                                placeholder="Describe what this service entails..."
                                className={`min-h-[120px] pb-10 resize-y transition-all duration-500 ${formData.isContextActive ? 'border-emerald-400 ring-1 ring-emerald-100 bg-emerald-50/10' : ''}`}
                                value={formData.description}
                                onChange={(e) => onChange('description', e.target.value)}
                                highlight={(activeField === 'description').toString()}
                            />
                            <div className="absolute bottom-3 right-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors text-slate-500 hover:text-purple-600" title="Generate with AI">
                                    <Wand2 className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Estimated Duration */}
                    <div>
                        <Label className="mb-1.5 block">Estimated Duration</Label>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={formData.durationValue}
                                    onChange={(e) => onChange('durationValue', e.target.value)}
                                />
                            </div>
                            <div className="w-32">
                                <select
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.durationUnit}
                                    onChange={(e) => onChange('durationUnit', e.target.value)}
                                >
                                    <option value="minutes">Minutes</option>
                                    <option value="hours">Hours</option>
                                    <option value="days">Days</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Moved from Step 2: Pricing */}
                    <div>
                        <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                            <Label className="block">Pricing Mode</Label>
                            {formData.isContextActive && <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">AI Auto-filled</span>}
                        </div>
                        <div className={`flex gap-2 mb-4 overflow-x-auto pb-2 p-1 -mx-1 ${formData.isContextActive ? 'bg-emerald-50/30 rounded-xl' : ''}`}>
                            {['fixed', 'hourly', 'range', 'na'].map(m => (
                                <div key={m}
                                    onClick={() => onChange('priceMode', m)}
                                    className={`border rounded-full px-4 py-2 cursor-pointer whitespace-nowrap text-sm transition-all ${formData.priceMode === m ? (formData.isContextActive ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-medium ring-1 ring-emerald-500' : 'bg-blue-50 border-blue-500 text-blue-700 font-medium ring-1 ring-blue-500') : 'hover:bg-slate-50 text-slate-600'}`}
                                >
                                    {m === 'fixed' ? 'Fixed' : m === 'hourly' ? 'Hourly' : m === 'range' ? 'Range' : 'Not Applicable'}
                                </div>
                            ))}
                        </div>

                        {formData.priceMode !== 'na' && (
                            <div className="animate-in fade-in">
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                                    <Input
                                        className={`pl-7 transition-all duration-500 ${formData.isContextActive ? 'border-emerald-400 ring-1 ring-emerald-100 bg-emerald-50/10' : ''}`}
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) => onChange('price', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Moved from Step 2: Question Rules */}
                    <div>
                        <QuestionRulesEditor
                            questions={formData.questions}
                            onChange={(newQuestions) => onChange('questions', newQuestions)}
                        />
                    </div>
                </div>
            );
        }

        // Step 2 (was Step 3)
        if (step === 2) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    {formData.isContextActive && (
                        <div className="-mx-4 -mt-4 mb-6 md:-mx-8 md:-mt-8 bg-emerald-50 border-b border-emerald-100 px-4 py-2 md:px-8 flex items-center gap-3 animate-in fade-in">
                            <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-emerald-600 shadow-sm">
                                <FileCheck className="w-3 h-3" />
                            </div>
                            <span className="text-xs font-medium text-emerald-800">Using Context: <strong>{formData.contextFileName}</strong></span>
                        </div>
                    )}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <Label className="block">Outcome</Label>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {[
                                { id: 'collect', label: 'Collect Info', icon: ClipboardList, color: 'text-orange-500' },
                                { id: 'transfer', label: 'Transfer', icon: PhoneForwarded, color: 'text-blue-500' },
                                { id: 'booking', label: 'Booking', icon: Calendar, color: 'text-purple-500' },
                                { id: 'send_info', label: 'Send Info', icon: Mail, color: 'text-green-500' }
                            ].map(opt => (
                                <div key={opt.id}
                                    onClick={() => onChange('serviceOutcome', opt.id)}
                                    className={`cursor-pointer h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${formData.serviceOutcome === opt.id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                                >
                                    <div className={`mb-2 ${formData.serviceOutcome === opt.id ? 'text-blue-600' : 'text-slate-400'}`}>
                                        <opt.icon className={`w-6 h-6 ${formData.serviceOutcome === opt.id ? 'text-blue-600' : opt.color}`} />
                                    </div>
                                    <div className={`font-semibold text-sm ${formData.serviceOutcome === opt.id ? 'text-blue-900' : 'text-slate-700'}`}>{opt.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Conditional Configuration */}
                        <div className="animate-in fade-in">
                            {formData.serviceOutcome === 'collect' && (
                                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                                    <div>
                                        <Label className="mb-1.5 block text-xs uppercase text-slate-500">Closing Script (Optional)</Label>
                                        <Textarea
                                            placeholder="e.g. I'll take your details and have someone from the team call you back shortly."
                                            className="h-20 text-sm bg-white"
                                            value={formData.serviceClosingScript}
                                            onChange={(e) => onChange('serviceClosingScript', e.target.value)}
                                        />
                                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                            <HelpCircle className="w-3 h-3" /> Sophiie will automatically ask for name & contact details.
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="mb-1.5 block text-xs uppercase text-slate-500">Who to Notify?</Label>
                                        <TeamMemberSelector
                                            value={formData.serviceSendInfoValue}
                                            onChange={(val) => onChange('serviceSendInfoValue', val)}
                                            onAddNew={() => console.log("Add new staff")}
                                        />
                                    </div>
                                </div>
                            )}

                            {formData.serviceOutcome === 'transfer' && (
                                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                                    <div>
                                        <Label className="mb-1.5 block text-xs uppercase text-slate-500">Destination</Label>
                                        <TransferRoutingSelector
                                            type={formData.serviceDestinationType}
                                            value={formData.serviceDestinationValue}
                                            onChangeType={(t) => onChange('serviceDestinationType', t)}
                                            onChangeValue={(v) => onChange('serviceDestinationValue', v)}
                                            onAddNew={() => console.log("Add new staff")}
                                        />
                                    </div>
                                </div>
                            )}

                            {formData.serviceOutcome === 'booking' && (
                                <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm flex-shrink-0">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-purple-900 text-base">Calendar Active</h4>
                                        <p className="text-sm text-purple-700">Bookings will be added to <strong>Main Calendar (Synced)</strong>.</p>
                                    </div>
                                </div>
                            )}

                            {formData.serviceOutcome === 'send_info' && (
                                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Send Details To</Label>

                                    <div className="flex p-1 bg-slate-200/50 rounded-lg">
                                        <button
                                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.serviceSendInfoType === 'team' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                            onClick={() => onChange('serviceSendInfoType', 'team')}
                                        >
                                            Team Member
                                        </button>
                                        <button
                                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.serviceSendInfoType === 'external' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                            onClick={() => onChange('serviceSendInfoType', 'external')}
                                        >
                                            External Contact
                                        </button>
                                    </div>

                                    {formData.serviceSendInfoType === 'team' ? (
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium text-slate-700">Select Staff</Label>
                                            <TeamMemberSelector
                                                value={formData.serviceSendInfoValue}
                                                onChange={(val) => onChange('serviceSendInfoValue', val)}
                                                onAddNew={() => console.log("Add new staff")}
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-4 animate-in fade-in">
                                            <div>
                                                <Label className="mb-2 block text-sm font-medium text-slate-700">Email Address</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                                    <Input
                                                        className="pl-9 bg-white"
                                                        placeholder="recipient@example.com"
                                                        value={formData.sendInfoEmail}
                                                        onChange={(e) => onChange('sendInfoEmail', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="mb-2 block text-sm font-medium text-slate-700">Mobile Number</Label>
                                                <div className="relative">
                                                    <PhoneForwarded className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                                    <Input
                                                        className="pl-9 bg-white"
                                                        placeholder="+1..."
                                                        value={formData.sendInfoPhone}
                                                        onChange={(e) => onChange('sendInfoPhone', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* SMS Content & Templates */}
                                    <div className="pt-4 border-t border-slate-200">
                                        <Label className="mb-2 block text-sm font-medium text-slate-700">SMS Content</Label>
                                        <p className="text-xs text-slate-500 mb-2">This is the SMS content that will be sent to your customer</p>
                                        <Textarea
                                            className="min-h-[100px] mb-4"
                                            placeholder="Enter SMS message content"
                                            value={formData.sendInfoMessage}
                                            onChange={(e) => onChange('sendInfoMessage', e.target.value)}
                                        />

                                        <div className="flex items-center justify-between mb-3">
                                            <Label className="text-sm font-bold text-slate-900">SMS Templates</Label>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    onChange('isCreatingTemplate', !formData.isCreatingTemplate);
                                                }}
                                            >
                                                <Plus className="w-4 h-4 mr-2" /> New Template
                                            </Button>
                                        </div>

                                        {formData.isCreatingTemplate && (
                                            <div className="bg-slate-100 p-4 rounded-lg mb-4 border border-slate-200 animate-in fade-in slide-in-from-top-2">
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">New SMS Template</div>

                                                <div className="space-y-3">
                                                    <div>
                                                        <Label className="mb-1.5 block text-xs">Template Name</Label>
                                                        <Input
                                                            placeholder="Enter template name"
                                                            className="bg-white"
                                                            value={formData.newTemplateName || ''}
                                                            onChange={(e) => onChange('newTemplateName', e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="mb-1.5 block text-xs">Content</Label>
                                                        <Textarea
                                                            placeholder="Enter SMS message content"
                                                            className="bg-white min-h-[80px]"
                                                            value={formData.newTemplateContent || ''}
                                                            onChange={(e) => onChange('newTemplateContent', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="flex justify-end gap-2 pt-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => onChange('isCreatingTemplate', false)}
                                                            className="bg-white hover:bg-slate-200"
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                                            onClick={() => {
                                                                if (formData.newTemplateName && formData.newTemplateContent) {
                                                                    const newTemplate = {
                                                                        id: Date.now().toString(),
                                                                        name: formData.newTemplateName,
                                                                        content: formData.newTemplateContent
                                                                    };
                                                                    onChange('smsTemplates', [...(formData.smsTemplates || []), newTemplate]);
                                                                    onChange('sendInfoMessage', formData.newTemplateContent); // Auto-use
                                                                    onChange('isCreatingTemplate', false);
                                                                    onChange('newTemplateName', '');
                                                                    onChange('newTemplateContent', '');
                                                                }
                                                            }}
                                                        >
                                                            Save and Use Template
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            {formData.smsTemplates?.map(t => (
                                                <div key={t.id} className="group bg-white p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="font-bold text-sm text-slate-900 mb-1">{t.name}</div>
                                                        <div className="text-xs text-slate-500 line-clamp-2">{t.content}</div>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            onClick={() => onChange('sendInfoMessage', t.content)}
                                                        >
                                                            Use
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                                                            <Edit2 className="w-3 h-3" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={() => {
                                                            const newTemplates = formData.smsTemplates.filter(temp => temp.id !== t.id);
                                                            onChange('smsTemplates', newTemplates);
                                                        }}>
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
    }

    // --- STAFF WIZARD ---
    if (mode === 'staff') {
        if (step === 1) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="mb-2 block">First Name</Label>
                            <Input value={formData.staffName} onChange={(e) => onChange('staffName', e.target.value)} placeholder="e.g. Sarah" />
                        </div>
                        <div>
                            <Label className="mb-2 block">Last Name</Label>
                            <Input placeholder="e.g. Connor" />
                        </div>
                    </div>
                    <div>
                        <Label className="mb-2 block">Role</Label>
                        <Input value={formData.staffRole} onChange={(e) => onChange('staffRole', e.target.value)} placeholder="e.g. Senior Manager" />
                    </div>
                    <div>
                        <Label className="mb-2 block">Contact</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Phone Ext..." />
                            <Input placeholder="Email..." />
                        </div>
                    </div>
                </div>
            );
        }
        if (step === 2) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <Label className="mb-2 block">Responsibilities</Label>
                        <p className="text-xs text-slate-500 mb-2">Tell Sophiie what this person handles.</p>
                        <Textarea
                            className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[120px]"
                            placeholder="e.g. Handles billing disputes..."
                            value={formData.staffResp}
                            onChange={(e) => onChange('staffResp', e.target.value)}
                        />
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                        <Sparkles className="w-4 h-4 text-blue-500 mt-0.5" />
                        <div className="text-sm text-blue-800"><strong>AI Tip:</strong> Be specific. Instead of "Sales", say "Residential Sales".</div>
                    </div>
                </div>
            );
        }
        if (step === 3) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <Label className="mb-2 block">Transfer Conditions</Label>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <Label className="text-xs text-slate-500 uppercase block mb-2">Keywords</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline" className="bg-white">Billing Issue <X className="w-3 h-3 ml-1 cursor-pointer" /></Badge>
                            <button className="text-xs text-blue-600 hover:underline">+ Add</button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div>
                            <div className="font-medium text-slate-800 text-sm">Escalation Point</div>
                            <div className="text-xs text-slate-500">Route angry calls here</div>
                        </div>
                        <input type="checkbox" className="toggle-checkbox" />
                    </div>
                </div>
            );
        }
    }

    // --- PROTOCOL WIZARD ---
    if (mode === 'protocol') {
        if (step === 1) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <Label className="mb-2 block">Scenario Name</Label>
                        <Input
                            placeholder="e.g. Refund Request"
                            value={formData.scenarioName}
                            onChange={(e) => onChange('scenarioName', e.target.value)}
                        />
                    </div>

                    <div>
                        <Label className="mb-2 block">Trigger Condition</Label>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {['keyword', 'intent'].map(type => (
                                <div
                                    key={type}
                                    onClick={() => onChange('protocolTriggerType', type)}
                                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${formData.protocolTriggerType === type ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
                                >
                                    <div className="font-semibold text-slate-800 capitalize mb-1">{type === 'keyword' ? 'Specific Keywords' : 'Customer Intent'}</div>
                                    <div className="text-xs text-slate-500">{type === 'keyword' ? 'Exact phrases (e.g. "Refund")' : 'Vague goals (e.g. Wants a job)'}</div>
                                </div>
                            ))}
                        </div>
                        <Input
                            placeholder={formData.protocolTriggerType === 'keyword' ? "Enter keywords..." : "Describe user goal..."}
                            value={formData.protocolTrigger}
                            onChange={(e) => onChange('protocolTrigger', e.target.value)}
                        />
                    </div>
                </div>
            );
        }
        if (step === 2) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <Label className="mb-4 block">Response Logic</Label>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {[
                                { id: 'collect', label: 'Collect Info', icon: ClipboardList, color: 'text-orange-500' },
                                { id: 'transfer', label: 'Transfer', icon: PhoneForwarded, color: 'text-blue-500' },
                                { id: 'book', label: 'Booking', icon: Calendar, color: 'text-purple-500' }, // Changed CalendarCheck to Calendar
                                { id: 'refuse', label: 'Refuse', icon: ShieldAlert, color: 'text-red-500' },
                            ].map(opt => (
                                <div
                                    key={opt.id}
                                    onClick={() => onChange('protocolAction', opt.id)}
                                    className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center text-center transition-all ${formData.protocolAction === opt.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm">
                                        <opt.icon className={`w-5 h-5 ${opt.color}`} />
                                    </div>
                                    <span className="text-sm font-semibold capitalize">{opt.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Conditional UI based on Action */}

                    {/* Transfer Routing */}
                    {formData.protocolAction === 'transfer' && (
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 animate-in fade-in">
                            <Label className="mb-2 block">Routing</Label>
                            <TransferRoutingSelector
                                type={formData.protocolDestinationType}
                                value={formData.protocolDestinationValue}
                                onChangeType={(val) => onChange('protocolDestinationType', val)}
                                onChangeValue={(val) => onChange('protocolDestinationValue', val)}
                                onAddNew={() => { }}
                            />
                        </div>
                    )}

                    {/* Book UI */}
                    {formData.protocolAction === 'book' && (
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 flex items-center gap-3 animate-in fade-in">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-purple-900">Calendar Active</h4>
                                <p className="text-xs text-purple-700">Bookings will be added to <strong>Main Calendar (Synced)</strong>.</p>
                            </div>
                        </div>
                    )}

                    {/* Script Editor & Questions */}
                    {(formData.protocolAction === 'script' || formData.protocolAction === 'collect') && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <Label className="text-xs text-slate-500 uppercase block mb-2">{formData.protocolAction === 'collect' ? 'Data Collection Script' : 'Response Script'}</Label>
                                <Textarea
                                    className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    rows={3}
                                    placeholder={formData.protocolAction === 'collect' ? "e.g. I need to take down some details first..." : "e.g. We do not offer refunds on sale items..."}
                                    value={formData.protocolScript}
                                    onChange={(e) => onChange('protocolScript', e.target.value)}
                                />
                            </div>

                            {/* Reusing Questions Logic */}
                            <div>
                                <Label className="mb-2 block">Follow-up Questions</Label>
                                <div className="space-y-2 mb-3">
                                    {formData.questions.length > 0 ? (
                                        formData.questions.map((q, i) => (
                                            <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm flex justify-between group">
                                                <span>{q}</span>
                                                <Trash2 className="w-4 h-4 text-slate-300 cursor-pointer hover:text-red-500" />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm flex justify-between group">
                                            <span>Could you please provide the order number?</span>
                                            <Trash2 className="w-4 h-4 text-slate-300 group-hover:text-red-500 cursor-pointer" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Input placeholder="Add a question..." className="h-9" />
                                    <Button size="sm" variant="secondary">Add</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Refusal Script */}
                    {formData.protocolAction === 'refuse' && (
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200 animate-in fade-in">
                            <Label className="text-xs text-red-800 uppercase block mb-2">Polite Refusal Script</Label>
                            <Textarea
                                className="w-full rounded-lg border border-red-200 p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white"
                                rows={3}
                                placeholder="e.g. I apologize, but we are unable to process that request due to company policy."
                                value={formData.protocolScript}
                                onChange={(e) => onChange('protocolScript', e.target.value)}
                            />
                        </div>
                    )}
                </div>
            );
        }
        if (step === 3) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ScrollText className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">Scenario Summary</h3>
                        <p className="text-sm text-slate-500">Review the logic before activating.</p>
                    </div>

                    <div className="p-5 border border-slate-200 rounded-xl shadow-sm bg-white">
                        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                            <Badge variant="outline">IF</Badge>
                            <span className="text-sm font-medium text-slate-700">
                                User {formData.protocolTriggerType === 'intent' ? 'intends to' : 'says keyword'}:
                                <strong> "{formData.protocolTrigger || '...'}"</strong>
                            </span>
                        </div>

                        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                            <Badge variant="outline">THEN</Badge>
                            <span className="text-sm font-medium text-slate-700 capitalize">
                                Action: <strong>{formData.protocolAction}</strong>
                            </span>
                        </div>

                        {formData.protocolAction === 'transfer' && (
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">TO</Badge>
                                <span className="text-sm font-medium text-slate-700">
                                    Routing: <strong>{formData.protocolDestinationValue || 'Selected Team'}</strong>
                                </span>
                            </div>
                        )}

                        {(formData.protocolAction === 'script' || formData.protocolAction === 'collect') && (
                            <div className="flex items-start gap-2">
                                <Badge variant="outline">AND</Badge>
                                <div className="flex-1">
                                    <span className="text-sm font-medium text-slate-700 block mb-1">Ask Questions:</span>
                                    <ul className="list-disc list-inside text-xs text-slate-600">
                                        {formData.questions.length > 0 ? formData.questions.map((q, i) => <li key={i}>{q.text || q}</li>) : <li>Default Questions</li>}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
    }

    // --- TRANSFER WIZARD ---
    if (mode === 'transfer') {
        if (step === 1) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <Label className="mb-2 block">Transfer Rule Name</Label>
                        <Input
                            placeholder="e.g. Sales Inquiry"
                            value={formData.transferName}
                            onChange={(e) => onChange('transferName', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label className="mb-3 block">Transfer Type</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                onClick={() => onChange('transferType', 'warm')}
                                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${formData.transferType === 'warm' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
                            >
                                <div className="flex items-center gap-2 mb-1 text-orange-600">
                                    <Zap className="w-4 h-4" />
                                    <span className="font-semibold text-slate-800">Warm Transfer</span>
                                </div>
                                <div className="text-xs text-slate-500">AI introduces caller to agent first.</div>
                            </div>
                            <div
                                onClick={() => onChange('transferType', 'cold')}
                                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${formData.transferType === 'cold' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
                            >
                                <div className="flex items-center gap-2 mb-1 text-blue-600">
                                    <PhoneForwarded className="w-4 h-4" />
                                    <span className="font-semibold text-slate-800">Cold Transfer</span>
                                </div>
                                <div className="text-xs text-slate-500">Immediate connect, no intro.</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        if (step === 2) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <Label className="mb-2 block">Handoff Message (Whisper)</Label>
                        <p className="text-xs text-slate-500 mb-3">What the AI says to the agent before connecting.</p>
                        <div className="relative">
                            <Textarea
                                className="w-full rounded-lg border border-slate-300 p-3 text-sm font-mono bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed min-h-[100px]"
                                value={formData.transferSummary}
                                onChange={(e) => onChange('transferSummary', e.target.value)}
                            />
                            <div className="absolute bottom-3 right-3">
                                <button className="p-1.5 rounded-full bg-white border border-slate-200 hover:text-blue-600 shadow-sm"><RotateCcw className="w-3 h-3" /></button>
                            </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mr-1">Vars:</span>
                            {['{Caller Name}', '{Reason}', '{Key Details}'].map(v => (
                                <Badge key={v} variant="outline" className="bg-white hover:border-blue-300 hover:text-blue-600 cursor-pointer transition-colors">{v}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }
        if (step === 3) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <Label className="mb-4 block">Routing Logic</Label>
                    <div className="space-y-4">

                        {/* Reused Unified Routing Component */}
                        <TransferRoutingSelector
                            type={formData.transferDestinationType}
                            value={formData.transferDestinationValue}
                            onChangeType={(val) => onChange('transferDestinationType', val)}
                            onChangeValue={(val) => onChange('transferDestinationValue', val)}
                            onAddNew={() => { }}
                        />

                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
                            <div>
                                <div className="font-medium text-slate-800 text-sm">Ignore Business Hours</div>
                                <div className="text-xs text-slate-500">Transfer even if closed (Emergency)</div>
                            </div>
                            <input type="checkbox" className="toggle-checkbox" />
                        </div>
                    </div>
                </div>
            );
        }
    }

    // --- DOCUMENT WIZARD ---
    if (mode === 'document') {
        if (step === 1) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="border-2 border-dashed border-slate-300 rounded-xl h-48 flex flex-col items-center justify-center bg-slate-50 hover:bg-blue-50 hover:border-blue-400 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                            <UploadCloud className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="text-sm font-medium text-slate-700">Click to upload or drag and drop</div>
                        <div className="text-xs text-slate-400 mt-1">PDF, DOCX, TXT (Max 10MB)</div>
                    </div>

                    <div>
                        <Label className="mb-1.5 block">Or Add URL</Label>
                        <div className="flex gap-2">
                            <Input placeholder="https://..." />
                            <Button variant="secondary">Fetch</Button>
                        </div>
                    </div>
                </div>
            );
        }
        if (step === 2) {
            return (
                <div className="flex flex-col items-center justify-center h-64 animate-in fade-in slide-in-from-right-4 duration-300">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800">Analyzing Document...</h3>
                    <p className="text-slate-500 text-sm mt-2">Extracting key topics and entities.</p>
                </div>
            );
        }
        if (step === 3) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <h4 className="font-bold text-slate-900 text-sm mb-1">Extraction Complete</h4>
                        <p className="text-xs text-slate-500">I found 3 actionable items in <strong>New_Policy.pdf</strong>.</p>
                    </div>

                    <div className="space-y-3">
                        {/* Item 1 */}
                        <div className="border border-blue-200 bg-blue-50/30 rounded-xl p-4 flex gap-4 items-start">
                            <div className="w-10 h-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-blue-500 shadow-sm flex-shrink-0">
                                <Wrench className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h5 className="font-bold text-slate-900 text-sm">Found Service: "Emergency Gas"</h5>
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                                </div>
                                <p className="text-xs text-slate-500 mt-1 mb-3">Detected pricing ($180/hr) and description.</p>
                                <Button size="sm" className="h-8 bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200 shadow-none">Review & Add</Button>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="border border-slate-200 rounded-xl p-4 flex gap-4 items-start">
                            <div className="w-10 h-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-purple-500 shadow-sm flex-shrink-0">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h5 className="font-bold text-slate-900 text-sm">Found Protocol: "Payment Terms"</h5>
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">"Payment required upon completion" rule found.</p>
                            </div>
                        </div>

                        {/* Item 3 */}
                        <div className="border border-orange-200 bg-orange-50/30 rounded-xl p-4 flex gap-4 items-start">
                            <div className="w-10 h-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-orange-500 shadow-sm flex-shrink-0">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h5 className="font-bold text-slate-900 text-sm">Conflict Detected</h5>
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                </div>
                                <p className="text-xs text-slate-500 mt-1 mb-3">Doc says <strong>$150 call-out</strong>, but "General Plumbing" service is set to <strong>$99</strong>.</p>
                                <div className="flex gap-2">
                                    <Button size="sm" className="h-8 bg-orange-100 text-orange-800 hover:bg-orange-200 border border-orange-200 shadow-none">Overwrite Old Price</Button>
                                    <Button size="sm" variant="ghost" className="h-8 text-slate-500 hover:text-slate-700">Ignore</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    return <div>Unknown Step</div>;
}
