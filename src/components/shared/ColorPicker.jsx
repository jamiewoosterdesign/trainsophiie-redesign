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
                        onClick={() => onChange(color.hex)}
                        className={`w-10 h-10 rounded-full ${color.class} border border-slate-200 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center`}
                        style={color.class ? {} : { backgroundColor: color.hex }} // Fallback if no class
                    >
                        {/* Show check if roughly matches? Simplified for now */}
                        {value.toLowerCase() === color.hex.toLowerCase() && <Check className="w-5 h-5 text-slate-600/50" />}
                    </button>
                ))}
                {/* Gradient Wheel Button Representation - Static for visual matching */}
                <div className="w-10 h-10 rounded-full bg-[conic-gradient(from_90deg,red,yellow,lime,aqua,blue,magenta,red)] border border-slate-200 shadow-sm flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    {/* In a real app this would toggle the advanced picker usually, but here we show it inline below */}
                    <span className="text-white drop-shadow-md font-bold text-xs">+</span>
                </div>
            </div>

            {/* Advanced Picker Mockup */}
            <div className="flex gap-6 items-center">
                {/* Color Wheel Mockup */}
                <div className="w-32 h-32 rounded-full bg-[conic-gradient(from_90deg,red,yellow,lime,aqua,blue,magenta,red)] relative shadow-inner flex-shrink-0">
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,white,transparent)] opacity-50"></div>
                    {/* Selector indicator purely visual */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border border-slate-300 shadow-sm"></div>
                </div>

                {/* Inputs */}
                <div className="flex-1 space-y-3">
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Hex Code</Label>
                        <Input
                            value={hex}
                            onChange={(e) => handleHexChange(e.target.value)}
                            className="font-mono"
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-500">Red</Label>
                            <Input value={rgb.r} readOnly className="text-center" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-500">Green</Label>
                            <Input value={rgb.g} readOnly className="text-center" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-500">Blue</Label>
                            <Input value={rgb.b} readOnly className="text-center" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
