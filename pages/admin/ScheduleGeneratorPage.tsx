
import React, { useState, useEffect } from 'react';
import { RegistrationData, Piece } from '../../types';
import { dataService } from '../../services/dataService';
import { AdminPageHeader, useNotification } from '../../components/admin';

interface ScheduleItem {
    time: string;
    endTime: string;
    registrationId: string;
    participantName: string;
    pieceName: string;
    artist: string;
    ageCategory: string;
    ageExact?: number; // Added Exact Age
    professor: string;
    school: string;
    type: 'individual' | 'grup';
    isGroupMember?: boolean;
}

interface ScheduleBlock {
    id: string;
    title: string;
    icon: string;
    colorClass: string; // border color
    badgeClass: string; // badge bg color
    startTime: string;
    endTime: string;
    items: ScheduleItem[];
}

const ScheduleGeneratorPage: React.FC = () => {
    const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
    const [schedule, setSchedule] = useState<ScheduleBlock[]>([]);
    const { showNotification } = useNotification();
    
    // Config State
    const [startTime, setStartTime] = useState('10:00');
    const [durationPerPiece, setDurationPerPiece] = useState(4); // minutes
    const [breakDuration, setBreakDuration] = useState(20); // minutes
    const [bufferTime, setBufferTime] = useState(1); // minutes
    const [isGenerated, setIsGenerated] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const data = await dataService.getRegistrations();
            // Filter only PAID registrations
            const confirmed = data.filter(r => r.status === 'paid');
            setRegistrations(confirmed);
        };
        loadData();
    }, []);

    const addMinutes = (time: string, mins: number): string => {
        const [h, m] = time.split(':').map(Number);
        const date = new Date();
        date.setHours(h, m, 0, 0);
        date.setMinutes(date.getMinutes() + mins);
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    const handlePrint = () => {
        const printContent = document.getElementById('schedule-container');
        if (!printContent) return;

        const printWindow = window.open('', '', 'height=800,width=1200');
        if (!printWindow) {
            alert('Te rog permite pop-up-urile pentru a putea printa desfășurătorul.');
            return;
        }

        // Tailwind Config for the print window to ensure colors match
        const tailwindConfig = `
            tailwind.config = {
                theme: {
                    extend: {
                        colors: {
                            'brand-purple': '#7C3AED',
                            'brand-pink': '#F472B6',
                            'brand-yellow': '#FBBF24',
                            'brand-dark': '#2E1065',
                        }
                    }
                }
            }
        `;

        printWindow.document.write('<html><head><title>Desfășurător VoiceUP</title>');
        // Inject Tailwind CDN
        printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
        // Inject Config
        printWindow.document.write('<script>' + tailwindConfig + '</script>');
        
        printWindow.document.write(`
            <style>
                @page { size: landscape; margin: 5mm; }
                body { font-family: sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
                /* Ensure hidden print header is visible in popup */
                .hidden.print\\:block { display: block !important; }
                /* Hide scrollbars */
                ::-webkit-scrollbar { display: none; }
            </style>
        `);
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        
        printWindow.document.close();
        printWindow.focus();

        // Wait for Tailwind to apply styles before printing
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 1000);
    };

    const generateSchedule = () => {
        if (registrations.length === 0) {
            showNotification('Nu există înscrieri confirmate (status: Paid) pentru a genera programul.', 'error');
            return;
        }

        const blocks: ScheduleBlock[] = [];
        let currentTime = startTime;

        // Helper to categorize sections
        const getSectionKey = (sec: string) => {
            if (sec.toLowerCase().includes('românească')) return 'ro';
            if (sec.toLowerCase().includes('internațională')) return 'int';
            if (sec.toLowerCase().includes('populară')) return 'pop';
            if (sec.toLowerCase().includes('etno')) return 'etno';
            if (sec.toLowerCase().includes('colinde')) return 'col';
            if (sec.toLowerCase().includes('instrument')) return 'inst';
            return 'other';
        };

        const sectionConfig: Record<string, { title: string, icon: string, color: string, badge: string }> = {
            'ro': { title: 'Muzică Ușoară Românească', icon: '🎤', color: 'border-l-brand-purple', badge: 'bg-brand-purple' },
            'int': { title: 'Muzică Ușoară Internațională', icon: '🌍', color: 'border-l-blue-500', badge: 'bg-blue-500' },
            'pop': { title: 'Muzică Populară', icon: '🎻', color: 'border-l-green-600', badge: 'bg-green-600' },
            'etno': { title: 'Etno', icon: '🌿', color: 'border-l-emerald-500', badge: 'bg-emerald-500' },
            'col': { title: 'Colinde', icon: '❄️', color: 'border-l-red-500', badge: 'bg-red-500' },
            'inst': { title: 'Instrumental', icon: '🎹', color: 'border-l-yellow-500', badge: 'bg-yellow-500' },
            'other': { title: 'Alte Secțiuni', icon: '🎵', color: 'border-l-gray-500', badge: 'bg-gray-500' },
            'grup': { title: 'Grupuri', icon: '👥', color: 'border-l-pink-500', badge: 'bg-pink-500' }
        };

        // 1. Flatten all pieces into a single list with metadata
        let allItems: any[] = [];
        
        registrations.forEach(reg => {
            const age = reg.type === 'individual' ? reg.ageCategoryIndividual : reg.ageCategoryGroup;
            const prof = reg.type === 'individual' ? reg.professor : reg.contactName;
            const school = reg.type === 'individual' ? reg.school : reg.schoolGroup;

            reg.pieces.forEach(piece => {
                allItems.push({
                    registrationId: reg.id,
                    participantName: reg.type === 'individual' ? reg.name : reg.groupName,
                    pieceName: piece.name,
                    artist: piece.artist,
                    sectionRaw: reg.type === 'grup' ? 'Grupuri' : piece.section,
                    sectionKey: reg.type === 'grup' ? 'grup' : getSectionKey(piece.section),
                    ageCategory: age,
                    ageExact: reg.ageExact, // Pass exact age
                    professor: prof,
                    school: school,
                    type: reg.type
                });
            });
        });

        // 2. Group by Section Key
        const groupedBySection: Record<string, any[]> = {};
        allItems.forEach(item => {
            if (!groupedBySection[item.sectionKey]) groupedBySection[item.sectionKey] = [];
            groupedBySection[item.sectionKey].push(item);
        });

        // 3. Process each section
        // Define order of sections
        const order = ['ro', 'int', 'pop', 'etno', 'col', 'inst', 'grup', 'other'];

        order.forEach(key => {
            if (groupedBySection[key]) {
                const sectionItems = groupedBySection[key];
                
                // Sort by Age Exact if available, otherwise by Category string
                sectionItems.sort((a, b) => {
                    if (a.ageExact && b.ageExact) return a.ageExact - b.ageExact;
                    
                    const ageA = parseInt(a.ageCategory) || 0;
                    const ageB = parseInt(b.ageCategory) || 0;
                    return ageA - ageB;
                });

                const blockStart = currentTime;
                const scheduleItems: ScheduleItem[] = [];

                sectionItems.forEach(item => {
                    const itemStart = currentTime;
                    const itemEnd = addMinutes(currentTime, durationPerPiece);
                    
                    scheduleItems.push({
                        time: itemStart,
                        endTime: itemEnd,
                        registrationId: item.registrationId,
                        participantName: item.participantName,
                        pieceName: item.pieceName,
                        artist: item.artist,
                        ageCategory: item.ageCategory,
                        ageExact: item.ageExact,
                        professor: item.professor,
                        school: item.school,
                        type: item.type
                    });

                    // Advance time (Duration + Buffer)
                    currentTime = addMinutes(currentTime, durationPerPiece + bufferTime);
                });

                blocks.push({
                    id: key,
                    title: sectionConfig[key].title,
                    icon: sectionConfig[key].icon,
                    colorClass: sectionConfig[key].color,
                    badgeClass: sectionConfig[key].badge,
                    startTime: blockStart,
                    endTime: addMinutes(currentTime, -bufferTime), // Remove last buffer for block end
                    items: scheduleItems
                });
            }
        });

        setSchedule(blocks);
        setIsGenerated(true);
        showNotification('Desfășurător generat cu succes!', 'success');
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in flex flex-col h-[calc(100vh-140px)]">
            <AdminPageHeader 
                title="Generator Desfășurător"
                description="Creează programul automat bazat pe înscrierile confirmate."
                isEditing={false}
                onEdit={() => {}}
                onSave={() => {}}
                onCancel={() => {}}
            >
                <div className="flex gap-2">
                    <button 
                        onClick={generateSchedule}
                        className="bg-brand-purple text-white px-4 py-2 rounded-lg font-bold hover:bg-opacity-90 shadow-md transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                        Generează
                    </button>
                    {isGenerated && (
                        <button 
                            onClick={handlePrint}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-md transition-all flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                            Print PDF
                        </button>
                    )}
                </div>
            </AdminPageHeader>

            {/* Config Area */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 grid grid-cols-2 md:grid-cols-4 gap-6 flex-shrink-0">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ora Start</label>
                    <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full p-2 border rounded-lg font-bold text-lg" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Durată / Copil (min)</label>
                    <input type="number" min="1" value={durationPerPiece} onChange={e => setDurationPerPiece(parseInt(e.target.value))} className="w-full p-2 border rounded-lg font-bold text-lg" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Marjă Eroare (min)</label>
                    <input type="number" min="0" value={bufferTime} onChange={e => setBufferTime(parseInt(e.target.value))} className="w-full p-2 border rounded-lg font-bold text-lg" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pauză Jurizare (min)</label>
                    <input type="number" min="0" value={breakDuration} onChange={e => setBreakDuration(parseInt(e.target.value))} className="w-full p-2 border rounded-lg font-bold text-lg" />
                </div>
            </div>

            {/* Generated Schedule - ID used for print grabbing */}
            <div id="schedule-container" className="flex-grow bg-white overflow-y-auto custom-scrollbar border border-gray-100 rounded-xl relative">
                {!isGenerated ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
                        <p>Configurează parametrii și apasă "Generează"</p>
                    </div>
                ) : (
                    <div className="printable-schedule space-y-8 p-6">
                        
                        {/* Print Header - Visible via CSS in print window */}
                        <div className="hidden print:block text-center mb-8 border-b-2 border-gray-200 pb-4">
                            <h1 className="text-3xl font-black text-brand-dark">VoiceUP Festival - Desfășurător Oficial</h1>
                            <p className="text-sm text-gray-600">Generat la: {new Date().toLocaleDateString('ro-RO')}</p>
                        </div>

                        {/* Intro Block */}
                        <div className="bg-white rounded-xl shadow-sm border border-brand-yellow overflow-hidden break-inside-avoid print:border-2">
                            <div className="bg-gradient-to-r from-yellow-50 to-white px-6 py-4 flex justify-between items-center border-b border-yellow-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-brand-yellow/20 rounded-lg flex items-center justify-center text-xl">⭐️</div>
                                    <h3 className="text-lg font-bold text-gray-800">Deschiderea Oficială</h3>
                                </div>
                                <div className="bg-brand-yellow text-brand-dark px-4 py-1 rounded-full font-bold text-sm shadow-sm">
                                    {startTime} - {addMinutes(startTime, 20)}
                                </div>
                            </div>
                            <div className="p-6 text-center text-gray-600 text-sm">
                                Prezentarea Festivalului • Cuvântul Juriului • Detalii Tehnice
                            </div>
                        </div>

                        {schedule.map((block) => (
                            <div key={block.id} className={`bg-white rounded-xl shadow-lg border-l-8 ${block.colorClass} overflow-hidden break-inside-avoid mb-8 print:shadow-none print:border print:border-gray-300 print:mb-6`}>
                                {/* Block Header */}
                                <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-xl shadow-sm">
                                            {block.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-brand-dark">{block.title}</h3>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{block.items.length} Momente</p>
                                        </div>
                                    </div>
                                    <div className={`${block.badgeClass} text-white px-4 py-1.5 rounded-lg font-bold text-sm shadow-md print:text-black print:bg-gray-200 print:shadow-none`}>
                                        {block.startTime} - {block.endTime}
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-100 text-gray-600 font-bold uppercase text-xs">
                                            <tr>
                                                <th className="px-4 py-3 text-center w-12">#</th>
                                                <th className="px-4 py-3 w-20">Ora</th>
                                                <th className="px-4 py-3">Concurent</th>
                                                <th className="px-4 py-3 text-center w-16">Vârstă</th>
                                                <th className="px-4 py-3">Piesă</th>
                                                <th className="px-4 py-3">Profesor / Școală</th>
                                                <th className="px-4 py-3 text-center">Categorie</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {block.items.map((item, idx) => (
                                                <tr key={`${item.registrationId}_${idx}`} className="hover:bg-gray-50 print:hover:bg-transparent">
                                                    <td className="px-4 py-3 text-center font-bold text-brand-pink">{idx + 1}</td>
                                                    <td className="px-4 py-3 font-mono text-gray-500 font-bold">{item.time}</td>
                                                    <td className="px-4 py-3 font-bold text-gray-800">
                                                        {item.participantName}
                                                        {item.type === 'grup' && <span className="ml-2 text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">GRUP</span>}
                                                    </td>
                                                    <td className="px-4 py-3 text-center font-bold text-gray-700">
                                                        {item.ageExact ? `${item.ageExact} ani` : '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-700">
                                                        <div className="font-semibold">{item.pieceName}</div>
                                                        <div className="text-xs text-gray-500 italic">{item.artist}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-gray-600">
                                                        <div className="font-bold">{item.professor}</div>
                                                        <div>{item.school}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className="bg-black text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap print:bg-transparent print:text-black print:border print:border-black">
                                                            {item.ageCategory}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}

                        {/* Break Blocks Visual */}
                        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center text-gray-500 font-bold text-sm break-inside-avoid">
                            ☕ Pauză de Jurizare & Deliberare ({breakDuration} min)
                        </div>

                        {/* Ceremony */}
                        <div className="bg-gradient-to-r from-white to-red-50 rounded-xl shadow-lg border-2 border-red-100 p-6 text-center mt-8 break-inside-avoid print:bg-white print:border-black">
                            <h3 className="text-2xl font-black text-brand-pink mb-2 print:text-black">🏆 Festivitatea de Premiere</h3>
                            <p className="text-gray-600 font-bold">Urmează imediat după pauza de jurizare.</p>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default ScheduleGeneratorPage;
