
import { HeroConfig } from '../interfaces';

export const DEFAULT_HERO_CONFIG: HeroConfig = {
  logoUrl: 'https://i.postimg.cc/KztjG9sK/logo-v2.png',
  showLogo: true,
  logoPosition: 'center',
  title: "Let's VoiceUP Together!",
  showTitle: false, 
  changingText: {
    enabled: true,
    sets: [
      {
        id: '1',
        prefix: "Festivalul care spune NU ",
        prefixColor: "#2E1065",
        words: ["Nepăsării", "Plictiselii", "Limitelor"],
        wordsColor: "#F472B6",
      },
      {
        id: '2',
        prefix: "Urcă pe scena ",
        prefixColor: "#7C3AED",
        words: ["Succesului", "Viitorului", "Emoției"],
        wordsColor: "#FBBF24",
      }
    ],
    interval: 3000,
    setDuration: 9000, // 3 words * 3000ms = 9s per set
    fontSizeDesktop: 60,
    fontSizeMobile: 30,
    desktopLayout: 'stacked'
  },
  titleStyles: { fontFamily: 'Alfa Slab One', color: '#2E1065', iBold: false, iItalic: false, isUnderlined: false },
  buttonText: 'Înscrie-te Acum!',
  showButton: true,
  buttonStyles: { fontFamily: 'Nunito', textColor: '#2E1065', bgColor: '#FBBF24', iBold: true, iItalic: false, isUnderlined: false },
  backgroundType: 'gradient',
  gradient: { color1: '#7C3AED', color2: '#F472B6', color3: '#7C3AED', color4: '#F472B6', speed: 15 },
  desktopImageUrl: 'https://placehold.co/1920x1080?text=Desktop+Banner',
  mobileImageUrl: 'https://placehold.co/750x1334?text=Mobile+Banner',
  desktopVideoUrl: 'https://cdn.pixabay.com/video/2020/09/20/49016-460149021_large.mp4',
  mobileVideoUrl: 'https://cdn.pixabay.com/video/2022/08/24/124436-742194689_large.mp4',
  logoAnimation: { type: 'float', speed: 4 },
  decorationType: 'notes',
  floatingNotesCount: 30,
  visualizerHeight: 80,
};
