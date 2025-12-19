
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { StaticPage } from '../../types';
import { DEFAULT_STATIC_PAGES_CONFIG } from '../../config';
import { useNotification, AdminPageHeader } from '../../components/admin';

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }]
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'color', 'background', 'align'
];

const StaticPagesConfig: React.FC = () => {
    const [pages, setPages] = useState<StaticPage[]>(DEFAULT_STATIC_PAGES_CONFIG);
    const [selectedPageId, setSelectedPageId] = useState<string>('terms');
    const [editorContent, setEditorContent] = useState('');
    const { showNotification } = useNotification();

    useEffect(() => {
        const stored = localStorage.getItem('staticPagesConfig');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Merge with default to ensure we have all pages even if new ones added to code
                const merged = DEFAULT_STATIC_PAGES_CONFIG.map(def => {
                    const found = parsed.find((p: StaticPage) => p.id === def.id);
                    return found ? found : def;
                });
                setPages(merged);
            } catch (e) {
                console.error(e);
                setPages(DEFAULT_STATIC_PAGES_CONFIG);
            }
        }
    }, []);

    // Update editor when selection changes
    useEffect(() => {
        const page = pages.find(p => p.id === selectedPageId);
        if (page) {
            setEditorContent(page.content);
        }
    }, [selectedPageId, pages]);

    const handleSave = () => {
        const updatedPages = pages.map(p => 
            p.id === selectedPageId ? { ...p, content: editorContent } : p
        );
        setPages(updatedPages);
        localStorage.setItem('staticPagesConfig', JSON.stringify(updatedPages));
        showNotification('Pagina a fost salvată cu succes!', 'success');
    };

    const handleReset = () => {
        if (window.confirm('Ești sigur? Vei reveni la conținutul implicit pentru această pagină.')) {
            const defaultPage = DEFAULT_STATIC_PAGES_CONFIG.find(p => p.id === selectedPageId);
            if (defaultPage) {
                setEditorContent(defaultPage.content);
            }
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in h-[calc(100vh-140px)] flex flex-col">
            <AdminPageHeader 
                title="Pagini Fixe (Termeni, Regulament)"
                description="Editează conținutul paginilor informative."
                isEditing={true} // Always editing enabled for this view
                onEdit={() => {}}
                onSave={handleSave}
                onCancel={() => {}} // No cancel action
            >
                <button onClick={handleReset} className="text-gray-500 hover:text-red-500 text-sm font-bold px-3 py-2 transition-colors border border-transparent hover:border-red-200 rounded-lg">
                    Resetează la Default
                </button>
            </AdminPageHeader>

            <div className="flex gap-2 mb-4 overflow-x-auto flex-shrink-0 pb-2">
                {pages.map(page => (
                    <button
                        key={page.id}
                        onClick={() => setSelectedPageId(page.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${selectedPageId === page.id ? 'bg-brand-purple text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {page.title}
                    </button>
                ))}
            </div>

            <div className="flex-grow flex flex-col min-h-0">
                <ReactQuill 
                    theme="snow"
                    value={editorContent}
                    onChange={setEditorContent}
                    modules={modules}
                    formats={formats}
                    className="h-full flex flex-col"
                />
            </div>
            
            <style>{`
                .quill { display: flex; flex-direction: column; overflow: hidden; }
                .ql-container { flex-grow: 1; overflow-y: auto; font-family: 'Nunito', sans-serif; font-size: 16px; }
                .ql-editor { min-height: 100%; color: #374151; }
                .ql-editor p { margin-bottom: 1em; }
                .ql-toolbar { border-radius: 8px 8px 0 0; background-color: #f9fafb; border-color: #e5e7eb !important; }
                .ql-container { border-radius: 0 0 8px 8px; border-color: #e5e7eb !important; }
            `}</style>
        </div>
    );
};

export default StaticPagesConfig;
