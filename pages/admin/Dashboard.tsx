
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { RegistrationData } from '../../types';
import { dataService } from '../../services/dataService';
import { AdminPageHeader, useNotification } from '../../components/admin';
import { formatDate, formatCurrency } from '../../utils/formatters';

const Dashboard: React.FC = () => {
    const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showNotification } = useNotification();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            const data = await dataService.getRegistrations();
            // Sort by date desc
            setRegistrations(data.sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()));
            setIsLoading(false);
        };
        loadData();
    }, []);

    const handleExport = (type: 'individual' | 'grup' | 'all') => {
        const dataToExport = registrations
            .filter(r => type === 'all' || r.type === type)
            .map(r => ({
                ID: r.id,
                Data: formatDate(r.submissionDate),
                Tip: r.type.toUpperCase(),
                // Date Participant
                'Nume Participant/Grup': r.type === 'individual' ? r.name : r.groupName,
                'Categorie Vârstă': r.type === 'individual' ? r.ageCategoryIndividual : r.ageCategoryGroup,
                'Vârstă Exactă (Ani)': r.type === 'individual' ? (r.ageExact || '-') : '-',
                'Nr. Piese/Membri': r.type === 'individual' ? r.numarPieseIndividual : r.groupMembersCount,
                'Instituție': r.type === 'individual' ? r.school : r.schoolGroup,
                'Profesor Coordonator': r.professor || '-',
                // Date Facturare
                'Nume Facturare': r.contactName || (r.type === 'individual' ? r.name : '-'),
                'Telefon Contact': r.phone,
                'Email Contact': r.email,
                'Județ': r.county || '-',
                'Oraș': r.city || r.contactCity || '-',
                'Adresă': r.address || '-',
                // Detalii Tehnice
                'Repertoriu': r.pieces.map(p => `${p.name} (${p.artist})`).join(' | '),
                'Cost Total': r.totalCost,
                'Status Plată': r.status === 'paid' ? 'CONFIRMAT' : 'PENDING',
                'Metoda Plată': r.paymentMethod,
                'Factura': r.isInvoiced ? `${r.invoiceSeries} ${r.invoiceNumber}` : 'Neemisă'
            }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Inscrieri_Complete");
        XLSX.writeFile(wb, `Inscrieri_${type}_${new Date().toISOString().split('T')[0]}.xlsx`);
        showNotification(`Export ${type} generat cu succes!`, 'success');
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // KPI Calculations
    const totalRegs = registrations.length;
    const individualCount = registrations.filter(r => r.type === 'individual').length;
    const groupCount = registrations.filter(r => r.type === 'grup').length;
    const paidCount = registrations.filter(r => r.status === 'paid').length;

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in space-y-8">
            <AdminPageHeader 
                title="Panou de Control"
                description="Privire de ansamblu asupra înscrierilor recente."
                isEditing={false}
                onEdit={() => {}}
                onSave={() => {}}
                onCancel={() => {}}
            >
                <div className="flex gap-2">
                    <button onClick={() => handleExport('individual')} className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg font-bold text-sm hover:bg-blue-200 transition-colors">
                        Export Individual
                    </button>
                    <button onClick={() => handleExport('grup')} className="bg-purple-100 text-purple-700 px-3 py-2 rounded-lg font-bold text-sm hover:bg-purple-200 transition-colors">
                        Export Grupuri
                    </button>
                    <button onClick={() => handleExport('all')} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors">
                        Export Tot
                    </button>
                </div>
            </AdminPageHeader>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs font-bold text-gray-500 uppercase">Total Înscrieri</p>
                    <p className="text-2xl font-black text-gray-800">{totalRegs}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-xs font-bold text-blue-500 uppercase">Individual</p>
                    <p className="text-2xl font-black text-blue-700">{individualCount}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <p className="text-xs font-bold text-purple-500 uppercase">Grupuri</p>
                    <p className="text-2xl font-black text-purple-700">{groupCount}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <p className="text-xs font-bold text-green-600 uppercase">Confirmate (Paid)</p>
                    <p className="text-2xl font-black text-green-700">{paidCount}</p>
                </div>
            </div>

            {/* Recent Registrations List */}
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-800 border-b border-gray-100 pb-2">Înscrieri Recente</h3>
                {isLoading ? (
                    <div className="text-center py-8 text-gray-400">Se încarcă datele...</div>
                ) : registrations.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">Nu există înscrieri momentan.</div>
                ) : (
                    <div className="space-y-3">
                        {registrations.slice(0, 50).map(reg => (
                            <div key={reg.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white">
                                {/* Compact Row */}
                                <div 
                                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer bg-white"
                                    onClick={() => toggleExpand(reg.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${reg.type === 'individual' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                                            {reg.type === 'individual' ? 'I' : 'G'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                                {reg.type === 'individual' ? reg.name : reg.groupName}
                                                {reg.ageExact && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">{reg.ageExact} ani</span>}
                                            </h4>
                                            <p className="text-xs text-gray-500">{formatDate(reg.submissionDate)} • {reg.city || reg.contactCity}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden md:block">
                                            <div className="text-xs text-gray-400 font-bold uppercase">Facturare</div>
                                            <div className="text-sm font-semibold text-gray-700">{reg.contactName || reg.name}</div>
                                        </div>
                                        <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${reg.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {reg.status === 'paid' ? 'PAID' : 'PENDING'}
                                            </span>
                                            <span className="font-mono font-bold text-gray-700 w-20 text-right">{formatCurrency(reg.totalCost)}</span>
                                            <svg className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${expandedId === reg.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Detail View */}
                                {expandedId === reg.id && (
                                    <div className="bg-gray-50 border-t border-gray-100 p-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm animate-fade-in">
                                        
                                        {/* Column 1: Participant Info */}
                                        <div className="space-y-3">
                                            <h5 className="font-bold text-brand-purple uppercase text-xs border-b border-gray-200 pb-1 mb-2 flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                                Date Participant (Scenă)
                                            </h5>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <span className="text-gray-500 block text-xs">Nume Scenă:</span>
                                                    <span className="font-bold text-gray-800">{reg.type === 'individual' ? reg.name : reg.groupName}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 block text-xs">Categorie Vârstă:</span>
                                                    <span className="font-semibold text-gray-800">{reg.type === 'individual' ? reg.ageCategoryIndividual : reg.ageCategoryGroup}</span>
                                                </div>
                                                {reg.type === 'individual' && (
                                                    <div>
                                                        <span className="text-gray-500 block text-xs">Vârstă Exactă:</span>
                                                        <span className="font-bold text-brand-pink">{reg.ageExact} ani</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="text-gray-500 block text-xs">{reg.type === 'individual' ? 'Nr. Piese:' : 'Nr. Membri:'}</span>
                                                    <span className="font-semibold text-gray-800">{reg.type === 'individual' ? reg.numarPieseIndividual : reg.groupMembersCount}</span>
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t border-gray-200 mt-2">
                                                <p><span className="text-gray-500 text-xs">Școala:</span> <span className="font-semibold text-gray-800">{reg.type === 'individual' ? reg.school : reg.schoolGroup}</span></p>
                                                <p><span className="text-gray-500 text-xs">Profesor:</span> <span className="font-semibold text-gray-800">{reg.professor}</span></p>
                                            </div>
                                        </div>

                                        {/* Column 2: Billing & Contact */}
                                        <div className="space-y-3">
                                            <h5 className="font-bold text-blue-600 uppercase text-xs border-b border-gray-200 pb-1 mb-2 flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                                                Date Facturare & Contact
                                            </h5>
                                            <div>
                                                <span className="text-gray-500 block text-xs">Persoană Contact / Facturare:</span>
                                                <span className="font-bold text-gray-800 text-lg">{reg.contactName || reg.name}</span>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="flex items-center gap-2 text-gray-700 font-bold"><span className="text-gray-400 text-xs">📞</span> <a href={`tel:${reg.phone}`} className="hover:text-blue-600 transition-colors">{reg.phone}</a></p>
                                                <p className="flex items-center gap-2 text-gray-700 font-bold"><span className="text-gray-400 text-xs">✉️</span> <a href={`mailto:${reg.email}`} className="hover:text-blue-600 transition-colors">{reg.email}</a></p>
                                            </div>
                                            <div className="bg-white p-2 rounded border border-gray-200 text-xs text-gray-600 mt-2">
                                                <strong className="text-gray-800">Adresă:</strong> {reg.county}, {reg.city}, {reg.address}
                                            </div>
                                        </div>

                                        {/* Column 3: Repertoire */}
                                        <div>
                                            <h5 className="font-bold text-green-600 uppercase text-xs border-b border-gray-200 pb-1 mb-2 flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
                                                Repertoriu
                                            </h5>
                                            <div className="space-y-2">
                                                {reg.pieces.map((p, idx) => (
                                                    <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
                                                        <div className="absolute top-0 left-0 w-1 h-full bg-brand-pink"></div>
                                                        <p className="font-bold text-gray-800 leading-tight">{p.name}</p>
                                                        <p className="text-xs text-gray-500 italic mb-1">{p.artist}</p>
                                                        <div className="flex justify-between items-center mt-1">
                                                            <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-bold">{p.section}</span>
                                                            {p.youtubeLink && (
                                                                <a href={p.youtubeLink} target="_blank" rel="noreferrer" className="text-red-500 hover:text-red-700">
                                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
