import React, { useState, useRef } from 'react';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Plus, ShoppingBag, Sparkles, Zap, Hammer, ArrowLeft, Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import VoiceSetupBanner from '@/components/shared/VoiceSetupBanner';
import { ViewToggle } from '@/components/shared/ViewToggle';
import { CategorySelector } from '@/components/shared/CategorySelector';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const MOCK_ELECTRICIANS_PRODUCTS = [
    { id: 'prod-elec-1', name: 'Solar Panel', desc: 'Solar panels to harness the suns light and transfer it in clean electricity', price: '$2,999.99', active: true, icon: <Zap className="w-5 h-5 text-amber-500" /> },
    { id: 'prod-elec-2', name: 'Smart Home Hub', desc: 'Central control unit for all smart home devices and automation.', price: '$199.99', active: true, icon: <Zap className="w-5 h-5 text-amber-500" /> },
    { id: 'prod-elec-3', name: 'EV Charger (Wallbox)', desc: 'Level 2 electric vehicle charger for rapid home charging.', price: '$899.00', active: true, icon: <Zap className="w-5 h-5 text-amber-500" /> },
];

const MOCK_BUILDERS_PRODUCTS = [
    { id: 'prod-build-1', name: 'Timber Decking Pack', desc: 'Premium hardwood timber decking boards, treated for outdoor use.', price: '$45.00 / sqm', active: true, icon: <Hammer className="w-5 h-5 text-slate-500" /> },
    { id: 'prod-build-2', name: 'Insulation Batts', desc: 'Thermal and acoustic insulation batts for walls and ceilings.', price: '$85.00 / pack', active: true, icon: <Hammer className="w-5 h-5 text-slate-500" /> },
];

function AddProductDropdown({ onAdd }) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = React.useRef(null);

    React.useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const categories = ["Electricians", "Builders"];

    return (
        <div className="relative w-full md:w-auto" ref={wrapperRef}>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full md:w-auto justify-between gap-2"
            >
                <span className="flex items-center"><Plus className="w-4 h-4 mr-2" /> Add Product</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-1 w-full md:w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 dark:bg-slate-900 dark:border-slate-800">
                    <div className="p-1">
                        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Category</div>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className="w-full text-left px-3 py-2.5 text-sm rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 text-slate-700 dark:text-slate-200"
                                onClick={() => {
                                    onAdd(cat);
                                    setIsOpen(false);
                                }}
                            >
                                {cat === "Electricians" ? <Zap className="w-4 h-4 text-amber-500" /> : <Hammer className="w-4 h-4 text-slate-500" />}
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function ProductSection({ title, products, openWizard, icon: Icon }) {
    const [view, setView] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 11;
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);

    // Filter & Sort
    const filteredProducts = products
        .filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.desc.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(product => {
            if (filterStatus === 'active') return product.active;
            if (filterStatus === 'inactive') return !product.active;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'active') {
                return (a.active === b.active) ? 0 : a.active ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
        });

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterStatus, sortBy, view]);

    return (
        <div className="space-y-4">
            {/* Section Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {Icon && <Icon className="w-5 h-5 text-slate-500" />} {title}
                    </h2>
                    <ViewToggle view={view} onViewChange={setView} />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder={`Search ${title.toLowerCase()}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-9 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[130px] h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[140px] h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name">Name (A-Z)</SelectItem>
                                <SelectItem value="active">Active First</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Grid View */}
            {view === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <button onClick={() => openWizard('product')}
                        className="hidden md:flex border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all min-h-[240px] group">
                        <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6 text-blue-500" />
                        </div>
                        <span className="font-medium">Create New Product</span>
                    </button>

                    {/* Mobile Add Button - Squashed Card Style (Top) */}
                    {currentPage === 1 && (
                        <div className="md:hidden">
                            <button onClick={() => openWizard('product')}
                                className="w-full flex items-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium gap-3 group">
                                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Plus className="w-5 h-5 text-blue-500" />
                                </div>
                                <span>Create New Product</span>
                            </button>
                        </div>
                    )}

                    {paginatedProducts.map(product => (
                        <Card key={product.id} className="p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group dark:bg-slate-900 dark:border-slate-800 flex flex-col h-full justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">{product.icon}</div>
                                    {product.active && <Badge variant="success">Active</Badge>}
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{product.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{product.desc}</p>
                            </div>
                            <div className="flex items-center justify-between text-sm text-slate-900 dark:text-slate-200 font-semibold pt-4 border-t border-slate-100 dark:border-slate-800">
                                <span>{product.price}</span>
                                <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-500 hover:text-blue-600">Configure</Button>
                            </div>
                        </Card>
                    ))}
                    {paginatedProducts.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                            No products created under this category
                        </div>
                    )}
                </div>
            )}

            {/* Table View */}
            {view === 'table' && (
                <div className="hidden md:block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <div className="col-span-1">Icon</div>
                        <div className="col-span-4">Product</div>
                        <div className="col-span-5">Description</div>
                        <div className="col-span-2">Price</div>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {currentPage === 1 && (
                            <div onClick={() => openWizard('product')} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                                <div className="col-span-1 flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500">
                                    <Plus className="w-4 h-4" />
                                </div>
                                <div className="col-span-11 text-slate-500 font-medium group-hover:text-blue-600">Create New Product</div>
                            </div>
                        )}
                        {paginatedProducts.map(product => (
                            <div key={product.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => openWizard('product')}>
                                <div className="col-span-1 text-slate-600 dark:text-slate-400">{product.icon}</div>
                                <div className="col-span-4 font-medium text-slate-900 dark:text-white">{product.name}</div>
                                <div className="col-span-5 text-sm text-slate-500 dark:text-slate-400 truncate">{product.desc}</div>
                                <div className="col-span-2 text-sm text-slate-900 dark:text-slate-200 font-semibold">{product.price}</div>
                            </div>
                        ))}
                        {paginatedProducts.length === 0 && (
                            <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm italic">
                                No products created under this category
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Mobile List View (Fallback for 'table' on mobile) */}
            <div className="md:hidden space-y-4">
                {view === 'table' && (
                    <>
                        {currentPage === 1 && (
                            <button onClick={() => openWizard('product')}
                                className="w-full flex items-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium gap-3 group">
                                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Plus className="w-5 h-5 text-blue-500" />
                                </div>
                                <span>Create New Product</span>
                            </button>
                        )}
                        {paginatedProducts.map(product => (
                            <Card key={product.id} className="p-4 hover:shadow-md transition-all cursor-pointer dark:bg-slate-900 dark:border-slate-800" onClick={() => openWizard('product')}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">{product.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white">{product.name}</h3>
                                    </div>
                                    {product.active && <Badge variant="success">Active</Badge>}
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{product.desc}</p>
                                <div className="flex items-center gap-4 text-sm font-semibold text-slate-900 dark:text-slate-200">
                                    {product.price}
                                </div>
                            </Card>
                        ))}
                    </>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}</span> of <span className="font-medium">{filteredProducts.length}</span> results
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="text-sm font-medium text-slate-900 dark:text-white px-2">
                            Page {currentPage} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ProductsView() {
    const { openWizard, startGlobalVoiceFlow } = useOutletContext();
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const scrollDirection = useScrollDirection(scrollRef);

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-4 md:px-8 md:py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 shrink-0 sticky top-0 z-30 transition-shadow duration-300">
                <div className={`flex gap-4 transition-all duration-300 ${scrollDirection === 'down' ? 'items-center' : 'items-start'}`}>
                    <Button variant="ghost" size="icon" onClick={() => navigate('/overview')} className={`text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 shrink-0 transition-all duration-300 ${scrollDirection === 'down' ? 'mt-0' : 'mt-1'}`}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className={`font-bold text-slate-900 dark:text-white transition-all duration-300 ${scrollDirection === 'down' ? 'text-lg' : 'text-xl md:text-2xl'}`}>Products</h1>
                        <p className={`text-slate-500 dark:text-slate-400 text-sm transition-all duration-300 ${scrollDirection === 'down' ? 'max-h-0 opacity-0 mt-0' : 'max-h-20 opacity-100 mt-1'}`}>Physical/digital products if applicable</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <CategorySelector usedCategories={["Electricians", "Builders"]} />
                    <AddProductDropdown onAdd={(cat) => openWizard('product')} />
                </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto w-full space-y-12">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    <ProductSection
                        title="Electricians"
                        icon={Zap}
                        products={MOCK_ELECTRICIANS_PRODUCTS}
                        openWizard={openWizard}
                    />

                    <ProductSection
                        title="Builders"
                        icon={Hammer}
                        products={MOCK_BUILDERS_PRODUCTS}
                        openWizard={openWizard}
                    />
                </div>
            </div>
        </div>
    );
}
