import React, { useState, useRef, useCallback } from "react";
import { BiDownload, BiImage } from "react-icons/bi";

import { FaCompressArrowsAlt } from "react-icons/fa";

const qualityLabels = [
    { max: 0.2, label: "Low", color: "text-red-500" },
    { max: 0.5, label: "Medium", color: "text-amber-500" },
    { max: 0.8, label: "High", color: "text-blue-500" },
    { max: 1.0, label: "Best", color: "text-emerald-500" },
];

const ImageCompressor = () => {
    const [originalImage, setOriginalImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [compressed, setCompressed] = useState(null);
    const [quality, setQuality] = useState(0.7);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const [dragging, setDragging] = useState(false);
    const canvasRef = useRef(null);

    const loadFile = (file) => {
        if (!file || !file.type.startsWith("image/")) return;
        setOriginalSize((file.size / 1024).toFixed(1));
        setCompressed(null); setCompressedSize(0);
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => { setOriginalImage(img); setPreview(img.src); };
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = (e) => loadFile(e.target.files[0]);
    const handleDrop = useCallback((e) => {
        e.preventDefault(); setDragging(false); loadFile(e.dataTransfer.files[0]);
    }, []);

    const compressImage = () => {
        if (!originalImage) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = originalImage.width; canvas.height = originalImage.height;
        ctx.drawImage(originalImage, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        const sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
        setCompressed(dataUrl); setCompressedSize(sizeKb);
    };

    const downloadImage = () => {
        const link = document.createElement("a");
        link.download = "compressed-image.jpg"; link.href = compressed; link.click();
    };

    const savedPercent = originalSize && compressedSize
        ? Math.round((1 - compressedSize / originalSize) * 100) : 0;

    const ql = qualityLabels.find(q => quality <= q.max) || qualityLabels[3];

    return (
        <div className="tool-page">
            <div className="max-w-3xl mx-auto">
                <div className="tool-card">
                    <div className="tool-header">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <FaCompressArrowsAlt className="text-3xl text-[var(--primary)]" />
                            <h1 className="text-3xl font-black">Image Compressor</h1>
                        </div>
                        <p>Reduce image file size while preserving visual quality</p>
                    </div>

                    <div className="tool-body space-y-5">
                        {!originalImage ? (
                            <div className={`upload-zone ${dragging ? "dragging" : ""}`}
                                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}>
                                <input type="file" accept="image/*" onChange={handleUpload} />
                                <div className="upload-zone-icon"><FaCompressArrowsAlt /></div>
                                <p className="font-semibold text-[var(--text-primary)]">Drop an image to compress</p>
                                <p className="text-sm text-[var(--text-muted)] mt-1">or click to browse</p>
                            </div>
                        ) : (
                            <>
                                {/* Remove bar */}
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-[var(--border)]">
                                    <span className="text-sm font-semibold flex items-center gap-2 text-[var(--text-primary)]">
                                        <BiImage className="text-[var(--primary)]" /> Original: {originalSize} KB
                                    </span>
                                    <button onClick={() => { setOriginalImage(null); setPreview(null); setCompressed(null); }}
                                        className="text-xs text-red-400 hover:text-red-600 font-semibold">✕ Remove</button>
                                </div>

                                {/* Quality slider */}
                                <div className="form-group">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="form-label mb-0">Compression Quality</label>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-bold ${ql.color}`}>{ql.label}</span>
                                            <span className="badge badge-primary">{Math.round(quality * 100)}%</span>
                                        </div>
                                    </div>
                                    <input type="range" min="0.05" max="1" step="0.05" value={quality}
                                        onChange={e => setQuality(Number(e.target.value))} />
                                    <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                                        <span>Smallest</span>
                                        <span>Best Quality</span>
                                    </div>
                                </div>

                                <button onClick={compressImage} className="btn-primary py-3.5">
                                    <FaCompressArrowsAlt /> Compress Image
                                </button>

                                {/* Size comparison */}
                                {compressedSize > 0 && (
                                    <div className="animate-slide-up space-y-3">
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="result-card result-card-info text-center">
                                                <p className="result-label text-center">Original</p>
                                                <p className="font-bold text-lg text-[var(--info)]">{originalSize} KB</p>
                                            </div>
                                            <div className="result-card result-card-success text-center">
                                                <p className="result-label text-center">Compressed</p>
                                                <p className="font-bold text-lg text-[var(--success)]">{compressedSize} KB</p>
                                            </div>
                                            <div className="result-card result-card-primary text-center">
                                                <p className="result-label text-center">Saved</p>
                                                <p className="font-bold text-lg text-[var(--primary-dark)]">{savedPercent}%</p>
                                            </div>
                                        </div>
                                        {/* Saved bar */}
                                        <div>
                                            <div className="flex justify-between text-xs font-semibold mb-1">
                                                <span className="text-[var(--success)]">Saved {savedPercent}%</span>
                                                <span className="text-[var(--text-muted)]">Remaining {100 - savedPercent}%</span>
                                            </div>
                                            <div className="progress-bar-track">
                                                <div className="progress-bar-fill bg-[var(--success)]"
                                                    style={{ width: `${savedPercent}%`, background: 'var(--gradient-primary)' }} />
                                            </div>
                                        </div>

                                        <button onClick={downloadImage} className="btn-secondary">
                                            <BiDownload /> Download Compressed Image
                                        </button>
                                    </div>
                                )}

                                {/* Preview */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="form-label text-center mb-2">Original</p>
                                        <img src={preview} className="rounded-xl border border-[var(--border)] w-full object-contain max-h-52" alt="original" />
                                    </div>
                                    {compressed && (
                                        <div className="animate-scale-in">
                                            <p className="form-label text-center mb-2">Compressed</p>
                                            <img src={compressed} className="rounded-xl border-2 border-[var(--primary)] w-full object-contain max-h-52" alt="compressed" />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        <canvas ref={canvasRef} className="hidden" />
                        <p className="text-xs text-center text-[var(--text-muted)]">
                            ✓ Client-side compression — fast, private, no uploads
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCompressor;