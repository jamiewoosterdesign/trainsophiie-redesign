import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PRESET_COLORS = [
    { hex: '#dbeafe', class: 'bg-blue-100' },
    { hex: '#dcfce7', class: 'bg-green-100' },
    { hex: '#fee2e2', class: 'bg-red-100' },
    { hex: '#ffedd5', class: 'bg-orange-100' },
    { hex: '#fce7f3', class: 'bg-pink-100' },
    { hex: '#f3e8ff', class: 'bg-purple-100' },
    { hex: '#e2e8f0', class: 'bg-slate-200' },
    { hex: '#8b5cf6', class: 'bg-violet-500' }, // The plus button one in design, roughly
];

export default function ColorPicker({ value = '#ffffff', onChange }) {
    const [showCustomPicker, setShowCustomPicker] = useState(false);
    const [hex, setHex] = useState(value);
    const [rgb, setRgb] = useState({ r: 255, g: 255, b: 255 });

    useEffect(() => {
        setHex(value);
        // Simple hex to rgb
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
        if (result) {
            setRgb({
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            });
        }
    }, [value]);

    const handleHexChange = (newHex) => {
        setHex(newHex);
        if (/^#[0-9A-F]{6}$/i.test(newHex)) {
            onChange(newHex);
        }
    };

    return (
        <div className="space-y-4">
            {/* Presets */}
            <div className="flex flex-wrap gap-3">
                {PRESET_COLORS.map((color, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => { onChange(color.hex); setShowCustomPicker(false); }}
                        className={`w-10 h-10 rounded-full ${color.class} border border-slate-200 dark:border-slate-700 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center`}
                        style={color.class ? {} : { backgroundColor: color.hex }} // Fallback if no class
                    >
                        {/* Show check if roughly matches? Simplified for now */}
                        {value.toLowerCase() === color.hex.toLowerCase() && <Check className="w-5 h-5 text-slate-600/50" />}
                    </button>
                ))}
                {/* Gradient Wheel Button Representation - Toggles Custom Picker */}
                <div
                    onClick={() => setShowCustomPicker(!showCustomPicker)}
                    className={`w-10 h-10 rounded-full bg-[conic-gradient(from_90deg,red,yellow,lime,aqua,blue,magenta,red)] border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${showCustomPicker ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                >
                    <span className="text-white drop-shadow-md font-bold text-xs">{showCustomPicker ? '-' : '+'}</span>
                </div>
            </div>

            {/* Advanced Picker - Collapsible */}
            {showCustomPicker && (
                <div className="flex gap-6 items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 animate-in slide-in-from-top-2 fade-in duration-200">
                    {/* Color Wheel Mockup */}
                    <div className="w-32 h-32 rounded-full bg-[conic-gradient(from_90deg,red,yellow,lime,aqua,blue,magenta,red)] relative shadow-inner flex-shrink-0 border border-slate-200 dark:border-slate-600">
                        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,white,transparent)] opacity-50"></div>
                        {/* Selector indicator purely visual */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border border-slate-300 shadow-sm"></div>
                    </div>

                    {/* Inputs */}
                    <div className="flex-1 space-y-3">
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-500 dark:text-slate-400">Hex Colour</Label>
                            <Input
                                value={hex}
                                onChange={(e) => handleHexChange(e.target.value)}
                                className="font-mono bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-500 dark:text-slate-400">Red</Label>
                                <Input value={rgb.r} readOnly className="text-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-500 dark:text-slate-400">Green</Label>
                                <Input value={rgb.g} readOnly className="text-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-500 dark:text-slate-400">Blue</Label>
                                <Input value={rgb.b} readOnly className="text-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
