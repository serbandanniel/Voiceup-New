
import { MobilPayConfig, SmartBillConfig, EmailConfig } from '../interfaces';

export const DEFAULT_MOBILPAY_CONFIG: MobilPayConfig = { 
    signature: '', 
    testMode: false, 
    autoRedirect: true,
    integrationMode: 'links', 
    serverEndpoint: '/payment.php'
};

export const DEFAULT_SMARTBILL_CONFIG: SmartBillConfig = { 
    enabled: false,
    cif: '', 
    username: '', 
    token: '', 
    seriesName: 'FEST', 
    defaultVatPercent: 0, 
    isVatPayer: false,
    serverEndpoint: '/smartbill.php'
};

export const DEFAULT_EMAIL_CONFIG: EmailConfig = {
    serverEndpoint: '/send-email.php',
    subject: "Confirmare Înscriere VoiceUP Festival - {nume}",
    body: `<h1 style="color: #2E1065;">Salut, {nume}!</h1>
<p style="color: #374151;">Îți mulțumim din suflet pentru înscrierea la <strong>VoiceUP Festival</strong>.</p>

<div style="background-color: #f3f4f6; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e5e7eb;">
    <h3 style="color: #7C3AED; margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Detaliile Înscrierii:</h3>
    <ul style="list-style: none; padding: 0; color: #1f2937; line-height: 1.6;">
        <li><strong>Participant:</strong> {nume}</li>
        <li><strong>Tip:</strong> {tip}</li>
        <li><strong>Categorie Vârstă:</strong> {categorie}</li>
        <li><strong>Vârstă Exactă:</strong> {varsta_exacta}</li>
        <li><strong>Repertoriu:</strong> {piese}</li>
    </ul>
    
    <h4 style="color: #7C3AED; margin-top: 15px; margin-bottom: 5px;">Date Facturare & Contact:</h4>
    <ul style="list-style: none; padding: 0; color: #1f2937; line-height: 1.6;">
        <li><strong>Persoană Contact:</strong> {nume_facturare}</li>
        <li><strong>Telefon:</strong> {telefon}</li>
        <li><strong>Email:</strong> {email_contact}</li>
        <li><strong>Adresă:</strong> {adresa_facturare}</li>
    </ul>

    <hr style="border: 0; border-top: 1px dashed #bbb; margin: 15px 0;">
    <p style="font-size: 18px;"><strong>Total de plată:</strong> <span style="color: #2E1065; font-weight: bold;">{cost} RON</span></p>
</div>

{continut_dinamic_plata}

<hr style="border: 0; border-top: 1px solid #ddd; margin: 25px 0;">

<div style="text-align: center;">
    <h3 style="color: #2E1065;">Te așteptăm cu drag!</h3>
    <p style="font-size: 16px; color: #374151;"><strong>📅 {data_eveniment}</strong></p>
    <p style="font-size: 16px; color: #374151;"><strong>📍 {locatie}</strong><br/><span style="font-size: 14px; color: #666;">{adresa}</span></p>
    
    <div style="margin-top: 20px;">
        <a href="{link_waze}" style="background-color: #33ccff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 20px; margin: 0 5px; font-weight: bold;">Navighează cu Waze</a>
        <a href="{link_maps}" style="background-color: #4285F4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 20px; margin: 0 5px; font-weight: bold;">Google Maps</a>
    </div>
</div>`,
    reminderSubject: "⏰ Reminder: Ne vedem MÂINE la VoiceUP Festival!",
    reminderBody: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
    <div style="background-color: #7C3AED; padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">Pregătește-te de Spectacol! 🎤</h1>
    </div>
    <div style="padding: 30px; color: #374151; line-height: 1.6;">
        <p>Salut, <strong>{nume}</strong>!</p>
        <p>Suntem extrem de entuziasmați să te anunțăm că mâine, <strong>{data_eveniment}</strong>, este ziua în care vei urca pe scena VoiceUP Festival!</p>
        
        <div style="background-color: #fdf2f8; border-left: 4px solid #F472B6; padding: 20px; margin: 25px 0;">
            <p style="margin-top: 0;"><strong>📍 Locație:</strong> {locatie}</p>
            <p><strong>🏠 Adresă:</strong> {adresa}</p>
            <p><strong>⏰ Ora la care trebuie să ajungi:</strong> {ora_sosire} (recomandat cu 60 min înainte de program)</p>
        </div>

        <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0;">
            <p style="margin-top: 0;"><strong>🚗 Informații Parcare:</strong></p>
            <p>{locatie_parcare}</p>
            <a href="{link_parcare_maps}" style="color: #2563eb; font-weight: bold; text-decoration: underline;">Deschide Locație Parcare</a>
        </div>

        <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; margin: 25px 0;">
            <p style="margin-top: 0;"><strong>📞 Ai nevoie de ajutor?</strong></p>
            <p>Ne poți contacta oricând la numărul de telefon: <a href="tel:{telefon_contact}" style="color: #166534; font-weight: bold; text-decoration: none;">{telefon_contact}</a></p>
        </div>

        <p style="text-align: center; font-weight: bold; font-size: 18px; color: #2E1065;">Mult succes pe scenă! Let's VoiceUP Together!</p>
    </div>
    <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
        Echipa VoiceUP Festival & Art Show Media
    </div>
</div>`
};
