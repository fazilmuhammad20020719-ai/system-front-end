const Loader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50">
            <div className="flex flex-col items-center gap-3">
                <svg
                    className="w-12 h-12 text-green-600 animate-[spin_1s_steps(12)_infinite]"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {[...Array(12)].map((_, i) => {
                        const opacity = Math.max(0.2, 1 - (i * 0.08));
                        return (
                            <line
                                key={i}
                                x1="12"
                                y1="2"
                                x2="12"
                                y2="6.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                style={{
                                    transformOrigin: '12px 12px',
                                    transform: `rotate(${i * 30}deg)`,
                                    opacity: opacity
                                }}
                            />
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default Loader;
