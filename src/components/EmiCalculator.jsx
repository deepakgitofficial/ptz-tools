import React, { useState, useEffect } from 'react';
import { BiCalculator, BiMoney, BiTime, BiInfoCircle } from 'react-icons/bi';
import { FaRupeeSign } from 'react-icons/fa';

const EmiCalculator = () => {
    const [principal, setPrincipal] = useState(500000);
    const [interestRate, setInterestRate] = useState(8.5);
    const [tenure, setTenure] = useState(60);

    const [emi, setEmi] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);
    const [principalPercent, setPrincipalPercent] = useState(0);

    useEffect(() => { calculateEmi(); }, [principal, interestRate, tenure]);

    const calculateEmi = () => {
        const p = parseFloat(principal);
        const r = parseFloat(interestRate) / 12 / 100;
        const n = parseFloat(tenure);
        if (p > 0 && r > 0 && n > 0) {
            const emiValue = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
            const totalAmt = emiValue * n;
            const totalInt = totalAmt - p;
            setEmi(Math.round(emiValue));
            setTotalPayment(Math.round(totalAmt));
            setTotalInterest(Math.round(totalInt));
            setPrincipalPercent(Math.round((p / totalAmt) * 100));
        }
    };

    const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

    const SliderField = ({ label, value, onChange, min, max, step, display, icon }) => (
        <div className="form-group">
            <div className="flex justify-between items-center mb-2">
                <label className="flex items-center gap-2 form-label">{icon} {label}</label>
                <span className="text-base font-bold text-[var(--primary-dark)]">{display}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={value}
                onChange={e => onChange(Number(e.target.value))}
            />
            <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                <span>{min.toLocaleString('en-IN')}</span>
                <span>{max.toLocaleString('en-IN')}</span>
            </div>
        </div>
    );

    const interestPercent = 100 - principalPercent;

    return (
        <div className="tool-page">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="tool-card mb-0 overflow-hidden">
                    <div className="tool-header">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <BiCalculator className="text-3xl text-[var(--primary)]" />
                            <h1 className="text-3xl font-black">EMI Calculator</h1>
                        </div>
                        <p>Plan your loan repayments with accurate monthly EMI breakdowns</p>
                    </div>

                    <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border)]">
                        {/* ── Inputs ── */}
                        <div className="tool-body">
                            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                                <FaRupeeSign className="text-[var(--primary)]" /> Loan Details
                            </h2>

                            <SliderField
                                label="Loan Amount"
                                value={principal} onChange={setPrincipal}
                                min={10000} max={10000000} step={10000}
                                display={fmt(principal)}
                                icon={<FaRupeeSign className="text-[var(--primary)]" />}
                            />
                            <SliderField
                                label="Interest Rate (p.a.)"
                                value={interestRate} onChange={setInterestRate}
                                min={1} max={30} step={0.1}
                                display={`${interestRate}%`}
                                icon={<BiInfoCircle className="text-amber-500" />}
                            />
                            <SliderField
                                label="Loan Tenure"
                                value={tenure} onChange={setTenure}
                                min={1} max={360} step={1}
                                display={`${tenure} mo${tenure >= 12 ? ` (${(tenure/12).toFixed(1)}y)` : ''}`}
                                icon={<BiTime className="text-blue-500" />}
                            />
                        </div>

                        {/* ── Results ── */}
                        <div className="tool-body bg-slate-50 flex flex-col justify-center">
                            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-5 flex items-center gap-2">
                                <BiMoney className="text-[var(--primary)]" /> Your EMI Breakup
                            </h2>

                            <div className="space-y-4">
                                <div className="result-card result-card-primary">
                                    <p className="result-label">Monthly EMI</p>
                                    <p className="result-value primary">{fmt(emi)}</p>
                                </div>
                                <div className="result-card result-card-success">
                                    <p className="result-label">Total Interest Payable</p>
                                    <p className="result-value" style={{ fontSize: '1.4rem', color: 'var(--success)' }}>{fmt(totalInterest)}</p>
                                </div>
                                <div className="result-card result-card-info">
                                    <p className="result-label">Total Payment</p>
                                    <p className="result-value" style={{ fontSize: '1.4rem', color: 'var(--info)' }}>{fmt(totalPayment)}</p>
                                </div>
                            </div>

                            {/* Donut-style bar */}
                            <div className="mt-5">
                                <div className="flex justify-between text-xs font-semibold mb-1.5">
                                    <span className="text-[var(--primary-dark)]">Principal {principalPercent}%</span>
                                    <span className="text-amber-500">Interest {interestPercent}%</span>
                                </div>
                                <div className="h-3 rounded-full overflow-hidden bg-amber-200">
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{ width: `${principalPercent}%`, background: 'var(--gradient-primary)' }}
                                    />
                                </div>
                                <p className="text-xs text-[var(--text-muted)] mt-1.5 text-center">
                                    Principal vs Interest ratio
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmiCalculator;
