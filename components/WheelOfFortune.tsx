
import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { WheelConfig, WheelSegment } from '../types';
import { DEFAULT_WHEEL_CONFIG, DEFAULT_HERO_CONFIG } from '../config';

interface WheelOfFortuneProps {
    previewConfig?: WheelConfig;
    previewMode?: 'desktop' | 'mobile';
}

const STORAGE_KEY = 'voiceup_wheel_result_v1';

const WheelOfFortune: React.FC<WheelOfFortuneProps> = ({ previewConfig, previewMode }) => {
    const [config, setConfig] = useState<WheelConfig>(DEFAULT_WHEEL_CONFIG);
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<'loading' | 'form' | 'spin' | 'result' | 'already_played'>('loading');
    
    const [leadData, setLeadData] = useState({ name: '', email: '', phone: '', agreed: false });
    
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState<WheelSegment | null>(null);
    const lastWinnerIndexRef = useRef<number | null>(null);

    useEffect(() => {
        if (previewConfig) {
            setConfig(previewConfig);
            setIsOpen(true);
            // In preview mode, we usually want to see the "Spin" state or "Form" state to visualize the wheel
            // Defaulting to 'form' allows seeing the full modal content structure
            setStep('form'); 
        } else {
            const storedConfig = localStorage.getItem('wheelConfig');
            if (storedConfig) {
                try {
                    const parsed = JSON.parse(storedConfig);
                    setConfig(parsed);
                    if (parsed.adminTestMode) {
                        setStep('form');
                        return;
                    }
                } catch (e) { console.error(e); }
            }

            const savedResult = localStorage.getItem(STORAGE_KEY);
            if (savedResult) {
                try {
                    const parsedResult = JSON.parse(savedResult);
                    setResult(parsedResult);
                    setStep('already_played');
                } catch(e) {
                    setStep('form');
                }
            } else {
                setStep('form');
            }
        }
    }, [previewConfig]);

    const fireConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 };
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    if (!config.enabled && !previewConfig) return null;

    const segments = config.segments;
    const numSegments = segments.length;
    const segmentAngle = 360 / numSegments;

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!leadData.agreed) {
            toast.error("Te rugăm să accepți termenii și condițiile.");
            return;
        }
        localStorage.setItem('wheel_lead_data', JSON.stringify(leadData));
        setStep('spin');
    };

    const resetWheel = () => {
        setStep('spin');
        setResult(null);
    };

    const spinWheel = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setResult(null);

        let winnerIndex = 0;

        if (config.adminTestMode && lastWinnerIndexRef.current !== null) {
            const availableIndices = Array.from({ length: numSegments }, (_, i) => i).filter(i => i !== lastWinnerIndexRef.current);
            const randomIndex = Math.floor(Math.random() * availableIndices.length);
            winnerIndex = availableIndices[randomIndex];
        } else {
            const totalWeight = segments.reduce((sum, seg) => sum + seg.probabilityWeight, 0);
            let random = Math.random() * totalWeight;
            for (let i = 0; i < numSegments; i++) {
                random -= segments[i].probabilityWeight;
                if (random <= 0) {
                    winnerIndex = i;
                    break;
                }
            }
        }

        lastWinnerIndexRef.current = winnerIndex;

        const currentRotation = rotation;
        const segmentCenter = (winnerIndex * segmentAngle) + (segmentAngle / 2);
        const targetVisualAngle = (270 - segmentCenter + 360) % 360;
        const currentVisualAngle = currentRotation % 360;
        let delta = targetVisualAngle - currentVisualAngle;
        if (delta < 0) delta += 360;
        delta += 360 * 10;
        const jitterRange = segmentAngle * 0.2;
        const jitter = (Math.random() - 0.5) * jitterRange;
        const finalRotation = currentRotation + delta + jitter;
        
        setRotation(finalRotation);

        setTimeout(() => {
            setIsSpinning(false);
            const wonSegment = segments[winnerIndex];
            setResult(wonSegment);
            setStep('result');

            if (!previewConfig && !config.adminTestMode) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(wonSegment));
            }

            if (wonSegment.type !== 'loss') {
                fireConfetti();
            }
        }, 5000);
    };

    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    const wheelPaths = segments.map((segment, index) => {
        const startAngle = index / numSegments;
        const endAngle = (index + 1) / numSegments;
        const [startX, startY] = getCoordinatesForPercent(startAngle);
        const [endX, endY] = getCoordinatesForPercent(endAngle);
        const pathData = [`M 0 0`, `L ${startX} ${startY}`, `A 1 1 0 0 1 ${endX} ${endY}`, `Z`].join(' ');
        const midAngle = (startAngle + endAngle) / 2 * 360; 
        return { pathData, ...segment, rotation: midAngle };
    });

    // --- LAYOUT LOGIC FOR PREVIEW ---
    // If previewMode is 'mobile', force flex-col. 
    // If previewMode is 'desktop', force flex-row (if space allows).
    // If undefined (live), use responsive classes.
    const isMobilePreview = previewMode === 'mobile';
    
    const containerClass = previewConfig 
        ? "absolute inset-0 z-10 flex items-center justify-center p-4 pointer-events-none" 
        : "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md";

    const modalLayoutClass = isMobilePreview 
        ? "flex flex-col" 
        : "flex flex-col md:flex-row";

    const sideWidthClass = isMobilePreview
        ? "w-full"
        : "w-full md:w-1/2";

    const renderSegmentContent = (seg: any) => {
        let fontSize = "0.12";
        if (seg.label.length > 10) fontSize = "0.06"; 
        else if (seg.label.length > 6) fontSize = "0.08";

        return (
            <text 
                x="0.65" 
                y="0" 
                fill={seg.textColor} 
                fontSize={fontSize}
                fontWeight="900" 
                textAnchor="middle" 
                alignmentBaseline="middle"
                transform={`rotate(90, 0.65, 0)`}
                style={{ fontFamily: 'Nunito, sans-serif', filter: 'drop-shadow(1px 1px 0px rgba(0,0,0,0.1))' }}
            >
                {seg.label}
            </text>
        );
    };

    const RimDots = () => {
        const count = 16;
        return (
            <div className="absolute inset-0 pointer-events-none z-20">
                {Array.from({ length: count }).map((_, i) => {
                    const angle = (i * 360) / count;
                    return (
                        <div
                            key={i}
                            className={`absolute w-3 h-3 rounded-full border border-black/10 shadow-sm ${isSpinning ? 'animate-dots-flicker' : ''}`}
                            style={{
                                top: '50%',
                                left: '50%',
                                transform: `translate(-50%, -50%) rotate(${angle}deg) translate(142px) rotate(-${angle}deg)`, 
                                backgroundColor: i % 2 === 0 ? '#FCD34D' : '#EF4444',
                                animationDelay: `${i * 0.1}s`
                            }}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <>
            {!isOpen && !previewConfig && (step !== 'already_played' || config.adminTestMode) && (
                <button
                    onClick={() => setIsOpen(true)}
                    className={`fixed top-1/2 z-[90] transform -translate-y-1/2 shadow-2xl transition-transform hover:scale-110 active:scale-95 group ${config.triggerPosition === 'left' ? 'left-0' : 'right-0'}`}
                >
                    <div className="relative">
                        <div className={`absolute inset-0 bg-brand-pink rounded-full blur-md opacity-70 animate-pulse`}></div>
                        <div className={`relative bg-gradient-to-br from-brand-yellow to-brand-pink text-white font-black py-4 px-2 writing-vertical-lr text-lg border-4 border-white shadow-xl flex items-center gap-2 ${config.triggerPosition === 'left' ? 'rounded-r-2xl' : 'rounded-l-2xl'}`}>
                            <span className="text-2xl animate-spin-slow">🎡</span>
                            <span className="uppercase tracking-widest text-shadow-sm">{config.buttonText}</span>
                        </div>
                    </div>
                </button>
            )}

            {(isOpen || previewConfig) && (
                <div 
                    className={containerClass}
                    onClick={() => !previewConfig && setIsOpen(false)}
                >
                    <div 
                        className={`relative bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl border-4 border-brand-yellow ${modalLayoutClass} ${previewConfig ? 'pointer-events-auto' : ''}`}
                        onClick={e => e.stopPropagation()}
                        style={{ maxHeight: previewConfig ? '100%' : '90vh' }}
                    >
                        {!previewConfig && (
                            <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-2 z-50 bg-white/80 rounded-full hover:bg-white transition-all">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        )}

                        {/* LEFT SIDE: The Wheel */}
                        <div className={`${sideWidthClass} bg-blue-50 p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden min-h-[350px]`}>
                            {isSpinning && (
                                <div className="absolute inset-0 z-0 opacity-30 animate-spin-fast pointer-events-none">
                                    <div className="w-full h-full rounded-full border-[20px] border-dashed border-white/50 scale-125"></div>
                                </div>
                            )}

                            <div className="absolute top-10 z-30 drop-shadow-xl" style={{top: 'calc(50% - 175px)'}}>
                                <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 50L5 20C5 20 0 15 0 10C0 4.47715 8.9543 0 20 0C31.0457 0 40 4.47715 40 10C40 15 35 20 35 20L20 50Z" fill="#EF4444"/>
                                    <circle cx="20" cy="10" r="5" fill="#B91C1C"/>
                                </svg>
                            </div>

                            <div className="relative w-80 h-80">
                                <div className="absolute inset-0 rounded-full border-[12px] border-[#1E40AF] shadow-2xl bg-[#1E40AF]">
                                    <RimDots />
                                </div>

                                <div 
                                    className="absolute inset-[12px] rounded-full overflow-hidden shadow-inner transition-transform duration-[5000ms] cubic-bezier(0.15, 0, 0.15, 1)"
                                    style={{ transform: `rotate(${rotation}deg)` }}
                                >
                                    <svg viewBox="-1 -1 2 2" className="w-full h-full" style={{overflow: 'visible'}}>
                                        {wheelPaths.map((seg, i) => (
                                            <g key={i}>
                                                <path d={seg.pathData} fill={seg.color} stroke="#1E40AF" strokeWidth="0.01" />
                                                <g transform={`rotate(${seg.rotation}) translate(0, 0)`}> 
                                                    {renderSegmentContent(seg)}
                                                </g>
                                            </g>
                                        ))}
                                    </svg>
                                </div>
                                
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full shadow-lg border-4 border-[#1E40AF] flex items-center justify-center z-40 overflow-hidden p-2">
                                    <img src={DEFAULT_HERO_CONFIG.logoUrl} alt="VoiceUP" className="w-full h-full object-contain" />
                                </div>
                                
                                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-24 h-16 bg-[#3B82F6] rounded-t-lg z-0 opacity-50 blur-sm"></div>
                            </div>
                        </div>

                        {/* RIGHT SIDE: Content */}
                        <div className={`${sideWidthClass} bg-white p-6 md:p-10 flex flex-col justify-center relative overflow-y-auto`}>
                            {/* FORM */}
                            {step === 'form' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="text-center">
                                        <h3 className="text-2xl font-black text-brand-dark mb-2">Învârte și Câștigă! 🎰</h3>
                                        <p className="text-gray-600 text-sm">Completează datele pentru a debloca o rotire gratuită.</p>
                                    </div>
                                    <form onSubmit={handleFormSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Numele Tău</label>
                                            <input required type="text" value={leadData.name} onChange={e => setLeadData({...leadData, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none text-gray-900 font-bold" placeholder="Ex: Alex Popescu" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                                            <input required type="email" value={leadData.email} onChange={e => setLeadData({...leadData, email: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none text-gray-900 font-bold" placeholder="adresa@email.com" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefon</label>
                                            <input required type="tel" value={leadData.phone} onChange={e => setLeadData({...leadData, phone: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none text-gray-900 font-bold" placeholder="07xx xxx xxx" />
                                        </div>
                                        <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                                            <input type="checkbox" required checked={leadData.agreed} onChange={e => setLeadData({...leadData, agreed: e.target.checked})} className="mt-1 w-4 h-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded" />
                                            <span className="text-xs text-gray-500 leading-tight">Sunt de acord cu <Link to="/termeni" target="_blank" className="underline text-brand-purple">Termenii și Condițiile</Link>.</span>
                                        </label>
                                        <button type="submit" className="w-full py-4 bg-brand-pink text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:bg-pink-600 transition-all transform hover:-translate-y-1">Vreau să Învârt! 🎲</button>
                                    </form>
                                </div>
                            )}

                            {/* SPIN */}
                            {step === 'spin' && (
                                <div className="text-center space-y-6 animate-fade-in flex flex-col items-center justify-center h-full">
                                    <h3 className="text-3xl font-black text-brand-purple">Ești gata?</h3>
                                    <p className="text-gray-600">Ține-ți respirația și apasă butonul!</p>
                                    <button onClick={spinWheel} disabled={isSpinning} className={`w-48 h-48 rounded-full border-8 border-brand-yellow bg-brand-dark text-white text-2xl font-black shadow-2xl flex flex-col items-center justify-center transition-all transform ${isSpinning ? 'scale-95 opacity-80 cursor-not-allowed' : 'hover:scale-105 hover:rotate-3 active:scale-95 cursor-pointer'}`}>
                                        {isSpinning ? (
                                            <><span className="text-4xl mb-2 animate-spin">😵‍💫</span><span className="text-sm uppercase tracking-widest">Se învârte...</span></>
                                        ) : (
                                            <><span className="text-5xl mb-2">GO!</span><span className="text-sm uppercase tracking-widest text-brand-yellow">Învârte</span></>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* RESULT */}
                            {(step === 'result' || step === 'already_played') && result && (
                                <div className="text-center space-y-6 animate-scale-in flex flex-col items-center justify-center h-full">
                                    {result.type === 'loss' ? (
                                        <>
                                            <div className="text-6xl mb-2">😢</div>
                                            <h3 
                                                className="text-2xl md:text-3xl font-black mb-2"
                                                style={{ color: result.resultColor || '#1F2937', fontWeight: result.resultIsBold ? '900' : '700' }}
                                            >
                                                {result.resultText || "Mai încearcă!"}
                                            </h3>
                                            <p className="text-gray-600 text-sm">Din păcate, norocul nu a fost de partea ta.</p>
                                            {config.adminTestMode ? (
                                                <button onClick={resetWheel} className="w-full py-3 bg-brand-purple text-white font-bold rounded-full hover:bg-brand-dark transition-all">🔄 Învârte din nou (Admin)</button>
                                            ) : (
                                                <button onClick={() => setIsOpen(false)} className="px-8 py-3 border-2 border-gray-300 text-gray-600 font-bold rounded-full hover:bg-gray-100 transition-colors">Închide</button>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-6xl mb-2 animate-bounce">🎉</div>
                                            <h3 className="text-3xl md:text-4xl font-black text-brand-purple">FELICITĂRI!</h3>
                                            <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-2xl w-full relative overflow-hidden">
                                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stars.png')]"></div>
                                                <p className="text-sm font-bold text-yellow-800 uppercase tracking-wider mb-2">Ai câștigat:</p>
                                                <p 
                                                    className="text-2xl md:text-3xl mb-4 drop-shadow-sm leading-tight"
                                                    style={{ 
                                                        color: result.resultColor || '#2E1065', 
                                                        fontWeight: result.resultIsBold ? '900' : 'normal',
                                                        fontFamily: '"Nunito", sans-serif'
                                                    }}
                                                >
                                                    {result.resultText || result.label}
                                                </p>

                                                {result.code && (
                                                    <div className="bg-white border-2 border-dashed border-gray-300 p-3 rounded-lg relative group cursor-pointer shadow-sm hover:border-brand-purple transition-colors" onClick={() => {
                                                        navigator.clipboard.writeText(result.code || '');
                                                        toast.success('Codul a fost copiat în clipboard!');
                                                    }}>
                                                        <p className="text-xs text-gray-400 mb-1">Codul tău de reducere:</p>
                                                        <p className="text-xl font-mono font-bold text-brand-pink select-all">{result.code}</p>
                                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"><span className="bg-black text-white text-xs px-2 py-1 rounded">Copiază</span></div>
                                                    </div>
                                                )}
                                            </div>
                                            {config.adminTestMode ? (
                                                <button onClick={resetWheel} className="w-full py-4 bg-brand-purple text-white font-bold rounded-xl shadow-lg hover:bg-brand-dark transition-all transform hover:scale-105">🔄 Învârte din nou (Admin Test)</button>
                                            ) : (
                                                <>
                                                    <p className="text-xs text-gray-500">Folosește acest cod în formularul de înscriere.</p>
                                                    <Link to="/register" onClick={() => setIsOpen(false)} className="w-full py-4 bg-gradient-to-r from-brand-purple to-brand-pink text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all transform text-center block">Înscrie-te Acum</Link>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            <style>{`
                .writing-vertical-lr { writing-mode: vertical-lr; }
                .text-shadow-sm { text-shadow: 1px 1px 0px rgba(0,0,0,0.1); }
                .animate-spin-slow { animation: spin 4s linear infinite; }
                .animate-spin-fast { animation: spin 0.5s linear infinite; }
                .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                @keyframes scaleIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                
                @keyframes dots-flicker {
                    0% { background-color: #FCD34D; }
                    50% { background-color: #EF4444; box-shadow: 0 0 10px #EF4444; }
                    100% { background-color: #FCD34D; }
                }
                .animate-dots-flicker { animation: dots-flicker 0.2s infinite; }
            `}</style>
        </>
    );
};

export default WheelOfFortune;
