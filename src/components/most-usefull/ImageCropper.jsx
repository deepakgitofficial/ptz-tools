import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { BiCrop, BiDownload, BiImage } from "react-icons/bi";

const createImage = (url) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener("load", () => resolve(img));
        img.addEventListener("error", reject);
        img.src = url;
    });

const getCroppedImg = async (imageSrc, crop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = crop.width; canvas.height = crop.height;
    ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
    return canvas.toDataURL("image/jpeg");
};

const aspectOptions = [
    { label: "Free",  value: null },
    { label: "1:1",   value: 1 },
    { label: "4:3",   value: 4 / 3 },
    { label: "16:9",  value: 16 / 9 },
    { label: "3:4",   value: 3 / 4 },
    { label: "9:16",  value: 9 / 16 },
];

const ImageCropper = () => {
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspect, setAspect] = useState(1);
    const [activeAspect, setActiveAspect] = useState("1:1");
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [result, setResult] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [processing, setProcessing] = useState(false);

    const loadFile = (file) => {
        if (!file || !file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = () => { setImage(reader.result); setResult(null); };
        reader.readAsDataURL(file);
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault(); setDragging(false); loadFile(e.dataTransfer.files[0]);
    }, []);

    const onCropComplete = useCallback((_, pixels) => setCroppedAreaPixels(pixels), []);

    const handleCrop = async () => {
        setProcessing(true);
        try {
            const cropped = await getCroppedImg(image, croppedAreaPixels);
            setResult(cropped);
        } finally { setProcessing(false); }
    };

    const downloadImage = () => {
        const link = document.createElement("a");
        link.download = "cropped-image.jpg"; link.href = result; link.click();
    };

    const selectAspect = (opt) => {
        setActiveAspect(opt.label);
        setAspect(opt.value);
    };

    return (
        <div className="tool-page">
            <div className="max-w-3xl mx-auto">
                <div className="tool-card">
                    <div className="tool-header">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <BiCrop className="text-3xl text-[var(--primary)]" />
                            <h1 className="text-3xl font-black">Image Cropper</h1>
                        </div>
                        <p>Crop images with custom aspect ratios and precision zoom</p>
                    </div>

                    <div className="tool-body space-y-5">
                        {!image ? (
                            <div className={`upload-zone ${dragging ? "dragging" : ""}`}
                                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}>
                                <input type="file" accept="image/*" onChange={e => loadFile(e.target.files[0])} />
                                <div className="upload-zone-icon"><BiCrop /></div>
                                <p className="font-semibold text-[var(--text-primary)]">Drop an image to crop</p>
                                <p className="text-sm text-[var(--text-muted)] mt-1">or click to browse</p>
                            </div>
                        ) : (
                            <>
                                {/* Remove bar */}
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-[var(--border)]">
                                    <span className="text-sm font-semibold flex items-center gap-2 text-[var(--text-primary)]">
                                        <BiImage className="text-[var(--primary)]" /> Image loaded
                                    </span>
                                    <button onClick={() => { setImage(null); setResult(null); }}
                                        className="text-xs text-red-400 hover:text-red-600 font-semibold">✕ Remove</button>
                                </div>

                                {/* Aspect ratio */}
                                <div>
                                    <label className="form-label mb-2">Aspect Ratio</label>
                                    <div className="flex flex-wrap gap-2">
                                        {aspectOptions.map(opt => (
                                            <button key={opt.label} onClick={() => selectAspect(opt)}
                                                className={`preset-btn ${activeAspect === opt.label ? "active" : ""}`}>
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Crop area */}
                                <div className="relative w-full h-72 sm:h-96 bg-slate-900 rounded-xl overflow-hidden border border-[var(--border)]">
                                    <Cropper
                                        image={image} crop={crop} zoom={zoom}
                                        aspect={aspect}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={onCropComplete}
                                    />
                                </div>

                                {/* Zoom */}
                                <div className="form-group">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="form-label mb-0">Zoom</label>
                                        <span className="badge badge-primary">{zoom.toFixed(1)}×</span>
                                    </div>
                                    <input type="range" min={1} max={3} step={0.05} value={zoom}
                                        onChange={e => setZoom(Number(e.target.value))} />
                                    <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                                        <span>1×</span><span>3×</span>
                                    </div>
                                </div>

                                <button onClick={handleCrop} disabled={processing} className="btn-primary py-3.5">
                                    {processing ? (
                                        <><span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin-slow" /> Processing…</>
                                    ) : (
                                        <><BiCrop /> Crop Image</>
                                    )}
                                </button>

                                {result && (
                                    <div className="animate-scale-in space-y-4">
                                        <div className="section-divider" />
                                        <div>
                                            <p className="form-label text-center mb-2">Cropped Result</p>
                                            <img src={result} alt="cropped" className="rounded-xl border-2 border-[var(--primary)] w-full object-contain max-h-64 mx-auto" />
                                        </div>
                                        <button onClick={downloadImage} className="btn-secondary">
                                            <BiDownload /> Download Cropped Image
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        <p className="text-xs text-center text-[var(--text-muted)]">
                            ✓ Client-side cropping — fast & secure
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;