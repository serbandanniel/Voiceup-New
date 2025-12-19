import { LocationConfig, Partner, Juror, PrizesConfig, FAQ } from '../interfaces';

export const DEFAULT_LOCATION_CONFIG: LocationConfig = {
  locationName: 'Cafeneaua Actorilor',
  address: 'Parcul Tineretului, București',
  startDate: 'Sâmbătă, 13 Decembrie 2025, ora 10:00',
  googleMapsLink: "https://www.google.com/maps/place/Actors'+Summer+Caf%C3%A9/@44.407773,26.110219,868m/data=!3m1!1e3!4m9!1m2!2m1!1s*2A!3m5!1s0x40b1feff864c9efd:0x72be314b8c480516!8m2!3d44.4080836!4d26.1103256!16s%2Fg%2F1vnrjj5r?hl=en&entry=ttu",
  wazeLink: 'https://waze.com/ul?q=Cafeneaua%20Actorilor%20Bucuresti&navigate=yes',
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2849.616711562828!2d26.1103256!3d44.4080836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1feff864c9efd%3A0x72be314b8c480516!2sActors'%20Summer%20Caf%C3%A9!5e0!3m2!1sen!2sro!4v1710000000000!5m2!1sen!2sro",
  parkingInfo: 'Parcarea se poate face în parcarea de la Palatul Copiilor.',
  parkingLink: 'https://maps.app.goo.gl/UHZQfxq3sNPZCsZV9'
};

export const DEFAULT_PARTNERS: Partner[] = [
    {id: '1', img: "https://i.postimg.cc/s2bs1vVg/cropped-celebrusiparinte-sitelogo.png", link: "https://celebrusiparinte.ro/"},
    {id: '2', img: "https://i.postimg.cc/Y26MqrT9/erouptparinte.png", link: "https://www.youtube.com/playlist?list=PLLwENw8axmAKQqzGtozeGvyBZyR-JkfyP"},
    {id: '3', img: "https://i.postimg.cc/CM4wZm6z/cmtb.png", link: "https://ctmb.eu/"},
    {id: '4', img: "https://i.postimg.cc/mrFbt4Kw/pmb.jpg", link: "https://www.pmb.ro/"},
    {id: '5', img: "https://i.postimg.cc/j2ZQcyLF/mc-music.png", link: "https://www.mcmusic.ro/"},
    {id: '6', img: "https://i.postimg.cc/Q9V5wSCP/1.png", link: "https://www.cafeneaua-actorilor.com/"},
    {id: '7', img: "https://i.postimg.cc/wy3JZF3Y/2.png", link: "https://www.instagram.com/omgmusicro/"},
    {id: '8', img: "https://i.postimg.cc/cg6Y2T6N/3.png", link: "https://academiametropolitanadearte.ro/"},
    {id: '9', img: "https://i.postimg.cc/7Gb7dXb4/5.png", link: "https://www.logo-mag.ro/"},
    {id: '10', img: "https://i.postimg.cc/dZBW64fM/Sandori.png", link: "https://www.sandori.ro/"},
    {id: '11', img: "https://i.postimg.cc/3w623VHg/arcaluinoe.png", link: "https://arcaluinoe.eu/"},
];

export const DEFAULT_JURORS: Juror[] = [
    { id: 'viorica', name: 'Viorica Barbu Iurașcu', role: 'Președintele Juriului', subRole: 'Lector Universitar Doctor', quote: '"Căutăm excelența vocală și emoția autentică. Mult succes tuturor tinerilor artiști!"', bio: 'Este absolventă a Universității de Vest din Timișoara, profil Muzică, specializarea Pedagogie Muzicală și doctor in muzică, absolvent cu „Magna cum laude” al Universității Naționale de Muzică din București. Este director Artistic ZECE Music, președinte AICE, profesor universitar dr. (canto avansat) AMA – Academia Metropolitană de Arte, Director Artistic Art Show Media Entertainment.', img: 'https://i.postimg.cc/CxhLWFSq/Untitled-design-8.png', isPresident: true, isSurprise: false },
    { id: 'vasia', name: 'Vasia Oprea', role: 'Interpret Vocal', subRole: '', quote: '"Abia aștept să vă aud vocile! Fiecare emoție pe care o transmiteți prin muzică este unică. Fiți voi inșivă!"', bio: 'Câștigătoare a multiple premii naționale și internaționale, Vasia este una dintre cele mai appreciate voci ale noii generații.', img: 'https://i.postimg.cc/sDY6XbBC/Untitled-design-6.png', isPresident: false, isSurprise: false },
    { id: 'cristina', name: 'Cristina Moldoveanu', role: 'Doctor în Muzicologie', subRole: '', quote: '"Muzica este o limbă universală. Căutăm nu doar corectitudinea tehnică, ci și povestea din spatele fiecărei note."', bio: 'Absolventă a Universității Naționale de Muzică din București, a absolvit masteratul la Universitatea București și doctor în muzicologie al Universității "Transilvania" Brașov, cu peste douăzeci de ani de experiență didactică, numărându-se printre profesorii multor generații. A participat la numeroase spectacole de divertisment, recitaluri de muzică și poezie, emisiuni televizate și în multe alte proiecte culturale.', img: 'https://i.postimg.cc/cLx4Vs0K/Untitled-design-9.png', isPresident: false, isSurprise: false },
    { id: 'raluca', name: 'Raluca Iurașcu', role: 'Actriță / Cântăreața', subRole: '', quote: '"Arta este expresia sufletului. Căutăm nu doar o voce, ci un artist complet, gata să transmită emoție."', bio: 'Este absolventă a Universității Nationale de Artă Teatrală și Cinematografică I.L. Caragiale din Bucuresti, Master în producție film și televiziune – The University of Sunderland, UK. Raluca Iurașcu este director general & fondator al AMA – Academia Metropolitana de Arte, Director general al postului de televiziune 10ZECE TV, director general Scoala de Arte Popesti & Scoala de Arte Brancoveanu și profesor de canto la Școala de Arte Brâncoveanu.', img: 'https://i.postimg.cc/wjqTS6g9/Untitled-design-7.png', isPresident: false, isSurprise: false },
    { id: 'surpriza', name: 'Jurat Surpriză', role: 'Funcție Surpriză', subRole: '', quote: '"Rămâne de văzut cine se alătură juriului nostru de excepție! Va fi o surpriză plăcută pentru toți participanții."', bio: 'Detaliile complete despre acest membru al juriului vor fi dezvăluite cu puțin timp înainte de eveniment. Fii pe fază!', img: '', isPresident: false, isSurprise: true }
];

export const DEFAULT_PRIZES_CONFIG: PrizesConfig = {
    trophyImage: 'https://i.postimg.cc/c4z14X5k/cup-14861086.png',
    prizes: [
        {id: '1', title: 'Trofeul Concursului', desc: 'Diplomă, trofeu, o înregistrare a unei piese și un videoclip realizat de OMG Music, cadouri de la sponsori.', colorClass: 'bg-brand-purple', textColorClass: 'text-white'},
        {id: '2', title: 'Trofeul Categoriei', desc: 'Diplomă, trofeu, cadouri de la sponsori.', colorClass: 'bg-blue-500', textColorClass: 'text-white'},
        {id: '3', title: 'Trofeul Secțiunii', desc: 'Diplomă, trofeu, 20% reducere la înregistrarea unei piese/a unui videoclip, cadouri de la sponsori.', colorClass: 'bg-brand-pink', textColorClass: 'text-white'},
        {id: '4', title: 'Premiul I', desc: 'Diplomă, medalie, cadouri de la sponsori.', colorClass: 'bg-brand-purple', textColorClass: 'text-white'},
        {id: '5', title: 'Premiul II', desc: 'Diplomă, medalie, cadouri de la sponsori.', colorClass: 'bg-blue-500', textColorClass: 'text-white'},
        {id: '6', title: 'Premiul III', desc: 'Diplomă, medalie, cadouri de la sponsori.', colorClass: 'bg-brand-pink', textColorClass: 'text-white'},
        {id: '7', title: 'Premii Speciale', desc: 'Diplomă, trofeu, material educativ oferit de LOGO-MAG.', colorClass: 'bg-brand-yellow', textColorClass: 'text-brand-dark'}
    ]
};

export const DEFAULT_FAQS: FAQ[] = [
    { id: '1', q: "Când și unde are loc festivalul?", a: "Festivalul are loc pe 13 Decembrie 2025, la Cafeneaua Actorilor din Parcul Tineretului, București.", iconUrl: 'https://icongr.am/clarity/date.svg?size=32&color=7C3AED' },
    { id: '2', q: "Care este vârsta minimă de participare?", a: "Vârsta minimă este de 5 ani. Categoriile sunt structurate pe intervale de vârstă până la 18+ ani.", iconUrl: 'https://icongr.am/clarity/user.svg?size=32&color=7C3AED' },
    { id: '3', q: "Pot participa cu mai multe piese?", a: "Da, pachetele individuale permit înscrierea cu 1, 2 sau 3 piese.", iconUrl: 'https://icongr.am/clarity/music-note.svg?size=32&color=7C3AED' },
    { id: '4', q: "Pot schimba piesa cu o alta piesa?", a: "Da, piesa poate fi schimbată cu maxim 5 zile înainte de începerea festivalului. Procesul este simplu: trebuie să ne trimiți un email la contact@voiceup-festival.ro sau un mesaj pe WhatsApp cu noile detalii (Titlu piesă, Artist) și noul negativ în format MP3. După depășirea acestui termen de 5 zile, programul oficial și fișele de jurizare sunt deja tipărite, iar modificările nu mai sunt posibile din motive logistice.", iconUrl: 'https://icongr.am/clarity/repeat.svg?size=32&color=7C3AED' },
    { id: '5', q: "Cum trimit negativul?", a: "Negativele se încarcă direct în formularul de înscriere, în format MP3. Dacă întâmpinați probleme, le puteți trimite pe email.", iconUrl: 'https://icongr.am/clarity/upload.svg?size=32&color=7C3AED' },
    { id: '6', q: "Se poate plăti la fața locului?", a: "Nu, taxa de înscriere trebuie achitată în avans prin transfer bancar sau card online pentru a valida înscrierea.", iconUrl: 'https://icongr.am/clarity/wallet.svg?size=32&color=7C3AED' }
];