import React, { useState, useRef, useCallback } from "react";
import { BiImage, BiDownload, BiCalculator } from "react-icons/bi";
import { FaRulerCombined, FaLock, FaLockOpen } from "react-icons/fa";

const presetSizes = [
    { label: "Instagram", w: 1080, h: 1080 },
    { label: "Facebook", w: 1200, h: 630 },
    { label: "Twitter", w: 1500, h: 500 },
    { label: "HD", w: 1280, h: 720 },
    { label: "Full HD", w: 1920, h: 1080 },
    { label: "4K", w: 3840, h: 2160 },
];

const ImageResizer = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [resizedPreview, setResizedPreview] = useState(null);
    const [width, setWidth] = useState(300);
    const [height, setHeight] = useState(300);
    const [keepAspect, setKeepAspect] = useState(true);
    const [aspectRatio, setAspectRatio] = useState(1);
    const [originalSize, setOriginalSize] = useState("");
    const [dragging, setDragging] = useState(false);
    const [activePreset, setActivePreset] = useState(null);
    const canvasRef = useRef(null);

    const loadFile = (file) => {
        if (!file || !file.type.startsWith("image/")) return;
        setOriginalSize((file.size / 1024).toFixed(1) + " KB");
        const img = new Image();
        const reader = new FileReader();
        reader.onload = () => { img.src = reader.result; };
        img.onload = () => {
            setAspectRatio(img.width / img.height);
            setWidth(img.width); setHeight(img.height);
            setImage(img); setPreview(img.src); setResizedPreview(null);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = (e) => loadFile(e.target.files[0]);

    const handleDrop = useCallback((e) => {
        e.preventDefault(); setDragging(false);
        loadFile(e.dataTransfer.files[0]);
    }, []);

    const handleWidthChange = (val) => {
        setWidth(val); setActivePreset(null);
        if (keepAspect) setHeight(Math.round(val / aspectRatio));
    };

    const handleHeightChange = (val) => {
        setHeight(val); setActivePreset(null);
        if (keepAspect) setWidth(Math.round(val * aspectRatio));
    };

    const applyPreset = (p) => {
        setWidth(p.w); setHeight(p.h); setActivePreset(p.label); setKeepAspect(false);
    };

    const resizeImage = () => {
        if (!image) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = width; canvas.height = height;
        ctx.drawImage(image, 0, 0, width, height);
        setResizedPreview(canvas.toDataURL("image/jpeg", 0.92));
    };

    const downloadImage = () => {
        const link = document.createElement("a");
        link.download = `resized-${width}x${height}.jpg`;
        link.href = resizedPreview || preview;
        link.click();
    };

    return (
        <div className="tool-page">
            <div className="max-w-3xl mx-auto">
                <div className="tool-card">
                    <div className="tool-header">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <BiImage className="text-3xl text-[var(--primary)]" />
                            <h1 className="text-3xl font-black">Image Resizer</h1>
                        </div>
                        <p>Resize images to any dimension — presets for social media included</p>
                    </div>

                    <div className="tool-body space-y-5">
                        {/* Upload zone */}
                        {!image ? (
                            <div
                                className={`upload-zone ${dragging ? "dragging" : ""}`}
                                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}
                            >
                                <input type="file" accept="image/*" onChange={handleUpload} />
                                <div className="upload-zone-icon"><BiImage /></div>
                                <p className="font-semibold text-[var(--text-primary)]">Drop an image here</p>
                                <p className="text-sm text-[var(--text-muted)] mt-1">or click to browse</p>
                                <p className="text-xs text-[var(--text-muted)] mt-2">Supports JPG, PNG, WEBP, GIF</p>
                            </div>
                        ) : (
                            <>
                                {/* Info bar */}
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-[var(--border)]">
                                    <div className="flex items-center gap-2 text-sm">
                                        <BiImage className="text-[var(--primary)]" />
                                        <span className="font-semibold text-[var(--text-primary)]">Original: {originalSize}</span>
                                    </div>
                                    <button onClick={() => { setImage(null); setPreview(null); setResizedPreview(null); setActivePreset(null); }}
                                        className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors">
                                        ✕ Remove
                                    </button>
                                </div>

                                {/* Preset sizes */}
                                <div>
                                    <label className="form-label mb-2">Quick Presets</label>
                                    <div className="flex flex-wrap gap-2">
                                        {presetSizes.map(p => (
                                            <button key={p.label} onClick={() => applyPreset(p)}
                                                className={`preset-btn ${activePreset === p.label ? "active" : ""}`}>
                                                {p.label} <span className="opacity-60 text-[0.7em]">{p.w}×{p.h}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Dimensions */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label className="form-label flex items-center gap-1"><FaRulerCombined /> Width (px)</label>
                                        <input type="number" value={width}
                                            onChange={e => handleWidthChange(Number(e.target.value))}
                                            className="form-input" min={1} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label flex items-center gap-1"><FaRulerCombined /> Height (px)</label>
                                        <input type="number" value={height}
                                            onChange={e => handleHeightChange(Number(e.target.value))}
                                            className="form-input" min={1} />
                                    </div>
                                </div>

                                {/* Aspect ratio toggle */}
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-[var(--border)]">
                                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                                        {keepAspect ? <FaLock className="text-[var(--primary)]" /> : <FaLockOpen className="text-slate-400" />}
                                        Maintain Aspect Ratio
                                    </div>
                                    <input type="checkbox" checked={keepAspect}
                                        onChange={() => setKeepAspect(p => !p)}
                                        className="toggle-checkbox" />
                                </div>

                                {/* Buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={resizeImage} className="btn-primary">
                                        <BiCalculator /> Resize Image
                                    </button>
                                    <button onClick={downloadImage} disabled={!preview} className="btn-secondary">
                                        <BiDownload /> Download
                                    </button>
                                </div>

                                {/* Preview */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="form-label mb-2 text-center">Original</p>
                                        <img src={preview} alt="original" className="rounded-xl border border-[var(--border)] w-full object-contain max-h-48" />
                                    </div>
                                    {resizedPreview && (
                                        <div className="animate-scale-in">
                                            <p className="form-label mb-2 text-center">Resized ({width}×{height})</p>
                                            <img src={resizedPreview} alt="resized" className="rounded-xl border-2 border-[var(--primary)] w-full object-contain max-h-48" />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        <canvas ref={canvasRef} className="hidden" />
                        <p className="text-xs text-center text-[var(--text-muted)]">
                            ✓ Client-side processing — images never leave your device
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageResizer;