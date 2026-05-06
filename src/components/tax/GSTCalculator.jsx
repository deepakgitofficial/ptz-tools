import React, { useState } from "react";
import { BiMoney, BiCalculator, BiTrendingUp } from "react-icons/bi";
import { FaRupeeSign } from "react-icons/fa";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (v) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency", currency: "INR", maximumFractionDigits: 0,
    }).format(v);

// ─── PPF Calculator ──────────────────────────────────────────────────────────
export default function PPFCalculator() {
    const [yearlyInvestment, setYearlyInvestment] = useState(150000);
    const [interestRate, setInterestRate] = useState(7.1);
    const [years, setYears] = useState(15);

    const calculate = () => {
        let balance = 0, totalInvested = 0;
        for (let i = 0; i < Number(years); i++) {
            totalInvested += Number(yearlyInvestment);
            balance = (balance + Number(yearlyInvestment)) * (1 + interestRate / 100);
        }
        return {
            totalInvested,
            maturityAmount: Math.round(balance),
            interestEarned: Math.round(balance - totalInvested),
        };
    };

    const r = calculate();
    const gainPercent = r.totalInvested > 0 ? Math.round((r.interestEarned / r.totalInvested) * 100) : 0;

    return (
        <div className="tool-page">
            <div className="max-w-2xl mx-auto">
                <div className="tool-card">
                    <div className="tool-header">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <BiMoney className="text-3xl text-[var(--primary)]" />
                            <h1 className="text-3xl font-black">PPF Calculator</h1>
                        </div>
                        <p>Calculate your Public Provident Fund maturity with compound interest</p>
                    </div>

                    <div className="tool-body space-y-5">
                        {/* Inputs */}
                        <div className="form-group">
                            <label className="form-label">Yearly Investment (₹)</label>
                            <input type="number" value={yearlyInvestment} onChange={e => setYearlyInvestment(e.target.value)}
                                className="form-input" min={500} max={150000} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label">Interest Rate (%)</label>
                                <input type="number" step="0.1" value={interestRate} onChange={e => setInterestRate(e.target.value)}
                                    className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Time Period (Years)</label>
                                <input type="number" value={years} onChange={e => setYears(e.target.value)}
                                    className="form-input" min={1} max={50} />
                            </div>
                        </div>

                        <div className="section-divider" />

                        {/* Results */}
                        <div className="grid grid-cols-1 gap-3 animate-slide-up">
                            <div className="result-card result-card-info">
                                <p className="result-label flex items-center gap-1"><FaRupeeSign /> Total Invested</p>
                                <p className="result-value" style={{ fontSize: '1.5rem' }}>{fmt(r.totalInvested)}</p>
                            </div>
                            <div className="result-card result-card-success">
                                <p className="result-label flex items-center gap-1"><BiTrendingUp /> Interest Earned
                                    <span className="badge badge-success ml-2">+{gainPercent}% gain</span>
                                </p>
                                <p className="result-value success" style={{ fontSize: '1.5rem' }}>{fmt(r.interestEarned)}</p>
                            </div>
                            <div className="result-card result-card-primary">
                                <p className="result-label flex items-center gap-1"><BiMoney /> Maturity Amount</p>
                                <p className="result-value primary">{fmt(r.maturityAmount)}</p>
                            </div>
                        </div>

                        {/* Growth bar */}
                        <div>
                            <div className="flex justify-between text-xs font-semibold mb-1.5">
                                <span className="text-[var(--info)]">Invested {100 - gainPercent < 100 ? Math.round((r.totalInvested / r.maturityAmount) * 100) : 100}%</span>
                                <span className="text-[var(--success)]">Growth {Math.round((r.interestEarned / r.maturityAmount) * 100)}%</span>
                            </div>
                            <div className="h-3 rounded-full overflow-hidden bg-[var(--success-light)]">
                                <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 transition-all duration-700"
                                    style={{ width: `${Math.round((r.totalInvested / r.maturityAmount) * 100)}%` }} />
                            </div>
                        </div>

                        <div className="info-box primary">
                            <BiMoney className="flex-shrink-0 mt-0.5" />
                            <span>Calculation based on yearly compounding. Current PPF rate is 7.1% p.a. as set by Government of India.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── GST Calculator (Basic) ──────────────────────────────────────────────────
export function GSTCalculator() {
    const [amount, setAmount] = useState(1000);
    const [gstRate, setGstRate] = useState(18);
    const [type, setType] = useState("exclusive");
    const calc = () => {
        const amt = Number(amount), rate = Number(gstRate);
        if (type === "exclusive") {
            const gst = (amt * rate) / 100;
            return { baseAmount: amt, gstAmount: Math.round(gst), totalAmount: Math.round(amt + gst) };
        } else {
            const gst = amt - amt / (1 + rate / 100);
            return { baseAmount: Math.round(amt - gst), gstAmount: Math.round(gst), totalAmount: amt };
        }
    };
    const r = calc();
    return (
        <div className="tool-page">
            <div className="max-w-xl mx-auto">
                <div className="tool-card">
                    <div className="tool-header">
                        <h2 className="text-2xl font-black">GST Calculator</h2>
                        <p>Inclusive & exclusive GST breakdowns</p>
                    </div>
                    <div className="tool-body space-y-4">
                        <div className="form-group"><label className="form-label">Amount (₹)</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="form-input" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group"><label className="form-label">GST Rate (%)</label>
                                <input type="number" value={gstRate} onChange={e => setGstRate(e.target.value)} className="form-input" /></div>
                            <div className="form-group"><label className="form-label">Type</label>
                                <select value={type} onChange={e => setType(e.target.value)} className="form-input select">
                                    <option value="exclusive">Exclusive</option>
                                    <option value="inclusive">Inclusive</option>
                                </select></div>
                        </div>
                        <div className="space-y-3 animate-slide-up">
                            <div className="result-card result-card-info"><p className="result-label">Base Amount</p><p className="result-value" style={{ fontSize: '1.3rem', color: 'var(--info)' }}>{fmt(r.baseAmount)}</p></div>
                            <div className="result-card result-card-warning"><p className="result-label">GST Amount</p><p className="result-value" style={{ fontSize: '1.3rem', color: 'var(--warning)' }}>{fmt(r.gstAmount)}</p></div>
                            <div className="result-card result-card-primary"><p className="result-label">Total Amount</p><p className="result-value primary" style={{ fontSize: '1.5rem' }}>{fmt(r.totalAmount)}</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Advanced GST Calculator ─────────────────────────────────────────────────
export function GSTCalculatorAdvanced() {
    const [amount, setAmount] = useState(1000);
    const [gstRate, setGstRate] = useState(18);
    const [customRate, setCustomRate] = useState("");
    const [type, setType] = useState("exclusive");
    const [result, setResult] = useState(null);
    const presets = [3, 5, 12, 18, 28];

    const calculateGST = () => {
        const amt = Number(amount), rate = Number(gstRate);
        let gstAmount, totalAmount, baseAmount;
        if (type === "exclusive") {
            gstAmount = (amt * rate) / 100;
            totalAmount = amt + gstAmount;
            baseAmount = amt;
        } else {
            gstAmount = amt - amt / (1 + rate / 100);
            totalAmount = amt;
            baseAmount = amt - gstAmount;
        }
        setResult({
            gstAmount: Math.round(gstAmount),
            totalAmount: Math.round(totalAmount),
            baseAmount: Math.round(baseAmount),
            cgst: Math.round(gstAmount / 2),
            sgst: Math.round(gstAmount / 2),
        });
    };

    return (
        <div className="tool-page">
            <div className="max-w-xl mx-auto">
                <div className="tool-card">
                    <div className="tool-header">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <BiCalculator className="text-3xl text-[var(--primary)]" />
                            <h1 className="text-3xl font-black">GST Calculator</h1>
                        </div>
                        <p>Calculate GST with preset rates or custom percentage</p>
                    </div>

                    <div className="tool-body space-y-4">
                        {/* Amount */}
                        <div className="form-group">
                            <label className="form-label">Amount (₹)</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="form-input" placeholder="Enter amount" />
                        </div>

                        {/* GST Type */}
                        <div className="grid grid-cols-2 gap-2">
                            {["exclusive", "inclusive"].map(t => (
                                <button key={t} onClick={() => setType(t)}
                                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${type === t ? 'bg-[var(--primary)] text-slate-900 border-transparent shadow-sm' : 'bg-white border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)]'}`}>
                                    {t === "exclusive" ? "Exclusive GST" : "Inclusive GST"}
                                </button>
                            ))}
                        </div>

                        {/* Preset rates */}
                        <div>
                            <label className="form-label">Select GST Rate</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {presets.map(rate => (
                                    <button key={rate} onClick={() => setGstRate(rate)}
                                        className={`preset-btn ${gstRate === rate ? 'active' : ''}`}>
                                        {rate}%
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom rate */}
                        <div className="flex gap-2">
                            <input type="number" value={customRate} onChange={e => setCustomRate(e.target.value)}
                                className="form-input" placeholder="Custom rate %" />
                            <button onClick={() => customRate && setGstRate(Number(customRate))}
                                className="btn-ghost whitespace-nowrap" style={{ width: 'auto', padding: '0 1.25rem' }}>
                                Apply
                            </button>
                        </div>

                        {/* Selected rate display */}
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 rounded-xl border border-[var(--border)]">
                            <span className="text-sm text-[var(--text-secondary)]">Selected GST Rate</span>
                            <span className="badge badge-primary text-base px-3 py-1">{gstRate}%</span>
                        </div>

                        {/* Calculate */}
                        <button onClick={calculateGST} className="btn-primary py-3.5 text-base">
                            <BiCalculator /> Calculate GST
                        </button>

                        {/* Results */}
                        {result && (
                            <div className="space-y-3 animate-slide-up">
                                <div className="section-divider" />
                                <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                                    <BiTrendingUp className="text-[var(--primary)]" /> Results
                                </h3>
                                <div className="result-card result-card-info">
                                    <p className="result-label">Base Amount</p>
                                    <p className="result-value" style={{ fontSize: '1.3rem', color: 'var(--info)' }}>{fmt(result.baseAmount)}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="result-card result-card-warning">
                                        <p className="result-label">CGST ({gstRate / 2}%)</p>
                                        <p className="result-value" style={{ fontSize: '1.1rem', color: 'var(--warning)' }}>{fmt(result.cgst)}</p>
                                    </div>
                                    <div className="result-card result-card-warning">
                                        <p className="result-label">SGST ({gstRate / 2}%)</p>
                                        <p className="result-value" style={{ fontSize: '1.1rem', color: 'var(--warning)' }}>{fmt(result.sgst)}</p>
                                    </div>
                                </div>
                                <div className="result-card result-card-primary">
                                    <p className="result-label">Total GST Amount</p>
                                    <p className="result-value" style={{ fontSize: '1.3rem', color: 'var(--warning)' }}>{fmt(result.gstAmount)}</p>
                                </div>
                                <div className="result-card result-card-success">
                                    <p className="result-label">Total Amount (with GST)</p>
                                    <p className="result-value primary">{fmt(result.totalAmount)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
