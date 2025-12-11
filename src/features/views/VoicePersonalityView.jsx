import React, { useState, useRef } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Bot, Volume2, Shield, Info, Check, Lock, Settings, Filter, Globe, Smile, MessageCircle, User, Clock, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';

import sophiieAvatar from '@/avatars/sophiie-avatar.png';
import steveAvatar from '@/avatars/Steve-avatar.png';
import lucyAvatar from '@/avatars/lucy-avatar.png';
import charlieAvatar from '@/avatars/Charlie-avatar.png';
import emmaAvatar from '@/avatars/Emma-avatar.png';
import arthurAvatar from '@/avatars/arthur-avatar.png';
import arohaAvatar from '@/avatars/Aroha-avatar.png';
import nikauAvatar from '@/avatars/nikau-avatar.png';

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
        { id: 'au-1', name: 'Sophiie', gender: 'Female', preview: '/audio/sophiie.mp3', tags: ['Friendly', 'Casual', 'Female'], avatar: sophiieAvatar },
        { id: 'au-2', name: 'Steve', gender: 'Male', preview: '/audio/steve.mp3', tags: ['Professional', 'Male', 'Middle-Aged'], avatar: steveAvatar },
        { id: 'au-3', name: 'Lucy', gender: 'Female', preview: '/audio/lucy.mp3', tags: ['Conversational', 'Female', 'Casual'], avatar: lucyAvatar },
        { id: 'au-4', name: 'Charlie', gender: 'Male', preview: '/audio/charlie.mp3', tags: ['Friendly', 'Male', 'Casual'], avatar: charlieAvatar },
    ],
    british: [
        { id: 'uk-1', name: 'Emma', gender: 'Female', preview: '/audio/emma.mp3', tags: ['Professional', 'British', 'Female'], avatar: emmaAvatar },
        { id: 'uk-2', name: 'Arthur', gender: 'Male', preview: '/audio/arthur.mp3', tags: ['Formal', 'British', 'Male'], avatar: arthurAvatar },
    ],
    newzealand: [
        { id: 'nz-1', name: 'Aroha', gender: 'Female', preview: '/audio/aroha.mp3', tags: ['Friendly', 'Casual', 'Female'], avatar: arohaAvatar },
        { id: 'nz-2', name: 'Nikau', gender: 'Male', preview: '/audio/nikau.mp3', tags: ['Calm', 'Male'], avatar: nikauAvatar },
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
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);
    const [selectedVoice, setSelectedVoice] = useState('au-1');
    const [selectedFilter, setSelectedFilter] = useState('All styles');
    const [selectedPersonality, setSelectedPersonality] = useState('friendly');
    const [activeRegion, setActiveRegion] = useState('australian');
    const [profanityFilter, setProfanityFilter] = useState(true);
    const [playingVoice, setPlayingVoice] = useState(null);
    const [playingPersonality, setPlayingPersonality] = useState(null);

    const togglePlay = (id) => {
        if (playingVoice === id) {
            setPlayingVoice(null);
        } else {
            setPlayingVoice(id);
            // Simulate audio play
            setTimeout(() => setPlayingVoice(null), 3000);
        }
    };

    const togglePersonalityPlay = (id) => {
        if (playingPersonality === id) {
            setPlayingPersonality(null);
        } else {
            setPlayingPersonality(id);
            // Simulate audio play
            setTimeout(() => setPlayingPersonality(null), 3000);
        }
    };

    const filterVoices = (voiceList) => {
        if (selectedFilter === 'All styles') return voiceList;
        return voiceList.filter(voice => voice.tags.includes(selectedFilter));
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            {/* Header */}
            {/* Header */}
            <PageHeader
                title="Voice & Personality"
                subtitle="Configure how Sophiie sounds and behaves."
                scrollDirection={scrollDirection}
            />

            {/* Main Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950 relative">
                <div className="max-w-7xl mx-auto w-full space-y-8">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    {/* Voice Selection Section */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Volume2 className="w-5 h-5 text-blue-500" />
                                    Voice Selection
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Choose the voice that best fits your brand.</p>
                            </div>
                            <Button variant="outline" className="gap-2 w-full md:w-auto dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700">
                                <Settings className="w-4 h-4" />
                                Voice Settings
                            </Button>
                        </div>

                        {/* Filter Voices by Style */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Filter className="w-4 h-4 text-slate-400" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Filter Voices by Style</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {FILTERS.map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setSelectedFilter(filter)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${selectedFilter === filter
                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-1 ring-blue-500/20 shadow-sm'
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400'
                                            }`}
                                    >
                                        {filter === 'All styles' && <Globe className="w-3.5 h-3.5" />}
                                        {filter === 'Casual' && <Smile className="w-3.5 h-3.5" />}
                                        {filter === 'Professional' && <Briefcase className="w-3.5 h-3.5" />}
                                        {filter === 'Conversational' && <MessageCircle className="w-3.5 h-3.5" />}
                                        {filter === 'Female' && <User className="w-3.5 h-3.5" />}
                                        {filter === 'Male' && <User className="w-3.5 h-3.5" />}
                                        {filter === 'Middle-Aged' && <Clock className="w-3.5 h-3.5" />}
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Tabs value={activeRegion} onValueChange={setActiveRegion} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-6 h-auto p-1">
                                <TabsTrigger value="australian" className="py-2">
                                    <span className="md:hidden text-sm font-semibold">AU</span>
                                    <span className="hidden md:inline text-sm">Australian <span className="text-slate-400 ml-1 text-xs">AU</span></span>
                                </TabsTrigger>
                                <TabsTrigger value="british" className="py-2">
                                    <span className="md:hidden text-sm font-semibold">GB</span>
                                    <span className="hidden md:inline text-sm">British <span className="text-slate-400 ml-1 text-xs">GB</span></span>
                                </TabsTrigger>
                                <TabsTrigger value="newzealand" className="py-2">
                                    <span className="md:hidden text-sm font-semibold">NZ</span>
                                    <span className="hidden md:inline text-sm">New Zealand <span className="text-slate-400 ml-1 text-xs">NZ</span></span>
                                </TabsTrigger>
                            </TabsList>

                            {Object.entries(VOICES).map(([region, voices]) => (
                                <TabsContent key={region} value={region} className="mt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {filterVoices(voices).length > 0 ? (
                                            filterVoices(voices).map((voice) => (
                                                <div
                                                    key={voice.id}
                                                    onClick={() => setSelectedVoice(voice.id)}
                                                    className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all hover:border-blue-300 dark:hover:border-blue-700 ${selectedVoice === voice.id ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-900/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                                                >
                                                    {selectedVoice === voice.id && (
                                                        <div className="absolute top-3 right-3 text-blue-500">
                                                            <Check className="w-5 h-5" />
                                                        </div>
                                                    )}

                                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 overflow-hidden">
                                                        {voice.avatar ? (
                                                            <img src={voice.avatar} alt={voice.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-xl font-bold text-slate-400">
                                                                {region === 'australian' ? 'AU' : region === 'british' ? 'GB' : 'NZ'}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className="font-bold text-slate-900 dark:text-white">{voice.name}</h3>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{voice.gender}</p>
                                                    <div className="flex flex-wrap gap-1 mb-4">
                                                        {voice.tags.slice(0, 2).map((tag, i) => (
                                                            <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        className="w-full gap-2 text-xs dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
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
                    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Bot className="w-5 h-5 text-blue-500" />
                                Agent Personality
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Select the tone and style of conversation.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {PERSONALITIES.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => setSelectedPersonality(p.id)}
                                    className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all hover:shadow-md ${selectedPersonality === p.id ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 ring-1 ring-blue-500' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                                            {p.icon}
                                        </div>
                                        {selectedPersonality === p.id && (
                                            <Badge className="bg-blue-500 hover:bg-blue-600">Active</Badge>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{p.name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{p.description}</p>

                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="w-full gap-2 text-xs dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                        onClick={(e) => { e.stopPropagation(); togglePersonalityPlay(p.id); }}
                                    >
                                        {playingPersonality === p.id ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                                        {playingPersonality === p.id ? 'Playing...' : 'Preview Personality'}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Agent Name Upsell Section (Moved to Bottom, Redesigned) */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Agent Name</h2>
                            <Badge variant="outline" className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 gap-1">
                                <Lock className="w-3 h-3" /> Add-on
                            </Badge>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-2xl">
                            Choose a short, professional name your customers will see when the AI introduces itself. This is a premium feature available on higher tiers.
                        </p>

                        <div className="w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                            <label className="text-xs font-bold text-slate-900 dark:text-slate-300 mb-1.5 block flex items-center gap-1">
                                Current Agent Name <Info className="w-3 h-3 text-slate-400" />
                            </label>
                            <div className="flex flex-col md:flex-row gap-3">
                                <Input value="Sophiie" disabled className="bg-white dark:bg-slate-900 dark:border-slate-700 text-slate-500 dark:text-slate-400 border-slate-200" />
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white shrink-0 w-full md:w-auto">
                                    Upgrade to Customize
                                </Button>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">
                                Your agent's name is automatically determined by the selected voice.
                            </p>
                        </div>
                    </section>

                    {/* Profanity Filter Section */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">Profanity Filter</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Automatically filter offensive language in transcripts and responses.</p>
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
