import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsModal({ onClose }) {
    return (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center animate-in fade-in duration-200">
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
}
