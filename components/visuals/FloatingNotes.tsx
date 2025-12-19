
import React, { memo } from 'react';

// Optimized component for floating notes to prevent re-renders
const FloatingNotes = memo(({ count }: { count: number }) => {
    const getPosition = (index: number) => {
        // Distribute notes into 4 zones to avoid the center
        // Zone 1: Left side
        if (index % 4 === 0) {
            return { top: `${Math.random() * 90}%`, left: `${Math.random() * 20}%` };
        }
        // Zone 2: Right side
        if (index % 4 === 1) {
            return { top: `${Math.random() * 90}%`, left: `${80 + Math.random() * 15}%` };
        }
        // Zone 3: Top center
        if (index % 4 === 2) {
            return { top: `${Math.random() * 25}%`, left: `${20 + Math.random() * 60}%` };
        }
        // Zone 4: Bottom center
        return { top: `${75 + Math.random() * 20}%`, left: `${20 + Math.random() * 60}%` };
    };

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
             {Array.from({ length: count }).map((_, i) => {
                const position = getPosition(i);
                return (
                    <div key={i} className="floating-element" style={{
                        top: position.top, left: position.left,
                        width: `${Math.random() * 40 + 20}px`, height: `${Math.random() * 40 + 20}px`,
                        color: ['#F472B6', '#7C3AED', '#FBBF24', '#8B5CF6', '#34D399'][Math.floor(Math.random() * 5)],
                        animationDuration: `${Math.random() * 10 + 8}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        opacity: Math.random() * 0.4 + 0.3
                    }}>
                        {Math.random() > 0.5 ? <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg> : <svg fill="currentColor" viewBox="0 0 24 24"><path d="M20 4h-9c-1.103 0-2 .897-2 2v9.185A2.992 2.992 0 0 0 7 15c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3V8h8v7.185A2.992 2.992 0 0 0 16 15c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3V6h1v-2z"/></svg>}
                    </div>
                );
             })}
        </div>
    );
});

export default FloatingNotes;
