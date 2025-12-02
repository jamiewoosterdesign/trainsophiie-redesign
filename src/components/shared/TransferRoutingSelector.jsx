import React from 'react';
import { Phone } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TeamMemberSelector } from './TeamMemberSelector';

export function TransferRoutingSelector({ type, value, onChangeType, onChangeValue, onAddNew }) {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div>
                <Label className="text-xs text-slate-500 uppercase block mb-1">Destination Type</Label>
                <div className="flex rounded-lg border border-slate-300 overflow-hidden bg-white h-10">
                    <button onClick={() => onChangeType('staff')}
                        className={`flex-1 text-xs font-medium border-r border-slate-200 hover:bg-slate-50 transition-colors ${type === 'staff' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}
                    >
                        Staff Member
                    </button>
                    <button onClick={() => onChangeType('dept')}
                        className={`flex-1 text-xs font-medium border-r border-slate-200 hover:bg-slate-50 transition-colors ${type === 'dept' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}
                    >
                        Department
                    </button>
                    <button onClick={() => onChangeType('external')}
                        className={`flex-1 text-xs font-medium hover:bg-slate-50 transition-colors ${type === 'external' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}
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
                    <TeamMemberSelector value={value} onChange={(val) => onChangeValue(val)}
                        onAddNew={onAddNew}
                    />
                )}

                {type === 'dept' && (
                    <select
                        className="w-full h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:ring-2 focus:ring-blue-500"
                        value={value} onChange={(e) => onChangeValue(e.target.value)}
                    >
                        <option>Reception Desk (Default)</option>
                        <option>Sales Department</option>
                        <option>Billing & Accounts</option>
                    </select>
                )}

                {type === 'external' && (
                    <div className="relative">
                        <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <Input className="pl-9" placeholder="+1 (555) 000-0000" value={value} onChange={(e) => onChangeValue(e.target.value)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
