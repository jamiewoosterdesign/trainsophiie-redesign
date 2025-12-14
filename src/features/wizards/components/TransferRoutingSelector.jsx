
import React from 'react';
import { Input } from '@/components/ui/input';
import { TeamMemberSelector } from './TeamMemberSelector';

export function TransferRoutingSelector({ type, value, onChangeType, onChangeValue, onAddNew }) {
    return (
        <div className="space-y-3">
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                {['staff', 'queue', 'external'].map(t => (
                    <button
                        key={t}
                        onClick={() => onChangeType(t)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${type === t ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                    >
                        {t === 'staff' ? 'Staff' : t === 'queue' ? 'Department' : 'External'}
                    </button>
                ))}
            </div>

            {type === 'staff' && (
                <TeamMemberSelector value={value} onChange={onChangeValue} onAddNew={onAddNew} />
            )}

            {type === 'queue' && (
                <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 dark:text-slate-100"
                    value={value}
                    onChange={(e) => onChangeValue(e.target.value)}
                >
                    <option value="">Select Department...</option>
                    <option value="general">General Support</option>
                    <option value="sales">Sales Team</option>
                    <option value="urgent">Urgent / Escalations</option>
                </select>
            )}

            {type === 'external' && (
                <Input
                    placeholder="+1 (555) 000-0000"
                    className="bg-white dark:bg-slate-800"
                    value={value}
                    onChange={(e) => onChangeValue(e.target.value)}
                />
            )}
        </div>
    );
};
