import React, { useState, useRef, useCallback } from "react";
import { BiTransfer, BiDownload, BiImage } from "react-icons/bi";

const formats = [
    { label: "JPG",  value: "image/jpeg", ext: "jpg",  desc: "Best for photos" },
    { label: "PNG",  value: "image/png",  ext: "png",  desc: "Lossless quality" },
    { label: "WEBP", value: "image/webp", ext: "webp", desc: "Modern & small" },
];

const ImageConverter = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [format, setFormat] = useState("image/jpeg");
    const [quality, setQuality] = useState(0.9);
    const [converted, setConverted] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [originalName, setOriginalName] = useState("");
    const canvasRef = useRef(null);

    const loadFile = (file) => {
        if (!file || !file.type.startsWith("image/")) return;
        setOriginalName(file.name); setConverted(null);
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => { setImage(img); setPreview(img.src); };
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault(); setDragging(false); loadFile(e.dataTransfer.files[0]);
    }, []);

    const convertImage = () => {
        if (!image) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = image.width; canvas.height = image.height;
        if (format === "image/jpeg") { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
        ctx.drawImage(image, 0, 0);
        setConverted(canvas.toDataURL(format, quality));
    };

    const downloadImage = () => {
        const ext = formats.find(f => f.value === format)?.ext || "jpg";
        const baseName = originalName.replace(/\.[^.]+$/, "");
        const link = document.createElement("a");
        link.download = `${baseName}-converted.${ext}`; link.href = converted; link.click();
    };

    const selectedFmt = formats.find(f => f.value === format);

    return (
        <div className="tool-page">
            <div className="max-w-3xl mx-auto">
                <div className="tool-card">
                    <div className="tool-header">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <BiTransfer className="text-3xl text-[var(--primary)]" />
                            <h1 className="text-3xl font-black">Image Converter</h1>
                        </div>
                        <p>Convert images between JPG, PNG, and WEBP formats instantly</p>
                    </div>

                    <div className="tool-body space-y-5">
                        {!image ? (
                            <div className={`upload-zone ${dragging ? "dragging" : ""}`}
                                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}>
                                <input type="file" accept="image/*" onChange={e => loadFile(e.target.files[0])} />
                                <div className="upload-zone-icon"><BiTransfer /></div>
                                <p className="font-semibold text-[var(--text-primary)]">Drop an image to convert</p>
                                <p className="text-sm text-[var(--text-muted)] mt-1">or click to browse</p>
                                <p className="text-xs text-[var(--text-muted)] mt-2">Supports JPG, PNG, WEBP, GIF, BMP</p>
                            </div>
                        ) : (
                            <>
                                {/* Remove bar */}
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-[var(--border)]">
                                    <span className="text-sm font-semibold flex items-center gap-2 text-[var(--text-primary)]">
                                        <BiImage className="text-[var(--primary)]" /> {originalName}
                                    </span>
                                    <button onClick={() => { setImage(null); setPreview(null); setConverted(null); }}
                                        className="text-xs text-red-400 hover:text-red-600 font-semibold">✕ Remove</button>
                                </div>

                                {/* Format cards */}
                                <div>
                                    <label className="form-label mb-3">Convert To</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {formats.map(f => (
                                            <button key={f.value} onClick={() => { setFormat(f.value); setConverted(null); }}
                                                className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${format === f.value ? 'border-[var(--primary)] bg-[var(--primary-light)]' : 'border-[var(--border)] bg-white hover:border-[var(--primary-dark)]'}`}>
                                                <p className={`font-black text-lg ${format === f.value ? 'text-[var(--primary-dark)]' : 'text-[var(--text-primary)]'}`}>{f.label}</p>
                                                <p className="text-xs text-[var(--text-muted)] mt-0.5">{f.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quality slider (not for PNG) */}
                                {format !== "image/png" && (
                                    <div className="form-group animate-slide-up">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="form-label mb-0">Output Quality</label>
                                            <span className="badge badge-primary">{Math.round(quality * 100)}%</span>
                                        </div>
                                        <input type="range" min="0.1" max="1" step="0.05" value={quality}
                                            onChange={e => setQuality(Number(e.target.value))} />
                                    </div>
                                )}

                                <button onClick={convertImage} className="btn-primary py-3.5">
                                    <BiTransfer /> Convert to {selectedFmt?.label}
                                </button>

                                {/* Preview grid */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="form-label text-center mb-2">Original</p>
                                        <img src={preview} className="rounded-xl border border-[var(--border)] w-full object-contain max-h-52" alt="original" />
                                    </div>
                                    {converted && (
                                        <div className="animate-scale-in">
                                            <p className="form-label text-center mb-2">
                                                Converted <span className="badge badge-primary ml-1">{selectedFmt?.label}</span>
                                            </p>
                                            <img src={converted} className="rounded-xl border-2 border-[var(--primary)] w-full object-contain max-h-52" alt="converted" />
                                        </div>
                                    )}
                                </div>

                                {converted && (
                                    <button onClick={downloadImage} className="btn-secondary animate-slide-up">
                                        <BiDownload /> Download as {selectedFmt?.label}
                                    </button>
                                )}
                            </>
                        )}

                        <canvas ref={canvasRef} className="hidden" />
                        <p className="text-xs text-center text-[var(--text-muted)]">
                            ✓ Supports JPG, PNG, WEBP — client-side conversion
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageConverter;