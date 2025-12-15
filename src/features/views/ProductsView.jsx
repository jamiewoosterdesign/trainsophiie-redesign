import React, { useState, useRef } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { AddNewCard } from '@/components/shared/AddNewCard';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Plus, ShoppingBag, Sparkles, Zap, Hammer, ArrowLeft, Search, ChevronLeft, ChevronRight, ChevronDown, CheckCircle, X, MoreHorizontal, Copy, Power, Trash2, Edit2 } from 'lucide-react';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MOCK_ELECTRICIANS_PRODUCTS = [
    { id: 'prod-elec-1', name: 'Solar Panel', desc: 'Solar panels to harness the suns light and transfer it in clean electricity', price: '$2,999.99', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1700000000000 },
    { id: 'prod-elec-2', name: 'Smart Home Hub', desc: 'Central control unit for all smart home devices and automation.', price: '$199.99', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1700000000001 },
    { id: 'prod-elec-3', name: 'EV Charger (Wallbox)', desc: 'Level 2 electric vehicle charger for rapid home charging.', price: '$899.00', active: true, icon: <Zap className="w-5 h-5 text-amber-500" />, createdAt: 1700000000002 },
];

const MOCK_BUILDERS_PRODUCTS = [
    { id: 'prod-build-1', name: 'Timber Decking Pack', desc: 'Premium hardwood timber decking boards, treated for outdoor use.', price: '$45.00 / sqm', active: true, icon: <Hammer className="w-5 h-5 text-slate-500" />, createdAt: 1700000000000 },
    { id: 'prod-build-2', name: 'Insulation Batts', desc: 'Thermal and acoustic insulation batts for walls and ceilings.', price: '$85.00 / pack', active: true, icon: <Hammer className="w-5 h-5 text-slate-500" />, createdAt: 1700000000001 },
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

function ProductSection({ title, products, openWizard, icon: Icon, onCreate, onDuplicate, onToggle, onDelete, highlightedId, view, onViewChange }) {
    // const [view, setView] = useState('grid'); // Removed local state
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('date');
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
            if (sortBy === 'date') {
                return (b.createdAt || 0) - (a.createdAt || 0); // Newest first
            }
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
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            {/* Section Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {Icon && <Icon className="w-5 h-5 text-slate-500" />} {title}
                    </h2>
                    <ViewToggle view={view} onViewChange={onViewChange} />
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
                                <SelectItem value="date">Date Added</SelectItem>
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
                    <AddNewCard
                        title="Create New Product"
                        description="Add items you sell or install"
                        onClick={onCreate}
                    />

                    {/* Mobile Add Button - Squashed Card Style (Top) */}
                    {currentPage === 1 && (
                        <div className="md:hidden">
                            <AddNewCard
                                title="Create New Product"
                                onClick={onCreate}
                                variant="compact"
                            />
                        </div>
                    )}

                    {paginatedProducts.map(product => (
                        <Card key={product.id} className={`p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group dark:bg-slate-900 dark:border-slate-800 flex flex-col h-full justify-between ${(product.isDraft || product.active === false) ? 'opacity-70 grayscale-[0.5]' : ''} ${product.id === highlightedId ? (product.isDraft ? 'animate-in zoom-in-0 duration-500 border-orange-500 shadow-orange-500/20 shadow-md ring-1 ring-orange-500/50' : 'animate-in zoom-in-0 duration-500 border-blue-500 shadow-blue-500/20 shadow-md ring-1 ring-blue-500/50') : ''}`} onClick={onCreate}>
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">{product.icon}</div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenuItem onClick={() => onCreate()}>
                                                <Edit2 className="w-4 h-4 mr-2" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onDuplicate(product)}>
                                                <Copy className="w-4 h-4 mr-2" /> Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onToggle(product.id)}>
                                                <Power className={`w-4 h-4 mr-2 ${product.active ? "text-green-500" : "text-slate-400"}`} /> {product.active ? 'Disable' : 'Enable'}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => onDelete(product.id)}>
                                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{product.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{product.desc}</p>
                            </div>
                            <div className="flex items-center justify-between text-sm text-slate-900 dark:text-slate-200 font-semibold pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div>
                                    {product.isDraft && <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">Incomplete</Badge>}
                                    {!product.isDraft && (product.active ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>)}
                                </div>
                                <span>{product.price}</span>
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
                        <div className="col-span-3">Product</div>
                        <div className="col-span-4">Description</div>
                        <div className="col-span-2">Price</div>
                        <div className="col-span-1 text-right">Status</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {currentPage === 1 && (
                            <div onClick={onCreate} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                                <div className="col-span-1 flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500">
                                    <Plus className="w-4 h-4" />
                                </div>
                                <div className="col-span-11 text-slate-500 font-medium group-hover:text-blue-600">Create New Product</div>
                            </div>
                        )}
                        {paginatedProducts.map(product => (
                            <div key={product.id} className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${(product.isDraft || product.active === false) ? 'opacity-70' : ''} ${product.id === highlightedId ? (product.isDraft ? 'bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-500 pl-5' : 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 pl-5') : ''}`} onClick={() => openWizard('product')}>
                                <div className="col-span-1 text-slate-600 dark:text-slate-400">{product.icon}</div>
                                <div className="col-span-3 font-medium text-slate-900 dark:text-white">{product.name}</div>
                                <div className="col-span-4 text-sm text-slate-500 dark:text-slate-400 truncate">{product.desc}</div>
                                <div className="col-span-2 text-sm text-slate-900 dark:text-slate-200 font-semibold">{product.price}</div>
                                <div className="col-span-1 text-right">
                                    {product.isDraft && <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800 text-[10px] h-5 w-fit">Incomplete</Badge>}
                                    {!product.isDraft && (product.active ? <Badge variant="success" className="w-fit">Active</Badge> : <Badge variant="secondary" className="w-fit">Inactive</Badge>)}
                                </div>
                                <div className="col-span-1 text-right flex justify-end" onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenuItem onClick={() => onCreate()}>
                                                <Edit2 className="w-4 h-4 mr-2" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onDuplicate(product)}>
                                                <Copy className="w-4 h-4 mr-2" /> Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onToggle(product.id)}>
                                                <Power className={`w-4 h-4 mr-2 ${product.active ? "text-green-500" : "text-slate-400"}`} /> {product.active ? 'Disable' : 'Enable'}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => onDelete(product.id)}>
                                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
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
                            <AddNewCard
                                title="Create New Product"
                                onClick={onCreate}
                                variant="compact"
                            />
                        )}
                        {paginatedProducts.map(product => (
                            <Card key={product.id} className={`p-4 hover:shadow-md transition-all cursor-pointer dark:bg-slate-900 dark:border-slate-800 ${(product.isDraft || product.active === false) ? 'opacity-70 grayscale-[0.5]' : ''} ${product.id === highlightedId ? (product.isDraft ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10' : 'border-blue-500 bg-blue-50 dark:bg-blue-900/10') : ''}`} onClick={() => openWizard('product')}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">{product.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white">{product.name}</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {product.isDraft && <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800 text-[10px] h-5 w-fit">Incomplete</Badge>}
                                        {!product.isDraft && (product.active ? <Badge variant="success" className="w-fit">Active</Badge> : <Badge variant="secondary" className="w-fit">Inactive</Badge>)}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenuItem onClick={() => onCreate()}>
                                                    <Edit2 className="w-4 h-4 mr-2" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onDuplicate(product)}>
                                                    <Copy className="w-4 h-4 mr-2" /> Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onToggle(product.id)}>
                                                    <Power className={`w-4 h-4 mr-2 ${product.active ? "text-green-500" : "text-slate-400"}`} /> {product.active ? 'Disable' : 'Enable'}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => onDelete(product.id)}>
                                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
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
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4 sm:gap-0">
                    <div className="text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
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

    // State for products
    const [elecProducts, setElecProducts] = useState(MOCK_ELECTRICIANS_PRODUCTS);
    const [buildProducts, setBuildProducts] = useState(MOCK_BUILDERS_PRODUCTS);
    const [showSuccess, setShowSuccess] = useState({ show: false, type: 'created' });
    const [highlightedProductId, setHighlightedProductId] = useState(null);
    const [viewMode, setViewMode] = useState('grid');

    const handleCreateProduct = (data, category) => {
        // Create new product object from wizard data
        const newProductId = `new-${Date.now()}`;
        const newProduct = {
            id: newProductId,
            name: data.productName || 'New Product',
            desc: data.description || 'No description',
            price: data.priceMode === 'range'
                ? `$${data.minPrice} - $${data.maxPrice}`
                : `$${data.productPrice || '0.00'}${data.pricingUnit ? ` / ${data.pricingUnit}` : ''}`,
            active: data.status !== 'draft',
            isDraft: data.status === 'draft',
            icon: category === 'Electricians' ? <Zap className="w-5 h-5 text-amber-500" /> : <Hammer className="w-5 h-5 text-slate-500" />,
            createdAt: Date.now(),
        };

        if (category === 'Electricians') {
            setElecProducts(prev => [newProduct, ...prev]);
        } else {
            setBuildProducts(prev => [newProduct, ...prev]);
        }

        // Show success modal
        setShowSuccess({ show: true, type: data.status === 'draft' ? 'saved' : 'created' });
        setHighlightedProductId(newProductId);

        // Auto-dismiss modal after 3 seconds
        setTimeout(() => setShowSuccess({ show: false, type: 'created' }), 3000);

        // Remove highlight after 6 seconds (3s modal + 3s fade out)
        setTimeout(() => setHighlightedProductId(null), 6000);
    };

    const handleDuplicateProduct = (product, category) => {
        const newProduct = {
            ...product,
            id: `dup-${Date.now()}`,
            name: `${product.name} 2`,
            active: false,
            isDraft: false,
            createdAt: Date.now()
        };
        if (category === 'Electricians') {
            setElecProducts(prev => [newProduct, ...prev]);
        } else {
            setBuildProducts(prev => [newProduct, ...prev]);
        }
        setShowSuccess({ show: true, type: 'created', message: 'Product Duplicated' });
        setTimeout(() => setShowSuccess({ show: false, type: 'created' }), 3000);
    };

    const handleToggleProductStatus = (id, category) => {
        const updater = prev => prev.map(p => p.id === id ? { ...p, active: p.active === false ? true : false } : p);
        if (category === 'Electricians') setElecProducts(updater);
        else setBuildProducts(updater);
    };

    const handleDeleteProduct = (id, category) => {
        const updater = prev => prev.filter(p => p.id !== id);
        if (category === 'Electricians') setElecProducts(updater);
        else setBuildProducts(updater);
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300 relative">
            {/* Success Modal Overlay */}
            {showSuccess.show && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-3 w-80 border border-slate-100 dark:border-slate-800 relative">
                        <button
                            onClick={() => setShowSuccess({ show: false, type: 'created' })}
                            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center animate-in zoom-in duration-300 ${showSuccess.type === 'saved' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div className="text-center space-y-0.5">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{showSuccess.type === 'saved' ? 'Product Saved' : 'Product Created!'}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{showSuccess.type === 'saved' ? 'You can finish it later.' : 'Added to your list.'}</p>
                        </div>
                        {/* Progress bar to show auto-dismiss */}
                        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                            <div className={`h-full rounded-full animate-progress ${showSuccess.type === 'saved' ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: '100%', animation: 'shrink 3s linear forwards' }}></div>
                        </div>
                    </div>
                </div>
            )}
            {/* Add keyframes for progress bar locally */}
            <style>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>

            <PageHeader
                title="Products"
                subtitle="Physical/digital products if applicable"
                scrollDirection={scrollDirection}
            >
                <CategorySelector usedCategories={["Electricians", "Builders"]} />
                <AddProductDropdown onAdd={(cat) => openWizard('product', { category: cat }, (data) => handleCreateProduct(data, cat))} />
            </PageHeader>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto w-full space-y-12">
                    <VoiceSetupBanner onStartVoiceFlow={startGlobalVoiceFlow} />

                    <ProductSection
                        title="Electricians"
                        icon={Zap}
                        products={elecProducts}
                        openWizard={openWizard}
                        highlightedId={highlightedProductId}
                        onCreate={() => openWizard('product', { category: 'Electricians' }, (data) => handleCreateProduct(data, 'Electricians'))}
                        onDuplicate={(p) => handleDuplicateProduct(p, 'Electricians')}
                        onToggle={(id) => handleToggleProductStatus(id, 'Electricians')}
                        onDelete={(id) => handleDeleteProduct(id, 'Electricians')}
                        view={viewMode}
                        onViewChange={setViewMode}
                    />

                    <ProductSection
                        title="Builders"
                        icon={Hammer}
                        products={buildProducts}
                        openWizard={openWizard}
                        highlightedId={highlightedProductId}
                        onCreate={() => openWizard('product', { category: 'Builders' }, (data) => handleCreateProduct(data, 'Builders'))}
                        onDuplicate={(p) => handleDuplicateProduct(p, 'Builders')}
                        onToggle={(id) => handleToggleProductStatus(id, 'Builders')}
                        onDelete={(id) => handleDeleteProduct(id, 'Builders')}
                        view={viewMode}
                        onViewChange={setViewMode}
                    />
                </div>
            </div>
        </div>
    );
}
