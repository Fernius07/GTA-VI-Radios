export type GenreCategory =
  | 'Todas'
  | 'Pop & 80s'
  | 'Hip-Hop & Urbano'
  | 'Rock & Metal'
  | 'Electrónica & Club'
  | 'Latina, Caribe & África'
  | 'Jazz, Soul & Blues'
  | 'Country & Sur'
  | 'Talk & Clásica';

export interface RadioStation {
  id: string;
  name: string;
  frequency: string;
  tagline: string;
  description: string;
  hosts?: string;
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
  'Latina, Caribe & África',
  'Jazz, Soul & Blues',
  'Country & Sur',
  'Talk & Clásica',
];

export const STATIONS: RadioStation[] = [
  {
    id: 'flash-fm',
    name: 'Flash FM',
    frequency: '92.4 FM',
    tagline: 'La institución pop de Vice City',
    description:
      'La mítica emisora de Vice City regresa entregando lo mejor del pop, synthpop y dance-pop para hacerte bailar en cualquier rincón del Estado de Leonida.',
    hosts: 'Robyn y Alex Consani',
    styles: ['Pop', 'Dance Pop', 'Synthpop', 'Éxitos'],
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
    tagline: 'Clásicos del pop de los 80 en Leonida',
    description:
      'Más de seis horas dedicadas al mejor pop de los años 80, himnos sintetizados y clásicos atemporales bajo las palmeras y el neón de Vice City.',
    hosts: 'DJ Al ("Weird Al" Yankovic) y Madame Brigitte (Brigitte Nielsen)',
    styles: ['Pop 80s', 'Synthpop', 'Clásicos 80s'],
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
    tagline: 'Soft rock y power ballads sin frenos',
    description:
      'La emisora más sentimental del dial regresa con grandes baladas épicas y soft rock cargado de emoción para cruzar Leonida a medianoche.',
    hosts: 'Doug Van Dyke (Doug Stanhope)',
    styles: ['Soft Rock', 'Power Ballads', 'Clásicos'],
    category: 'Pop & 80s',
    cover: '/covers/emotion-98-3.webp',
    audioFile: 'emotion-98-3.mp3',
    durationSeconds: 10960,
    songCount: 34,
    cardBg: 'linear-gradient(135deg, #3b1024 0%, #1d0914 100%)',
    accentColor: '#ef4444',
  },
  {
    id: 'kaleidoscope-fm',
    name: 'Kaleidoscope FM',
    frequency: '90.9 FM',
    tagline: 'Música internacional, rarezas y versiones únicas',
    description:
      'Una emisora ecléctica con sonidos internacionales, versiones inusuales y joyas poco conocidas seleccionadas para oídos curiosos.',
    hosts: 'Jeremy Irons',
    styles: ['Ecléctica', 'Internacional', 'Rarezas', 'Covers'],
    category: 'Pop & 80s',
    cover: '/covers/kaleidoscope-fm.webp',
    audioFile: 'kaleidoscope-fm.mp3',
    durationSeconds: 5265,
    songCount: 18,
    cardBg: 'linear-gradient(135deg, #2b1d3d 0%, #1a1126 100%)',
    accentColor: '#eab308',
  },
  {
    id: 'v-rock',
    name: 'V-Rock',
    frequency: '101.7 FM',
    tagline: 'La legendaria emisora de rock de Vice City',
    description:
      'Vuelve el buitre más rockero de Vice City con una amplia selección de classic rock y hard rock de alto voltaje para devorar la autopista.',
    hosts: 'The Buck (Lindsey Buckingham) y Skipper McD (Michael McDonald)',
    styles: ['Classic Rock', 'Hard Rock', 'Rock Clásico'],
    category: 'Rock & Metal',
    cover: '/covers/v-rock.webp',
    audioFile: 'v-rock.mp3',
    durationSeconds: 19235,
    songCount: 69,
    cardBg: 'linear-gradient(135deg, #271516 0%, #160c0d 100%)',
    accentColor: '#dc2626',
  },
  {
    id: 'the-chamber-106-6',
    name: 'The Chamber 106.6',
    frequency: '106.6 FM',
    tagline: 'Metal aplastante desde los 80 hasta hoy',
    description:
      'El metal más demoledor aterriza en Leonida. Súbete al pogo con clásicos del heavy y thrash metal desde los años 80 en adelante.',
    hosts: 'DJ Kerry (Kerry King) y DJ Tom (Tom Araya)',
    styles: ['Heavy Metal', 'Thrash Metal', 'Metal 80s+'],
    category: 'Rock & Metal',
    cover: '/covers/the-chamber-106-6.webp',
    audioFile: 'the-chamber-106-6.mp3',
    durationSeconds: 6641,
    songCount: 22,
    cardBg: 'linear-gradient(135deg, #1a0c0e 0%, #0d0708 100%)',
    accentColor: '#ef4444',
  },
  {
    id: 'vcrr',
    name: 'VCRR',
    frequency: '104.2 FM',
    tagline: 'Rap contemporáneo y éxitos de las listas',
    description:
      'Emisora de rap contemporáneo con los últimos lanzamientos del hip-hop actual y éxitos de las listas de Leonida, incluidos estrenos de Only Raw Records.',
    hosts: 'JT y DJ Stevie J',
    styles: ['Rap Contemporáneo', 'Hip-Hop Actual', 'Chart Hits'],
    category: 'Hip-Hop & Urbano',
    cover: '/covers/vcrr.webp',
    audioFile: 'vcrr.mp3',
    durationSeconds: 16107,
    songCount: 80,
    cardBg: 'linear-gradient(135deg, #1f1b14 0%, #13110d 100%)',
    accentColor: '#f59e0b',
  },
  {
    id: 'dirty-south-classics',
    name: 'Dirty South Classics',
    frequency: '99.1 FM',
    tagline: 'Hospitalidad sureña y clásicos del rap regional',
    description:
      'Clásicos legendarios del rap sureño y hip-hop regional que representan a Leonida y el sur desde la playa hasta el barrio.',
    hosts: 'Trick Daddy y Trina',
    styles: ['Dirty South', 'Southern Hip-Hop', 'Rap Clásico'],
    category: 'Hip-Hop & Urbano',
    cover: '/covers/dirty-south-classics.webp',
    audioFile: 'dirty-south-classics.mp3',
    durationSeconds: 10453,
    songCount: 39,
    cardBg: 'linear-gradient(135deg, #27231d 0%, #141210 100%)',
    accentColor: '#d4a853',
  },
  {
    id: 'circoloco-records-radio',
    name: 'CircoLoco Records Radio',
    frequency: '105.9 FM',
    tagline: 'Electrónica, house y clubbing de vanguardia',
    description:
      'La emisora oficial de CircoLoco Records, el sello cofundado por Rockstar Games y la legendaria marca de eventos, con sesiones de electrónica y club.',
    hosts: 'Seth Troxler y Antonio Carbonaro',
    styles: ['House', 'Tech House', 'EDM', 'Club'],
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
    tagline: 'Indie, alternative dance, house y electrónica',
    description:
      'Sonidos indie, alternative dance, house y electrónica contemporánea seleccionados en colaboración con James Curd para las noches de Leonida.',
    hosts: 'Victoria (PinkPantheress) y Harrison (The Dare)',
    styles: ['Indie', 'Alternative Dance', 'House', 'Electrónica'],
    category: 'Electrónica & Club',
    cover: '/covers/stockyard-fm.webp',
    audioFile: 'stockyard-fm.mp3',
    durationSeconds: 9492,
    songCount: 37,
    cardBg: 'linear-gradient(135deg, #1e2d3b 0%, #0e161f 100%)',
    accentColor: '#38bdf8',
  },
  {
    id: 'the-vault-radio',
    name: 'The Vault Radio',
    frequency: '96.1 FM',
    tagline: 'La emisora secreta del club The Vault',
    description:
      'Emisora oculta desbloqueable dentro del club nocturno The Vault en Vice City, cargada de música dance, electrónica y mezclas rave.',
    hosts: 'DJ Pretzel',
    styles: ['Dance', 'Electrónica', 'Rave', 'Secreta'],
    category: 'Electrónica & Club',
    cover: '/covers/the-vault-radio.jpg',
    audioFile: 'the-vault-radio.mp3',
    durationSeconds: 5015,
    songCount: 23,
    cardBg: '#1c1018',
    accentColor: '#ec4899',
    fullBleed: true,
  },
  {
    id: 'cocoteo-fm',
    name: 'Cocoteo FM',
    frequency: '96.7 FM',
    tagline: 'El party que nunca se apaga en Leonida',
    description:
      'El hogar de la música latina moderna en Leonida: desde bachata y merengue hasta dembow y reggaetón sin descanso.',
    hosts: 'Bad Bunny (El Martillo) y RaiNao (La Gata)',
    styles: ['Reggaetón', 'Dembow', 'Bachata', 'Merengue'],
    category: 'Latina, Caribe & África',
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
    tagline: 'Clásicos latinos, salsa y ritmo caribeño',
    description:
      'Emisora dedicada a la música latina y caribeña clásica, reuniendo salsa, música cubana y merengue con el sabor inconfundible de Vice City.',
    hosts: 'Gloria Estefan y Emilio Estefan',
    styles: ['Salsa', 'Música Cubana', 'Merengue', 'Latina Clásica'],
    category: 'Latina, Caribe & África',
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
    tagline: 'Lo mejor de la música africana, ayer y hoy',
    description:
      'Sube el volumen del gbedu con lo mejor de la música africana: desde clásicos del siglo XX y joyas ocultas hasta sonidos actuales como amapiano y 3-step.',
    hosts: 'Burna Boy y Palms Trax',
    styles: ['Afrobeats', 'Amapiano', '3-Step', 'Clásicos Africanos'],
    category: 'Latina, Caribe & África',
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
    tagline: 'Dub, reggae y cultura On-U Sound',
    description:
      'Bautizada en honor al mítico sello On-U Sound de Adrian Sherwood, con una cuidada selección de dub, reggae y sonidos experimentales.',
    hosts: 'Adrian Sherwood',
    styles: ['Dub', 'Reggae', 'On-U Sound'],
    category: 'Latina, Caribe & África',
    cover: '/covers/radio-on-u.webp',
    audioFile: 'radio-on-u.mp3',
    durationSeconds: 3005,
    songCount: 16,
    cardBg: 'linear-gradient(135deg, #1b2218 0%, #121610 100%)',
    accentColor: '#22c55e',
  },
  {
    id: 'the-sniper-of-la-perle',
    name: 'The Sniper of La Perle',
    frequency: '108.0 FM',
    tagline: 'Música haitiana y caribeña desbloqueable',
    description:
      'Emisora adicional oficial acreditada por Rockstar Games con una selección especial de música haitiana y caribeña.',
    hosts: 'Kodak Black · Presentado por Michaël Brun',
    styles: ['Música Haitiana', 'Caribeña', 'Kompa', 'Desbloqueable'],
    category: 'Latina, Caribe & África',
    cover: '/covers/the-sniper-of-la-perle.jpg',
    audioFile: 'the-sniper-of-la-perle.mp3',
    durationSeconds: 2387,
    songCount: 22,
    cardBg: '#0b0b0e',
    accentColor: '#dc2626',
    fullBleed: true,
  },
  {
    id: 'honey-fm',
    name: 'Honey FM',
    frequency: '94.5 FM',
    tagline: 'R&B de los 90, soul y el segmento Liquid City',
    description:
      'R&B clásico de los años 90, soul atemporal y éxitos sedosos, incluyendo el bloque especial Liquid City interpretado por Liquid Wilson (Craig Robinson).',
    hosts: 'Chilli y T-Boz',
    styles: ['90s R&B', 'Soul', 'Slow Jams'],
    category: 'Jazz, Soul & Blues',
    cover: '/covers/honey-fm.webp',
    audioFile: 'honey-fm.mp3',
    durationSeconds: 19777,
    songCount: 55,
    cardBg: 'linear-gradient(135deg, #2b1d0e 0%, #171008 100%)',
    accentColor: '#f59e0b',
  },
  {
    id: 'leonida-jazz-radio',
    name: 'Leonida Jazz Radio',
    frequency: '88.5 FM',
    tagline: 'Jazz, jazz fusion y grandes instrumentistas',
    description:
      'Emisora dedicada al jazz y al jazz fusion con grabaciones de grandes instrumentistas para acompañar las noches de Leonida.',
    hosts: 'DJ Randy (Randy Brecker)',
    styles: ['Jazz', 'Jazz Fusion', 'Instrumental'],
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
    tagline: 'Blues histórico y contemporáneo del sur',
    description:
      'Una emisora dedicada al blues con grabaciones históricas y modernas llenas de alma y guitarras eléctricas.',
    hosts: 'Keith Richards y Buddy Guy',
    styles: ['Blues Clásico', 'Blues Moderno', 'Rhythm & Blues'],
    category: 'Jazz, Soul & Blues',
    cover: '/covers/gloriana-blues-radio.webp',
    audioFile: 'gloriana-blues-radio.mp3',
    durationSeconds: 5383,
    songCount: 23,
    cardBg: 'linear-gradient(135deg, #10253a 0%, #0b1624 100%)',
    accentColor: '#3b82f6',
  },
  {
    id: 'worldwide-fm',
    name: 'Worldwide FM',
    frequency: '93.1 FM',
    tagline: 'Jazz, soul y sonidos de todo el mundo',
    description:
      'La sucursal de Leonida reúne jazz, soul y músicas de todos los rincones del planeta con la curaduría global de Gilles Peterson.',
    hosts: 'Gilles Peterson',
    styles: ['Jazz', 'Soul', 'Global Beats', 'Ecléctica'],
    category: 'Jazz, Soul & Blues',
    cover: '/covers/worldwide-fm.webp',
    audioFile: 'worldwide-fm.mp3',
    durationSeconds: 7232,
    songCount: 39,
    cardBg: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
    accentColor: '#7c3aed',
  },
  {
    id: 'back-country-radio',
    name: 'Back Country Radio',
    frequency: '100.3 FM',
    tagline: 'Country renegado hacia Grassrivers y Port Gellhorn',
    description:
      'Country rebelde dirigido a Grassrivers, Port Gellhorn y más allá, con reportes desde el aerodeslizador del meteorólogo pantanoso Mud Dog Mike.',
    hosts: 'Morgan Wallen (MW) y Lana Del Rey (Delta Dawne)',
    styles: ['Country Rebelde', 'Outlaw Country', 'Americana'],
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
    tagline: 'Barro, motores y southern rock de Leonida',
    description:
      'El sonido del Thrillbilly Mud Club: southern rock, country rebelde y energía todoterreno para los circuitos de barro de Leonida.',
    styles: ['Southern Rock', 'Outlaw Country', 'Swamp Rock'],
    category: 'Country & Sur',
    cover: '/covers/thrillbilly-mud-club-radio.jpg',
    audioFile: 'thrillbilly-mud-club-radio.mp3',
    durationSeconds: 5021,
    songCount: 20,
    cardBg: '#ea580c',
    accentColor: '#ea580c',
    fullBleed: true,
  },
  {
    id: 'symphony-fm',
    name: 'Symphony FM',
    frequency: '88.1 FM',
    tagline: 'Obras sinfónicas y música clásica en alta fidelidad',
    description:
      'Emisora de música clásica que reúne grandes obras orquestales y composiciones de múltiples períodos históricos.',
    hosts: 'Yuja Wang',
    styles: ['Clásica', 'Orquestal', 'Sinfónica'],
    category: 'Talk & Clásica',
    cover: '/covers/symphony-fm.webp',
    audioFile: 'symphony-fm.mp3',
    durationSeconds: 8230,
    songCount: 16,
    cardBg: 'linear-gradient(135deg, #f5f0eb 0%, #e7ddd4 100%)',
    accentColor: '#881337',
  },
  {
    id: 'the-wipe',
    name: 'The Wipe',
    frequency: '97.5 FM',
    tagline: 'Sátira y los personajes más insólitos de Leonida',
    description:
      'Emisora talk-radio centrada en la sátira y los sucesos y personajes más extraños e imprevisibles de todo Leonida.',
    styles: ['Talk Radio', 'Sátira', 'Leonida'],
    category: 'Talk & Clásica',
    cover: '/covers/the-wipe.webp',
    audioFile: 'the-wipe.mp3',
    durationSeconds: 12019,
    cardBg: 'linear-gradient(135deg, #e0f2fe 0%, #fef3c7 100%)',
    accentColor: '#0284c7',
  },
  {
    id: 'wktt',
    name: 'WKTT — We Know The Truth',
    frequency: 'AM 1050',
    tagline: 'Tertulia conservadora, llamadas en directo y sátira',
    description:
      'Regresa WKTT (We Know The Truth), la mítica radio hablada de sátira política y social con llamadas de oyentes en directo.',
    styles: ['Talk Radio', 'Sátira Política', 'Debate'],
    category: 'Talk & Clásica',
    cover: '/covers/wktt.webp',
    audioFile: 'wktt.mp3',
    durationSeconds: 6306,
    cardBg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    accentColor: '#dc2626',
  },
];
