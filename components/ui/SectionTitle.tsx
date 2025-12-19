
import React from 'react';
import { SectionConfig } from '../../types';

const SectionTitle: React.FC<{ section: SectionConfig }> = ({ section }) => {
    const { id, title, titleStyles } = section;
    const { useGradient, gradientFrom, gradientTo, useShadow, shadowColor } = titleStyles;

    // Map section IDs to specific background colors for a colorful "kids" look
    const getBgColorClass = (sectionId: string) => {
        switch (sectionId) {
            case 'about': return 'bg-brand-purple';
            case 'categories': return 'bg-brand-pink';
            case 'location': return 'bg-brand-yellow';
            case 'gallery': return 'bg-blue-500';
            case 'video': return 'bg-emerald-500';
            case 'partners': return 'bg-brand-purple';
            case 'jury': return 'bg-brand-pink';
            case 'prizes': return 'bg-brand-yellow';
            case 'fees': return 'bg-emerald-500';
            case 'howto': return 'bg-brand-purple';
            case 'register': return 'bg-brand-pink';
            case 'reviews': return 'bg-brand-yellow';
            case 'faq': return 'bg-blue-500';
            case 'contact': return 'bg-brand-purple';
            default: return 'bg-brand-pink';
        }
    };

    const bgColorClass = getBgColorClass(id);
    
    // Adjust text color for yellow background to maintain contrast
    const textColorClass = bgColorClass === 'bg-brand-yellow' ? 'text-brand-dark' : 'text-white';

    const titleStyle: React.CSSProperties = {
        position: 'relative',
        zIndex: 10,
    };

    if (useGradient) {
        titleStyle.backgroundImage = `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`;
    }
    if (useShadow) {
        titleStyle.textShadow = `2px 2px 4px ${shadowColor}`;
    }

    return (
        <div className="relative inline-block animate-on-scroll">
            <div className={`absolute inset-0 ${bgColorClass} transform -skew-y-2 rounded-lg shadow-lg`}></div>
             <h2
                className={`relative z-10 text-2xl md:text-4xl font-extrabold px-10 py-3 ${textColorClass} ${useGradient ? 'gradient-text' : ''}`}
                style={titleStyle}
            >
                {title}
            </h2>
        </div>
    );
};

export default SectionTitle;
