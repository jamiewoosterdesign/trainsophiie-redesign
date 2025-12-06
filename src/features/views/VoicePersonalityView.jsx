import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Bot, Volume2, Shield, Info, Check, Lock, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';

// Helper icons avoiding import errors if they don't exist in lucide-react
const BriefcaseIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
);
const HeartIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
);

// Mock data for voices with tags
const VOICES = {
    australian: [
        { id: 'au-1', name: 'Sophiie', gender: 'Female', preview: '/audio/sophiie.mp3', tags: ['Friendly', 'Casual', 'Female'] },
        { id: 'au-2', name: 'Steve', gender: 'Male', preview: '/audio/steve.mp3', tags: ['Professional', 'Male', 'Middle-Aged'] },
        { id: 'au-3', name: 'Lucy', gender: 'Female', preview: '/audio/lucy.mp3', tags: ['Conversational', 'Female', 'Casual'] },
        { id: 'au-4', name: 'Charlie', gender: 'Male', preview: '/audio/charlie.mp3', tags: ['Friendly', 'Male', 'Casual'] },
    ],
    british: [
        { id: 'uk-1', name: 'Emma', gender: 'Female', preview: '/audio/emma.mp3', tags: ['Professional', 'British', 'Female'] },
        { id: 'uk-2', name: 'Arthur', gender: 'Male', preview: '/audio/arthur.mp3', tags: ['Formal', 'British', 'Male'] },
    ],
    newzealand: [
        { id: 'nz-1', name: 'Aroha', gender: 'Female', preview: '/audio/aroha.mp3', tags: ['Friendly', 'Casual', 'Female'] },
        { id: 'nz-2', name: 'Nikau', gender: 'Male', preview: '/audio/nikau.mp3', tags: ['Calm', 'Male'] },
    ]
};

const PERSONALITIES = [
    {
        id: 'friendly',
        name: 'Friendly Mate',
        description: 'Warm, casual, and approachable. Uses local slang where appropriate.',
        icon: <Bot className="w-6 h-6 text-blue-500" />
    },
    {
        id: 'professional',
        name: 'Professional Assistant',
        description: 'Polite, efficient, and formal. Best for business-focused interactions.',
        icon: <BriefcaseIcon className="w-6 h-6 text-blue-500" />
    },
    {
        id: 'empathetic',
        name: 'Empathetic Listener',
        description: 'Patient, understanding, and calm. Ideal for support and sensitive inquiries.',
        icon: <HeartIcon className="w-6 h-6 text-blue-500" />
    }
];

const FILTERS = ['All styles', 'Casual', 'Professional', 'Conversational', 'Female', 'Male', 'Middle-Aged'];

export default function VoicePersonalityView() {
    const { startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();
    const [selectedVoice, setSelectedVoice] = useState('au-1');
    const [selectedFilter, setSelectedFilter] = useState('All styles');
    const [selectedPersonality, setSelectedPersonality] = useState('friendly');
    const [profanityFilter, setProfanityFilter] = useState(true);
    const [playingVoice, setPlayingVoice] = useState(null);

    const togglePlay = (id) => {
        if (playingVoice === id) {
            setPlayingVoice(null);
        } else {
            setPlayingVoice(id);
            // Simulate audio play
            setTimeout(() => setPlayingVoice(null), 3000);
        }
    };

    const filterVoices = (voiceList) => {
        if (selectedFilter === 'All styles') return voiceList;
        return voiceList.filter(voice => voice.tags.includes(selectedFilter));
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 px-4 py-4 md:px-8 md:py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
                <div className="flex items-start gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/overview')} className="text-slate-500 hover:text-slate-900 mt-1 shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Voice & Personality</h1>
                        <p className="text-slate-500 text-sm mt-1">Configure how Sophiie sounds and behaves.</p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 relative">
                <div className="max-w-7xl mx-auto w-full space-y-8">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    {/* Voice Selection Section */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Volume2 className="w-5 h-5 text-blue-500" />
                                    Voice Selection
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">Choose the voice that best fits your brand.</p>
                            </div>
                            <Button variant="outline" className="gap-2">
                                <Settings className="w-4 h-4" />
                                Voice Settings
                            </Button>
                        </div>

                        {/* Filter Voices by Style */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Settings className="w-4 h-4 text-slate-400" />
                                <h3 className="text-sm font-bold text-slate-900">Filter Voices by Style</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {FILTERS.map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setSelectedFilter(filter)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedFilter === filter
                                            ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-500/20 shadow-sm'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
                                            }`}
                                    >
                                        {filter === 'All styles' && <span className="mr-1">🌐</span>}
                                        {filter === 'Casual' && <span className="mr-1">😎</span>}
                                        {filter === 'Conversational' && <span className="mr-1">💬</span>}
                                        {filter === 'Female' && <span className="mr-1">👩</span>}
                                        {filter === 'Male' && <span className="mr-1">👨</span>}
                                        {filter === 'Middle-Aged' && <span className="mr-1">👱</span>}
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Tabs defaultValue="australian" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-6">
                                <TabsTrigger value="australian">Australian 🇦🇺</TabsTrigger>
                                <TabsTrigger value="british">British 🇬🇧</TabsTrigger>
                                <TabsTrigger value="newzealand">New Zealand 🇳🇿</TabsTrigger>
                            </TabsList>

                            {Object.entries(VOICES).map(([region, voices]) => (
                                <TabsContent key={region} value={region} className="mt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {filterVoices(voices).length > 0 ? (
                                            filterVoices(voices).map((voice) => (
                                                <div
                                                    key={voice.id}
                                                    onClick={() => setSelectedVoice(voice.id)}
                                                    className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all hover:border-blue-300 ${selectedVoice === voice.id ? 'border-blue-500 bg-blue-50/30' : 'border-slate-100 bg-white'}`}
                                                >
                                                    {selectedVoice === voice.id && (
                                                        <div className="absolute top-3 right-3 text-blue-500">
                                                            <Check className="w-5 h-5" />
                                                        </div>
                                                    )}

                                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                                        <span className="text-xl filter grayscale text-slate-400">
                                                            {region === 'australian' ? '🇦🇺' : region === 'british' ? '🇬🇧' : '🇳🇿'}
                                                        </span>
                                                    </div>

                                                    <h3 className="font-bold text-slate-900">{voice.name}</h3>
                                                    <p className="text-xs text-slate-500 mb-2">{voice.gender}</p>
                                                    <div className="flex flex-wrap gap-1 mb-4">
                                                        {voice.tags.slice(0, 2).map((tag, i) => (
                                                            <span key={i} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        className="w-full gap-2 text-xs"
                                                        onClick={(e) => { e.stopPropagation(); togglePlay(voice.id); }}
                                                    >
                                                        {playingVoice === voice.id ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                                                        {playingVoice === voice.id ? 'Playing...' : 'Preview Voice'}
                                                    </Button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-4 py-8 text-center text-slate-400 italic">
                                                No voices match the selected filter within this region.
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </section>

                    {/* Personality Section (Restored) */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Bot className="w-5 h-5 text-blue-500" />
                                Agent Personality
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">Select the tone and style of conversation.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {PERSONALITIES.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => setSelectedPersonality(p.id)}
                                    className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all hover:shadow-md ${selectedPersonality === p.id ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500' : 'border-slate-100 bg-white'}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 rounded-lg bg-white shadow-sm border border-slate-100">
                                            {p.icon}
                                        </div>
                                        {selectedPersonality === p.id && (
                                            <Badge className="bg-blue-500 hover:bg-blue-600">Active</Badge>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-2">{p.name}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{p.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Agent Name Upsell Section (Moved to Bottom, Redesigned) */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <h2 className="text-lg font-bold text-slate-900">Agent Name</h2>
                            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 gap-1">
                                <Lock className="w-3 h-3" /> Add-on
                            </Badge>
                        </div>
                        <p className="text-slate-500 text-sm mb-6 max-w-2xl">
                            Choose a short, professional name your customers will see when the AI introduces itself. This is a premium feature available on higher tiers.
                        </p>

                        <div className="max-w-md bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <label className="text-xs font-bold text-slate-900 mb-1.5 block flex items-center gap-1">
                                Current Agent Name <Info className="w-3 h-3 text-slate-400" />
                            </label>
                            <div className="flex gap-3">
                                <Input value="Sophiie" disabled className="bg-white text-slate-500 border-slate-200" />
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white shrink-0">
                                    Upgrade to Customize
                                </Button>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">
                                Your agent's name is automatically determined by the selected voice.
                            </p>
                        </div>
                    </section>

                    {/* Profanity Filter Section */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-slate-100 text-slate-600">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-900">Profanity Filter</h2>
                                <p className="text-sm text-slate-500">Automatically filter offensive language in transcripts and responses.</p>
                            </div>
                        </div>
                        <Switch
                            checked={profanityFilter}
                            onCheckedChange={setProfanityFilter}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}
