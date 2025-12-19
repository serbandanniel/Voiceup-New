
import { SectionConfig, SectionTitleStyles, SeparatorConfig } from '../interfaces';

const defaultTitleStyles: SectionTitleStyles = {
    useGradient: false,
    gradientFrom: '#7C3AED',
    gradientTo: '#F472B6',
    useShadow: false,
    shadowColor: 'rgba(0,0,0,0.2)'
};

const defaultSeparator: SeparatorConfig = {
    style: 'none',
    height: 60,
    color: '#ffffff',
    reversed: false,
    isTop: false
};

// FULL MODULAR CONFIGURATION
export const DEFAULT_SECTIONS_CONFIG: SectionConfig[] = [
    { id: 'hero', title: 'Hero', enabled: true, visibility: { desktop: true, mobile: true }, titleStyles: {...defaultTitleStyles}, bgColor: '', shadowColor: '', shadowIntensity: 0, separatorBottom: { ...defaultSeparator, style: 'none', height: 80, color: '#ffffff' } },
    { id: 'countdown', title: 'Countdown', enabled: false, visibility: { desktop: true, mobile: true }, titleStyles: {...defaultTitleStyles}, bgColor: '#ffffff', shadowColor: 'rgba(0,0,0,0.1)', shadowIntensity: 25, separatorBottom: { ...defaultSeparator } },
    
    // Split About Section
    { id: 'about', title: 'Despre Festival', enabled: true, visibility: { desktop: true, mobile: true }, titleStyles: {...defaultTitleStyles}, bgColor: '#f9fafb', shadowColor: 'rgba(46, 16, 101, 0.1)', shadowIntensity: 25, separatorBottom: { ...defaultSeparator } },
    { id: 'categories', title: 'Categorii de vârstă', enabled: true, visibility: { desktop: true, mobile: true }, titleStyles: {...defaultTitleStyles}, bgColor: '#ffffff', shadowColor: 'rgba(0,0,0,0.05)', shadowIntensity: 10, separatorBottom: { ...defaultSeparator } },
    { id: 'location', title: 'Locație și Dată', enabled: true, visibility: { desktop: true, mobile: true }, titleStyles: {...defaultTitleStyles}, bgColor: '#f9fafb', shadowColor: 'rgba(46, 16, 101, 0.1)', shadowIntensity: 25, separatorBottom: { ...defaultSeparator } },

    // Visuals
    { id: 'gallery', title: 'Galerie Foto', enabled: true, visibility: { desktop: true, mobile: true }, titleStyles: {...defaultTitleStyles}, bgColor: '#ffffff', shadowColor: 'rgba(0,0,0,0.05)', shadowIntensity: 10, separatorBottom: { ...defaultSeparator } },
    { id: 'video', title: 'Galerie Video', enabled: true, visibility: { desktop: true, mobile: true }, titleStyles: {...defaultTitleStyles}, bgColor: '#f9fafb', shadowColor: 'rgba(0,0,0,0.05)', shadowIntensity: 10, separatorBottom: { ...defaultSeparator } },
    
    { id: 'partners', title: 'Parteneri și Sponsori', enabled: true, visibility: { desktop: true, mobile: true }, titleStyles: {...defaultTitleStyles}, bgColor: '#ffffff', shadowColor: 'rgba(46, 16, 101, 0.1)', shadowIntensity: 25, separatorBottom: { ...defaultSeparator } },
    { id: 'jury', title: 'Juriu', enabled: true, visibility: { desktop: true, mobile: true }, titleStyles: {...defaultTitleStyles}, bgColor: '#f9fafb', shadowColor: 'rgba(46, 16, 101, 0.1)', shadowIntensity: 25, separatorBottom: { ...defaultSeparator } },
    { id: 'prizes', title: 'Premii', enabled: true, visibility: { desktop: true, mobile: true }, titleStyles: {...defaultTitleStyles}, bgColor: '#ffffff', shadowColor: 'rgba(46, 16, 101, 0.1)', shadowIntensity: 25, separatorBottom: { ...defaultSeparator } },
    { id: 'fees', title: 'Taxe de Înscriere', enabled: true, visibility: { desktop: true, mobile: true }, titleStyles: {...defaultTitleStyles}, bgColor: '#f9fafb', shadowColor: 'rgba(46, 16, 101, 0.1)', shadowIntensity: 25, separatorBottom: { ...defaultSeparator } },
    
    // How to Register
    { id: 'howto', title: 'Cum mă înscriu?', enabled: true, visibility: { desktop: true, mobile: true }, titleStyles: {...defaultTitleStyles}, bgColor: '#ffffff', shadowColor: 'rgba(46, 16, 101, 0.1)', shadowIntensity: 25, separatorBottom: { ...defaultSeparator } },
    
    { id: 'register', title: 'Formular Înscriere', enabled: true, visibility: { desktop: true, mobile: true }, titleStyles: {...defaultTitleStyles}, bgColor: '#f9fafb', shadowColor: 'rgba(46, 16, 101, 0.1)', shadowIntensity: 25, separatorBottom: { ...defaultSeparator } },
    
    { id: 'reviews', title: 'Recenzii', enabled: true, visibility: { desktop: true, mobile: true }, titleStyles: {...defaultTitleStyles}, bgColor: '#ffffff', shadowColor: 'rgba(0,0,0,0.05)', shadowIntensity: 10, separatorBottom: { ...defaultSeparator } },
    
    { id: 'faq', title: 'Întrebări Frecvente', enabled: true, visibility: { desktop: true, mobile: true }, titleStyles: {...defaultTitleStyles}, bgColor: '#ffffff', shadowColor: 'rgba(46, 16, 101, 0.1)', shadowIntensity: 25, separatorBottom: { ...defaultSeparator } },
    { id: 'contact', title: 'Contact', enabled: true, visibility: { desktop: true, mobile: true }, titleStyles: {...defaultTitleStyles}, bgColor: '#f9fafb', shadowColor: 'rgba(46, 16, 101, 0.1)', shadowIntensity: 25, separatorBottom: { ...defaultSeparator } },
    
    // Footer Section
    { id: 'footer', title: 'Footer', enabled: true, visibility: { desktop: true, mobile: true }, titleStyles: {...defaultTitleStyles}, bgColor: '#1e1b4b', shadowColor: '', shadowIntensity: 0 }
];
