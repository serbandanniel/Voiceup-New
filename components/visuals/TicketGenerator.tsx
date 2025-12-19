
import React, { useRef, useEffect, useState } from 'react';
import { RegistrationData } from '../../types';
import { toast } from 'sonner';

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
            <circle cx="45" cy="45" r="45" style={{ fill: 'rgb(42,181,64)' }} />
            <path d="M 16.138 44.738 c -0.002 5.106 1.332 10.091 3.869 14.485 l -4.112 15.013 l 15.365 -4.029 c 4.233 2.309 8.999 3.525 13.85 3.527 h 0.012 c 15.973 0 28.976 -12.999 28.983 -28.974 c 0.003 -7.742 -3.01 -15.022 -8.481 -20.498 c -5.472 -5.476 -12.749 -8.494 -20.502 -8.497 C 29.146 15.765 16.145 28.762 16.138 44.738 M 25.288 58.466 l -0.574 -0.911 c -2.412 -3.834 -3.685 -8.266 -3.683 -12.816 c 0.005 -13.278 10.811 -24.081 24.099 -24.081 c 6.435 0.003 12.482 2.511 17.031 7.062 c 4.548 4.552 7.051 10.603 7.05 17.037 C 69.205 58.036 58.399 68.84 45.121 68.84 h -0.009 c -4.323 -0.003 -8.563 -1.163 -12.261 -3.357 l -0.88 -0.522 l -9.118 2.391 L 25.288 58.466 z M 45.122 73.734 L 45.122 73.734 L 45.122 73.734 C 45.122 73.734 45.121 73.734 45.122 73.734" style={{ fill: 'rgb(255,255,255)' }} strokeLinecap="round" />
            <path d="M 37.878 32.624 c -0.543 -1.206 -1.113 -1.23 -1.63 -1.251 c -0.422 -0.018 -0.905 -0.017 -1.388 -0.017 c -0.483 0 -1.268 0.181 -1.931 0.906 c -0.664 0.725 -2.535 2.477 -2.535 6.039 c 0 3.563 2.595 7.006 2.957 7.49 c 0.362 0.483 5.01 8.028 12.37 10.931 c 6.118 2.412 7.362 1.933 8.69 1.812 c 1.328 -0.121 4.285 -1.751 4.888 -3.442 c 0.604 -1.691 0.604 -3.14 0.423 -3.443 c -0.181 -0.302 -0.664 -0.483 -1.388 -0.845 c -0.724 -0.362 -4.285 -2.114 -4.948 -2.356 c -0.664 -0.241 -1.147 -0.362 -1.63 0.363 c -0.483 0.724 -1.87 2.355 -2.292 2.838 c -0.422 0.484 -0.845 0.544 -1.569 0.182 c -0.724 -0.363 -3.057 -1.127 -5.824 -3.594 c -2.153 -1.92 -3.606 -4.29 -4.029 -5.015 c -0.422 -0.724 -0.045 -1.116 0.318 -1.477 c 0.325 -0.324 0.724 -0.846 1.087 -1.268 c 0.361 -0.423 0.482 -0.725 0.723 -1.208 c 0.242 -0.483 0.121 -0.906 -0.06 -1.269 C 39.929 37.637 38.522 34.056 37.878 32.624" style={{ fill: 'rgb(255,255,255)' }} strokeLinecap="round" />
        </g>
    </svg>
);

interface TicketGeneratorProps {
    data: RegistrationData;
}

const TicketGenerator: React.FC<TicketGeneratorProps> = ({ data }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [isSharing, setIsSharing] = useState(false);

    const participantName = data.type === 'individual' ? data.name : data.groupName;
    const category = data.type === 'individual' ? data.ageCategoryIndividual : data.ageCategoryGroup;
    const role = data.type === 'individual' ? 'SOLIST' : 'GRUP';
    const eventDate = "13 DECEMBRIE 2025";
    const logoUrl = "https://i.postimg.cc/KztjG9sK/logo-v2.png"; // VoiceUP Logo
    const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://www.voiceup-festival.ro&color=000000&bgcolor=ffffff&margin=2";

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = 600;
        const height = 1000;
        canvas.width = width;
        canvas.height = height;

        const loadImage = (src: string): Promise<HTMLImageElement> => {
            return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = src;
                img.onload = () => resolve(img);
                img.onerror = () => resolve(new Image());
            });
        };

        const drawTicket = (ctx: CanvasRenderingContext2D, w: number, h: number, logoImg: HTMLImageElement | null, qrImg: HTMLImageElement | null) => {
            // Gradient Background
            const grd = ctx.createLinearGradient(0, 0, w, h);
            grd.addColorStop(0, '#2E1065'); 
            grd.addColorStop(0.5, '#7C3AED');
            grd.addColorStop(1, '#F472B6');
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, w, h);

            // Texture
            ctx.fillStyle = 'rgba(255,255,255,0.05)';
            for(let i=0; i<500; i++) {
                ctx.beginPath();
                ctx.arc(Math.random()*w, Math.random()*h, Math.random()*2, 0, Math.PI*2);
                ctx.fill();
            }

            // Card Container
            const margin = 40;
            const boxTop = 150;
            const boxHeight = h - 2 * boxTop;
            
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
            ctx.shadowBlur = 30;
            ctx.shadowOffsetY = 15;
            
            ctx.beginPath();
            ctx.roundRect(margin, boxTop, w - 2 * margin, boxHeight, 30);
            
            ctx.save();
            ctx.clip();

            ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
            ctx.fillRect(0, 0, w, h);

            // Decor
            const innerGrad1 = ctx.createRadialGradient(margin, boxTop, 0, margin, boxTop, 250);
            innerGrad1.addColorStop(0, 'rgba(251, 191, 36, 0.2)');
            innerGrad1.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = innerGrad1;
            ctx.beginPath();
            ctx.arc(margin, boxTop, 250, 0, Math.PI*2);
            ctx.fill();

            const innerGrad2 = ctx.createRadialGradient(w - margin, boxTop + boxHeight, 0, w - margin, boxTop + boxHeight, 300);
            innerGrad2.addColorStop(0, 'rgba(124, 58, 237, 0.15)');
            innerGrad2.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = innerGrad2;
            ctx.beginPath();
            ctx.arc(w - margin, boxTop + boxHeight, 300, 0, Math.PI*2);
            ctx.fill();

            ctx.restore();
            
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;

            // Content
            ctx.textAlign = "center";

            // Logo
            if (logoImg && logoImg.width > 0) {
                const maxLogoW = 160;
                const maxLogoH = 100;
                let dw = maxLogoW;
                let dh = dw * (logoImg.height / logoImg.width);
                if (dh > maxLogoH) {
                    dh = maxLogoH;
                    dw = dh * (logoImg.width / logoImg.height);
                }
                ctx.drawImage(logoImg, w / 2 - dw / 2, boxTop + 40, dw, dh);
            } else {
                ctx.fillStyle = "#2E1065";
                ctx.font = "900 40px 'Arial Black', sans-serif";
                ctx.fillText("VoiceUP", w / 2, boxTop + 90);
            }
            
            ctx.fillStyle = "#F472B6";
            ctx.font = "bold 18px Arial, sans-serif";
            ctx.fillText("FESTIVAL 2025", w / 2, boxTop + 160);

            // Divider
            ctx.strokeStyle = "#E5E7EB";
            ctx.lineWidth = 2;
            ctx.setLineDash([15, 10]);
            ctx.beginPath();
            ctx.moveTo(margin + 40, boxTop + 185);
            ctx.lineTo(w - margin - 40, boxTop + 185);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = "#7C3AED";
            ctx.font = "bold 22px Arial, sans-serif";
            ctx.fillText("OFFICIAL ARTIST PASS", w / 2, boxTop + 230);

            // Name
            ctx.fillStyle = "#111827";
            let fontSize = 45;
            ctx.font = `900 ${fontSize}px Arial, sans-serif`;
            while (ctx.measureText(participantName || '').width > (w - 2 * margin - 40) && fontSize > 20) {
                fontSize -= 5;
                ctx.font = `900 ${fontSize}px Arial, sans-serif`;
            }
            ctx.fillText((participantName || '').toUpperCase(), w / 2, boxTop + 290);

            ctx.fillStyle = "#6B7280";
            ctx.font = "bold 20px Arial, sans-serif";
            ctx.fillText(category || '', w / 2, boxTop + 335);

            // Pill
            ctx.fillStyle = "#FBBF24"; 
            ctx.beginPath();
            ctx.roundRect(w/2 - 80, boxTop + 370, 160, 46, 23);
            ctx.fill();
            ctx.fillStyle = "#2E1065";
            ctx.font = "bold 22px Arial, sans-serif";
            ctx.fillText(role, w / 2, boxTop + 402);

            ctx.fillStyle = "#2E1065";
            ctx.font = "bold 16px Arial, sans-serif";
            ctx.fillText("DATA EVENIMENTULUI:", w / 2, boxTop + 460);
            ctx.fillStyle = "#D946EF";
            ctx.font = "900 24px Arial, sans-serif";
            ctx.fillText(eventDate, w / 2, boxTop + 490);

            // QR
            const qrSize = 130;
            const qrX = w / 2 - qrSize / 2;
            const qrY = boxTop + 520;
            
            if (qrImg && qrImg.width > 0) {
                ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
            }

            // Badge "HAI SI TU"
            const badgeY = qrY + qrSize - 15;
            const badgeW = 140;
            const badgeH = 36;
            
            ctx.shadowColor = "rgba(0,0,0,0.3)";
            ctx.shadowBlur = 10;
            ctx.shadowOffsetY = 5;
            
            const badgeGrad = ctx.createLinearGradient(w/2 - badgeW/2, badgeY, w/2 + badgeW/2, badgeY + badgeH);
            badgeGrad.addColorStop(0, '#7C3AED');
            badgeGrad.addColorStop(1, '#F472B6');
            ctx.fillStyle = badgeGrad;
            
            ctx.beginPath();
            ctx.roundRect(w/2 - badgeW/2, badgeY + 25, badgeW, badgeH, 18);
            ctx.fill();
            
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;

            ctx.fillStyle = "#FFFFFF";
            ctx.font = "900 18px Arial, sans-serif";
            ctx.fillText("HAI ȘI TU!", w / 2, badgeY + 25 + 24);

            setDownloadUrl(canvas.toDataURL("image/png"));
        };

        Promise.all([loadImage(logoUrl), loadImage(qrUrl)])
            .then(([logo, qr]) => drawTicket(ctx, width, height, logo, qr))
            .catch(() => drawTicket(ctx, width, height, null, null));

    }, [data]);

    const handleShare = async () => {
        if (!downloadUrl) return;
        setIsSharing(true);

        try {
            const response = await fetch(downloadUrl);
            const blob = await response.blob();
            const file = new File([blob], `VoiceUP_Pass.png`, { type: 'image/png' });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'VoiceUP Pass',
                    text: `M-am înscris la VoiceUP Festival 2025! Ne vedem pe scenă pe 13 Decembrie! 🎤✨ @VoiceUpFestival #VoiceUP`,
                    files: [file],
                });
                toast.success("Meniu partajare deschis!");
            } else {
                // Fallback for desktop or non-supported browsers
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `VoiceUP_Pass.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success("Imagine descărcată! O poți încărca manual.");
            }
        } catch (error) {
            console.error("Error sharing:", error);
            toast.error("Nu am putut partaja automat. Imaginea se descarcă...");
            
            // Emergency download if share fails
            const link = document.createElement('a');
            link.href = downloadUrl || '#';
            link.download = `VoiceUP_Pass.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-[320px] mx-auto">
            {/* The Ticket Canvas */}
            <div className="relative w-full shadow-2xl rounded-3xl overflow-hidden transform transition-transform hover:scale-[1.02] border-4 border-white/20">
                <canvas 
                    ref={canvasRef} 
                    style={{ width: '100%', height: 'auto' }}
                />
            </div>
            
            {/* Action Area - Compact Side-by-Side Buttons */}
            <div className="grid grid-cols-2 gap-2 w-full mt-4">
                <button 
                    onClick={handleShare}
                    disabled={!downloadUrl || isSharing}
                    className="flex flex-col items-center justify-center bg-[#25D366] text-white p-3 rounded-xl shadow-lg hover:bg-opacity-90 active:scale-95 transition-all"
                >
                    <WhatsAppIcon className="w-6 h-6 mb-1" />
                    <span className="text-xs font-bold uppercase">WhatsApp</span>
                </button>

                <button 
                    onClick={handleShare}
                    disabled={!downloadUrl || isSharing}
                    className="flex flex-col items-center justify-center bg-[#1877F2] text-white p-3 rounded-xl shadow-lg hover:bg-opacity-90 active:scale-95 transition-all"
                >
                    <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    <span className="text-xs font-bold uppercase">Facebook</span>
                </button>
            </div>

            {/* Helper Message */}
            <div 
                className="mt-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-3 w-full animate-pulse"
            >
                <p className="text-white text-xs text-center font-bold leading-tight">
                    📸 Postează la <span className="text-brand-yellow">Story</span> cu tag <span className="text-brand-yellow">@VoiceUpFestival</span>!<br/>
                    <span className="text-[10px] opacity-80 font-normal">Apasă butonul pentru a deschide meniul de partajare.</span>
                </p>
            </div>
            
            <a 
                href={downloadUrl || '#'} 
                download={`VoiceUP_Pass_${participantName?.replace(/\s+/g, '_')}.png`}
                className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-2 hover:text-white transition-colors underline"
            >
                Descarcă fișierul PNG
            </a>
        </div>
    );
};

export default TicketGenerator;
