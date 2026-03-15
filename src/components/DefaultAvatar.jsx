import React from 'react';

/**
 * Shows a gender-based default avatar icon when no profile photo is uploaded.
 * gender: 'Male' | 'Female' | undefined
 * size: 'sm' | 'md' | 'lg'  (controls icon size)
 */
const DefaultAvatar = ({ gender, size = 'md', className = '' }) => {
    const isFemale = gender?.toLowerCase() === 'female';

    const iconSizes = {
        sm: { outer: 'w-5 h-5', inner: 16 },
        md: { outer: 'w-7 h-7', inner: 22 },
        lg: { outer: 'w-10 h-10', inner: 32 },
    };
    const { inner } = iconSizes[size] || iconSizes.md;

    if (isFemale) {
        // Female icon - SVG silhouette with purple/pink tones
        return (
            <div className={`flex items-center justify-center w-full h-full ${className}`}>
                <svg
                    width={inner}
                    height={inner}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Head */}
                    <circle cx="12" cy="7" r="4" fill="#a855f7" />
                    {/* Hair / accents */}
                    <path d="M8 6.5C8 4.3 9.8 2.5 12 2.5S16 4.3 16 6.5" stroke="#7c3aed" strokeWidth="1.2" fill="none" />
                    {/* Body / dress shape */}
                    <path
                        d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                        fill="#d8b4fe"
                    />
                    <path
                        d="M9 13.5 Q12 18 15 13.5"
                        stroke="#a855f7"
                        strokeWidth="1"
                        fill="#e9d5ff"
                    />
                </svg>
            </div>
        );
    }

    // Male icon - SVG silhouette with blue tones
    return (
        <div className={`flex items-center justify-center w-full h-full ${className}`}>
            <svg
                width={inner}
                height={inner}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Head */}
                <circle cx="12" cy="7" r="4" fill="#3b82f6" />
                {/* Body */}
                <path
                    d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                    fill="#93c5fd"
                />
            </svg>
        </div>
    );
};

export default DefaultAvatar;
