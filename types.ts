

export interface DynamicTextSet {
    id: string;
    prefix: string;
    prefixColor: string;
    words: string[];
    wordsColor: string;
}

export interface ChangingTextConfig {
    enabled: boolean;
    sets: DynamicTextSet[];
    interval: number;
    setDuration: number;
    fontSizeDesktop: number;
    fontSizeMobile: number;
    desktopLayout: 'inline' | 'stacked';
}

export interface HeroConfig {
    logoUrl: string;
    showLogo: boolean;
    logoPosition: 'left' | 'center' | 'right';
    title: string;
    showTitle: boolean;
    changingText: ChangingTextConfig; 
    titleStyles: { fontFamily: string; color: string; iBold: boolean; iItalic: boolean; isUnderlined: boolean; };
    buttonText: string;
    showButton: boolean;
    buttonStyles: { fontFamily: string; textColor: string; bgColor: string; iBold: boolean; iItalic: boolean; isUnderlined: boolean; };
    backgroundType: 'gradient' | 'image' | 'video';
    gradient: { color1: string; color2: string; color3: string; color4: string; speed: number; };
    desktopImageUrl: string;
    mobileImageUrl: string;
    desktopVideoUrl: string;
    mobileVideoUrl: string;
    logoAnimation: { type: 'float' | 'rotate' | 'pulse' | 'none'; speed: number; };
    decorationType: 'notes' | 'visualizer' | 'none';
    floatingNotesCount: number;
    visualizerHeight: number;
}

export interface SectionVisibility {
    desktop: boolean;
    mobile: boolean;
}

export interface SectionTitleStyles {
    useGradient?: boolean;
    gradientFrom?: string;
    gradientTo?: string;
    useShadow?: boolean;
    shadowColor?: string;
}

export type SeparatorStyle = 'none' | 'tilt' | 'wave' | 'wave_animated' | 'spikes' | 'curve_center' | 'triangle' | 'clouds';

export interface SeparatorConfig {
    style: SeparatorStyle;
    height: number;
    color: string;
    reversed: boolean;
    isTop: boolean;
}

export interface SectionConfig { 
    id: string; 
    title: string; 
    enabled: boolean; 
    visibility: SectionVisibility; 
    titleStyles: SectionTitleStyles; 
    bgColor: string; 
    shadowColor: string;
    shadowIntensity?: number; 
    separatorBottom?: SeparatorConfig;
}

export interface EmailConfig { 
    subject: string; 
    body: string; 
    reminderSubject: string; // NOU
    reminderBody: string;    // NOU
    serverEndpoint: string; 
}

export interface FomoConfig {
    enabled: boolean;
    messages: string[];
    intervalSeconds: number;
    minDelay: number;
}

export interface MarketingConfig {
    google: { enabled: boolean; measurementId: string; };
    googleAds: { enabled: boolean; conversionId: string; registrationLabel: string; };
    facebook: { enabled: boolean; pixelId: string; };
    tiktok: { enabled: boolean; pixelId: string; };
    fomo: FomoConfig; 
}

export interface NavLinkItem {
    id: string;
    label: string;
    url: string;
    type: 'internal' | 'external';
    visible: boolean;
}

export interface NavbarConfig {
    design: 'default' | 'modern_pill' | 'dark_glass' | 'full_width';
    showContactIcons: boolean;
    showCtaButton: boolean;
    ctaButtonText: string;
    ctaButtonLink: string;
    links: NavLinkItem[];
}

export interface CountdownConfig {
    targetDate: string;
    title: string;
    numberColor: string;
    labelColor: string;
    labels: { days: string; hours: string; minutes: string; seconds: string; };
    animationEffect: 'shake' | 'pulse' | 'flip' | 'fade' | 'none';
    sizing: {
        desktop: { width: number; height: number; };
        mobile: { width: number; height: number; };
    };
    bgColor: string;
    shadowColor: string;
}

export interface LocationConfig {
    locationName: string;
    address: string;
    startDate: string;
    googleMapsLink: string;
    wazeLink: string;
    mapEmbedUrl: string;
    parkingInfo?: string;
    parkingLink?: string;
}

export interface Partner {
    id: string;
    img: string;
    link: string;
}

export interface Juror {
    id: string;
    name: string;
    role: string;
    subRole: string;
    quote: string;
    bio: string;
    img: string;
    isPresident: boolean;
    isSurprise: boolean;
}

export interface Prize {
    id: string;
    title: string;
    desc: string;
    colorClass: string;
    textColorClass: string;
}

export interface PrizesConfig {
    trophyImage: string;
    prizes: Prize[];
}

export interface FAQ {
    id: string;
    q: string;
    a: string;
    iconUrl: string;
}

export interface MusicSection {
    id: string;
    label: string;
    availableForGroup: boolean;
    isInstrument: boolean;
    requiresFile: boolean;
}

export interface FieldRequirements {
    individual_name: boolean; individual_exact_age: boolean; individual_professor: boolean; individual_school: boolean; individual_age: boolean;
    group_name: boolean; group_members: boolean; group_age: boolean; group_school: boolean;
    contact_name: boolean; contact_phone: boolean; contact_email: boolean; 
    billing_county: boolean; billing_city: boolean; billing_address: boolean;
    piece_section: boolean; piece_name: boolean; piece_artist: boolean;
    terms_required: boolean;
    terms_default_checked: boolean;
}

export interface Voucher {
    code: string;
    discountType: 'percent' | 'fixed' | 'free';
    value: number;
    active: boolean;
    source?: 'manual' | 'wheel';
    startDate?: string;
    endDate?: string;
    description?: string;
}

export interface FormConfig {
    ageCategoriesIndividual: string[];
    ageCategoriesGroup: string[];
    musicSections: MusicSection[];
    fieldRequirements: FieldRequirements;
    vouchers: Voucher[];
    costs: {
        individual: { '1': number; '2': number; '3': number };
        group: { small: number; large: number };
    };
    promotion: {
        enabled: boolean;
        endDate: string;
        costs: {
            individual: { '1': number; '2': number; '3': number };
            group: { small: number; large: number };
        };
    };
}

export interface Piece {
    id: string;
    section: string;
    name: string;
    artist: string;
    negativeType: 'file' | 'link';
    fileName?: string;
    youtubeLink?: string;
}

export interface RegistrationData {
    id: string;
    submissionDate: string;
    type: 'individual' | 'grup';
    name?: string;
    groupName?: string;
    contactName?: string;
    phone?: string;
    email?: string;
    county?: string;
    city?: string;
    address?: string;
    professor?: string;
    school?: string;
    schoolGroup?: string;
    contactPhone?: string;
    contactEmail?: string;
    contactCity?: string;
    ageCategoryIndividual?: string;
    ageExact?: number;
    ageCategoryGroup?: string;
    groupMembersCount?: number;
    groupType?: 'grup_mic' | 'grup_mare';
    pieces: Piece[];
    numarPieseIndividual?: number;
    paymentMethod: 'transfer' | 'card' | undefined;
    totalCost: number;
    appliedVoucher?: string; 
    status: 'pending' | 'paid';
    paymentLink?: string;
    isInvoiced?: boolean;
    invoiceSeries?: string;
    invoiceNumber?: string;
    invoiceLink?: string;
}

export interface MobilPayConfig {
    signature: string;
    testMode: boolean;
    autoRedirect: boolean;
    integrationMode: 'links' | 'server_form'; 
    serverEndpoint: string;
}

export interface SmartBillConfig {
    enabled: boolean;
    cif: string;
    username: string;
    token: string;
    seriesName: string;
    defaultVatPercent: number;
    isVatPayer: boolean;
    serverEndpoint: string;
}

export interface StickyFooterConfig {
    enabled: boolean;
    type: 'text_only' | 'text_button' | 'image_button' | 'countdown';
    text: string;
    buttonText: string;
    buttonLink: string;
    effect: 'none' | 'slide-up' | 'shake' | 'vibe' | 'pulse' | 'glow' | 'marquee';
    countdownDate?: string; 
    images: {
        desktop: string;
        mobile: string;
    };
    colors: {
        background: string;
        text: string;
        buttonBg: string;
        buttonText: string;
    };
}

/* Fix: Extracted and exported types for PopupConfig to resolve Module '"../../types"' has no exported member errors */
export type PopupFrequency = 'always' | 'once_session' | 'once_day' | 'once_forever';
export type PopupAnimation = 'fade' | 'zoom-in' | 'slide-up' | 'slide-down' | 'bounce' | 'flip';
export type PopupMediaType = 'none' | 'image' | 'video';

export interface PopupConfig {
    enabled: boolean;
    triggerDelay: number;
    /* Fix: Use extracted PopupFrequency type */
    frequency: PopupFrequency;
    /* Fix: Use extracted PopupAnimation type */
    animation: PopupAnimation;
    content: {
        /* Fix: Use extracted PopupMediaType type */
        mediaType: PopupMediaType;
        mediaUrl: string;
        title: string;
        description: string;
    };
    button: {
        show: boolean;
        text: string;
        link: string;
        bgColor: string;
        textColor: string;
    };
    styles: {
        width: 'small' | 'medium' | 'large';
        overlayColor: string;
        backgroundColor: string;
    };
}

export interface WheelSegment {
    id: string;
    label: string;
    type: 'discount' | 'loss' | 'free';
    probabilityWeight: number;
    color: string;
    textColor: string;
    isVoucher?: boolean;
    voucherValue?: number;
    code?: string;
    resultText?: string;
    resultColor?: string;
    resultIsBold?: boolean;
}

export interface WheelConfig {
    enabled: boolean;
    adminTestMode: boolean;
    triggerPosition: 'left' | 'right';
    buttonText: string;
    colors: {
        border: string;
        center: string;
        pointer: string;
    };
    segments: WheelSegment[];
}

export interface StaticPage {
    id: string;
    title: string;
    content: string;
}

export interface GalleryImage {
    id: string;
    url: string;
    caption?: string;
}

export interface GalleryVideo {
    id: string;
    url: string;
    originalUrl?: string;
    title: string;
    type: 'portrait' | 'landscape';
}

export interface Review {
    id: string;
    author: string;
    role: string;
    stars: number;
    text: string;
    isVisible: boolean;
}

export interface FloatingButtonsConfig {
    whatsappEnabled: boolean;
    chatbotEnabled: boolean;
    backToTopEnabled: boolean;
}
