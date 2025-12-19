
import React, { useState, useEffect } from 'react';
import { RegistrationData, Piece, FormConfig, FieldRequirements, MobilPayConfig, SmartBillConfig, EmailConfig, LocationConfig } from '../types';
import { DEFAULT_FORM_CONFIG, DEFAULT_MOBILPAY_CONFIG, DEFAULT_SMARTBILL_CONFIG, DEFAULT_EMAIL_CONFIG, DEFAULT_LOCATION_CONFIG } from '../config';
import { dataService } from '../services/dataService';

const DEFAULT_LINKS: Record<string, string> = {
    '1': 'https://mpy.ro/a60vgs6ht?language=ro', 
    '2': 'https://mpy.ro/a60vgxdht?language=ro', 
    '3': 'https://mpy.ro/a60vgxeht?language=ro',
    'grup_2': 'https://mpy.ro/a60vgxfht?language=ro',
    'grup_3': 'https://mpy.ro/a60vgxght?language=ro',
    'grup_4': 'https://mpy.ro/a60vgxiht?language=ro',
    'grup_5': 'https://mpy.ro/a60vgxqht?language=ro',
    'grup_6': 'https://mpy.ro/a60vgxrht?language=ro',
    'grup_7': 'https://mpy.ro/a60vgxsht?language=ro',
    'grup_8': 'https://mpy.ro/a60vgxtht?language=ro',
    'grup_9': 'https://mpy.ro/a60vgxuht?language=ro',
    'grup_10': 'https://mpy.ro/a60vgxvht?language=ro',
    'grup_mic': 'https://mpy.ro/a60vgxfht?language=ro', 
    'grup_mare': 'https://mpy.ro/a60vgxght?language=ro',
};

const getInitialPiece = (id: string): Piece => ({
    id, section: '', name: '', artist: '', negativeType: 'file', fileName: '', youtubeLink: ''
});

export const useForm = () => {
    const [config, setConfig] = useState<FormConfig>(DEFAULT_FORM_CONFIG);
    const [mobilPayConfig, setMobilPayConfig] = useState<MobilPayConfig>(DEFAULT_MOBILPAY_CONFIG);
    const [smartBillConfig, setSmartBillConfig] = useState<SmartBillConfig>(DEFAULT_SMARTBILL_CONFIG);
    const [emailConfig, setEmailConfig] = useState<EmailConfig>(DEFAULT_EMAIL_CONFIG);
    const [locationConfig, setLocationConfig] = useState<LocationConfig>(DEFAULT_LOCATION_CONFIG);
    const [paymentLinks, setPaymentLinks] = useState<Record<string, string>>(DEFAULT_LINKS);
    const [formData, setFormData] = useState<Partial<RegistrationData>>({ type: undefined, paymentMethod: undefined, status: 'pending', appliedVoucher: '' });
    const [pieces, setPieces] = useState<Piece[]>([]);
    const [numarPiese, setNumarPiese] = useState<number | undefined>(undefined);
    const [totalCost, setTotalCost] = useState(0);
    const [currentPaymentLink, setCurrentPaymentLink] = useState('');
    const [voucherInput, setVoucherInput] = useState('');
    const [voucherMessage, setVoucherMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [attemptedSubmit, setAttemptedSubmit] = useState(false); 
    const [showGroupSwitchConfirm, setShowGroupSwitchConfirm] = useState(false);
    const [switchConfirmData, setSwitchConfirmData] = useState<{ members: number; switchTo: 'grup_mic' | 'grup_mare' } | null>(null);

    useEffect(() => {
        const storedLinks = localStorage.getItem('paymentLinks');
        if (storedLinks) try { setPaymentLinks({ ...DEFAULT_LINKS, ...JSON.parse(storedLinks) }); } catch (e) {}
        
        const storedConfig = localStorage.getItem('formConfig');
        if (storedConfig) {
             const parsed = JSON.parse(storedConfig);
             setConfig({ ...DEFAULT_FORM_CONFIG, ...parsed, vouchers: parsed.vouchers || [] });
        }
        
        const storedMobilPay = localStorage.getItem('mobilPayConfig');
        if (storedMobilPay) try { setMobilPayConfig({ ...DEFAULT_MOBILPAY_CONFIG, ...JSON.parse(storedMobilPay) }); } catch(e){}
        
        const storedSmartBill = localStorage.getItem('smartBillConfig');
        if (storedSmartBill) try { setSmartBillConfig({ ...DEFAULT_SMARTBILL_CONFIG, ...JSON.parse(storedSmartBill) }); } catch(e){}
        
        const storedEmail = localStorage.getItem('emailConfig');
        if (storedEmail) try { setEmailConfig({ ...DEFAULT_EMAIL_CONFIG, ...JSON.parse(storedEmail) }); } catch(e){}

        const storedLocation = localStorage.getItem('locationConfig');
        if (storedLocation) try { setLocationConfig({ ...DEFAULT_LOCATION_CONFIG, ...JSON.parse(storedLocation) }); } catch(e){}
    }, []);

    useEffect(() => {
        let cost = 0;
        let linkKey = '';
        const now = new Date();
        const promoActive = config.promotion.enabled && now < new Date(config.promotion.endDate);
        const activeCosts = promoActive ? config.promotion.costs : config.costs;

        if (formData.type === 'individual' && numarPiese) {
            cost = activeCosts.individual[numarPiese.toString() as '1'|'2'|'3'] || 0;
            linkKey = numarPiese.toString();
        } else if (formData.type === 'grup' && formData.groupMembersCount && formData.groupType) {
            cost = (formData.groupType === 'grup_mic' ? activeCosts.group.small : activeCosts.group.large) * formData.groupMembersCount;
            linkKey = paymentLinks[`grup_${formData.groupMembersCount}`] ? `grup_${formData.groupMembersCount}` : formData.groupType;
        }

        if (formData.appliedVoucher) {
            const voucher = config.vouchers?.find(v => v.code === formData.appliedVoucher && v.active);
            if (voucher) {
                if (voucher.discountType === 'percent') cost -= (cost * (voucher.value / 100));
                else if (voucher.discountType === 'fixed') cost = Math.max(0, cost - voucher.value);
                else if (voucher.discountType === 'free') cost = 0;
                if (paymentLinks[`${linkKey}_${formData.appliedVoucher}`]) linkKey = `${linkKey}_${formData.appliedVoucher}`;
            }
        }
        setTotalCost(Math.round(cost)); 
        setCurrentPaymentLink(paymentLinks[linkKey] || '#');
    }, [formData.type, formData.groupType, formData.groupMembersCount, numarPiese, formData.appliedVoucher, paymentLinks, config]);

    const handleVoucherApply = () => {
        const code = voucherInput.trim().toUpperCase();
        const v = config.vouchers?.find(v => v.code === code && v.active);
        if (v) {
            setFormData(prev => ({ ...prev, appliedVoucher: code }));
            setVoucherMessage({ type: 'success', text: `Voucher aplicat!` });
        } else setVoucherMessage({ type: 'error', text: 'Cod invalid.' });
    };

    const triggerSmartBillInvoice = async (data: RegistrationData) => {
        if (!smartBillConfig.enabled || !smartBillConfig.serverEndpoint) return;
        try {
            const payload = {
                cif: smartBillConfig.cif, user: smartBillConfig.username, token: smartBillConfig.token, series: smartBillConfig.seriesName, vat_percent: smartBillConfig.defaultVatPercent,
                client_name: data.contactName || data.name, client_address: data.address, client_city: data.city, client_county: data.county, client_email: data.email, client_phone: data.phone,
                product_name: `Taxa VoiceUP - ${data.type === 'individual' ? data.name : data.groupName}`, product_qty: 1, product_price: data.totalCost, order_id: data.id
            };
            fetch(smartBillConfig.serverEndpoint, { method: 'POST', body: JSON.stringify(payload), keepalive: true }).catch(() => {});
        } catch (e) {}
    };

    const triggerEmailNotification = async (data: RegistrationData) => {
        if (!emailConfig.serverEndpoint || !data.email) return;

        const getDynamicPaymentContent = (mode: 'transfer' | 'card') => {
            if (mode === 'transfer') {
                return `<div style="border: 2px solid #ef4444; background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                    <h3 style="color: #991b1b; margin-top: 0; font-size: 18px;">⚠️ ACȚIUNE NECESARĂ: Confirmare Plată</h3>
                    <p style="margin-bottom: 15px; font-weight: bold; font-size: 15px; color: #7f1d1d;">Pentru a valida înscrierea, este IMPERATIV să ne trimiți dovada plății (OP).</p>
                    <p style="color: #dc2626; font-size: 14px; font-weight: bold;">❗️ În lipsa dovezii de plată, înscrierea riscă să fie anulată.</p>
                </div>`;
            } else {
                return `<div style="border: 1px solid #22c55e; background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                    <h3 style="color: #166534; margin-top: 0;">✅ Plată Confirmată</h3>
                    <p style="color: #15803d; font-weight: bold;">Plata ta a fost înregistrată cu succes prin Netopia.</p>
                </div>`;
            }
        };

        const templateMap: Record<string, string> = {
            nume: data.type === 'individual' ? (data.name || '') : (data.groupName || ''),
            tip: data.type === 'individual' ? 'Individual' : 'Grup',
            categorie: data.type === 'individual' ? (data.ageCategoryIndividual || '') : (data.ageCategoryGroup || ''),
            varsta_exacta: data.ageExact ? `${data.ageExact} ani` : '-',
            piese: data.pieces.map(p => `${p.name} (${p.artist})`).join(', '),
            cost: data.totalCost.toString(),
            nume_facturare: data.contactName || (data.name || ''),
            telefon: data.phone || '',
            email_contact: data.email || '',
            adresa_facturare: `${data.county || ''}, ${data.city || ''}, ${data.address || ''}`,
            data_eveniment: locationConfig.startDate,
            locatie: locationConfig.locationName,
            adresa: locationConfig.address,
            link_waze: locationConfig.wazeLink,
            link_maps: locationConfig.googleMapsLink,
            continut_dinamic_plata: getDynamicPaymentContent((data.paymentMethod as any) || 'transfer')
        };

        let finalBody = emailConfig.body;
        Object.entries(templateMap).forEach(([key, val]) => {
            finalBody = finalBody.replace(new RegExp(`{${key}}`, 'g'), val);
        });

        const finalSubject = emailConfig.subject.replace('{nume}', templateMap.nume);

        try {
            fetch(emailConfig.serverEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: data.email,
                    subject: finalSubject,
                    body: finalBody
                })
            }).catch(() => {});
        } catch (e) {}
    };

    const submitForm = async (onSuccess: (data: RegistrationData & { paymentLink: string }) => void) => {
        setAttemptedSubmit(true); 
        if (!validateStep(4)) return;
        
        setIsSubmitting(true);
        const generatedId = Date.now().toString();

        if (totalCost > 0 && formData.paymentMethod === 'card' && mobilPayConfig.integrationMode === 'server_form') {
            const payPayload = {
                apiKey: mobilPayConfig.signature,
                testMode: mobilPayConfig.testMode,
                orderId: generatedId,
                amount: totalCost,
                billing_first_name: (formData.contactName || '').split(' ')[0],
                billing_last_name: (formData.contactName || '').split(' ').slice(1).join(' '),
                billing_email: formData.email,
                billing_phone: formData.phone,
                billing_city: formData.city,
                billing_address: formData.address,
                billing_county: formData.county,
                details: `Taxa VoiceUP - ${formData.type === 'individual' ? formData.name : formData.groupName}`
            };

            try {
                const res = await fetch(mobilPayConfig.serverEndpoint, { method: 'POST', body: JSON.stringify(payPayload) });
                const netopiaData = await res.json();
                if (netopiaData.paymentUrl) {
                    const finalData: RegistrationData = { ...formData as RegistrationData, id: generatedId, submissionDate: new Date().toISOString(), pieces, totalCost, status: 'pending' };
                    await dataService.submitRegistration(finalData);
                    triggerEmailNotification(finalData);
                    window.location.href = netopiaData.paymentUrl;
                    return;
                }
            } catch (e) {
                alert("Eroare plată. Te rugăm să încerci din nou.");
                setIsSubmitting(false);
                return;
            }
        }

        const finalData: RegistrationData = { ...formData as RegistrationData, id: generatedId, submissionDate: new Date().toISOString(), pieces, totalCost, status: (totalCost === 0 ? 'paid' : 'pending'), paymentLink: currentPaymentLink };
        await dataService.submitRegistration(finalData);
        if (smartBillConfig.enabled) triggerSmartBillInvoice(finalData);
        triggerEmailNotification(finalData);
        onSuccess(finalData as any);
        setIsSubmitting(false);
    };

    const confirmGroupSwitch = () => {
        if (switchConfirmData) {
            setFormData(prev => ({ ...prev, groupType: switchConfirmData.switchTo }));
        }
        setShowGroupSwitchConfirm(false);
    };

    const cancelGroupSwitch = () => {
        setShowGroupSwitchConfirm(false);
    };

    const isFieldRequired = (field: keyof FieldRequirements) => config.fieldRequirements[field];

    const validateStep = (s: number): boolean => {
        if (s === 1) {
            if (!formData.type) return false;
            if (formData.type === 'individual') {
                if (isFieldRequired('individual_age') && !formData.ageCategoryIndividual) return false;
                if (!numarPiese) return false;
            } else {
                if (isFieldRequired('group_age') && !formData.ageCategoryGroup) return false;
                if ((isFieldRequired('group_members') && !formData.groupMembersCount) || !formData.groupType) return false;
            }
            return true;
        }

        if (s === 2) {
            if (formData.type === 'individual') {
                if (isFieldRequired('individual_name') && !formData.name?.trim()) return false;
                if (isFieldRequired('individual_exact_age') && !formData.ageExact) return false;
                if (isFieldRequired('individual_professor') && !formData.professor?.trim()) return false;
                if (isFieldRequired('individual_school') && !formData.school?.trim()) return false;
            } else {
                if (isFieldRequired('group_name') && !formData.groupName?.trim()) return false;
                if (isFieldRequired('group_school') && !formData.schoolGroup?.trim()) return false;
            }
            return true;
        }

        if (s === 3) {
            if (pieces.length === 0) return false;
            return pieces.every(p => {
                if (isFieldRequired('piece_section') && !p.section) return false;
                if (isFieldRequired('piece_name') && !p.name?.trim()) return false;
                if (isFieldRequired('piece_artist') && !p.artist?.trim()) return false;
                const sectionCfg = config.musicSections.find(s => s.label === p.section);
                const isNegativeRequired = sectionCfg ? (sectionCfg.requiresFile !== false) : true;
                if (isNegativeRequired) {
                    if (p.negativeType === 'link' && !p.youtubeLink?.trim()) return false;
                    if (p.negativeType === 'file' && !p.fileName?.trim()) return false;
                }
                return true;
            });
        }

        if (s === 4) {
            if (isFieldRequired('contact_name') && !formData.contactName?.trim()) return false;
            if (isFieldRequired('contact_phone') && !formData.phone?.trim()) return false;
            if (isFieldRequired('contact_email') && !formData.email?.trim()) return false;
            if (isFieldRequired('billing_county') && !formData.county) return false;
            if (isFieldRequired('billing_city') && !formData.city) return false;
            if (isFieldRequired('billing_address') && !formData.address?.trim()) return false;
            if (totalCost > 0 && !formData.paymentMethod) return false;
            return true;
        }

        return false;
    };

    return {
        config, formData, pieces, numarPiese, totalCost, isSubmitting, attemptedSubmit, setAttemptedSubmit, voucherInput, setVoucherInput, voucherMessage, handleVoucherApply,
        handleTypeChange: (t: any) => { setFormData({...formData, type: t}); setPieces(t === 'grup' ? [getInitialPiece('1')] : []); },
        handlePieceCountChange: (c: number) => { setNumarPiese(c); setPieces(Array(c).fill(null).map((_, i) => getInitialPiece(i.toString()))); },
        handlePieceUpdate: (i: number, f: any, v: any) => { const p = [...pieces]; p[i] = {...p[i], [f]: v}; setPieces(p); },
        updateField: (f: any, v: any) => {
            if (f === 'groupMembersCount' && formData.type === 'grup') {
                const num = parseInt(v);
                if (formData.groupType === 'grup_mic' && num > 5) {
                    setSwitchConfirmData({ members: num, switchTo: 'grup_mare' });
                    setShowGroupSwitchConfirm(true);
                } else if (formData.groupType === 'grup_mare' && num <= 5) {
                    setSwitchConfirmData({ members: num, switchTo: 'grup_mic' });
                    setShowGroupSwitchConfirm(true);
                }
            }
            setFormData(prev => ({...prev, [f]: v}));
        },
        updateFields: (u: any) => setFormData({...formData, ...u}),
        handleVoucherRemove: () => { setFormData({...formData, appliedVoucher: ''}); setVoucherInput(''); setVoucherMessage(null); },
        submitForm, handleGroupTypeChange: (gt: any) => setFormData({...formData, groupType: gt, groupMembersCount: undefined}),
        validateStep,
        isRequired: isFieldRequired,
        showGroupSwitchConfirm,
        confirmGroupSwitch,
        cancelGroupSwitch,
        switchConfirmData
    };
};
