
import React, { useState } from 'react';
import { AdminPageHeader, useNotification } from '../../components/admin';
import { dataService } from '../../services/dataService';
import { RegistrationData } from '../../types';

const MigrationTools: React.FC = () => {
    const { showNotification } = useNotification();
    const [isExporting, setIsExporting] = useState(false);
    const [showSecurityModal, setShowSecurityModal] = useState(false);

    // --- SEED DATA GENERATOR ---
    const generateTestData = () => {
        const testData: RegistrationData[] = [
            {
                id: "101",
                submissionDate: new Date(Date.now() - 100000000).toISOString(),
                type: 'individual',
                name: "Popescu Andrei",
                ageCategoryIndividual: "5 - 7 ani",
                ageExact: 6,
                professor: "Maria Voiculescu",
                school: "Palatul Copiilor",
                pieces: [
                    { id: "p1", section: "Muzică Ușoară Românească", name: "Copilărie", artist: "Mihai Constantinescu", negativeType: "link", youtubeLink: "http://yt..." }
                ],
                numarPieseIndividual: 1,
                contactName: "Popescu Elena",
                phone: "0722123456",
                email: "test1@example.com",
                county: "București",
                city: "Sector 3",
                address: "Strada Florilor nr 4",
                paymentMethod: "card",
                totalCost: 300,
                status: "paid",
                isInvoiced: true,
                invoiceSeries: "FEST",
                invoiceNumber: "001"
            },
            {
                id: "102",
                submissionDate: new Date(Date.now() - 80000000).toISOString(),
                type: 'individual',
                name: "Ionescu Maria",
                ageCategoryIndividual: "8 - 10 ani",
                ageExact: 9,
                professor: "George Enescu",
                school: "Școala de Arte nr 5",
                pieces: [
                    { id: "p1", section: "Muzică Ușoară Internațională", name: "Easy on Me", artist: "Adele", negativeType: "file", fileName: "adele_negativ.mp3" },
                    { id: "p2", section: "Colinde", name: "O ce veste minunată", artist: "Tradițional", negativeType: "link", youtubeLink: "http://yt..." }
                ],
                numarPieseIndividual: 2,
                contactName: "Ionescu Vasile",
                phone: "0733987654",
                email: "test2@example.com",
                county: "Ilfov",
                city: "Voluntari",
                address: "Bd Pipera 20",
                paymentMethod: "transfer",
                totalCost: 500,
                status: "pending"
            },
            {
                id: "103",
                submissionDate: new Date(Date.now() - 60000000).toISOString(),
                type: 'grup',
                groupName: "Trupa Veselia",
                groupType: "grup_mic",
                groupMembersCount: 4,
                ageCategoryGroup: "5 - 7 ani",
                schoolGroup: "Clubul Copiilor",
                pieces: [
                    { id: "p1", section: "Muzică Ușoară Românească", name: "Amicii", artist: "LaLa Band", negativeType: "link", youtubeLink: "http..." }
                ],
                contactName: "Coordonator Grup",
                phone: "0744555666",
                email: "grup@example.com",
                county: "Cluj",
                city: "Cluj-Napoca",
                address: "Centru",
                paymentMethod: "card",
                totalCost: 800,
                status: "paid"
            },
            {
                id: "104",
                submissionDate: new Date(Date.now() - 40000000).toISOString(),
                type: 'individual',
                name: "Stan Alexandru",
                ageCategoryIndividual: "14 - 16 ani",
                ageExact: 15,
                professor: "Privat",
                school: "Liceul de Muzică",
                pieces: [
                    { id: "p1", section: "Instrument (Pian)", name: "Sonata Lunii", artist: "Beethoven", negativeType: "link" },
                    { id: "p2", section: "Muzică Ușoară Românească", name: "Copacul", artist: "Aurelian Andreescu", negativeType: "link" },
                    { id: "p3", section: "Etno", name: "Canta Cucu", artist: "Trad", negativeType: "link" }
                ],
                numarPieseIndividual: 3,
                contactName: "Stan Ion",
                phone: "0755112233",
                email: "stan@test.ro",
                county: "Iași",
                city: "Iași",
                address: "Str. Copou",
                paymentMethod: "card",
                totalCost: 700,
                status: "paid"
            },
            {
                id: "105",
                submissionDate: new Date(Date.now() - 20000000).toISOString(),
                type: 'grup',
                groupName: "Corul Armonia",
                groupType: "grup_mare",
                groupMembersCount: 12,
                ageCategoryGroup: "11 - 13 ani",
                schoolGroup: "Palatul Copiilor Craiova",
                pieces: [
                    { id: "p1", section: "Colinde", name: "Domn Domn sa inaltam", artist: "Folclor", negativeType: "link" }
                ],
                contactName: "Dirijor Popescu",
                phone: "0766778899",
                email: "cor@test.ro",
                county: "Dolj",
                city: "Craiova",
                address: "Strada Unirii",
                paymentMethod: "transfer",
                totalCost: 1800,
                status: "pending"
            },
            {
                id: "106",
                submissionDate: new Date().toISOString(),
                type: 'individual',
                name: "Voucher Winner",
                ageCategoryIndividual: "17 - 18+ ani",
                ageExact: 18,
                professor: "-",
                school: "-",
                pieces: [{id:"p1", section: "Muzică Populară", name: "Foaie Verde", artist:"-", negativeType: "link"}],
                numarPieseIndividual: 1,
                contactName: "Winner",
                phone: "0700000000",
                email: "winner@free.com",
                county: "București",
                city: "Sector 1",
                address: "-",
                paymentMethod: undefined,
                totalCost: 0,
                appliedVoucher: "GRATUIT",
                status: "paid"
            }
        ];

        localStorage.setItem('voiceup_local_db', JSON.stringify(testData));
        showNotification('Date generate! Mergi la tab-ul "Înscrieri" pentru a le vedea.', 'success');
        // Removed automatic reload to prevent preview crash
    };

    const getAllData = async () => {
        // Cheile corecte utilizate în aplicație pentru localStorage
        const keys = [
            'formConfig', 
            'partnersConfig', 
            'jurorsConfig', 
            'prizesConfig', 
            'faqConfig', 
            'countdownConfig', 
            'heroConfig', 
            'sectionsConfig', 
            'emailConfig', 
            'mobilPayConfig', 
            'smartBillConfig', 
            'popupConfig', 
            'stickyFooterConfig', 
            'wheelConfig', 
            'marketingConfig', 
            'navbarConfig', 
            'floatingButtonsConfig',
            'staticPagesConfig', 
            'locationConfig', 
            'paymentLinks',
            'reviewsConfig',
            'galleryConfig_photos',
            'galleryConfig_videos',
            'voiceup_local_db' // includem si baza de date locala
        ];
        
        const data: Record<string, any> = {
            exportDate: new Date().toISOString(),
            version: "2.0"
        };

        // Colectăm setările din LocalStorage
        keys.forEach(key => {
            const item = localStorage.getItem(key);
            if (item) {
                try { 
                    data[key] = JSON.parse(item); 
                } catch (e) { 
                    data[key] = item; 
                }
            }
        });

        return data;
    };

    const handleDownloadJson = async () => {
        setIsExporting(true);
        try {
            const data = await getAllData();
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `voiceup_full_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showNotification('Backup complet generat și descărcat!', 'success');
        } catch (error) {
            console.error("Export error:", error);
            showNotification('Eroare la generarea fișierului de backup.', 'error');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in space-y-8">
            <AdminPageHeader 
                title="Migrare & Date Test"
                description="Unelte pentru backup și generare date demo."
                isEditing={false}
                onEdit={() => {}}
                onSave={() => {}}
                onCancel={() => {}}
            />

            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">🧪</span>
                    <h3 className="font-bold text-lg text-purple-900">Populare Date Test (Development)</h3>
                </div>
                <p className="text-sm text-purple-800 mb-6">
                    Apasă acest buton pentru a injecta 6 înscrieri variate în baza de date locală (localStorage). 
                    Acest lucru îți permite să testezi Dashboard-ul, statisticile și rapoartele financiare fără backend.
                </p>
                <button 
                    onClick={generateTestData}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                    Generează Date Test
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Export Card */}
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">📦</span>
                        <h3 className="font-bold text-lg text-blue-900">Backup Complet</h3>
                    </div>
                    <p className="text-sm text-blue-800 mb-6 flex-grow">
                        Salvează tot ce ai configurat (texte, culori, prețuri, juriu, piese, înscrieri locale) într-un singur fișier JSON.
                    </p>
                    <button 
                        onClick={handleDownloadJson}
                        disabled={isExporting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isExporting ? 'Se generează...' : 'Exportă JSON'}
                    </button>
                </div>

                {/* Security Card */}
                <div className="bg-red-50 p-6 rounded-xl border border-red-100 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">🛡️</span>
                        <h3 className="font-bold text-lg text-red-900">Securitate Server</h3>
                    </div>
                    <p className="text-sm text-red-800 mb-6 flex-grow">
                        În producție, panoul de administrare trebuie protejat riguros.
                    </p>
                    <button 
                        onClick={() => setShowSecurityModal(true)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all"
                    >
                        Vezi Ghid Securitate
                    </button>
                </div>
            </div>

            {/* Security Instructions Modal */}
            {showSecurityModal && (
                <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-scale-in">
                        <button onClick={() => setShowSecurityModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>
                        <h2 className="text-2xl font-black text-brand-dark mb-6">Securizare Admin</h2>
                        <div className="space-y-4 text-gray-700">
                            <p className="font-bold text-red-600">⚠️ Foarte Important:</p>
                            <p className="text-sm">Parola de acces la interfață este o barieră vizuală. Pentru protecție reală a bazei de date:</p>
                            <ol className="list-decimal pl-5 space-y-3 text-sm">
                                <li>Intră în <strong>CPanel</strong> &rarr; <strong>Directory Privacy</strong>.</li>
                                <li>Selectează folderul unde ai urcat site-ul (public_html).</li>
                                <li>Bifează "Password protect this directory".</li>
                                <li>Creează un utilizator și o parolă de server.</li>
                                <li>Acum datele tale sunt criptate la nivel de server Apache/Nginx.</li>
                            </ol>
                        </div>
                        <button onClick={() => setShowSecurityModal(false)} className="mt-8 w-full bg-brand-purple text-white font-bold py-3 rounded-xl shadow-lg">Am Înțeles</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MigrationTools;
