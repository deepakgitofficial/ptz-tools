import React, { useEffect, useState, useCallback } from "react";
import { FaExchangeAlt, FaSync } from "react-icons/fa";
import { BiInfoCircle, BiTime } from "react-icons/bi";

const popularPairs = [
    { from: "USD", to: "INR" },
    { from: "EUR", to: "INR" },
    { from: "GBP", to: "INR" },
    { from: "AED", to: "INR" },
    { from: "USD", to: "EUR" },
    { from: "USD", to: "GBP" },
];

const CurrencyConverter = () => {
    const [amount, setAmount] = useState(1);
    const [from, setFrom] = useState("USD");
    const [to, setTo] = useState("INR");
    const [rates, setRates] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [swapping, setSwapping] = useState(false);
    const [error, setError] = useState("");

    const fetchRates = useCallback(async (base) => {
        try {
            setLoading(true);
            setError("");
            const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
            if (!res.ok) throw new Error("API error");
            const data = await res.json();
            setRates(data.rates);
            setLastUpdated(new Date().toLocaleTimeString());
        } catch {
            setError("Failed to fetch live rates. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchRates(from); }, [from, fetchRates]);

    useEffect(() => {
        if (rates[to] && amount) {
            setResult((amount * rates[to]).toFixed(4));
        }
    }, [rates, to, amount]);

    const swapCurrency = () => {
        setSwapping(true);
        setTimeout(() => setSwapping(false), 400);
        setFrom(to);
        setTo(from);
        setResult(null);
    };

    const selectPair = (pair) => {
        setFrom(pair.from);
        setTo(pair.to);
        setResult(null);
    };

    const currencyCodes = Object.keys(rates);

    return (
        <div className="tool-page">
            <div className="max-w-xl mx-auto">
                <div className="tool-card">
                    <div className="tool-header">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <FaExchangeAlt className="text-3xl text-[var(--primary)]" />
                            <h1 className="text-3xl font-black">Currency Converter</h1>
                        </div>
                        <p>Live exchange rates — 150+ currencies worldwide</p>
                        {lastUpdated && (
                            <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1">
                                <BiTime /> Updated at {lastUpdated}
                            </p>
                        )}
                    </div>

                    <div className="tool-body space-y-4">
                        {error && (
                            <div className="info-box warning">
                                <BiInfoCircle className="flex-shrink-0" /> {error}
                            </div>
                        )}

                        {/* Amount */}
                        <div className="form-group">
                            <label className="form-label">Amount</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="form-input text-xl font-bold"
                                min={0}
                                placeholder="Enter amount"
                            />
                        </div>

                        {/* Currency selectors */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1">
                                <label className="form-label">From</label>
                                <select value={from} onChange={e => setFrom(e.target.value)} className="form-input select">
                                    {currencyCodes.map(code => (
                                        <option key={code} value={code}>{code}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Swap button */}
                            <button
                                onClick={swapCurrency}
                                className="mt-5 w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-slate-900 transition-all"
                                title="Swap currencies"
                            >
                                <FaExchangeAlt className={`text-sm transition-transform duration-300 ${swapping ? 'rotate-180' : ''}`} />
                            </button>

                            <div className="flex-1">
                                <label className="form-label">To</label>
                                <select value={to} onChange={e => setTo(e.target.value)} className="form-input select">
                                    {currencyCodes.map(code => (
                                        <option key={code} value={code}>{code}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Result */}
                        {loading ? (
                            <div className="result-card text-center py-6">
                                <FaSync className="animate-spin-slow text-[var(--primary)] text-2xl mx-auto mb-2" />
                                <p className="text-sm text-[var(--text-secondary)]">Fetching live rates…</p>
                            </div>
                        ) : result ? (
                            <div className="result-card result-card-primary animate-scale-in">
                                <p className="result-label text-center">Conversion Result</p>
                                <div className="text-center mt-2">
                                    <p className="text-sm text-[var(--text-secondary)] mb-1">
                                        {amount} <strong>{from}</strong> =
                                    </p>
                                    <p className="text-4xl font-black text-[var(--primary-dark)]">
                                        {Number(result).toLocaleString("en-US", { maximumFractionDigits: 4 })}
                                    </p>
                                    <p className="text-xl font-bold text-[var(--text-secondary)] mt-1">{to}</p>
                                </div>
                                {rates[to] && (
                                    <p className="text-xs text-center text-[var(--text-muted)] mt-3">
                                        1 {from} = {rates[to].toFixed(4)} {to}
                                    </p>
                                )}
                            </div>
                        ) : null}

                        {/* Refresh button */}
                        <button onClick={() => fetchRates(from)} disabled={loading} className="btn-ghost py-2.5">
                            <FaSync className={loading ? "animate-spin-slow" : ""} />
                            {loading ? "Refreshing…" : "Refresh Rates"}
                        </button>

                        {/* Popular pairs */}
                        <div className="section-divider" />
                        <div>
                            <p className="form-label mb-2">Popular Pairs</p>
                            <div className="flex flex-wrap gap-2">
                                {popularPairs.map((pair, i) => (
                                    <button key={i} onClick={() => selectPair(pair)}
                                        className={`preset-btn ${from === pair.from && to === pair.to ? 'active' : ''}`}>
                                        {pair.from} → {pair.to}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="info-box primary">
                            <BiInfoCircle className="flex-shrink-0 mt-0.5" />
                            <span>Live rates from ExchangeRate-API. Rates update automatically when you change the base currency. Auto-converts as you type.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrencyConverter;