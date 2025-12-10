import React, { useState, useRef } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sliders, Mic2, Ear, Music, HelpCircle, Plus, Trash2, Volume2, Info } from 'lucide-react';
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
    const [creativity, setCreativity] = useState(70);
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
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950 relative">
                <div className="max-w-7xl mx-auto w-full space-y-8">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Column 1: Speed/Interruption & Audio */}
                        <div className="space-y-8">

                            {/* Interruption & Speed */}
                            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <Sliders className="w-5 h-5 text-blue-500" />
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Interruption & Speed</h2>
                                </div>
                                <div className="space-y-6">
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

                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Response Creativity</label>
                                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{creativity}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0" max="100"
                                            value={creativity}
                                            onChange={(e) => setCreativity(e.target.value)}
                                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">Min Pause Time (s)</label>
                                            <Input
                                                type="number" step="0.1"
                                                value={minPause}
                                                onChange={(e) => setMinPause(e.target.value)}
                                                className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">Caller Interrupt (s)</label>
                                            <Input
                                                type="number" step="0.1"
                                                value={interruptTime}
                                                onChange={(e) => setInterruptTime(e.target.value)}
                                                className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Background Audio */}
                            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <Music className="w-5 h-5 text-blue-500" />
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Background Audio</h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-slate-900 dark:text-white">Office Ambience</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Simulate a busy office background.</p>
                                        </div>
                                        <Switch checked={bgAmbience} onCheckedChange={setBgAmbience} />
                                    </div>
                                    {bgAmbience && (
                                        <div className="pl-4 border-l-2 border-slate-100 dark:border-slate-800">
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
                                            <p className="text-xs text-slate-500 dark:text-slate-400">"Hmm", "Let me check" thinking sounds.</p>
                                        </div>
                                        <Switch checked={processSounds} onCheckedChange={setProcessSounds} />
                                    </div>
                                    {processSounds && (
                                        <div className="pl-4 border-l-2 border-slate-100 dark:border-slate-800">
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
                        </div>

                        {/* Column 2: Pronunciations & Confusion */}
                        <div className="space-y-8">

                            {/* Pronunciations */}
                            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm min-h-[300px] flex flex-col">
                                <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <div className="flex items-center gap-2">
                                        <Mic2 className="w-5 h-5 text-blue-600" />
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pronunciations</h2>
                                    </div>
                                    <Button size="sm" variant="outline" className="gap-1 h-8 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700">
                                        <Plus className="w-3 h-3" /> Add Rule
                                    </Button>
                                </div>

                                <div className="flex-1 space-y-3">
                                    {pronunciations.map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 group hover:border-blue-200 dark:hover:border-blue-700 transition-colors">
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white">{item.text}</div>
                                                <div className="text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1 py-0.5 rounded inline-block mt-1">
                                                    /{item.phonetic}/
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {pronunciations.length === 0 && (
                                        <div className="text-center py-8 text-slate-400 text-sm">No rules added.</div>
                                    )}
                                </div>
                            </section>

                            {/* Avoiding Confusion */}
                            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm min-h-[300px] flex flex-col">
                                <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <div className="flex items-center gap-2">
                                        <Ear className="w-5 h-5 text-blue-500" />
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Avoiding Confusion</h2>
                                        <Badge variant="secondary" className="text-[10px] ml-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">Beta</Badge>
                                    </div>
                                    <Button size="sm" variant="outline" className="gap-1 h-8 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700">
                                        <Plus className="w-3 h-3" /> Add Rule
                                    </Button>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-lg p-3 mb-4 flex items-start gap-2">
                                    <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                    <p className="text-xs text-blue-700 dark:text-blue-300">Use this to correct words that Sophiie frequently mishears (e.g. "Jeff" vs "Jess").</p>
                                </div>

                                <div className="flex-1 space-y-3">
                                    {confusions.map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 group hover:border-blue-200 dark:hover:border-blue-700 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium text-slate-400 line-through decoration-slate-400 decoration-2">{item.original}</span>
                                                <span className="text-slate-300 dark:text-slate-600">→</span>
                                                <span className="font-bold text-slate-900 dark:text-white">{item.replacement}</span>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </section>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
