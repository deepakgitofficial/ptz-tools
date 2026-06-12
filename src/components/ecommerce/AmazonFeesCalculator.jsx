import React, { useMemo, useState } from "react";
import Decimal from "decimal.js";
import {
    BiCalculator,
    BiCopy,
    BiPackage,
    BiTrendingUp,
    BiTrendingDown,
    BiInfoCircle,
    BiReset,
    BiPieChart,
    BiTable,
    BiCheckCircle,
} from "react-icons/bi";
import { FaRupeeSign } from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const CATEGORY_FEES = {
    Fashion: 17,
    Electronics: 12,
    Beauty: 18,
    Books: 15,
    Grocery: 8,
    Sports: 15,
    "Home & Kitchen": 15,
    Custom: 15,
};

const EASY_SHIP_PRESETS = {
    Lightweight: 38,
    Standard: 55,
    Heavy: 85,
    Oversized: 140,
};

const EASY_SHIP_DETAILS = {
    Lightweight: { fee: 38, desc: "Under 500g (Local)" },
    Standard: { fee: 55, desc: "500g - 2kg (Regional)" },
    Heavy: { fee: 85, desc: "2kg - 5kg (National)" },
    Oversized: { fee: 140, desc: "Above 5kg (National Heavy)" },
};

// Formatter for currency
const fmt = (v) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(v);

// Generic Input component matching index.css styles
const Input = ({
    label,
    value,
    onChange,
    type = "number",
    min,
    max,
    step,
    placeholder,
    icon,
}) => (
    <div className="form-group">
        <label className="form-label flex items-center gap-1.5">
            {icon} {label}
        </label>
        <input
            type={type}
            value={value}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="form-input"
        />
    </div>
);

// Dual Slider + Number Input component for dynamic scenario testing
const SliderInput = ({
    label,
    value,
    onChange,
    min,
    max,
    step = 1,
    icon,
    unit = "₹",
}) => {
    return (
        <div className="form-group bg-white p-3.5 rounded-xl border border-[var(--border)] shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <label className="form-label flex items-center gap-1.5 mb-0 text-xs tracking-wide">
                    {icon} {label}
                </label>
                <div className="flex items-center gap-1">
                    <span className="text-xs text-[var(--text-secondary)] font-medium">{unit}</span>
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-20 px-2 py-1 text-right font-bold text-sm bg-slate-50 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                </div>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={Number(value) || 0}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
            />
            <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1 font-semibold">
                <span>{unit}{min.toLocaleString("en-IN")}</span>
                <span>{unit}{max.toLocaleString("en-IN")}</span>
            </div>
        </div>
    );
};

export default function AmazonEasyShipCalculator() {
    const [category, setCategory] = useState("Fashion");
    const [sellingPrice, setSellingPrice] = useState("1000");
    const [productCost, setProductCost] = useState("400");
    const [packagingCost, setPackagingCost] = useState("20");
    const [advertisingCost, setAdvertisingCost] = useState("100");
    const [closingFee, setClosingFee] = useState("20");
    const [gstPercent, setGstPercent] = useState("18");
    const [targetProfit, setTargetProfit] = useState("500");
    const [gstIncluded, setGstIncluded] = useState(false);
    const [easyShipType, setEasyShipType] = useState("Standard");
    const [easyShipFee, setEasyShipFee] = useState(EASY_SHIP_PRESETS["Standard"]);
    const [referralFeePercent, setReferralFeePercent] = useState(CATEGORY_FEES["Fashion"]);

    // Tab state for chart vs receipt view
    const [activeTab, setActiveTab] = useState("chart");

    // Toast state
    const [toastMessage, setToastMessage] = useState("");

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage("");
        }, 3000);
    };

    // Calculate maximum limits for sliders adaptively
    const sellingPriceMax = Math.max(10000, Math.ceil((Number(sellingPrice) || 1000) / 5000) * 5000);
    const productCostMax = Math.max(5000, Math.ceil((Number(productCost) || 400) / 1000) * 1000);
    const advertisingCostMax = Math.max(2000, Math.ceil((Number(advertisingCost) || 100) / 500) * 500);

    const calculations = useMemo(() => {
        const sp = new Decimal(sellingPrice || 0);
        const product = new Decimal(productCost || 0);
        const packaging = new Decimal(packagingCost || 0);
        const ads = new Decimal(advertisingCost || 0);
        const closing = new Decimal(closingFee || 0);
        const easyShip = new Decimal(easyShipFee || 0);

        const referralFee = sp.mul(referralFeePercent).div(100);

        const gst = gstIncluded ? new Decimal(0) : sp.mul(gstPercent).div(100);

        const amazonFees = referralFee.plus(closing).plus(easyShip);

        const totalCost = amazonFees.plus(product).plus(packaging).plus(ads).plus(gst);

        const profit = sp.minus(totalCost);

        const margin = sp.gt(0) ? profit.div(sp).mul(100) : new Decimal(0);

        const roi = product.gt(0) ? profit.div(product).mul(100) : new Decimal(0);

        const breakEven = totalCost.div(
            Decimal.sub(1, new Decimal(referralFeePercent).div(100))
        );

        const targetPrice = totalCost.plus(targetProfit).div(
            Decimal.sub(1, new Decimal(referralFeePercent).div(100))
        );

        return {
            referralFee,
            gst,
            amazonFees,
            totalCost,
            profit,
            margin,
            roi,
            breakEven,
            targetPrice,
        };
    }, [
        sellingPrice,
        productCost,
        packagingCost,
        advertisingCost,
        closingFee,
        easyShipFee,
        referralFeePercent,
        gstPercent,
        gstIncluded,
        targetProfit,
    ]);

    const profitStatus = () => {
        const m = calculations.margin.toNumber();
        if (m < 0) {
            return {
                label: "Loss Maker",
                color: "badge-error",
                textColor: "text-[var(--error)]",
                textBg: "bg-[var(--error-light)]",
                tip: "⚠️ You are selling at a loss! Try increasing your selling price, sourcing the product cheaper, or optimizing ad spend.",
            };
        }
        if (m < 15) {
            return {
                label: "Low Margin",
                color: "badge-warning",
                textColor: "text-amber-600",
                textBg: "bg-[var(--warning-light)]",
                tip: "ℹ️ Thin profit margin. Review packaging costs and advertising conversions to prevent slipping into a loss.",
            };
        }
        if (m < 30) {
            return {
                label: "Healthy Margin",
                color: "badge-primary",
                textColor: "text-[var(--primary-dark)]",
                textBg: "bg-[var(--primary-light)]",
                tip: "👍 Healthy profit margin. You have a solid safety buffer. Good opportunity to scale up sales volume.",
            };
        }
        return {
            label: "High Margin",
            color: "badge-success",
            textColor: "text-[var(--success)]",
            textBg: "bg-[var(--success-light)]",
            tip: "🚀 Outstanding profitability! You have excellent pricing power. Consider investing more in ads to acquire customers.",
        };
    };

    const status = profitStatus();

    const handleReset = () => {
        setCategory("Fashion");
        setSellingPrice("1000");
        setProductCost("400");
        setPackagingCost("20");
        setAdvertisingCost("100");
        setClosingFee("20");
        setGstPercent("18");
        setTargetProfit("500");
        setGstIncluded(false);
        setEasyShipType("Standard");
        setEasyShipFee(EASY_SHIP_PRESETS["Standard"]);
        setReferralFeePercent(CATEGORY_FEES["Fashion"]);
        showToast("Reset to default parameters!");
    };

    const copySummary = async () => {
        const summary = `Amazon Easy Ship Fee & Profit Calculation Summary
---------------------------------------------
Product Category: ${category}
Selling Price: ${fmt(sellingPrice)}
Product Cost: ${fmt(productCost)}
---------------------------------------------
Amazon Fees Breakdown:
  - Referral Fee (${referralFeePercent}%): ${fmt(calculations.referralFee.toNumber())}
  - Closing Fee: ${fmt(closingFee)}
  - Easy Ship Fee (${easyShipType}): ${fmt(easyShipFee)}
  - Total Amazon Fees: ${fmt(calculations.amazonFees.toNumber())}
---------------------------------------------
Other Costs:
  - Packaging: ${fmt(packagingCost)}
  - Advertising: ${fmt(advertisingCost)}
  - GST (${gstPercent}%): ${gstIncluded ? "Included" : fmt(calculations.gst.toNumber())}
  - Total Cost to Seller: ${fmt(calculations.totalCost.toNumber())}
---------------------------------------------
Net Profit: ${fmt(calculations.profit.toNumber())}
Profit Margin: ${calculations.margin.toFixed(2)}%
Return on Investment (ROI): ${calculations.roi.toFixed(2)}%
Breakeven Price: ${fmt(calculations.breakEven.toNumber())}
Required SP for Target Profit (${fmt(targetProfit)}): ${fmt(calculations.targetPrice.toNumber())}`;

        await navigator.clipboard.writeText(summary);
        showToast("Calculation summary copied to clipboard!");
    };

    // Data for the Recharts Donut chart representation
    const chartData = useMemo(() => {
        const data = [];
        const profitVal = calculations.profit.toNumber();
        if (profitVal > 0) {
            data.push({ name: "Net Profit", value: profitVal, color: "#10b981" });
        }

        const productVal = Number(productCost) || 0;
        if (productVal > 0) {
            data.push({ name: "Product Cost", value: productVal, color: "#3b82f6" });
        }

        const referralVal = calculations.referralFee.toNumber();
        const closingVal = Number(closingFee) || 0;
        const easyShipVal = Number(easyShipFee) || 0;
        const totalAmazonFees = referralVal + closingVal + easyShipVal;
        if (totalAmazonFees > 0) {
            data.push({ name: "Amazon Fees", value: totalAmazonFees, color: "#f59e0b" });
        }

        const adsVal = Number(advertisingCost) || 0;
        if (adsVal > 0) {
            data.push({ name: "Advertising", value: adsVal, color: "#8b5cf6" });
        }

        const packagingVal = Number(packagingCost) || 0;
        if (packagingVal > 0) {
            data.push({ name: "Packaging", value: packagingVal, color: "#ec4899" });
        }

        const gstVal = calculations.gst.toNumber();
        if (gstVal > 0) {
            data.push({ name: "GST Amount", value: gstVal, color: "#ef4444" });
        }

        return data;
    }, [calculations, productCost, closingFee, easyShipFee, advertisingCost, packagingCost]);

    const totalForPercentage = calculations.profit.gte(0)
        ? Number(sellingPrice) || 0
        : calculations.totalCost.toNumber();

    return (
        <div className="tool-page">
            <div className="max-w-7xl mx-auto">
                <div className="tool-card mb-0 overflow-hidden">
                    {/* Header */}
                    <div className="tool-header">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md animate-float">
                                    <BiCalculator className="text-3xl text-[var(--primary)]" />
                                </div>
                                <div className="text-left">
                                    <h1 className="text-3xl font-black tracking-tight text-white mb-0">
                                        Amazon Easy Ship Calculator
                                    </h1>
                                    <p className="text-slate-300 text-sm mt-1">
                                        India Seller Margin, Shipping, and Profitability Planner
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleReset}
                                className="btn-secondary self-start sm:self-center flex items-center gap-2 text-xs py-2 px-4 border border-white/20 hover:bg-white/10"
                                style={{ width: "auto" }}
                            >
                                <BiReset className="text-base" /> Reset Defaults
                            </button>
                        </div>
                    </div>

                    {/* Main Layout Grid */}
                    <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border)] bg-white">
                        
                        {/* LEFT COLUMN: Inputs */}
                        <div className="lg:col-span-7 tool-body space-y-6">
                            
                            {/* Section 1: Product pricing */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 flex items-center gap-2 uppercase tracking-wider">
                                    <BiPackage className="text-[var(--primary)] text-lg" /> 1. Product & Pricing
                                </h3>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Category drop down */}
                                    <div className="form-group">
                                        <label className="form-label flex items-center gap-1.5">
                                            Product Category
                                        </label>
                                        <select
                                            value={category}
                                            onChange={(e) => {
                                                setCategory(e.target.value);
                                                setReferralFeePercent(CATEGORY_FEES[e.target.value]);
                                            }}
                                            className="form-input"
                                        >
                                            {Object.keys(CATEGORY_FEES).map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat} ({CATEGORY_FEES[cat]}% Referral Fee)
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Target Profit Input */}
                                    <Input
                                        label="Target Net Profit (₹)"
                                        value={targetProfit}
                                        onChange={setTargetProfit}
                                        icon={<FaRupeeSign className="text-emerald-500" />}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <SliderInput
                                        label="Selling Price"
                                        value={sellingPrice}
                                        onChange={setSellingPrice}
                                        min={0}
                                        max={sellingPriceMax}
                                        step={50}
                                        icon={<FaRupeeSign className="text-[var(--primary)]" />}
                                    />
                                    <SliderInput
                                        label="Product Sourcing Cost"
                                        value={productCost}
                                        onChange={setProductCost}
                                        min={0}
                                        max={productCostMax}
                                        step={10}
                                        icon={<FaRupeeSign className="text-blue-500" />}
                                    />
                                </div>
                            </div>

                            {/* Section 2: Amazon Shipping Fees */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 flex items-center gap-2 uppercase tracking-wider">
                                    <BiTrendingUp className="text-[var(--primary)] text-lg" /> 2. Amazon Easy Ship Tiers
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {Object.entries(EASY_SHIP_DETAILS).map(([type, details]) => {
                                        const isSelected = easyShipType === type;
                                        return (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => {
                                                    setEasyShipType(type);
                                                    setEasyShipFee(details.fee);
                                                }}
                                                className={`p-3 text-left rounded-xl border transition-all duration-200 ${
                                                    isSelected
                                                        ? "bg-[var(--primary-light)] border-[var(--primary)] ring-2 ring-[var(--primary-glow)]"
                                                        : "bg-slate-50 hover:bg-slate-100 border-[var(--border)]"
                                                }`}
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`font-bold text-xs uppercase tracking-wider ${isSelected ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                                                        {type}
                                                    </span>
                                                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${isSelected ? "bg-[var(--primary)] text-slate-900" : "bg-slate-200 text-slate-700"}`}>
                                                        ₹{details.fee}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-[var(--text-secondary)] leading-tight font-medium">
                                                    {details.desc}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Collapsible fine tune details */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-[var(--border)] space-y-3">
                                    <p className="text-[11px] font-extrabold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                                        Fine-Tune Amazon Fees & Surcharges
                                    </p>
                                    <div className="grid grid-cols-3 gap-3">
                                        <Input
                                            label="Referral Fee %"
                                            value={referralFeePercent}
                                            onChange={setReferralFeePercent}
                                        />
                                        <Input
                                            label="Closing Fee (₹)"
                                            value={closingFee}
                                            onChange={setClosingFee}
                                        />
                                        <Input
                                            label="Easy Ship Fee (₹)"
                                            value={easyShipFee}
                                            onChange={setEasyShipFee}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Extra costs */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 flex items-center gap-2 uppercase tracking-wider">
                                    <BiPackage className="text-[var(--primary)] text-lg" /> 3. Additional Costs & GST
                                </h3>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <SliderInput
                                        label="Advertising Spend (Per Sale)"
                                        value={advertisingCost}
                                        onChange={setAdvertisingCost}
                                        min={0}
                                        max={advertisingCostMax}
                                        step={10}
                                        icon={<FaRupeeSign className="text-purple-500" />}
                                    />
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input
                                            label="Packaging (₹)"
                                            value={packagingCost}
                                            onChange={setPackagingCost}
                                            icon={<FaRupeeSign className="text-pink-500" />}
                                        />
                                        <Input
                                            label="GST Rate (%)"
                                            value={gstPercent}
                                            onChange={setGstPercent}
                                            icon={<BiInfoCircle className="text-red-500" />}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-[var(--border)]">
                                    <div className="text-left pr-4">
                                        <label className="text-sm font-bold text-[var(--text-primary)] block">
                                            GST Included in Selling Price
                                        </label>
                                        <span className="text-[11px] text-[var(--text-secondary)] font-medium">
                                            Turn on if your Selling Price already includes tax (GST inclusive).
                                        </span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={gstIncluded}
                                        onChange={(e) => setGstIncluded(e.target.checked)}
                                        className="toggle-checkbox"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Live Results & Analytics */}
                        <div className="lg:col-span-5 tool-body bg-slate-50 flex flex-col justify-between space-y-6">
                            <div className="space-y-5">
                                <h3 className="text-sm font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 flex items-center gap-2 uppercase tracking-wider">
                                    <BiTrendingUp className="text-[var(--primary)] text-lg" /> Calculations & Analytics
                                </h3>

                                {/* KPI cards grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Profit Card */}
                                    <div className={`result-card ${calculations.profit.gte(0) ? "result-card-success bg-white" : "result-card-error bg-red-50/50"}`}>
                                        <p className="result-label">Net Profit</p>
                                        <p className={`result-value ${calculations.profit.gte(0) ? "text-[var(--success)]" : "text-[var(--error)]"}`}>
                                            {fmt(calculations.profit.toNumber())}
                                        </p>
                                    </div>

                                    {/* Margin Card */}
                                    <div className={`result-card ${calculations.profit.gte(0) ? "result-card-primary bg-white" : "result-card-warning bg-amber-50/50"}`}>
                                        <p className="result-label">Profit Margin</p>
                                        <p className={`result-value ${calculations.profit.gte(0) ? "text-[var(--primary-dark)]" : "text-amber-600"}`}>
                                            {calculations.margin.toFixed(1)}%
                                        </p>
                                    </div>

                                    {/* ROI Card */}
                                    <div className="result-card result-card-info bg-white">
                                        <p className="result-label">Return on Inv (ROI)</p>
                                        <p className="result-value text-[var(--info)]">
                                            {calculations.roi.toFixed(0)}%
                                        </p>
                                    </div>

                                    {/* Amazon Fees Card */}
                                    <div className="result-card result-card-warning bg-white">
                                        <p className="result-label">Amazon Fees</p>
                                        <p className="result-value text-amber-500">
                                            {fmt(calculations.amazonFees.toNumber())}
                                        </p>
                                    </div>
                                </div>

                                {/* Active Tabs for visual donut or invoice */}
                                <div className="border border-[var(--border)] rounded-2xl bg-white overflow-hidden p-4 shadow-sm">
                                    <div className="flex border-b border-[var(--border)] pb-3 mb-4">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("chart")}
                                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                                                activeTab === "chart"
                                                    ? "bg-[var(--primary-light)] text-[var(--primary-dark)]"
                                                    : "text-[var(--text-secondary)] hover:bg-slate-50"
                                            }`}
                                        >
                                            <BiPieChart className="text-base" /> Chart breakdown
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("invoice")}
                                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                                                activeTab === "invoice"
                                                    ? "bg-[var(--primary-light)] text-[var(--primary-dark)]"
                                                    : "text-[var(--text-secondary)] hover:bg-slate-50"
                                            }`}
                                        >
                                            <BiTable className="text-base" /> Itemized receipt
                                        </button>
                                    </div>

                                    {/* Donut Chart content */}
                                    {activeTab === "chart" && (
                                        <div className="space-y-4">
                                            {chartData.length > 0 ? (
                                                <>
                                                    <div className="relative h-44 w-full">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <PieChart>
                                                                <Pie
                                                                    data={chartData}
                                                                    cx="50%"
                                                                    cy="50%"
                                                                    innerRadius={50}
                                                                    outerRadius={70}
                                                                    paddingAngle={3}
                                                                    dataKey="value"
                                                                >
                                                                    {chartData.map((entry, index) => (
                                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                                    ))}
                                                                </Pie>
                                                                <Tooltip formatter={(value) => `₹${Number(value).toFixed(0)}`} />
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                            <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">
                                                                {calculations.profit.gte(0) ? "Net Profit" : "Net Loss"}
                                                            </span>
                                                            <span className={`text-lg font-black ${calculations.profit.gte(0) ? "text-[var(--success)]" : "text-[var(--error)]"}`}>
                                                                ₹{Math.abs(calculations.profit.toNumber()).toFixed(0)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Custom legend with percentages */}
                                                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-semibold">
                                                        {chartData.map((item) => {
                                                            const pct = totalForPercentage > 0
                                                                ? ((item.value / totalForPercentage) * 100).toFixed(1)
                                                                : 0;
                                                            return (
                                                                <div key={item.name} className="flex items-center justify-between p-1 border border-slate-50 rounded-lg">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                                                        <span className="text-[var(--text-secondary)]">{item.name}</span>
                                                                    </div>
                                                                    <span className="text-[var(--text-primary)]">
                                                                        ₹{item.value.toFixed(0)} ({pct}%)
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            ) : (
                                                <p className="text-center text-xs text-[var(--text-muted)] py-10">
                                                    Enter values to see visual breakdown.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Invoice Table view */}
                                    {activeTab === "invoice" && (
                                        <div className="text-xs font-semibold space-y-2.5">
                                            <div className="flex justify-between pb-1.5 border-b border-dashed border-[var(--border)]">
                                                <span className="text-[var(--text-secondary)]">Revenue (Selling Price)</span>
                                                <span className="text-[var(--success)]">+{fmt(sellingPrice)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[var(--text-secondary)]">Product Cost</span>
                                                <span className="text-[var(--error)]">-{fmt(productCost)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[var(--text-secondary)]">Amazon Referral Fee ({referralFeePercent}%)</span>
                                                <span className="text-[var(--error)]">-{fmt(calculations.referralFee.toNumber())}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[var(--text-secondary)]">Amazon Closing Fee</span>
                                                <span className="text-[var(--error)]">-{fmt(closingFee)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[var(--text-secondary)]">Amazon Easy Ship Fee</span>
                                                <span className="text-[var(--error)]">-{fmt(easyShipFee)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[var(--text-secondary)]">Packaging Material</span>
                                                <span className="text-[var(--error)]">-{fmt(packagingCost)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[var(--text-secondary)]">Advertising spend</span>
                                                <span className="text-[var(--error)]">-{fmt(advertisingCost)}</span>
                                            </div>
                                            <div className="flex justify-between pb-2 border-b border-[var(--border)]">
                                                <span className="text-[var(--text-secondary)]">GST Tax Amount ({gstPercent}%)</span>
                                                <span className="text-[var(--error)]">{gstIncluded ? "Included (₹0)" : `-${fmt(calculations.gst.toNumber())}`}</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-1.5 text-sm font-black">
                                                <span className="text-[var(--text-primary)]">Take-Home Profit</span>
                                                <span className={calculations.profit.gte(0) ? "text-[var(--success)]" : "text-[var(--error)]"}>
                                                    {fmt(calculations.profit.toNumber())}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Advanced insights segment */}
                                <div className="bg-white border border-[var(--border)] rounded-2xl p-4 space-y-3 shadow-sm text-xs font-semibold">
                                    <h4 className="font-extrabold text-[var(--text-primary)] flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                                        <BiInfoCircle className="text-[var(--primary)] text-sm" /> Smart Selling Insights
                                    </h4>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-2.5 bg-slate-50 rounded-xl border border-[var(--border)] text-left">
                                            <span className="text-[10px] text-[var(--text-secondary)] uppercase block mb-0.5">
                                                Breakeven Price
                                            </span>
                                            <span className="text-sm font-extrabold text-[var(--text-primary)]">
                                                {fmt(calculations.breakEven.toNumber())}
                                            </span>
                                            <p className="text-[9px] text-[var(--text-muted)] font-medium leading-none mt-1">
                                                Sell above this to avoid losses.
                                            </p>
                                        </div>

                                        <div className="p-2.5 bg-slate-50 rounded-xl border border-[var(--border)] text-left">
                                            <span className="text-[10px] text-[var(--text-secondary)] uppercase block mb-0.5">
                                                Target Selling Price
                                            </span>
                                            <span className="text-sm font-extrabold text-[var(--text-primary)]">
                                                {fmt(calculations.targetPrice.toNumber())}
                                            </span>
                                            <p className="text-[9px] text-[var(--text-muted)] font-medium leading-none mt-1">
                                                Required price to earn ₹{targetProfit}.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actionable tip display box */}
                                    <div className={`p-3 rounded-xl ${status.textBg} ${status.textColor} border border-current/10 font-medium leading-normal`}>
                                        <div className="flex gap-2">
                                            <div className="text-sm font-bold leading-none mt-0.5 flex-shrink-0">
                                                {calculations.profit.gte(0) ? "✓" : "!"}
                                            </div>
                                            <div>
                                                <span className="font-bold text-xs block mb-0.5">{status.label} Status</span>
                                                <p className="text-[11px] leading-relaxed">{status.tip}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Copy Summary Button */}
                            <button
                                onClick={copySummary}
                                className="btn-primary py-3.5 text-sm font-bold flex items-center justify-center gap-2 mt-4"
                            >
                                <BiCopy className="text-lg" /> Copy Calculation Summary
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom styled toast alert matching index.css class */}
            {toastMessage && (
                <div className="toast flex items-center gap-2 animate-slide-up">
                    <BiCheckCircle className="text-[var(--primary)] text-lg flex-shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}
        </div>
    );
}