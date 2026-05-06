import React, { useState } from "react";
import { FaBaby, FaHeartbeat } from "react-icons/fa";
import { BiInfoCircle, BiCalculator, BiCalendar } from "react-icons/bi";

const milestones = [
    { week: 6,  label: "Heartbeat detectable" },
    { week: 10, label: "Vital organs formed" },
    { week: 12, label: "End of 1st Trimester" },
    { week: 20, label: "Anatomy scan / gender" },
    { week: 24, label: "Viability milestone" },
    { week: 27, label: "End of 2nd Trimester" },
    { week: 37, label: "Full term begins" },
    { week: 40, label: "Due Date 🎉" },
];

const trimesterColors = {
    "1st Trimester": { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700", bar: "bg-blue-400", badge: "badge-primary" },
    "2nd Trimester": { bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-700", bar: "bg-amber-400", badge: "badge-warning" },
    "3rd Trimester": { bg: "bg-rose-50",  border: "border-rose-300",  text: "text-rose-700",  bar: "bg-rose-400",  badge: "badge-error" },
};

const PregnancyDueDateCalculator = () => {
    const [method, setMethod] = useState("lmp");
    const [lmpDate, setLmpDate] = useState("");
    const [conceptionDate, setConceptionDate] = useState("");
    const [cycleLength, setCycleLength] = useState(28);
    const [result, setResult] = useState(null);

    const calculateDueDate = () => {
        let baseDate;
        if (method === "lmp" && lmpDate) {
            baseDate = new Date(lmpDate);
            baseDate.setDate(baseDate.getDate() + 280 + (cycleLength - 28));
        } else if (method === "conception" && conceptionDate) {
            baseDate = new Date(conceptionDate);
            baseDate.setDate(baseDate.getDate() + 266);
        } else return;

        const today = new Date();
        const refDate = new Date(method === "lmp" ? lmpDate : conceptionDate);
        const diffTime = today - refDate;
        const daysPassed = Math.floor(diffTime / 86400000);
        const weeks = Math.floor(daysPassed / 7);
        const days = daysPassed % 7;
        const totalPregnancyDays = 280;
        const progressPercent = Math.min(100, Math.round((daysPassed / totalPregnancyDays) * 100));
        const trimester = weeks < 13 ? "1st Trimester" : weeks < 27 ? "2nd Trimester" : "3rd Trimester";
        const daysRemaining = Math.max(0, Math.ceil((baseDate - today) / 86400000));

        // Upcoming milestone
        const nextMilestone = milestones.find(m => m.week > weeks);

        setResult({ dueDate: baseDate.toDateString(), weeks, days, trimester, daysRemaining, progressPercent, nextMilestone });
    };

    const tc = result ? (trimesterColors[result.trimester] || trimesterColors["1st Trimester"]) : null;

    return (
        <div className="tool-page">
            <div className="max-w-2xl mx-auto">
                <div className="tool-card">
                    <div className="tool-header">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <FaBaby className="text-3xl text-[var(--primary)]" />
                            <h1 className="text-2xl font-black">Pregnancy Due Date Calculator</h1>
                        </div>
                        <p>Estimate your delivery date, trimester, and milestones</p>
                    </div>

                    <div className="tool-body space-y-4">
                        {/* Method toggle */}
                        <div className="grid grid-cols-2 gap-2">
                            {["lmp", "conception"].map(m => (
                                <button key={m} onClick={() => setMethod(m)}
                                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${method === m ? 'bg-[var(--primary)] text-slate-900 border-transparent' : 'bg-white border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)]'}`}>
                                    {m === "lmp" ? "Last Period (LMP)" : "Conception Date"}
                                </button>
                            ))}
                        </div>

                        {method === "lmp" && (
                            <div className="grid grid-cols-2 gap-4 animate-slide-up">
                                <div className="form-group">
                                    <label className="form-label flex items-center gap-1"><BiCalendar /> LMP Date</label>
                                    <input type="date" value={lmpDate} onChange={e => setLmpDate(e.target.value)} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Cycle Length (days)</label>
                                    <input type="number" value={cycleLength} onChange={e => setCycleLength(e.target.value)}
                                        className="form-input" min={20} max={45} />
                                </div>
                            </div>
                        )}

                        {method === "conception" && (
                            <div className="form-group animate-slide-up">
                                <label className="form-label flex items-center gap-1"><BiCalendar /> Conception Date</label>
                                <input type="date" value={conceptionDate} onChange={e => setConceptionDate(e.target.value)} className="form-input" />
                            </div>
                        )}

                        <button onClick={calculateDueDate} className="btn-primary py-3.5 text-base">
                            <BiCalculator /> Calculate Due Date
                        </button>

                        {result && (
                            <div className="space-y-4 animate-slide-up">
                                <div className="section-divider" />

                                {/* Due date hero */}
                                <div className="result-card result-card-primary text-center py-5">
                                    <p className="result-label text-center mb-1">Estimated Due Date</p>
                                    <p className="text-3xl font-black text-[var(--primary-dark)]">{result.dueDate}</p>
                                    <p className="text-[var(--text-muted)] text-sm mt-1">
                                        {result.daysRemaining > 0 ? `${result.daysRemaining} days remaining` : "Due date has passed"}
                                    </p>
                                </div>

                                {/* Progress */}
                                <div>
                                    <div className="flex justify-between text-sm font-semibold mb-2">
                                        <span className="text-[var(--text-secondary)]">Week {result.weeks}, Day {result.days}</span>
                                        <span className={tc.text}>{result.trimester} • {result.progressPercent}%</span>
                                    </div>
                                    <div className="progress-bar-track" style={{ height: '10px' }}>
                                        <div className={`h-full rounded-full ${tc.bar} transition-all duration-700`}
                                            style={{ width: `${result.progressPercent}%` }} />
                                    </div>
                                    <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                                        <span>Week 0</span><span>Week 13</span><span>Week 27</span><span>Week 40</span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className={`result-card border ${tc.border} ${tc.bg}`}>
                                        <p className="result-label flex items-center gap-1"><FaHeartbeat className={tc.text} /> Trimester</p>
                                        <p className={`font-bold text-lg ${tc.text}`}>{result.trimester}</p>
                                    </div>
                                    <div className="result-card result-card-info">
                                        <p className="result-label">Progress</p>
                                        <p className="font-bold text-lg text-[var(--info)]">Week {result.weeks}.{result.days}</p>
                                    </div>
                                </div>

                                {/* Upcoming milestone */}
                                {result.nextMilestone && (
                                    <div className="result-card result-card-success">
                                        <p className="result-label flex items-center gap-1">⭐ Next Milestone</p>
                                        <p className="font-bold text-[var(--success)]">{result.nextMilestone.label}</p>
                                        <p className="text-sm text-[var(--text-muted)] mt-0.5">
                                            Week {result.nextMilestone.week} — in {(result.nextMilestone.week - result.weeks)} weeks
                                        </p>
                                    </div>
                                )}

                                {/* Milestone timeline */}
                                <div className="bg-slate-50 rounded-xl border border-[var(--border)] p-4">
                                    <p className="form-label mb-3">Pregnancy Milestones</p>
                                    <div className="space-y-2">
                                        {milestones.map((m, i) => (
                                            <div key={i} className={`flex items-center gap-3 text-sm transition-all ${result.weeks >= m.week ? 'opacity-100' : 'opacity-40'}`}>
                                                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${result.weeks >= m.week ? 'bg-[var(--primary)]' : 'bg-slate-300'}`} />
                                                <span className={`font-semibold ${result.weeks >= m.week ? 'text-[var(--primary-dark)]' : 'text-[var(--text-muted)]'}`}>Week {m.week}</span>
                                                <span className="text-[var(--text-secondary)]">{m.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="info-box warning">
                            <BiInfoCircle className="flex-shrink-0 mt-0.5" />
                            <span>Estimates only. Always consult your OB/GYN for accurate medical advice and due date confirmation.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PregnancyDueDateCalculator;