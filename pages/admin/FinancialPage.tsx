
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { RegistrationData } from '../../types';
import { dataService } from '../../services/dataService';
import { AdminPageHeader, useNotification } from '../../components/admin';
import { formatCurrency, formatDate } from '../../utils/formatters';

const FinancialPage: React.FC = () => {
    const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchData = async () => {
            const data = await dataService.getRegistrations();
            setRegistrations(data);
        };
        fetchData();
    }, []);

    // --- CALCULATIONS ---
    const totalRevenue = registrations
        .filter(r => r.status === 'paid')
        .reduce((acc, curr) => acc + curr.totalCost, 0);

    const pendingRevenue = registrations
        .filter(r => r.status === 'pending')
        .reduce((acc, curr) => acc + curr.totalCost, 0);

    const paidRegs = registrations.filter(r => r.status === 'paid');
    
    const byMethod = {
        card: paidRegs.filter(r => r.paymentMethod === 'card').reduce((acc, curr) => acc + curr.totalCost, 0),
        transfer: paidRegs.filter(r => r.paymentMethod === 'transfer').reduce((acc, curr) => acc + curr.totalCost, 0),
        countCard: paidRegs.filter(r => r.paymentMethod === 'card').length,
        countTransfer: paidRegs.filter(r => r.paymentMethod === 'transfer').length,
    };

    const handleExport = () => {
        const data = registrations.map(r => ({
            ID: r.id,
            Data: formatDate(r.submissionDate),
            'Nume Participant': r.type === 'individual' ? r.name : r.groupName,
            'Tip': r.type,
            'Nume Facturare': r.contactName || (r.type === 'individual' ? r.name : '-'),
            'Email': r.email,
            'Telefon': r.phone,
            'Județ': r.county,
            'Localitate': r.city,
            'Adresă': r.address,
            'Metoda Plată': r.paymentMethod === 'card' ? 'Card Online' : 'Transfer Bancar',
            'Status': r.status === 'paid' ? 'CONFIRMAT' : 'ÎN AȘTEPTARE',
            'Sumă (RON)': r.totalCost
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Financiar_Detaliat");
        XLSX.writeFile(wb, `Raport_Financiar_${new Date().toISOString().split('T')[0]}.xlsx`);
        showNotification('Raportul financiar detaliat a fost descărcat!', 'success');
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in space-y-8">
            <AdminPageHeader 
                title="Rapoarte Financiare"
                description="Situația încasărilor, metode de plată și statusuri."
                isEditing={false}
                onEdit={() => {}}
                onSave={() => {}}
                onCancel={() => {}}
            >
                <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 shadow-md transition-all flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Export Excel Detaliat
                </button>
            </AdminPageHeader>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border border-green-200 shadow-sm">
                    <p className="text-xs font-bold text-green-800 uppercase tracking-wider mb-1">Încasări Totale (Confirmate)</p>
                    <h3 className="text-3xl font-black text-green-700">{formatCurrency(totalRevenue)}</h3>
                    <div className="mt-4 flex gap-2 text-xs font-semibold">
                        <span className="bg-white/60 px-2 py-1 rounded text-green-800">{paidRegs.length} tranzacții</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-100 p-6 rounded-2xl border border-yellow-200 shadow-sm">
                    <p className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1">În Așteptare (Neplătite)</p>
                    <h3 className="text-3xl font-black text-yellow-700">{formatCurrency(pendingRevenue)}</h3>
                    <div className="mt-4 flex gap-2 text-xs font-semibold">
                        <span className="bg-white/60 px-2 py-1 rounded text-yellow-800">{registrations.filter(r => r.status === 'pending').length} tranzacții</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Split Metode Plată (Valoare)</p>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden flex">
                            <div style={{ width: `${(byMethod.card / totalRevenue) * 100}%` }} className="bg-brand-purple h-full"></div>
                            <div style={{ width: `${(byMethod.transfer / totalRevenue) * 100}%` }} className="bg-brand-pink h-full"></div>
                        </div>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                        <span className="text-brand-purple flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-brand-purple"></div> Card: {formatCurrency(byMethod.card)}
                        </span>
                        <span className="text-brand-pink flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-brand-pink"></div> Transfer: {formatCurrency(byMethod.transfer)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Transaction Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Nume Facturare</th>
                            <th className="px-6 py-3">Participant</th>
                            <th className="px-6 py-3">Data</th>
                            <th className="px-6 py-3">Metodă</th>
                            <th className="px-6 py-3">Sumă</th>
                            <th className="px-6 py-3 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {registrations.slice().reverse().map(reg => (
                            <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-800">
                                    {reg.contactName || reg.name}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {reg.type === 'individual' ? reg.name : reg.groupName}
                                </td>
                                <td className="px-6 py-4 text-gray-500">{formatDate(reg.submissionDate)}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {reg.paymentMethod === 'card' ? (
                                            <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs font-bold">💳 Card</span>
                                        ) : (
                                            <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs font-bold">🏦 Transfer</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono font-bold text-gray-900">{reg.totalCost} RON</td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${reg.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {reg.status === 'paid' ? 'CONFIRMAT' : 'ÎN AȘTEPTARE'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FinancialPage;
