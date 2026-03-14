import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Check } from 'lucide-react';

/**
 * Image cropper that matches the reference UI:
 * - Full-bleed image with square crop box + 3×3 grid
 * - Dark overlay outside the crop square
 * - Bottom bar: Cancel | zoom slider | Save
 */
const ImageCropperModal = ({ imageSrc, onCropComplete, onCancel }) => {
    const containerRef = useRef(null);

    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [imgNaturalSize, setImgNaturalSize] = useState({ w: 0, h: 0 });
    const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

    // Preload to get natural size
    useEffect(() => {
        const img = new Image();
        img.onload = () => setImgNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
        img.src = imageSrc;
    }, [imageSrc]);

    // Measure container
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const measure = () => setContainerSize({ w: el.clientWidth, h: el.clientHeight });
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        measure();
        return () => ro.disconnect();
    }, []);

    // Crop box = largest square that fits with padding
    const cropSize = containerSize.w > 0
        ? Math.min(containerSize.w, containerSize.h) - 48
        : 300;

    // ── DRAG ──
    const onMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    };
    const onTouchStart = (e) => {
        setIsDragging(true);
        const t = e.touches[0];
        dragStart.current = { x: t.clientX - offset.x, y: t.clientY - offset.y };
    };
    const onMouseMove = useCallback((e) => {
        if (!isDragging || !dragStart.current) return;
        setOffset({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
    }, [isDragging]);
    const onTouchMove = useCallback((e) => {
        if (!isDragging || !dragStart.current) return;
        const t = e.touches[0];
        setOffset({ x: t.clientX - dragStart.current.x, y: t.clientY - dragStart.current.y });
    }, [isDragging]);
    const onDragEnd = () => setIsDragging(false);

    // Wheel zoom
    const onWheel = useCallback((e) => {
        e.preventDefault();
        setZoom(z => Math.min(3, Math.max(0.1, z - e.deltaY * 0.001)));
    }, []);

    // ── SAVE ──
    const handleSave = async () => {
        setIsProcessing(true);
        try {
            const cw = containerSize.w || 400;
            const ch = containerSize.h || 400;
            const cs = cropSize;

            const circleLeft = (cw - cs) / 2;
            const circleTop  = (ch - cs) / 2;

            const imgDisplayW = imgNaturalSize.w * zoom;
            const imgDisplayH = imgNaturalSize.h * zoom;
            const imgLeft = cw / 2 + offset.x - imgDisplayW / 2;
            const imgTop  = ch / 2 + offset.y - imgDisplayH / 2;

            const srcX = (circleLeft - imgLeft) / zoom;
            const srcY = (circleTop  - imgTop)  / zoom;
            const srcW = cs / zoom;
            const srcH = cs / zoom;

            const outSize = 400;
            const canvas = document.createElement('canvas');
            canvas.width  = outSize;
            canvas.height = outSize;
            const ctx = canvas.getContext('2d');

            const img = new Image();
            img.crossOrigin = 'anonymous';
            await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = imageSrc; });

            ctx.drawImage(
                img,
                Math.max(0, srcX),
                Math.max(0, srcY),
                Math.min(srcW, imgNaturalSize.w - Math.max(0, srcX)),
                Math.min(srcH, imgNaturalSize.h - Math.max(0, srcY)),
                0, 0, outSize, outSize
            );

            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], 'profile_photo.jpg', { type: 'image/jpeg' });
                    onCropComplete(file);
                }
                setIsProcessing(false);
            }, 'image/jpeg', 0.92);
        } catch (e) {
            console.error(e);
            setIsProcessing(false);
        }
    };

    const cw = containerSize.w;
    const ch = containerSize.h;
    const cx = cw / 2;
    const cy = ch / 2;
    const half = cropSize / 2;

    // Slider fill %
    const sliderPct = ((zoom - 0.1) / 2.9) * 100;

    return (
        <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)' }}
        >
            {/* ── Modal Card ── */}
            <div
                className="relative flex flex-col overflow-hidden"
                style={{
                    width: 'min(480px, 96vw)',
                    background: '#18181b',
                    borderRadius: 18,
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
                }}
            >
                {/* ── Crop Canvas ── */}
                <div
                    ref={containerRef}
                    style={{
                        width: '100%',
                        height: 420,
                        position: 'relative',
                        overflow: 'hidden',
                        background: '#0f0f0f',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        userSelect: 'none',
                    }}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onDragEnd}
                    onMouseLeave={onDragEnd}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onDragEnd}
                    onWheel={onWheel}
                >
                    {/* Image */}
                    <img
                        src={imageSrc}
                        alt="crop"
                        draggable={false}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})`,
                            transformOrigin: 'center',
                            maxWidth: 'none',
                            pointerEvents: 'none',
                        }}
                    />

                    {/* SVG overlay: dark mask + grid lines */}
                    {cw > 0 && ch > 0 && (
                        <svg
                            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
                            width={cw}
                            height={ch}
                            viewBox={`0 0 ${cw} ${ch}`}
                        >
                            <defs>
                                <mask id="squareMask">
                                    <rect width={cw} height={ch} fill="white" />
                                    <rect
                                        x={cx - half} y={cy - half}
                                        width={cropSize} height={cropSize}
                                        fill="black"
                                    />
                                </mask>
                            </defs>

                            {/* Dark vignette outside the box */}
                            <rect
                                width={cw} height={ch}
                                fill="rgba(0,0,0,0.58)"
                                mask="url(#squareMask)"
                            />

                            {/* Crop box border */}
                            <rect
                                x={cx - half} y={cy - half}
                                width={cropSize} height={cropSize}
                                fill="none"
                                stroke="rgba(255,255,255,0.85)"
                                strokeWidth="1.2"
                            />

                            {/* 3×3 rule-of-thirds grid */}
                            {[1/3, 2/3].map((t, i) => (
                                <g key={i}>
                                    {/* Horizontal */}
                                    <line
                                        x1={cx - half} y1={cy - half + t * cropSize}
                                        x2={cx + half} y2={cy - half + t * cropSize}
                                        stroke="rgba(255,255,255,0.32)" strokeWidth="0.7"
                                    />
                                    {/* Vertical */}
                                    <line
                                        x1={cx - half + t * cropSize} y1={cy - half}
                                        x2={cx - half + t * cropSize} y2={cy + half}
                                        stroke="rgba(255,255,255,0.32)" strokeWidth="0.7"
                                    />
                                </g>
                            ))}

                            {/* Corner brackets */}
                            {[
                                [cx - half, cy - half, 1, 1],
                                [cx + half, cy - half, -1, 1],
                                [cx - half, cy + half, 1, -1],
                                [cx + half, cy + half, -1, -1],
                            ].map(([bx, by, sx, sy], i) => (
                                <g key={i} stroke="white" strokeWidth="2.2" strokeLinecap="round">
                                    <line x1={bx} y1={by} x2={bx + sx * 18} y2={by} />
                                    <line x1={bx} y1={by} x2={bx} y2={by + sy * 18} />
                                </g>
                            ))}
                        </svg>
                    )}
                </div>

                {/* ── Bottom Bar ── */}
                <div
                    className="flex items-center gap-4 px-5 py-4"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
                >
                    {/* Cancel */}
                    <button
                        onClick={onCancel}
                        disabled={isProcessing}
                        className="flex items-center gap-1.5 font-medium text-sm transition-opacity disabled:opacity-40"
                        style={{ color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'white'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
                    >
                        <X size={14} strokeWidth={2.5} />
                        Cancel
                    </button>

                    {/* Zoom Slider */}
                    <div className="flex-1 flex items-center">
                        <input
                            type="range"
                            value={zoom}
                            min={0.1}
                            max={3}
                            step={0.01}
                            onChange={e => setZoom(Number(e.target.value))}
                            className="w-full appearance-none h-1 rounded-full cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #22c55e 0%, #22c55e ${sliderPct}%, rgba(255,255,255,0.15) ${sliderPct}%, rgba(255,255,255,0.15) 100%)`,
                                accentColor: '#22c55e',
                            }}
                        />
                    </div>

                    {/* Save */}
                    <button
                        onClick={handleSave}
                        disabled={isProcessing}
                        className="flex items-center gap-1.5 font-bold text-sm text-white px-5 py-2 rounded-full transition-all disabled:opacity-60"
                        style={{ background: '#22c55e', boxShadow: '0 4px 14px rgba(34,197,94,0.4)', whiteSpace: 'nowrap' }}
                        onMouseEnter={e => !isProcessing && (e.currentTarget.style.background = '#16a34a')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#22c55e')}
                    >
                        {isProcessing ? (
                            <span
                                className="w-4 h-4 rounded-full border-2 animate-spin"
                                style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}
                            />
                        ) : (
                            <><Check size={14} strokeWidth={3} /><span>Save</span></>
                        )}
                    </button>
                </div>
            </div>

            {/* Hint text below modal */}
            <p
                className="mt-3 text-xs"
                style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.01em' }}
            >
                Adjust picture to fit the square.
            </p>
        </div>
    );
};

export default ImageCropperModal;
