
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Barrel Imports
import { 
    Login, Dashboard, PaymentLinks, FormConfigPage, LocationConfigPage, 
    PartnersConfigPage, JurorsConfigPage, PrizesConfigPage, FAQConfigPage, 
    CountdownConfigPage, HeroConfigPage, SectionsConfigPage, EmailConfigPage, 
    MobilPayConfigPage, SmartBillConfigPage, PopupConfigPage, StickyFooterConfigPage, 
    WheelConfigPage, MarketingConfigPage, NavigationConfigPage, StaticPagesConfig,
    MigrationTools, PhotoGalleryConfigPage, VideoGalleryConfigPage, ReviewsConfigPage,
    VouchersPage, FinancialPage, StatisticsPage, ScheduleGeneratorPage, JudgingSheetsPage
} from './admin/index';

import { AdminAssistant, NotificationProvider } from '../components/admin';
import SEO from '../components/SEO';

// --- ICONS ---
const Icons = {
    Dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>,
    Design: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>,
    Marketing: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>,
    Billing: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
    AI: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>,
    Media: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
    Server: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/></svg>,
    Reports: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
    
    // Sub-items
    Hero: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
    Countdown: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
    Section: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>,
    Prize: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>,
    Jury: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>,
    Partner: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>,
    FAQ: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
    Location: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>,
    Menu: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>,
    Page: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>,
    Form: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>,
    Wheel: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
    Tracking: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>,
    Popup: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>,
    Sticky: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>,
    Email: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>,
    Card: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>,
    Invoice: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>,
    Link: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>,
    Photo: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
    Video: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>,
    Review: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>,
    Voucher: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>,
    Money: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
    Stats: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>,
    Schedule: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
    Judging: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
};

// --- DATA STRUCTURE FOR MENU ---
const MENU_STRUCTURE = [
    {
        id: 'registrations', // Re-made into a direct button as per user's screenshot
        label: 'Înscrieri',
        icon: Icons.Dashboard,
        items: [] 
    },
    {
        id: 'design_content',
        label: 'Design & Conținut',
        icon: Icons.Design,
        items: [
            { id: 'hero', label: 'Hero Section', icon: Icons.Hero },
            { id: 'countdown', label: 'Countdown', icon: Icons.Countdown },
            { id: 'sections', label: 'Secțiuni Pagină', icon: Icons.Section },
            { id: 'navigation', label: 'Meniu & Navigare', icon: Icons.Menu },
            { id: 'static_pages', label: 'Pagini Fixe', icon: Icons.Page },
            { id: 'formConfig', label: 'Config Formular', icon: Icons.Form },
            { id: 'prizes', label: 'Premii', icon: Icons.Prize },
            { id: 'jurors', label: 'Juriu', icon: Icons.Jury },
            { id: 'partners', label: 'Parteneri', icon: Icons.Partner },
            { id: 'faq', label: 'FAQ', icon: Icons.FAQ },
            { id: 'location', label: 'Locație', icon: Icons.Location },
            { id: 'reviews', label: 'Recenzii', icon: Icons.Review },
        ]
    },
    {
        id: 'media_gallery',
        label: 'Foto & Video',
        icon: Icons.Media,
        items: [
            { id: 'photos', label: 'Galerie Foto', icon: Icons.Photo },
            { id: 'videos', label: 'Galerie Video', icon: Icons.Video },
        ]
    },
    {
        id: 'reports',
        label: 'Rapoarte & Analiză',
        icon: Icons.Reports,
        items: [
            { id: 'financial', label: 'Financiar', icon: Icons.Money },
            { id: 'statistics', label: 'Statistici', icon: Icons.Stats },
            { id: 'schedule', label: 'Generator Desfășurător', icon: Icons.Schedule },
            { id: 'judging_sheets', label: 'Fișe Jurizare', icon: Icons.Judging },
        ]
    },
    {
        id: 'marketing_tools',
        label: 'Marketing & Tools',
        icon: Icons.Marketing,
        items: [
            { id: 'vouchers', label: 'Vouchere & Coduri', icon: Icons.Voucher },
            { id: 'wheel', label: 'Roata Norocului', icon: Icons.Wheel },
            { id: 'fomo', label: 'Notificări Live (News)', icon: Icons.Marketing },
            { id: 'marketing', label: 'Tracking & Pixels', icon: Icons.Tracking },
            { id: 'popup', label: 'Pop-up Promo', icon: Icons.Popup },
            { id: 'sticky', label: 'Sticky Footer', icon: Icons.Sticky },
            { id: 'email', label: 'Notificări Email', icon: Icons.Email },
        ]
    },
    {
        id: 'billing',
        label: 'Facturi & Plăți',
        icon: Icons.Billing,
        items: [
            { id: 'smartbill', label: 'SmartBill', icon: Icons.Invoice },
            { id: 'mobilpay', label: 'MobilPay', icon: Icons.Card },
            { id: 'settings', label: 'Linkuri Plată', icon: Icons.Link },
        ]
    },
    {
        id: 'server',
        label: 'Server & Migrare',
        icon: Icons.Server,
        items: [
            { id: 'migration', label: 'Migrare Date', icon: Icons.Server },
        ]
    },
    {
        id: 'ai',
        label: 'Asistent AI',
        icon: Icons.AI,
        items: [] // Direct link
    }
];

const Admin: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('registrations');
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [expandedMobileCategories, setExpandedMobileCategories] = useState<string[]>([]);
    
    useEffect(() => {
        if(localStorage.getItem('admin_auth') === 'true') setIsAuthenticated(true);
    }, []);

    const handleLogin = () => {
        localStorage.setItem('admin_auth', 'true');
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_auth');
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) return <Login onLogin={handleLogin} />;
    
    // Helper to find the parent category of the active tab
    const getActiveCategory = (tabId: string) => {
        return MENU_STRUCTURE.find(cat => cat.id === tabId || cat.items.some(item => item.id === tabId));
    };

    const activeCategory = getActiveCategory(activeTab);
    const activeItem = activeCategory?.items.find(i => i.id === activeTab);

    // Toggle function
    const toggleMobileCategory = (id: string) => {
        setExpandedMobileCategories(prev => 
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    return (
      <NotificationProvider>
        <SEO title="Admin Panel - VoiceUP Festival" />
        <div className="h-[100dvh] bg-gray-50 text-gray-900 font-sans cursor-auto flex flex-col overflow-hidden">
            {/* --- UNIFIED HEADER --- */}
            <header className="bg-brand-dark text-white shadow-lg flex-shrink-0 relative z-[100]">
                <div className="max-w-[1920px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
                    
                    {/* LEFT: Logo */}
                    <div className="flex items-center gap-4 flex-shrink-0 w-48">
                        <h1 className="font-alfa-slab-one text-xl tracking-wide text-white whitespace-nowrap">
                            VoiceUP <span className="text-brand-pink">Admin</span>
                        </h1>
                    </div>

                    {/* CENTER: Dropdown Menu (Desktop) */}
                    <nav className="hidden lg:flex items-center justify-center gap-1 flex-grow">
                        {MENU_STRUCTURE.map(cat => {
                            const hasSubItems = cat.items.length > 0;
                            const isActive = activeCategory?.id === cat.id;

                            return (
                                <div key={cat.id} className="relative group px-2">
                                    <button 
                                        onClick={() => {
                                            if (!hasSubItems) setActiveTab(cat.id);
                                        }}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${isActive ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {cat.icon}
                                        {cat.label}
                                        {hasSubItems && (
                                            <svg className="w-3 h-3 ml-1 opacity-70 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        )}
                                    </button>

                                    {/* Dropdown Menu */}
                                    {hasSubItems && (
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-4 w-64 hidden group-hover:block transition-all duration-200 opacity-0 group-hover:opacity-100 z-[101]">
                                            <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-2 relative">
                                                {/* Little triangle arrow */}
                                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100"></div>
                                                
                                                {cat.items.map(item => (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => setActiveTab(item.id)}
                                                        className={`w-full text-left px-4 py-3 text-sm font-semibold flex items-center gap-3 transition-colors ${activeTab === item.id ? 'bg-violet-50 text-brand-purple' : 'text-gray-600 hover:bg-gray-50 hover:text-brand-purple'}`}
                                                    >
                                                        <span className={activeTab === item.id ? 'text-brand-purple' : 'text-gray-400'}>{item.icon}</span>
                                                        {item.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* RIGHT: Actions */}
                    <div className="flex items-center justify-end gap-3 flex-shrink-0 w-48">
                        <Link to="/" className="hidden md:flex items-center gap-2 text-violet-300 hover:text-white text-xs font-bold transition-colors bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20 whitespace-nowrap">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Site
                        </Link>
                        <button onClick={handleLogout} className="bg-red-500/80 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Logout
                        </button>
                        
                        {/* Mobile Toggle */}
                        <button onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} className="lg:hidden text-white p-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU DROPDOWN - ACCORDION STYLE */}
                {isMobileNavOpen && (
                    <div className="lg:hidden bg-brand-dark border-t border-white/10 p-4 max-h-[80vh] overflow-y-auto absolute w-full left-0 shadow-2xl">
                        <div className="flex flex-col gap-2">
                            {MENU_STRUCTURE.map(cat => {
                                const hasSubItems = cat.items.length > 0;
                                const isExpanded = expandedMobileCategories.includes(cat.id);
                                const isCatActive = activeCategory?.id === cat.id;

                                return (
                                    <div key={cat.id} className="border-b border-white/5 last:border-0">
                                        {hasSubItems ? (
                                            <>
                                                <button 
                                                    onClick={() => toggleMobileCategory(cat.id)}
                                                    className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${isCatActive ? 'bg-white/10 text-white' : 'text-violet-200 hover:bg-white/5'}`}
                                                >
                                                    <div className="flex items-center gap-3 font-bold text-sm uppercase tracking-wider">
                                                        {cat.icon}
                                                        {cat.label}
                                                    </div>
                                                    <svg className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </button>
                                                
                                                {/* Sub Items Accordion Body */}
                                                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[500px] opacity-100 mt-1 mb-3' : 'max-h-0 opacity-0'}`}>
                                                    <div className="flex flex-col gap-1 pl-4 border-l-2 border-white/10 ml-4">
                                                        {cat.items.map(item => (
                                                            <button
                                                                key={item.id}
                                                                onClick={() => { setActiveTab(item.id); setIsMobileNavOpen(false); }}
                                                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-3 transition-colors ${activeTab === item.id ? 'bg-brand-pink text-white shadow-md' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                                                            >
                                                                {item.icon} {item.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => { setActiveTab(cat.id); setIsMobileNavOpen(false); }}
                                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-bold text-sm uppercase tracking-wider mb-1 transition-colors ${activeTab === cat.id ? 'bg-brand-pink text-white shadow-md' : 'text-violet-200 hover:bg-white/5'}`}
                                            >
                                                {cat.icon} {cat.label}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-0">
                <div className="max-w-7xl mx-auto">
                    {/* Page Title / Breadcrumb */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-brand-dark tracking-tight flex items-center gap-2">
                            <span className="opacity-60">{activeCategory?.label}</span>
                            {activeItem && (
                                <>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                                    <span className="text-brand-purple">{activeItem.label}</span>
                                </>
                            )}
                        </h2>
                    </div>

                    {/* Show Floating Assistant on all tabs EXCEPT 'ai' tab where it is embedded */}
                    {activeTab !== 'ai' && <AdminAssistant isEmbedded={false} />}

                    {/* CONTENT AREA */}
                    <div className="transition-all duration-300 min-h-[500px]">
                        {activeTab === 'registrations' && <Dashboard />}
                        {activeTab === 'ai' && <AdminAssistant isEmbedded={true} />}
                        
                        {/* Reports */}
                        {activeTab === 'financial' && <FinancialPage />}
                        {activeTab === 'statistics' && <StatisticsPage />}
                        {activeTab === 'schedule' && <ScheduleGeneratorPage />}
                        {activeTab === 'judging_sheets' && <JudgingSheetsPage />}

                        {/* Design & Content */}
                        {activeTab === 'hero' && <HeroConfigPage />}
                        {activeTab === 'countdown' && <CountdownConfigPage />}
                        {activeTab === 'sections' && <SectionsConfigPage />}
                        {activeTab === 'navigation' && <NavigationConfigPage />}
                        {activeTab === 'static_pages' && <StaticPagesConfig />}
                        {activeTab === 'formConfig' && <FormConfigPage />}
                        {activeTab === 'prizes' && <PrizesConfigPage />}
                        {activeTab === 'jurors' && <JurorsConfigPage />}
                        {activeTab === 'partners' && <PartnersConfigPage />}
                        {activeTab === 'faq' && <FAQConfigPage />}
                        {activeTab === 'location' && <LocationConfigPage />}
                        {activeTab === 'reviews' && <ReviewsConfigPage />}

                        {/* Media */}
                        {activeTab === 'photos' && <PhotoGalleryConfigPage />}
                        {activeTab === 'videos' && <VideoGalleryConfigPage />}

                        {/* Marketing & Tools */}
                        {activeTab === 'vouchers' && <VouchersPage />}
                        {activeTab === 'wheel' && <WheelConfigPage />}
                        {activeTab === 'marketing' && <MarketingConfigPage initialTab="facebook" />}
                        {activeTab === 'fomo' && <MarketingConfigPage initialTab="fomo" />}
                        {activeTab === 'popup' && <PopupConfigPage />}
                        {activeTab === 'sticky' && <StickyFooterConfigPage />}
                        {activeTab === 'email' && <EmailConfigPage />}

                        {/* Billing */}
                        {activeTab === 'smartbill' && <SmartBillConfigPage />}
                        {activeTab === 'mobilpay' && <MobilPayConfigPage />}
                        {activeTab === 'settings' && <PaymentLinks />}

                        {/* Migration */}
                        {activeTab === 'migration' && <MigrationTools />}
                    </div>
                </div>
            </main>
        </div>
      </NotificationProvider>
    );
};

export default Admin;
