
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, FunctionDeclaration, Type } from '@google/genai';
import { chatbotContext } from '../chatbotContext';
import { RegistrationData, StickyFooterConfig, FloatingButtonsConfig } from '../types';
import { DEFAULT_FORM_CONFIG, DEFAULT_STICKY_FOOTER_CONFIG, DEFAULT_FLOATING_CONFIG } from '../config';
import { dataService } from '../services/dataService';

const parseMessageContent = (rawText: string) => {
    const options: string[] = [];
    const text = rawText.replace(/\[([^\]]+)\]/g, (match, p1) => {
        options.push(p1);
        return "";
    }).trim();
    return { text, options };
};

const registerFunctionDeclaration: FunctionDeclaration = {
    name: 'executeRegistration',
    parameters: {
        type: Type.OBJECT,
        description: 'Înregistrează un participant sau un grup la VoiceUP Festival. Execută DOAR când ai TOATE datele.',
        properties: {
            type: { type: Type.STRING, enum: ['individual', 'grup'], description: 'Tipul înscrierii' },
            name: { type: Type.STRING, description: 'Numele complet al concurentului sau grupului' },
            ageExact: { type: Type.NUMBER, description: 'Vârsta exactă a copilului în ani împliniți (Ex: 7, 10, 15). Obligatoriu pentru individual.' },
            ageCategory: { type: Type.STRING, description: 'Categoria de vârstă (ex: 5-7 ani, 8-10 ani, etc)' },
            school: { type: Type.STRING, description: 'Școala de proveniență / Instituția' },
            professor: { type: Type.STRING, description: 'Profesor coordonator' },
            groupMembersCount: { type: Type.NUMBER, description: 'Nr membri (doar pt grup)' },
            
            // Repertoriu
            piecesJson: { type: Type.STRING, description: 'JSON array string cu piese: [{"section": "Pop", "name": "Titlu", "artist": "Artist"}]' },
            
            // Contact & Facturare
            contactName: { type: Type.STRING, description: 'Nume persoană contact / părinte' },
            phone: { type: Type.STRING, description: 'Telefon contact' },
            email: { type: Type.STRING, description: 'Email contact' },
            county: { type: Type.STRING, description: 'Județ' },
            city: { type: Type.STRING, description: 'Localitate / Sector' },
            address: { type: Type.STRING, description: 'Adresa completă (stradă, număr)' },
            
            paymentMethod: { type: Type.STRING, enum: ['card', 'transfer'], description: 'Metoda plată' }
        },
        required: ['type', 'name', 'ageExact', 'ageCategory', 'school', 'professor', 'piecesJson', 'contactName', 'phone', 'email', 'county', 'city', 'paymentMethod']
    }
};

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showTrigger, setShowTrigger] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string; options?: string[] }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [footerActive, setFooterActive] = useState(false); 
    const [floatingConfig, setFloatingConfig] = useState<FloatingButtonsConfig>(DEFAULT_FLOATING_CONFIG);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const apiHistory = useRef<any[]>([]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 350) {
                setShowTrigger(true);
            } else {
                setShowTrigger(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        
        const loadConfigs = () => {
            const sf = localStorage.getItem('stickyFooterConfig');
            if (sf) {
                try {
                    const parsed = JSON.parse(sf);
                    setFooterActive(parsed.enabled);
                } catch(e) {}
            } else {
                setFooterActive(DEFAULT_STICKY_FOOTER_CONFIG.enabled);
            }
            const fl = localStorage.getItem('floatingButtonsConfig');
            if (fl) {
                try {
                    setFloatingConfig(JSON.parse(fl));
                } catch(e) {}
            }
        };
        loadConfigs();

        const handleConfigUpdate = () => loadConfigs();
        window.addEventListener('navbarConfigUpdated', handleConfigUpdate);
        window.addEventListener('floatingConfigUpdated', handleConfigUpdate);
        window.addEventListener('marketingConfigUpdated', handleConfigUpdate);
        window.addEventListener('stickyFooterUpdated', handleConfigUpdate);

        if (isOpen && messages.length === 0) {
             setMessages([{ 
                role: 'model', 
                text: "Salut! 👋 Sunt VOICY! 🎤 Te pot ajuta cu informații sau te pot înscrie la festival pas cu pas! [Vreau să mă înscriu 📝] [Regulament 📜] [Taxe 💰]",
                options: ["Vreau să mă înscriu 📝", "Regulament 📜", "Taxe 💰"]
             }]);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('navbarConfigUpdated', handleConfigUpdate);
            window.removeEventListener('floatingConfigUpdated', handleConfigUpdate);
            window.removeEventListener('marketingConfigUpdated', handleConfigUpdate);
            window.removeEventListener('stickyFooterUpdated', handleConfigUpdate);
        };
    }, [isOpen]);

    // Robust scroll trapping logic using native events
    useEffect(() => {
        const chatWin = chatWindowRef.current;
        if (!chatWin || !isOpen) return;

        // Native wheel listener with passive: false to allow e.stopPropagation()
        const handleNativeWheel = (e: WheelEvent) => {
            // Stop the wheel event from reaching the body
            e.stopPropagation();
        };

        const handleNativeTouch = (e: TouchEvent) => {
            e.stopPropagation();
        };

        chatWin.addEventListener('wheel', handleNativeWheel, { passive: false });
        chatWin.addEventListener('touchmove', handleNativeTouch, { passive: false });

        return () => {
            chatWin.removeEventListener('wheel', handleNativeWheel);
            chatWin.removeEventListener('touchmove', handleNativeTouch);
        };
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (textOverride?: string) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim() || isLoading) return;

        setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
        setInput('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            apiHistory.current.push({ role: 'user', parts: [{ text: textToSend }] });

            const systemPrompt = `
                Ești VOICY, asistentul oficial VoiceUP Festival.
                Context Eveniment: ${chatbotContext}

                SARCINA TA PRINCIPALĂ: Să ajuți utilizatorul să se înscrie la festival.
                Trebuie să colectezi datele RIGUROS, în următoarea ordine (exact ca în formularul de pe site):

                PASUL 1. TIP ÎNSCRIERE: Individual sau Grup?
                
                PASUL 2. DATE CONCURENT:
                   - Nume și Prenume (sau Nume Grup)
                   - VÂRSTA EXACTĂ (Câți ani are copilul? Ex: 7, 10, 15). Este obligatoriu!
                   - Categoria de vârstă (o deduci din vârstă sau întrebi).
                   - Profesor Coordonator.
                   - Școala de proveniență.

                PASUL 3. REPERTORIU (PIESE):
                   - Pentru fiecare piesă (1, 2 sau 3): Secțiunea muzicală, Titlul piesei, Artistul original.
                   - Notă: Cere link YouTube pentru negativ sau spune-le că îl pot trimite pe email.

                PASUL 4. DATE CONTACT & FACTURARE (Părinte):
                   - Nume Părinte/Facturare.
                   - Telefon.
                   - Email.
                   - Județ, Localitate, Adresă completă.

                PASUL 5. PLATĂ:
                   - Card Online sau Transfer Bancar?

                REGULI:
                - NU apela funcția 'executeRegistration' până nu ai TOATE datele de mai sus, în special VÂRSTA EXACTĂ.
                - Dacă utilizatorul spune "vreau să mă înscriu", începe cu Pasul 1.
                - Fii prietenos, folosește emoji-uri.
                - Oferă opțiuni sub formă de [Buton] când e relevant (ex: [Individual] [Grup]).
            `;

            let response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: apiHistory.current,
                config: {
                    tools: [{ functionDeclarations: [registerFunctionDeclaration] }],
                    systemInstruction: systemPrompt
                }
            });

            if (response.functionCalls?.length) {
                const call = response.functionCalls[0];
                // Process the registration
                const args: any = call.args;
                
                // Map flat args to nested pieces structure if needed by dataService, 
                // but usually dataService expects pieces as array. 
                // The AI returns piecesJson string, we parse it.
                let pieces = [];
                try {
                    pieces = JSON.parse(args.piecesJson);
                } catch(e) {
                    pieces = [{ name: "Piesa 1", artist: "Unknown", section: "Muzică Ușoară" }];
                }

                const regData: Partial<RegistrationData> = {
                    type: args.type,
                    name: args.name, // or groupName depending on type
                    groupName: args.type === 'grup' ? args.name : undefined,
                    ageExact: args.ageExact,
                    ageCategoryIndividual: args.type === 'individual' ? args.ageCategory : undefined,
                    ageCategoryGroup: args.type === 'grup' ? args.ageCategory : undefined,
                    professor: args.professor,
                    school: args.school,
                    contactName: args.contactName,
                    phone: args.phone,
                    email: args.email,
                    county: args.county,
                    city: args.city,
                    address: args.address,
                    paymentMethod: args.paymentMethod,
                    pieces: pieces.map((p: any, idx: number) => ({
                        id: idx.toString(),
                        name: p.name,
                        artist: p.artist,
                        section: p.section,
                        negativeType: 'link', // Default for chat
                        youtubeLink: ''
                    })),
                    // Calculate costs roughly or let backend handle
                    totalCost: 0, 
                    status: 'pending',
                    submissionDate: new Date().toISOString()
                };

                // Helper to calc cost for data service
                const costMap: any = { '1': 300, '2': 500, '3': 700 };
                if (regData.type === 'individual') {
                    regData.numarPieseIndividual = pieces.length;
                    regData.totalCost = costMap[pieces.length.toString()] || 300;
                } else {
                    regData.groupMembersCount = args.groupMembersCount || 5;
                    regData.totalCost = 200 * regData.groupMembersCount; // fallback logic
                }

                const result = await dataService.submitRegistration(regData as RegistrationData);
                
                apiHistory.current.push({ role: 'model', parts: [response.candidates[0].content.parts.find(p => p.functionCall)] });
                apiHistory.current.push({ role: 'user', parts: [{ functionResponse: { name: call.name, response: { content: JSON.stringify({ status: result ? "success" : "error" }) } } }] });
                
                response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: apiHistory.current
                });
            }

            const rawText = response.text || "Mă scuzi, am întâmpinat o eroare.";
            const { text, options } = parseMessageContent(rawText);
            apiHistory.current.push({ role: 'model', parts: [{ text: rawText }] });
            setMessages(prev => [...prev, { role: 'model', text, options }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', text: "Momentan sunt suprasolicitat. Te rog să încerci peste câteva minute. 🥺" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const bottomPos = footerActive 
        ? (window.innerWidth < 768 ? '85px' : '80px') 
        : '24px';

    return (
        <>
            <div 
                ref={chatWindowRef}
                className={`chatbot-window fixed z-[9999] bg-white flex flex-col font-sans transition-all duration-300 shadow-2xl ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'} inset-0 md:inset-auto md:bottom-24 md:right-6 md:w-96 md:h-[450px] md:max-h-[70vh] md:rounded-2xl border border-gray-100`}
                style={{ overscrollBehavior: 'contain' }}
            >
                <div className="p-4 bg-brand-purple text-white flex justify-between items-center shrink-0 md:rounded-t-2xl">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg">🎤</div>
                        <span className="font-bold">VOICY</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded">✕</button>
                </div>
                <div 
                    className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4"
                    style={{ overscrollBehavior: 'contain' }}
                >
                    {messages.length === 0 && !isLoading && (
                        <div className="h-full flex flex-col items-center justify-center opacity-20 py-10">
                            <svg className="w-16 h-16 mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                        </div>
                    )}
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-bold shadow-sm ${msg.role === 'user' ? 'bg-brand-purple text-white' : 'bg-white text-gray-800'}`} dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                            {msg.options && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {msg.options.map((opt, oi) => (
                                        <button key={oi} onClick={() => handleSend(opt)} className="bg-white border border-brand-purple text-brand-purple text-[10px] font-black px-3 py-1.5 rounded-full hover:bg-brand-purple hover:text-white transition-all">{opt}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && <div className="text-xs text-gray-400 animate-pulse italic">Voicy scrie...</div>}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-3 bg-white border-t flex gap-2 md:rounded-b-2xl">
                    <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Scrie un mesaj..." className="flex-1 p-2 bg-gray-100 rounded-lg text-sm outline-none border focus:border-brand-purple" disabled={isLoading} />
                    <button onClick={() => handleSend()} disabled={isLoading} className="bg-brand-purple text-white p-2 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg></button>
                </div>
            </div>
            {floatingConfig.chatbotEnabled && !isOpen && (
                <button 
                    onClick={() => setIsOpen(true)} 
                    className={`fixed z-[95] right-6 w-14 h-14 md:w-16 md:h-16 bg-brand-purple text-white rounded-full shadow-[0_10px_30px_rgba(124,58,237,0.5)] flex items-center justify-center transition-all duration-500 transform ${showTrigger ? 'scale-100 translate-y-0' : 'scale-0 translate-y-10 pointer-events-none'} animate-pulse`}
                    style={{ bottom: bottomPos }}
                >
                    <div className="absolute inset-0 rounded-full animate-ping bg-brand-purple opacity-20"></div>
                    <svg className="w-7 h-7 md:w-8 md:h-8 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                </button>
            )}
        </>
    );
};

export default Chatbot;
