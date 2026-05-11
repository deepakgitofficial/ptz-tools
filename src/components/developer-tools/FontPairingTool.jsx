import React, { useEffect, useMemo, useState } from "react";
import WebFont from "webfontloader";
import {
    BiCopy,
    BiRefresh,
    BiFontFamily,
} from "react-icons/bi";

// ---------- Curated Font Pairs ----------
const FONT_PAIRS = [
    {
        heading: "Poppins",
        body: "Inter",
        category: "Modern UI",
    },
    {
        heading: "Playfair Display",
        body: "Source Sans 3",
        category: "Elegant Editorial",
    },
    {
        heading: "Montserrat",
        body: "Open Sans",
        category: "Corporate",
    },
    {
        heading: "Bebas Neue",
        body: "Roboto",
        category: "Creative",
    },
    {
        heading: "Merriweather",
        body: "Lato",
        category: "Blog / Reading",
    },
    {
        heading: "Oswald",
        body: "Nunito",
        category: "Bold Marketing",
    },
    {
        heading: "Raleway",
        body: "Work Sans",
        category: "Minimal",
    },
    {
        heading: "DM Serif Display",
        body: "Manrope",
        category: "Luxury",
    },

    // New Font Pairs
    {
        heading: "Anton",
        body: "Poppins",
        category: "Poster / Hero",
    },
    {
        heading: "Cinzel",
        body: "Libre Baskerville",
        category: "Classic Luxury",
    },
    {
        heading: "Rubik",
        body: "Nunito Sans",
        category: "Startup",
    },
    {
        heading: "Space Grotesk",
        body: "DM Sans",
        category: "Modern Tech",
    },
    {
        heading: "Orbitron",
        body: "Exo 2",
        category: "Futuristic",
    },
    {
        heading: "Abril Fatface",
        body: "Karla",
        category: "Fashion",
    },
    {
        heading: "Archivo Black",
        body: "Mulish",
        category: "Agency",
    },
    {
        heading: "Cormorant Garamond",
        body: "Figtree",
        category: "Premium Editorial",
    },
    {
        heading: "Outfit",
        body: "Plus Jakarta Sans",
        category: "SaaS UI",
    },
    {
        heading: "Urbanist",
        body: "Hind",
        category: "Clean Modern",
    },
    {
        heading: "Syne",
        body: "Inter",
        category: "Creative Portfolio",
    },
    {
        heading: "Alfa Slab One",
        body: "Cabin",
        category: "Vintage",
    },
    {
        heading: "Josefin Sans",
        body: "Assistant",
        category: "Elegant Minimal",
    },
    {
        heading: "Teko",
        body: "Barlow",
        category: "Gaming",
    },
    {
        heading: "Sora",
        body: "IBM Plex Sans",
        category: "Tech Startup",
    },
    {
        heading: "Prata",
        body: "Open Sans",
        category: "Luxury Brand",
    },
    {
        heading: "League Spartan",
        body: "Public Sans",
        category: "Professional",
    },
    {
        heading: "Archivo",
        body: "Inter",
        category: "Dashboard UI",
    },
    {
        heading: "Bricolage Grotesque",
        body: "Manrope",
        category: "Modern Creative",
    },
    {
        heading: "Cormorant",
        body: "Work Sans",
        category: "Magazine",
    },
];

const FontPairingTool = () => {
    const [selectedPair, setSelectedPair] = useState(FONT_PAIRS[0]);
    const [previewText, setPreviewText] = useState(
        "Design beautiful typography combinations effortlessly."
    );
    const [copied, setCopied] = useState("");

    // ---------- Load Fonts ----------
    useEffect(() => {
        WebFont.load({
            google: {
                families: [
                    `${selectedPair.heading}:300,400,500,600,700`,
                    `${selectedPair.body}:300,400,500,600,700`,
                ],
            },
        });
    }, [selectedPair]);

    // ---------- Random Pair ----------
    const randomPair = () => {
        const random =
            FONT_PAIRS[Math.floor(Math.random() * FONT_PAIRS.length)];

        setSelectedPair(random);
    };

    // ---------- Copy ----------
    const copyFont = (value) => {
        navigator.clipboard.writeText(value);

        setCopied(value);

        setTimeout(() => {
            setCopied("");
        }, 1800);
    };

    // ---------- Google Fonts Import ----------
    const importCode = useMemo(() => {
        return `@import url('https://fonts.googleapis.com/css2?family=${selectedPair.heading.replace(
            / /g,
            "+"
        )}:wght@300;400;500;600;700&family=${selectedPair.body.replace(
            / /g,
            "+"
        )}:wght@300;400;500;600;700&display=swap');`;
    }, [selectedPair]);

    return (
        <div className="tool-page">
            <div className="max-w-7xl mx-auto">

                <div className="tool-card overflow-hidden">

                    {/* Header */}
                    <div className="tool-header text-center">

                        <div className="flex justify-center items-center gap-3 mb-3">
                            <BiFontFamily className="text-4xl text-[var(--primary)]" />

                            <h1 className="text-4xl font-black">
                                Font Pairing Tool
                            </h1>
                        </div>

                        <p className="text-[var(--text-muted)]">
                            Discover beautiful Google Font combinations for modern UI & branding
                        </p>

                    </div>

                    {/* Body */}
                    <div className="tool-body space-y-10">

                        {/* Controls */}
                        <div className="grid lg:grid-cols-3 gap-6">

                            {/* Pair Selection */}
                            <div className="result-card p-5 lg:col-span-1">

                                <div className=" mb-4">
                                    <h2 className="font-bold text-lg">
                                        Font Combinations
                                    </h2>

                                    <button
                                        onClick={randomPair}
                                        className="btn-primary mt-4"
                                    >
                                        <BiRefresh />
                                        Random
                                    </button>
                                </div>

                                <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">

                                    {FONT_PAIRS.map((pair, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedPair(pair)}
                                            className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedPair.heading === pair.heading
                                                ? "bg-[var(--primary)] text-white border-transparent"
                                                : "hover:border-[var(--primary)]"
                                                }`}
                                        >

                                            <p
                                                className="text-lg font-bold"
                                                style={{
                                                    fontFamily: pair.heading,
                                                }}
                                            >
                                                {pair.heading}
                                            </p>

                                            <p
                                                className="text-sm opacity-80"
                                                style={{
                                                    fontFamily: pair.body,
                                                }}
                                            >
                                                {pair.body}
                                            </p>

                                            <span className="text-xs opacity-70">
                                                {pair.category}
                                            </span>

                                        </button>
                                    ))}

                                </div>
                            </div>

                            {/* Preview */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Hero Preview */}
                                <div className="result-card p-8">

                                    <p className="result-label mb-3">
                                        Live Typography Preview
                                    </p>

                                    <h1
                                        className="text-5xl md:text-6xl font-bold leading-tight"
                                        style={{
                                            fontFamily: selectedPair.heading,
                                        }}
                                    >
                                        {previewText}
                                    </h1>

                                    <p
                                        className="mt-6 text-lg leading-relaxed text-[var(--text-secondary)]"
                                        style={{
                                            fontFamily: selectedPair.body,
                                        }}
                                    >
                                        Typography plays a crucial role in creating modern digital
                                        experiences. The right font pairing improves readability,
                                        branding, accessibility, and visual hierarchy.
                                    </p>

                                </div>

                                {/* Editable Preview */}
                                <div className="result-card p-5">

                                    <p className="result-label mb-3">
                                        Custom Preview Text
                                    </p>

                                    <textarea
                                        rows={3}
                                        value={previewText}
                                        onChange={(e) => setPreviewText(e.target.value)}
                                        className="form-input"
                                    />

                                </div>

                                {/* Font Details */}
                                <div className="grid md:grid-cols-2 gap-5">

                                    {/* Heading Font */}
                                    <div className="result-card p-5">

                                        <p className="result-label mb-3">
                                            Heading Font
                                        </p>

                                        <h2
                                            className="text-3xl font-bold"
                                            style={{
                                                fontFamily: selectedPair.heading,
                                            }}
                                        >
                                            {selectedPair.heading}
                                        </h2>

                                        <button
                                            onClick={() => copyFont(selectedPair.heading)}
                                            className="btn-secondary mt-4"
                                        >
                                            <BiCopy />
                                            Copy Font
                                        </button>

                                    </div>

                                    {/* Body Font */}
                                    <div className="result-card p-5">

                                        <p className="result-label mb-3">
                                            Body Font
                                        </p>

                                        <h2
                                            className="text-3xl font-bold"
                                            style={{
                                                fontFamily: selectedPair.body,
                                            }}
                                        >
                                            {selectedPair.body}
                                        </h2>

                                        <button
                                            onClick={() => copyFont(selectedPair.body)}
                                            className="btn-secondary mt-4"
                                        >
                                            <BiCopy />
                                            Copy Font
                                        </button>

                                    </div>

                                </div>

                                {/* Import Code */}
                                <div className="result-card p-5">

                                    <div className="flex justify-between items-center mb-3">

                                        <p className="result-label">
                                            Google Fonts Import
                                        </p>

                                        <button
                                            onClick={() => copyFont(importCode)}
                                            className="btn-secondary"
                                        >
                                            <BiCopy />
                                            Copy Import
                                        </button>

                                    </div>

                                    <textarea
                                        value={importCode}
                                        readOnly
                                        rows={4}
                                        className="form-input font-mono"
                                    />

                                </div>

                            </div>

                        </div>

                        {/* Footer */}
                        {/* <p className="text-xs text-center text-[var(--text-muted)]">
                            ✨ Powered by Google Fonts & WebFontLoader
                        </p> */}

                    </div>

                </div>

            </div>

            {/* Toast */}
            {copied && (
                <div className="toast animate-slide-up">
                    ✓ Copied: {copied}
                </div>
            )}
        </div>
    );
};

export default FontPairingTool;