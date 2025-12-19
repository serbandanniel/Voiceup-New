
import React, { useState, useRef, useEffect } from 'react';
import Picker from 'emoji-picker-react';

interface EmojiInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    type?: 'input' | 'textarea';
    className?: string;
    rows?: number;
}

const EmojiInput: React.FC<EmojiInputProps> = ({ value, onChange, placeholder, disabled, type = 'input', className, rows = 3 }) => {
    const [showPicker, setShowPicker] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const onEmojiClick = (emojiObject: any) => {
        onChange(value + emojiObject.emoji);
        // Don't close picker immediately to allow multiple emojis
    };

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const inputClass = className || "w-full p-2 border rounded-lg bg-white disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple outline-none text-gray-900 pr-10";

    return (
        <div className="relative" ref={containerRef}>
            {type === 'textarea' ? (
                <textarea 
                    rows={rows}
                    value={value}
                    disabled={disabled}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={inputClass}
                />
            ) : (
                <input 
                    type="text"
                    value={value}
                    disabled={disabled}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={inputClass}
                />
            )}
            
            {/* Emoji Button */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => setShowPicker(!showPicker)}
                className={`absolute right-2 text-xl transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${type === 'textarea' ? 'top-2' : 'top-1/2 -translate-y-1/2'}`}
                title="Adaugă Emoji"
            >
                😀
            </button>

            {/* Picker Popup */}
            {showPicker && (
                <div className="absolute right-0 z-[100] top-full mt-2 shadow-2xl rounded-xl overflow-hidden animate-fade-in origin-top-right">
                    <Picker 
                        onEmojiClick={onEmojiClick}
                        width={300}
                        height={400}
                        previewConfig={{ showPreview: false }}
                        searchDisabled={false}
                    />
                </div>
            )}
        </div>
    );
};

export default EmojiInput;
