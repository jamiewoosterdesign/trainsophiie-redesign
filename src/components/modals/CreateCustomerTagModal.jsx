import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
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
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h2 className="text-lg font-bold text-slate-900">Add New Customer Tag</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="tagName">Tag Name</Label>
                        <Input
                            id="tagName"
                            placeholder="Enter a tag name"
                            value={tagName}
                            onChange={(e) => setTagName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Enter a description of what the tag represents"
                            className="min-h-[80px]"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="space-y-3">
                        <Label>Color</Label>
                        <ColorPicker value={selectedColor} onChange={setSelectedColor} />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>
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
