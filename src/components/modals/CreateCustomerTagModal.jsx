import React, { useState } from 'react';
import { X, Check, Mic, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import ColorPicker from '@/components/shared/ColorPicker';

export default function CreateCustomerTagModal({ onClose }) {
    const [tagName, setTagName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState('#ef4444'); // Default red

    const handleCreate = () => {
        // Here you would typically save the tag
        console.log({ tagName, description, color: selectedColor });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 border border-transparent dark:border-slate-800">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add New Customer Tag</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="tagName" className="text-slate-900 dark:text-slate-200">Tag Name</Label>
                        <Input
                            id="tagName"
                            placeholder="Enter a tag name"
                            value={tagName}
                            onChange={(e) => setTagName(e.target.value)}
                            className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-slate-900 dark:text-slate-200">Description</Label>
                        <div className="relative">
                            <Textarea
                                id="description"
                                placeholder="Enter a description of what the tag represents"
                                className="min-h-[80px] pb-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Voice Input">
                                    <Mic className="w-4 h-4" />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" title="Generate with AI">
                                    <Wand2 className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-slate-900 dark:text-slate-200">Colour</Label>
                        <ColorPicker value={selectedColor} onChange={setSelectedColor} />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} className="dark:bg-transparent dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} disabled={!tagName.trim()}>
                        Create Tag
                    </Button>
                </div>
            </div>
        </div>
    );
}
