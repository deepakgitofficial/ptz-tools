import React, { useState } from "react";
import { FaRulerCombined } from "react-icons/fa";
import { BiInfoCircle, BiCalculator } from "react-icons/bi";

const conversions = [
    { label: "Square Feet", key: "sqFt",   factor: 1 },
    { label: "Square Meter",key: "sqM",    factor: 0.0929 },
    { label: "Gaj",         key: "gaj",    factor: 1 / 9 },
    { label: "Acre",        key: "acre",   factor: 1 / 43560 },
    { label: "Hectare",     key: "ha",     factor: 1 / 107639 },
    { label: "Bigha (N.)",  key: "bigha",  factor: 1 / 27000 },
];

const IrregularLandAreaCalculator = () => {
    const [sides, setSides] = useState({ a: 50, b: 60, c: 55, d: 65 });
    const [useAdvanced, setUseAdvanced] = useState(false);
    const [diagonal, setDiagonal] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const setSide = (key, val) => setSides(prev => ({ ...prev, [key]: val }));

    const calculateBasic = () => {
        const { a, b, c, d } = sides;
        const [A, B, C, D] = [a, b, c, d].map(Number);
        const s = (A + B + C + D) / 2;
        const area = Math.sqrt((s - A) * (s - B) * (s - C) * (s - D));
        return isNaN(area) ? null : area;
    };

    const calculateAdvanced = () => {
        const { a, b, c, d } = sides;
        const [A, B, C, D, diag] = [a, b, c, d, diagonal].map(Number);
        if (!diag) return null;
        const s1 = (A + B + diag) / 2;
        const area1 = Math.sqrt(s1 * (s1 - A) * (s1 - B) * (s1 - diag));
        const s2 = (C + D + diag) / 2;
        const area2 = Math.sqrt(s2 * (s2 - C) * (s2 - D) * (s2 - diag));
        return isNaN(area1 + area2) ? null : area1 + area2;
    };

    const handleCalculate = () => {
        setError("");
        const area = useAdvanced ? calculateAdvanced() : calculateBasic();
        if (!area || area <= 0) {
            setError("Invalid sides — check that they can form a valid quadrilateral.");
            setResult(null);
            return;
        }
        const res = {};
        conversions.forEach(c => { res[c.key] = (area * c.factor).toFixed(3); });
        setResult(res);
    };

    const sideLabels = [
        { key: "a", label: "Side A (North)", color: "border-blue-400" },
        { key: "b", label: "Side B (East)",  color: "border-emerald-400" },
        { key: "c", label: "Side C (South)", color: "border-amber-400" },
        { key: "d", label: "Side D (West)",  color: "border-purple-400" },
    ];

    return (
        <div className="tool-page">
            <div className="max-w-2xl mx-auto">
                <div className="tool-card">
                    <div className="tool-header">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <FaRulerCombined className="text-3xl text-[var(--primary)]" />
                            <h1 className="text-3xl font-black">Land Area Calculator</h1>
                        </div>
                        <p>Calculate irregular quadrilateral land area in multiple units</p>
                    </div>

                    <div className="tool-body space-y-5">
                        {/* Side inputs */}
                        <div>
                            <label className="form-label mb-3">Enter All 4 Side Lengths (in feet)</label>
                            <div className="grid grid-cols-2 gap-3">
                                {sideLabels.map(({ key, label, color }) => (
                                    <div key={key}>
                                        <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">{label}</label>
                                        <input type="number" value={sides[key]}
                                            onChange={e => setSide(key, e.target.value)}
                                            className={`form-input border-l-4 ${color}`}
                                            placeholder={`Side ${key.toUpperCase()} (ft)`} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Advanced toggle */}
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-[var(--border)]">
                            <div>
                                <p className="text-sm font-semibold text-[var(--text-primary)]">Advanced Mode (Diagonal)</p>
                                <p className="text-xs text-[var(--text-muted)]">More accurate using Heron's formula</p>
                            </div>
                            <input type="checkbox" checked={useAdvanced}
                                onChange={() => setUseAdvanced(p => !p)}
                                className="toggle-checkbox" />
                        </div>

                        {useAdvanced && (
                            <div className="form-group animate-slide-up">
                                <label className="form-label">Diagonal Length (ft)</label>
                                <input type="number" value={diagonal}
                                    onChange={e => setDiagonal(e.target.value)}
                                    className="form-input" placeholder="Enter diagonal measurement" />
                            </div>
                        )}

                        {error && (
                            <div className="info-box warning">
                                <BiInfoCircle className="flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button onClick={handleCalculate} className="btn-primary py-3.5 text-base">
                            <BiCalculator /> Calculate Area
                        </button>

                        {/* Results */}
                        {result && (
                            <div className="animate-slide-up space-y-3">
                                <div className="section-divider" />
                                <h3 className="font-bold text-[var(--text-primary)]">Area in Different Units</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {conversions.map(({ label, key }, i) => (
                                        <div key={key} className={`result-card ${i === 0 ? 'result-card-primary col-span-2' : 'result-card-info'}`}>
                                            <p className="result-label">{label}</p>
                                            <p className="result-value" style={{ fontSize: i === 0 ? '1.75rem' : '1.2rem', color: i === 0 ? 'var(--primary-dark)' : 'var(--info)' }}>
                                                {Number(result[key]).toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="info-box primary">
                            <BiInfoCircle className="flex-shrink-0 mt-0.5" />
                            <span>Basic mode uses Brahmagupta's formula (approximate for cyclic quadrilaterals). Enable Advanced mode with a diagonal for more accuracy.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IrregularLandAreaCalculator;