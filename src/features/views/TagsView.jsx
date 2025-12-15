import React, { useState, useRef } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { AddNewCard } from '@/components/shared/AddNewCard';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { Tag, Plus, ArrowLeft, Search, Pencil, Trash2, Filter, Info, AlertCircle, Sparkles, Bot, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Power, Copy } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import CreateCustomerTagModal from '@/components/modals/CreateCustomerTagModal';
import CreateInquiriesTagModal from '@/components/modals/CreateInquiriesTagModal';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';
import ViewToggle from '@/components/shared/ViewToggle';
import { useDemo } from '@/context/DemoContext';

// ... (keep MOCK_CUSTOMER_TAGS etc.)

export default function TagsView() {
    const navigate = useNavigate();
    const { startGlobalVoiceFlow } = useOutletContext();
    const { isBlankState } = useDemo();
    const [view, setView] = useState('grid'); // 'table' | 'grid'
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);

    // State for tags
    const [customerTags, setCustomerTags] = useState(MOCK_CUSTOMER_TAGS);
    const [inquiryTags, setInquiryTags] = useState(MOCK_INQUIRY_TAGS);

    useEffect(() => {
        if (isBlankState) {
            setCustomerTags([]);
        } else {
            setCustomerTags(MOCK_CUSTOMER_TAGS);
        }
    }, [isBlankState]);

    // Modal Stats
    const [customerState, setCustomerState] = useState({ open: false, editData: null });
    const [inquiryState, setInquiryState] = useState({ open: false, editData: null });

    // Search states
    const [customerSearch, setCustomerSearch] = useState('');
    const [inquirySearch, setInquirySearch] = useState('');
    const [autoSearch, setAutoSearch] = useState('');

    const openCustomerModal = (data = null) => setCustomerState({ open: true, editData: data });
    const openInquiryModal = (data = null) => setInquiryState({ open: true, editData: data });

    const handleCustomerClose = (data) => {
        if (data && data.name) {
            setCustomerTags(prev => [data, ...prev]);
        }
        setCustomerState({ open: false, editData: null });
    };

    const handleInquiryClose = (data) => {
        if (data && data.name) {
            setInquiryTags(prev => [data, ...prev]);
        }
        setInquiryState({ open: false, editData: null });
    };

    // Cust Handlers
    const handleDuplicateCustomerTag = (tag) => {
        const newTag = { ...tag, id: Date.now(), name: `${tag.name} 2`, enabled: false, createdAt: Date.now() };
        setCustomerTags(prev => [newTag, ...prev]);
    };
    const handleToggleCustomerTag = (id) => {
        setCustomerTags(prev => prev.map(t => t.id === id ? { ...t, enabled: t.enabled === false ? true : false } : t));
    };
    const handleDeleteCustomerTag = (id) => {
        setCustomerTags(prev => prev.filter(t => t.id !== id));
    };

    // Inquiry Handlers
    const handleDuplicateInquiryTag = (tag) => {
        const newTag = { ...tag, id: Date.now(), name: `${tag.name} 2`, enabled: false, createdAt: Date.now() };
        setInquiryTags(prev => [newTag, ...prev]);
    };
    const handleToggleInquiryTag = (id) => {
        setInquiryTags(prev => prev.map(t => t.id === id ? { ...t, enabled: t.enabled === false ? true : false } : t));
    };
    const handleDeleteInquiryTag = (id) => {
        setInquiryTags(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            {/* Header */}
            {/* Header */}
            <PageHeader
                title="Tags Management"
                subtitle="Manage your customer and inquiry tags."
                scrollDirection={scrollDirection}
            >
                <Button onClick={() => openCustomerModal(null)} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" /> Add Customer Tag
                </Button>
                <Button variant="outline" onClick={() => openInquiryModal(null)} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" /> Add Inquiry Tag
                </Button>
            </PageHeader>

            {/* Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto w-full space-y-8">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    <TagSection
                        title="Customer Tags"
                        tags={customerTags}
                        addLabel="Add new customer tag"
                        addSubtitle="Create tags for call categorization"
                        onAdd={openCustomerModal}
                        onEdit={openCustomerModal}
                        searchQuery={customerSearch}
                        onSearchChange={setCustomerSearch}
                        icon={Tag}
                        view={view}
                        onViewChange={setView}
                        onDuplicate={handleDuplicateCustomerTag}
                        onToggle={handleToggleCustomerTag}
                        onDelete={handleDeleteCustomerTag}
                    />

                    <TagSection
                        title="Inquiry Tags"
                        tags={inquiryTags}
                        addLabel="Add new inquiry tag"
                        addSubtitle="Create tags for call categorization"
                        onAdd={openInquiryModal}
                        onEdit={openInquiryModal}
                        searchQuery={inquirySearch}
                        onSearchChange={setInquirySearch}
                        icon={Tag}
                        view={view}
                        onViewChange={setView}
                        onDuplicate={handleDuplicateInquiryTag}
                        onToggle={handleToggleInquiryTag}
                        onDelete={handleDeleteInquiryTag}
                    />

                    <TagSection
                        title="Auto-generated Tags"
                        tags={MOCK_AUTO_TAGS}
                        searchQuery={autoSearch}
                        onSearchChange={setAutoSearch}
                        icon={Tag}
                        view={view}
                    />
                </div>
            </div>

            {/* Modals */}
            {customerState.open && (
                <CreateCustomerTagModal
                    onClose={handleCustomerClose}
                    editData={customerState.editData}
                />
            )}
            {inquiryState.open && (
                <CreateInquiriesTagModal
                    onClose={handleInquiryClose}
                    editData={inquiryState.editData}
                />
            )}
        </div>
    );
}
