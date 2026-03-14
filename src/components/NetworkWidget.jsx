import { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';

// ── Network speed hook ──────────────────────────────────────────
const useNetworkSpeed = () => {
    const [mbps, setMbps] = useState(null);
    const [status, setStatus] = useState('measuring');

    const measure = async () => {
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (conn?.downlink !== undefined && conn.downlink > 0) {
            const speed = conn.downlink;
            setMbps(speed);
            setStatus(speed >= 20 ? 'good' : speed >= 5 ? 'medium' : 'low');
        }
        try {
            const FILE_SIZE_KB = 8;
            const url = `https://httpbin.org/bytes/${FILE_SIZE_KB * 1024}?t=${Date.now()}`;
            const start = performance.now();
            const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(8000) });
            await res.arrayBuffer();
            const duration = (performance.now() - start) / 1000;
            const bits = FILE_SIZE_KB * 1024 * 8;
            const speed = parseFloat(((bits / duration) / 1_000_000).toFixed(1));
            setMbps(speed);
            setStatus(speed >= 20 ? 'good' : speed >= 5 ? 'medium' : 'low');
        } catch {
            if (!navigator.onLine) { setMbps(0); setStatus('offline'); }
        }
    };

    useEffect(() => {
        measure();
        const id = setInterval(measure, 10_000);
        const onOnline = () => measure();
        const onOffline = () => { setMbps(0); setStatus('offline'); };
        window.addEventListener('online', onOnline);
        window.addEventListener('offline', onOffline);
        return () => {
            clearInterval(id);
            window.removeEventListener('online', onOnline);
            window.removeEventListener('offline', onOffline);
        };
    }, []);

    return { mbps, status };
};

const SIGNAL_STYLES = {
    good:      { color: '#16a34a', label: 'Good',     bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
    medium:    { color: '#ca8a04', label: 'Medium',   bg: '#fefce8', border: '#fde68a', text: '#a16207' },
    low:       { color: '#dc2626', label: 'Low',      bg: '#fef2f2', border: '#fecaca', text: '#b91c1c' },
    offline:   { color: '#dc2626', label: 'Offline',  bg: '#fef2f2', border: '#fecaca', text: '#b91c1c' },
    measuring: { color: '#6b7280', label: '…',        bg: '#f9fafb', border: '#e5e7eb', text: '#4b5563' },
};

/**
 * NetworkWidget — shows signal status + Mbps in a topbar pill.
 * Drop this anywhere in a header for the network speed indicator.
 */
const NetworkWidget = () => {
    const { mbps, status } = useNetworkSpeed();
    const sig = SIGNAL_STYLES[status] ?? SIGNAL_STYLES.measuring;

    return (
        <>
            <style>{`
                @keyframes wifi-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
            `}</style>
            <div
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-500"
                style={{ background: sig.bg, borderColor: sig.border }}
                title={`Network: ${sig.label}${mbps !== null ? ` — ${mbps} Mbps` : ''}`}
            >
                <Wifi
                    size={15}
                    style={{
                        color: sig.color,
                        animation: status === 'measuring' ? 'wifi-pulse 1.4s ease-in-out infinite' : 'none',
                        transition: 'color 0.5s',
                    }}
                />
                {/* Signal bars */}
                <div className="flex items-end gap-[2px]">
                    {[0.45, 0.7, 1].map((h, i) => {
                        const filled =
                            (status === 'good' && i <= 2) ||
                            (status === 'medium' && i <= 1) ||
                            (status === 'low' && i === 0);
                        return (
                            <div
                                key={i}
                                style={{
                                    width: '3px',
                                    height: `${10 * h}px`,
                                    borderRadius: '2px',
                                    background: filled ? sig.color : '#d1d5db',
                                    transition: 'background 0.5s',
                                }}
                            />
                        );
                    })}
                </div>
                <span style={{ color: sig.text, transition: 'color 0.5s' }}>
                    {status === 'measuring'
                        ? 'Checking…'
                        : status === 'offline'
                            ? 'Offline'
                            : `${mbps} Mbps`}
                </span>
            </div>
        </>
    );
};

export default NetworkWidget;
