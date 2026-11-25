import type { GenreCategory } from '../data/stations';

export type Language = 'es' | 'en';

const LANG_STORAGE_KEY = 'gta6_radio_lang_v1';

export function loadInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'es' || saved === 'en') return saved;
  } catch {
    // Ignore storage access errors
  }

  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
  }
  return 'es';
}

export function saveLanguage(lang: Language): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Ignore storage access errors
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
}

export const GENRE_LABELS: Record<Language, Record<GenreCategory, string>> = {
  es: {
    Todas: 'Todas',
    'Pop & 80s': 'Pop & 80s',
    'Hip-Hop & Urbano': 'Hip-Hop & Urbano',
    'Rock & Metal': 'Rock & Metal',
    'Electrónica & Club': 'Electrónica & Club',
    'Latina, Caribe & África': 'Latina, Caribe & África',
    'Jazz, Soul & Blues': 'Jazz, Soul & Blues',
    'Country & Sur': 'Country & Sur',
    'Talk & Clásica': 'Talk & Clásica',
  },
  en: {
    Todas: 'All',
    'Pop & 80s': 'Pop & 80s',
    'Hip-Hop & Urbano': 'Hip-Hop & Urban',
    'Rock & Metal': 'Rock & Metal',
    'Electrónica & Club': 'Electronic & Club',
    'Latina, Caribe & África': 'Latin, Caribbean & Africa',
    'Jazz, Soul & Blues': 'Jazz, Soul & Blues',
    'Country & Sur': 'Country & South',
    'Talk & Clásica': 'Talk & Classical',
  },
};

export const UI_TEXT = {
  es: {
    nav: {
      home: 'Inicio',
      dial: 'Modo Dial GTA',
      dialShort: 'Dial GTA',
      favorites: 'Tus Favoritas',
      favoritesShort: 'Favoritas',
      explore: 'Explorar',
      stationsTitle: 'Emisoras FM / AM',
      closeMenu: 'Cerrar menú',
      openStations: 'Abrir emisoras',
      mobileNavLabel: 'Navegación móvil',
    },
    header: {
      searchPlaceholder: 'Buscar emisora, género, estilo...',
      searchOpen: 'Buscar emisora',
      searchClose: 'Cerrar búsqueda',
      clearSearch: 'Limpiar búsqueda',
      newSession: 'Nueva sesión',
      newSessionTitle: 'Reiniciar sesión con nueva emisora y horarios aleatorios',
      newSessionAria: 'Nueva sesión aleatoria',
      languageSwitch: 'Idioma',
    },
    hero: {
      live: 'En directo',
      initialRandom: 'Emisora aleatoria inicial',
      hostedBy: 'Con',
      nowPlaying: 'Sonando ahora',
      tuning: 'Sintonizando...',
      pauseRadio: 'Pausar radio',
      tuneInLive: 'Sintonizar en directo',
      pauseShort: 'Pausar',
      tuneShort: 'Sintonizar',
      changeRandom: 'Cambiar aleatoria',
      randomShort: 'Aleatoria',
      addFavorite: 'Añadir a favoritas',
      removeFavorite: 'Quitar de favoritas',
    },
    grid: {
      favoritesTitle: 'Tus emisoras favoritas',
      resultsFor: (q: string) => `Resultados para "${q}"`,
      stationsHeading: 'Emisoras de Leonida',
      stationSingular: 'emisora',
      stationPlural: 'emisoras',
      noFavoritesTitle: 'Todavía no tienes emisoras favoritas',
      noFavoritesHint: 'Pulsa el corazón en cualquier radio para guardarla aquí.',
      noResultsTitle: 'No se encontraron emisoras con ese filtro',
      noResultsHint: 'Prueba con otro género o limpia la búsqueda.',
      playingBadge: 'Sonando',
      tunedBadge: 'Sintonizada',
      saveFavorite: 'Guardar en favoritas',
    },
    dial: {
      header: 'DIAL FM · LEONIDA',
      prevStation: 'Emisora anterior',
      nextStation: 'Siguiente emisora',
      live: 'En directo',
      hostedBy: 'Con',
      pauseSignal: 'Pausar señal',
      tuneStation: 'Sintonizar emisora',
    },
    player: {
      live: 'En directo',
      paused: 'En pausa',
      liveBadge: 'LIVE',
      prevAria: 'Emisora anterior',
      prevTitle: 'Emisora anterior (←)',
      nextAria: 'Siguiente emisora',
      nextTitle: 'Siguiente emisora (→)',
      playAria: 'Reproducir',
      pauseAria: 'Pausar',
      playPauseTitle: 'Reproducir / Pausar (Espacio)',
      randomAria: 'Emisora aleatoria',
      randomTitle: 'Emisora aleatoria (R)',
      fmStaticTitle: 'Efecto estática FM al cambiar de emisora',
      muteAria: 'Silenciar',
      unmuteAria: 'Activar sonido',
      muteTitle: 'Silenciar (M)',
      volumeAria: 'Volumen',
    },
    audioError:
      'No se pudo cargar el audio de esta emisora. En local asegúrate de tener los MP3 en local-audio/ y en Vercel configura VITE_AUDIO_BASE_URL.',
  },
  en: {
    nav: {
      home: 'Home',
      dial: 'GTA Dial Mode',
      dialShort: 'GTA Dial',
      favorites: 'Your Favorites',
      favoritesShort: 'Favorites',
      explore: 'Explore',
      stationsTitle: 'FM / AM Stations',
      closeMenu: 'Close menu',
      openStations: 'Open stations',
      mobileNavLabel: 'Mobile navigation',
    },
    header: {
      searchPlaceholder: 'Search station, genre, host...',
      searchOpen: 'Search station',
      searchClose: 'Close search',
      clearSearch: 'Clear search',
      newSession: 'New session',
      newSessionTitle: 'Reset session with a new random station and live offsets',
      newSessionAria: 'New random session',
      languageSwitch: 'Language',
    },
    hero: {
      live: 'Live',
      initialRandom: 'Initial random station',
      hostedBy: 'Hosted by',
      nowPlaying: 'Now playing',
      tuning: 'Tuning in...',
      pauseRadio: 'Pause radio',
      tuneInLive: 'Tune in live',
      pauseShort: 'Pause',
      tuneShort: 'Tune in',
      changeRandom: 'Random station',
      randomShort: 'Shuffle',
      addFavorite: 'Add to favorites',
      removeFavorite: 'Remove from favorites',
    },
    grid: {
      favoritesTitle: 'Your favorite stations',
      resultsFor: (q: string) => `Results for "${q}"`,
      stationsHeading: 'Stations of Leonida',
      stationSingular: 'station',
      stationPlural: 'stations',
      noFavoritesTitle: 'You have no favorite stations yet',
      noFavoritesHint: 'Tap the heart icon on any radio station to save it here.',
      noResultsTitle: 'No stations matched your filter',
      noResultsHint: 'Try another genre or clear your search.',
      playingBadge: 'Playing',
      tunedBadge: 'Tuned',
      saveFavorite: 'Save to favorites',
    },
    dial: {
      header: 'FM DIAL · LEONIDA',
      prevStation: 'Previous station',
      nextStation: 'Next station',
      live: 'Live',
      hostedBy: 'Hosted by',
      pauseSignal: 'Pause signal',
      tuneStation: 'Tune in',
    },
    player: {
      live: 'Live',
      paused: 'Paused',
      liveBadge: 'LIVE',
      prevAria: 'Previous station',
      prevTitle: 'Previous station (←)',
      nextAria: 'Next station',
      nextTitle: 'Next station (→)',
      playAria: 'Play',
      pauseAria: 'Pause',
      playPauseTitle: 'Play / Pause (Space)',
      randomAria: 'Random station',
      randomTitle: 'Random station (R)',
      fmStaticTitle: 'FM tuning static burst when switching stations',
      muteAria: 'Mute',
      unmuteAria: 'Unmute',
      muteTitle: 'Mute (M)',
      volumeAria: 'Volume',
    },
    audioError:
      'Could not load audio for this station. Locally make sure MP3 files are in local-audio/, and on Vercel configure VITE_AUDIO_BASE_URL.',
  },
} as const;
