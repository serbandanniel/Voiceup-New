
import React, { useState, useEffect } from 'react';
import { CountdownConfig } from '../../types';
import { DEFAULT_COUNTDOWN_CONFIG } from '../../config';
import { AdminPageHeader } from '../../components/admin';

const CountdownConfigPage: React.FC = () => {
    const [config, setConfig] = useState<CountdownConfig>(DEFAULT_COUNTDOWN_CONFIG);
    const [isEditing, setIsEditing] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    const loadConfig = () => {
        const stored = localStorage.getItem('countdownConfig');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setConfig({ ...DEFAULT_COUNTDOWN_CONFIG, ...parsed, sizing: { ...DEFAULT_COUNTDOWN_CONFIG.sizing, ...(parsed.sizing || {}) } });
            } catch (e) {
                console.error(e);
            }
        }
    };

    useEffect(() => {
        loadConfig();
    }, []);

    // Effect for the preview timer
    useEffect(() => {
        const targetDate = new Date(config.targetDate).getTime();
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [config.targetDate]);

    const handleSave = () => {
        localStorage.setItem('countdownConfig', JSON.stringify(config));
        setSaveStatus('Salvat cu succes!');
        setIsEditing(false);
        setTimeout(() => setSaveStatus(''), 3000);
    };

    const handleCancel = () => {
        loadConfig();
        setIsEditing(false);
    };

    const handleChange = (field: keyof CountdownConfig, value: any) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleLabelChange = (label: keyof CountdownConfig['labels'], value: string) => {
        setConfig(prev => ({ ...prev, labels: { ...prev.labels, [label]: value }}));
    };
    
    const handleSizingChange = (device: 'desktop' | 'mobile', dimension: 'width' | 'height', value: number) => {
        if (isNaN(value)) return;
        setConfig(prev => ({
            ...prev,
            sizing: {
                ...prev.sizing,
                [device]: {
                    ...prev.sizing[device],
                    [dimension]: value
                }
            }
        }));
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
                <AdminPageHeader 
                    title="Configurare Countdown"
                    description="Setează data, culorile și animațiile cronometrului."
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(true)}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    saveStatus={saveStatus}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Settings Column */}
                    <div className="space-y-6">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Titlu Secțiune</label>
                            <input 
                                type="text"
                                disabled={!isEditing}
                                value={config.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Dată și Oră Finală</label>
                            <div className="relative">
                                <input 
                                    type="datetime-local"
                                    disabled={!isEditing}
                                    value={config.targetDate}
                                    onChange={(e) => handleChange('targetDate', e.target.value)}
                                    onClick={(e) => {
                                        if(!isEditing) return;
                                        try {
                                            if ('showPicker' in e.currentTarget) {
                                                (e.currentTarget as any).showPicker();
                                            }
                                        } catch(err) {}
                                    }}
                                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all text-gray-900 pr-10 cursor-pointer"
                                    style={{ colorScheme: 'light' }}
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Culoare Cifre</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="color"
                                        disabled={!isEditing}
                                        value={config.numberColor}
                                        onChange={(e) => handleChange('numberColor', e.target.value)}
                                        className="w-12 h-12 p-1 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 cursor-pointer disabled:cursor-not-allowed"
                                    />
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={config.numberColor}
                                        onChange={(e) => handleChange('numberColor', e.target.value)}
                                        className="w-full p-2 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple outline-none font-mono text-sm text-gray-900"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Culoare Text Etichete</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="color"
                                        disabled={!isEditing}
                                        value={config.labelColor}
                                        onChange={(e) => handleChange('labelColor', e.target.value)}
                                        className="w-12 h-12 p-1 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 cursor-pointer disabled:cursor-not-allowed"
                                    />
                                     <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={config.labelColor}
                                        onChange={(e) => handleChange('labelColor', e.target.value)}
                                        className="w-full p-2 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple outline-none font-mono text-sm text-gray-900"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Efect Animație</label>
                            <select
                                disabled={!isEditing}
                                value={config.animationEffect}
                                onChange={(e) => handleChange('animationEffect', e.target.value as CountdownConfig['animationEffect'])}
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all text-gray-900"
                            >
                                <option value="shake">Shake (Secunde)</option>
                                <option value="pulse">Pulse (Toate)</option>
                                <option value="flip">Flip (Secunde)</option>
                                <option value="fade">Fade (Secunde)</option>
                                <option value="none">Fără efect</option>
                            </select>
                        </div>

                        <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">Etichete (Labels)</label>
                             <div className="grid grid-cols-2 gap-3">
                                <input placeholder="Zile" disabled={!isEditing} value={config.labels.days} onChange={(e) => handleLabelChange('days', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none text-gray-900" />
                                <input placeholder="Ore" disabled={!isEditing} value={config.labels.hours} onChange={(e) => handleLabelChange('hours', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none text-gray-900" />
                                <input placeholder="Minute" disabled={!isEditing} value={config.labels.minutes} onChange={(e) => handleLabelChange('minutes', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none text-gray-900" />
                                <input placeholder="Secunde" disabled={!isEditing} value={config.labels.seconds} onChange={(e) => handleLabelChange('seconds', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none text-gray-900" />
                             </div>
                        </div>
                    </div>

                    {/* Preview Column */}
                    <div className="bg-violet-50 rounded-xl p-4 md:p-8 flex flex-col items-center justify-center border border-dashed border-violet-200">
                         <h3 className="text-xl font-bold text-brand-dark mb-4 text-center">{config.title}</h3>
                         
                         <div className="w-full space-y-8">
                            {/* Desktop Preview */}
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase text-center mb-2">Previzualizare Desktop</p>
                                <div className="flex flex-nowrap justify-center gap-4">
                                    {[{ label: config.labels.days, value: timeLeft.days }, { label: config.labels.hours, value: timeLeft.hours }, { label: config.labels.minutes, value: timeLeft.minutes }, { label: config.labels.seconds, value: timeLeft.seconds }].map((item, idx) => {
                                        const isSeconds = idx === 3;
                                        let animationClass = '';
                                        if (config.animationEffect === 'pulse') animationClass = 'pulse-all';
                                        else if (isSeconds) {
                                            if (config.animationEffect === 'shake') animationClass = 'shake-seconds';
                                            if (config.animationEffect === 'flip') animationClass = 'flip-seconds';
                                            if (config.animationEffect === 'fade') animationClass = 'fade-seconds';
                                        }
                                        return (
                                            <div key={idx} style={{ width: `${config.sizing.desktop.width}px`, height: `${config.sizing.desktop.height}px` }} className={`flex flex-col justify-center items-center bg-white/90 rounded-xl p-2 text-center shadow-lg ${animationClass}`}>
                                                <div className="text-4xl font-black" style={{ color: config.numberColor }}>{String(item.value).padStart(2, '0')}</div>
                                                <div className="text-sm font-bold uppercase mt-1" style={{ color: config.labelColor }}>{item.label}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Mobile Preview */}
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase text-center mb-2">Previzualizare Mobil</p>
                                <div className="mx-auto w-full max-w-sm bg-white p-4 rounded-2xl shadow-lg">
                                    <div className="flex flex-nowrap justify-center gap-2">
                                        {[{ label: config.labels.days, value: timeLeft.days }, { label: config.labels.hours, value: timeLeft.hours }, { label: config.labels.minutes, value: timeLeft.minutes }, { label: config.labels.seconds, value: timeLeft.seconds }].map((item, idx) => {
                                            const isSeconds = idx === 3;
                                            let animationClass = '';
                                            if (config.animationEffect === 'pulse') animationClass = 'pulse-all';
                                            else if (isSeconds) {
                                                if (config.animationEffect === 'shake') animationClass = 'shake-seconds';
                                                if (config.animationEffect === 'flip') animationClass = 'flip-seconds';
                                                if (config.animationEffect === 'fade') animationClass = 'fade-seconds';
                                            }
                                            return (
                                                <div key={idx} style={{ width: `${config.sizing.mobile.width}px`, height: `${config.sizing.mobile.height}px` }} className={`flex flex-col justify-center items-center bg-gray-100 rounded-lg p-1 text-center shadow-md ${animationClass}`}>
                                                    <div className="text-2xl font-black" style={{ color: config.numberColor }}>{String(item.value).padStart(2, '0')}</div>
                                                    <div className="text-[10px] font-bold uppercase mt-1" style={{ color: config.labelColor }}>{item.label}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>

                 <div className="mt-8 pt-8 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Dimensionare Countdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Desktop Sizing */}
                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-brand-dark mb-4">Desktop</h4>
                            <div className="space-y-2 mb-4">
                                <label className="text-sm font-bold text-gray-600 flex justify-between">
                                    <span>Lățime</span>
                                    <span>{config.sizing.desktop.width}px</span>
                                </label>
                                <div className="flex items-center gap-4">
                                    <input type="range" min="80" max="200" disabled={!isEditing} value={config.sizing.desktop.width} onChange={e => handleSizingChange('desktop', 'width', parseInt(e.target.value))} className="w-full" />
                                    <input type="number" disabled={!isEditing} value={config.sizing.desktop.width} onChange={e => handleSizingChange('desktop', 'width', parseInt(e.target.value))} className="w-24 p-2 border rounded-md text-gray-900" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 flex justify-between">
                                    <span>Înălțime</span>
                                    <span>{config.sizing.desktop.height}px</span>
                                </label>
                                <div className="flex items-center gap-4">
                                    <input type="range" min="80" max="200" disabled={!isEditing} value={config.sizing.desktop.height} onChange={e => handleSizingChange('desktop', 'height', parseInt(e.target.value))} className="w-full" />
                                    <input type="number" disabled={!isEditing} value={config.sizing.desktop.height} onChange={e => handleSizingChange('desktop', 'height', parseInt(e.target.value))} className="w-24 p-2 border rounded-md text-gray-900" />
                                </div>
                            </div>
                        </div>
                        {/* Mobile Sizing */}
                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-brand-dark mb-4">Mobil</h4>
                            <div className="space-y-2 mb-4">
                                <label className="text-sm font-bold text-gray-600 flex justify-between">
                                    <span>Lățime</span>
                                    <span>{config.sizing.mobile.width}px</span>
                                </label>
                                <div className="flex items-center gap-4">
                                    <input type="range" min="50" max="120" disabled={!isEditing} value={config.sizing.mobile.width} onChange={e => handleSizingChange('mobile', 'width', parseInt(e.target.value))} className="w-full" />
                                    <input type="number" disabled={!isEditing} value={config.sizing.mobile.width} onChange={e => handleSizingChange('mobile', 'width', parseInt(e.target.value))} className="w-24 p-2 border rounded-md text-gray-900" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 flex justify-between">
                                    <span>Înălțime</span>
                                    <span>{config.sizing.mobile.height}px</span>
                                </label>
                                <div className="flex items-center gap-4">
                                    <input type="range" min="50" max="120" disabled={!isEditing} value={config.sizing.mobile.height} onChange={e => handleSizingChange('mobile', 'height', parseInt(e.target.value))} className="w-full" />
                                    <input type="number" disabled={!isEditing} value={config.sizing.mobile.height} onChange={e => handleSizingChange('mobile', 'height', parseInt(e.target.value))} className="w-24 p-2 border rounded-md text-gray-900" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CountdownConfigPage;
