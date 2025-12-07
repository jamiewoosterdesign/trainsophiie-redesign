import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ViewToggle({ view, onViewChange }) {
    return (
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewChange('table')}
                className={`h-7 px-2 md:px-3 rounded-md transition-all ${view === 'table'
                    ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-transparent'
                    }`}
            >
                <List className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline text-xs font-medium">List</span>
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewChange('grid')}
                className={`h-7 px-2 md:px-3 rounded-md transition-all ${view === 'grid'
                    ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-transparent'
                    }`}
            >
                <LayoutGrid className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline text-xs font-medium">Card</span>
            </Button>
        </div>
    );
}

export default ViewToggle;
