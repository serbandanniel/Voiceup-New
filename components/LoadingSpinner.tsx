
import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="relative w-20 h-20">
                {/* Outer Ring */}
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                {/* Inner Spinning Ring */}
                <div className="absolute inset-0 border-4 border-brand-purple rounded-full border-t-transparent animate-spin"></div>
                {/* Center Pulse */}
                <div className="absolute inset-0 m-auto w-8 h-8 bg-brand-pink rounded-full animate-pulse shadow-lg shadow-brand-pink/50"></div>
            </div>
            <p className="mt-6 text-brand-dark font-bold text-lg animate-pulse">Se încarcă...</p>
        </div>
    );
};

export default LoadingSpinner;
