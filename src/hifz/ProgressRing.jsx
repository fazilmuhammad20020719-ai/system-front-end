import React from 'react';

const ProgressRing = ({ value = 0 }) => {
    const pct = Math.min((value / 30) * 100, 100);
    const r = 18;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return (
        <svg width={44} height={44} viewBox="0 0 44 44" className="rotate-[-90deg]">
            <circle cx={22} cy={22} r={r} fill="none" stroke="#e5e7eb" strokeWidth={4} />
            <circle cx={22} cy={22} r={r} fill="none" stroke={pct >= 80 ? '#16a34a' : pct >= 40 ? '#2563eb' : '#f59e0b'} strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
            <text x={22} y={22} textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight={700} fill="#374151" transform="rotate(90,22,22)">{value}/30</text>
        </svg>
    );
};

export default ProgressRing;
