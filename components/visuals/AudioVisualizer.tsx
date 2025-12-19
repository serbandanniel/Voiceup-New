
import React, { memo } from 'react';

const AudioVisualizer = memo(({ height }: { height: number }) => {
    const colors = ['#F472B6', '#7C3AED', '#FBBF24', '#8B5CF6', '#a855f7'];
    return (
        <div className="audio-visualizer" style={{ height: `${height}px` }}>
            {Array.from({ length: 60 }).map((_, i) => (
                <div 
                    key={i} 
                    className="visualizer-bar" 
                    style={{ 
                        animationDelay: `${Math.random() * 1.5}s`,
                        backgroundColor: colors[Math.floor(Math.random() * colors.length)]
                    }}
                ></div>
            ))}
        </div>
    );
});

export default AudioVisualizer;
