import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Headset, Mail, Users, Wrench, ListChecks, ArrowRightLeft,
    Book, Settings, HelpCircle, Bot, ShieldAlert, Menu, X, ChevronDown,
    LayoutGrid, Briefcase, Bell, Tag, Mic, MessageSquare, Sliders, Sun, Moon,
    ShoppingBag, Check, CheckCircle
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { Switch } from '@/components/ui/switch';
import { SophiieLogo } from '@/components/icons/SophiieLogo';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SetupProgressModal } from '@/components/modals/SetupProgressModal';
import { useDemo } from '@/context/DemoContext';

const NavIcon = ({ icon, active, onClick }) => (
    <button onClick={onClick} className={cn(
        "text-xl transition-all relative group flex items-center justify-center w-full",
        active ? 'text-blue-400 opacity-100' : 'text-white opacity-60 hover:opacity-100'
    )}>
        {React.cloneElement(icon, { size: 22 })}
        {active &&
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-400 rounded-r-md" />
        }
    </button>
);

const SidebarGroup = ({ title, children, open = true }) => {
    const [isOpen, setIsOpen] = React.useState(open);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 hover:text-slate-600 dark:hover:text-slate-300 transition-colors group"
            >
                <span>{title}</span>
                <ChevronDown className={cn(
                    "w-3 h-3 transition-transform duration-200 opacity-0 group-hover:opacity-100",
                    isOpen ? "rotate-0" : "-rotate-90"
                )} />
            </button>
            <div className={cn(
                "grid transition-all duration-200 ease-in-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}>
                <ul className="space-y-1 overflow-hidden min-h-0">{children}</ul>
            </div>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
    <li>
        <button onClick={onClick} className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative",
            active
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
        )}>
            {React.cloneElement(icon, { size: 18, className: cn("flex-shrink-0", active ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500') })}
            <span className="flex-1 text-left leading-snug">{label}</span>
        </button>
    </li>
);

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.substring(1) || 'services';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isSubMenuOpen, setIsSubMenuOpen] = React.useState(true);
    const { theme, setTheme } = useTheme();
    const [showSettingsPopover, setShowSettingsPopover] = React.useState(false);
    const [showProfilePopover, setShowProfilePopover] = React.useState(false);
    const [showMobileSettings, setShowMobileSettings] = React.useState(false);
    const [showProgressModal, setShowProgressModal] = React.useState(false);
    const settingsRef = React.useRef(null);
    const { isBlankState, switchProfile, setupProgress } = useDemo();

    // Correct Progress Calculation matching SetupProgressTracker
    const getCountableItems = () => {
        // Exclude 'Advanced' items if they are tagged as such, or by ID if consistent
        // Based on SetupProgressTracker logic:
        const advancedIds = ['voice', 'behaviors', 'tags', 'notifications'];
        return setupProgress.filter(item => !advancedIds.includes(item.id));
    };

    const countableItems = getCountableItems();
    // Fallback if filtering fails or logic differs
    const itemsToCount = countableItems.length > 0 ? countableItems : setupProgress;

    const completedCount = itemsToCount.filter(s => s.isComplete).length;
    const totalCount = itemsToCount.length;

    // Safety check for 0
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Click outside handler for desktop popover
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setShowSettingsPopover(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [settingsRef]);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden h-16 bg-slate-950 flex items-center justify-between px-4 z-50 flex-shrink-0">
                <div className="flex items-center gap-3 text-white">
                    <SophiieLogo className="w-8 h-8" />
                    <span className="font-bold text-lg tracking-tight">Sophiie</span>
                </div>
                <button onClick={toggleMobileMenu} className="text-white p-2">
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 top-16 z-40 bg-white dark:bg-slate-950 flex flex-col animate-in slide-in-from-right-full duration-300">
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Train Sophiie Section */}
                        <div>
                            <button
                                onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl mb-2"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-slate-900 dark:text-white text-sm">Train Sophiie</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">Knowledge & Behavior</div>
                                    </div>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform ${isSubMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isSubMenuOpen && (
                                <ul className="pl-2 space-y-1 list-none animate-in slide-in-from-top-2">
                                    <SidebarItem icon={<LayoutGrid />} label="Overview" active={currentPath === 'overview'} onClick={() => { navigate('/overview'); setIsMobileMenuOpen(false); }} />
                                    <SidebarItem icon={<Briefcase />} label="Business Info" active={currentPath === 'business-info'} onClick={() => { navigate('/business-info'); setIsMobileMenuOpen(false); }} />
                                    <SidebarItem icon={<Wrench />} label="Services" active={currentPath === 'services'} onClick={() => { navigate('/services'); setIsMobileMenuOpen(false); }} />
                                    <SidebarItem icon={<ShoppingBag />} label="Products" active={currentPath === 'products'} onClick={() => { navigate('/products'); setIsMobileMenuOpen(false); }} />
                                    <SidebarItem icon={<Book />} label="Documents" active={currentPath === 'knowledge'} onClick={() => { navigate('/knowledge'); setIsMobileMenuOpen(false); }} />
                                    <SidebarItem icon={<ListChecks />} label="Policies" active={currentPath === 'policies'} onClick={() => { navigate('/policies'); setIsMobileMenuOpen(false); }} />
                                    <SidebarItem icon={<HelpCircle />} label="FAQs" active={currentPath === 'faqs'} onClick={() => { navigate('/faqs'); setIsMobileMenuOpen(false); }} />
                                    <SidebarItem icon={<ShieldAlert />} label="Scenarios & Restrictions" active={currentPath === 'scenarios'} onClick={() => { navigate('/scenarios'); setIsMobileMenuOpen(false); }} />
                                    <SidebarItem icon={<Users />} label="Staff & Departments" active={currentPath === 'staff'} onClick={() => { navigate('/staff'); setIsMobileMenuOpen(false); }} />
                                    <SidebarItem icon={<ArrowRightLeft />} label="Transfers" active={currentPath === 'transfers'} onClick={() => { navigate('/transfers'); setIsMobileMenuOpen(false); }} />
                                    <SidebarItem icon={<Bell />} label="Notifications" active={currentPath === 'notifications'} onClick={() => { navigate('/notifications'); setIsMobileMenuOpen(false); }} />
                                    <SidebarItem icon={<Tag />} label="Tags" active={currentPath === 'tags'} onClick={() => { navigate('/tags'); setIsMobileMenuOpen(false); }} />
                                    <SidebarItem icon={<Mic />} label="Voice & Personality" active={currentPath === 'voice'} onClick={() => { navigate('/voice'); setIsMobileMenuOpen(false); }} />
                                    <SidebarItem icon={<MessageSquare />} label="Greetings & Closings" active={currentPath === 'greetings'} onClick={() => { navigate('/greetings'); setIsMobileMenuOpen(false); }} />
                                    <SidebarItem icon={<Sliders />} label="Behaviors" active={currentPath === 'behaviors'} onClick={() => { navigate('/behaviors'); setIsMobileMenuOpen(false); }} />
                                </ul>
                            )}
                        </div>

                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />

                        {/* Main Navigation */}
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <Mail className="w-6 h-6" />
                                <span className="text-xs font-medium">Inbox</span>
                            </button>
                            <button
                                onClick={() => setShowMobileSettings(true)}
                                className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <Settings className="w-6 h-6" />
                                <span className="text-xs font-medium">Settings</span>
                            </button>
                        </div>

                        {/* Mobile Settings Modal/Overlay */}
                        {showMobileSettings && (
                            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                                <div className="bg-white dark:bg-slate-950 rounded-2xl w-full max-w-xs p-6 shadow-2xl animate-in zoom-in-95">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Settings</h3>
                                        <button onClick={() => setShowMobileSettings(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            {theme === 'dark' ? <Moon className="text-blue-500" size={20} /> : <Sun className="text-orange-500" size={20} />}
                                            <span className="font-medium text-slate-700 dark:text-slate-200">Dark Mode</span>
                                        </div>
                                        <Switch
                                            checked={theme === 'dark'}
                                            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div >
            )
            }

            {/* Tier 1 Sidebar (Desktop) */}
            <aside className="hidden md:flex w-[72px] bg-slate-950 flex-col items-center py-6 z-30 flex-shrink-0 shadow-xl text-white">
                <div className="mb-10 text-2xl opacity-90 hover:opacity-100 cursor-pointer text-white">
                    <SophiieLogo className="w-8 h-8" />
                </div>
                <nav className="flex-1 w-full flex flex-col gap-6 px-2 items-center">
                    <NavIcon icon={<Mail />} />
                    <NavIcon icon={<Users />} onClick={() => navigate('/staff')} />
                    <NavIcon icon={<Wrench />} onClick={() => navigate('/services')} />
                    <NavIcon icon={<ListChecks />} onClick={() => navigate('/scenarios')} />
                    <NavIcon icon={<ArrowRightLeft />} onClick={() => navigate('/transfers')} />
                    <NavIcon icon={<Book />} onClick={() => navigate('/knowledge')} />

                    <div className="mt-auto flex flex-col gap-6 items-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/20 relative">
                            <Bot className="w-6 h-6" />
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-md -ml-3" />
                        </div>
                        <div className="relative" ref={settingsRef}>
                            <NavIcon
                                icon={<Settings />}
                                active={showSettingsPopover}
                                onClick={() => setShowSettingsPopover(!showSettingsPopover)}
                            />
                            {showSettingsPopover && (
                                <div className="absolute left-full bottom-0 ml-4 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 p-4 z-50 animate-in slide-in-from-left-2 zoom-in-95 duration-200">
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Appearance</h4>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                                        <div className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                                            {theme === 'dark' ? <Moon size={16} className="text-blue-400" /> : <Sun size={16} className="text-orange-400" />}
                                            <span>Dark Mode</span>
                                        </div>
                                        <Switch
                                            checked={theme === 'dark'}
                                            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                                        />
                                    </div>

                                    {/* Triangle Pointer */}
                                    <div className="absolute left-0 bottom-4 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-900 rotate-45 border-l border-b border-slate-100 dark:border-slate-800" />
                                </div>
                            )}
                        </div>
                        <NavIcon icon={<HelpCircle />} />
                    </div>
                </nav>
                <div className="relative">
                    <button
                        onClick={() => setShowProfilePopover(!showProfilePopover)}
                        className={cn(
                            "mt-4 w-10 h-10 rounded-xl cursor-pointer shadow-lg hover:opacity-90 transition-all flex items-center justify-center",
                            isBlankState ? "bg-slate-200 dark:bg-slate-700" : "bg-gradient-to-b from-lime-400 to-emerald-500"
                        )}
                        title="Switch Profile"
                    >
                        {isBlankState ? (
                            <Users className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        ) : (
                            <div className="text-white font-bold text-xs">VE</div>
                        )}
                    </button>

                    {showProfilePopover && (
                        <div className="absolute left-full bottom-0 ml-4 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 p-4 z-50 animate-in slide-in-from-left-2 zoom-in-95 duration-200">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Switch Profile</h4>
                            <div className="space-y-2">
                                <button
                                    onClick={() => { switchProfile('vision-electrical'); setShowProfilePopover(false); }}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-3 rounded-lg transition-colors border text-left",
                                        !isBlankState
                                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                                            : "hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent"
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-lime-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                        VE
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">Vision Electrical</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">Demo Mode (Full)</div>
                                    </div>
                                    {!isBlankState && <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                                </button>

                                <button
                                    onClick={() => { switchProfile('blank-state'); setShowProfilePopover(false); }}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-3 rounded-lg transition-colors border text-left",
                                        isBlankState
                                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                                            : "hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent"
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-sm">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">Blank State</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">New User (Empty)</div>
                                    </div>
                                    {isBlankState && <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                                </button>
                            </div>

                            {/* Triangle Pointer */}
                            <div className="absolute left-0 bottom-6 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-900 rotate-45 border-l border-b border-slate-100 dark:border-slate-800" />
                        </div>
                    )}
                </div>
            </aside>

            {/* Tier 2 Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full flex-shrink-0 z-20 hidden md:flex">
                <div className="h-[97px] flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        Train Sophiie
                        <Badge variant="secondary" className="text-[10px] px-2 h-5 bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 border-0">Beta</Badge>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
                    <ul className="space-y-1">
                        <SidebarItem icon={<LayoutGrid />} label="Overview" active={currentPath === 'overview'} onClick={() => navigate('/overview')} />
                    </ul>

                    <SidebarGroup title="Knowledge Base">
                        <SidebarItem icon={<Briefcase />} label="Business Info" active={currentPath === 'business-info'} onClick={() => navigate('/business-info')} />
                        <SidebarItem icon={<Wrench />} label="Services" active={currentPath === 'services'} onClick={() => navigate('/services')} />
                        <SidebarItem icon={<ShoppingBag />} label="Products" active={currentPath === 'products'} onClick={() => navigate('/products')} />
                        <SidebarItem icon={<Book />} label="Documents" active={currentPath === 'knowledge'} onClick={() => navigate('/knowledge')} />
                        <SidebarItem icon={<ListChecks />} label="Policies" active={currentPath === 'policies'} onClick={() => navigate('/policies')} />
                        <SidebarItem icon={<HelpCircle />} label="FAQs" active={currentPath === 'faqs'} onClick={() => navigate('/faqs')} />
                        <SidebarItem icon={<ShieldAlert />} label="Scenarios & Restrictions" active={currentPath === 'scenarios'} onClick={() => navigate('/scenarios')} />
                    </SidebarGroup>

                    <SidebarGroup title="Team & Routing">
                        <SidebarItem icon={<Users />} label="Staff & Departments" active={currentPath === 'staff'} onClick={() => navigate('/staff')} />
                        <SidebarItem icon={<ArrowRightLeft />} label="Transfers" active={currentPath === 'transfers'} onClick={() => navigate('/transfers')} />
                        <SidebarItem icon={<Bell />} label="Notifications" active={currentPath === 'notifications'} onClick={() => navigate('/notifications')} />
                        <SidebarItem icon={<Tag />} label="Tags" active={currentPath === 'tags'} onClick={() => navigate('/tags')} />
                    </SidebarGroup>

                    <SidebarGroup title="Personality">
                        <SidebarItem icon={<Mic />} label="Voice & Personality" active={currentPath === 'voice'} onClick={() => navigate('/voice')} />
                        <SidebarItem icon={<MessageSquare />} label="Greetings & Closings" active={currentPath === 'greetings'} onClick={() => navigate('/greetings')} />
                        <SidebarItem icon={<Sliders />} label="Behaviors" active={currentPath === 'behaviors'} onClick={() => navigate('/behaviors')} />
                    </SidebarGroup>
                </nav>

                <button
                    onClick={() => setShowProgressModal(true)}
                    className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full text-left"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Setup Progress</span>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </button>
            </aside>

            {/* Setup Progress Modal */}
            <SetupProgressModal
                isOpen={showProgressModal}
                onClose={() => setShowProgressModal(false)}
            />
        </>
    );
}
