import React, { useState, useEffect, useRef } from 'react';
import {
Headset,
Mail,
Users,
Wrench,
ListChecks,
ArrowRightLeft,
Calendar,
Settings,
HelpCircle,
Bot,
Plus,
Clock,
Share2,
CalendarCheck,
Phone,
ShieldAlert,
ArrowRight,
Trash2,
Search,
ChevronDown,
Sparkles,
Mic,
X,
RotateCcw,
MessageSquare,
Play,
CheckCircle2,
AlertCircle,
Zap,
StickyNote,
PhoneForwarded,
PhoneMissed,
UserCheck,
Building,
Globe,
Book,
FileText,
UploadCloud,
Loader2,
BrainCircuit,
FileCheck,
Lightbulb,
FileSearch,
Check,
Ban,
ClipboardList,
ScrollText,
Smartphone,
Save,
Volume2,
Square,
Pause,
PlayCircle,
MessageCircle,
MicOff,
Keyboard,
Send
} from 'lucide-react';

// --- GEMINI API UTILITY ---
const apiKey = ""; // API Key injected by environment

async function callGemini(prompt) {
try {
const response = await
fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
{
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
contents: [{ parts: [{ text: prompt }] }]
})
});

const data = await response.json();
if (data.error) {
console.error("Gemini API Error:", data.error);
return null;
}
return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
} catch (error) {
console.error("Fetch Error:", error);
return null;
}
}

// --- UI Components (Shadcn-style) ---

const Button = ({ children, variant = "primary", size = "default", className = "", ...props }) => {
const baseStyle = "inline-flex items-center justify-center rounded-lg font-medium transition-colors
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none
disabled:opacity-50";
const variants = {
primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
outline: "border border-slate-200 bg-white hover:bg-slate-100 text-slate-900",
ghost: "hover:bg-slate-100 hover:text-slate-900 text-slate-600",
danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
dashed: "border-2 border-dashed border-slate-300 bg-transparent hover:border-blue-500 hover:text-blue-500
hover:bg-blue-50"
};
const sizes = {
default: "h-10 px-4 py-2",
sm: "h-9 rounded-md px-3",
lg: "h-11 rounded-md px-8",
icon: "h-10 w-10"
};
return (
<button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
    {children}
</button>
);
};

const Input = ({ className = "", highlight = false, ...props }) => (
<input className={`flex h-11 w-full rounded-lg border bg-white px-3 py-2 text-sm ring-offset-white file:border-0
    file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none
    focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-500 ${highlight
    ? 'border-purple-400 ring-2 ring-purple-100 shadow-[0_0_15px_rgba(168,85,247,0.15)] scale-[1.02]'
    : 'border-slate-300 focus-visible:ring-blue-500' } ${className}`} {...props} />
);

const Label = ({ children, className = "" }) => (
<label className={`text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70
    text-slate-700 ${className}`}>
    {children}
</label>
);

const Card = ({ children, className = "" }) => (
<div className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm ${className}`}>
    {children}
</div>
);

const Badge = ({ children, variant = "default", className = "" }) => {
const variants = {
default: "bg-blue-100 text-blue-700 hover:bg-blue-100/80",
success: "bg-green-100 text-green-700",
warning: "bg-orange-100 text-orange-700",
secondary: "bg-slate-100 text-slate-700",
outline: "text-slate-500 border border-slate-200",
context: "bg-emerald-50 text-emerald-700 border-emerald-200"
};
return (
<div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors
    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${variants[variant]}
    ${className}`}>
    {children}
</div>
);
};

// --- Reusable Logic Components ---

const TeamMemberSelector = ({ value, onChange, onAddNew }) => {
const [isOpen, setIsOpen] = useState(false);
const wrapperRef = useRef(null);

useEffect(() => {
function handleClickOutside(event) {
if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
setIsOpen(false);
}
}
document.addEventListener("mousedown", handleClickOutside);
return () => document.removeEventListener("mousedown", handleClickOutside);
}, [wrapperRef]);

return (
<div className="relative" ref={wrapperRef}>
    <div onClick={()=> setIsOpen(!isOpen)}
        className="flex h-11 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2
        text-sm ring-offset-white cursor-pointer hover:border-blue-400 focus:ring-2 focus:ring-blue-500 transition-all"
        >
        <span className={!value ? "text-slate-500" : "text-slate-900" }>{value || "Select a team member..."}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : '' }`} />
    </div>

    {isOpen && (
    <div
        className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="p-2 border-b border-slate-50 bg-slate-50">
            <div className="relative">
                <Search className="absolute left-2 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                    className="w-full pl-7 pr-2 py-1.5 text-xs border border-slate-200 rounded bg-white focus:outline-none focus:border-blue-400"
                    placeholder="Search team..." autoFocus />
            </div>
        </div>
        <div className="max-h-48 overflow-y-auto p-1">
            <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available Staff
            </div>
            <div className="px-2 py-2 text-sm text-slate-700 hover:bg-blue-50 rounded cursor-pointer flex items-center gap-2 group transition-colors"
                onClick={()=> { onChange('Jamie Tester'); setIsOpen(false); }}
                >
                <div
                    className="w-6 h-6 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-[10px] group-hover:bg-white">
                    JT</div>
                Jamie Tester
            </div>
            <div className="px-2 py-2 text-sm text-slate-700 hover:bg-blue-50 rounded cursor-pointer flex items-center gap-2 group transition-colors"
                onClick={()=> { onChange('Sarah Brown'); setIsOpen(false); }}
                >
                <div
                    className="w-6 h-6 rounded bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center font-bold text-[10px] group-hover:bg-white">
                    SB</div>
                Sarah Brown
            </div>
        </div>
        <div className="p-2 border-t border-slate-100 bg-slate-50">
            <button onClick={()=> { onAddNew(); setIsOpen(false); }}
                className="w-full py-2 text-xs font-medium text-blue-600 border border-dashed border-blue-200
                bg-blue-50/50 hover:bg-blue-50 rounded flex items-center justify-center gap-2 transition-colors"
                >
                <Plus className="w-3 h-3" /> Add New Team Member
            </button>
        </div>
    </div>
    )}
</div>
);
};

// Unified Transfer Logic UI
const TransferRoutingSelector = ({ type, value, onChangeType, onChangeValue, onAddNew }) => {
return (
<div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
    <div>
        <Label className="text-xs text-slate-500 uppercase block mb-1">Destination Type</Label>
        <div className="flex rounded-lg border border-slate-300 overflow-hidden bg-white h-10">
            <button onClick={()=> onChangeType('staff')}
                className={`flex-1 text-xs font-medium border-r border-slate-200 hover:bg-slate-50 transition-colors
                ${type === 'staff' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}
                >
                Staff Member
            </button>
            <button onClick={()=> onChangeType('dept')}
                className={`flex-1 text-xs font-medium border-r border-slate-200 hover:bg-slate-50 transition-colors
                ${type === 'dept' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}
                >
                Department
            </button>
            <button onClick={()=> onChangeType('external')}
                className={`flex-1 text-xs font-medium hover:bg-slate-50 transition-colors ${type === 'external' ?
                'bg-blue-50 text-blue-700' : 'text-slate-600'}`}
                >
                External #
            </button>
        </div>
    </div>

    <div>
        <div className="flex items-center justify-between mb-1">
            <Label className="text-xs text-slate-500 uppercase block">
                {type === 'staff' && "Select Staff Member"}
                {type === 'dept' && "Select Department"}
                {type === 'external' && "Enter Phone Number"}
            </Label>
        </div>

        {type === 'staff' && (
        <TeamMemberSelector value={value} onChange={(val)=> onChangeValue(val)}
            onAddNew={onAddNew}
            />
            )}

            {type === 'dept' && (
            <select
                className="w-full h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:ring-2 focus:ring-blue-500"
                value={value} onChange={(e)=> onChangeValue(e.target.value)}
                >
                <option>Reception Desk (Default)</option>
                <option>Sales Department</option>
                <option>Billing & Accounts</option>
            </select>
            )}

            {type === 'external' && (
            <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <Input className="pl-9" placeholder="+1 (555) 000-0000" value={value} onChange={(e)=>
                onChangeValue(e.target.value)}
                />
            </div>
            )}
    </div>
</div>
);
};

// --- Mock Data ---

const MOCK_SERVICES = [
{ id: 1, name: "Emergency Plumbing", desc: "Handling burst pipes, leaks, and overflowing toilets.", icon:
<Wrench />, time: "60 min", action: "Transfer", active: true },
{ id: 2, name: "Gas Fitting", desc: "Installation and maintenance of gas appliances.", icon:
<Sparkles />, time: "90 min", action: "Book", active: true },
];

const MOCK_STAFF = [
{ id: 1, name: "Jamie Tester", role: "Owner", desc: "Handles billing disputes, large quotes.", initials: "JT", color:
"bg-indigo-100 text-indigo-600", status: "Available" },
{ id: 2, name: "Sarah Brown", role: "Reception", desc: "General inquiries, booking appointments.", initials: "SB",
color: "bg-fuchsia-100 text-fuchsia-600", status: "Back 2pm" },
];

const MOCK_SCENARIOS = [
{ id: 1, name: "Refund Request", trigger: "User asks for money back", action: "Transfer to Accounts" },
{ id: 2, name: "Job Application", trigger: "User wants to work here", action: "Direct to website" },
];

const MOCK_DOCS = [
{ id: 1, name: "SOP_Manual_2024.pdf", size: "2.4MB", date: "2 days ago", type: "pdf" },
{ id: 2, name: "Pricing_Guide_Q3.docx", size: "1.1MB", date: "1 week ago", type: "doc" },
];

const MOCK_WEB = [
{ id: 1, name: "Website FAQs", url: "company.com/faq", status: "Active" },
{ id: 2, name: "Contact Page", url: "company.com/contact", status: "Active" },
];

// --- Main Application ---

export default function TrainSophiieApp() {
const [currentView, setCurrentView] = useState('services');
const [isWizardOpen, setIsWizardOpen] = useState(false);
const [wizardMode, setWizardMode] = useState('service'); // service, staff, protocol, transfer, document
const [isSettingsOpen, setIsSettingsOpen] = useState(false);

// --- Render Active View Content ---
const renderContent = () => {
switch (currentView) {
case 'services': return <ServicesView onAdd={()=> openWizard('service')} />;
    case 'staff': return <StaffView onAdd={()=> openWizard('staff')} onSettings={() => setIsSettingsOpen(true)} />;
        case 'scenarios': return <ScenariosView onAdd={()=> openWizard('protocol')} />;
            case 'transfers': return <TransfersView onAdd={()=> openWizard('transfer')} onSettings={() =>
                setIsSettingsOpen(true)} />;
                case 'knowledge': return <KnowledgeBaseView onAdd={()=> openWizard('document')} />;
                    default: return <ServicesView onAdd={()=> openWizard('service')} />;
                        }
                        };

                        const openWizard = (mode) => {
                        setWizardMode(mode);
                        setIsWizardOpen(true);
                        };

                        return (
                        <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
                            {/* Tier 1 Sidebar */}
                            <aside
                                className="w-[72px] bg-slate-950 flex flex-col items-center py-6 z-30 flex-shrink-0 shadow-xl text-white">
                                <div className="mb-10 text-2xl opacity-90 hover:opacity-100 cursor-pointer">
                                    <Headset className="w-8 h-8" />
                                </div>
                                <nav className="flex-1 w-full flex flex-col gap-6 px-2 items-center">
                                    <NavIcon icon={<Mail />} />
                                    <NavIcon icon={<Users />} active={currentView === 'staff'} onClick={() =>
                                    setCurrentView('staff')} />
                                    <NavIcon icon={<Wrench />} active={currentView === 'services'} onClick={() =>
                                    setCurrentView('services')} />
                                    <NavIcon icon={<ListChecks />} active={currentView === 'scenarios'} onClick={() =>
                                    setCurrentView('scenarios')} />
                                    <NavIcon icon={<ArrowRightLeft />} active={currentView === 'transfers'} onClick={()
                                    => setCurrentView('transfers')} />

                                    <NavIcon icon={<Book />} active={currentView === 'knowledge'} onClick={() =>
                                    setCurrentView('knowledge')} />

                                    <div className="mt-auto flex flex-col gap-6 items-center">
                                        <div
                                            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-400">
                                            <Bot className="w-6 h-6" />
                                        </div>
                                        <NavIcon icon={<Settings />} />
                                        <NavIcon icon={<HelpCircle />} />
                                    </div>
                                </nav>
                                <div
                                    className="mt-4 w-10 h-10 rounded-xl bg-gradient-to-b from-lime-400 to-emerald-500 cursor-pointer shadow-lg hover:opacity-90 transition-opacity">
                                </div>
                            </aside>

                            {/* Tier 2 Sidebar */}
                            <aside
                                className="w-64 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0 z-20 hidden md:flex">
                                <div className="p-6 border-b border-slate-100">
                                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        Module</h2>
                                    <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        Train Sophiie
                                        <Badge variant="default" className="text-[10px]">Beta</Badge>
                                    </div>
                                </div>

                                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
                                    <SidebarGroup title="Knowledge Base">
                                        <SidebarItem icon={<Wrench />} label="Services" active={currentView ===
                                        'services'} onClick={() => setCurrentView('services')} />
                                        <SidebarItem icon={<Book />} label="Documents" active={currentView ===
                                        'knowledge'} onClick={() => setCurrentView('knowledge')} />
                                        <SidebarItem icon={<ShieldAlert />} label="Protocols" active={currentView ===
                                        'scenarios'} onClick={() => setCurrentView('scenarios')} />
                                        <SidebarItem icon={<ListChecks />} label="Policies" />
                                        <SidebarItem icon={<HelpCircle />} label="FAQs" />
                                    </SidebarGroup>

                                    <SidebarGroup title="Team & Routing">
                                        <SidebarItem icon={<Users />} label="Staff" active={currentView === 'staff'}
                                        onClick={() => setCurrentView('staff')} />
                                        <SidebarItem icon={<ArrowRightLeft />} label="Transfers" active={currentView ===
                                        'transfers'} onClick={() => setCurrentView('transfers')} />
                                    </SidebarGroup>
                                </nav>

                                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-slate-500">Setup Progress</span>
                                        <span className="text-xs font-bold text-blue-600">85%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                </div>
                            </aside>

                            {/* Main Content */}
                            <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-white">
                                {renderContent()}
                            </main>

                            {/* Modals */}
                            {isWizardOpen && (
                            <WizardModal mode={wizardMode} onSwitchMode={setWizardMode} // PASSING THE SWITCH HANDLER
                                onClose={()=> setIsWizardOpen(false)}
                                />
                                )}

                                {isSettingsOpen && (
                                <SettingsModal onClose={()=> setIsSettingsOpen(false)} />
                                    )}
                        </div>
                        );
                        }

                        // --- Navigation Components ---

                        const NavIcon = ({ icon, active, onClick }) => (
                        <button onClick={onClick} className={`text-xl transition-all relative group flex items-center
                            justify-center w-full ${active ? 'text-blue-400 opacity-100'
                            : 'text-white opacity-60 hover:opacity-100' }`}>
                            {React.cloneElement(icon, { size: 22 })}
                            {active &&
                            <div
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-400 rounded-r-md" />
                            }
                        </button>
                        );

                        const SidebarGroup = ({ title, children }) => (
                        <div>
                            <h3 className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{title}
                            </h3>
                            <ul className="space-y-1">{children}</ul>
                        </div>
                        );

                        const SidebarItem = ({ icon, label, active, onClick }) => (
                        <li>
                            <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                                text-sm font-medium transition-colors ${active ? 'bg-blue-50 text-blue-700'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900' }`}>
                                {React.cloneElement(icon, { size: 18, className: active ? 'text-blue-500' :
                                'text-slate-400' })}
                                {label}
                            </button>
                        </li>
                        );

                        // --- View Components ---

                        const KnowledgeBaseView = ({ onAdd }) => {
                        const [activeTab, setActiveTab] = useState('library');

                        return (
                        <div className="flex flex-col h-full animate-in fade-in duration-300">
                            <header
                                className="bg-white border-b border-slate-100 px-8 py-5 flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">Knowledge Base</h1>
                                    <p className="text-slate-500 text-sm mt-1">Manage documents, PDFs, and website data.
                                    </p>
                                </div>
                                <Button onClick={onAdd}>
                                    <UploadCloud className="w-4 h-4 mr-2" /> Add Document
                                </Button>
                            </header>

                            {/* Tabs */}
                            <div className="px-8 pt-4 pb-0 border-b border-slate-100 flex gap-6">
                                <button onClick={()=> setActiveTab('library')}
                                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab ===
                                    'library' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500
                                    hover:text-slate-700'}`}
                                    >
                                    Library (Files)
                                </button>
                                <button onClick={()=> setActiveTab('web')}
                                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab ===
                                    'web' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500
                                    hover:text-slate-700'}`}
                                    >
                                    Web Sources
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                                    {/* 1. Add New Card (Always First) */}
                                    <button onClick={onAdd}
                                        className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 transition-all min-h-[200px] group">
                                        <div
                                            className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Plus className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <span className="font-medium">{activeTab === 'library' ? 'Upload Document' :
                                            'Add Web Source'}</span>
                                    </button>

                                    {/* 2. Content Cards */}
                                    {activeTab === 'library' ? (
                                    MOCK_DOCS.map(doc => (
                                    <Card key={doc.id}
                                        className="p-6 relative group hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                                        <div
                                            className="absolute top-4 right-4 text-slate-300 group-hover:text-slate-500 cursor-pointer">
                                            <Settings className="w-4 h-4" />
                                        </div>
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4
                                            ${doc.type==='pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                                            }`}>
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-bold text-slate-800 line-clamp-1">{doc.name}</h3>
                                        <p className="text-xs text-slate-500 mt-1">{doc.date} • {doc.size}</p>
                                        <div className="mt-4 flex gap-2">
                                            <Badge variant="success">Active</Badge>
                                        </div>
                                    </Card>
                                    ))
                                    ) : (
                                    MOCK_WEB.map(site => (
                                    <Card key={site.id}
                                        className="p-6 relative group hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                                        <div
                                            className="absolute top-4 right-4 text-slate-300 group-hover:text-slate-500 cursor-pointer">
                                            <Settings className="w-4 h-4" />
                                        </div>
                                        <div
                                            className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center mb-4">
                                            <Globe className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-bold text-slate-800 line-clamp-1">{site.name}</h3>
                                        <p className="text-xs text-slate-500 mt-1">{site.url}</p>
                                        <div className="mt-4 flex gap-2">
                                            <Badge variant="outline">Synced</Badge>
                                        </div>
                                    </Card>
                                    ))
                                    )}
                                </div>
                            </div>
                        </div>
                        );
                        };

                        const ServicesView = ({ onAdd }) => (
                        <div className="flex flex-col h-full animate-in fade-in duration-300">
                            <header
                                className="bg-white border-b border-slate-100 px-8 py-5 flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">Services Configuration</h1>
                                    <p className="text-slate-500 text-sm mt-1">Teach Sophiie what services you offer.
                                    </p>
                                </div>
                                <Button onClick={onAdd}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Service
                                </Button>
                            </header>
                            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    <button onClick={onAdd}
                                        className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 transition-all min-h-[240px] group">
                                        <div
                                            className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Plus className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <span className="font-medium">Create New Service</span>
                                    </button>
                                    {MOCK_SERVICES.map(service => (
                                    <Card key={service.id}
                                        className="p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">{service.icon}
                                            </div>
                                            {service.active && <Badge variant="success">Active</Badge>}
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-900 mb-1">{service.name}</h3>
                                        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{service.desc}</p>
                                        <div
                                            className="flex items-center justify-between text-sm text-slate-400 pt-4 border-t border-slate-100">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {service.time}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Share2 className="w-3 h-3" /> {service.action}
                                            </span>
                                        </div>
                                    </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                        );

                        const StaffView = ({ onAdd, onSettings }) => (
                        <div className="flex flex-col h-full animate-in fade-in duration-300">
                            <header
                                className="bg-white border-b border-slate-100 px-8 py-5 flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">Team & Routing</h1>
                                    <p className="text-slate-500 text-sm mt-1">Manage team members and configure
                                        transfer logic.</p>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" onClick={onSettings}>
                                        <Settings className="w-4 h-4 mr-2" /> Global Settings
                                    </Button>
                                    <Button onClick={onAdd}>
                                        <Plus className="w-4 h-4 mr-2" /> Add Team Member
                                    </Button>
                                </div>
                            </header>
                            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    <button onClick={onAdd}
                                        className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 transition-all min-h-[240px] group">
                                        <div
                                            className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Plus className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <span className="font-medium">Add Team Member</span>
                                    </button>
                                    {MOCK_STAFF.map(staff => (
                                    <Card key={staff.id}
                                        className="p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                                                font-bold text-sm ${staff.color}`}>{staff.initials}</div>
                                            <Badge variant="secondary">{staff.role}</Badge>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-900 mb-1">{staff.name}</h3>
                                        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{staff.desc}</p>
                                        <div
                                            className="flex items-center justify-between text-sm text-slate-400 pt-4 border-t border-slate-100">
                                            <span className={`flex items-center gap-1.5 font-medium
                                                ${staff.status.includes('Back') ? 'text-orange-600' : 'text-green-600'
                                                }`}>
                                                <div className={`w-2 h-2 rounded-full ${staff.status.includes('Back')
                                                    ? 'bg-orange-600' : 'bg-green-600' }`} />
                                                {staff.status}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Phone className="w-3 h-3" /> Ext.
                                            </span>
                                        </div>
                                    </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                        );

                        const ScenariosView = ({ onAdd }) => (
                        <div className="flex flex-col h-full animate-in fade-in duration-300">
                            <header
                                className="bg-white border-b border-slate-100 px-8 py-5 flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">Specific Scenarios</h1>
                                    <p className="text-slate-500 text-sm mt-1">Define handling rules for refunds,
                                        complaints, and general inquiries.</p>
                                </div>
                                <Button onClick={onAdd}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Scenario
                                </Button>
                            </header>
                            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 space-y-8">
                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <button onClick={onAdd}
                                            className="border-2 border-dashed border-slate-300 rounded-xl p-5 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 transition-all min-h-[140px]">
                                            <Plus className="w-5 h-5 mb-2" />
                                            <span className="text-sm font-medium">Create Scenario</span>
                                        </button>
                                        {MOCK_SCENARIOS.map(proto => (
                                        <Card key={proto.id}
                                            className="p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                                            <div className="flex justify-between items-start mb-4">
                                                <Badge variant="default"
                                                    className="bg-indigo-50 text-indigo-600 border-indigo-100">If / Then
                                                </Badge>
                                            </div>
                                            <h4 className="font-bold text-lg text-slate-900 mb-1">{proto.name}</h4>
                                            <p className="text-sm text-slate-500 mb-4">Trigger: {proto.trigger}</p>
                                            <div
                                                className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                                                <ArrowRight className="w-3 h-3 text-slate-400" />
                                                <span>{proto.action}</span>
                                            </div>
                                        </Card>
                                        ))}
                                    </div>
                                </div>

                                {/* Global Restrictions & Guardrails - Restored Section */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-1.5 bg-red-100 text-red-600 rounded-lg">
                                            <ShieldAlert className="w-4 h-4" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800">Global Restrictions &
                                            Guardrails</h3>
                                    </div>
                                    <Card className="p-6">
                                        <p className="text-sm text-slate-500 mb-6">Define strict limits for the AI
                                            (Negative Constraints). These apply to every call.</p>
                                        <div className="space-y-4">
                                            <div
                                                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                                    <div className="text-sm text-slate-700">
                                                        <span
                                                            className="font-bold text-slate-600 uppercase text-xs mr-2">Sophiie
                                                            Must Never</span>
                                                        Quote specific pricing unless explicitly listed in Services.
                                                    </div>
                                                </div>
                                                <button className="text-slate-400 hover:text-red-500">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div
                                                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                                    <div className="text-sm text-slate-700">
                                                        <span
                                                            className="font-bold text-slate-600 uppercase text-xs mr-2">Sophiie
                                                            Must Never</span>
                                                        Promise specific arrival times (give 2hr windows only).
                                                    </div>
                                                </div>
                                                <button className="text-slate-400 hover:text-red-500">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div
                                                className="flex items-center gap-2 pt-3 mt-2 border-t border-slate-100">
                                                <div className="flex-1 relative">
                                                    <span
                                                        className="absolute left-3 top-3 text-slate-500 font-bold text-xs select-none uppercase">Never</span>
                                                    <Input className="pl-14"
                                                        placeholder="e.g. discuss politics or religion..." />
                                                </div>
                                                <Button variant="danger">Add Restriction</Button>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                        );

                        const TransfersView = ({ onAdd, onSettings }) => (
                        <div className="flex flex-col h-full animate-in fade-in duration-300">
                            <header
                                className="bg-white border-b border-slate-100 px-8 py-5 flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">Transfers Configuration</h1>
                                    <p className="text-slate-500 text-sm mt-1">Manage call transfer rules.</p>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" onClick={onSettings}>
                                        <Settings className="w-4 h-4 mr-2" /> Global Settings
                                    </Button>
                                    <Button onClick={onAdd}>
                                        <Plus className="w-4 h-4 mr-2" /> Add Rule
                                    </Button>
                                </div>
                            </header>
                            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    <button onClick={onAdd}
                                        className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 transition-all min-h-[240px] group">
                                        <div
                                            className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Plus className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <span className="font-medium">Add Transfer Rule</span>
                                    </button>
                                    <Card
                                        className="p-6 hover:shadow-md transition-all cursor-pointer hover:-translate-y-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <Badge variant="warning">Warm</Badge>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-900 mb-1">Sales Dept</h3>
                                        <p className="text-sm text-slate-500 mb-4">When someone wants to speak to sales.
                                        </p>
                                    </Card>
                                </div>
                            </div>
                        </div>
                        );

                        // --- Wizard Modal (Complex Logic) ---

                        const WizardModal = ({ mode, onSwitchMode, onClose }) => {
                        const [step, setStep] = useState(1);
                        const [returnToMode, setReturnToMode] = useState(null);
                        const [lastStepCache, setLastStepCache] = useState({ service: 1, transfer: 1, protocol: 1 });
                        const [isDirty, setIsDirty] = useState(false);
                        const [showSaveConfirm, setShowSaveConfirm] = useState(false);
                        const [simulatorTab, setSimulatorTab] = useState('invitation'); // 'invitation', 'voice',
                        'preview'
                        const [activeField, setActiveField] = useState(null);

                        const [formData, setFormData] = useState({
                        serviceName: '',
                        priceMode: 'fixed',
                        price: '',
                        customPriceMessage: '',
                        useCustomPriceMessage: false,
                        description: '',
                        contextSource: null,

                        // Shared Questions Array
                        questions: [],

                        // Service Outcome State
                        serviceOutcome: 'collect', // default to collect info
                        serviceSendInfoType: 'team',
                        serviceSendInfoValue: '',
                        serviceClosingScript: '',

                        // Service Transfer State
                        serviceDestinationType: 'staff',
                        serviceDestinationValue: '',

                        staffName: '',
                        staffRole: '',
                        staffResp: '',

                        // Scenario state
                        scenarioName: '',
                        protocolTrigger: '',
                        protocolTriggerType: 'keyword',
                        protocolAction: 'collect', // Default to collect
                        protocolScript: '',
                        // Protocol Transfer State
                        protocolDestinationType: 'staff',
                        protocolDestinationValue: '',

                        // Transfer state
                        transferName: '',
                        transferType: 'warm',
                        transferSummary: 'Hi, I have {Caller Name} on the line who needs assistance with {Reason}. They
                        mentioned {Key Details}.',
                        transferDestinationType: 'staff',
                        transferDestinationValue: '',
                        });

                        // Effect to reset or restore step when mode changes
                        useEffect(() => {
                        // For document flow, we always start at 1
                        if (mode === 'document') {
                        setStep(1);
                        } else if (mode === 'service') {
                        setStep(lastStepCache.service);
                        } else if (mode === 'transfer') {
                        setStep(lastStepCache.transfer);
                        } else if (mode === 'protocol') {
                        setStep(lastStepCache.protocol);
                        } else {
                        setStep(1);
                        }
                        // Reset tab to Invitation on new mode opening
                        setSimulatorTab('invitation');
                        }, [mode]);

                        const handleStepChange = (newStep) => {
                        setStep(newStep);
                        // Update cache
                        if (mode === 'service') setLastStepCache(prev => ({ ...prev, service: newStep }));
                        if (mode === 'transfer') setLastStepCache(prev => ({ ...prev, transfer: newStep }));
                        if (mode === 'protocol') setLastStepCache(prev => ({ ...prev, protocol: newStep }));
                        };

                        // Helper to update multiple fields at once (e.g. AutoFill)
                        const updateFormFields = (updates) => {
                        setFormData(prev => ({ ...prev, ...updates }));
                        setIsDirty(true);
                        if (simulatorTab === 'invitation') {
                        setSimulatorTab('preview');
                        }
                        };

                        const handleChange = (field, value) => {
                        setFormData(prev => ({ ...prev, [field]: value }));
                        setIsDirty(true);

                        // AUTO SWITCH TO PREVIEW IF TYPING DETECTED
                        if (simulatorTab === 'invitation') {
                        setSimulatorTab('preview');
                        }
                        };

                        const handleModeSwitch = (newMode) => {
                        if (mode === 'service' || mode === 'transfer' || mode === 'protocol') {
                        setReturnToMode(mode);
                        }
                        onSwitchMode(newMode);
                        };

                        const handleFinish = () => {
                        if (mode === 'staff' && returnToMode) {
                        const newStaffName = formData.staffName || 'New Staff Member';
                        if(returnToMode === 'service') handleChange('serviceDestinationValue', newStaffName);
                        if(returnToMode === 'transfer') handleChange('transferDestinationValue', newStaffName);
                        if(returnToMode === 'protocol') handleChange('protocolDestinationValue', newStaffName);

                        onSwitchMode(returnToMode);
                        setReturnToMode(null);
                        } else {
                        onClose();
                        }
                        };

                        const attemptClose = () => {
                        if (isDirty) {
                        setShowSaveConfirm(true);
                        } else {
                        onClose();
                        }
                        };

                        const handleDiscard = () => {
                        setShowSaveConfirm(false);
                        if (returnToMode) {
                        onSwitchMode(returnToMode);
                        setReturnToMode(null);
                        } else {
                        onClose();
                        }
                        };

                        const titles = {
                        service: "Add New Service",
                        staff: returnToMode ? "Add New Team Member" : "Add Team Member",
                        protocol: "Add New Scenario",
                        transfer: "Add Transfer Rule",
                        document: "Analyze Document"
                        };

                        const stepsMap = {
                        service: ["Identity & Knowledge", "Business Logic", "Outcome"],
                        staff: ["Profile", "Responsibilities", "Transfer Rules"],
                        protocol: ["Definition", "Response Logic", "Review"],
                        transfer: ["Strategy", "Handoff", "Routing"],
                        document: ["Upload", "Analyzing", "Extraction Lab"]
                        };

                        const currentSteps = stepsMap[mode] || [];

                        return (
                        <div
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
                            <div
                                className="bg-white w-[90vw] max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex overflow-hidden scale-100 animate-in zoom-in-95 duration-200 relative">

                                {/* Save Confirmation Overlay */}
                                {showSaveConfirm && (
                                <div
                                    className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
                                    <div className="bg-white p-6 rounded-xl shadow-2xl w-96 animate-in zoom-in-95">
                                        <div
                                            className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <AlertCircle className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-center text-slate-900 mb-1">Unsaved
                                            Changes</h3>
                                        <p className="text-sm text-slate-500 text-center mb-6">You have unsaved changes.
                                            Are you sure you want to leave?</p>
                                        <div className="space-y-3">
                                            <Button className="w-full" onClick={()=> { handleFinish();
                                                setShowSaveConfirm(false); }}>Save & Exit</Button>
                                            <Button variant="outline"
                                                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                onClick={handleDiscard}>Discard Changes</Button>
                                            <button onClick={()=> setShowSaveConfirm(false)} className="w-full
                                                text-center text-xs text-slate-400 hover:text-slate-600 py-2">Keep
                                                Editing</button>
                                        </div>
                                    </div>
                                </div>
                                )}

                                {/* LEFT COLUMN: Form */}
                                <div className="w-3/5 flex flex-col border-r border-slate-200">
                                    <div
                                        className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">{titles[mode]}</h2>
                                            <div className="flex items-center gap-2 mt-2">
                                                {currentSteps.map((label, idx) => (
                                                <React.Fragment key={idx}>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2.5 h-2.5 rounded-full transition-colors
                                                            ${step>= idx + 1 ? 'bg-blue-600' : 'bg-slate-300'}`} />
                                                            <span className={`text-xs font-semibold transition-colors
                                                                ${step>= idx + 1 ? 'text-blue-600' :
                                                                'text-slate-400'}`}>{label}</span>
                                                        </div>
                                                        {idx
                                                        < 2 && <div className="w-8 h-px bg-slate-200" />}
                                                </React.Fragment>
                                                ))}
                                            </div>
                                        </div>
                                        <button onClick={attemptClose}
                                            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {mode === 'service' && step > 1 && formData.contextSource && (
                                    <div
                                        className="px-8 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2">
                                        <BrainCircuit className="w-4 h-4 text-emerald-600" />
                                        <span className="text-xs font-medium text-emerald-700">Using Context:
                                            {formData.contextSource}</span>
                                    </div>
                                    )}

                                    <div className="flex-1 overflow-y-auto p-8 relative">
                                        <WizardFormContent mode={mode} step={step} formData={formData}
                                            onChange={handleChange} updateFormFields={updateFormFields}
                                            onSwitchMode={handleModeSwitch} onStepAdvance={(s)=> handleStepChange(s)} //
                                            Pass step control for auto-advance
                                            activeField={activeField} // Pass active field for highlighting
                                            />
                                    </div>

                                    <div
                                        className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                                        <div className="flex gap-2">
                                            {returnToMode && (
                                            <Button variant="ghost" size="sm" onClick={()=>
                                                handleModeSwitch(returnToMode)}>
                                                <ArrowRightLeft className="w-4 h-4 mr-2" /> Cancel & Return
                                            </Button>
                                            )}
                                            {/* Hide Back button in doc flow step 2 (auto) */}
                                            {!(mode === 'document' && step === 2) && (
                                            <Button variant="ghost" onClick={()=> handleStepChange(Math.max(1, step -
                                                1))} disabled={step === 1 && !returnToMode}>Back</Button>
                                            )}
                                        </div>

                                        {/* Hide Next button in doc flow step 2 (auto) */}
                                        {!(mode === 'document' && step === 2) && (
                                        <Button onClick={()=> step < currentSteps.length ? handleStepChange(step + 1) :
                                                handleFinish()}>
                                                {step === currentSteps.length ? (returnToMode ? "Create & Return" :
                                                "Save & Close") : "Next Step"}
                                        </Button>
                                        )}
                                    </div>
                                </div>

                                {/* RIGHT COLUMN: Live Simulator / Voice */}
                                <div
                                    className="w-2/5 bg-slate-50 flex flex-col relative border-l border-slate-200 h-full">
                                    <LiveSimulator mode={mode} formData={formData} step={step} onChange={handleChange}
                                        updateFormFields={updateFormFields} onStepAdvance={handleStepChange}
                                        simulatorTab={simulatorTab} setSimulatorTab={setSimulatorTab}
                                        setActiveField={setActiveField} // Pass setter to voice engine />
                                </div>
                            </div>
                        </div>
                        );
                        };

                        const WizardFormContent = ({ mode, step, formData, onChange, updateFormFields, onSwitchMode,
                        onStepAdvance, activeField }) => {
                        // Local state for features specific to this view
                        const [showSmartBanner, setShowSmartBanner] = useState(false);
                        const [isAnalyzing, setIsAnalyzing] = useState(false);
                        const [isGenDesc, setIsGenDesc] = useState(false);
                        const [isGenResp, setIsGenResp] = useState(false);

                        // Document Flow State
                        const [progress, setProgress] = useState(0);

                        // Simulate Smart Interrupt
                        useEffect(() => {
                        if (mode === 'service' && step === 1 && formData.serviceName.length > 4 &&
                        !formData.contextSource) {
                        const timer = setTimeout(() => setShowSmartBanner(true), 1500);
                        return () => clearTimeout(timer);
                        } else {
                        setShowSmartBanner(false);
                        }
                        }, [formData.serviceName, mode, step, formData.contextSource]);

                        const handleFileUpload = () => {
                        setIsAnalyzing(true);
                        setTimeout(() => {
                        setIsAnalyzing(false);
                        updateFormFields({
                        contextSource: 'SOP_Manual.pdf',
                        description: "Professional heater diagnosis and repair. We check gas/electric connections, pilot
                        lights, and thermostats.",
                        questions: ["Is the area easily accessible?", "How old is the current unit?", "Is it gas or
                        electric?"]
                        });
                        }, 1800);
                        };

                        const handleGenerateDescription = async () => {
                        if (!formData.serviceName) return;
                        setIsGenDesc(true);
                        const prompt = `Write a short, professional description (max 2 sentences) for a trade service
                        named "${formData.serviceName}". Focus on value proposition.`;
                        const text = await callGemini(prompt);
                        if (text) onChange('description', text);
                        setIsGenDesc(false);
                        };

                        const handleGenerateResponsibilities = async () => {
                        if (!formData.staffRole) return;
                        setIsGenResp(true);
                        const prompt = `List 3 key responsibilities for a "${formData.staffRole}" in a trade business.
                        Return as a comma-separated list.`;
                        const text = await callGemini(prompt);
                        if (text) onChange('staffResp', text);
                        setIsGenResp(false);
                        };

                        const handleAutoFill = () => {
                        setShowSmartBanner(false);
                        updateFormFields({
                        contextSource: 'SOP_Manual.pdf (Smart Find)',
                        description: "Professional heater diagnosis and repair. We check gas/electric connections, pilot
                        lights, and thermostats.",
                        priceMode: 'na',
                        useCustomPriceMessage: true,
                        customPriceMessage: "Based on our SOP, heater repairs require an on-site diagnosis. We charge a
                        $89 call-out fee which is waived if you proceed.",
                        questions: ["Is the area easily accessible?", "How old is the current unit?", "Is it gas or
                        electric?"]
                        });
                        }

                        // Document Analysis Effect
                        useEffect(() => {
                        if(mode === 'document' && step === 2) {
                        const interval = setInterval(() => {
                        setProgress(old => {
                        if(old >= 100) {
                        clearInterval(interval);
                        return 100;
                        }
                        return old + 2;
                        });
                        }, 50);
                        return () => clearInterval(interval);
                        }
                        }, [mode, step]);

                        useEffect(() => {
                        if(progress === 100 && mode === 'document' && step === 2) {
                        setTimeout(() => onStepAdvance(3), 500);
                        }
                        }, [progress, mode, step, onStepAdvance]);


                        // --- Document Extraction Lab Flow ---
                        if (mode === 'document') {
                        if (step === 1) return (
                        <div
                            className="flex flex-col h-full justify-center items-center animate-in fade-in zoom-in-95 duration-300">
                            <div onClick={()=> onStepAdvance(2)}
                                className="w-full max-w-md h-64 border-2 border-dashed border-blue-300 bg-blue-50/50
                                rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50
                                hover:border-blue-500 transition-all group"
                                >
                                <div
                                    className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="w-8 h-8 text-blue-500" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-700">Upload Knowledge Source</h3>
                                <p className="text-sm text-slate-500 mt-2">Drag & Drop or Click to Browse</p>
                                <p className="text-xs text-slate-400 mt-1">PDF, DOCX, TXT supported</p>
                            </div>
                        </div>
                        );
                        if (step === 2) return (
                        <div
                            className="flex flex-col h-full justify-center items-center animate-in fade-in duration-300 px-12">
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Analyzing Document...</h3>
                            <p className="text-slate-500 text-sm mb-8 text-center">Identifying services, protocols, and
                                pricing rules.</p>

                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 transition-all duration-75" style={{ width:
                                    `${progress}%` }}></div>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">{progress}% Complete</p>
                        </div>
                        );
                        if (step === 3) return (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-800 mb-1">Extraction Complete</h3>
                                <p className="text-sm text-slate-500">I found 3 actionable items in
                                    <strong>New_Policy.pdf</strong>.</p>
                            </div>

                            <div className="space-y-4">
                                {/* Insight 1: Found Service */}
                                <div className="p-4 border border-blue-200 bg-blue-50/50 rounded-xl flex gap-4">
                                    <div className="p-2 bg-white rounded-lg h-fit border border-blue-100 shadow-sm">
                                        <Wrench className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm">Found Service:
                                                    "Emergency Gas"</h4>
                                                <p className="text-xs text-slate-600 mt-1">Detected pricing ($180/hr)
                                                    and description.</p>
                                            </div>
                                            <input type="checkbox" className="toggle-checkbox" defaultChecked />
                                        </div>
                                        <div className="mt-3 flex gap-2">
                                            <button
                                                className="text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded transition-colors">Review
                                                & Add</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Insight 2: Protocol */}
                                <div className="p-4 border border-indigo-200 bg-indigo-50/50 rounded-xl flex gap-4">
                                    <div className="p-2 bg-white rounded-lg h-fit border border-indigo-100 shadow-sm">
                                        <ShieldAlert className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm">Found Protocol:
                                                    "Payment Terms"</h4>
                                                <p className="text-xs text-slate-600 mt-1">"Payment required upon
                                                    completion" rule found.</p>
                                            </div>
                                            <input type="checkbox" className="toggle-checkbox" defaultChecked />
                                        </div>
                                    </div>
                                </div>

                                {/* Insight 3: Conflict */}
                                <div className="p-4 border border-orange-200 bg-orange-50/50 rounded-xl flex gap-4">
                                    <div className="p-2 bg-white rounded-lg h-fit border border-orange-100 shadow-sm">
                                        <AlertCircle className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm">Conflict Detected</h4>
                                                <p className="text-xs text-slate-600 mt-1">Doc says <strong>$150
                                                        call-out</strong>, but "General Plumbing" service is set to
                                                    <strong>$99</strong>.</p>
                                            </div>
                                            <input type="checkbox" className="toggle-checkbox" />
                                        </div>
                                        <div className="mt-3 flex gap-2">
                                            <button
                                                className="text-xs font-medium text-orange-700 bg-orange-100 hover:bg-orange-200 px-3 py-1.5 rounded transition-colors">Overwrite
                                                Old Price</button>
                                            <button
                                                className="text-xs font-medium text-slate-600 hover:text-slate-800 px-2 py-1.5">Ignore</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        );
                        }

                        // --- Service Form ---
                        if (mode === 'service') {
                        if (step === 1) return (
                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">

                            {/* SMART BANNER (Relative Block) */}
                            {showSmartBanner && (
                            <div
                                className="bg-gradient-to-r from-violet-100 to-fuchsia-50 border border-violet-200 rounded-lg p-3 flex items-start gap-3 shadow-sm animate-in slide-in-from-top-2 fade-in">
                                <BrainCircuit className="w-5 h-5 text-violet-600 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-violet-900">Knowledge Found</h4>
                                    <p className="text-xs text-violet-700 mt-0.5">I found pricing and details for
                                        "Heater" in your <strong>SOP_Manual.pdf</strong>. Want me to auto-fill this?</p>
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={handleAutoFill}
                                            className="text-xs bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded font-medium transition-colors">Yes,
                                            Auto-fill</button>
                                        <button onClick={()=> setShowSmartBanner(false)} className="text-xs
                                            text-violet-500 hover:text-violet-700 px-2 py-1.5">Dismiss</button>
                                    </div>
                                </div>
                            </div>
                            )}

                            <div>
                                <Label className="mb-2 block">Service Name</Label>
                                <Input value={formData.serviceName} onChange={(e)=> onChange('serviceName',
                                e.target.value)}
                                placeholder="e.g., Hot Water System"
                                highlight={activeField === 'serviceName'}
                                />
                            </div>

                            {/* Knowledge Source - Moved to Step 1 */}
                            <div>
                                <Label className="mb-3 block">Knowledge Source</Label>
                                {formData.contextSource ? (
                                <div
                                    className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileCheck className="w-5 h-5 text-emerald-600" />
                                        <div>
                                            <span className="text-sm font-medium text-emerald-900 block">Active
                                                Context</span>
                                            <span className="text-xs text-emerald-700">{formData.contextSource}</span>
                                        </div>
                                    </div>
                                    <button onClick={()=> onChange('contextSource', null)} className="text-emerald-500
                                        hover:text-emerald-700 p-1">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div onClick={handleFileUpload}
                                        className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all text-center group">
                                        {isAnalyzing ? (
                                        <div className="flex flex-col items-center">
                                            <Loader2 className="w-6 h-6 text-blue-600 animate-spin mb-2" />
                                            <span className="text-xs font-semibold text-blue-700">Analyzing...</span>
                                        </div>
                                        ) : (
                                        <>
                                            <UploadCloud
                                                className="w-6 h-6 text-slate-400 group-hover:text-blue-500 mb-2" />
                                            <span
                                                className="text-sm font-medium text-slate-700 group-hover:text-blue-700">Upload
                                                Doc</span>
                                            <span className="text-[10px] text-slate-400">PDF, DOCX</span>
                                        </>
                                        )}
                                    </div>
                                    <div
                                        className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all text-center group">
                                        <Book className="w-6 h-6 text-slate-400 group-hover:text-blue-500 mb-2" />
                                        <span
                                            className="text-sm font-medium text-slate-700 group-hover:text-blue-700">Select
                                            from KB</span>
                                        <span className="text-[10px] text-slate-400">Existing Files</span>
                                    </div>
                                </div>
                                )}
                            </div>

                            {/* Description - Moved to Step 1 */}
                            <div>
                                <Label className="mb-2 block flex justify-between">
                                    Description
                                    {formData.contextSource && <span className="text-xs text-emerald-600 font-medium">AI
                                        Auto-filled</span>}
                                </Label>
                                <div className="relative">
                                    <textarea className={`w-full rounded-lg border p-3 text-sm focus:outline-none
                                        min-h-[100px] transition-all ${formData.contextSource
                                        ? 'border-emerald-300 ring-1 ring-emerald-100' : activeField==='description'
                                        ? 'border-purple-400 ring-2 ring-purple-100 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                                        : 'border-slate-300 focus:ring-2 focus:ring-blue-500' }`}
                                        placeholder="Describe what this service entails..." value={formData.description}
                                        onChange={(e)=> onChange('description', e.target.value)}
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                 <button 
                    onClick={handleGenerateDescription}
                    className="p-1.5 rounded-full bg-slate-100 text-slate-400 hover:text-blue-600"
                    disabled={isGenDesc}
                 >
                    {isGenDesc ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                 </button>
              </div>
            </div>
         </div>
      </div>
    );
    if (step === 2) return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
         {/* Pricing - Moved to Step 2 */}
         <div>
          <Label className="mb-3 block">Pricing Mode</Label>
          <div className="flex gap-2 mb-4">
             {['fixed', 'hourly', 'range', 'na'].map(m => (
               <button 
                 key={m}
                 onClick={() => onChange('priceMode', m)}
                 className={`px-3 py-2 border rounded-full text-sm capitalize transition-colors ${formData.priceMode === m ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
               >
                 {m === 'na' ? 'Not Applicable' : m}
               </button>
             ))}
          </div>
          
          {formData.priceMode !== 'na' ? (
             <div className="relative animate-in fade-in">
                <span className="absolute left-3 top-3 text-slate-500">$</span>
                <Input className="pl-7" type="number" placeholder="0.00" value={formData.price} onChange={(e) => onChange('price', e.target.value)} />
             </div>
          ) : (
             <div className="animate-in fade-in slide-in-from-top-2">
                <div className={`p-4 bg-slate-50 border rounded-xl relative transition-colors ${formData.contextSource && formData.customPriceMessage ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200'}`}>
                   {/* Speech Bubble Arrow */}
                   <div className={`absolute -top-2 left-8 w-4 h-4 border-t border-l transform rotate-45 ${formData.contextSource && formData.customPriceMessage ? 'bg-emerald-50/30 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}></div>
                   
                   <div className="flex justify-between items-center mb-2">
                      <Label className="text-xs uppercase text-slate-500">Custom Pricing Script</Label>
                      <div className="flex items-center gap-2">
                         <span className="text-xs text-slate-500">Override Default</span>
                         <input 
                           type="checkbox" 
                           className="toggle-checkbox" 
                           checked={formData.useCustomPriceMessage}
                           onChange={(e) => onChange('useCustomPriceMessage', e.target.checked)}
                         />
                      </div>
                   </div>
                   
                   <div className="relative">
                      <textarea 
                        disabled={!formData.useCustomPriceMessage}
                        className={`w-full rounded-lg border p-3 text-sm focus:outline-none min-h-[100px] pr-20 transition-colors ${!formData.useCustomPriceMessage ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white border-slate-300 focus:ring-2 focus:ring-blue-500'}`}
                        placeholder={!formData.useCustomPriceMessage ? "Using default response: 'Pricing for this service depends on onsite assessment...'" : "Enter what Sophiie should say about price..."}
                        value={formData.customPriceMessage}
                        onChange={(e) => onChange('customPriceMessage', e.target.value)}
                      />
                      {formData.useCustomPriceMessage && (
                         <div className="absolute bottom-3 right-3 flex gap-2">
                            <button className="p-1.5 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"><Mic className="w-3 h-3" /></button>
                            <button className="p-1.5 rounded-full bg-purple-50 text-purple-500 hover:bg-purple-100 transition-colors"><Sparkles className="w-3 h-3" /></button>
                         </div>
                      )}
                   </div>
                   {formData.contextSource && formData.useCustomPriceMessage && (
                        <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Auto-generated from context
                        </div>
                   )}
                </div>
             </div>
          )}
        </div>

         <div>
           <Label className="mb-2 block flex justify-between">
                Follow-up Questions
                {formData.questions.length > 0 && formData.contextSource && <span className="text-xs text-emerald-600 font-medium">AI Auto-filled</span>}
           </Label>
           <div className="space-y-2 mb-3">
              {/* Default or AI Generated Questions */}
              {formData.questions.length > 0 ? (
                 formData.questions.map((q, i) => (
                    <div key={i} className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-sm flex justify-between group animate-in slide-in-from-bottom-2 fade-in">
                       <span className="text-emerald-900">{q}</span>
                       <div className="flex items-center gap-2">
                          <Trash2 className="w-4 h-4 text-emerald-400 cursor-pointer hover:text-red-500" />
                       </div>
                    </div>
                 ))
              ) : (
                 <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm flex justify-between group">
                    <span>Is the water currently turned off?</span>
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
    );
    if (step === 3) return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
         <Label className="mb-4 block">Outcome</Label>
         
         {/* 4-Card Grid Layout */}
         <div className="grid grid-cols-2 gap-4 mb-6">
            {[
               { id: 'collect', label: 'Collect Info', icon: ClipboardList, color: 'text-orange-500' },
               { id: 'transfer', label: 'Transfer', icon: PhoneForwarded, color: 'text-blue-500' },
               { id: 'book', label: 'Booking', icon: CalendarCheck, color: 'text-purple-500' },
               { id: 'send_info', label: 'Send Info', icon: Mail, color: 'text-green-500' }
            ].map(opt => (
               <div 
                  key={opt.id} 
                  onClick={() => onChange('serviceOutcome', opt.id)}
                  className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center text-center transition-all ${formData.serviceOutcome === opt.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
               >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm">
                     <opt.icon className={`w-5 h-5 ${opt.color}`} />
                  </div>
                  <span className="text-sm font-semibold capitalize">{opt.label}</span>
               </div>
            ))}
         </div>
         
         {/* Dynamic UI based on Selection */}
         
         {/* 1. Collect Info UI */}
         {formData.serviceOutcome === 'collect' && (
            <div className="space-y-6 animate-in fade-in">
               <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <Label className="text-xs text-slate-500 uppercase block mb-2">Closing Script (Optional)</Label>
                  <textarea 
                     className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                     rows={3}
                     placeholder="e.g. I'll take your details and have someone from the team call you back shortly."
                     value={formData.serviceClosingScript}
                     onChange={(e) => onChange('serviceClosingScript', e.target.value)}
                  />
                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                     <CheckCircle2 className="w-3 h-3" /> Sophiie will automatically ask for name & contact details.
                  </p>
               </div>

               {/* Reusing Questions Logic for Collect Info */}
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
                           <span>Best time to call back?</span>
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

         {/* 2. Transfer UI */}
         {formData.serviceOutcome === 'transfer' && (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 animate-in fade-in">
               <Label className="mb-2 block">Routing</Label>
               <TransferRoutingSelector 
                  type={formData.serviceDestinationType}
                  value={formData.serviceDestinationValue}
                  onChangeType={(val) => onChange('serviceDestinationType', val)}
                  onChangeValue={(val) => onChange('serviceDestinationValue', val)}
                  onAddNew={() => onSwitchMode('staff')}
               />
            </div>
         )}

         {/* 3. Book UI */}
         {formData.serviceOutcome === 'book' && (
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 flex items-center gap-3 animate-in fade-in">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm">
                  <CalendarCheck className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-purple-900">Calendar Active</h4>
                  <p className="text-xs text-purple-700">Bookings will be added to <strong>Main Calendar (Synced)</strong>.</p>
               </div>
            </div>
         )}

         {/* 4. Send Info UI */}
         {formData.serviceOutcome === 'send_info' && (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 animate-in fade-in space-y-4">
               <div>
                  <Label className="text-xs text-slate-500 uppercase block mb-1">Send Details To</Label>
                  <div className="flex rounded-lg border border-slate-300 overflow-hidden bg-white h-10">
                     <button 
                        onClick={() => onChange('serviceSendInfoType', 'team')} 
                        className={`flex-1 text-xs font-medium border-r border-slate-200 hover:bg-slate-50 transition-colors ${formData.serviceSendInfoType === 'team' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}
                     >
                        Team Member
                     </button>
                     <button 
                        onClick={() => onChange('serviceSendInfoType', 'external')} 
                        className={`flex-1 text-xs font-medium hover:bg-slate-50 transition-colors ${formData.serviceSendInfoType === 'external' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}
                     >
                        External Contact
                     </button>
                  </div>
               </div>

               {formData.serviceSendInfoType === 'team' ? (
                  <div>
                     <Label className="mb-1 block text-xs">Select Staff</Label>
                     <TeamMemberSelector 
                        value={formData.serviceSendInfoValue}
                        onChange={(val) => onChange('serviceSendInfoValue', val)}
                        onAddNew={() => onSwitchMode('staff')}
                     />
                  </div>
               ) : (
                  <div className="space-y-3">
                     <div>
                        <Label className="mb-1 block text-xs">Email Address</Label>
                        <div className="relative">
                           <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                           <Input className="pl-9 h-9" placeholder="recipient@example.com" />
                        </div>
                     </div>
                     <div>
                        <Label className="mb-1 block text-xs">Mobile Number</Label>
                        <div className="relative">
                           <Smartphone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                           <Input className="pl-9 h-9" placeholder="+1..." />
                        </div>
                     </div>
                  </div>
               )}
            </div>
         )}
      </div>
    );
  }

  // --- Staff Form ---
  if (mode === 'staff') {
     if(step === 1) return (
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
     if(step === 2) return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
           <div>
              <Label className="mb-2 block">Responsibilities</Label>
              <p className="text-xs text-slate-500 mb-2">Tell Sophiie what this person handles.</p>
              <textarea 
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
     if(step === 3) return (
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

  // --- Scenario / Protocol Form ---
  if (mode === 'protocol') {
    if (step === 1) return (
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
    if (step === 2) return (
       <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div>
             <Label className="mb-4 block">Response Logic</Label>
             <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                   { id: 'collect', label: 'Collect Info', icon: ClipboardList, color: 'text-orange-500' },
                   { id: 'transfer', label: 'Transfer', icon: PhoneForwarded, color: 'text-blue-500' },
                   { id: 'book', label: 'Booking', icon: CalendarCheck, color: 'text-purple-500' },
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
                   onAddNew={() => onSwitchMode('staff')}
                />
             </div>
          )}

          {/* Book UI */}
          {formData.protocolAction === 'book' && (
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 flex items-center gap-3 animate-in fade-in">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm">
                  <CalendarCheck className="w-5 h-5" />
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
                   <textarea 
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
                <textarea 
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
    if (step === 3) return (
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
                         {formData.questions.length > 0 ? formData.questions.map((q,i) => <li key={i}>{q}</li>) : <li>Default Questions</li>}
                      </ul>
                   </div>
                </div>
             )}
          </div>
       </div>
    );
  }

  // --- Transfer Form ---
  if (mode === 'transfer') {
     if (step === 1) return (
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
     if (step === 2) return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
           <div>
              <Label className="mb-2 block">Handoff Message (Whisper)</Label>
              <p className="text-xs text-slate-500 mb-3">What the AI says to the agent before connecting.</p>
              <div className="relative">
                 <textarea 
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
     if (step === 3) return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
           <Label className="mb-4 block">Routing Logic</Label>
           <div className="space-y-4">
              
              {/* Reused Unified Routing Component */}
              <TransferRoutingSelector 
                 type={formData.transferDestinationType}
                 value={formData.transferDestinationValue}
                 onChangeType={(val) => onChange('transferDestinationType', val)}
                 onChangeValue={(val) => onChange('transferDestinationValue', val)}
                 onAddNew={() => onSwitchMode('staff')}
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

  // Fallback for other modes
  return <div className="p-10 text-center text-slate-400">Form content for {mode} step {step}</div>;
};

// --- Live Simulator Component ---

const LiveSimulator = ({ mode, formData, step, onChange, updateFormFields, onStepAdvance, simulatorTab, setSimulatorTab, setActiveField }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  
  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  
  // Conversation State Machine
  // Phases: 'INIT', 'ASK_NAME', 'CONFIRM_NAME', 'CHECK_KB', 'KB_DECISION', 'ASK_DESC', 'ASK_UPLOAD', 'DONE'
  const [convoPhase, setConvoPhase] = useState('INIT'); 

  // Preview Chat State
  const [previewInput, setPreviewInput] = useState("");

  // Initialize Simulation
  useEffect(() => {
    setMessages([{ role: 'bot', text: "Hi, thanks for calling ABC Plumbing. How can I help you today?" }]);
  }, [mode]);

  // Voice Interaction Effect
  useEffect(() => {
    if (simulatorTab !== 'voice') {
        setActiveField(null);
        return;
    }

    const speak = (text) => {
      setIsSpeaking(true);
      const u = new SpeechSynthesisUtterance(text);
      u.onend = () => {
        setIsSpeaking(false);
        if (!isMicMuted) listen(); 
      };
      window.speechSynthesis.speak(u);
    };

    const listen = () => {
      if (isMicMuted) return;
      setIsListening(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return; 

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setVoiceTranscript(transcript);
        handleVoiceInput(transcript);
      };

      recognition.onend = () => setIsListening(false);
    };

    // --- STATE MACHINE DRIVER ---
    if (mode === 'service' && !isSpeaking && !isListening && !voiceTranscript) {
        
        if (convoPhase === 'INIT') {
            setConvoPhase('ASK_NAME');
            setActiveField('serviceName');
            const msg = "Let's set up a new service. What is the name of this service?";
            setMessages(prev => [...prev, { role: 'bot', text: msg }]);
            speak(msg);
        }
        
        // NOTE: Other phases are triggered by user input (handleVoiceInput)
    }

  }, [simulatorTab, step, mode, isMicMuted, convoPhase, messages]); 

  const handleVoiceInput = (text) => {
    // Add user response to chat
    setMessages(prev => [...prev, { role: 'user', text: text }]);

    if (mode === 'service') {
       
       if (convoPhase === 'ASK_NAME') {
          // Capture Name
          onChange('serviceName', text);
          setConvoPhase('CONFIRM_NAME');
          
          // Immediate Confirmation
          setTimeout(() => {
              const reply = `I heard ${text}. Is that correct?`;
              setMessages(prev => [...prev, { role: 'bot', text: reply }]);
              const u = new SpeechSynthesisUtterance(reply);
              u.onend = () => { setIsSpeaking(false); if(!isMicMuted) {
                  // Manually re-trigger listen because we are inside the flow
                  // The useEffect won't catch this transition immediately
                  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                  if (SpeechRecognition) {
                      const recognition = new SpeechRecognition();
                      recognition.lang = 'en-US';
                      recognition.start();
                      recognition.onresult = (e) => {
                          const t = e.results[0][0].transcript;
                          setVoiceTranscript(t);
                          handleVoiceInput(t);
                      };
                  }
              }}; 
              window.speechSynthesis.speak(u);
              setIsSpeaking(true);
          }, 500);
       }
       
       else if (convoPhase === 'CONFIRM_NAME') {
           if (text.toLowerCase().includes('yes')) {
               // Check for KB (Simulated)
               if (formData.serviceName.length > 4) {
                   // KB Found path
                   setConvoPhase('KB_DECISION');
                   const reply = "I've found relevant details in SOP_Manual.pdf. Would you like me to auto-fill the description and pricing based on that document?";
                   setMessages(prev => [...prev, { role: 'bot', text: reply }]);
                   const u = new SpeechSynthesisUtterance(reply);
                   u.onend = () => { setIsSpeaking(false); if(!isMicMuted) {
                       // Re-listen logic
                        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                        if (SpeechRecognition) {
                            const recognition = new SpeechRecognition();
                            recognition.lang = 'en-US';
                            recognition.start();
                            recognition.onresult = (e) => {
                                const t = e.results[0][0].transcript;
                                setVoiceTranscript(t);
                                handleVoiceInput(t);
                            };
                        }
                   }};
                   window.speechSynthesis.speak(u);
                   setIsSpeaking(true);
               } else {
                   // No KB path
                   setConvoPhase('ASK_UPLOAD'); 
                   const reply = "I didn't find any relevant documents. Do you want to upload one, or just describe the service manually?";
                   setMessages(prev => [...prev, { role: 'bot', text: reply }]);
                   const u = new SpeechSynthesisUtterance(reply);
                   u.onend = () => { setIsSpeaking(false); if(!isMicMuted) {
                        // Re-listen logic
                        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                        if (SpeechRecognition) {
                            const recognition = new SpeechRecognition();
                            recognition.lang = 'en-US';
                            recognition.start();
                            recognition.onresult = (e) => {
                                const t = e.results[0][0].transcript;
                                setVoiceTranscript(t);
                                handleVoiceInput(t);
                            };
                        }
                   }};
                   window.speechSynthesis.speak(u);
                   setIsSpeaking(true);
               }
           } else {
               // Retry Name
               onChange('serviceName', '');
               setConvoPhase('ASK_NAME');
               const reply = "Sorry about that. Please say the name again.";
               const u = new SpeechSynthesisUtterance(reply);
               u.onend = () => { setIsSpeaking(false); if(!isMicMuted) {
                    // Re-listen logic
                    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    if (SpeechRecognition) {
                        const recognition = new SpeechRecognition();
                        recognition.lang = 'en-US';
                        recognition.start();
                        recognition.onresult = (e) => {
                            const t = e.results[0][0].transcript;
                            setVoiceTranscript(t);
                            handleVoiceInput(t);
                        };
                    }
               }};
               window.speechSynthesis.speak(u);
               setIsSpeaking(true);
           }
       }

       else if (convoPhase === 'KB_DECISION') {
           if (text.toLowerCase().includes('yes')) {
               // Trigger Auto Fill & ADVANCE STEP
               updateFormFields({
                    contextSource: 'SOP_Manual.pdf (Smart Find)',
                    description: "Professional heater diagnosis and repair. We check gas/electric connections, pilot lights, and thermostats.",
                    priceMode: 'na',
                    useCustomPriceMessage: true,
                    customPriceMessage: "Based on our SOP, heater repairs require an on-site diagnosis. We charge a $89 call-out fee which is waived if you proceed.",
                    questions: ["Is the area easily accessible?", "How old is the current unit?", "Is it gas or electric?"]
               });
               
               const reply = "Done. I've filled in the description, pricing, and follow-up questions for you. Moving to the next step.";
               setMessages(prev => [...prev, { role: 'bot', text: reply }]);
               const u = new SpeechSynthesisUtterance(reply);
               window.speechSynthesis.speak(u);
               setIsSpeaking(true);
               
               // Advance Wizard
               setTimeout(() => onStepAdvance(2), 2000);
               setConvoPhase('DONE'); 

           } else {
               setConvoPhase('ASK_DESC'); // Fallback to manual
               setActiveField('description');
               const reply = "Okay, let's do it manually. Please describe the service briefly.";
               setMessages(prev => [...prev, { role: 'bot', text: reply }]);
               const u = new SpeechSynthesisUtterance(reply);
               u.onend = () => { setIsSpeaking(false); if(!isMicMuted) {
                    // Re-listen
                    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    if (SpeechRecognition) {
                        const recognition = new SpeechRecognition();
                        recognition.lang = 'en-US';
                        recognition.start();
                        recognition.onresult = (e) => {
                            const t = e.results[0][0].transcript;
                            setVoiceTranscript(t);
                            handleVoiceInput(t);
                        };
                    }
               }};
               window.speechSynthesis.speak(u);
               setIsSpeaking(true);
           }
       }

       else if (convoPhase === 'ASK_UPLOAD') {
           if (text.toLowerCase().includes('upload')) {
               // Simulate Upload Trigger
               const reply = "Okay, I'm opening the upload window for you.";
               setMessages(prev => [...prev, { role: 'bot', text: reply }]);
               const u = new SpeechSynthesisUtterance(reply);
               window.speechSynthesis.speak(u);
               setIsSpeaking(true);
               // In real app, trigger file picker. Here we just say it.
               setConvoPhase('DONE');
           } else {
               setConvoPhase('ASK_DESC'); // Fallback to description
               setActiveField('description');
               const reply = "Understood. Please describe the service briefly.";
               setMessages(prev => [...prev, { role: 'bot', text: reply }]);
               const u = new SpeechSynthesisUtterance(reply);
               u.onend = () => { setIsSpeaking(false); if(!isMicMuted) {
                    // Re-listen
                    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    if (SpeechRecognition) {
                        const recognition = new SpeechRecognition();
                        recognition.lang = 'en-US';
                        recognition.start();
                        recognition.onresult = (e) => {
                            const t = e.results[0][0].transcript;
                            setVoiceTranscript(t);
                            handleVoiceInput(t);
                        };
                    }
               }};
               window.speechSynthesis.speak(u);
               setIsSpeaking(true);
           }
       }

       else if (convoPhase === 'ASK_DESC') {
           onChange('description', text);
           setActiveField(null);
           const reply = "Description saved. Let's move to pricing.";
           setMessages(prev => [...prev, { role: 'bot', text: reply }]);
           const u = new SpeechSynthesisUtterance(reply);
           window.speechSynthesis.speak(u);
           setIsSpeaking(true);
           
           setTimeout(() => onStepAdvance(2), 2000);
           setConvoPhase('DONE'); 
       }
    }
  };

  const handlePreviewSend = async (text) => {
      if (!text.trim()) return;
      
      // User speaks
      setMessages(prev => [...prev, { role: 'user', text: text }]);
      setPreviewInput("");
      setIsTyping(true);
      
      // Use Gemini for Dynamic Chat Simulation
      const systemPrompt = `You are Sophiie, an AI receptionist for a company.
      Current Configuration Context:
      - Service being configured: ${formData.serviceName || 'Unknown'} (${formData.description || 'No description'})
      - Pricing: ${formData.priceMode === 'fixed' ? '$'+formData.price : formData.priceMode === 'na' ? formData.customPriceMessage : 'Standard rates'}
      - Staff: ${formData.staffName || 'Unknown'} (${formData.staffRole || 'Staff'})
      - Transfer Rule: ${formData.transferName || 'None'} -> ${formData.transferSummary || 'Standard transfer'}
      
      User (Owner testing the bot) says: "${text}"
      
      Reply briefly as Sophiie would to a customer, using the configuration context if relevant. If not relevant, just be helpful.`;
      
      const botResponse = await callGemini(systemPrompt);

      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: botResponse || "I'm having trouble connecting to my brain right now." }]);
  };
  
  const handlePreviewMic = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return; 

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPreviewInput(transcript); // Fill input instead of auto-sending
      };
  };


  // Auto-scroll
  useEffect(() => {
    if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full bg-slate-50">
       <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-50" />
       
       {/* INVITATION STATE */}
       {simulatorTab === 'invitation' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in">
             <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <Bot className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">Configure {mode === 'service' ? 'Service' : 'Settings'}</h3>
             <p className="text-slate-500 text-sm text-center mb-8 max-w-xs">How would you like to proceed with this setup?</p>
             
             <div className="w-full max-w-xs space-y-4">
                <button 
                   onClick={() => setSimulatorTab('preview')}
                   className="w-full p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex items-center gap-4 text-left group"
                >
                   <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600">
                      <Keyboard className="w-5 h-5" />
                   </div>
                   <div>
                      <div className="font-bold text-slate-800 group-hover:text-blue-700">Manual Entry</div>
                      <div className="text-xs text-slate-500">I'll type the details myself</div>
                   </div>
                </button>

                <button 
                   onClick={() => setSimulatorTab('voice')}
                   className="w-full p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-purple-500 hover:shadow-md transition-all flex items-center gap-4 text-left group"
                >
                   <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-100">
                      <Mic className="w-5 h-5" />
                   </div>
                   <div>
                      <div className="font-bold text-slate-800 group-hover:text-purple-700">Voice Setup</div>
                      <div className="text-xs text-slate-500">Guide me through it</div>
                   </div>
                </button>
             </div>
          </div>
       )}

       {/* TABBED INTERFACE (Voice or Preview) */}
       {simulatorTab !== 'invitation' && (
       <>
       <div className="px-4 py-3 bg-white border-b border-slate-200 flex justify-center items-center shadow-sm z-10 animate-in slide-in-from-top-2 relative">
          
          <div className="flex p-1 bg-slate-100 rounded-lg">
             <button 
                onClick={() => setSimulatorTab('preview')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${simulatorTab === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Live Preview
             </button>
             <button 
                onClick={() => setSimulatorTab('voice')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${simulatorTab === 'voice' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Voice Setup
                {simulatorTab === 'voice' && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>}
             </button>
          </div>

          <button 
            onClick={() => setMessages([{ role: 'bot', text: "Hi, thanks for calling ABC Plumbing. How can I help you today?" }])}
            className="absolute right-4 text-xs text-slate-400 hover:text-slate-600 font-medium flex items-center"
          >
             <RotateCcw className="w-3 h-3" />
          </button>
       </div>
       
       {/* Subtitles */}
       <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                {simulatorTab === 'voice' ? "Sophiie will ask you questions to build your configuration." : "Test your current configuration by chatting with Sophiie."}
            </p>
       </div>

       {simulatorTab === 'voice' ? (
          <div className="flex-1 flex flex-col min-h-0 animate-in fade-in zoom-in-95">
             
             {/* Chat History Container for Voice Mode - Scrollable & Flexible */}
             <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0" ref={scrollRef}>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs text-white ${msg.role === 'bot' ? 'bg-purple-600' : 'bg-slate-400'}`}>
                        {msg.role === 'bot' ? <Bot className="w-4 h-4" /> : <div className="font-bold">U</div>}
                    </div>
                    <div className={`py-2.5 px-3.5 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${msg.role === 'bot' ? 'bg-white text-slate-700 rounded-tl-sm border border-slate-100' : 'bg-purple-600 text-white rounded-tr-sm'}`}>
                        {msg.text}
                    </div>
                    </div>
                ))}
             </div>

             {/* Active Listening State at Bottom - Fixed */}
             <div className="flex-none w-full p-6 bg-white border-t border-slate-200 flex flex-col items-center justify-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${isSpeaking ? 'bg-purple-100 scale-110' : isListening ? 'bg-green-50 scale-105' : 'bg-slate-100'}`}>
                    <div className={`w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center relative z-10`}>
                    {isMicMuted ? (
                        <MicOff className="w-6 h-6 text-slate-400" />
                    ) : (
                        <Bot className={`w-6 h-6 transition-colors ${isSpeaking ? 'text-purple-600' : isListening ? 'text-green-500' : 'text-slate-400'}`} />
                    )}
                    </div>
                    {/* Pulse Rings */}
                    {isSpeaking && !isMicMuted && (
                    <>
                        <div className="absolute w-20 h-20 rounded-full border-2 border-purple-200 animate-ping opacity-20"></div>
                        <div className="absolute w-24 h-24 rounded-full border border-purple-100 animate-pulse opacity-40"></div>
                    </>
                    )}
                    {isListening && !isMicMuted && (
                    <div className="absolute w-20 h-20 rounded-full bg-green-500/10 animate-pulse"></div>
                    )}
                </div>
                
                <div className="max-w-xs space-y-1 text-center min-h-[40px]">
                    {isSpeaking && <p className="text-xs font-medium text-purple-600 animate-in fade-in">Sophiie is speaking...</p>}
                    {isListening && <p className="text-xs font-medium text-green-600 animate-in fade-in">Listening...</p>}
                    {!isSpeaking && !isListening && !voiceTranscript && (
                         <Button size="sm" className="mt-2" onClick={() => setVoiceTranscript(' ')}>Start Conversation</Button>
                    )}
                </div>

                <div className="mt-4 flex gap-4">
                    {/* Mute and Stop Controls */}
                    <Button variant="outline" size="icon" onClick={() => setIsMicMuted(!isMicMuted)} className={isMicMuted ? "bg-red-50 border-red-200 text-red-500" : ""}>
                    {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                    {(isSpeaking || isListening) && (
                    <Button variant="outline" size="icon" onClick={() => window.speechSynthesis.cancel()}>
                        <Square className="w-4 h-4 fill-current" />
                    </Button>
                    )}
                </div>
             </div>
          </div>
       ) : (
          <div className="flex-1 flex flex-col min-h-0 animate-in fade-in zoom-in-95">
             <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0" ref={scrollRef}>
                {messages.map((msg, idx) => (
                   <div key={idx} className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs text-white ${msg.role === 'bot' ? 'bg-blue-600' : msg.role === 'system' ? 'bg-orange-500' : 'bg-slate-400'}`}>
                         {msg.role === 'bot' ? <Headset className="w-4 h-4" /> : msg.role === 'system' ? <Zap className="w-4 h-4" /> : <div className="font-bold">U</div>}
                      </div>
                      <div className={`py-2.5 px-3.5 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${msg.role === 'bot' ? 'bg-white text-slate-700 rounded-tl-sm border border-slate-100' : msg.role === 'system' ? 'bg-orange-50 text-orange-800 border border-orange-100 w-full' : 'bg-blue-600 text-white rounded-tr-sm'}`}>
                         {msg.text}
                      </div>
                   </div>
                ))}
                {isTyping && (
                   <div className="flex gap-3 animate-in fade-in">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white"><Headset className="w-4 h-4" /></div>
                      <div className="bg-white border border-slate-100 py-3 px-4 rounded-2xl rounded-tl-sm flex gap-1">
                         <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                         <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75" />
                         <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
                      </div>
                   </div>
                )}
             </div>
             
             {/* Interactive Input Area */}
             <div className="p-4 bg-white border-t border-slate-200">
                 <form 
                    className="flex gap-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handlePreviewSend(previewInput);
                    }}
                 >
                    <div className="relative flex-1">
                       <input 
                          className="w-full h-10 bg-slate-100 rounded-full border border-transparent px-4 pr-10 text-slate-700 text-sm focus:bg-white focus:border-blue-400 focus:outline-none transition-all"
                          placeholder="Type a message..."
                          value={previewInput}
                          onChange={(e) => setPreviewInput(e.target.value)}
                       />
                       <button 
                          type="button"
                          onClick={handlePreviewMic}
                          className="absolute right-1 top-1 p-1.5 rounded-full text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                       >
                          <Mic className="w-4 h-4" />
                       </button>
                    </div>
                    <button 
                        type="submit"
                        disabled={!previewInput.trim()}
                        className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                    >
                       <Send className="w-4 h-4 ml-0.5" />
                    </button>
                 </form>
             </div>
          </div>
       )}
       </>
       )}
    </div>
  );
};

// --- Settings Modal ---

const SettingsModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center animate-in fade-in duration-200">
     <div className="bg-white w-[500px] rounded-xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
           <h3 className="font-bold text-slate-800">Global Settings</h3>
           <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="p-6 space-y-4">
           <div>
              <Label className="mb-2 block">Transfer Timeout</Label>
              <Input type="number" defaultValue={30} />
              <p className="text-xs text-slate-500 mt-1">Seconds before pulling call back.</p>
           </div>
           <div>
              <Label className="mb-2 block">Hold Message</Label>
              <textarea className="w-full rounded-lg border border-slate-300 p-2 text-sm" rows={2} defaultValue="Please hold while I connect you..." />
           </div>
           <div>
              <Label className="mb-2 block">Fallback Action</Label>
              <select className="w-full rounded-lg border border-slate-300 h-10 px-3 bg-white text-sm">
                 <option>Take a message</option>
                 <option>Hang up</option>
              </select>
           </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
           <Button onClick={onClose}>Save Settings</Button>
        </div>
     </div>
  </div>
);