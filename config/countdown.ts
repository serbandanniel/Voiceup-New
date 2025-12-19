
import { CountdownConfig } from '../interfaces';

export const DEFAULT_COUNTDOWN_CONFIG: CountdownConfig = {
    targetDate: '2025-12-13T10:00:00',
    title: 'Înscrierile se închid în:',
    numberColor: '#7C3AED', 
    labelColor: '#6B7280', 
    labels: { days: 'Zile', hours: 'Ore', minutes: 'Min', seconds: 'Sec' }, 
    animationEffect: 'pulse',
    sizing: { desktop: { width: 90, height: 90 }, mobile: { width: 60, height: 65 } },
    bgColor: '#ffffff', 
    shadowColor: 'rgba(124, 58, 237, 0.25)'
};
