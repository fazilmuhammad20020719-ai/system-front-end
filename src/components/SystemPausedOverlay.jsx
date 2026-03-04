import { useEffect, useState, useRef } from 'react';
import { API_URL } from '../config';

/**
 * SystemPausedOverlay
 * Polls /api/controller/system/status every 10 seconds.
 * When the system is paused, renders a full-screen blur/darken overlay
 * that blocks ALL user interaction with the app behind it.
 * Does NOT render on /controller/* routes.
 */
const SystemPausedOverlay = () => {
    const [paused, setPaused] = useState(false);
    const intervalRef = useRef(null);

    // Don't show on controller pages
    if (window.location.pathname.startsWith('/controller')) return null;

    const checkStatus = async () => {
        try {
            const res = await fetch(`${API_URL}/api/controller/system/status/public`);
            if (res.ok) {
                const data = await res.json();
                setPaused(!!data.paused);
            } else if (res.status === 503) {
                // 503 from maintenance middleware = paused
                const data = await res.json().catch(() => ({}));
                if (data.paused) setPaused(true);
            }
        } catch {
            // Network error — keep current state
        }
    };

    useEffect(() => {
        checkStatus();
        intervalRef.current = setInterval(checkStatus, 10000);
        return () => clearInterval(intervalRef.current);
    }, []);

    if (!paused) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                // Dark tinted blur
                backdropFilter: 'blur(18px) brightness(0.35)',
                WebkitBackdropFilter: 'blur(18px) brightness(0.35)',
                background: 'rgba(3, 7, 18, 0.72)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Inter', 'JetBrains Mono', monospace",
                // Block ALL pointer events on the app
                pointerEvents: 'all',
                userSelect: 'none',
            }}
        >
            {/* Prevent any key/scroll events escaping */}
            <div
                onKeyDown={e => e.stopPropagation()}
                onScroll={e => e.stopPropagation()}
                style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
            />

            {/* Card */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                background: 'rgba(17, 24, 39, 0.9)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '20px',
                boxShadow: '0 0 80px rgba(239, 68, 68, 0.15), 0 32px 64px rgba(0,0,0,0.6)',
                padding: '48px 52px',
                maxWidth: '440px',
                width: '90%',
                textAlign: 'center',
            }}>
                {/* Lock icon */}
                <div style={{
                    width: '72px', height: '72px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px',
                    animation: 'sys-pulse 2.5s ease-in-out infinite',
                }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                </div>

                {/* Status badge */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '20px', padding: '4px 14px',
                    marginBottom: '20px',
                }}>
                    <span style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        background: '#f87171',
                        display: 'inline-block',
                        animation: 'sys-pulse 1.5s ease-in-out infinite',
                    }} />
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#f87171', fontWeight: 600, letterSpacing: '0.08em' }}>
                        SYSTEM LOCKED
                    </span>
                </div>

                {/* Title */}
                <h1 style={{
                    fontSize: '22px', fontWeight: 700,
                    color: '#f1f5f9', margin: '0 0 12px',
                    letterSpacing: '-0.02em', lineHeight: 1.3,
                    fontFamily: "'Inter', sans-serif",
                }}>
                    System Temporarily Paused
                </h1>

                {/* Message */}
                <p style={{
                    fontSize: '14px', color: '#94a3b8',
                    lineHeight: 1.65, margin: '0 0 28px',
                    fontFamily: "'Inter', sans-serif",
                }}>
                    The system is currently under maintenance by the administrator.
                    Please wait — access will be restored shortly.
                </p>

                {/* Divider */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0 0 20px' }} />

                {/* Footer note */}
                <p style={{
                    fontSize: '12px', color: '#475569',
                    fontFamily: 'monospace',
                    letterSpacing: '0.02em',
                }}>
                    This page will automatically unlock when service resumes
                </p>

                {/* Animated dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
                    {[0, 1, 2].map(i => (
                        <span key={i} style={{
                            width: '6px', height: '6px',
                            borderRadius: '50%',
                            background: 'rgba(239, 68, 68, 0.5)',
                            display: 'inline-block',
                            animation: `sys-dot 1.5s ease-in-out infinite ${i * 0.25}s`,
                        }} />
                    ))}
                </div>
            </div>

            {/* Keyframes injected inline */}
            <style>{`
                @keyframes sys-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                @keyframes sys-dot {
                    0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
                    40% { transform: scale(1.2); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default SystemPausedOverlay;
