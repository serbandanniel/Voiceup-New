
import React, { useState, useEffect } from 'react';
import { FormConfig, Voucher } from '../../types';
import { DEFAULT_FORM_CONFIG } from '../../config';
import { AdminPageHeader, useNotification } from '../../components/admin';

const VouchersPage: React.FC = () => {
    const [config, setConfig] = useState<FormConfig>(DEFAULT_FORM_CONFIG);
    const [isEditing, setIsEditing] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    
    // Edit Form State
    const [showModal, setShowModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [voucherForm, setVoucherForm] = useState<Voucher>({
        code: '',
        discountType: 'percent',
        value: 10,
        active: true,
        source: 'manual'
    });

    const { showNotification } = useNotification();

    useEffect(() => {
        const stored = localStorage.getItem('formConfig');
        if (stored) {
            try { 
                const parsed = JSON.parse(stored);
                setConfig({ ...DEFAULT_FORM_CONFIG, ...parsed, vouchers: parsed.vouchers || [] }); 
            } catch (e) { console.error(e); }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('formConfig', JSON.stringify(config));
        setSaveStatus('Vouchere salvate!');
        setIsEditing(false);
        setTimeout(() => setSaveStatus(''), 2000);
        showNotification('Lista de vouchere a fost actualizată!', 'success');
    };

    const generateTestVouchers = () => {
        const testVouchers: Voucher[] = [
            { code: 'TEST10', discountType: 'percent', value: 10, active: true, source: 'manual', description: 'Test 10%' },
            { code: 'TEST25', discountType: 'percent', value: 25, active: true, source: 'manual', description: 'Test 25%' },
            { code: 'JUMATATE', discountType: 'percent', value: 50, active: true, source: 'manual', description: 'Test 50%' },
            { code: 'GRATUIT', discountType: 'free', value: 0, active: true, source: 'manual', description: 'Test Gratuit' },
            { code: 'MINUS50', discountType: 'fixed', value: 50, active: true, source: 'manual', description: 'Test 50 RON' },
        ];
        
        // Filter out duplicates based on code to avoid overwriting existing ones unintentionally, or just append
        const newVouchers = [...config.vouchers];
        let addedCount = 0;
        testVouchers.forEach(tv => {
            if (!newVouchers.some(v => v.code === tv.code)) {
                newVouchers.push(tv);
                addedCount++;
            }
        });
        
        setConfig({ ...config, vouchers: newVouchers });
        
        if (addedCount > 0) {
            showNotification(`${addedCount} vouchere de test au fost generate! Apasă Salvează.`, 'success');
            setIsEditing(true);
        } else {
            showNotification('Voucherele de test există deja.', 'info');
        }
    };

    const openAddModal = () => {
        setVoucherForm({
            code: '',
            discountType: 'percent',
            value: 10,
            active: true,
            source: 'manual',
            startDate: '',
            endDate: ''
        });
        setEditingIndex(null);
        setShowModal(true);
        setIsEditing(true);
    };

    const openEditModal = (voucher: Voucher, index: number) => {
        setVoucherForm({ ...voucher });
        setEditingIndex(index);
        setShowModal(true);
        setIsEditing(true);
    };

    const handleDelete = (index: number) => {
        if(window.confirm('Sigur vrei să ștergi acest voucher?')) {
            const newVouchers = config.vouchers.filter((_, i) => i !== index);
            setConfig({ ...config, vouchers: newVouchers });
            setIsEditing(true); // Mark as dirty
        }
    };

    const saveModal = () => {
        if (!voucherForm.code) {
            alert('Te rog introdu un cod de voucher.');
            return;
        }

        const newVouchers = [...config.vouchers];
        if (editingIndex !== null) {
            newVouchers[editingIndex] = voucherForm;
        } else {
            // Check for duplicate code
            if (newVouchers.some(v => v.code === voucherForm.code)) {
                alert('Acest cod de voucher există deja!');
                return;
            }
            newVouchers.push(voucherForm);
        }

        setConfig({ ...config, vouchers: newVouchers });
        setShowModal(false);
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
            <AdminPageHeader 
                title="Administrare Vouchere & Coduri Promo"
                description="Creează vouchere valorice, procentuale sau pentru înscriere gratuită."
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={() => window.location.reload()}
                saveStatus={saveStatus}
            >
                <div className="flex gap-2">
                    <button onClick={generateTestVouchers} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 shadow-sm transition-all flex items-center gap-2 text-sm border border-gray-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                        Generează Test
                    </button>
                    <button onClick={openAddModal} className="bg-brand-pink text-white px-4 py-2 rounded-lg font-bold hover:bg-pink-600 shadow-md transition-all flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                        Voucher Nou
                    </button>
                </div>
            </AdminPageHeader>

            <div className="space-y-6">
                {/* Vouchers Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Cod</th>
                                <th className="px-6 py-3">Tip Reducere</th>
                                <th className="px-6 py-3">Valoare</th>
                                <th className="px-6 py-3">Valabilitate</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Acțiuni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {config.vouchers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                        Nu există vouchere create. Apasă pe "Voucher Nou".
                                    </td>
                                </tr>
                            )}
                            {config.vouchers.map((v, idx) => (
                                <tr key={idx} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-black text-brand-dark font-mono text-base">
                                        {v.code}
                                        {v.source === 'wheel' && <span className="ml-2 text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">ROATĂ</span>}
                                        {v.source === 'manual' && <span className="ml-2 text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">MANUAL</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        {v.discountType === 'free' ? (
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-bold text-xs uppercase">100% GRATUIT</span>
                                        ) : v.discountType === 'percent' ? (
                                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded font-bold text-xs">PROCENTUAL</span>
                                        ) : (
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold text-xs">SUMĂ FIXĂ</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-bold">
                                        {v.discountType === 'free' ? '---' : v.discountType === 'percent' ? `${v.value}%` : `${v.value} RON`}
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        {v.startDate ? new Date(v.startDate).toLocaleDateString() : '∞'} - {v.endDate ? new Date(v.endDate).toLocaleDateString() : '∞'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`w-3 h-3 rounded-full inline-block mr-2 ${v.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        {v.active ? 'Activ' : 'Inactiv'}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => openEditModal(v, idx)} className="text-brand-purple hover:underline font-bold">Editează</button>
                                        <button onClick={() => handleDelete(idx)} className="text-red-500 hover:underline font-bold">Șterge</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Editare/Adaugare */}
            {showModal && (
                <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800">
                                {editingIndex !== null ? 'Editare Voucher' : 'Voucher Nou'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cod Voucher</label>
                                <input 
                                    value={voucherForm.code}
                                    onChange={e => setVoucherForm({...voucherForm, code: e.target.value.toUpperCase()})}
                                    className="w-full p-3 border border-gray-300 rounded-lg font-mono font-bold text-lg uppercase focus:ring-2 focus:ring-brand-purple outline-none"
                                    placeholder="EX: PROMO2025"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tip Promoție</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button 
                                        onClick={() => setVoucherForm({...voucherForm, discountType: 'fixed'})}
                                        className={`p-3 rounded-lg border text-sm font-bold transition-all ${voucherForm.discountType === 'fixed' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        💰 Valorică
                                    </button>
                                    <button 
                                        onClick={() => setVoucherForm({...voucherForm, discountType: 'percent'})}
                                        className={`p-3 rounded-lg border text-sm font-bold transition-all ${voucherForm.discountType === 'percent' ? 'bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        Percent %
                                    </button>
                                    <button 
                                        onClick={() => setVoucherForm({...voucherForm, discountType: 'free'})}
                                        className={`p-3 rounded-lg border text-sm font-bold transition-all ${voucherForm.discountType === 'free' ? 'bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        🎁 Gratuit
                                    </button>
                                </div>
                            </div>

                            {voucherForm.discountType !== 'free' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                        Valoare {voucherForm.discountType === 'percent' ? '(%)' : '(RON)'}
                                    </label>
                                    <input 
                                        type="number"
                                        value={voucherForm.value}
                                        onChange={e => setVoucherForm({...voucherForm, value: parseFloat(e.target.value)})}
                                        className="w-full p-3 border border-gray-300 rounded-lg font-bold text-lg focus:ring-2 focus:ring-brand-purple outline-none"
                                    />
                                </div>
                            )}

                            {voucherForm.discountType === 'free' && (
                                <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-xs text-green-800">
                                    <strong className="block mb-1">ℹ️ Info:</strong>
                                    Acest voucher va face costul total <strong>0 RON</strong>. Utilizatorului nu i se vor mai cere datele de plată (card/transfer), înscrierea fiind confirmată automat.
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dată Start (Opțional)</label>
                                    <input 
                                        type="datetime-local"
                                        value={voucherForm.startDate || ''}
                                        onChange={e => setVoucherForm({...voucherForm, startDate: e.target.value})}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                        style={{ colorScheme: 'light' }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dată Expirare (Opțional)</label>
                                    <input 
                                        type="datetime-local"
                                        value={voucherForm.endDate || ''}
                                        onChange={e => setVoucherForm({...voucherForm, endDate: e.target.value})}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                        style={{ colorScheme: 'light' }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={voucherForm.active}
                                        onChange={e => setVoucherForm({...voucherForm, active: e.target.checked})}
                                        className="w-5 h-5 text-brand-purple rounded focus:ring-brand-purple"
                                    />
                                    <span className="font-bold text-gray-700 text-sm">Voucher Activ</span>
                                </label>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition-colors">
                                Anulează
                            </button>
                            <button onClick={saveModal} className="px-6 py-2 bg-brand-purple text-white font-bold rounded-lg hover:bg-opacity-90 shadow-md transition-all">
                                Salvează Voucher
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VouchersPage;
