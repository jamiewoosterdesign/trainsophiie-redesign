import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Bot, Volume2, Shield, Info, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';

// Helper icons avoiding import errors if they don't exist in lucide-react (Check exists, Briefcase/Heart usually do)
const BriefcaseIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
);
const HeartIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
);

// Mock data for voices
const VOICES = {
    australian: [
        { id: 'au-1', name: 'Sophiie', gender: 'Female', preview: '/audio/sophiie.mp3' },
        { id: 'au-2', name: 'Steve', gender: 'Male', preview: '/audio/steve.mp3' },
        { id: 'au-3', name: 'Lucy', gender: 'Female', preview: '/audio/lucy.mp3' },
        { id: 'au-4', name: 'Charlie', gender: 'Male', preview: '/audio/charlie.mp3' },
    ],
    british: [
        { id: 'uk-1', name: 'Emma', gender: 'Female', preview: '/audio/emma.mp3' },
        { id: 'uk-2', name: 'Arthur', gender: 'Male', preview: '/audio/arthur.mp3' },
    ],
    newzealand: [
        { id: 'nz-1', name: 'Aroha', gender: 'Female', preview: '/audio/aroha.mp3' },
        { id: 'nz-2', name: 'Nikau', gender: 'Male', preview: '/audio/nikau.mp3' },
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
        icon: <BriefcaseIcon className="w-6 h-6 text-purple-500" />
    },
    {
        id: 'empathetic',
        name: 'Empathetic Listener',
        description: 'Patient, understanding, and calm. Ideal for support and sensitive inquiries.',
        icon: <HeartIcon className="w-6 h-6 text-rose-500" />
    }
];



export default function VoicePersonalityView() {
    const { startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();
    const [selectedVoice, setSelectedVoice] = useState('au-1');
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
                                <Info className="w-4 h-4" />
                                Voice Settings
                            </Button>
                        </div>

                        <Tabs defaultValue="australian" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-6">
                                <TabsTrigger value="australian">Australian</TabsTrigger>
                                <TabsTrigger value="british">British</TabsTrigger>
                                <TabsTrigger value="newzealand">New Zealand</TabsTrigger>
                            </TabsList>

                            {Object.entries(VOICES).map(([region, voices]) => (
                                <TabsContent key={region} value={region} className="mt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {voices.map((voice) => (
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
                                                <p className="text-xs text-slate-500 mb-4">{voice.gender}</p>

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
                                        ))}
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </section>

                    {/* Personality Section */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Bot className="w-5 h-5 text-purple-500" />
                                Agent Personality
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">Select the tone and style of conversation.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {PERSONALITIES.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => setSelectedPersonality(p.id)}
                                    className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all hover:shadow-md ${selectedPersonality === p.id ? 'border-purple-500 bg-purple-50/30 ring-1 ring-purple-500' : 'border-slate-100 bg-white'}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 rounded-lg bg-white shadow-sm border border-slate-100">
                                            {p.icon}
                                        </div>
                                        {selectedPersonality === p.id && (
                                            <Badge className="bg-purple-500 hover:bg-purple-600">Active</Badge>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-2">{p.name}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{p.description}</p>
                                </div>
                            ))}
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
