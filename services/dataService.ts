
import { RegistrationData } from '../types';

const API_URL = './api.php';
const LOCAL_DB_KEY = 'voiceup_local_db';

// --- DATE DE TEST PENTRU IMPORT DIRECT ---
const MOCK_DATA: RegistrationData[] = [
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

export const dataService = {
    getRegistrations: async (): Promise<RegistrationData[]> => {
        // In a real app, this would fetch from API_URL
        // For this demo/static deployment, we use LocalStorage + Mock Data
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const stored = localStorage.getItem(LOCAL_DB_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Failed to parse local DB", e);
                return [];
            }
        }
        
        // Initialize with Mock Data if empty
        localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(MOCK_DATA));
        return MOCK_DATA;
    },

    submitRegistration: async (data: RegistrationData): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        try {
            const current = await dataService.getRegistrations();
            const updated = [data, ...current];
            localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(updated));
            return true;
        } catch (e) {
            console.error("Failed to submit", e);
            return false;
        }
    },

    login: async (user: string, pass: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        // Check credentials
        if (user === 'admin' && pass === 'voiceup25') return true;
        return false;
    }
};
