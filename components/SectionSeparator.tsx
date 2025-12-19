
import React from 'react';
import { SeparatorConfig } from '../types';

interface SectionSeparatorProps {
    config: SeparatorConfig;
}

const SectionSeparator: React.FC<SectionSeparatorProps> = ({ config }) => {
    if (!config || config.style === 'none') return null;

    const { style, height, color, reversed } = config;
    const transform = reversed ? 'scaleX(-1)' : 'none';

    // Animation styles for waves
    const animStyle = `
        @keyframes move-wave {
            0% { transform: translateX(0) translateZ(0) scaleY(1); }
            50% { transform: translateX(-25%) translateZ(0) scaleY(0.55); }
            100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
        }
    `;

    return (
        <div 
            className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none"
            style={{ height: `${height}px`, transform }}
        >
            {style === 'wave_animated' && (
                <>
                    <style>{animStyle}</style>
                    <svg className="absolute bottom-0 w-full h-full" viewBox="0 24 150 28" preserveAspectRatio="none">
                        <defs>
                            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                        </defs>
                        <g>
                            <use href="#gentle-wave" x="48" y="0" fill={color} opacity="0.7" style={{ animation: 'move-wave 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite' }} />
                            <use href="#gentle-wave" x="48" y="3" fill={color} opacity="0.5" style={{ animation: 'move-wave 20s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite', animationDelay: '-2s' }} />
                            <use href="#gentle-wave" x="48" y="5" fill={color} opacity="0.3" style={{ animation: 'move-wave 15s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite', animationDelay: '-4s' }} />
                            <use href="#gentle-wave" x="48" y="7" fill={color} opacity="1" style={{ animation: 'move-wave 10s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite', animationDelay: '-5s' }} />
                        </g>
                    </svg>
                </>
            )}

            {style === 'tilt' && (
                <svg className="relative block w-[calc(100%+1.3px)] h-full" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" fill={color} className="opacity-20 translate-y-1"></path>
                    <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" fill={color}></path>
                </svg>
            )}

            {style === 'wave' && (
                <svg className="relative block w-[calc(100%+1.3px)] h-full" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill={color}></path>
                </svg>
            )}

            {style === 'curve_center' && (
                <svg className="relative block w-[calc(100%+1.3px)] h-full" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill={color} opacity=".25"></path>
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill={color} opacity=".5"></path>
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill={color}></path>
                </svg>
            )}

            {style === 'spikes' && (
                <svg className="relative block w-[calc(100%+1.3px)] h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M1200 120L0 120 0 0 240 120 480 0 720 120 960 0 1200 120z" fill={color}></path>
                </svg>
            )}

            {style === 'triangle' && (
                <svg className="relative block w-[calc(100%+1.3px)] h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M1200 0L0 0 598.97 114.72 1200 0z" fill={color}></path>
                </svg>
            )}

            {style === 'clouds' && (
                <svg className="relative block w-[calc(100%+1.3px)] h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill={color} opacity=".25"></path>
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill={color} opacity=".5"></path>
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill={color}></path>
                </svg>
            )}
        </div>
    );
};

export default SectionSeparator;
