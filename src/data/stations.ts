export type GenreCategory =
  | 'Todas'
  | 'Pop & 80s'
  | 'Hip-Hop & Urbano'
  | 'Rock & Metal'
  | 'Electrónica & Club'
  | 'Latina & Caribe'
  | 'Jazz, Soul & Blues'
  | 'Country & Sur'
  | 'Talk & Clásica';

export interface RadioStation {
  id: string;
  name: string;
  frequency: string;
  tagline: string;
  description: string;
  styles: string[];
  category: Exclude<GenreCategory, 'Todas'>;
  cover: string;
  audioFile: string;
  durationSeconds: number;
  songCount?: number;
  /** Tailored background for the square album tile behind the transparent logo */
  cardBg: string;
  /** Ambient hero & accent tint color (hex) */
  accentColor: string;
  /** Whether the artwork is already a full-bleed square */
  fullBleed?: boolean;
}

const AUDIO_BASE_URL = (import.meta.env.VITE_AUDIO_BASE_URL as string | undefined)?.replace(/\/+$/, '') || '';

export function getAudioUrl(station: RadioStation): string {
  if (AUDIO_BASE_URL) {
    return `${AUDIO_BASE_URL}/${station.audioFile}`;
  }
  return `/audio/${station.audioFile}`;
}

export const GENRE_CATEGORIES: GenreCategory[] = [
  'Todas',
  'Pop & 80s',
  'Hip-Hop & Urbano',
  'Rock & Metal',
  'Electrónica & Club',
  'Latina & Caribe',
  'Jazz, Soul & Blues',
  'Country & Sur',
  'Talk & Clásica',
];

export const STATIONS: RadioStation[] = [
  {
    id: 'flash-fm',
    name: 'Flash FM',
    frequency: '92.4 FM',
    tagline: 'Pop, grooves y puro neón de Vice City',
    description:
      'El sonido más icónico de la costa de Leonida. Éxitos irresistibles de pop ochentero, synthpop brillante, dance-pop y himnos atemporales para conducir al atardecer por Ocean Beach.',
    styles: ['Pop 80s', 'Synthpop', 'New Wave', 'Dance Pop'],
    category: 'Pop & 80s',
    cover: '/covers/flash-fm.webp',
    audioFile: 'flash-fm.mp3',
    durationSeconds: 20702,
    songCount: 80,
    cardBg: 'linear-gradient(135deg, #fde9d0 0%, #f9d4c4 100%)',
    accentColor: '#ff4d94',
  },
  {
    id: 'vice-city-fm',
    name: 'Vice City FM',
    frequency: '95.8 FM',
    tagline: 'Clásicos eternos bajo palmeras y neón',
    description:
      'La esencia nostálgica de Vice City reunida en más de seis horas de clásicos pop, soft rock y baladas ochenteras que marcaron toda una generación en las avenidas de Leonida.',
    styles: ['80s Hits', 'Pop Clásico', 'Soft Rock', 'Nostalgia'],
    category: 'Pop & 80s',
    cover: '/covers/vice-city-fm.webp',
    audioFile: 'vice-city-fm.mp3',
    durationSeconds: 22136,
    songCount: 72,
    cardBg: 'linear-gradient(135deg, #1b2845 0%, #101829 100%)',
    accentColor: '#ff7066',
  },
  {
    id: 'emotion-98-3',
    name: 'Emotion 98.3',
    frequency: '98.3 FM',
    tagline: 'Power ballads y dramatismo a todo volumen',
    description:
      'Emoción pura a medianoche. Baladas épicas, soft rock romántico y melodías cargadas de sentimiento para cruzar los puentes de Leonida con las ventanillas bajadas.',
    styles: ['Power Ballads', 'Soft Rock', 'Pop Romántico'],
    category: 'Pop & 80s',
    cover: '/covers/emotion-98-3.webp',
    audioFile: 'emotion-98-3.mp3',
    durationSeconds: 10960,
    songCount: 34,
    cardBg: 'linear-gradient(135deg, #3b1024 0%, #1d0914 100%)',
    accentColor: '#ef4444',
  },
  {
    id: 'v-rock',
    name: 'V-Rock',
    frequency: '101.7 FM',
    tagline: 'Guitarras al máximo, actitud sin frenos',
    description:
      'El rugido más salvaje de Vice City regresa sin pedir permiso. Hard rock, heavy metal clásico y glam rock de alto voltaje para quemar neumático por la autopista.',
    styles: ['Hard Rock', 'Heavy Metal', 'Glam Rock'],
    category: 'Rock & Metal',
    cover: '/covers/v-rock.webp',
    audioFile: 'v-rock.mp3',
    durationSeconds: 19235,
    songCount: 69,
    cardBg: 'linear-gradient(135deg, #271516 0%, #160c0d 100%)',
    accentColor: '#dc2626',
  },
  {
    id: 'vcrr',
    name: 'VCRR',
    frequency: '104.2 FM',
    tagline: 'Vice City Rock Radio — leyenda del rock',
    description:
      'Riffs inmortales, rock clásico, arena rock y himnos de carretera. Cuatro horas y media de energía guitarrera para recorrer el estado entero de costa a costa.',
    styles: ['Classic Rock', 'Arena Rock', 'Rock 70s & 80s'],
    category: 'Rock & Metal',
    cover: '/covers/vcrr.webp',
    audioFile: 'vcrr.mp3',
    durationSeconds: 16107,
    songCount: 80,
    cardBg: 'linear-gradient(135deg, #1f1b14 0%, #13110d 100%)',
    accentColor: '#f59e0b',
  },
  {
    id: 'the-chamber-106-6',
    name: 'The Chamber 106.6',
    frequency: '106.6 FM',
    tagline: 'Metal extremo y oscuridad sin concesiones',
    description:
      'Desde thrash hasta metal moderno y sonidos subterráneos implacables. Una emisora forjada en fuego para quienes buscan adrenalina pura y baterías demoledoras.',
    styles: ['Metal', 'Thrash', 'Nu-Metal', 'Hardcore'],
    category: 'Rock & Metal',
    cover: '/covers/the-chamber-106-6.webp',
    audioFile: 'the-chamber-106-6.mp3',
    durationSeconds: 6641,
    songCount: 22,
    cardBg: 'linear-gradient(135deg, #1a0c0e 0%, #0d0708 100%)',
    accentColor: '#ef4444',
  },
  {
    id: 'dirty-south-classics',
    name: 'Dirty South Classics',
    frequency: '99.1 FM',
    tagline: 'Graves de 808 y orgullo hip-hop sureño',
    description:
      'El pulso callejero del sur de Estados Unidos y Miami. Clásicos del Dirty South, crunk, trap pionero y beats pesados que hacen vibrar el maletero en cada semáforo.',
    styles: ['Dirty South', 'Southern Hip-Hop', 'Miami Bass', 'Trap'],
    category: 'Hip-Hop & Urbano',
    cover: '/covers/dirty-south-classics.webp',
    audioFile: 'dirty-south-classics.mp3',
    durationSeconds: 10453,
    songCount: 39,
    cardBg: 'linear-gradient(135deg, #27231d 0%, #141210 100%)',
    accentColor: '#d4a853',
  },
  {
    id: 'honey-fm',
    name: 'Honey FM',
    frequency: '94.5 FM',
    tagline: 'R&B sedoso, Neo-Soul y vibes dulces',
    description:
      'Ritmos envolventes y voces aterciopeladas. Más de cinco horas de R&B contemporáneo, clásicos del soul moderno y grooves nocturnos con sabor a verano eterno.',
    styles: ['R&B', 'Neo-Soul', 'Slow Jams', 'Hip-Hop Soul'],
    category: 'Jazz, Soul & Blues',
    cover: '/covers/honey-fm.webp',
    audioFile: 'honey-fm.mp3',
    durationSeconds: 19777,
    songCount: 55,
    cardBg: 'linear-gradient(135deg, #2b1d0e 0%, #171008 100%)',
    accentColor: '#f59e0b',
  },
  {
    id: 'cocoteo-fm',
    name: 'Cocoteo FM',
    frequency: '96.7 FM',
    tagline: 'Perreo, dembow y calor tropical sin pausa',
    description:
      'La fiesta urbana latina de Vice City. Reggaetón explosivo, dembow caribeño, trap latino y ritmos que dominan los clubs nocturnos y las playas de Leonida.',
    styles: ['Reggaetón', 'Dembow', 'Urbano Latino', 'Perreo'],
    category: 'Latina & Caribe',
    cover: '/covers/cocoteo-fm.webp',
    audioFile: 'cocoteo-fm.mp3',
    durationSeconds: 6548,
    songCount: 30,
    cardBg: 'linear-gradient(135deg, #d79bd0 0%, #b87bb7 100%)',
    accentColor: '#e879f9',
  },
  {
    id: 'radio-la-ola',
    name: 'Radio La Ola',
    frequency: '91.3 FM',
    tagline: 'Salsa, pop latino y sabor caribeño',
    description:
      'Desde Little Cuba hasta las playas de Vice Beach: clásicos latinos, salsa vibrante, freestyle de Miami, merengue y himnos soleados cargados de energía.',
    styles: ['Salsa', 'Latin Pop', 'Tropical', 'Miami Freestyle'],
    category: 'Latina & Caribe',
    cover: '/covers/radio-la-ola.webp',
    audioFile: 'radio-la-ola.mp3',
    durationSeconds: 7852,
    songCount: 25,
    cardBg: 'linear-gradient(135deg, #1d1536 0%, #12213d 100%)',
    accentColor: '#ec4899',
  },
  {
    id: 'afrobank-fm',
    name: 'AfroBank FM',
    frequency: '102.5 FM',
    tagline: 'Afrobeats, Amapiano y ritmo global',
    description:
      'El puente sonoro entre Lagos, Londres y Vice City. Afrobeats soleado, amapiano hipnótico, afro-fusion y percusiones contagiosas para cualquier hora del día.',
    styles: ['Afrobeats', 'Amapiano', 'Afro-Fusion', 'Dancehall'],
    category: 'Latina & Caribe',
    cover: '/covers/afrobank-fm.webp',
    audioFile: 'afrobank-fm.mp3',
    durationSeconds: 8754,
    songCount: 31,
    cardBg: 'linear-gradient(135deg, #ede4d1 0%, #dfd1b6 100%)',
    accentColor: '#16a34a',
  },
  {
    id: 'radio-on-u',
    name: 'Radio On-U',
    frequency: '89.7 FM',
    tagline: 'Dub, reggae roots y cultura Sound System',
    description:
      'Bajos profundos, ecos analógicos y vibra rastafari auténtica. Selección curada de dub experimental, roots reggae y beats hipnóticos del Caribe.',
    styles: ['Dub', 'Roots Reggae', 'Sound System', 'Post-Punk Dub'],
    category: 'Latina & Caribe',
    cover: '/covers/radio-on-u.webp',
    audioFile: 'radio-on-u.mp3',
    durationSeconds: 3005,
    songCount: 16,
    cardBg: 'linear-gradient(135deg, #1b2218 0%, #121610 100%)',
    accentColor: '#22c55e',
  },
  {
    id: 'circoloco-records-radio',
    name: 'CircoLoco Records Radio',
    frequency: '105.9 FM',
    tagline: 'House underground y noches de club en Vice',
    description:
      'El sonido de los clubs más exclusivos del planeta llega a Leonida. Tech house, deep house, disco moderno y electrónica vanguardista sin interrupciones.',
    styles: ['House', 'Tech House', 'Deep House', 'Club'],
    category: 'Electrónica & Club',
    cover: '/covers/circoloco-records-radio.webp',
    audioFile: 'circoloco-records-radio.mp3',
    durationSeconds: 6444,
    songCount: 27,
    cardBg: '#fa280a',
    accentColor: '#fa280a',
    fullBleed: true,
  },
  {
    id: 'stockyard-fm',
    name: 'Stockyard FM',
    frequency: '103.4 FM',
    tagline: 'Electrónica industrial, breaks y rave nocturno',
    description:
      'Sonido crudo de nave industrial y after-hours. Techno contundente, breakbeat, electro y bajos oscuros pensados para perderse en la madrugada de Leonida.',
    styles: ['Techno', 'Electro', 'Breakbeat', 'Underground'],
    category: 'Electrónica & Club',
    cover: '/covers/stockyard-fm.webp',
    audioFile: 'stockyard-fm.mp3',
    durationSeconds: 9492,
    songCount: 37,
    cardBg: 'linear-gradient(135deg, #1e2d3b 0%, #0e161f 100%)',
    accentColor: '#38bdf8',
  },
  {
    id: 'kaleidoscope-fm',
    name: 'Kaleidoscope FM',
    frequency: '90.9 FM',
    tagline: 'Psicodelia, indie colorido y viajes sonoros',
    description:
      'Un caleidoscopio musical sin reglas: rock psicodélico, dream pop, indie alternativo y texturas hipnóticas llenas de color para conducir sin rumbo fijo.',
    styles: ['Psychedelic Rock', 'Indie', 'Dream Pop', 'Alt'],
    category: 'Rock & Metal',
    cover: '/covers/kaleidoscope-fm.webp',
    audioFile: 'kaleidoscope-fm.mp3',
    durationSeconds: 5265,
    songCount: 18,
    cardBg: 'linear-gradient(135deg, #2b1d3d 0%, #1a1126 100%)',
    accentColor: '#eab308',
  },
  {
    id: 'the-wipe',
    name: 'The Wipe',
    frequency: '97.5 FM',
    tagline: 'Surf, indie playero y brisa del Atlántico',
    description:
      'Sol, salitre y guitarras con reverb. Una mezcla fresca de surf rock, indie veraniego y garage relajado diseñada para recorrer las carreteras costeras de Leonida Keys.',
    styles: ['Surf Rock', 'Indie Costero', 'Alternative', 'Beach Vibes'],
    category: 'Rock & Metal',
    cover: '/covers/the-wipe.webp',
    audioFile: 'the-wipe.mp3',
    durationSeconds: 12019,
    cardBg: 'linear-gradient(135deg, #e0f2fe 0%, #fef3c7 100%)',
    accentColor: '#0284c7',
  },
  {
    id: 'worldwide-fm',
    name: 'Worldwide FM',
    frequency: '93.1 FM',
    tagline: 'Sonidos eclécticos de todos los rincones',
    description:
      'Curaduría musical sin fronteras: jazz-funk, electrónica downtempo, beats globales, soul futurista y joyas ocultas seleccionadas para oídos inquietos.',
    styles: ['Eclectic', 'Jazz-Funk', 'Downtempo', 'Global Beats'],
    category: 'Electrónica & Club',
    cover: '/covers/worldwide-fm.webp',
    audioFile: 'worldwide-fm.mp3',
    durationSeconds: 7232,
    songCount: 39,
    cardBg: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
    accentColor: '#7c3aed',
  },
  {
    id: 'leonida-jazz-radio',
    name: 'Leonida Jazz Radio',
    frequency: '88.5 FM',
    tagline: 'Jazz elegante para noches cálidas en la ciudad',
    description:
      'Saxofones suaves, contrabajos cálidos y improvisación magistral. Desde bebop clásico hasta smooth jazz y fusión contemporánea para desconectar bajo las luces de la bahía.',
    styles: ['Jazz', 'Smooth Jazz', 'Jazz Fusion', 'Lounge'],
    category: 'Jazz, Soul & Blues',
    cover: '/covers/leonida-jazz-radio.webp',
    audioFile: 'leonida-jazz-radio.mp3',
    durationSeconds: 10784,
    songCount: 36,
    cardBg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    accentColor: '#0ea5e9',
  },
  {
    id: 'gloriana-blues-radio',
    name: 'Gloriana Blues Radio',
    frequency: '90.1 FM',
    tagline: 'Blues del pantano, alma y guitarra eléctrica',
    description:
      'El espíritu profundo del sur pantanoso. Blues eléctrico, delta blues y soul crudo con historias de carretera, calor húmedo y cuerdas llenas de carácter.',
    styles: ['Blues', 'Delta Blues', 'Southern Soul', 'Rhythm & Blues'],
    category: 'Jazz, Soul & Blues',
    cover: '/covers/gloriana-blues-radio.webp',
    audioFile: 'gloriana-blues-radio.mp3',
    durationSeconds: 5383,
    songCount: 23,
    cardBg: 'linear-gradient(135deg, #10253a 0%, #0b1624 100%)',
    accentColor: '#3b82f6',
  },
  {
    id: 'back-country-radio',
    name: 'Back Country Radio',
    frequency: '100.3 FM',
    tagline: 'Country clásico, caminos de tierra y libertad',
    description:
      'La banda sonora del interior de Leonida y Grassrivers. Country tradicional, outlaw country y baladas acústicas para camionetas polvorientas y atardeceres infinitos.',
    styles: ['Country', 'Outlaw Country', 'Americana', 'Folk'],
    category: 'Country & Sur',
    cover: '/covers/back-country-radio.webp',
    audioFile: 'back-country-radio.mp3',
    durationSeconds: 5064,
    songCount: 24,
    cardBg: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
    accentColor: '#3b82f6',
  },
  {
    id: 'thrillbilly-mud-club-radio',
    name: 'Thrillbilly Mud Club Radio',
    frequency: '107.1 FM',
    tagline: 'Barro, motores V8 y southern rock salvaje',
    description:
      'Directamente desde los pantanos y circuitos de barro del Thrillbilly Mud Club. Southern rock sucio, country rebelde y himnos ruidosos para monstruos 4x4.',
    styles: ['Southern Rock', 'Outlaw Country', 'Swamp Rock'],
    category: 'Country & Sur',
    cover: '/covers/thrillbilly-mud-club-radio.svg',
    audioFile: 'thrillbilly-mud-club-radio.mp3',
    durationSeconds: 5021,
    songCount: 20,
    cardBg: 'linear-gradient(135deg, #431d0c 0%, #1f0e06 100%)',
    accentColor: '#f97316',
  },
  {
    id: 'the-vault-radio',
    name: 'The Vault Radio',
    frequency: '96.1 FM',
    tagline: 'Joyas ocultas y hip-hop clásico de colección',
    description:
      'Abriendo la cámara acorazada del mejor hip-hop y cortes de culto. Boom bap legendario, clásicos de los 90 y rimas atemporales rescatadas directo del archivo.',
    styles: ['Classic Hip-Hop', 'Boom Bap', '90s Rap', 'Rare Cuts'],
    category: 'Hip-Hop & Urbano',
    cover: '/covers/the-vault-radio.svg',
    audioFile: 'the-vault-radio.mp3',
    durationSeconds: 5015,
    songCount: 23,
    cardBg: 'linear-gradient(135deg, #272013 0%, #12100b 100%)',
    accentColor: '#f59e0b',
  },
  {
    id: 'the-sniper-of-la-perle',
    name: 'The Sniper of La Perle',
    frequency: '108.0 FM',
    tagline: 'Mixtape clandestina y sonido callejero de barrio',
    description:
      'Una emisión pirata y mixtape callejera sin censura desde el corazón de La Perle. Rap crudo, ritmos urbanos del Caribe y cortes underground de alto calibre.',
    styles: ['Mixtape', 'Underground Rap', 'Street Vibes', 'Hip-Hop'],
    category: 'Hip-Hop & Urbano',
    cover: '/covers/the-sniper-of-la-perle.svg',
    audioFile: 'the-sniper-of-la-perle.mp3',
    durationSeconds: 2387,
    songCount: 22,
    cardBg: 'linear-gradient(135deg, #2c1018 0%, #12090d 100%)',
    accentColor: '#f43f5e',
  },
  {
    id: 'symphony-fm',
    name: 'Symphony FM',
    frequency: '88.1 FM',
    tagline: 'Música clásica, orquesta y drama cinematográfico',
    description:
      'Elegancia absoluta incluso en medio de una persecución policial. Grandes obras sinfónicas, piezas orquestales inmortales y serenidad clásica en alta fidelidad.',
    styles: ['Clásica', 'Orquestal', 'Sinfónica', 'Instrumental'],
    category: 'Talk & Clásica',
    cover: '/covers/symphony-fm.webp',
    audioFile: 'symphony-fm.mp3',
    durationSeconds: 8230,
    songCount: 16,
    cardBg: 'linear-gradient(135deg, #f5f0eb 0%, #e7ddd4 100%)',
    accentColor: '#881337',
  },
  {
    id: 'wktt',
    name: 'WKTT — We Know The Truth',
    frequency: 'AM 1050',
    tagline: 'Debates incendiarios, sátira y locura en directo',
    description:
      'La mítica emisora talk-radio de sátira americana: tertulias exageradas, teorías disparatadas, llamadas de oyentes indignados y anuncios paródicos sin filtro.',
    styles: ['Talk Radio', 'Sátira', 'Debate', 'Comedia'],
    category: 'Talk & Clásica',
    cover: '/covers/wktt.webp',
    audioFile: 'wktt.mp3',
    durationSeconds: 6306,
    cardBg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    accentColor: '#dc2626',
  },
];
