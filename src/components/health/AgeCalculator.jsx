import React, { useState } from "react";
import { FaBirthdayCake, FaCalendarAlt, FaStar } from "react-icons/fa";
import { BiCalendar, BiCalculator, BiInfoCircle } from "react-icons/bi";

const getZodiac = (month, day) => {
    const signs = [
        { sign: "Capricorn", symbol: "♑", end: [1, 19] },
        { sign: "Aquarius",  symbol: "♒", end: [2, 18] },
        { sign: "Pisces",    symbol: "♓", end: [3, 20] },
        { sign: "Aries",     symbol: "♈", end: [4, 19] },
        { sign: "Taurus",    symbol: "♉", end: [5, 20] },
        { sign: "Gemini",    symbol: "♊", end: [6, 20] },
        { sign: "Cancer",    symbol: "♋", end: [7, 22] },
        { sign: "Leo",       symbol: "♌", end: [8, 22] },
        { sign: "Virgo",     symbol: "♍", end: [9, 22] },
        { sign: "Libra",     symbol: "♎", end: [10, 22] },
        { sign: "Scorpio",   symbol: "♏", end: [11, 21] },
        { sign: "Sagittarius",symbol:"♐", end: [12, 21] },
        { sign: "Capricorn", symbol: "♑", end: [12, 31] },
    ];
    return signs.find(s => month < s.end[0] || (month === s.end[0] && day <= s.end[1]));
};

const AgeCalculator = () => {
    const [dob, setDob] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [result, setResult] = useState(null);

    const calculateAge = () => {
        if (!dob) return;
        const birthDate = new Date(dob);
        const today = targetDate ? new Date(targetDate) : new Date();

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) { months--; days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
        if (months < 0) { years--; months += 12; }

        const diffTime = today - birthDate;
        const totalDays = Math.floor(diffTime / 86400000);
        const totalWeeks = Math.floor(totalDays / 7);
        const totalHours = Math.floor(diffTime / 3600000);
        const totalMonths = years * 12 + months;

        const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (nextBirthday <= today) nextBirthday.setFullYear(today.getFullYear() + 1);
        const daysToBirthday = Math.ceil((nextBirthday - today) / 86400000);
        const nextAge = years + 1;

        const zodiac = getZodiac(birthDate.getMonth() + 1, birthDate.getDate());

        setResult({ years, months, days, totalDays, totalWeeks, totalMonths, totalHours, nextBirthday: nextBirthday.toDateString(), daysToBirthday, nextAge, zodiac });
    };

    return (
        <div className="tool-page">
            <div className="max-w-2xl mx-auto">
                <div className="tool-card">
                    <div className="tool-header">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <FaBirthdayCake className="text-3xl text-[var(--primary)]" />
                            <h1 className="text-3xl font-black">Age Calculator</h1>
                        </div>
                        <p>Find your exact age with next birthday countdown & zodiac sign</p>
                    </div>

                    <div className="tool-body space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label flex items-center gap-1"><FaBirthdayCake /> Date of Birth</label>
                                <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                                    className="form-input" max={new Date().toISOString().split("T")[0]} />
                            </div>
                            <div className="form-group">
                                <label className="form-label flex items-center gap-1"><BiCalendar /> Age At Date <span className="text-[var(--text-muted)] normal-case font-normal">(optional)</span></label>
                                <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="form-input" />
                            </div>
                        </div>

                        <button onClick={calculateAge} className="btn-primary py-3.5 text-base">
                            <BiCalculator /> Calculate Age
                        </button>

                        {result && (
                            <div className="space-y-4 animate-slide-up">
                                <div className="section-divider" />

                                {/* Main age display */}
                                <div className="result-card result-card-primary text-center py-5">
                                    <p className="result-label text-center mb-2">Your Age</p>
                                    <p className="text-5xl font-black text-[var(--primary-dark)]">{result.years}</p>
                                    <p className="text-[var(--text-secondary)] mt-1">
                                        years, <strong>{result.months}</strong> months & <strong>{result.days}</strong> days
                                    </p>
                                </div>

                                {/* Stats grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="result-card result-card-info">
                                        <p className="result-label">Total Days Lived</p>
                                        <p className="result-value" style={{ fontSize: '1.3rem', color: 'var(--info)' }}>
                                            {result.totalDays.toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                    <div className="result-card result-card-info">
                                        <p className="result-label">Total Weeks</p>
                                        <p className="result-value" style={{ fontSize: '1.3rem', color: 'var(--info)' }}>
                                            {result.totalWeeks.toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                    <div className="result-card result-card-info">
                                        <p className="result-label">Total Months</p>
                                        <p className="result-value" style={{ fontSize: '1.3rem', color: 'var(--info)' }}>
                                            {result.totalMonths.toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                    <div className="result-card result-card-info">
                                        <p className="result-label">Total Hours</p>
                                        <p className="result-value" style={{ fontSize: '1.3rem', color: 'var(--info)' }}>
                                            {result.totalHours.toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </div>

                                {/* Birthday countdown */}
                                <div className="result-card result-card-success">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="result-label flex items-center gap-1"><FaCalendarAlt /> Next Birthday</p>
                                            <p className="font-bold text-[var(--success)]">{result.nextBirthday}</p>
                                            <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                                                Turning <strong>{result.nextAge}</strong>
                                            </p>
                                        </div>
                                        <div className="text-center flex-shrink-0">
                                            <p className="text-3xl font-black text-[var(--success)]">{result.daysToBirthday}</p>
                                            <p className="text-xs text-[var(--text-muted)]">days away</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Zodiac */}
                                {result.zodiac && (
                                    <div className="result-card result-card-warning flex items-center gap-4">
                                        <span className="text-5xl">{result.zodiac.symbol}</span>
                                        <div>
                                            <p className="result-label flex items-center gap-1"><FaStar /> Zodiac Sign</p>
                                            <p className="text-xl font-bold text-[var(--text-primary)]">{result.zodiac.sign}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="info-box primary">
                            <BiInfoCircle className="flex-shrink-0 mt-0.5" />
                            <span>Age is calculated based on the Gregorian calendar. Zodiac sign is based on Western astrology.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgeCalculator;