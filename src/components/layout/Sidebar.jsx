import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Headset, Mail, Users, Wrench, ListChecks, ArrowRightLeft,
    Book, Settings, HelpCircle, Bot, ShieldAlert
} from 'lucide-react';
import { SophiieLogo } from '@/components/icons/SophiieLogo';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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

const SidebarGroup = ({ title, children }) => (
    <div>
        <h3 className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{title}</h3>
        <ul className="space-y-1">{children}</ul>
    </div>
);

const SidebarItem = ({ icon, label, active, onClick }) => (
    <li>
        <button onClick={onClick} className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        )}>
            {React.cloneElement(icon, { size: 18, className: active ? 'text-blue-500' : 'text-slate-400' })}
            {label}
        </button>
    </li>
);

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.substring(1) || 'services';

    return (
        <>
            {/* Tier 1 Sidebar */}
            <aside className="w-[72px] bg-slate-950 flex flex-col items-center py-6 z-30 flex-shrink-0 shadow-xl text-white">
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
                        <NavIcon icon={<Settings />} />
                        <NavIcon icon={<HelpCircle />} />
                    </div>
                </nav>
                <div className="mt-4 w-10 h-10 rounded-xl bg-gradient-to-b from-lime-400 to-emerald-500 cursor-pointer shadow-lg hover:opacity-90 transition-opacity">
                </div>
            </aside>

            {/* Tier 2 Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0 z-20 hidden md:flex">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Module</h2>
                    <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        Train Sophiie
                        <Badge variant="default" className="text-[10px]">Beta</Badge>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
                    <SidebarGroup title="Knowledge Base">
                        <SidebarItem icon={<Wrench />} label="Services" active={currentPath === 'services'} onClick={() => navigate('/services')} />
                        <SidebarItem icon={<Book />} label="Documents" active={currentPath === 'knowledge'} onClick={() => navigate('/knowledge')} />
                        <SidebarItem icon={<ShieldAlert />} label="Protocols" active={currentPath === 'scenarios'} onClick={() => navigate('/scenarios')} />
                        <SidebarItem icon={<ListChecks />} label="Policies" />
                        <SidebarItem icon={<HelpCircle />} label="FAQs" />
                    </SidebarGroup>

                    <SidebarGroup title="Team & Routing">
                        <SidebarItem icon={<Users />} label="Staff" active={currentPath === 'staff'} onClick={() => navigate('/staff')} />
                        <SidebarItem icon={<ArrowRightLeft />} label="Transfers" active={currentPath === 'transfers'} onClick={() => navigate('/transfers')} />
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
        </>
    );
}
