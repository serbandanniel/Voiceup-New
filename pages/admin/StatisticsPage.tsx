
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { RegistrationData } from '../../types';
import { dataService } from '../../services/dataService';
import { AdminPageHeader, useNotification } from '../../components/admin';

const StatisticsPage: React.FC = () => {
    const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchData = async () => {
            const data = await dataService.getRegistrations();
            setRegistrations(data);
        };
        fetchData();
    }, []);

    // --- LOGIC ---
    const totalRegs = registrations.length;

    // 1. By Package (Segment)
    const statsByPackage = {
        '1 Piesă': 0,
        '2 Piese': 0,
        '3 Piese': 0,
        'Grup Mic': 0,
        'Grup Mare': 0
    };

    // 2. By Section (Need to iterate pieces)
    const statsBySection: Record<string, number> = {};

    // 3. By Age Category
    const statsByAge: Record<string, number> = {};

    registrations.forEach(r => {
        // Package Logic
        if (r.type === 'individual') {
            if (r.numarPieseIndividual === 1) statsByPackage['1 Piesă']++;
            else if (r.numarPieseIndividual === 2) statsByPackage['2 Piese']++;
            else if (r.numarPieseIndividual === 3) statsByPackage['3 Piese']++;
        } else {
            if (r.groupType === 'grup_mic') statsByPackage['Grup Mic']++;
            else statsByPackage['Grup Mare']++;
        }

        // Section Logic
        r.pieces.forEach(p => {
            const sec = p.section || 'Necunoscut';
            statsBySection[sec] = (statsBySection[sec] || 0) + 1;
        });

        // Age Logic
        const age = r.type === 'individual' ? r.ageCategoryIndividual : r.ageCategoryGroup;
        if (age) {
            statsByAge[age] = (statsByAge[age] || 0) + 1;
        }
    });

    const handleExport = () => {
        // Create 3 sheets
        const wsPackages = XLSX.utils.json_to_sheet(Object.entries(statsByPackage).map(([k, v]) => ({ Segment: k, 'Nr. Înscrieri': v })));
        const wsSections = XLSX.utils.json_to_sheet(Object.entries(statsBySection).map(([k, v]) => ({ 'Secțiune Muzicală': k, 'Nr. Piese': v })));
        const wsAge = XLSX.utils.json_to_sheet(Object.entries(statsByAge).map(([k, v]) => ({ 'Categorie Vârstă': k, 'Nr. Participanți': v })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, wsPackages, "Segmente");
        XLSX.utils.book_append_sheet(wb, wsSections, "Sectiuni");
        XLSX.utils.book_append_sheet(wb, wsAge, "Varste");

        XLSX.writeFile(wb, `Statistici_VoiceUP_${new Date().toISOString().split('T')[0]}.xlsx`);
        showNotification('Statisticile au fost exportate!', 'success');
    };

    const BarChartRow: React.FC<{ label: string, count: number, total: number, color: string }> = ({ label, count, total, color }) => {
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
            <div className="mb-4 last:mb-0">
                <div className="flex justify-between text-sm font-bold mb-1">
                    <span className="text-gray-700">{label}</span>
                    <span className="text-gray-900">{count} ({percentage}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${percentage}%` }}></div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in space-y-8">
            <AdminPageHeader 
                title="Statistici Înscrieri"
                description={`Analiză detaliată pentru cei ${totalRegs} participanți.`}
                isEditing={false}
                onEdit={() => {}}
                onSave={() => {}}
                onCancel={() => {}}
            >
                <button onClick={handleExport} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-md transition-all flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                    Export Statistici
                </button>
            </AdminPageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Segmente Pachete */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
                        <span className="bg-brand-purple text-white p-1 rounded">📦</span> Segmente Pachete
                    </h3>
                    <BarChartRow label="Individual: 1 Piesă" count={statsByPackage['1 Piesă']} total={totalRegs} color="bg-blue-400" />
                    <BarChartRow label="Individual: 2 Piese" count={statsByPackage['2 Piese']} total={totalRegs} color="bg-blue-500" />
                    <BarChartRow label="Individual: 3 Piese" count={statsByPackage['3 Piese']} total={totalRegs} color="bg-blue-600" />
                    <div className="my-4 border-t border-gray-200"></div>
                    <BarChartRow label="Grup Mic (2-5 pers)" count={statsByPackage['Grup Mic']} total={totalRegs} color="bg-pink-500" />
                    <BarChartRow label="Grup Mare (6+ pers)" count={statsByPackage['Grup Mare']} total={totalRegs} color="bg-pink-600" />
                </div>

                {/* Categorii de Varsta */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
                        <span className="bg-brand-yellow text-brand-dark p-1 rounded">👶</span> Categorii Vârstă
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(statsByAge).sort((a, b) => b[1] - a[1]).map(([age, count], idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <span className="font-bold text-gray-700">{age}</span>
                                <span className="bg-brand-yellow/20 text-brand-dark px-3 py-1 rounded-full font-bold text-sm">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sectiuni Muzicale */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 lg:col-span-2">
                    <h3 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
                        <span className="bg-green-500 text-white p-1 rounded">🎵</span> Secțiuni Muzicale (Total Piese)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(statsBySection).sort((a, b) => b[1] - a[1]).map(([sec, count], idx) => (
                            <div key={idx} className="p-4 bg-white border border-green-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <p className="text-xs font-bold uppercase text-green-600 mb-1">Secțiune</p>
                                <h4 className="font-bold text-gray-800 text-sm h-10 overflow-hidden">{sec}</h4>
                                <div className="mt-2 text-2xl font-black text-green-700">{count} <span className="text-xs font-normal text-gray-500">piese</span></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;
