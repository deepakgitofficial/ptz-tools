import React, { useState } from "react";
import { BiCopy, BiTrash, BiText, BiCheck } from "react-icons/bi";

const CaseConverter = () => {
    const [text, setText] = useState("");
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(false);

    // ---------- Case Functions ----------
    const toUpper = () => setText(text.toUpperCase());
    const toLower = () => setText(text.toLowerCase());

    const toSentenceCase = () => {
        const result = text
            .toLowerCase()
            .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        setText(result);
    };

    const toTitleCase = () => {
        const result = text.replace(/\w\S*/g, (t) =>
            t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()
        );
        setText(result);
    };

    const toCamelCase = () => {
        const result = text
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
        setText(result);
    };

    // ---------- Grammar Check ----------
    const checkGrammar = async () => {
        if (!text.trim()) return;

        setLoading(true);
        setIssues([]);

        try {
            const res = await fetch("https://api.languagetool.org/v2/check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    text: text,
                    language: "en-US",
                }),
            });

            const data = await res.json();
            setIssues(data.matches || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ---------- Replace Suggestion ----------
    const applySuggestion = (issue, replacement) => {
        const before = text.slice(0, issue.offset);
        const after = text.slice(issue.offset + issue.length);

        setText(before + replacement + after);

        // remove fixed issue
        setIssues((prev) => prev.filter((i) => i !== issue));
    };

    // ---------- Actions ----------
    const copyText = () => {
        navigator.clipboard.writeText(text);
        setToast(true);
        setTimeout(() => setToast(false), 2000);
    };

    const clearText = () => {
        setText("");
        setIssues([]);
    };

    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const charCount = text.length;

    return (
        <div className="tool-page">
            <div className="max-w-3xl mx-auto">
                <div className="tool-card">

                    {/* Header */}
                    <div className="tool-header text-center">
                        <div className="flex justify-center gap-2 mb-2">
                            <BiText className="text-3xl text-[var(--primary)]" />
                            <h1 className="text-3xl font-black">Case + Grammar Tool</h1>
                        </div>
                        <p className="text-[var(--text-muted)]">
                            Convert text & fix grammar instantly
                        </p>
                    </div>

                    {/* Body */}
                    <div className="tool-body space-y-5">

                        {/* Input */}
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={6}
                            className="form-input resize-y"
                            placeholder="Enter your text..."
                        />

                        {/* Case Buttons */}
                        <div className="flex flex-wrap gap-2">
                            <button onClick={toUpper} className="preset-btn">UPPER</button>
                            <button onClick={toLower} className="preset-btn">lower</button>
                            <button onClick={toSentenceCase} className="preset-btn">Sentence</button>
                            <button onClick={toTitleCase} className="preset-btn">Title</button>
                            <button onClick={toCamelCase} className="preset-btn">camelCase</button>
                        </div>

                        {/* Grammar Button */}
                        <button
                            onClick={checkGrammar}
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? "Checking..." : "Check Grammar"}
                        </button>

                        {/* Issues */}
                        {issues.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="font-semibold text-[var(--text-primary)]">
                                    Suggestions
                                </h3>

                                {issues.map((issue, i) => (
                                    <div key={i} className="p-3 border rounded-lg bg-slate-50">

                                        <p className="text-sm text-red-500 mb-1">
                                            {issue.message}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {issue.replacements.slice(0, 3).map((r, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => applySuggestion(issue, r.value)}
                                                    className="px-2 py-1 text-xs bg-[var(--primary)] text-white rounded"
                                                >
                                                    {r.value}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Stats */}
                        <div className="flex gap-3">
                            <div className="result-card flex-1 text-center py-3">
                                <p>Words</p>
                                <p className="font-bold">{wordCount}</p>
                            </div>

                            <div className="result-card flex-1 text-center py-3">
                                <p>Characters</p>
                                <p className="font-bold">{charCount}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={copyText} className="btn-primary">
                                <BiCopy /> Copy
                            </button>

                            <button onClick={clearText} className="btn-secondary">
                                <BiTrash /> Clear
                            </button>
                        </div>

                        <p className="text-xs text-center text-[var(--text-muted)]">
                            ✓ Powered by LanguageTool API (free & open-source)
                        </p>

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

export default CaseConverter;