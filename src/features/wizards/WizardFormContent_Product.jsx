// --- PRODUCT WIZARD ---
if (mode === 'product') {
    const handleKnowledgeSelect = (type) => {
        setIsLoading(true);
        // Simulate analysis delay
        setTimeout(() => {
            setIsLoading(false);
            onChange('isContextActive', true);
            onChange('contextFileName', 'Product_Catalog.pdf');
            // Auto-fill data
            onChange('productName', "Solar Panel System");
            onChange('description', "High-efficiency monocrystalline solar panels with 25-year warranty. Includes inverter and installation hardware.");
            onChange('productPrice', "2999.99");
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 relative">

            {/* Knowledge Found Banner */}
            {formData.isContextActive && (
                <div className="bg-emerald-50/95 dark:bg-emerald-900/20 backdrop-blur-sm flex items-center justify-between px-4 py-3 rounded-xl border border-emerald-100 dark:border-emerald-800 animate-in fade-in zoom-in-95 duration-300 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white dark:bg-emerald-800/50 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                            <FileCheck className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-emerald-900 dark:text-emerald-100">Active Context</div>
                            <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">{formData.contextFileName}</div>
                        </div>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange('isContextActive', false);
                            onChange('contextFileName', '');
                            onChange('productName', '');
                            onChange('description', '');
                            onChange('productPrice', '');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:text-emerald-900 dark:hover:text-emerald-200 transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                        Remove Context
                    </button>
                </div>
            )}

            {/* Knowledge Source Selection (Only show if not active) */}
            {!formData.isContextActive && (
                <div className="mb-6">
                    <Label className="mb-3 block">Auto-fill from Document (Optional)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                        <div
                            onClick={() => handleKnowledgeSelect('upload')}
                            className="group border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all"
                        >
                            <div className="w-8 h-8 mb-2 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                <UploadCloud className="w-5 h-5" />
                            </div>
                            <div className="font-semibold text-sm text-slate-900 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 text-center">Upload Specification</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">PDF, Details</div>
                        </div>
                        <div
                            onClick={() => handleKnowledgeSelect('kb')}
                            className="group border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all"
                        >
                            <div className="w-8 h-8 mb-2 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                <Book className="w-5 h-5" />
                            </div>
                            <div className="font-semibold text-sm text-slate-900 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 text-center">Select from KB</div>
                        </div>

                        {/* Loading Overlay */}
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl border border-slate-100 dark:border-slate-800">
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400 animate-pulse">Reading Document...</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div>
                        <Label className="mb-1.5 block">Product Name *</Label>
                        <Input
                            placeholder="e.g., Solar Panel"
                            value={formData.productName}
                            onChange={(e) => onChange('productName', e.target.value)}
                            highlight={(activeField === 'productName').toString()}
                        />
                    </div>

                    <div>
                        <Label className="mb-1.5 block">Price ($)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                            <Input
                                className="pl-7"
                                placeholder="0.00"
                                value={formData.productPrice}
                                onChange={(e) => onChange('productPrice', e.target.value)}
                                highlight={(activeField === 'productPrice').toString()}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <Label className="mb-1.5 block">Description *</Label>
                    <Textarea
                        placeholder="Describe the product features and specs..."
                        className="min-h-[120px] resize-y"
                        value={formData.description}
                        onChange={(e) => onChange('description', e.target.value)}
                        highlight={(activeField === 'description').toString()}
                    />
                </div>
            </div>
        </div>
    );
}
