
import { WheelConfig } from '../interfaces';

export const DEFAULT_WHEEL_CONFIG: WheelConfig = {
    enabled: false,
    adminTestMode: false,
    triggerPosition: 'right',
    buttonText: '🎁 Învârte Roata',
    colors: {
        border: '#1E40AF', // Blue border
        center: '#1E40AF', // Blue center
        pointer: '#EF4444' // Red pointer
    },
    segments: [
        { id: '1', label: '5%', type: 'discount', probabilityWeight: 30, color: '#EF4444', textColor: '#ffffff', code: 'VOICEUP5', resultText: 'Ai câștigat 5% Reducere!', resultColor: '#EF4444', resultIsBold: true }, 
        { id: '2', label: 'MAI ÎNCEARCĂ', type: 'loss', probabilityWeight: 40, color: '#ffffff', textColor: '#EF4444', resultText: 'Din păcate, nu ai câștigat.', resultColor: '#6B7280', resultIsBold: false }, 
        { id: '3', label: '10%', type: 'discount', probabilityWeight: 20, color: '#FCD34D', textColor: '#1e3a8a', code: 'VOICEUP10', resultText: 'Super! 10% Reducere pentru tine!', resultColor: '#F59E0B', resultIsBold: true }, 
        { id: '4', label: '15%', type: 'discount', probabilityWeight: 10, color: '#93C5FD', textColor: '#1e3a8a', code: 'VOICEUP15', resultText: 'Wow! 15% Reducere!', resultColor: '#3B82F6', resultIsBold: true }, 
        { id: '5', label: 'SURPRIZĂ', type: 'discount', probabilityWeight: 15, color: '#EF4444', textColor: '#ffffff', code: 'SURPRIZA', resultText: 'Ai deblocat un premiu SURPRIZĂ!', resultColor: '#7C3AED', resultIsBold: true }, 
        { id: '6', label: 'MAI ÎNCEARCĂ', type: 'loss', probabilityWeight: 40, color: '#ffffff', textColor: '#EF4444', resultText: 'Ghinion... Mai încearcă data viitoare.', resultColor: '#6B7280', resultIsBold: false }, 
        { id: '7', label: '5%', type: 'discount', probabilityWeight: 30, color: '#FCD34D', textColor: '#1e3a8a', code: 'VOICEUP5', resultText: 'Ai prins 5% Reducere!', resultColor: '#F59E0B', resultIsBold: true }, 
        { id: '8', label: 'GRATUIT', type: 'free', probabilityWeight: 1, color: '#93C5FD', textColor: '#1e3a8a', code: 'JACKPOT', resultText: 'INCREDIBIL! ÎNSCRIERE GRATUITĂ!', resultColor: '#EF4444', resultIsBold: true }, 
    ]
};
