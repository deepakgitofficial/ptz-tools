import React, { useState, useCallback } from "react";
import Tesseract from "tesseract.js";
import { BiText, BiCopy, BiDownload, BiImage } from "react-icons/bi";
import { FaSync } from "react-icons/fa";

const languages = [
    { label: "English",    code: "eng" },
    { label: "Hindi",      code: "hin" },
    { label: "French",     code: "fra" },
    { label: "German",     code: "deu" },
    { label: "Spanish",    code: "spa" },
    { label: "Arabic",     code: "ara" },
];

const ImageToTextOCR = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [lang, setLang] = useState("eng");
    const [dragging, setDragging] = useState(false);
    const [toast, setToast] = useState(false);

    const loadFile = (file) => {
        if (!file || !file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = () => { setImage(file); setPreview(reader.result); setText(""); setProgress(0); };
        reader.readAsDataURL(file);
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault(); setDragging(false); loadFile(e.dataTransfer.files[0]);
    }, []);

    const extractText = async () => {
        if (!image) return;
        setLoading(true); setText(""); setProgress(0);
        try {
            const result = await Tesseract.recognize(image, lang, {
                logger: (m) => {
                    if (m.status === "recognizing text") setProgress(Math.round(m.progress * 100));
                },
            });
            setText(result.data.text.trim());
        } catch (err) {
            setText("Error extracting text. Please try a clearer image.");
        } finally { setLoading(false); setProgress(100); }
    };

    const copyText = () => {
        navigator.clipboard.writeText(text);
        setToast(true);
        setTimeout(() => setToast(false), 2500);
    };

    const downloadText = () => {
        const blob = new Blob([text], { type: "text/plain" });
        const link = document.createElement("a");
        link.download = "extracted-text.txt"; link.href = URL.createObjectURL(blob); link.click();
    };

    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const charCount = text.length;

    return (
        <div className="tool-page">
            <div className="max-w-3xl mx-auto">
                <div className="tool-card">
                    <div className="tool-header">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <BiText className="text-3xl text-[var(--primary)]" />
                            <h1 className="text-3xl font-black">Image to Text OCR</h1>
                        </div>
                        <p>Extract text from any image — runs entirely in your browser</p>
                    </div>

                    <div className="tool-body space-y-5">
                        {!image ? (
                            <div className={`upload-zone ${dragging ? "dragging" : ""}`}
                                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}>
                                <input type="file" accept="image/*" onChange={e => loadFile(e.target.files[0])} />
                                <div className="upload-zone-icon"><BiText /></div>
                                <p className="font-semibold text-[var(--text-primary)]">Drop an image to extract text</p>
                                <p className="text-sm text-[var(--text-muted)] mt-1">or click to browse</p>
                                <p className="text-xs text-[var(--text-muted)] mt-2">Works best with clear, high-contrast text</p>
                            </div>
                        ) : (
                            <>
                                {/* Remove bar */}
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-[var(--border)]">
                                    <span className="text-sm font-semibold flex items-center gap-2 text-[var(--text-primary)]">
                                        <BiImage className="text-[var(--primary)]" /> Image loaded
                                    </span>
                                    <button onClick={() => { setImage(null); setPreview(null); setText(""); }}
                                        className="text-xs text-red-400 hover:text-red-600 font-semibold">✕ Remove</button>
                                </div>

                                {/* Language selector */}
                                <div>
                                    <label className="form-label mb-2">OCR Language</label>
                                    <div className="flex flex-wrap gap-2">
                                        {languages.map(l => (
                                            <button key={l.code} onClick={() => setLang(l.code)}
                                                className={`preset-btn ${lang === l.code ? "active" : ""}`}>
                                                {l.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Image preview */}
                                <div className="rounded-xl overflow-hidden border border-[var(--border)]">
                                    <img src={preview} alt="preview" className="w-full max-h-52 object-contain bg-slate-50" />
                                </div>

                                {/* Extract button */}
                                <button onClick={extractText} disabled={loading} className="btn-primary py-3.5">
                                    {loading ? (
                                        <><FaSync className="animate-spin-slow" /> Extracting… {progress}%</>
                                    ) : (
                                        <><BiText /> Extract Text</>
                                    )}
                                </button>

                                {/* Progress bar */}
                                {loading && (
                                    <div className="animate-fade-in">
                                        <div className="flex justify-between text-xs font-semibold mb-1.5">
                                            <span className="text-[var(--primary-dark)]">Processing image…</span>
                                            <span className="text-[var(--primary-dark)]">{progress}%</span>
                                        </div>
                                        <div className="progress-bar-track">
                                            <div className="progress-bar-fill transition-all duration-300" style={{ width: `${progress}%` }} />
                                        </div>
                                    </div>
                                )}

                                {/* Results */}
                                {text && !loading && (
                                    <div className="space-y-3 animate-slide-up">
                                        <div className="section-divider" />
                                        {/* Stats */}
                                        <div className="flex gap-3">
                                            <div className="result-card result-card-primary flex-1 text-center py-3">
                                                <p className="result-label text-center">Words</p>
                                                <p className="font-bold text-lg text-[var(--primary-dark)]">{wordCount.toLocaleString()}</p>
                                            </div>
                                            <div className="result-card result-card-info flex-1 text-center py-3">
                                                <p className="result-label text-center">Characters</p>
                                                <p className="font-bold text-lg text-[var(--info)]">{charCount.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {/* Text area */}
                                        <div>
                                            <label className="form-label mb-2">Extracted Text</label>
                                            <textarea
                                                value={text}
                                                onChange={e => setText(e.target.value)}
                                                rows={8}
                                                className="form-input resize-y font-mono text-sm leading-relaxed"
                                                placeholder="Extracted text will appear here…"
                                            />
                                            <p className="text-xs text-[var(--text-muted)] mt-1">You can edit the text above before copying</p>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <button onClick={copyText} className="btn-primary">
                                                <BiCopy /> Copy Text
                                            </button>
                                            <button onClick={downloadText} className="btn-secondary">
                                                <BiDownload /> Download .txt
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <p className="text-xs text-center text-[var(--text-muted)]">
                            ✓ OCR runs in-browser via Tesseract.js — no server upload required
                        </p>
                    </div>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className="toast animate-slide-up">
                    ✓ Text copied to clipboard!
                </div>
            )}
        </div>
    );
};

export default ImageToTextOCR;