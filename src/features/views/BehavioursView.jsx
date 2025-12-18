import React, { useState, useRef } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sliders, Mic2, Ear, Music, HelpCircle, Plus, Trash2, Volume2, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';

export default function BehavioursView() {
    const { startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);

    // Interruption & Speed State
    const [patience, setPatience] = useState(50);
    const [minPause, setMinPause] = useState(0.5);
    const [interruptTime, setInterruptTime] = useState(1.2);

    // Lists
    const [pronunciations, setPronunciations] = useState([
        { id: 1, text: 'Sophiie', phonetic: 'So-fee' },
        { id: 2, text: 'Vision Electrical', phonetic: 'Viz-hun E-lec-tri-cal' },
    ]);
    const [confusions, setConfusions] = useState([
        { id: 1, original: 'Jeff', replacement: 'Jess' },
        { id: 2, original: 'Cathy', replacement: 'Kathy' },
    ]);

    // Audio
    const [bgAmbience, setBgAmbience] = useState(false);
    const [bgVolume, setBgVolume] = useState(30);
    const [processSounds, setProcessSounds] = useState(true);
    const [processVolume, setProcessVolume] = useState(50);

    // New Rule States
    const [newPronunciation, setNewPronunciation] = useState({ text: '', phonetic: '' });
    const [newConfusion, setNewConfusion] = useState({ original: '', replacement: '' });

    const addPronunciation = () => {
        if (!newPronunciation.text || !newPronunciation.phonetic) return;
        setPronunciations([...pronunciations, { id: Date.now(), ...newPronunciation }]);
        setNewPronunciation({ text: '', phonetic: '' });
    };

    const addConfusion = () => {
        if (!newConfusion.original || !newConfusion.replacement) return;
        setConfusions([...confusions, { id: Date.now(), ...newConfusion }]);
        setNewConfusion({ original: '', replacement: '' });
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            {/* Header */}
            {/* Header */}
            <PageHeader
                title="Behaviors & Settings"
                subtitle="Fine-tune how Sophiie listens, speaks, and processes."
                scrollDirection={scrollDirection}
            />

            {/* Main Content */}
            {/* Main Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950 relative">
                <div className="max-w-7xl mx-auto w-full space-y-8">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* 1. Interruption & Speed (Top Left) */}
                        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative flex flex-col h-full">
                            <div className="flex flex-col md:flex-row gap-4 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                                    <Sliders className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Interruption & Speed</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Response timing and patience.</p>
                                </div>
                            </div>

                            <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Waiting Patience</label>
                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{patience}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0" max="100"
                                        value={patience}
                                        onChange={(e) => setPatience(e.target.value)}
                                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">Higher values mean longer waits before checking if user is done.</p>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">Min Pause Time (s)</label>
                                        <Input
                                            type="number" step="0.1"
                                            value={minPause}
                                            onChange={(e) => setMinPause(e.target.value)}
                                            className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                        />
                                        <p className="text-[10px] text-slate-400 mt-1">Minimum silence before Sophiie responds.</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">Caller Interrupt (s)</label>
                                        <Input
                                            type="number" step="0.1"
                                            value={interruptTime}
                                            onChange={(e) => setInterruptTime(e.target.value)}
                                            className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                        />
                                        <p className="text-[10px] text-slate-400 mt-1">Time required to trigger an interruption.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. Pronunciations (Top Right) */}
                        {/* 2. Pronunciations (Top Right) */}
                        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative flex flex-col h-full">
                            <div className="flex flex-col md:flex-row gap-4 mb-4 border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                                    <Mic2 className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pronunciations</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Teach Sophiie specific words.</p>
                                </div>
                                <div className="md:ml-auto">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={addPronunciation}
                                        disabled={!newPronunciation.text || !newPronunciation.phonetic}
                                        className="gap-1 h-8 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700"
                                    >
                                        <Plus className="w-3 h-3" /> <span className="hidden md:inline">Add Rule</span><span className="md:hidden">Add</span>
                                    </Button>
                                </div>
                            </div>

                            {/* Input Area (Grid Side-by-Side) */}
                            <div className="grid grid-cols-2 gap-4 mb-6 shrink-0">
                                <div>
                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Word</label>
                                    <Input
                                        placeholder="e.g. Sophiie"
                                        value={newPronunciation.text}
                                        onChange={(e) => setNewPronunciation({ ...newPronunciation, text: e.target.value })}
                                        className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Phonetic Spelling</label>
                                    <Input
                                        placeholder="e.g. So-fee"
                                        value={newPronunciation.phonetic}
                                        onChange={(e) => setNewPronunciation({ ...newPronunciation, phonetic: e.target.value })}
                                        className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono text-blue-600 dark:text-blue-400"
                                    />
                                </div>
                            </div>

                            {/* Rules as Tags/Badges */}
                            <div className="flex flex-wrap gap-2">
                                {pronunciations.map(item => (
                                    <div
                                        key={item.id}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg group hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer"
                                        onClick={() => setNewPronunciation({ text: item.text, phonetic: item.phonetic })}
                                    >
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">{item.text}</span>
                                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">/{item.phonetic}/</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPronunciations(pronunciations.filter(p => p.id !== item.id));
                                            }}
                                            className="ml-1 text-slate-400 hover:text-red-500 outline-none"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                {pronunciations.length === 0 && (
                                    <div className="text-slate-400 text-xs italic">No saved rules.</div>
                                )}
                            </div>
                        </section>

                        {/* 3. Background Audio (Bottom Left) */}
                        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative flex flex-col h-full">
                            <div className="flex flex-col md:flex-row gap-4 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                                    <Music className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Background Audio</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Ambient noise and sounds.</p>
                                </div>
                            </div>

                            <div className="space-y-6 flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-slate-900 dark:text-white">Office Ambience</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Simulate a busy office background.</p>
                                    </div>
                                    <Switch checked={bgAmbience} onCheckedChange={setBgAmbience} />
                                </div>
                                {bgAmbience && (
                                    <div className="pl-4 border-l-2 border-slate-100 dark:border-slate-800 animate-in slide-in-from-left-2 fade-in">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Volume2 className="w-4 h-4 text-slate-400" />
                                            <span className="text-xs text-slate-500 dark:text-slate-400">Volume</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0" max="100"
                                            value={bgVolume}
                                            onChange={(e) => setBgVolume(e.target.value)}
                                            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-500"
                                        />
                                    </div>
                                )}

                                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-slate-900 dark:text-white">Processing Sounds</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">"Hmm", "Let me check" etc.</p>
                                    </div>
                                    <Switch checked={processSounds} onCheckedChange={setProcessSounds} />
                                </div>
                                {processSounds && (
                                    <div className="pl-4 border-l-2 border-slate-100 dark:border-slate-800 animate-in slide-in-from-left-2 fade-in">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Volume2 className="w-4 h-4 text-slate-400" />
                                            <span className="text-xs text-slate-500 dark:text-slate-400">Volume</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0" max="100"
                                            value={processVolume}
                                            onChange={(e) => setProcessVolume(e.target.value)}
                                            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-500"
                                        />
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* 4. Avoiding Confusion (Bottom Right) */}
                        {/* 4. Avoiding Confusion (Bottom Right) */}
                        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative flex flex-col h-full">
                            <div className="flex flex-col md:flex-row gap-4 mb-4 border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                                    <Ear className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Avoiding Confusion</h2>
                                        <Badge variant="secondary" className="text-[10px] ml-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">Beta</Badge>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Correct misheard words.</p>
                                </div>
                                <div className="md:ml-auto">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={addConfusion}
                                        disabled={!newConfusion.original || !newConfusion.replacement}
                                        className="gap-1 h-8 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700"
                                    >
                                        <Plus className="w-3 h-3" /> <span className="hidden md:inline">Add Rule</span><span className="md:hidden">Add</span>
                                    </Button>
                                </div>
                            </div>

                            {/* Input Area (Clean, Grid with Arrow) */}
                            <div className="space-y-3 mb-6 shrink-0">
                                <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
                                    <div>
                                        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Misheard Word</label>
                                        <Input
                                            placeholder="e.g. Jeff"
                                            value={newConfusion.original}
                                            onChange={(e) => setNewConfusion({ ...newConfusion, original: e.target.value })}
                                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                        />
                                    </div>
                                    <ArrowLeft className="w-4 h-4 text-slate-300 dark:text-slate-600 mb-3 rotate-180 shrink-0" />
                                    <div>
                                        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Correction</label>
                                        <Input
                                            placeholder="e.g. Jess"
                                            value={newConfusion.replacement}
                                            onChange={(e) => setNewConfusion({ ...newConfusion, replacement: e.target.value })}
                                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Rules as Tags/Badges */}
                            <div className="flex flex-wrap gap-2">
                                {confusions.map(item => (
                                    <div
                                        key={item.id}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg group hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer"
                                        onClick={() => setNewConfusion({ original: item.original, replacement: item.replacement })}
                                    >
                                        <span className="text-sm font-medium text-slate-400 line-through decoration-slate-400 decoration-1">{item.original}</span>
                                        <ArrowLeft className="w-3 h-3 text-slate-300 dark:text-slate-500 rotate-180" />
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{item.replacement}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setConfusions(confusions.filter(c => c.id !== item.id));
                                            }}
                                            className="ml-1 text-slate-400 hover:text-red-500 outline-none"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                {confusions.length === 0 && (
                                    <div className="text-slate-400 text-xs italic">No saved rules.</div>
                                )}
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
