
import { StaticPage } from '../interfaces';

export const DEFAULT_STATIC_PAGES_CONFIG: StaticPage[] = [
    {
        id: 'terms',
        title: 'Termeni și Condiții & Politica GDPR',
        content: `
            <h2>1. Introducere</h2>
            <p>Utilizarea site-ului VoiceUP Festival și înscrierea la concurs implică acceptarea necondiționată a acestor Termeni și Condiții. Organizatorul evenimentului este Art Show Media Entertainment.</p>
            
            <h2>2. Prelucrarea Datelor cu Caracter Personal (GDPR)</h2>
            <p>Conform Regulamentului (UE) 2016/679 (GDPR), organizatorii VoiceUP Festival au obligația de a administra în condiții de siguranță și numai pentru scopurile specificate, datele personale pe care ni le furnizați.</p>
            <ul>
                <li><strong>Scopul colectării:</strong> Validarea înscrierii, comunicarea detaliilor organizatorice, realizarea diplomelor, anunțarea premiilor.</li>
                <li><strong>Date colectate:</strong> Nume, prenume, vârstă, telefon, email, școala de proveniență, imagine (foto/video).</li>
                <li><strong>Durata stocării:</strong> Datele sunt păstrate pe durata desfășurării evenimentului și ulterior pentru arhiva internă, conform legislației fiscale.</li>
                <li><strong>Drepturile dvs:</strong> Aveți dreptul de acces, intervenție, ștergere ("dreptul de a fi uitat") sau opoziție la prelucrarea datelor. Pentru exercitarea acestor drepturi, ne puteți contacta la contact@voiceup-festival.ro.</li>
            </ul>

            <h2>3. Drepturi de Imagine</h2>
            <p>Prin înscrierea la festival, participanții (sau tutorii legali) își dau acordul ca organizatorii să utilizeze imagini foto și video captate în timpul evenimentului. Acestea pot fi folosite pentru promovarea festivalului pe rețelele sociale, site-ul web, parteneri media sau alte materiale publicitare, fără nicio pretenție financiară din partea participantului.</p>

            <h2>4. Plăți și Restituiri</h2>
            <p>Taxa de înscriere trebuie achitată integral înainte de data limită specificată. În cazul neprezentării la concurs din motive imputabile participantului, taxa de înscriere <strong>nu se returnează</strong>. Returnarea taxei se face doar în cazul anulării evenimentului de către organizator.</p>

            <h2>5. Dispoziții Finale</h2>
            <p>Organizatorul își rezervă dreptul de a modifica programul sau locația în cazuri de forță majoră, cu notificarea prealabilă a participanților.</p>
        `
    },
    {
        id: 'rules',
        title: 'Regulament Oficial',
        content: `
            <h2>Informații Esențiale</h2>
            <ul>
                <li><strong>Data:</strong> 13 Decembrie 2025</li>
                <li><strong>Locație:</strong> Cafeneaua Actorilor, București (Parcul Tineretului)</li>
                <li><strong>Deadline Înscrieri:</strong> 6 Decembrie 2025</li>
            </ul>

            <h2>1. Scopul Festivalului</h2>
            <p>Festivalul VoiceUP își propune să contribuie la descoperirea și promovarea tinerilor interpreți de muzică, la stimularea interesului publicului pentru creațiile autentice și la valorificarea, conservarea și popularizarea valorilor culturale și spirituale.</p>
            <p><strong>Organizatori:</strong> Asociația pentru Integrare Culturală Europeană, Art Show Media Entertainment, OMG Music.</p>

            <h2>2. Secțiuni și Repertoriu</h2>
            <h3>1. Muzică Ușoară Românească</h3>
            <p>Categorii: 5-7, 8-10, 11-13, 14-16, 17-18+ ani. Se va interpreta o piesă de muzică ușoară românească cu negativ.</p>
            
            <h3>2. Muzică Ușoară Internațională</h3>
            <p>Categorii: 5-7, 8-10, 11-13, 14-16, 17-18+ ani. Se va interpreta o piesă de muzică ușoară cu negativ.</p>
            
            <h3>3. Muzică Populară & Colinde</h3>
            <p>Piesă cu negativ din folclorul autentic sau repertoriul de colinde.</p>
            
            <h3>4. Grupuri</h3>
            <p>Mic (2-5 pers) / Mare (peste 5 pers). Piesă sau colaj.</p>

            <h2>3. Înscriere și Documente</h2>
            <p><strong>Data limită: 6 Decembrie 2025</strong></p>
            <ul>
                <li>Formularul de înscriere online completat integral.</li>
                <li>Negativele pieselor (încărcate în formular sau trimise ulterior).</li>
                <li>Dovada achitării donației de participare.</li>
                <li>Copie Certificat de Naștere / CI.</li>
            </ul>

            <h2>4. Taxe de Participare</h2>
            <ul>
                <li>Individual 1 piesă: <strong>300 RON</strong></li>
                <li>Individual 2 piese: <strong>500 RON</strong></li>
                <li>Individual 3 piese: <strong>700 RON</strong></li>
                <li>Grup Mic: <strong>200 RON</strong> / persoană</li>
                <li>Grup Mare: <strong>100 RON</strong> / persoană</li>
            </ul>
            <p><em>* Înscrierea se consideră finalizată numai după achitarea taxei.</em></p>

            <h2>5. Juriul și Premii</h2>
            <p>Juriul este alcătuit din artiști, muzicieni și profesori. Deciziile juriului sunt definitive.</p>
            <p><strong>Premii:</strong> Trofeul Concursului (înregistrare + videoclip), Trofee Categorie, Premii I, II, III, Premii Speciale.</p>
        `
    },
    {
        id: 'cookies',
        title: 'Politica de Cookies',
        content: `
            <h2>Ce sunt cookie-urile?</h2>
            <p>Cookie-urile sunt fișiere mici de text stocate pe dispozitivul dumneavoastră atunci când accesați site-ul nostru.</p>
            
            <h2>Cum folosim cookie-urile?</h2>
            <p>Folosim cookie-uri pentru a îmbunătăți experiența de navigare, pentru a analiza traficul și pentru a reține preferințele utilizatorilor (ex: pop-up promoțional văzut).</p>
            
            <h2>Tipuri de cookie-uri folosite:</h2>
            <ul>
                <li><strong>Esențiale:</strong> Necesare pentru funcționarea site-ului.</li>
                <li><strong>Analitice:</strong> Google Analytics, Facebook Pixel (pentru statistici anonime).</li>
            </ul>
        `
    }
];
