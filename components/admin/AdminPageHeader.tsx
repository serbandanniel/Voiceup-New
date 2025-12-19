
import React from 'react';

interface AdminPageHeaderProps {
    title: string;
    description: string;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    saveStatus?: string;
    children?: React.ReactNode; // For extra buttons like "Add New" or "Reset"
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
    title, description, isEditing, onEdit, onSave, onCancel, saveStatus, children
}) => {
    return (
        <div className="flex flex-wrap justify-between items-center mb-8 pb-4 border-b border-gray-100 gap-4">
            <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    {title}
                </h2>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <div className="flex items-center gap-4">
                {saveStatus && (
                    <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm animate-pulse">
                        {saveStatus}
                    </span>
                )}
                
                {/* Extra buttons (e.g. Add New) usually render when NOT editing, or always depending on context */}
                {children}

                {!isEditing ? (
                    <button 
                        onClick={onEdit} 
                        className="bg-brand-purple text-white px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 shadow-lg shadow-brand-purple/20 transition-all"
                    >
                        Editează
                    </button>
                ) : (
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onCancel} 
                            className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                        >
                            Anulează
                        </button>
                        <button 
                            onClick={onSave} 
                            className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all"
                        >
                            Salvează
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPageHeader;
