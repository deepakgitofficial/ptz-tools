import React, { useState } from "react";
import { BiCopy, BiTrash } from "react-icons/bi";

const CodeUnminifier = () => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [type, setType] = useState("js");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(false);

    // ---------- FORMAT FUNCTION ----------
    const handleFormat = async () => {
        if (!input.trim()) return;

        setLoading(true);
        setOutput("");

        try {
            const prettier = await import("prettier/standalone");

            let loadedPlugins = [];
            let parser;

            if (type === "js") {
                loadedPlugins = [
                    await import("prettier/plugins/babel"),
                    await import("prettier/plugins/estree")
                ];
                parser = "babel";
            } else if (type === "css") {
                loadedPlugins = [await import("prettier/plugins/postcss")];
                parser = "css";
            }
            else if (type === "html") {
                loadedPlugins = [await import("prettier/plugins/html")];
                parser = "html";
            } else if (type === "json") {
                loadedPlugins = [
                    await import("prettier/plugins/babel"),
                    await import("prettier/plugins/estree")
                ];
                parser = "json";
            }

            const plugins = loadedPlugins.map(m => m.default || m);

            const formatted = await prettier.format(input, {
                parser,
                plugins,
                semi: true,
                singleQuote: true,
                tabWidth: 2,
                printWidth: 80,
            });

            setOutput(formatted);
        } catch (err) {
            console.error(err);
            setOutput(`❌ Error while formatting code: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // ---------- ACTIONS ----------
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
                            Code Unminifier
                        </h1>
                        <p className="text-[var(--text-muted)]">
                            Beautify & format code using Prettier
                        </p>
                    </div>

                    {/* Body */}
                    <div className="tool-body space-y-5">

                        {/* Type Switch */}
                        <div className="flex gap-2">
                            {["js", "css"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setType(t)}
                                    className={`preset-btn ${type === t ? "active" : ""}`}
                                >
                                    {t.toUpperCase()}
                                </button>
                            ))}
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
                            onClick={handleFormat}
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? "Formatting..." : "Unminify Code"}
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
                                    <p>Input Size</p>
                                    <p className="font-bold">{inputSize} KB</p>
                                </div>

                                <div className="result-card flex-1 text-center py-3">
                                    <p>Output Size</p>
                                    <p className="font-bold text-[var(--primary)]">
                                        {outputSize} KB
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



                    </div>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className="toast animate-slide-up">
                    ✓ Copied!
                </div>
            )}
        </div>
    );
};

export default CodeUnminifier;