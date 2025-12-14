import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Mic, Wand2, Play, AlertCircle, Volume2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function RichVariableEditor({
    value = "",
    onChange,
    variables = [],
    placeholder = "Type your message...",
    className,
    minHeight = "120px",
    disabled = false,
    previewAudio, // function
    onRecord, // function
    onAI // function
}) {
    const editorRef = useRef(null);
    const lastRange = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef(null);

    // -- Parsing & Serialization --

    // Convert "{Variable}" string format -> HTML with pills
    const parseValueToHtml = (text) => {
        if (!text) return '';
        let html = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\n/g, '<br>');

        variables.forEach(v => {
            // Escape special regex chars in v.code
            const escapedCode = v.code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedCode, 'g');
            html = html.replace(regex, createPillHtml(v));
        });
        return html;
    };

    const createPillHtml = (variable) => {
        // We add a specific class 'variable-pill' for identification
        // contentEditable="false" ensures the cursor jumps over it as a unit
        return `
            <span contenteditable="false" class="variable-pill inline-flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-md text-sm font-medium mx-1 select-none align-middle shadow-sm border border-blue-200 dark:border-blue-800 transition-all" data-code="${variable.code}">
                <span>${variable.label}</span>
                <span class="pill-remove hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 cursor-pointer transition-colors inline-flex items-center justify-center h-4 w-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </span>
            </span>
        `.trim();
    };

    // Serialize DOM -> string with "{Variable}"
    const serializeEditorContent = () => {
        if (!editorRef.current) return "";
        let text = "";

        const traverse = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.classList.contains('variable-pill')) {
                    text += node.getAttribute('data-code');
                } else if (node.tagName === 'BR') {
                    text += '\n';
                } else if (node.tagName === 'DIV') {
                    // Chrome adds <div><br></div> for new lines sometimes
                    text += '\n';
                    node.childNodes.forEach(traverse);
                } else {
                    node.childNodes.forEach(traverse);
                }
            }
        };

        editorRef.current.childNodes.forEach(traverse);
        return text;
    };

    // -- Lifecycle & Events --

    // Initial load & External updates
    useEffect(() => {
        if (editorRef.current) {
            const currentVal = serializeEditorContent();
            // Only update if the serialized content is different to avoid cursor jumps/resets
            // This allows checking if 'value' prop changed from outside (e.g. AI or parent reset)
            if (value !== currentVal) {
                const newHtml = parseValueToHtml(value);
                // Simple check to avoid replacing if it effectively looks the same 
                // (though parseValueToHtml might normalize differently)
                if (editorRef.current.innerHTML !== newHtml) {
                    editorRef.current.innerHTML = newHtml;
                }
            }
        }
    }, [value, variables]);

    const handleInput = () => {
        const newValue = serializeEditorContent();
        if (onChange) onChange(newValue);
        saveSelection();
    };

    // Handle click on the 'x' in pills
    const handleEditorClick = (e) => {
        saveSelection();
        const removeBtn = e.target.closest('.pill-remove');
        if (removeBtn) {
            const pill = removeBtn.closest('.variable-pill');
            if (pill) {
                pill.remove();
                handleInput();
            }
        }
    };

    const handleKeyDown = (e) => {
        saveSelection();
        // Support common shortcuts if needed (like ctrl+z) - browser specific but execCommand handles basics
    };

    // -- Cursor Management --

    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel.rangeCount > 0 && editorRef.current.contains(sel.anchorNode)) {
            lastRange.current = sel.getRangeAt(0);
        }
    };

    const restoreSelection = () => {
        const sel = window.getSelection();
        sel.removeAllRanges();
        if (lastRange.current) {
            sel.addRange(lastRange.current);
        } else {
            // Fallback: move to end
            editorRef.current.focus();
            if (typeof window.getSelection !== "undefined"
                && typeof document.createRange !== "undefined") {
                const range = document.createRange();
                range.selectNodeContents(editorRef.current);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    };

    const insertVariable = (variable) => {
        editorRef.current.focus();

        // Restore cursor position if valid
        if (lastRange.current && editorRef.current.contains(lastRange.current.commonAncestorContainer)) {
            restoreSelection();
        }

        // Insert pill
        const pillHtml = createPillHtml(variable) + '&nbsp;'; // Add space after
        document.execCommand('insertHTML', false, pillHtml);

        handleInput();
    };

    // -- Render Helpers --

    return (
        <div className={cn("flex flex-col gap-3", className)} ref={containerRef}>

            {/* Editor Area */}
            <div className={cn(
                "relative rounded-xl border bg-white dark:bg-slate-800 transition-all overflow-hidden",
                isFocused ? "border-blue-500 ring-2 ring-blue-500/10" : "border-slate-200 dark:border-slate-700",
                disabled && "opacity-60 pointer-events-none"
            )}>
                <div
                    ref={editorRef}
                    className="w-full p-4 outline-none text-base text-slate-800 dark:text-slate-100 whitespace-pre-wrap leading-relaxed min-h-[120px]"
                    style={{ minHeight }}
                    contentEditable={!disabled}
                    onInput={handleInput}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        setIsFocused(false);
                        saveSelection();
                    }}
                    onClick={handleEditorClick}
                    onKeyUp={handleKeyDown}
                    onMouseUp={saveSelection}
                    data-placeholder={placeholder}
                />

                {/* Empty Placeholder overlay logic handled via CSS usually, but simple text fallback: */}
                {!value && (
                    <div className="absolute top-4 left-4 text-slate-400 pointer-events-none select-none">
                        {placeholder}
                    </div>
                )}

                {/* Floating Actions (Mic, AI) */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <TooltipProvider>
                        {onRecord && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        onClick={onRecord}
                                        className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        <Mic className="w-4 h-4" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>Voice Input</TooltipContent>
                            </Tooltip>
                        )}
                        {onAI && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        onClick={onAI}
                                        className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        <Wand2 className="w-4 h-4" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>Generate with AI</TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                </div>
            </div>

            {/* Toolbar Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

                {/* Variable Suggestions */}
                {variables.length > 0 && (
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Add Variables:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {variables.map((v) => (
                                <button
                                    key={v.code}
                                    onClick={() => insertVariable(v)}
                                    className="group flex flex-col items-start px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:shadow-sm transition-all text-left max-w-[200px]"
                                >
                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-0.5 group-hover:underline">
                                        {v.label}
                                    </span>
                                    {v.description && (
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-full">
                                            {v.description}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Actions (Preview, etc) */}
                {previewAudio && (
                    <div className="flex-shrink-0">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={previewAudio}
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 gap-2"
                        >
                            <Play className="w-3.5 h-3.5" />
                            Preview Audio
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
