
import { FormConfig } from '../interfaces';

export const DEFAULT_FORM_CONFIG: FormConfig = {
    ageCategoriesIndividual: ['5 - 7 ani', '8 - 10 ani', '11 - 13 ani', '14 - 16 ani', '17 - 18+ ani'],
    ageCategoriesGroup: ['5 - 7 ani', '8 - 10 ani', '11 - 13 ani', '14 - 16 ani', '17 - 18+ ani'],
    musicSections: [
        { id: 'usoara_ro', label: 'Muzică Ușoară Românească', availableForGroup: true, isInstrument: false, requiresFile: true },
        { id: 'usoara_int', label: 'Muzică Ușoară Internațională', availableForGroup: true, isInstrument: false, requiresFile: true },
        { id: 'populara', label: 'Muzică Populară', availableForGroup: true, isInstrument: false, requiresFile: true },
        { id: 'etno', label: 'Etno', availableForGroup: true, isInstrument: false, requiresFile: true },
        { id: 'colinde', label: 'Colinde', availableForGroup: true, isInstrument: false, requiresFile: true },
        { id: 'instrument', label: 'Instrument (Pian)', availableForGroup: false, isInstrument: true, requiresFile: false },
    ],
    fieldRequirements: {
        // Step 2: Participant Data
        individual_name: true, individual_exact_age: true, 
        individual_professor: true, individual_school: false, individual_age: true,
        group_name: true, group_members: true, group_age: true, group_school: false,
        
        // Step 3: Pieces
        piece_section: true, piece_name: true, piece_artist: true,

        // Step 4: Billing / Contact
        contact_name: true, contact_phone: true, contact_email: true, 
        billing_county: true, billing_city: true, billing_address: true,

        // General & Terms
        terms_required: true,
        terms_default_checked: false
    },
    vouchers: [
        { code: 'TEST10', discountType: 'percent', value: 10, active: true, source: 'manual', description: 'Reducere 10%' },
        { code: 'TEST25', discountType: 'percent', value: 25, active: true, source: 'manual', description: 'Reducere 25%' },
        { code: 'JUMATATE', discountType: 'percent', value: 50, active: true, source: 'manual', description: 'Reducere 50%' },
        { code: 'GRATUIT', discountType: 'free', value: 0, active: true, source: 'manual', description: 'Înscriere Gratuită' },
        { code: 'MINUS50', discountType: 'fixed', value: 50, active: true, source: 'manual', description: 'Reducere 50 RON' }
    ],
    costs: { individual: { '1': 300, '2': 500, '3': 700 }, group: { small: 200, large: 150 } },
    promotion: { enabled: false, endDate: '2025-11-01T23:59', costs: { individual: { '1': 250, '2': 400, '3': 600 }, group: { small: 150, large: 100 } } }
};
