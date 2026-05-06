import React, { useState } from "react";
import { BiCopy, BiTrash } from "react-icons/bi";

const CodeMinifier = () => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [type, setType] = useState("js");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(false);

    // ---------- Minify Handler ----------
    const handleMinify = async () => {
        if (!input.trim()) return;

        setLoading(true);
        setOutput("");

        try {
            if (type === "js") {
                // Lazy load Terser
                const { minify } = await import("terser");

                const result = await minify(input, {
                    compress: true,
                    mangle: true,
                });

                setOutput(result.code || "");
            } else {
                // Regex-based CSS Minifier for browser compatibility
                const minifyCSS = (css) => {
                    return css
                        .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
                        .replace(/\s+/g, " ") // Collapse whitespace
                        .replace(/\s*([\{\}\:\;\,>])\s*/g, "$1") // Remove spaces around delimiters
                        .replace(/;\s*}/g, "}") // Remove trailing semicolons
                        .trim();
                };

                const minifiedStyles = minifyCSS(input);
                setOutput(minifiedStyles || "");
            }
        } catch (err) {
            console.error(err);
            setOutput(`❌ Error while minifying code: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // ---------- Actions ----------
    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        setToast(true);
        setTimeout(() => setToast(false), 2000);
    };

    const clearAll = () => {
        setInput("");
        setOutput("");
    };

    const inputSize = (input.length / 1024).toFixed(2);
    const outputSize = (output.length / 1024).toFixed(2);

    return (
        <div className="tool-page">
            <div className="max-w-4xl mx-auto">
                <div className="tool-card">

                    {/* Header */}
                    <div className="tool-header text-center">
                        <h1 className="text-3xl font-black">
                            Code Minifier
                        </h1>
                        <p className="text-[var(--text-muted)]">
                            Minify JavaScript & CSS with advanced optimisation
                        </p>
                    </div>

                    {/* Body */}
                    <div className="tool-body space-y-5">

                        {/* Type Switch */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setType("js")}
                                className={`preset-btn ${type === "js" ? "active" : ""}`}
                            >
                                JS Minifier
                            </button>

                            <button
                                onClick={() => setType("css")}
                                className={`preset-btn ${type === "css" ? "active" : ""}`}
                            >
                                CSS Minifier
                            </button>
                        </div>

                        {/* Input */}
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            rows={8}
                            placeholder={`Paste your ${type.toUpperCase()} code here...`}
                            className="form-input font-mono"
                        />

                        {/* Button */}
                        <button
                            onClick={handleMinify}
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? "Minifying..." : "Minify Code"}
                        </button>

                        {/* Output */}
                        {output && (
                            <textarea
                                value={output}
                                readOnly
                                rows={8}
                                className="form-input font-mono"
                            />
                        )}

                        {/* Stats */}
                        {output && (
                            <div className="flex gap-3">
                                <div className="result-card flex-1 text-center py-3">
                                    <p>Original Size</p>
                                    <p className="font-bold">{inputSize} KB</p>
                                </div>

                                <div className="result-card flex-1 text-center py-3">
                                    <p>Minified Size</p>
                                    <p className="font-bold text-[var(--success)]">
                                        {outputSize} KB
                                    </p>
                                </div>

                                <div className="result-card flex-1 text-center py-3">
                                    <p>Saved</p>
                                    <p className="font-bold text-[var(--primary)]">
                                        {((1 - output.length / input.length) * 100 || 0).toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={copyOutput} className="btn-primary">
                                <BiCopy /> Copy
                            </button>

                            <button onClick={clearAll} className="btn-secondary">
                                <BiTrash /> Clear
                            </button>
                        </div>

                        {/* <p className="text-xs text-center text-[var(--text-muted)]">
                            ⚡ Libraries loaded only when needed (lazy loading)
                        </p> */}

                    </div>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className="toast animate-slide-up">
                    ✓ Copied to clipboard!
                </div>
            )}
        </div>
    );
};

export default CodeMinifier;