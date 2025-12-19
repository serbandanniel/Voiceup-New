
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { useForm } from '../hooks/useForm';
import { FieldRequirements } from '../types';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

// --- ROMANIAN COUNTIES ---
const COUNTIES = [
    "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani", "Brașov", "Brăila", "București",
    "Buzău", "Caraș-Severin", "Călărași", "Cluj", "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu",
    "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș", "Mehedinți", "Mureș", "Neamț",
    "Olt", "Prahova", "Satu Mare", "Sălaj", "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea", "Vaslui",
    "Vâlcea", "Vrancea"
];

// --- BUCHAREST SECTORS ---
const SECTORS = [
    "Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6"
];

// --- UI COMPONENTS ---

// 1. Compact Step Indicator
const StepIndicator: React.FC<{ currentStep: number, totalSteps: number, labels: string[] }> = ({ currentStep, totalSteps, labels }) => {
    const currentLabel = labels[currentStep - 1];

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center relative px-2 sm:px-8">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 rounded-full transform -translate-y-1/2 mx-2 sm:mx-8" style={{width: 'calc(100% - 16px sm:64px)'}}></div>
                <div 
                    className="absolute top-1/2 left-0 h-1 bg-brand-purple -z-10 rounded-full transition-all duration-500 ease-in-out transform -translate-y-1/2 mx-2 sm:mx-8" 
                    style={{ width: `calc(${((currentStep - 1) / (totalSteps - 1)) * 100}% - 16px)` }}
                ></div>

                {Array.from({ length: totalSteps }).map((_, idx) => {
                    const isActive = currentStep >= idx + 1;
                    return (
                        <div key={idx} className="relative z-10 bg-white p-1 rounded-full">
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-all duration-300 shadow-sm border-2 ${isActive ? 'bg-brand-purple text-white border-brand-purple scale-110' : 'bg-white text-gray-400 border-gray-200'}`}>
                                {idx + 1}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="text-center mt-6 animate-fade-in">
                <span className="text-xs font-bold text-brand-pink uppercase tracking-widest block mb-1">Pasul {currentStep}</span>
                <h3 className="text-xl md:text-2xl font-black text-brand-dark leading-tight px-4">
                    {currentLabel}
                </h3>
            </div>
        </div>
    );
};

const InputIconWrapper: React.FC<{icon: React.ReactNode, children: React.ReactNode}> = ({ icon, children }) => (
    <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
            {icon}
        </span>
        {children}
    </div>
);

const RenderLabel: React.FC<{
    label: string, 
    field: keyof FieldRequirements, 
    isRequired: (field: keyof FieldRequirements) => boolean,
    className?: string
}> = ({label, field, isRequired, className}) => (
    <label className={`block font-bold text-sm text-gray-800 mb-1.5 ${className}`}>
        {label} {isRequired(field) && <span className="text-pink-500">*</span>}
    </label>
);

const RegistrationForm: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null); // State for custom select
    const formRef = useRef<HTMLDivElement>(null);
    
    const {
        config,
        formData,
        pieces,
        numarPiese,
        totalCost,
        isSubmitting,
        attemptedSubmit, 
        setAttemptedSubmit, 
        handleTypeChange,
        handlePieceCountChange,
        handlePieceUpdate,
        updateField,
        updateFields,
        submitForm,
        handleGroupTypeChange,
        /* groupValidationError was removed here as it does not exist on useForm return type */
        showGroupSwitchConfirm,
        confirmGroupSwitch,
        cancelGroupSwitch,
        switchConfirmData,
        voucherInput, setVoucherInput, voucherMessage, handleVoucherApply, handleVoucherRemove,
        validateStep, isRequired
    } = useForm();
    
    const modalRoot = document.getElementById('modal-root');

    useEffect(() => {
        setAttemptedSubmit(false);
        const timer = setTimeout(() => setIsNavigating(false), 500);
        return () => clearTimeout(timer);
    }, [step, setAttemptedSubmit]);

    // Initial check for terms checkbox default state
    useEffect(() => {
        if (config.fieldRequirements?.terms_default_checked !== undefined) {
            setTermsAgreed(config.fieldRequirements.terms_default_checked);
        }
    }, [config]);

    // Close custom dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (openDropdownId && !(e.target as HTMLElement).closest('.custom-select-container')) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdownId]);

    // Fireworks Effect
    useEffect(() => {
        if (step === 4 && totalCost === 0 && formData.appliedVoucher) {
            const duration = 5000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 100, zIndex: 9999 };
            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function() {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);
                const particleCount = 80 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.4, 0.6), y: Math.random() - 0.2 } });
            }, 200);
            return () => clearInterval(interval);
        }
    }, [totalCost, formData.appliedVoucher, step]);

    // --- DISPLAY HELPER ---
    const getDisplayPrice = (category: 'individual' | 'group', key: string) => {
        const standardCost = category === 'individual' 
            ? config.costs.individual[key as '1'|'2'|'3'] 
            : config.costs.group[key as 'small'|'large'];

        const now = new Date();
        const promoEnd = new Date(config.promotion.endDate);
        const isGlobalPromoActive = config.promotion.enabled && now < promoEnd;

        let activeBaseCost = standardCost;
        if (isGlobalPromoActive) {
            activeBaseCost = category === 'individual'
                ? config.promotion.costs.individual[key as '1'|'2'|'3']
                : config.promotion.costs.group[key as 'small'|'large'];
        }

        let finalCost = activeBaseCost;
        if (formData.appliedVoucher) {
            const voucher = config.vouchers?.find(v => v.code === formData.appliedVoucher && v.active);
            if (voucher) {
                if (voucher.discountType === 'percent') finalCost = finalCost - (finalCost * (voucher.value / 100));
                else if (voucher.discountType === 'fixed') finalCost = Math.max(0, finalCost - (voucher.value)); 
                else if (voucher.discountType === 'free') finalCost = 0;
            }
        }
        finalCost = Math.round(finalCost);
        return { standard: standardCost, final: finalCost, hasDiscount: finalCost < standardCost };
    };

    const getInputClass = (isInvalid: boolean) => {
        const baseClass = "w-full border rounded-lg bg-white text-gray-900 outline-none transition-all shadow-sm";
        if (isInvalid && attemptedSubmit) {
            return `${baseClass} border-red-500 ring-1 ring-red-500 bg-red-50`;
        }
        return `${baseClass} border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent`;
    };

    const getAvailableSections = () => {
        if (formData.type === 'grup') return config.musicSections.filter(s => s.availableForGroup);
        return config.musicSections;
    };

    const requiresFileUpload = (sectionLabel: string) => {
        const section = config.musicSections.find(s => s.label === sectionLabel);
        return section ? (section.requiresFile !== false) : true;
    };

    const nextStep = () => {
        if (isNavigating) return;
        const isValid = validateStep(step);
        if (isValid) {
            setIsNavigating(true);
            setAttemptedSubmit(false); 
            setStep(prev => prev + 1);
            setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        } else {
            setAttemptedSubmit(true);
            toast.error('Te rugăm să completezi toate câmpurile obligatorii.');
        }
    };

    const prevStep = () => {
        if (isNavigating) return;
        setIsNavigating(true);
        setAttemptedSubmit(false);
        setStep(prev => prev - 1);
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isNavigating) return;
        if (step !== 4) return;

        if (validateStep(4)) {
            if (isRequired('terms_required') && !termsAgreed) {
                setAttemptedSubmit(true);
                toast.error('Trebuie să accepți termenii și condițiile.');
                return;
            }
            setIsNavigating(true);
            submitForm((finalData) => {
                 navigate('/thank-you', { state: { registrationData: finalData } });
            });
        } else {
            setAttemptedSubmit(true);
            toast.error('Te rugăm să completezi toate datele de facturare.');
        }
    };

    // Helper logic for members buttons
    const getMemberButtons = () => {
        if (formData.groupType === 'grup_mic') return [2, 3, 4, 5];
        else if (formData.groupType === 'grup_mare') return [6, 7, 8, 9, 10];
        return [];
    };

    const stepLabels = [
        'Alege Tip & Categorie', 
        `Date ${formData.type === 'grup' ? 'Grup' : 'Concurent'}`, 
        'Repertoriu & Piese', 
        'Facturare & Plată'
    ];

    const isBucharest = formData.county === 'București';

    return (
        <div ref={formRef} className="max-w-4xl mx-auto bg-white/90 backdrop-blur-xl p-4 sm:p-8 md:p-12 rounded-3xl shadow-2xl border border-white/30 animate-fade-in scroll-mt-32">
             <StepIndicator currentStep={step} totalSteps={4} labels={stepLabels} />

             <form onSubmit={handleFormSubmit}>
                 
                 {/* --- STEP 1: TYPE & CATEGORY --- */}
                 {step === 1 && (
                     <div className="space-y-8 animate-fade-in">
                        {/* Type Selector */}
                        <div className="text-center">
                            <div className="flex justify-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleTypeChange('individual')}
                                    className={`flex items-center justify-center gap-3 flex-1 px-4 py-6 rounded-2xl border-2 font-semibold text-left transition-all duration-300 transform hover:scale-105 ${
                                        formData.type === 'individual' 
                                        ? 'bg-brand-purple text-white border-brand-purple shadow-xl' 
                                        : 'bg-white text-gray-800 border-gray-200 hover:border-brand-purple'
                                    }`}
                                >
                                    <svg className="w-8 h-8 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                                    <div className="flex flex-col text-center">
                                        <span className="text-xs font-bold uppercase tracking-wider opacity-80">Concurent</span>
                                        <span className="text-xl font-extrabold">Individual</span>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleTypeChange('grup')}
                                    className={`flex items-center justify-center gap-3 flex-1 px-4 py-6 rounded-2xl border-2 font-semibold text-left transition-all duration-300 transform hover:scale-105 ${
                                        formData.type === 'grup' 
                                        ? 'bg-pink-500 text-white border-pink-500 shadow-xl' 
                                        : 'bg-white text-gray-800 border-gray-200 hover:border-pink-500'
                                    }`}
                                >
                                   <svg className="w-8 h-8 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>
                                    <div className="flex flex-col text-center">
                                        <span className="text-xs font-bold uppercase tracking-wider opacity-80">Formație</span>
                                        <span className="text-xl font-extrabold">Grup</span>
                                    </div>
                                </button>
                            </div>
                            {attemptedSubmit && !formData.type && <p className="text-red-500 text-sm mt-2 font-bold animate-pulse">Te rugăm să selectezi un tip de înscriere.</p>}
                        </div>

                        {formData.type === 'individual' && (
                            <>
                                <div className="animate-fade-in space-y-2">
                                    <RenderLabel label="Categorie de Vârstă" field="individual_age" isRequired={isRequired} />
                                    <div className={`grid grid-cols-2 md:grid-cols-5 gap-3 ${getInputClass(!formData.ageCategoryIndividual && isRequired('individual_age'))} p-2 border-0`}>
                                        {config.ageCategoriesIndividual.map(cat => (
                                            <label key={cat} className={`cursor-pointer p-3 border rounded-xl text-center transition-all ${formData.ageCategoryIndividual === cat ? 'bg-brand-purple text-white border-brand-purple shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-white border-gray-200'}`}>
                                                <input type="radio" name="cat_ind" value={cat} checked={formData.ageCategoryIndividual === cat} onChange={e => updateField('ageCategoryIndividual', e.target.value)} className="sr-only" />
                                                <span className="text-sm font-bold block">{cat}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {attemptedSubmit && !formData.ageCategoryIndividual && isRequired('individual_age') && <p className="text-red-500 text-xs">Câmp obligatoriu.</p>}
                                </div>

                                <div className="animate-fade-in space-y-2">
                                    <label className="block font-bold text-sm text-gray-800 mb-2">Alege Pachetul (Număr Piese) <span className="text-pink-500">*</span></label>
                                    <div className={`grid grid-cols-3 gap-3 sm:gap-4 ${attemptedSubmit && !numarPiese ? 'p-2 border-2 border-red-500 rounded-2xl bg-red-50' : ''}`}>
                                        {[1, 2, 3].map((count) => {
                                             const priceInfo = getDisplayPrice('individual', count.toString());
                                             return (
                                                 <button 
                                                    key={count} 
                                                    type="button" 
                                                    onClick={() => handlePieceCountChange(count)} 
                                                    className={`relative p-3 sm:p-4 border-2 rounded-2xl flex flex-col items-center justify-between transition-all transform hover:scale-105 min-h-[110px] sm:min-h-[140px] ${numarPiese === count ? 'border-brand-purple bg-violet-50 shadow-lg ring-2 ring-brand-purple ring-offset-2' : 'border-gray-200 bg-white hover:border-violet-300'}`}
                                                 >
                                                     {priceInfo.hasDiscount && <div className="absolute -top-3 -right-2 bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-sm animate-pulse">PROMO</div>}
                                                     
                                                     <div className="flex flex-col items-center justify-center flex-grow">
                                                        <div className="text-4xl sm:text-5xl font-black text-pink-500 leading-none">{count}</div>
                                                        <div className="text-[10px] sm:text-xs font-bold uppercase text-gray-500">{count > 1 ? 'Piese' : 'Piesă'}</div>
                                                     </div>
                                                     
                                                     <div className={`mt-2 text-base sm:text-xl font-bold leading-tight w-full text-center border-t border-gray-100 pt-2 ${priceInfo.hasDiscount ? 'text-red-500' : 'text-brand-purple'}`}>
                                                        {priceInfo.final} <span className="text-[10px] sm:text-sm">RON</span>
                                                     </div>
                                                 </button>
                                             );
                                        })}
                                    </div>
                                    {attemptedSubmit && !numarPiese && <p className="text-red-500 text-xs mt-1">Te rugăm să alegi un pachet.</p>}
                                </div>
                            </>
                        )}

                        {formData.type === 'grup' && (
                            <>
                                <div className="animate-fade-in space-y-2">
                                    <RenderLabel label="Categorie de Vârstă (Grup)" field="group_age" isRequired={isRequired} />
                                    <div className={`grid grid-cols-2 md:grid-cols-5 gap-3 ${getInputClass(!formData.ageCategoryGroup && isRequired('group_age'))} p-2 border-0`}>
                                        {config.ageCategoriesGroup.map(cat => (
                                            <label key={cat} className={`cursor-pointer p-3 border rounded-xl text-center transition-all ${formData.ageCategoryGroup === cat ? 'bg-pink-500 text-white border-pink-500 shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-white border-gray-200'}`}>
                                                <input type="radio" name="cat_grp" value={cat} checked={formData.ageCategoryGroup === cat} onChange={e => updateField('ageCategoryGroup', e.target.value)} className="sr-only" />
                                                <span className="text-sm font-bold block">{cat}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="animate-fade-in space-y-6">
                                    <div>
                                        <label className="block font-bold text-sm text-gray-800 mb-2">Mărime Grup <span className="text-pink-500">*</span></label>
                                        <div className={`grid grid-cols-2 gap-3 sm:gap-4 ${attemptedSubmit && !formData.groupType ? 'p-2 border-2 border-red-500 rounded-2xl bg-red-50' : ''}`}>
                                            {[
                                                { id: 'grup_mic', label: 'GRUP MIC', sub: '2-5 Pers.', priceInfo: getDisplayPrice('group', 'small') },
                                                { id: 'grup_mare', label: 'GRUP MARE', sub: '6-10 Pers.', priceInfo: getDisplayPrice('group', 'large') }
                                            ].map((grp) => (
                                                <button 
                                                    key={grp.id}
                                                    type="button" 
                                                    onClick={() => handleGroupTypeChange(grp.id as 'grup_mic' | 'grup_mare')}
                                                    className={`relative p-3 sm:p-4 border-2 rounded-2xl flex flex-col items-center justify-between transition-all transform hover:scale-105 min-h-[130px] ${formData.groupType === grp.id ? 'border-brand-purple bg-violet-50 shadow-lg ring-2 ring-brand-purple ring-offset-2' : 'border-gray-200 bg-white hover:border-violet-300'}`}
                                                >
                                                    {grp.priceInfo.hasDiscount && <div className="absolute -top-3 -right-2 bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-sm animate-pulse">PROMO</div>}
                                                    
                                                    <div className="flex flex-col items-center justify-center flex-grow w-full border-b border-gray-100 pb-2 mb-2">
                                                        <div className={`text-2xl sm:text-3xl font-black leading-none ${grp.priceInfo.hasDiscount ? 'text-red-500' : 'text-brand-purple'}`}>
                                                            {grp.priceInfo.final} <span className="text-[10px] sm:text-xs">RON</span>
                                                        </div>
                                                        <div className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase">/ Persoană</div>
                                                    </div>
                                                    
                                                    <div className="text-center w-full">
                                                        <div className="text-lg sm:text-xl font-black text-pink-500 leading-none uppercase">{grp.label}</div>
                                                        <div className="text-[10px] sm:text-xs font-bold uppercase text-gray-500 mt-1">{grp.sub}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        {attemptedSubmit && !formData.groupType && <p className="text-red-500 text-xs mt-1">Selectează tipul.</p>}
                                    </div>

                                    {formData.groupType && (
                                        <div className="mt-4 animate-fade-in bg-gray-50 p-4 rounded-xl border border-gray-200">
                                            <label className="block font-bold text-sm text-brand-dark mb-3 text-center">
                                                Selectează Numărul Exact de Membri <span className="text-pink-500">*</span>
                                            </label>
                                            <div className="flex flex-wrap justify-center gap-3">
                                                {getMemberButtons().map((num) => (
                                                    <button
                                                        key={num}
                                                        type="button"
                                                        onClick={() => updateField('groupMembersCount', num)}
                                                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-black text-lg sm:text-xl shadow-sm transition-all transform hover:scale-110 active:scale-95 border-2 ${
                                                            formData.groupMembersCount === num 
                                                            ? 'bg-brand-purple text-white border-brand-purple shadow-lg scale-110 ring-2 ring-offset-2 ring-brand-purple' 
                                                            : 'bg-white text-gray-700 border-gray-300 hover:border-brand-purple hover:text-brand-purple'
                                                        }`}
                                                    >
                                                        {num}
                                                    </button>
                                                ))}
                                            </div>
                                            {formData.groupMembersCount && (
                                                <p className="text-center text-xs font-bold text-gray-500 mt-3 uppercase tracking-wide">
                                                    Ai selectat: <span className="text-brand-purple text-sm">{formData.groupMembersCount} Persoane</span>
                                                </p>
                                            )}
                                            {attemptedSubmit && isRequired('group_members') && !formData.groupMembersCount && (
                                                <p className="text-red-500 text-xs mt-3 text-center font-bold">Te rugăm să selectezi numărul de membri.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                     </div>
                 )}

                 {/* --- STEP 2: PARTICIPANT DETAILS --- */}
                 {step === 2 && (
                     <div className="animate-fade-in space-y-6">
                        {formData.type === 'individual' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <RenderLabel label="Nume și Prenume Concurent" field="individual_name" isRequired={isRequired} />
                                    <InputIconWrapper icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>}>
                                        <input value={formData.name || ''} onChange={e => updateField('name', e.target.value)} placeholder="Ex: Popescu Maria" className={`${getInputClass(!formData.name && isRequired('individual_name'))} pl-12 pr-4 py-3`} />
                                    </InputIconWrapper>
                                </div>
                                
                                <div>
                                    <RenderLabel label="Vârstă Împlinită (Ani)" field="individual_exact_age" isRequired={isRequired} />
                                    <InputIconWrapper icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"></path></svg>}>
                                        <input 
                                            type="number" 
                                            min="1" 
                                            max="100" 
                                            value={formData.ageExact || ''} 
                                            onChange={e => updateField('ageExact', e.target.value)} 
                                            placeholder="Ex: 7" 
                                            className={`${getInputClass(!formData.ageExact && isRequired('individual_exact_age'))} pl-12 pr-4 py-3`} 
                                        />
                                    </InputIconWrapper>
                                </div>

                                <div>
                                    <RenderLabel label="Profesor Coordonator" field="individual_professor" isRequired={isRequired} />
                                    <input value={formData.professor || ''} onChange={e => updateField('professor', e.target.value)} placeholder="Nume Profesor" className={`${getInputClass(!formData.professor && isRequired('individual_professor'))} px-4 py-3`} />
                                </div>
                                <div>
                                    <RenderLabel label="Instituție / Școală" field="individual_school" isRequired={isRequired} />
                                    <input value={formData.school || ''} onChange={e => updateField('school', e.target.value)} placeholder="Școala de Arte..." className={`${getInputClass(!formData.school && isRequired('individual_school'))} px-4 py-3`} />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <RenderLabel label="Nume Grup" field="group_name" isRequired={isRequired} />
                                    <input value={formData.groupName || ''} onChange={e => updateField('groupName', e.target.value)} placeholder="Vocile..." className={`${getInputClass(!formData.groupName && isRequired('group_name'))} px-4 py-3`} />
                                </div>
                                <div>
                                    <RenderLabel label="Instituție / Școală" field="group_school" isRequired={isRequired} />
                                    <input value={formData.schoolGroup || ''} onChange={e => updateField('schoolGroup', e.target.value)} placeholder="Clubul..." className={`${getInputClass(!formData.schoolGroup && isRequired('group_school'))} px-4 py-3`} />
                                </div>
                            </div>
                        )}
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 text-center">
                            ℹ️ Datele de contact și facturare vor fi completate la pasul final.
                        </div>
                     </div>
                 )}

                 {/* --- STEP 3: REPERTOIRE --- */}
                 {step === 3 && (
                     <div className="animate-fade-in space-y-6">
                        <div className="space-y-6">
                            {pieces.map((piece, index) => {
                                const isNegativeRequired = requiresFileUpload(piece.section);
                                const isNegativeInvalid = isNegativeRequired && (
                                    (piece.negativeType === 'file' && !piece.fileName) ||
                                    (piece.negativeType === 'link' && !piece.youtubeLink?.trim())
                                );

                                return (
                                    <div key={piece.id} className="p-6 bg-violet-50 rounded-2xl border border-violet-100 shadow-sm relative">
                                        <div className="absolute top-0 right-0 bg-violet-200 text-brand-purple font-bold px-3 py-1 rounded-bl-xl text-sm">
                                            Piesa {index + 1}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                            <div className="md:col-span-2">
                                                <RenderLabel label="Secțiune Muzicală" field="piece_section" isRequired={isRequired} />
                                                
                                                <div className="relative custom-select-container">
                                                    <button
                                                        type="button"
                                                        onClick={() => setOpenDropdownId(openDropdownId === `${piece.id}_sec` ? null : `${piece.id}_sec`)}
                                                        className={`${getInputClass(!piece.section && isRequired('piece_section'))} px-4 py-3 text-left flex justify-between items-center group bg-white shadow-sm border-gray-300 hover:border-brand-purple transition-all`}
                                                    >
                                                        <span className={piece.section ? 'text-gray-900 font-bold' : 'text-gray-400 font-medium'}>
                                                            {piece.section || "Alege Secțiunea..."}
                                                        </span>
                                                        <svg className={`w-5 h-5 text-brand-purple transition-transform duration-300 ${openDropdownId === `${piece.id}_sec` ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/>
                                                        </svg>
                                                    </button>
                                                    
                                                    {openDropdownId === `${piece.id}_sec` && (
                                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[100] py-2 overflow-hidden animate-fade-in ring-4 ring-black/5">
                                                            {getAvailableSections().map(s => (
                                                                <button
                                                                    key={s.id}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        handlePieceUpdate(index, 'section', s.label);
                                                                        setOpenDropdownId(null);
                                                                    }}
                                                                    className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors flex items-center gap-3 ${piece.section === s.label ? 'bg-violet-50 text-brand-purple' : 'text-gray-600 hover:bg-gray-50 hover:text-brand-purple'}`}
                                                                >
                                                                    <div className={`w-2 h-2 rounded-full ${piece.section === s.label ? 'bg-brand-purple animate-pulse' : 'bg-gray-200'}`}></div>
                                                                    {s.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <RenderLabel label="Denumire Piesă" field="piece_name" isRequired={isRequired} />
                                                <input value={piece.name} onChange={e => handlePieceUpdate(index, 'name', e.target.value)} placeholder="Titlu..." className={`${getInputClass(!piece.name && isRequired('piece_name'))} px-4 py-3`} />
                                            </div>
                                            <div>
                                                <RenderLabel label="Artist Original" field="piece_artist" isRequired={isRequired} />
                                                <input value={piece.artist} onChange={e => handlePieceUpdate(index, 'artist', e.target.value)} placeholder="Artist..." className={`${getInputClass(!piece.artist && isRequired('piece_artist'))} px-4 py-3`} />
                                            </div>
                                            
                                            {isNegativeRequired && (
                                                <div className={`md:col-span-2 bg-white p-4 rounded-xl border transition-all ${attemptedSubmit && isNegativeInvalid ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                                                    <label className="block text-sm font-bold text-gray-800 mb-2">Negativ (MP3) sau Link YouTube <span className="text-pink-500">*</span></label>
                                                    <div className="flex gap-4 mb-3">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input type="radio" checked={piece.negativeType === 'file'} onChange={() => handlePieceUpdate(index, 'negativeType', 'file')} className="text-brand-purple" />
                                                            <span className="text-sm font-bold text-gray-700">Fișier MP3</span>
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input type="radio" checked={piece.negativeType === 'link'} onChange={() => handlePieceUpdate(index, 'negativeType', 'link')} className="text-brand-purple" />
                                                            <span className="text-sm font-bold text-gray-700">Link YouTube</span>
                                                        </label>
                                                    </div>
                                                    {piece.negativeType === 'file' ? (
                                                        <div className="relative">
                                                            <label className={`block w-full text-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors group ${piece.fileName ? 'border-green-300 bg-green-50' : attemptedSubmit ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                                                                <span className={`block font-bold ${piece.fileName ? 'text-green-600' : 'text-gray-400 group-hover:text-brand-purple'}`}>
                                                                    {piece.fileName ? `✅ ${piece.fileName}` : 'Click pentru a încărca fișierul...'}
                                                                </span>
                                                                <input 
                                                                    type="file" 
                                                                    accept=".mp3" 
                                                                    className="hidden" 
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) handlePieceUpdate(index, 'fileName', file.name);
                                                                    }}
                                                                />
                                                            </label>
                                                            {attemptedSubmit && !piece.fileName && <p className="text-red-500 text-[10px] font-bold mt-1 text-center">Trebuie să încarci un fișier MP3.</p>}
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <input 
                                                                value={piece.youtubeLink || ''} 
                                                                onChange={e => handlePieceUpdate(index, 'youtubeLink', e.target.value)} 
                                                                placeholder="https://youtube.com/..." 
                                                                className={`${getInputClass(!piece.youtubeLink?.trim() && attemptedSubmit)} px-4 py-3`} 
                                                            />
                                                            {attemptedSubmit && !piece.youtubeLink?.trim() && <p className="text-red-500 text-[10px] font-bold mt-1">Introdu link-ul YouTube.</p>}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                     </div>
                 )}

                 {/* --- STEP 4: BILLING & PAYMENT --- */}
                 {step === 4 && (
                     <div className="animate-fade-in space-y-8">
                        
                        <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200">
                            <h4 className="font-black text-gray-800 mb-6 flex items-center gap-2 text-xl border-b pb-4">
                                <span className="bg-brand-yellow text-brand-dark w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md">1</span>
                                Date Facturare & Contact
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <RenderLabel label="Nume și Prenume (Părinte/Facturare)" field="contact_name" isRequired={isRequired} />
                                    <InputIconWrapper icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>}>
                                        <input 
                                            value={formData.contactName || ''} 
                                            onChange={e => updateField('contactName', e.target.value)} 
                                            placeholder="Numele plătitorului" 
                                            className={`${getInputClass(!formData.contactName && isRequired('contact_name'))} pl-12 pr-4 py-3`} 
                                        />
                                    </InputIconWrapper>
                                </div>

                                <div>
                                    <RenderLabel label="Telefon Contact" field="contact_phone" isRequired={isRequired} />
                                    <InputIconWrapper icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.218 5.218l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>}>
                                        <input 
                                            value={formData.phone || ''} 
                                            onChange={e => updateField('phone', e.target.value)} 
                                            placeholder="07xx xxx xxx" 
                                            className={`${getInputClass(!formData.phone && isRequired('contact_phone'))} pl-12 pr-4 py-3`} 
                                        />
                                    </InputIconWrapper>
                                </div>

                                <div>
                                    <RenderLabel label="Email Contact" field="contact_email" isRequired={isRequired} />
                                    <InputIconWrapper icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>}>
                                        <input 
                                            type="email" 
                                            value={formData.email || ''} 
                                            onChange={e => updateField('email', e.target.value)} 
                                            placeholder="email@exemplu.com" 
                                            className={`${getInputClass(!formData.email && isRequired('contact_email'))} pl-12 pr-4 py-3`} 
                                        />
                                    </InputIconWrapper>
                                </div>

                                <div>
                                    <RenderLabel label="Județ" field="billing_county" isRequired={isRequired} />
                                    <select 
                                        value={formData.county || ''} 
                                        onChange={e => {
                                            updateFields({
                                                county: e.target.value,
                                                city: '' 
                                            });
                                        }} 
                                        className={`${getInputClass(!formData.county && isRequired('billing_county'))} px-4 py-3`}
                                    >
                                        <option value="">Alege Județ...</option>
                                        {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <RenderLabel label={isBucharest ? "Sector" : "Localitate"} field="billing_city" isRequired={isRequired} />
                                    {isBucharest ? (
                                        <select
                                            value={formData.city || ''}
                                            onChange={e => updateField('city', e.target.value)}
                                            className={`${getInputClass(!formData.city && isRequired('billing_city'))} px-4 py-3`}
                                        >
                                            <option value="">Alege Sector...</option>
                                            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    ) : (
                                        <input 
                                            value={formData.city || ''} 
                                            onChange={e => updateField('city', e.target.value)} 
                                            placeholder="Oraș / Comună / Sat" 
                                            className={`${getInputClass(!formData.city && isRequired('billing_city'))} px-4 py-3`} 
                                        />
                                    )}
                                </div>

                                <div>
                                    <RenderLabel label="Adresă (Stradă, Număr, Bloc, etc.)" field="billing_address" isRequired={isRequired} />
                                    <input 
                                        value={formData.address || ''} 
                                        onChange={e => updateField('address', e.target.value)} 
                                        placeholder="Strada Exemplului nr. 1, Bl. A, Ap. 2" 
                                        className={`${getInputClass(!formData.address && isRequired('billing_address'))} px-4 py-3`} 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                <h4 className="font-bold text-gray-800 mb-4 text-lg border-b pb-2">Sumar Înscriere</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-500">Participant:</span>
                                        <span className="font-bold text-gray-800">{formData.type === 'individual' ? formData.name : formData.groupName}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-500">Categorie:</span>
                                        <span className="font-bold text-gray-800">{formData.type === 'individual' ? formData.ageCategoryIndividual : formData.ageCategoryGroup}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-500">Pachet:</span>
                                        <span className="font-bold text-gray-800">{formData.type === 'individual' ? `${numarPiese} ${numarPiese && numarPiese > 1 ? 'Piese' : 'Piesă'}` : `Grup (${formData.groupMembersCount} pers)`}</span>
                                    </div>
                                    
                                    <div className="mt-4 pt-2 border-t border-gray-200">
                                        <div className="flex gap-2">
                                            <input 
                                                value={voucherInput} 
                                                onChange={e => setVoucherInput(e.target.value)} 
                                                placeholder="Cod Voucher" 
                                                disabled={!!formData.appliedVoucher}
                                                className="flex-grow p-2 border border-gray-300 rounded text-sm font-bold uppercase w-full"
                                            />
                                            {!formData.appliedVoucher ? (
                                                <button type="button" onClick={handleVoucherApply} className="bg-gray-800 text-white px-3 rounded font-bold text-xs">Aplică</button>
                                            ) : (
                                                <button type="button" onClick={handleVoucherRemove} className="bg-red-100 text-red-600 px-3 rounded font-bold text-xs">Șterge</button>
                                            )}
                                        </div>
                                        {voucherMessage && <p className={`text-xs mt-1 font-bold ${voucherMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{voucherMessage.text}</p>}
                                    </div>

                                    <div className="pt-4 flex justify-between items-center mt-2 border-t-2 border-gray-200">
                                        <span className="text-lg font-bold text-brand-dark">TOTAL DE PLATĂ:</span>
                                        <span className="text-2xl font-black text-brand-purple">{totalCost} RON</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col h-full">
                                {totalCost > 0 ? (
                                    <>
                                        <h4 className="font-bold text-gray-800 mb-4 text-lg">Alege Metoda de Plată <span className="text-pink-500">*</span></h4>
                                        <div className={`space-y-3 ${getInputClass(!formData.paymentMethod)} p-2 rounded-xl border-0 mb-4`}>
                                            <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-brand-purple bg-violet-50' : 'border-gray-200 hover:border-violet-200'}`}>
                                                <input type="radio" name="pay" value="card" checked={formData.paymentMethod === 'card'} onChange={() => updateField('paymentMethod', 'card')} className="w-5 h-5 text-brand-purple" />
                                                <div>
                                                    <span className="block font-bold text-gray-900 text-sm">Card Online (Netopia)</span>
                                                    <span className="text-xs text-gray-500">Rapid și Securizat. Confirmare instantă.</span>
                                                </div>
                                            </label>
                                            <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'transfer' ? 'border-brand-purple bg-violet-50' : 'border-gray-200 hover:border-violet-200'}`}>
                                                <input type="radio" name="pay" value="transfer" checked={formData.paymentMethod === 'transfer'} onChange={() => updateField('paymentMethod', 'transfer')} className="w-5 h-5 text-brand-purple" />
                                                <div>
                                                    <span className="block font-bold text-gray-900 text-sm">Transfer Bancar</span>
                                                    <span className="text-xs text-gray-500">Vei primi factura pe email.</span>
                                                </div>
                                            </label>
                                        </div>
                                        {attemptedSubmit && !formData.paymentMethod && <p className="text-red-500 text-xs -mt-2 mb-4">Alege metoda de plată.</p>}
                                    </>
                                ) : (
                                    <div className="h-auto mb-6 flex flex-col justify-center animate-bounce-in">
                                        <div className="bg-gradient-to-br from-green-400 to-emerald-600 text-white p-8 rounded-3xl shadow-2xl text-center transform transition-all hover:scale-105">
                                            <div className="text-6xl mb-4">🎁</div>
                                            <h4 className="text-3xl font-black mb-2 uppercase tracking-wide drop-shadow-md">100% GRATUIT!</h4>
                                            <p className="text-lg font-medium opacity-90 mb-6">
                                                Voucherul a acoperit întregul cost.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-auto">
                                    <label className={`flex items-start gap-3 cursor-pointer ${getInputClass(isRequired('terms_required') && !termsAgreed)} p-4 rounded-xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors`}>
                                        <input type="checkbox" checked={termsAgreed} onChange={e => setTermsAgreed(e.target.checked)} className="mt-1 w-5 h-5 text-brand-purple rounded" />
                                        <span className="text-xs text-gray-600 leading-snug">
                                            Sunt de acord cu <Link to="/termeni" target="_blank" className="font-bold text-brand-purple underline">Termenii și Condițiile</Link>, <Link to="/regulament-oficial" target="_blank" className="font-bold text-brand-purple underline">Regulamentul</Link> și prelucrarea datelor GDPR. {isRequired('terms_required') && <span className="text-pink-500">*</span>}
                                        </span>
                                    </label>
                                    {attemptedSubmit && isRequired('terms_required') && !termsAgreed && <p className="text-red-500 text-xs mt-1 text-center">Trebuie să accepți termenii.</p>}
                                </div>
                            </div>
                        </div>

                        {formData.paymentMethod === 'transfer' && totalCost > 0 && (
                            <div className="w-full bg-sky-50 border border-sky-200 rounded-xl p-6 animate-fade-in shadow-sm mt-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div>
                                        <h5 className="font-bold text-sky-900 mb-3 flex items-center gap-2 text-lg">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                                            Detalii pentru Transfer Bancar
                                        </h5>
                                        <ul className="text-sm text-sky-800 space-y-1 ml-1">
                                            <li><strong className="font-bold">Beneficiar:</strong> Art Show Media Entertainment</li>
                                            <li><strong className="font-bold">Banca:</strong> Banca Transilvania</li>
                                            <li><strong className="font-bold">IBAN:</strong> RO87BTRLRONCRT0675712701</li>
                                        </ul>
                                    </div>
                                    <div className="text-xs bg-white p-4 rounded-lg text-sky-700 border border-sky-100 max-w-xs shadow-sm">
                                        <p className="font-bold mb-1">💡 Notă Importantă:</p>
                                        Te rugăm să treci numele participantului (ex: <strong>{formData.type === 'individual' ? formData.name : formData.groupName}</strong>) la "Detalii plată" când efectuezi transferul.
                                    </div>
                                </div>
                            </div>
                        )}
                     </div>
                 )}

                 {/* --- NAVIGATION BUTTONS --- */}
                 <div className="flex justify-between pt-8 mt-8 border-t border-gray-100">
                     {step > 1 ? (
                         <button type="button" onClick={prevStep} disabled={isNavigating} className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50">
                             ← Înapoi
                         </button>
                     ) : (
                         <div></div> 
                     )}

                     {step < 4 ? (
                         <button type="button" onClick={nextStep} disabled={isNavigating} className="px-8 py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-opacity-90 shadow-lg hover:shadow-brand-purple/30 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                             Pasul Următor →
                         </button>
                     ) : (
                         <button type="submit" disabled={isSubmitting || isNavigating} className="px-10 py-4 bg-gradient-to-r from-brand-pink to-red-500 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-red-500/30 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed">
                             {isSubmitting ? 'Se trimite...' : totalCost === 0 ? 'Trimite Înscrierea Gratuită ✨' : 'Finalizează Înscrierea ✨'}
                         </button>
                     )}
                 </div>

             </form>

             {/* Group Switch Modal */}
             {showGroupSwitchConfirm && modalRoot && ReactDOM.createPortal(
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Sugestie Automată</h2>
                        <p className="text-gray-600 mb-6">
                            Numărul de membri introdus ({switchConfirmData?.members}) corespunde categoriei <strong>{switchConfirmData?.switchTo === 'grup_mic' ? 'Grup Mic' : 'Grup Mare'}</strong>. Doriți să comutăm automat?
                        </p>
                        <div className="flex gap-4">
                            <button onClick={cancelGroupSwitch} className="flex-1 bg-gray-100 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-200">Nu</button>
                            <button onClick={confirmGroupSwitch} className="flex-1 bg-brand-purple text-white font-bold py-3 rounded-lg hover:bg-opacity-90">Da, Comută</button>
                        </div>
                    </div>
                </div>,
                modalRoot
            )}
        </div>
    );
};

export default RegistrationForm;
