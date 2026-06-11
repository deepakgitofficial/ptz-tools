import React, { useMemo, useState } from "react";
import Decimal from "decimal.js";
import {
    BiCalculator,
    BiCopy,
    BiPackage,
    BiTrendingUp,
} from "react-icons/bi";

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

const Input = ({
    label,
    value,
    onChange,
    type = "number",
}) => (
    <div>
        <label className="block text-sm font-medium mb-2">
            {label}
        </label>

        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
    </div>
);

const ResultCard = ({ label, value }) => (
    <div className={` border rounded-2xl p-5 shadow-sm ${label == "Net Profit" ? "border-green-700 border-2 bg-teal-50" : "bg-white"}`}>
        <div className={`text-sm  ${label == "Net Profit" ? "text-green-800" : "text-gray-700"}`} > {label}</div>
        <div className={`text-2xl font-bold mt-1  ${label == "Net Profit" ? "text-green-700" : "text-gray-500"}`}>
            {value}
        </div>
    </div>
);

export default function AmazonEasyShipCalculator() {
    const [category, setCategory] =
        useState("Fashion");

    const [sellingPrice, setSellingPrice] =
        useState("1000");

    const [productCost, setProductCost] =
        useState("400");

    const [packagingCost, setPackagingCost] =
        useState("20");

    const [advertisingCost, setAdvertisingCost] =
        useState("100");

    const [closingFee, setClosingFee] =
        useState("20");

    const [gstPercent, setGstPercent] =
        useState("18");

    const [targetProfit, setTargetProfit] =
        useState("500");

    const [gstIncluded, setGstIncluded] =
        useState(false);

    const [easyShipType, setEasyShipType] =
        useState("Standard");

    const [easyShipFee, setEasyShipFee] =
        useState(
            EASY_SHIP_PRESETS["Standard"]
        );

    const [referralFeePercent, setReferralFeePercent] =
        useState(
            CATEGORY_FEES["Fashion"]
        );

    const calculations = useMemo(() => {
        const sp = new Decimal(
            sellingPrice || 0
        );

        const product = new Decimal(
            productCost || 0
        );

        const packaging = new Decimal(
            packagingCost || 0
        );

        const ads = new Decimal(
            advertisingCost || 0
        );

        const closing = new Decimal(
            closingFee || 0
        );

        const easyShip = new Decimal(
            easyShipFee || 0
        );

        const referralFee = sp
            .mul(referralFeePercent)
            .div(100);

        const gst = gstIncluded
            ? new Decimal(0)
            : sp.mul(gstPercent).div(100);

        const amazonFees = referralFee
            .plus(closing)
            .plus(easyShip);

        const totalCost = amazonFees
            .plus(product)
            .plus(packaging)
            .plus(ads)
            .plus(gst);

        const profit =
            sp.minus(totalCost);

        const margin =
            sp.gt(0)
                ? profit.div(sp).mul(100)
                : new Decimal(0);

        const roi =
            product.gt(0)
                ? profit.div(product).mul(100)
                : new Decimal(0);

        const breakEven =
            totalCost.div(
                Decimal.sub(
                    1,
                    new Decimal(
                        referralFeePercent
                    ).div(100)
                )
            );

        const targetPrice =
            totalCost
                .plus(targetProfit)
                .div(
                    Decimal.sub(
                        1,
                        new Decimal(
                            referralFeePercent
                        ).div(100)
                    )
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
        const m =
            calculations.margin.toNumber();

        if (m < 0)
            return {
                label: "Loss",
                color:
                    "bg-red-100 text-red-600",
            };

        if (m < 15)
            return {
                label: "Low Margin",
                color:
                    "bg-yellow-100 text-yellow-700",
            };

        if (m < 30)
            return {
                label: "Good Margin",
                color:
                    "bg-blue-100 text-blue-700",
            };

        return {
            label: "Excellent",
            color:
                "bg-green-100 text-green-700",
        };
    };

    const status = profitStatus();

    const copySummary = async () => {
        const summary = `
Amazon Easy Ship Calculation

Selling Price: ₹${sellingPrice}
Amazon Fees: ₹${calculations.amazonFees.toFixed(
            2
        )}

Profit: ₹${calculations.profit.toFixed(
            2
        )}

Margin: ${calculations.margin.toFixed(
            2
        )}%

ROI: ${calculations.roi.toFixed(
            2
        )}%
`;

        await navigator.clipboard.writeText(
            summary
        );

        alert("Copied");
    };

    return (
        <div className="bg-[var(--background)] min-h-screen p-6">

            <div className="max-w-7xl mx-auto">

                <div className="bg-white rounded-3xl shadow-xl p-6">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">

                        <BiCalculator className="text-5xl text-[var(--primary)]" />

                        <div>
                            <h1 className="text-3xl font-bold">
                                Amazon Easy Ship Calculator
                            </h1>

                            <p className="text-gray-500">
                                India Seller Profit Calculator
                            </p>
                        </div>

                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">

                        {/* LEFT */}
                        <div className="space-y-6">

                            <div className="bg-gray-50 p-5 rounded-2xl">

                                <h3 className="font-bold mb-4">
                                    Product Details
                                </h3>

                                <select
                                    value={category}
                                    onChange={(e) => {
                                        setCategory(
                                            e.target.value
                                        );

                                        setReferralFeePercent(
                                            CATEGORY_FEES[
                                            e.target.value
                                            ]
                                        );
                                    }}
                                    className="w-full border rounded-xl p-3 mb-4"
                                >
                                    {Object.keys(
                                        CATEGORY_FEES
                                    ).map((cat) => (
                                        <option key={cat}>
                                            {cat}
                                        </option>
                                    ))}

                                    {/* {category} */}
                                </select>

                                <div className="grid md:grid-cols-2 gap-4">

                                    <Input
                                        label="Selling Price ₹"
                                        value={sellingPrice}
                                        onChange={
                                            setSellingPrice
                                        }
                                    />

                                    <Input
                                        label="Product Cost ₹"
                                        value={productCost}
                                        onChange={
                                            setProductCost
                                        }
                                    />

                                </div>

                            </div>

                            <div className="bg-gray-50 p-5 rounded-2xl">

                                <h3 className="font-bold mb-4">
                                    Amazon Fees
                                </h3>

                                <select
                                    value={easyShipType}
                                    onChange={(e) => {
                                        setEasyShipType(
                                            e.target.value
                                        );

                                        setEasyShipFee(
                                            EASY_SHIP_PRESETS[
                                            e.target.value
                                            ]
                                        );
                                    }}
                                    className="w-full border rounded-xl p-3 mb-4"
                                >
                                    {Object.keys(
                                        EASY_SHIP_PRESETS
                                    ).map((type) => (
                                        <option key={type}>
                                            {type}
                                        </option>
                                    ))}


                                </select>

                                <div className="grid md:grid-cols-2 gap-4">

                                    <Input
                                        label="Referral Fee %"
                                        value={
                                            referralFeePercent
                                        }
                                        onChange={
                                            setReferralFeePercent
                                        }
                                    />

                                    <Input
                                        label="Closing Fee ₹"
                                        value={closingFee}
                                        onChange={
                                            setClosingFee
                                        }
                                    />

                                    <Input
                                        label="Easy Ship Fee ₹"
                                        value={easyShipFee}
                                        onChange={
                                            setEasyShipFee
                                        }
                                    />

                                </div>

                            </div>

                            <div className="bg-gray-50 p-5 rounded-2xl">

                                <h3 className="font-bold mb-4">
                                    Additional Costs
                                </h3>

                                <div className="grid md:grid-cols-2 gap-4">

                                    <Input
                                        label="Packaging ₹"
                                        value={
                                            packagingCost
                                        }
                                        onChange={
                                            setPackagingCost
                                        }
                                    />

                                    <Input
                                        label="Advertising ₹"
                                        value={
                                            advertisingCost
                                        }
                                        onChange={
                                            setAdvertisingCost
                                        }
                                    />

                                    <Input
                                        label="GST %"
                                        value={gstPercent}
                                        onChange={
                                            setGstPercent
                                        }
                                    />

                                    <Input
                                        label="Target Profit ₹"
                                        value={
                                            targetProfit
                                        }
                                        onChange={
                                            setTargetProfit
                                        }
                                    />

                                </div>

                                <label className="flex items-center gap-2 mt-4 border border-teal-200 p-3 bg-teal-50 text-teal-800 font-bold">

                                    <input
                                        className=" "
                                        type="checkbox"
                                        checked={
                                            gstIncluded

                                        }
                                        onChange={(e) =>
                                            setGstIncluded(
                                                e.target.checked
                                            )
                                        }
                                    />

                                    GST Included
                                </label>

                            </div>

                        </div>

                        {/* RIGHT */}
                        <div>

                            <div className="grid grid-cols-2 gap-4">

                                <ResultCard
                                    label="Amazon Fees"
                                    value={`₹${calculations.amazonFees.toFixed(
                                        2
                                    )}`}
                                />

                                <ResultCard
                                    label="Net Profit"
                                    value={`₹${calculations.profit.toFixed(
                                        2
                                    )}`}
                                />

                                <ResultCard
                                    label="Margin"
                                    value={`${calculations.margin.toFixed(
                                        2
                                    )}%`}
                                />

                                <ResultCard
                                    label="ROI"
                                    value={`${calculations.roi.toFixed(
                                        2
                                    )}%`}
                                />

                            </div>

                            <div className="mt-6 bg-white border rounded-2xl p-5">

                                <h3 className="font-bold mb-3">
                                    Profit Health
                                </h3>

                                <span
                                    className={`px-4 py-2 rounded-full text-sm font-semibold ${status.color}`}
                                >
                                    {status.label}
                                </span>

                            </div>

                            <div className="mt-6 bg-white border rounded-2xl p-5">

                                <h3 className="font-bold mb-4">
                                    Advanced Insights
                                </h3>

                                <div className="space-y-3 text-sm">

                                    <div>
                                        Breakeven Price:
                                        <strong>
                                            {" "}
                                            ₹
                                            {calculations.breakEven.toFixed(
                                                2
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        Required Selling Price:
                                        <strong>
                                            {" "}
                                            ₹
                                            {calculations.targetPrice.toFixed(
                                                2
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        GST Amount:
                                        <strong>
                                            {" "}
                                            ₹
                                            {calculations.gst.toFixed(
                                                2
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        Referral Fee:
                                        <strong>
                                            {" "}
                                            ₹
                                            {calculations.referralFee.toFixed(
                                                2
                                            )}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                            <button
                                onClick={copySummary}
                                className="mt-6 w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white py-3 rounded-xl flex items-center justify-center gap-2"
                            >
                                <BiCopy />
                                Copy Calculation Summary
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}