import React, { useEffect, useState } from "react";
import chroma from "chroma-js";
import { SketchPicker } from "react-color";
import { BiCopy, BiRefresh } from "react-icons/bi";

const PALETTE_SIZE = 5;

const ColorPaletteGenerator = () => {
    const [baseColor, setBaseColor] = useState("#818CF8");
    const [palette, setPalette] = useState([]);
    const [copied, setCopied] = useState("");

    // ---------- Generate Palette ----------
    const generatePalette = (color) => {
        const colors = chroma
            .scale([
                chroma(color).brighten(2),
                color,
                chroma(color).darken(2),
            ])
            .mode("lab")
            .colors(PALETTE_SIZE);

        setPalette(colors);
    };

    // ---------- Random Color ----------
    const randomColor = () => {
        const random = chroma.random().hex();
        setBaseColor(random);
    };

    // ---------- Copy ----------
    const copyColor = (color) => {
        navigator.clipboard.writeText(color);

        setCopied(color);

        setTimeout(() => {
            setCopied("");
        }, 2000);
    };

    useEffect(() => {
        generatePalette(baseColor);
    }, [baseColor]);

    // ---------- Gradient ----------
    const gradient = `linear-gradient(135deg, ${palette.join(", ")})`;

    return (
        <div className="tool-page">
            <div className="max-w-6xl mx-auto">
                <div className="tool-card overflow-hidden">

                    {/* Header */}
                    <div className="tool-header text-center">
                        <h1 className="text-3xl font-black">
                            Colour Palette Generator
                        </h1>

                        <p className="text-[var(--text-muted)]">
                            Generate beautiful colour palettes & gradients instantly
                        </p>
                    </div>

                    {/* Body */}
                    <div className="tool-body space-y-8">

                        {/* Color Picker */}
                        <div className="flex flex-col lg:flex-row gap-8">

                            <div className="flex justify-center">
                                <SketchPicker
                                    color={baseColor}
                                    onChange={(color) => setBaseColor(color.hex)}
                                />
                            </div>

                            {/* Controls */}
                            <div className="flex-1 space-y-5">

                                {/* Base Color */}
                                <div className="result-card p-5">
                                    <p className="result-label mb-2">
                                        Selected Colour
                                    </p>

                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-14 h-14 rounded-xl border"
                                            style={{ background: baseColor }}
                                        />

                                        <div className="flex-1">
                                            <p className="font-mono font-bold text-lg">
                                                {baseColor.toUpperCase()}
                                            </p>

                                            <button
                                                onClick={() => copyColor(baseColor)}
                                                className="btn-secondary mt-2"
                                            >
                                                <BiCopy />
                                                Copy Colour
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Random Button */}
                                <button
                                    onClick={randomColor}
                                    className="btn-primary"
                                >
                                    <BiRefresh />
                                    Generate Random Palette
                                </button>

                            </div>
                        </div>

                        {/* Palette */}
                        <div>
                            <h2 className="text-xl font-bold mb-4">
                                Generated Palette
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

                                {palette.map((color, i) => (
                                    <div
                                        key={i}
                                        className="rounded-2xl overflow-hidden shadow-lg border"
                                    >

                                        <div
                                            className="h-40"
                                            style={{ background: color }}
                                        />

                                        <div className="p-4 bg-white">

                                            <p className="font-mono text-sm font-bold">
                                                {color.toUpperCase()}
                                            </p>

                                            <button
                                                onClick={() => copyColor(color)}
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
                            <h2 className="text-xl font-bold mb-4">
                                Gradient Preview
                            </h2>

                            <div
                                className="h-44 rounded-3xl shadow-xl border relative overflow-hidden"
                                style={{ background: gradient }}
                            >

                                <div className="absolute bottom-4 left-4 right-4 bg-white/70 backdrop-blur-lg rounded-xl p-3">

                                    <p className="text-xs font-mono break-all">
                                        {gradient}
                                    </p>

                                    <button
                                        onClick={() => copyColor(gradient)}
                                        className="btn-primary mt-3"
                                    >
                                        <BiCopy />
                                        Copy Gradient
                                    </button>

                                </div>
                            </div>
                        </div>

                        {/* Toast */}
                        {copied && (
                            <div className="toast animate-slide-up">
                                ✓ Copied: {copied}
                            </div>
                        )}

                        {/* Footer */}
                        {/* <p className="text-xs text-center text-[var(--text-muted)]">
                            🎨 Powered by chroma-js & react-color
                        </p> */}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColorPaletteGenerator;