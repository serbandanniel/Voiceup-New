
// This file is now a barrel file (re-exporter) to maintain backward compatibility
// while moving logic to modular files in 'components/sections/'.

import React from 'react';
import { SectionConfig } from '../types';
import RegistrationForm from './RegistrationForm';

// Re-export the new modular components
export { default as AboutContent } from './sections/AboutSection';
export { default as CategoriesContent } from './sections/CategoriesSection';
export { default as LocationContent } from './sections/LocationSection';
export { default as PartnersContent } from './sections/PartnersSection';
export { default as JuryContent } from './sections/JurySection';
export { default as PrizesContent } from './sections/PrizesSection';
export { default as FeesContent } from './sections/FeesSection';
export { default as RulesContent } from './sections/HowToRegisterSection';
export { default as FAQContent } from './sections/FAQSection';
export { default as ContactContent } from './sections/ContactSection';
export { default as FooterContent } from './sections/FooterSection';

// Modularized Visual Sections
export { default as PhotoGallery } from './sections/PhotoGallerySection';
export { default as VideoGallery } from './sections/VideoGallerySection';
export { default as ReviewsSection } from './sections/ReviewsSection';
