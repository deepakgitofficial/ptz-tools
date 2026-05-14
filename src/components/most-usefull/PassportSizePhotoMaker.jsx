import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import {
    BiUpload,
    BiDownload,
    BiCrop,
    BiRefresh,
    BiImage,
} from "react-icons/bi";

// -----------------------------
// PRESETS
// -----------------------------
// const PHOTO_PRESETS = [
//     {
//         name: "SSC Form Photo",
//         width: 120,
//         height: 160,
//         ratio: 120 / 160,
//         note: "20KB – 50KB",
//     },
//     {
//         name: "Railway Form Photo",
//         width: 150,
//         height: 200,
//         ratio: 150 / 200,
//         note: "JPEG/JPG",
//     },
//     {
//         name: "UPSC Photo Size",
//         width: 140,
//         height: 180,
//         ratio: 140 / 180,
//         note: "Civil Services",
//     },
//     {
//         name: "NEET/JEE Application",
//         width: 200,
//         height: 230,
//         ratio: 200 / 230,
//         note: "Medical/Engineering",
//     },
//     {
//         name: "CUET Form Photo",
//         width: 200,
//         height: 230,
//         ratio: 200 / 230,
//         note: "University Entrance",
//     },
//     {
//         name: "Passport Office Photo",
//         width: 413,
//         height: 531,
//         ratio: 413 / 531,
//         note: "35mm × 45mm",
//     },
//     {
//         name: "Driving License Photo",
//         width: 200,
//         height: 230,
//         ratio: 200 / 230,
//         note: "Transport Department",
//     },
//     {
//         name: "Voter ID Photo",
//         width: 200,
//         height: 230,
//         ratio: 200 / 230,
//         note: "Election Form",
//     },
//     {
//         name: "Government Job Application",
//         width: 120,
//         height: 160,
//         ratio: 120 / 160,
//         note: "General Recruitment",
//     },
// ];
// -----------------------------
// PRESETS
// -----------------------------
const PHOTO_PRESETS = [
    {
        name: "SSC Form Photo",
        width: 120,
        height: 160,
        ratio: 120 / 160,
        note: "20KB – 50KB",
    },
    {
        name: "Railway Form Photo",
        width: 150,
        height: 200,
        ratio: 150 / 200,
        note: "JPEG/JPG",
    },
    {
        name: "UPSC Photo Size",
        width: 140,
        height: 180,
        ratio: 140 / 180,
        note: "Civil Services",
    },
    {
        name: "NEET/JEE Application",
        width: 200,
        height: 230,
        ratio: 200 / 230,
        note: "Medical/Engineering",
    },
    {
        name: "CUET Form Photo",
        width: 200,
        height: 230,
        ratio: 200 / 230,
        note: "University Entrance",
    },
    {
        name: "Passport Office Photo",
        width: 413,
        height: 531,
        ratio: 413 / 531,
        note: "35mm × 45mm",
    },
    {
        name: "Driving License Photo",
        width: 200,
        height: 230,
        ratio: 200 / 230,
        note: "Transport Department",
    },
    {
        name: "Voter ID Photo",
        width: 200,
        height: 230,
        ratio: 200 / 230,
        note: "Election Form",
    },
    {
        name: "Government Job Application",
        width: 120,
        height: 160,
        ratio: 120 / 160,
        note: "General Recruitment",
    },

    // -----------------------------
    // MORE USEFUL PRESETS
    // -----------------------------
    {
        name: "Aadhaar Card Photo",
        width: 200,
        height: 230,
        ratio: 200 / 230,
        note: "UIDAI Application",
    },
    {
        name: "PAN Card Photo",
        width: 213,
        height: 213,
        ratio: 1,
        note: "NSDL/UTI",
    },
    {
        name: "Police Verification Photo",
        width: 150,
        height: 200,
        ratio: 150 / 200,
        note: "Verification Form",
    },
    {
        name: "Scholarship Form Photo",
        width: 120,
        height: 160,
        ratio: 120 / 160,
        note: "Student Application",
    },
    {
        name: "NDA/CDS Form Photo",
        width: 140,
        height: 180,
        ratio: 140 / 180,
        note: "Defence Exam",
    },
    {
        name: "Bank Exam Photo",
        width: 200,
        height: 230,
        ratio: 200 / 230,
        note: "IBPS/SBI/RRB",
    },
    {
        name: "State PSC Photo",
        width: 140,
        height: 180,
        ratio: 140 / 180,
        note: "Public Service Commission",
    },
    {
        name: "Teacher Recruitment Photo",
        width: 150,
        height: 200,
        ratio: 150 / 200,
        note: "TET/DSSSB/KVS",
    },
    {
        name: "ESIC Form Photo",
        width: 120,
        height: 160,
        ratio: 120 / 160,
        note: "Insurance Application",
    },
    {
        name: "Army Rally Photo",
        width: 150,
        height: 200,
        ratio: 150 / 200,
        note: "Army Bharti",
    },
    {
        name: "Visa Application Photo",
        width: 600,
        height: 600,
        ratio: 1,
        note: "Embassy Standard",
    },
    {
        name: "OCI Card Photo",
        width: 200,
        height: 200,
        ratio: 1,
        note: "Overseas Citizen",
    },
    {
        name: "Employment Exchange Photo",
        width: 120,
        height: 160,
        ratio: 120 / 160,
        note: "Job Registration",
    },
    {
        name: "University Admission Photo",
        width: 200,
        height: 230,
        ratio: 200 / 230,
        note: "College Admission",
    },
    {
        name: "Internship Application Photo",
        width: 150,
        height: 200,
        ratio: 150 / 200,
        note: "Professional Profile",
    },
    {
        name: "Resume/CV Photo",
        width: 300,
        height: 400,
        ratio: 300 / 400,
        note: "Professional Use",
    },
    {
        name: "LinkedIn Profile Photo",
        width: 400,
        height: 400,
        ratio: 1,
        note: "Social Profile",
    },
    {
        name: "Employee ID Card Photo",
        width: 300,
        height: 400,
        ratio: 300 / 400,
        note: "Office ID",
    },
    {
        name: "School ID Card Photo",
        width: 300,
        height: 400,
        ratio: 300 / 400,
        note: "Student ID",
    },
    {
        name: "Hostel Admission Photo",
        width: 150,
        height: 200,
        ratio: 150 / 200,
        note: "Hostel Registration",
    },
    {
        name: "Ration Card Photo",
        width: 200,
        height: 230,
        ratio: 200 / 230,
        note: "Food Department",
    },
    {
        name: "Marriage Certificate Photo",
        width: 200,
        height: 230,
        ratio: 200 / 230,
        note: "Legal Documents",
    },
    {
        name: "Income Certificate Photo",
        width: 120,
        height: 160,
        ratio: 120 / 160,
        note: "Government Certificate",
    },
    {
        name: "Caste Certificate Photo",
        width: 120,
        height: 160,
        ratio: 120 / 160,
        note: "Reservation Certificate",
    },
    {
        name: "EWS Certificate Photo",
        width: 120,
        height: 160,
        ratio: 120 / 160,
        note: "Economically Weaker Section",
    },
];

// -----------------------------
// CREATE CROPPED IMAGE
// -----------------------------
const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", reject);
        image.src = url;
    });

const getCroppedImg = async (
    imageSrc,
    pixelCrop,
    outputWidth,
    outputHeight
) => {
    const image = await createImage(imageSrc);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        outputWidth,
        outputHeight
    );

    return canvas.toDataURL("image/jpeg", 1);
};

const PassportSizePhotoMaker = () => {
    const [image, setImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const [croppedAreaPixels, setCroppedAreaPixels] =
        useState(null);

    const [selectedPreset, setSelectedPreset] = useState(
        PHOTO_PRESETS[0]
    );

    // -----------------------------
    // DROPZONE
    // -----------------------------
    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            setImage(reader.result);
            setCroppedImage(null);
        };

        reader.readAsDataURL(file);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [],
        },
        multiple: false,
    });

    // -----------------------------
    // CROP COMPLETE
    // -----------------------------
    const onCropComplete = useCallback(
        (_, croppedAreaPixels) => {
            setCroppedAreaPixels(croppedAreaPixels);
        },
        []
    );

    // -----------------------------
    // GENERATE PHOTO
    // -----------------------------
    const generatePassportPhoto = async () => {
        if (!image || !croppedAreaPixels) return;

        const cropped = await getCroppedImg(
            image,
            croppedAreaPixels,
            selectedPreset.width,
            selectedPreset.height
        );

        setCroppedImage(cropped);
    };

    // -----------------------------
    // DOWNLOAD
    // -----------------------------
    const downloadImage = () => {
        if (!croppedImage) return;

        const link = document.createElement("a");

        link.href = croppedImage;
        link.download = `${selectedPreset.name}.jpg`;

        link.click();
    };

    return (
        <div className="tool-page">
            <div className="max-w-7xl mx-auto">

                <div className="tool-card overflow-hidden">

                    {/* HEADER */}
                    <div className="tool-header text-center">

                        <div className="flex justify-center items-center gap-3 mb-3">
                            <BiImage className="text-4xl text-[var(--primary)]" />

                            <h1 className="text-4xl font-black">
                                Passport Size Photo Maker
                            </h1>
                        </div>

                        <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
                            Create passport-size photos for government forms,
                            exams, recruitment portals, ID cards, and official
                            applications instantly.
                        </p>

                    </div>

                    {/* BODY */}
                    <div className="tool-body space-y-8">

                        <div className="grid lg:grid-cols-3 gap-8">

                            {/* LEFT PANEL */}
                            <div className="space-y-6">

                                {/* Upload */}
                                <div
                                    {...getRootProps()}
                                    className="border-2 border-dashed border-[var(--border-color)] rounded-[2rem] p-8 text-center cursor-pointer hover:border-[var(--primary)] transition-all bg-[var(--background)]"
                                >

                                    <input {...getInputProps()} />

                                    <BiUpload className="mx-auto text-5xl text-[var(--primary)] mb-4" />

                                    <h3 className="font-bold text-lg">
                                        Upload Photo
                                    </h3>

                                    <p className="text-sm text-[var(--text-secondary)] mt-2">
                                        Drag & drop or click to upload image
                                    </p>

                                </div>

                                {/* Presets */}
                                <div className="result-card p-5">

                                    <div className="flex items-center gap-2 mb-4">
                                        <BiCrop className="text-xl text-[var(--primary)]" />

                                        <h2 className="font-bold text-lg">
                                            Photo Size Presets
                                        </h2>
                                    </div>

                                    <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">

                                        {PHOTO_PRESETS.map((preset, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedPreset(preset)}
                                                className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedPreset.name === preset.name
                                                    ? "bg-[var(--primary)] text-white border-transparent"
                                                    : "hover:border-[var(--primary)]"
                                                    }`}
                                            >

                                                <div className="flex justify-between items-center">

                                                    <div>
                                                        <p className="font-bold">
                                                            {preset.name}
                                                        </p>

                                                        <p className="text-xs opacity-80 mt-1">
                                                            {preset.width} × {preset.height}px
                                                        </p>
                                                    </div>

                                                    <span className="text-xs opacity-70">
                                                        {preset.note}
                                                    </span>

                                                </div>

                                            </button>
                                        ))}

                                    </div>

                                </div>

                                {/* Zoom */}
                                {image && (
                                    <div className="result-card p-5">

                                        <div className="flex justify-between mb-2">
                                            <label className="font-semibold">
                                                Zoom
                                            </label>

                                            <span>{zoom.toFixed(1)}x</span>
                                        </div>

                                        <input
                                            type="range"
                                            min={1}
                                            max={3}
                                            step={0.1}
                                            value={zoom}
                                            onChange={(e) =>
                                                setZoom(Number(e.target.value))
                                            }
                                            className="w-full"
                                        />

                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="grid grid-cols-2 gap-3">

                                    <button
                                        onClick={generatePassportPhoto}
                                        disabled={!image}
                                        className="btn-primary"
                                    >
                                        <BiCrop />
                                        Generate
                                    </button>

                                    <button
                                        onClick={() => {
                                            setImage(null);
                                            setCroppedImage(null);
                                        }}
                                        className="btn-secondary"
                                    >
                                        <BiRefresh />
                                        Reset
                                    </button>

                                </div>

                                <button
                                    onClick={downloadImage}
                                    disabled={!croppedImage}
                                    className="btn-primary w-full"
                                >
                                    <BiDownload />
                                    Download Photo
                                </button>

                            </div>

                            {/* RIGHT */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Crop Area */}
                                <div className="result-card p-5">

                                    <h2 className="font-bold text-xl mb-4">
                                        Crop & Position Photo
                                    </h2>

                                    <div className="relative h-[500px] rounded-[2rem] overflow-hidden bg-slate-100">

                                        {image ? (
                                            <Cropper
                                                image={image}
                                                crop={crop}
                                                zoom={zoom}
                                                aspect={selectedPreset.ratio}
                                                onCropChange={setCrop}
                                                onZoomChange={setZoom}
                                                onCropComplete={onCropComplete}
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">

                                                <div className="text-center">
                                                    <BiImage className="mx-auto text-6xl text-slate-300 mb-3" />

                                                    <p className="text-[var(--text-secondary)]">
                                                        Upload an image to start editing
                                                    </p>
                                                </div>

                                            </div>
                                        )}

                                    </div>

                                </div>

                                {/* Preview */}
                                <div className="result-card p-5">

                                    <div className="flex justify-between items-center mb-5">

                                        <div>
                                            <h2 className="font-bold text-xl">
                                                Passport Photo Preview
                                            </h2>

                                            <p className="text-sm text-[var(--text-secondary)]">
                                                {selectedPreset.width} ×{" "}
                                                {selectedPreset.height}px
                                            </p>
                                        </div>

                                    </div>

                                    <div className="flex justify-center">

                                        <div className="bg-slate-100 p-6 rounded-[2rem] border">

                                            {croppedImage ? (
                                                <img
                                                    src={croppedImage}
                                                    alt="Passport Preview"
                                                    className="rounded-xl shadow-lg border"
                                                    style={{
                                                        width:
                                                            selectedPreset.width > 220
                                                                ? "220px"
                                                                : selectedPreset.width,
                                                        height: "auto",
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-[220px] h-[280px] flex items-center justify-center rounded-xl border-2 border-dashed text-center text-sm text-[var(--text-secondary)]">
                                                    Preview will appear here
                                                </div>
                                            )}

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* FOOTER */}
                        <p className="text-xs text-center text-[var(--text-muted)]">
                            ✨ Optimised for Indian government forms, exams,
                            recruitment portals, and official applications.
                        </p>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default PassportSizePhotoMaker;