import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    diffWords,
    diffLines,
    diffJson,
    createPatch,
} from "diff";

import Prism from "prismjs";

import "prismjs/themes/prism.css";

import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markup";

import {
    BiCodeAlt,
    BiCopy,
    BiDownload,
    BiSearch,
    BiTransferAlt,
} from "react-icons/bi";

// ----------------------------------------------------
// LANGUAGE MAP
// ----------------------------------------------------
const LANGUAGES = [
    "javascript",
    "typescript",
    "json",
    "css",
    "markup",
    "text",
];

// ----------------------------------------------------
// DIFF ENGINE
// ----------------------------------------------------
const getDiff = (
    oldText,
    newText,
    mode,
    ignoreCase,
    ignoreWhitespace
) => {
    let left = oldText;
    let right = newText;

    if (ignoreCase) {
        left = left.toLowerCase();
        right = right.toLowerCase();
    }

    if (ignoreWhitespace) {
        left = left.replace(/\s+/g, " ").trim();
        right = right.replace(/\s+/g, " ").trim();
    }

    switch (mode) {
        case "json":
            try {
                return diffJson(
                    JSON.parse(left || "{}"),
                    JSON.parse(right || "{}")
                );
            } catch {
                return diffWords(left, right);
            }

        case "code":
            return diffLines(left, right);

        default:
            return diffWords(left, right);
    }
};

// ----------------------------------------------------
// SYNTAX HIGHLIGHT
// ----------------------------------------------------
const highlightCode = (code, language) => {
    if (language === "text") {
        return code;
    }

    try {
        return Prism.highlight(
            code,
            Prism.languages[language],
            language
        );
    } catch {
        return code;
    }
};

const DiffChecker = () => {
    const [leftText, setLeftText] = useState("");
    const [rightText, setRightText] = useState("");

    const [language, setLanguage] =
        useState("javascript");

    const [diffMode, setDiffMode] =
        useState("code");

    const [viewMode, setViewMode] =
        useState("side");

    const [ignoreWhitespace, setIgnoreWhitespace] =
        useState(false);

    const [ignoreCase, setIgnoreCase] =
        useState(false);

    const [search, setSearch] = useState("");

    const [syncScroll, setSyncScroll] =
        useState(true);

    const leftDiffRef = useRef(null);
    const rightDiffRef = useRef(null);

    // ----------------------------------------------------
    // DIFF DATA
    // ----------------------------------------------------
    const diffResult = useMemo(() => {
        return getDiff(
            leftText,
            rightText,
            diffMode,
            ignoreCase,
            ignoreWhitespace
        );
    }, [
        leftText,
        rightText,
        diffMode,
        ignoreCase,
        ignoreWhitespace,
    ]);

    // ----------------------------------------------------
    // STATS
    // ----------------------------------------------------
    const stats = useMemo(() => {
        let added = 0;
        let removed = 0;

        diffResult.forEach((part) => {
            if (part.added) added++;
            if (part.removed) removed++;
        });

        return {
            added,
            removed,
            total: diffResult.length,
        };
    }, [diffResult]);

    // ----------------------------------------------------
    // SCROLL SYNC
    // ----------------------------------------------------
    useEffect(() => {
        if (!syncScroll) return;

        const left = leftDiffRef.current;
        const right = rightDiffRef.current;

        if (!left || !right) return;

        const syncLeft = () => {
            right.scrollTop = left.scrollTop;
        };

        const syncRight = () => {
            left.scrollTop = right.scrollTop;
        };

        left.addEventListener("scroll", syncLeft);
        right.addEventListener("scroll", syncRight);

        return () => {
            left.removeEventListener("scroll", syncLeft);
            right.removeEventListener("scroll", syncRight);
        };
    }, [syncScroll]);

    // ----------------------------------------------------
    // COPY PATCH
    // ----------------------------------------------------
    const copyPatch = async () => {
        const patch = createPatch(
            "diff.txt",
            leftText,
            rightText
        );

        await navigator.clipboard.writeText(patch);

        alert("Patch copied!");
    };

    // ----------------------------------------------------
    // DOWNLOAD REPORT
    // ----------------------------------------------------
    const downloadReport = () => {
        const patch = createPatch(
            "diff.txt",
            leftText,
            rightText
        );

        const blob = new Blob([patch], {
            type: "text/plain",
        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = "diff-report.patch";

        a.click();

        URL.revokeObjectURL(url);
    };

    // ----------------------------------------------------
    // SEARCH HIGHLIGHT
    // ----------------------------------------------------
    const applySearch = (text) => {
        if (!search) return text;

        return text.replace(
            new RegExp(search, "gi"),
            (match) =>
                `<mark class="bg-yellow-300 text-black px-1 rounded">${match}</mark>`
        );
    };

    // ----------------------------------------------------
    // RENDER DIFF
    // ----------------------------------------------------
    const renderDiff = (side = "left") => {
        return diffResult.map((part, index) => {
            const content =
                side === "left"
                    ? part.removed || !part.added
                        ? part.value
                        : ""
                    : part.added || !part.removed
                        ? part.value
                        : "";

            if (!content) return null;

            let bg = "";

            if (part.added) {
                bg = "bg-green-50 border-l-4 border-green-500";
            }

            if (part.removed) {
                bg = "bg-red-50 border-l-4 border-red-500";
            }

            const highlighted = highlightCode(
                content,
                language
            );

            return (
                <div
                    key={index}
                    className={`p-3 font-mono text-sm whitespace-pre-wrap transition-all ${bg}`}
                >
                    <div
                        dangerouslySetInnerHTML={{
                            __html: applySearch(highlighted),
                        }}
                    />
                </div>
            );
        });
    };

    return (
        <div className="tool-page">
            <div className="max-w-[1900px] mx-auto">

                <div className="tool-card overflow-hidden">

                    {/* HEADER */}
                    <div className="tool-header">

                        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                            <div>
                                <div className="flex items-center gap-3 mb-3">

                                    <BiTransferAlt className="text-4xl text-[var(--primary)]" />

                                    <h1 className="text-4xl font-black">
                                        Pro Diff Checker
                                    </h1>

                                </div>

                                <p className="text-[var(--text-secondary)] max-w-2xl">
                                    Advanced GitHub-style diff comparison
                                    for source code & text with syntax
                                    highlighting.
                                </p>

                            </div>

                            {/* ACTIONS */}
                            <div className="flex flex-wrap gap-3">

                                <button
                                    onClick={copyPatch}
                                    className="btn-secondary"
                                >
                                    <BiCopy />
                                    Copy Patch
                                </button>

                                <button
                                    onClick={downloadReport}
                                    className="btn-primary"
                                >
                                    <BiDownload />
                                    Download Patch
                                </button>

                            </div>

                        </div>

                    </div>

                    {/* BODY */}
                    <div className="tool-body space-y-7">

                        {/* CONTROLS */}
                        <div className="grid xl:grid-cols-4 gap-5">

                            {/* Language */}
                            <div className="result-card p-5">

                                <label className="result-label mb-3 block">
                                    Language
                                </label>

                                <select
                                    value={language}
                                    onChange={(e) =>
                                        setLanguage(e.target.value)
                                    }
                                    className="form-input"
                                >

                                    {LANGUAGES.map((lang) => (
                                        <option key={lang}>
                                            {lang}
                                        </option>
                                    ))}

                                </select>

                            </div>

                            {/* Diff Mode */}
                            <div className="result-card p-5">

                                <label className="result-label mb-3 block">
                                    Diff Mode
                                </label>

                                <div className="flex gap-2">

                                    <button
                                        onClick={() =>
                                            setDiffMode("code")
                                        }
                                        className={`preset-btn ${diffMode === "code"
                                            ? "active"
                                            : ""
                                            }`}
                                    >
                                        Code
                                    </button>

                                    <button
                                        onClick={() =>
                                            setDiffMode("text")
                                        }
                                        className={`preset-btn ${diffMode === "text"
                                            ? "active"
                                            : ""
                                            }`}
                                    >
                                        Text
                                    </button>

                                    <button
                                        onClick={() =>
                                            setDiffMode("json")
                                        }
                                        className={`preset-btn ${diffMode === "json"
                                            ? "active"
                                            : ""
                                            }`}
                                    >
                                        JSON
                                    </button>

                                </div>

                            </div>

                            {/* Search */}
                            <div className="result-card p-5">

                                <label className="result-label mb-3 block">
                                    Search
                                </label>

                                <div className="relative">

                                    <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                                    <input
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search..."
                                        className="form-input pl-10"
                                    />

                                </div>

                            </div>

                            {/* Options */}
                            <div className="result-card p-5">

                                <label className="result-label mb-3 block">
                                    Options
                                </label>

                                <div className="space-y-2 text-sm">

                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={ignoreWhitespace}
                                            onChange={() =>
                                                setIgnoreWhitespace(
                                                    !ignoreWhitespace
                                                )
                                            }
                                        />

                                        Ignore Whitespace
                                    </label>

                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={ignoreCase}
                                            onChange={() =>
                                                setIgnoreCase(!ignoreCase)
                                            }
                                        />

                                        Ignore Case
                                    </label>

                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={syncScroll}
                                            onChange={() =>
                                                setSyncScroll(!syncScroll)
                                            }
                                        />

                                        Sync Scroll
                                    </label>

                                </div>

                            </div>

                        </div>

                        {/* STATS */}
                        <div className="grid grid-cols-3 gap-5">

                            <div className="result-card p-5 text-center">
                                <p className="result-label">
                                    Total Blocks
                                </p>

                                <h2 className="text-3xl font-black">
                                    {stats.total}
                                </h2>
                            </div>

                            <div className="result-card p-5 text-center">
                                <p className="result-label">
                                    Added
                                </p>

                                <h2 className="text-3xl font-black text-green-600">
                                    {stats.added}
                                </h2>
                            </div>

                            <div className="result-card p-5 text-center">
                                <p className="result-label">
                                    Removed
                                </p>

                                <h2 className="text-3xl font-black text-red-600">
                                    {stats.removed}
                                </h2>
                            </div>

                        </div>

                        {/* EDITORS */}
                        <div className="grid xl:grid-cols-2 gap-5">

                            {/* LEFT */}
                            <div className="result-card overflow-hidden">

                                <div className="border-b p-4 flex items-center gap-2">
                                    <BiCodeAlt className="text-xl text-[var(--primary)]" />

                                    <h2 className="font-bold">
                                        Original
                                    </h2>
                                </div>

                                <textarea
                                    value={leftText}
                                    onChange={(e) =>
                                        setLeftText(e.target.value)
                                    }
                                    placeholder="Paste original content..."
                                    className="w-full h-[350px] p-5 font-mono text-sm resize-none outline-none bg-transparent"
                                />

                            </div>

                            {/* RIGHT */}
                            <div className="result-card overflow-hidden">

                                <div className="border-b p-4 flex items-center gap-2">
                                    <BiCodeAlt className="text-xl text-[var(--primary)]" />

                                    <h2 className="font-bold">
                                        Updated
                                    </h2>
                                </div>

                                <textarea
                                    value={rightText}
                                    onChange={(e) =>
                                        setRightText(e.target.value)
                                    }
                                    placeholder="Paste updated content..."
                                    className="w-full h-[350px] p-5 font-mono text-sm resize-none outline-none bg-transparent"
                                />

                            </div>

                        </div>

                        {/* DIFF RESULT */}
                        <div className="result-card overflow-hidden">

                            <div className="border-b p-5 flex items-center justify-between">

                                <h2 className="text-2xl font-bold">
                                    Diff Result
                                </h2>

                                <div className="flex gap-2">

                                    <button
                                        onClick={() =>
                                            setViewMode("side")
                                        }
                                        className={`preset-btn ${viewMode === "side"
                                            ? "active"
                                            : ""
                                            }`}
                                    >
                                        Side
                                    </button>

                                    <button
                                        onClick={() =>
                                            setViewMode("inline")
                                        }
                                        className={`preset-btn ${viewMode === "inline"
                                            ? "active"
                                            : ""
                                            }`}
                                    >
                                        Inline
                                    </button>

                                </div>

                            </div>

                            {/* SIDE VIEW */}
                            {viewMode === "side" ? (
                                <div className="grid xl:grid-cols-2">

                                    <div
                                        ref={leftDiffRef}
                                        className="max-h-[700px] overflow-auto border-r"
                                    >
                                        {renderDiff("left")}
                                    </div>

                                    <div
                                        ref={rightDiffRef}
                                        className="max-h-[700px] overflow-auto"
                                    >
                                        {renderDiff("right")}
                                    </div>

                                </div>
                            ) : (
                                // INLINE
                                <div className="max-h-[700px] overflow-auto">

                                    {diffResult.map((part, i) => {
                                        let bg = "";

                                        if (part.added) {
                                            bg =
                                                "bg-green-50 border-l-4 border-green-500";
                                        }

                                        if (part.removed) {
                                            bg =
                                                "bg-red-50 border-l-4 border-red-500";
                                        }

                                        return (
                                            <div
                                                key={i}
                                                className={`p-4 font-mono text-sm whitespace-pre-wrap ${bg}`}
                                            >
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: applySearch(
                                                            highlightCode(
                                                                part.value,
                                                                language
                                                            )
                                                        ),
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}

                                </div>
                            )}

                        </div>

                        {/* FOOTER */}
                        <p className="text-xs text-center text-[var(--text-secondary)]">
                            ⚡ Powered by diff & PrismJS for
                            production-grade comparison.
                        </p>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default DiffChecker;