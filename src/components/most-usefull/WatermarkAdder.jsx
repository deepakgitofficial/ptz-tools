import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Canvas, FabricImage, Textbox } from "fabric";
import {
    BiDownload,
    BiImageAdd,
    BiText,
    BiTrash,
} from "react-icons/bi";

const WatermarkAdder = () => {
    const canvasRef = useRef(null);
    const fabricRef = useRef(null);

    const [watermarkText, setWatermarkText] =
        useState("Your Brand");
    const [fontSize, setFontSize] = useState(36);
    const [opacity, setOpacity] = useState(0.5);
    const [color, setColor] = useState("#ffffff");
    const [imageLoaded, setImageLoaded] = useState(false);

    // ---------- Init Canvas ----------
    useEffect(() => {
        const canvas = new Canvas(canvasRef.current, {
            width: 900,
            height: 500,
            backgroundColor: "#f8fafc",
        });

        fabricRef.current = canvas;

        return () => {
            canvas.dispose();
        };
    }, []);

    // ---------- Upload Image ----------
    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];

        if (!file) return;

        const url = URL.createObjectURL(file);

        const img = await FabricImage.fromURL(url);

        const canvas = fabricRef.current;

        canvas.clear();

        const canvasWidth = 900;
        const canvasHeight = 500;

        const scale = Math.min(
            canvasWidth / img.width,
            canvasHeight / img.height
        );

        img.scale(scale);

        img.set({
            left: canvasWidth / 2,
            top: canvasHeight / 2,
            originX: "center",
            originY: "center",
            selectable: false,
        });

        canvas.add(img);
        canvas.sendObjectToBack(img);

        setImageLoaded(true);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [],
        },
    });

    // ---------- Add Text Watermark ----------
    const addTextWatermark = () => {
        const canvas = fabricRef.current;

        const text = new Textbox(watermarkText, {
            left: 200,
            top: 200,
            fontSize,
            fill: color,
            opacity,
            fontWeight: "bold",
            editable: true,
            cornerStyle: "circle",
            transparentCorners: false,
        });

        canvas.add(text);
        canvas.setActiveObject(text);
    };

    // ---------- Remove Selected ----------
    const removeSelected = () => {
        const canvas = fabricRef.current;

        const active = canvas.getActiveObject();

        if (active) {
            canvas.remove(active);
        }
    };

    // ---------- Download ----------
    const downloadImage = () => {
        const canvas = fabricRef.current;

        const dataURL = canvas.toDataURL({
            format: "png",
            quality: 1,
        });

        const link = document.createElement("a");

        link.href = dataURL;
        link.download = "watermarked-image.png";

        link.click();
    };

    return (
        <div className="tool-page">
            <div className="max-w-7xl mx-auto">

                <div className="tool-card overflow-hidden">

                    {/* Header */}
                    <div className="tool-header text-center">

                        <h1 className="text-4xl font-black">
                            Watermark Adder
                        </h1>

                        <p className="text-[var(--text-muted)]">
                            Add stylish text watermarks to your images
                        </p>

                    </div>

                    {/* Body */}
                    <div className="tool-body space-y-8">

                        {/* Top Layout */}
                        <div className="grid lg:grid-cols-3 gap-8">

                            {/* Controls */}
                            <div className="space-y-5">

                                {/* Upload */}
                                <div
                                    {...getRootProps()}
                                    className="border-2 border-dashed border-[var(--border-color)] rounded-3xl p-8 text-center cursor-pointer hover:border-[var(--primary)] transition-all bg-[var(--background)]"
                                >

                                    <input {...getInputProps()} />

                                    <BiImageAdd className="mx-auto text-5xl text-[var(--primary)] mb-4" />

                                    <p className="font-semibold">
                                        Drag & Drop Image
                                    </p>

                                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                                        or click to upload
                                    </p>

                                </div>

                                {/* Watermark Text */}
                                <div className="result-card p-5">

                                    <label className="result-label mb-2 block">
                                        Watermark Text
                                    </label>

                                    <input
                                        type="text"
                                        value={watermarkText}
                                        onChange={(e) =>
                                            setWatermarkText(e.target.value)
                                        }
                                        className="form-input"
                                    />

                                </div>

                                {/* Font Size */}
                                <div className="result-card p-5">

                                    <label className="result-label mb-2 block">
                                        Font Size ({fontSize}px)
                                    </label>

                                    <input
                                        type="range"
                                        min="12"
                                        max="120"
                                        value={fontSize}
                                        onChange={(e) =>
                                            setFontSize(Number(e.target.value))
                                        }
                                        className="w-full"
                                    />

                                </div>

                                {/* Opacity */}
                                <div className="result-card p-5">

                                    <label className="result-label mb-2 block">
                                        Opacity ({Math.round(opacity * 100)}%)
                                    </label>

                                    <input
                                        type="range"
                                        min="0.1"
                                        max="1"
                                        step="0.1"
                                        value={opacity}
                                        onChange={(e) =>
                                            setOpacity(Number(e.target.value))
                                        }
                                        className="w-full"
                                    />

                                </div>

                                {/* Color */}
                                <div className="result-card p-5">

                                    <label className="result-label mb-3 block">
                                        Text Colour
                                    </label>

                                    <input
                                        type="color"
                                        value={color}
                                        onChange={(e) =>
                                            setColor(e.target.value)
                                        }
                                        className="w-full h-14 border rounded-xl cursor-pointer"
                                    />

                                </div>

                                {/* Buttons */}
                                <div className="grid grid-cols-2 gap-3">

                                    <button
                                        onClick={addTextWatermark}
                                        disabled={!imageLoaded}
                                        className="btn-primary"
                                    >
                                        <BiText />
                                        Add Text
                                    </button>

                                    <button
                                        onClick={removeSelected}
                                        className="btn-secondary"
                                    >
                                        <BiTrash />
                                        Remove
                                    </button>

                                </div>

                                <button
                                    onClick={downloadImage}
                                    disabled={!imageLoaded}
                                    className="btn-primary w-full"
                                >
                                    <BiDownload />
                                    Download Image
                                </button>

                            </div>

                            {/* Canvas */}
                            <div className="lg:col-span-2">

                                <div className="bg-white rounded-[2rem] border shadow-xl p-5 overflow-auto">

                                    <canvas
                                        ref={canvasRef}
                                        className="rounded-2xl border max-w-full"
                                    />

                                </div>


                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default WatermarkAdder;