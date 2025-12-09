import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Mic, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ColorPicker from '@/components/shared/ColorPicker';

export default function CreateInquiriesTagModal({ onClose, editData = null }) {
    const [tagName, setTagName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState('#ef4444'); // Default red
    const [isPreset, setIsPreset] = useState(false);

    useEffect(() => {
        if (editData) {
            setTagName(editData.name || '');
            setDescription(editData.description || '');
            // Simple color matching or default
            setSelectedColor(editData.colorHex || '#ef4444');
            setIsPreset(editData.isPreset || false);
        }
    }, [editData]);

    const handleAction = () => {
        // Here you would typically save or update the tag
        // If it's a preset, we might be "creating a custom version"

        const newTag = {
            id: editData ? editData.id : `new-${Date.now()}`,
            name: tagName,
            description,
            colorHex: selectedColor,
            color: 'bg-custom', // Simplified
            enabled: true,
            createdAt: Date.now(),
            isPreset: isPreset // Maintain preset flag if modifying? Or if creating custom copy? Assuming simple create for now.
        };

        if (onClose) onClose(newTag);
    };

    const isEditing = !!editData;
    const title = isPreset ? 'Customize Preset Inquiry Tag' : (isEditing ? 'Edit Inquiry Tag' : 'Add New Inquiry Tag');
    const actionLabel = isPreset ? 'Create Custom Tag' : (isEditing ? 'Save Changes' : 'Create Tag');

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200 p-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                    <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5 overflow-y-auto">
                    {isPreset && (
                        <Alert className="bg-blue-50 border-blue-200">
                            <AlertDescription className="text-blue-700 text-sm">
                                <span className="font-semibold">Creating a custom version:</span> This will create a custom tag for your organization that overrides the preset tag. The preset will no longer appear in your tag list.
                            </AlertDescription>
                        </Alert>
                    )}

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
                        <div className="relative">
                            <Textarea
                                id="description"
                                placeholder="Enter a description of what the tag represents"
                                className="min-h-[80px] pb-10"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors text-slate-500 hover:text-blue-600" title="Voice Input">
                                    <Mic className="w-4 h-4" />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors text-slate-500 hover:text-blue-600" title="Generate with AI">
                                    <Wand2 className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Color</Label>
                        <ColorPicker value={selectedColor} onChange={setSelectedColor} />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                    <Button variant="outline" onClick={() => onClose(null)}>
                        Cancel
                    </Button>
                    <Button onClick={handleAction} disabled={!tagName.trim()}>
                        {actionLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
