
import { NavbarConfig } from '../interfaces';

export const DEFAULT_NAVBAR_CONFIG: NavbarConfig = {
    design: 'default',
    showContactIcons: true,
    showCtaButton: true,
    ctaButtonText: 'Înscrie-te',
    ctaButtonLink: '#formular-inscriere',
    links: [
        { id: '1', label: 'Despre festival', url: '#despre', type: 'internal', visible: true },
        { id: '2', label: 'Parteneri', url: '#parteneri', type: 'internal', visible: true },
        { id: '3', label: 'Regulament', url: '#cum-ma-inscriu', type: 'internal', visible: true },
        { id: '4', label: 'Juriu', url: '#juriu', type: 'internal', visible: true },
        { id: '5', label: 'Premii', url: '#premii', type: 'internal', visible: true },
        { id: '6', label: 'Taxe', url: '#taxe-inscriere', type: 'internal', visible: true },
    ]
};
