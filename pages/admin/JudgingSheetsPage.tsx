
import React, { useState, useEffect } from 'react';
import { RegistrationData } from '../../types';
import { dataService } from '../../services/dataService';
import { AdminPageHeader, useNotification } from '../../components/admin';
import { DEFAULT_LOCATION_CONFIG } from '../../config';

interface JudgingItem {
    uniqueId: string; // regId + index
    registrationId: string;
    name: string;
    type: 'individual' | 'grup';
    ageCategory: string;
    ageExact: string;
    section: string;
    pieceName: string;
    artist: string;
    school: string;
    professor: string;
}

const JudgingSheetsPage: React.FC = () => {
    const [items, setItems] = useState<JudgingItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [eventDate, setEventDate] = useState('13 Dec 2025');
    const { showNotification } = useNotification();

    useEffect(() => {
        // Load Date from Config
        const locConfig = localStorage.getItem('locationConfig');
        if (locConfig) {
            try {
                const parsed = JSON.parse(locConfig);
                // Extract simple date if possible, otherwise use full string or default
                // Example format: "Sâmbătă, 13 Decembrie 2025, ora 10:00"
                const datePart = parsed.startDate ? parsed.startDate.split(',')[1] : DEFAULT_LOCATION_CONFIG.startDate;
                setEventDate(datePart ? datePart.trim() : 'Data Eveniment');
            } catch (e) {}
        }

        const loadData = async () => {
            const data = await dataService.getRegistrations();
            const paidRegs = data.filter(r => r.status === 'paid');
            
            const flattenedItems: JudgingItem[] = [];

            paidRegs.forEach(reg => {
                const ageCat = reg.type === 'individual' ? reg.ageCategoryIndividual : reg.ageCategoryGroup;
                const exactAge = reg.type === 'individual' ? (reg.ageExact ? `${reg.ageExact} ani` : '-') : '-';
                const school = reg.type === 'individual' ? reg.school : reg.schoolGroup;
                const professor = reg.type === 'individual' ? reg.professor : reg.contactName;

                reg.pieces.forEach((piece, idx) => {
                    flattenedItems.push({
                        uniqueId: `${reg.id}_${idx}`,
                        registrationId: reg.id,
                        name: reg.type === 'individual' ? (reg.name || '') : (reg.groupName || ''),
                        type: reg.type || 'individual',
                        ageCategory: ageCat || '',
                        ageExact: exactAge,
                        section: piece.section,
                        pieceName: piece.name,
                        artist: piece.artist,
                        school: school || '',
                        professor: professor || ''
                    });
                });
            });

            // Sort by Section then Age
            flattenedItems.sort((a, b) => {
                if (a.section !== b.section) return a.section.localeCompare(b.section);
                return a.ageCategory.localeCompare(b.ageCategory);
            });

            setItems(flattenedItems);
            setIsLoading(false);
        };
        loadData();
    }, []);

    const generateHtmlForItems = (itemsToPrint: JudgingItem[]) => {
        const styles = `
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Open+Sans:wght@400;600;700&display=swap');

            :root {
                --primary-dark: #2E1065;
                --primary-purple: #7C3AED;
                --accent-magenta: #F472B6;
                --light-bg: #f8f9fa;
                --border-color: #dee2e6;
            }

            body {
                font-family: 'Open Sans', sans-serif;
                margin: 0;
                padding: 0;
                background-color: white;
                color: #333;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .page-container {
                background: white;
                width: 210mm;
                height: 296mm; /* A4 */
                margin: 0 auto;
                padding: 10mm 15mm;
                box-sizing: border-box;
                position: relative;
                display: flex;
                flex-direction: column;
                page-break-after: always;
            }

            .header {
                display: flex;
                justify-content: space-between;
                border-bottom: 4px solid var(--accent-magenta);
                padding-bottom: 15px;
                margin-bottom: 25px;
            }

            .logo-section h1 {
                font-family: 'Montserrat', sans-serif;
                font-weight: 800;
                font-size: 28px;
                margin: 0;
                color: var(--primary-dark);
                text-transform: uppercase;
                line-height: 1;
            }

            .logo-section span {
                color: var(--accent-magenta);
                font-weight: 600;
                font-size: 12px;
                letter-spacing: 3px;
                text-transform: uppercase;
            }

            .meta-info {
                text-align: right;
                font-size: 12px;
            }

            .meta-row { margin-bottom: 5px; }
            
            .dotted-line {
                border-bottom: 1px dotted #333;
                display: inline-block;
                min-width: 150px;
            }

            .contestant-card {
                background-color: rgba(124, 58, 237, 0.05); /* Brand purple tint */
                border-left: 5px solid var(--primary-purple);
                padding: 15px;
                border-radius: 0 8px 8px 0;
                margin-bottom: 30px;
            }

            .info-grid {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 20px;
            }

            .field-group { margin-bottom: 5px; }
            .full-width { grid-column: 1 / -1; }

            .field-label {
                font-family: 'Montserrat', sans-serif;
                font-size: 10px;
                color: var(--primary-purple);
                font-weight: 700;
                text-transform: uppercase;
                display: block;
                margin-bottom: 2px;
            }

            .field-value {
                font-size: 14px;
                font-weight: 600;
                color: #111;
                border-bottom: 1px solid #ccc;
                padding-bottom: 2px;
                min-height: 20px;
                display: block;
            }

            .criteria-section {
                margin-bottom: 20px;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                overflow: hidden;
            }

            .criteria-header {
                background: linear-gradient(90deg, var(--primary-dark) 0%, var(--primary-purple) 100%);
                color: white;
                padding: 8px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .criteria-title {
                font-family: 'Montserrat', sans-serif;
                font-weight: 700;
                font-size: 13px;
                text-transform: uppercase;
            }

            .criteria-subtitle {
                font-size: 10px;
                font-weight: 600;
                opacity: 0.9;
                margin-left: 10px;
                color: #fff;
            }

            .criteria-body {
                display: flex;
                padding: 15px;
                gap: 20px;
            }

            .observations-area { flex-grow: 1; }

            .obs-label {
                font-size: 10px;
                color: #666;
                margin-bottom: 5px;
                display: block;
                font-style: italic;
            }

            .lines-box {
                width: 100%;
                height: 80px;
                background-image: linear-gradient(#ccc 1px, transparent 1px);
                background-size: 100% 2em;
                line-height: 2em;
                margin-top: 5px;
            }

            .grade-box {
                width: 90px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border-left: 2px dashed #ddd;
                padding-left: 15px;
            }

            .grade-square {
                width: 60px;
                height: 50px;
                border: 2px solid var(--accent-magenta);
                border-radius: 8px;
                margin-top: 5px;
            }

            .final-score-section {
                margin-top: auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: var(--primary-dark);
                color: white;
                padding: 15px 20px;
                border-radius: 12px;
                margin-bottom: 20px;
            }

            .final-label {
                font-family: 'Montserrat', sans-serif;
                font-size: 18px;
                font-weight: 800;
                text-transform: uppercase;
            }

            .final-box {
                background: white;
                width: 100px;
                height: 45px;
                border-radius: 6px;
            }

            .signature-area {
                text-align: right;
                font-size: 12px;
            }

            @media print {
                @page { size: A4; margin: 0; }
                body { background-color: white; }
            }
        `;

        let htmlContent = `<html><head><title>Fise Jurizare</title><style>${styles}</style></head><body>`;

        itemsToPrint.forEach(item => {
            htmlContent += `
                <div class="page-container">
                    <div class="header">
                        <div class="logo-section">
                            <h1>VoiceUP Festival</h1>
                            <span>Fișă Individuală de Jurizare</span>
                        </div>
                        <div class="meta-info">
                            <div class="meta-row">Nume Jurat: <span class="dotted-line"></span></div>
                            <div class="meta-row">Data: <strong>${eventDate}</strong></div>
                        </div>
                    </div>

                    <div class="contestant-card">
                        <div class="info-grid">
                            <div class="field-group full-width">
                                <span class="field-label">Concurent (Nume / Grup)</span>
                                <span class="field-value">${item.name} ${item.type === 'grup' ? '(GRUP)' : ''}</span>
                            </div>
                            
                            <div class="field-group">
                                <span class="field-label">Secțiune & Categorie</span>
                                <span class="field-value">${item.section} | ${item.ageCategory}</span>
                            </div>
                            <div class="field-group">
                                <span class="field-label">Vârstă / Școală</span>
                                <span class="field-value">${item.ageExact !== '-' ? item.ageExact : ''} ${item.school ? `(${item.school})` : ''}</span>
                            </div>

                            <div class="field-group full-width">
                                <span class="field-label">Piesă Interpretată</span>
                                <span class="field-value">${item.pieceName} <span style="font-weight:400; font-style:italic;">- ${item.artist}</span></span>
                            </div>
                        </div>
                    </div>

                    <!-- CRITERII 1 -->
                    <div class="criteria-section">
                        <div class="criteria-header">
                            <div>
                                <span class="criteria-title">1. Calități Vocale & Tehnică</span>
                                <span class="criteria-subtitle">(Intonație, Dicție, Ritm, Ambitus)</span>
                            </div>
                        </div>
                        <div class="criteria-body">
                            <div class="observations-area">
                                <span class="obs-label">Observații tehnice:</span>
                                <div class="lines-box"></div>
                            </div>
                            <div class="grade-box">
                                <span style="font-weight: bold; font-size: 11px;">NOTA 1</span>
                                <div class="grade-square"></div>
                            </div>
                        </div>
                    </div>

                    <!-- CRITERII 2 -->
                    <div class="criteria-section">
                        <div class="criteria-header">
                            <div>
                                <span class="criteria-title">2. Expresie Artistică & Show</span>
                                <span class="criteria-subtitle">(Interpretare, Emoție, Mișcare, Ținută)</span>
                            </div>
                        </div>
                        <div class="criteria-body">
                            <div class="observations-area">
                                <span class="obs-label">Observații artistice:</span>
                                <div class="lines-box"></div>
                            </div>
                            <div class="grade-box">
                                <span style="font-weight: bold; font-size: 11px;">NOTA 2</span>
                                <div class="grade-square"></div>
                            </div>
                        </div>
                    </div>

                    <!-- GENERAL -->
                    <div class="criteria-section" style="border-color: #eee;">
                        <div class="criteria-header" style="background: #eee; color: #333; border-bottom: 1px solid #ddd;">
                            <span class="criteria-title">Recomandări / Impresie Generală</span>
                        </div>
                        <div class="criteria-body" style="padding: 10px;">
                            <div class="lines-box" style="height: 50px;"></div>
                        </div>
                    </div>

                    <!-- NOTA -->
                    <div class="final-score-section">
                        <div>
                            <div class="final-label">NOTA FINALĂ</div>
                            <div style="font-size: 10px; opacity: 0.8; margin-top: 5px;">MEDIA NOTELOR (1 + 2) / 2</div>
                        </div>
                        <div class="final-box"></div>
                    </div>

                    <div class="signature-area">
                        Semnătură Jurat<br>
                        <span class="dotted-line" style="margin-top: 15px;"></span>
                    </div>
                </div>
            `;
        });

        htmlContent += '</body></html>';
        return htmlContent;
    };

    const handlePrint = (item?: JudgingItem) => {
        const itemsToPrint = item ? [item] : items;
        if (itemsToPrint.length === 0) {
            showNotification('Nu există fișe de generat.', 'error');
            return;
        }

        const printWindow = window.open('', '', 'width=1000,height=800');
        if (!printWindow) {
            alert('Te rog permite pop-up-urile.');
            return;
        }

        printWindow.document.write(generateHtmlForItems(itemsToPrint));
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
            printWindow.print();
            // printWindow.close(); // Optional: Close after print
        }, 1000);
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in flex flex-col h-[calc(100vh-140px)]">
            <AdminPageHeader 
                title="Fișe de Jurizare"
                description="Generează și printează fișe individuale pentru juriu."
                isEditing={false}
                onEdit={() => {}}
                onSave={() => {}}
                onCancel={() => {}}
            >
                <div className="flex gap-2">
                    <button 
                        onClick={() => handlePrint()}
                        disabled={items.length === 0}
                        className="bg-brand-purple text-white px-4 py-2 rounded-lg font-bold hover:bg-opacity-90 shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                        Printează TOT (Bulk)
                    </button>
                </div>
            </AdminPageHeader>

            <div className="flex-grow overflow-y-auto custom-scrollbar border border-gray-100 rounded-xl">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64 text-gray-400">Se încarcă datele...</div>
                ) : items.length === 0 ? (
                    <div className="flex items-center justify-center h-64 text-gray-400">Nu există concurenți confirmați.</div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-6 py-4">Concurent</th>
                                <th className="px-6 py-4">Secțiune</th>
                                <th className="px-6 py-4">Piesă</th>
                                <th className="px-6 py-4 text-center">Acțiuni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.map((item) => (
                                <tr key={item.uniqueId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-3">
                                        <div className="font-bold text-gray-800">{item.name}</div>
                                        <div className="text-xs text-gray-500">{item.ageCategory} • {item.school}</div>
                                    </td>
                                    <td className="px-6 py-3 text-gray-600 font-medium">
                                        {item.section}
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="text-gray-800 font-semibold">{item.pieceName}</div>
                                        <div className="text-xs text-gray-500 italic">{item.artist}</div>
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <button 
                                            onClick={() => handlePrint(item)}
                                            className="text-brand-purple hover:bg-violet-50 p-2 rounded-lg transition-colors font-bold text-xs inline-flex items-center gap-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                            PDF
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default JudgingSheetsPage;
