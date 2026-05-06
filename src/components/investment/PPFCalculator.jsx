import React, { useState } from "react";

export default function PPFCalculator() {
    const [yearlyInvestment, setYearlyInvestment] = useState(150000);
    const [interestRate, setInterestRate] = useState(7.1);
    const [years, setYears] = useState(15);

    const calculatePPF = () => {
        let balance = 0;
        let totalInvested = 0;

        for (let i = 0; i < years; i++) {
            totalInvested += Number(yearlyInvestment);
            balance = (balance + Number(yearlyInvestment)) * (1 + interestRate / 100);
        }

        return {
            totalInvested,
            maturityAmount: Math.round(balance),
            interestEarned: Math.round(balance - totalInvested),
        };
    };

    const result = calculatePPF();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-6">
            <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-6 border border-[var(--border)]">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 text-center">
                    PPF Calculator
                </h2>

                {/* Input Fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-1">
                            Yearly Investment (₹)
                        </label>
                        <input
                            type="number"
                            value={yearlyInvestment}
                            onChange={(e) => setYearlyInvestment(e.target.value)}
                            className="w-full p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-1">
                            Interest Rate (%)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={interestRate}
                            onChange={(e) => setInterestRate(e.target.value)}
                            className="w-full p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-1">
                            Time Period (Years)
                        </label>
                        <input
                            type="number"
                            value={years}
                            onChange={(e) => setYears(e.target.value)}
                            className="w-full p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="mt-6 p-4 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                        Results
                    </h3>

                    <div className="space-y-2 text-sm">
                        <p className="flex justify-between">
                            <span className="text-[var(--text-secondary)]">Total Investment:</span>
                            <span className="font-medium text-[var(--text-primary)]">
                                ₹{result.totalInvested}
                            </span>
                        </p>

                        <p className="flex justify-between">
                            <span className="text-[var(--text-secondary)]">Interest Earned:</span>
                            <span className="font-medium text-[var(--success)]">
                                ₹{result.interestEarned}
                            </span>
                        </p>

                        <p className="flex justify-between">
                            <span className="text-[var(--text-secondary)]">Maturity Amount:</span>
                            <span className="font-bold text-[var(--primary-dark)]">
                                ₹{result.maturityAmount}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-xs text-center text-[var(--text-secondary)] mt-4">
                    *Calculation based on yearly compounding
                </p>
            </div>
        </div>
    );
}
