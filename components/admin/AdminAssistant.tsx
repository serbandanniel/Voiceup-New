import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, FunctionDeclaration, Type } from '@google/genai';
import { FormConfig, SectionConfig, RegistrationData } from '../../types';

// --- DEFINIRE UNELTE (TOOLS) ---

const updatePriceTool: FunctionDeclaration = {
    name: 'updatePrice',
    description: 'Modifică prețul pentru o categorie de înscriere. Folosește asta când userul cere schimbarea taxelor.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            category: { type: Type.STRING, enum: ['individual', 'grup'], description: 'Tipul de înscriere' },
            subType: { type: Type.STRING, description: 'Pentru individual: "1", "2", "3". Pentru grup: "small" (mic), "large" (mare).' },
            newPrice: { type: Type.NUMBER, description: 'Noul preț în RON' }
        },
        required: ['category', 'subType', 'newPrice']
    }
};

const updateSectionTitleTool: FunctionDeclaration = {
    name: 'updateSectionTitle',
    description: 'Modifică titlul unei secțiuni de pe site (ex: Hero, Juriu, Contact).',
    parameters: {
        type: Type.OBJECT,
        properties: {
            sectionId: { type: Type.STRING, description: 'ID-ul secțiunii (hero, about, jury, prizes, fees, rules, register, contact, partners, faq)' },
            newTitle: { type: Type.STRING, description: 'Noul titlu ce va fi afișat' }
        },
        required: ['sectionId', 'newTitle']
    }
};

const analyzeRegistrationsTool: FunctionDeclaration = {
    name: 'analyzeRegistrations',
    description: 'Returnează datele brute despre înscrieri pentru a răspunde la întrebări de analiză (statistici, liste, calcule).',
    parameters: {
        type: Type.OBJECT,
        properties: {
            filterType: { type: Type.STRING, enum: ['all', 'paid', 'pending'], description: 'Filtrează înscrierile' }
        }
    }
};

interface AdminAssistantProps {
    isEmbedded?: boolean; // If true, renders as a full panel instead of a modal
}

const AdminAssistant: React.FC<AdminAssistantProps> = ({ isEmbedded = false }) => {
    const [isOpen, setIsOpen] = useState(isEmbedded); 
    const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatHistory = useRef<any[]>([]);

    useEffect(() => {
        if (isEmbedded) setIsOpen(true);
    }, [isEmbedded]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ 
                role: 'model', 
                text: 'Salut! Sunt asistentul tău administrativ. Pot să modific prețuri, să schimb titluri pe site sau să analizez înscrierile. Cu ce te ajut?' 
            }]);
        }
        scrollToBottom();
    }, [isOpen, messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // --- FUNCTII DE EXECUTIE ---
    const executeUpdatePrice = (args: any) => {
        try {
            const stored = localStorage.getItem('formConfig');
            if (!stored) return "Eroare: Configurația nu a fost găsită.";
            const config: FormConfig = JSON.parse(stored);
            
            if (args.category === 'individual') {
                if (['1', '2', '3'].includes(args.subType)) {
                    config.costs.individual[args.subType as '1'|'2'|'3'] = args.newPrice;
                } else return "Eroare: Subtip invalid.";
            } else if (args.category === 'grup') {
                if (args.subType === 'small') config.costs.group.small = args.newPrice;
                else if (args.subType === 'large') config.costs.group.large = args.newPrice;
                else return "Eroare: Subtip invalid.";
            }
            localStorage.setItem('formConfig', JSON.stringify(config));
            window.dispatchEvent(new Event('storage'));
            return `Succes! Prețul a fost actualizat la ${args.newPrice} RON.`;
        } catch (e) { return "Eroare la salvare."; }
    };

    const executeUpdateSectionTitle = (args: any) => {
        try {
            const stored = localStorage.getItem('sectionsConfig');
            if (!stored) return "Eroare config.";
            let sections: SectionConfig[] = JSON.parse(stored);
            const index = sections.findIndex(s => s.id === args.sectionId);
            if (index === -1) return `Secțiunea '${args.sectionId}' nu există.`;
            sections[index].title = args.newTitle;
            localStorage.setItem('sectionsConfig', JSON.stringify(sections));
            window.dispatchEvent(new Event('storage'));
            return `Titlu actualizat: "${args.newTitle}".`;
        } catch (e) { return "Eroare actualizare."; }
    };

    const executeAnalyzeRegistrations = (args: any) => {
        try {
            const stored = localStorage.getItem('registrations');
            if (!stored) return "Nu există înscrieri.";
            const regs: RegistrationData[] = JSON.parse(stored);
            const filtered = args.filterType === 'all' || !args.filterType ? regs : regs.filter(r => r.status === args.filterType);
            const summary = filtered.map(r => ({
                nume: r.type === 'individual' ? r.name : r.groupName,
                tip: r.type,
                oras: r.type === 'individual' ? r.city : r.contactCity,
                cost: r.totalCost,
                status: r.status
            }));
            return JSON.stringify(summary);
        } catch (e) { return "Eroare citire date."; }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        const userMsg = { role: 'user' as const, text: input };
        setMessages(prev => [...prev, userMsg]);
        chatHistory.current.push({ role: 'user', parts: [{ text: input }] });
        setInput('');
        setIsLoading(true);

        try {
            // Fix: Initialization uses process.env.API_KEY directly as per guidelines
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Fix: Selecting gemini-3-pro-preview for complex reasoning/database management tasks
            let response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: chatHistory.current,
                config: {
                    tools: [{ functionDeclarations: [updatePriceTool, updateSectionTitleTool, analyzeRegistrationsTool] }],
                    systemInstruction: "You are the VoiceUP Admin Assistant. You manage the festival database."
                }
            });

            const functionCalls = response.functionCalls;
            if (functionCalls && functionCalls.length > 0) {
                for (const call of functionCalls) {
                    const functionCallPart = response.candidates?.[0]?.content?.parts?.find(p => p.functionCall?.name === call.name);
                    chatHistory.current.push({ role: 'model', parts: [functionCallPart || { functionCall: call }] });
                    let result = "";
                    if (call.name === 'updatePrice') result = executeUpdatePrice(call.args);
                    else if (call.name === 'updateSectionTitle') result = executeUpdateSectionTitle(call.args);
                    else if (call.name === 'analyzeRegistrations') result = executeAnalyzeRegistrations(call.args);
                    
                    chatHistory.current.push({ role: 'user', parts: [{ functionResponse: { name: call.name, response: { content: result } } }] });
                }
                
                // Fix: Calling generateContent with the updated multi-turn history
                response = await ai.models.generateContent({
                    model: 'gemini-3-pro-preview',
                    contents: chatHistory.current,
                    config: { tools: [{ functionDeclarations: [updatePriceTool, updateSectionTitleTool, analyzeRegistrationsTool] }] }
                });
            }
            
            // Fix: Directly accessing .text property instead of text() method
            const text = response.text || "Ok.";
            chatHistory.current.push({ role: 'model', parts: [{ text }] });
            setMessages(prev => [...prev, { role: 'model', text }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'model', text: "Eroare AI. Verifică cheia API." }]);
        } finally {
            setIsLoading(false);
        }
    };

    // --- RENDER ---

    if (isEmbedded) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col font-sans w-full animate-fade-in">
                <div className="bg-gradient-to-r from-brand-purple to-brand-pink p-4 flex justify-between items-center text-white rounded-t-xl">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🤖</span>
                        <div>
                            <h3 className="font-bold">Asistent Inteligent</h3>
                            <p className="text-[10px] text-violet-100">Configurare & Analiză</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm ${msg.role === 'user' ? 'bg-brand-purple text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>
                                <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                            </div>
                        </div>
                    ))}
                    {isLoading && <div className="text-xs text-gray-400 pl-2">Se procesează...</div>}
                    <div ref={messagesEndRef}></div>
                </div>
                <div className="p-4 bg-white border-t border-gray-100 flex gap-2 rounded-b-xl">
                    <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Întreabă ceva..." className="flex-1 p-3 bg-gray-100 rounded-lg text-sm outline-none border focus:border-brand-purple" disabled={isLoading} />
                    <button onClick={handleSend} disabled={isLoading} className="bg-brand-purple text-white px-4 rounded-lg hover:bg-opacity-90">Trimite</button>
                </div>
            </div>
        );
    }

    // Floating Mode
    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-10 right-10 z-[9999] bg-gradient-to-r from-brand-purple to-brand-pink text-white px-5 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center gap-3 border-2 border-white ring-4 ring-brand-purple/20 animate-pulse"
                style={{boxShadow: '0 10px 30px -5px rgba(124, 58, 237, 0.6)'}}
            >
                <span className="text-2xl">🤖</span>
                <span className="font-bold text-sm hidden md:inline">Asistent Admin</span>
            </button>

            {isOpen && (
                <div className="fixed bottom-28 right-10 w-[90%] md:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-[9999] border-2 border-brand-purple overflow-hidden font-sans animate-fade-in">
                    <div className="bg-brand-purple p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🤖</span>
                            <h3 className="font-bold">Admin AI</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">✕</button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm ${msg.role === 'user' ? 'bg-brand-purple text-white' : 'bg-white border text-gray-800'}`}>
                                    <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef}></div>
                    </div>
                    <div className="p-3 bg-white border-t flex gap-2">
                        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Mesaj..." className="flex-1 p-2 bg-gray-100 rounded text-sm outline-none" />
                        <button onClick={handleSend} className="text-brand-purple font-bold">Trimite</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminAssistant;