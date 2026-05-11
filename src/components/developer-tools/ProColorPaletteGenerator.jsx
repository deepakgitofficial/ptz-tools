import React, { useEffect, useMemo, useState } from "react";
import chroma from "chroma-js";
import { SketchPicker } from "react-color";
import {
    BiCopy,
    BiRefresh,
    BiDownload,
    BiPalette,
    BiImageAdd,
} from "react-icons/bi";

const PALETTE_SIZE = 6;

const paletteModes = [
    "analogous",
    "complementary",
    "triad",
    "split-complementary",
    "monochrome",
];

const ProColorPaletteGenerator = () => {
    const [baseColor, setBaseColor] = useState("#818CF8");
    const [palette, setPalette] = useState([]);
    const [mode, setMode] = useState("analogous");
    const [copied, setCopied] = useState("");
    const [imagePreview, setImagePreview] = useState(null);

    // ---------- Generate Palette ----------
    const generatePalette = () => {
        let colors = [];

        switch (mode) {
            case "complementary":
                colors = [
                    baseColor,
                    chroma(baseColor).set("hsl.h", "+180").hex(),
                ];
                break;

            case "triad":
                colors = [
                    baseColor,
                    chroma(baseColor).set("hsl.h", "+120").hex(),
                    chroma(baseColor).set("hsl.h", "+240").hex(),
                ];
                break;

            case "split-complementary":
                colors = [
                    baseColor,
                    chroma(baseColor).set("hsl.h", "+150").hex(),
                    chroma(baseColor).set("hsl.h", "+210").hex(),
                ];
                break;

            case "monochrome":
                colors = chroma
                    .scale([
                        chroma(baseColor).brighten(2),
                        baseColor,
                        chroma(baseColor).darken(2),
                    ])
                    .mode("lab")
                    .colors(PALETTE_SIZE);
                break;

            default:
                colors = chroma
                    .scale([
                        chroma(baseColor).set("hsl.h", "-40"),
                        baseColor,
                        chroma(baseColor).set("hsl.h", "+40"),
                    ])
                    .mode("lab")
                    .colors(PALETTE_SIZE);
        }

        setPalette(colors);
    };

    // ---------- Random ----------
    const randomPalette = () => {
        setBaseColor(chroma.random().hex());
    };

    // ---------- Copy ----------
    const copy = (value) => {
        navigator.clipboard.writeText(value);

        setCopied(value);

        setTimeout(() => {
            setCopied("");
        }, 1800);
    };

    // ---------- Export CSS ----------
    const exportCSS = () => {
        const css = palette
            .map((c, i) => `--color-${i + 1}: ${c};`)
            .join("\n");

        const blob = new Blob([`:root {\n${css}\n}`], {
            type: "text/css",
        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "palette.css";
        a.click();

        URL.revokeObjectURL(url);
    };

    // ---------- Image Upload ----------
    const extractColorsFromImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            setImagePreview(reader.result);

            // fake extraction demo
            const extracted = [
                chroma.random().hex(),
                chroma.random().hex(),
                chroma.random().hex(),
                chroma.random().hex(),
                chroma.random().hex(),
            ];

            setPalette(extracted);
        };

        reader.readAsDataURL(file);
    };

    // ---------- Gradient ----------
    const gradient = useMemo(() => {
        return `linear-gradient(135deg, ${palette.join(", ")})`;
    }, [palette]);

    useEffect(() => {
        generatePalette();
    }, [baseColor, mode]);

    return (
        <div className="tool-page">
            <div className="max-w-7xl mx-auto">
                <div className="tool-card overflow-hidden">

                    {/* Header */}
                    <div className="tool-header text-center">
                        <div className="flex justify-center items-center gap-3 mb-2">
                            <BiPalette className="text-4xl text-[var(--primary)]" />
                            <h1 className="text-4xl font-black">
                                Pro Colour Palette Generator
                            </h1>
                        </div>

                        <p className="text-[var(--text-muted)]">
                            Generate modern palettes, gradients & export design systems
                        </p>
                    </div>

                    {/* Main */}
                    <div className="tool-body space-y-10">

                        {/* Top Controls */}
                        <div className="flex flex-col md:flex-row gap-8">

                            {/* Picker */}
                            <div className="flex justify-center md:basis-1/4 rounded-2xl overflow-hidden shadow-lg border color-picker-wrapper">
                                <SketchPicker
                                    color={baseColor}
                                    onChange={(c) => setBaseColor(c.hex)}
                                    styles={{ width: "100%" }}
                                />
                            </div>

                            {/* Controls */}
                            <div className="space-y-5 md:basis-3/4">

                                {/* Selected */}
                                <div className="result-card p-5">
                                    <p className="result-label mb-3">
                                        Base Colour
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-16 h-16 rounded-2xl border shadow"
                                            style={{ background: baseColor }}
                                        />

                                        <div>
                                            <p className="font-mono text-lg font-bold">
                                                {baseColor.toUpperCase()}
                                            </p>

                                            <button
                                                onClick={() => copy(baseColor)}
                                                className="btn-secondary mt-2"
                                            >
                                                <BiCopy />
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Modes */}
                                <div>
                                    <p className="result-label mb-2">
                                        Palette Mode
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {paletteModes.map((m) => (
                                            <button
                                                key={m}
                                                onClick={() => setMode(m)}
                                                className={`preset-btn ${mode === m ? "active" : ""
                                                    }`}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="grid md:grid-cols-2 gap-3">
                                    <button
                                        onClick={randomPalette}
                                        className="btn-primary"
                                    >
                                        <BiRefresh />
                                        Random Palette
                                    </button>

                                    <button
                                        onClick={exportCSS}
                                        className="btn-secondary"
                                    >
                                        <BiDownload />
                                        Export CSS
                                    </button>
                                </div>

                                {/* Upload */}
                                <label className="btn-secondary cursor-pointer">
                                    <BiImageAdd />
                                    Extract from Image

                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={extractColorsFromImage}
                                    />
                                </label>

                            </div>
                        </div>

                        {/* Image Preview */}
                        {imagePreview && (
                            <div>
                                <h2 className="text-xl font-bold mb-3">
                                    Uploaded Image
                                </h2>

                                <img
                                    src={imagePreview}
                                    alt=""
                                    className="max-h-80 rounded-2xl shadow-lg border"
                                />
                            </div>
                        )}

                        {/* Palette */}
                        <div>
                            <h2 className="text-2xl font-bold mb-5">
                                Generated Palette
                            </h2>

                            <div className="grid md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-6 gap-5">

                                {palette.map((color, i) => (
                                    <div
                                        key={i}
                                        className="rounded-3xl overflow-hidden shadow-xl border bg-white"
                                    >

                                        <div
                                            className="h-44"
                                            style={{ background: color }}
                                        />

                                        <div className="p-4">
                                            <p className="font-mono text-sm font-bold">
                                                {color.toUpperCase()}
                                            </p>

                                            <button
                                                onClick={() => copy(color)}
                                                className="btn-secondary mt-3 w-full"
                                            >
                                                <BiCopy />
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>

                        {/* Gradient */}
                        <div>
                            <h2 className="text-2xl font-bold mb-5">
                                Gradient Preview
                            </h2>

                            <div
                                className="h-56 rounded-[2rem] shadow-2xl border relative overflow-hidden"
                                style={{ background: gradient }}
                            >

                                <div className="absolute bottom-5 left-5 right-5 bg-white/70 backdrop-blur-xl rounded-2xl p-4">

                                    <p className="font-mono text-xs break-all">
                                        {gradient}
                                    </p>

                                    <button
                                        onClick={() => copy(gradient)}
                                        className="btn-primary mt-4"
                                    >
                                        <BiCopy />
                                        Copy Gradient
                                    </button>

                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        {/* <p className="text-xs text-center text-[var(--text-muted)]">
                            🎨 Powered by chroma-js & react-color
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

export default ProColorPaletteGenerator;