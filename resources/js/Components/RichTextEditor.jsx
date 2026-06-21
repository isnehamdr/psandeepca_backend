import React, { useEffect, useRef } from "react";

export default function RichTextEditor({ value = "", onChange, error, minHeight = "120px" }) {
    const editorRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || "";
        }
    }, [value]);

    const emitChange = () => {
        onChange?.(editorRef.current?.innerHTML || "");
    };

    const runCommand = (command, argument = null) => {
        editorRef.current?.focus();
        document.execCommand(command, false, argument);
        emitChange();
    };

    const addLink = () => {
        const url = window.prompt("Enter URL");
        if (url) {
            runCommand("createLink", url);
        }
    };

    const buttonClass =
        "inline-flex h-8 min-w-8 items-center justify-center rounded border border-gray-300 bg-white px-2 text-sm font-semibold text-gray-700 hover:bg-gray-50";

    return (
        <div className={`rounded-md border bg-white ${error ? "border-red-300" : "border-gray-300"}`}>
            <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2">
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand("bold")} className={buttonClass} title="Bold">
                    B
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand("italic")} className={buttonClass} title="Italic">
                    I
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand("underline")} className={buttonClass} title="Underline">
                    U
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand("insertUnorderedList")} className={buttonClass} title="Bulleted list">
                    List
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={addLink} className={buttonClass} title="Link">
                    Link
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand("removeFormat")} className={buttonClass} title="Clear formatting">
                    Clear
                </button>
            </div>
            <div
                ref={editorRef}
                contentEditable
                onInput={emitChange}
                className="w-full overflow-y-auto px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                style={{ minHeight }}
                suppressContentEditableWarning
            />
        </div>
    );
}
